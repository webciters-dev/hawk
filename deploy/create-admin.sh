#!/usr/bin/env bash
set -euo pipefail

###############################################################
# Create or re-create an admin user on the self-hosted stack.
#
# Usage:
#   cd deploy
#   ./create-admin.sh
###############################################################

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/.env"

read -rp "Admin email: " ADMIN_EMAIL
read -rsp "Admin password: " ADMIN_PASSWORD
echo ""

echo "→ Creating user via auth API..."
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
  exit 1
fi

echo "✔  User created: $ADMIN_USER_ID"

echo "→ Assigning admin role..."
docker compose exec -T db psql -U postgres -d "${POSTGRES_DB:-postgres}" \
  -c "INSERT INTO public.user_roles (user_id, role) VALUES ('${ADMIN_USER_ID}', 'admin') ON CONFLICT DO NOTHING;"

echo "✔  Admin role assigned. You can now sign in at /admin/login"
