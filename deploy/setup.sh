#!/usr/bin/env bash
set -euo pipefail

###############################################################
# Hawk Vision Strategies – Self-Hosted Deployment Script
#
# Prerequisites (install on VPS first):
#   - Docker + Docker Compose v2
#   - Node.js 18+ (or Bun)
#   - Nginx
#   - (optional) Certbot for SSL
#
# Usage:
#   cd deploy
#   chmod +x setup.sh
#   ./setup.sh
###############################################################

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DEPLOY_DIR="$SCRIPT_DIR"

echo "═══════════════════════════════════════════════════"
echo "  Hawk Vision Strategies – Self-Hosted Setup"
echo "═══════════════════════════════════════════════════"
echo ""

# ── Step 1: Generate JWT keys if .env doesn't exist ──────────
if [ ! -f "$DEPLOY_DIR/.env" ]; then
  echo "→ Generating JWT keys..."
  node "$DEPLOY_DIR/generate-keys.mjs"
  echo ""
  echo "⚠  IMPORTANT: Edit deploy/.env now and set:"
  echo "   - POSTGRES_PASSWORD"
  echo "   - POSTGRES_PASSWORD_URLENCODED"
  echo "   - SITE_URL  (your domain, e.g. https://hawk.example.com)"
  echo "   - API_EXTERNAL_URL  (same domain or http://localhost:8000)"
  echo ""
  echo "   Then re-run this script."
  exit 0
fi

# ── Validate .env ────────────────────────────────────────────
source "$DEPLOY_DIR/.env"

if [ "${POSTGRES_PASSWORD:-}" = "CHANGE_ME" ]; then
  echo "✖  POSTGRES_PASSWORD is still set to CHANGE_ME."
  echo "   Edit deploy/.env first, then re-run."
  exit 1
fi

echo "✔  .env loaded"

# ── Step 2: Generate Kong config from template ───────────────
echo "→ Generating Kong config..."
KONG_TEMPLATE="$DEPLOY_DIR/volumes/api/kong.yml.template"
KONG_OUTPUT="$DEPLOY_DIR/volumes/api/kong.yml"

sed \
  -e "s|__ANON_KEY__|${ANON_KEY}|g" \
  -e "s|__SERVICE_ROLE_KEY__|${SERVICE_ROLE_KEY}|g" \
  "$KONG_TEMPLATE" > "$KONG_OUTPUT"

echo "✔  volumes/api/kong.yml generated"

# ── Step 3: Start Docker Compose stack ───────────────────────
echo "→ Starting Supabase stack..."
cd "$DEPLOY_DIR"
docker compose up -d

echo "→ Waiting for database to be healthy..."
for i in $(seq 1 30); do
  if docker compose exec -T db pg_isready -U postgres -h localhost > /dev/null 2>&1; then
    echo "✔  Database is ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "✖  Database did not become ready in time"
    exit 1
  fi
  sleep 2
done

# Wait a few more seconds for auth/rest services to initialize
echo "→ Waiting for services to initialize..."
sleep 10

# ── Step 4: Run migrations ───────────────────────────────────
echo "→ Applying database migrations..."
docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" < "$DEPLOY_DIR/migrations.sql"
echo "✔  Migrations applied"

# ── Step 5: Create admin user ────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  Create Admin User"
echo "═══════════════════════════════════════════════════"
echo ""

read -rp "Admin email: " ADMIN_EMAIL
read -rsp "Admin password: " ADMIN_PASSWORD
echo ""

# Create user via GoTrue (auth) API
SIGNUP_RESPONSE=$(curl -s -X POST "http://localhost:${API_PORT:-8000}/auth/v1/admin/users" \
  -H "apikey: ${SERVICE_ROLE_KEY}" \
  -H "Authorization: Bearer ${SERVICE_ROLE_KEY}" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\",
    \"email_confirm\": true
  }")

ADMIN_USER_ID=$(echo "$SIGNUP_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$ADMIN_USER_ID" ]; then
  echo "⚠  Could not extract user ID. Response:"
  echo "$SIGNUP_RESPONSE"
  echo ""
  echo "   You may need to create the admin user manually."
else
  echo "✔  User created: $ADMIN_USER_ID"

  # Assign admin role
  docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" \
    -c "INSERT INTO public.user_roles (user_id, role) VALUES ('${ADMIN_USER_ID}', 'admin') ON CONFLICT DO NOTHING;"
  echo "✔  Admin role assigned"
fi

# ── Step 6: Build frontend ───────────────────────────────────
echo ""
echo "→ Building frontend..."
cd "$PROJECT_DIR"

# Determine the Supabase URL for the frontend
# In a single-domain nginx setup, this is the same as the site URL
VITE_SUPABASE_URL="${SITE_URL}"
VITE_SUPABASE_PUBLISHABLE_KEY="${ANON_KEY}"

VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  VITE_SUPABASE_PUBLISHABLE_KEY="$VITE_SUPABASE_PUBLISHABLE_KEY" \
  npm run build

echo "✔  Frontend built → dist/"

# ── Step 7: Deploy to nginx ──────────────────────────────────
echo "→ Deploying to /var/www/hawk/..."
sudo mkdir -p /var/www/hawk
sudo cp -r "$PROJECT_DIR/dist/"* /var/www/hawk/
echo "✔  Frontend deployed"

if [ ! -f /etc/nginx/sites-available/hawk ]; then
  echo "→ Installing nginx config..."
  sudo cp "$DEPLOY_DIR/nginx.conf" /etc/nginx/sites-available/hawk
  sudo ln -sf /etc/nginx/sites-available/hawk /etc/nginx/sites-enabled/hawk
  sudo nginx -t && sudo systemctl reload nginx
  echo "✔  Nginx configured and reloaded"
else
  echo "ℹ  Nginx config already exists at /etc/nginx/sites-available/hawk"
  echo "   Updating frontend files only. Reload manually if needed:"
  echo "   sudo nginx -t && sudo systemctl reload nginx"
fi

# ── Done ─────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✔  Deployment complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "  Frontend:  ${SITE_URL}"
echo "  Admin:     ${SITE_URL}/admin/login"
echo "  API:       http://localhost:${API_PORT:-8000}"
echo ""
echo "  Next steps:"
echo "  1. Point your domain DNS to this server's IP"
echo "  2. Update SITE_URL and API_EXTERNAL_URL in deploy/.env"
echo "  3. Add SSL: sudo certbot --nginx -d your-domain.com"
echo "  4. Sign in at /admin/login with the admin credentials above"
echo ""
