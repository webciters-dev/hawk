#!/usr/bin/env node
/**
 * Generates JWT_SECRET, ANON_KEY and SERVICE_ROLE_KEY for the self-hosted
 * Supabase stack, then writes (or merges into) deploy/.env.
 *
 * Usage:
 *   node deploy/generate-keys.mjs
 *
 * If deploy/.env already has a JWT_SECRET it will be reused so existing
 * sessions are not invalidated.
 */

import { randomBytes, createHmac } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH = resolve(__dirname, ".env");

/* ── helpers ─────────────────────────────────────────────────── */

/** Base64url encode (no padding) */
const b64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** Create a HS256-signed JWT */
function signJwt(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const segments = [b64url(JSON.stringify(header)), b64url(JSON.stringify(payload))];
  const signingInput = segments.join(".");
  const signature = createHmac("sha256", secret).update(signingInput).digest("base64url");
  return `${signingInput}.${signature}`;
}

/* ── read existing .env (if any) ─────────────────────────────── */

let existing = {};
if (existsSync(ENV_PATH)) {
  readFileSync(ENV_PATH, "utf-8")
    .split("\n")
    .forEach((line) => {
      const m = line.match(/^([A-Z_]+)=(.*)$/);
      if (m) existing[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
    });
}

/* ── generate values ─────────────────────────────────────────── */

const JWT_SECRET = existing.JWT_SECRET || randomBytes(32).toString("hex");

const iat = Math.floor(Date.now() / 1000);
const exp = iat + 10 * 365 * 24 * 60 * 60; // 10 years

const ANON_KEY =
  existing.ANON_KEY ||
  signJwt({ role: "anon", iss: "supabase", iat, exp }, JWT_SECRET);

const SERVICE_ROLE_KEY =
  existing.SERVICE_ROLE_KEY ||
  signJwt({ role: "service_role", iss: "supabase", iat, exp }, JWT_SECRET);

/* ── write .env ──────────────────────────────────────────────── */

const POSTGRES_PASSWORD = existing.POSTGRES_PASSWORD || "CHANGE_ME";
const POSTGRES_PASSWORD_URLENCODED =
  existing.POSTGRES_PASSWORD_URLENCODED ||
  encodeURIComponent(POSTGRES_PASSWORD);

const envContent = `
############################################################
# Hawk Vision – Self-hosted Supabase environment
# Generated on ${new Date().toISOString()}
############################################################

# ── PostgreSQL ────────────────────────────────────────────
POSTGRES_PASSWORD='${existing.POSTGRES_PASSWORD || "CHANGE_ME"}'
POSTGRES_PASSWORD_URLENCODED='${existing.POSTGRES_PASSWORD_URLENCODED || encodeURIComponent(existing.POSTGRES_PASSWORD || "CHANGE_ME")}'
POSTGRES_DB=postgres
POSTGRES_PORT=5432

# ── JWT / Auth keys ──────────────────────────────────────
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRY=3600
ANON_KEY=${ANON_KEY}
SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}

# ── URLs ─────────────────────────────────────────────────
# Replace with your actual domain / IP
SITE_URL=http://localhost:3000
API_EXTERNAL_URL=http://localhost:8000

# ── Kong API gateway ports ───────────────────────────────
API_PORT=8000
API_SSL_PORT=8443

# ── Signup ───────────────────────────────────────────────
DISABLE_SIGNUP=true
ENABLE_EMAIL_AUTOCONFIRM=true

# ── SMTP (optional – needed for email verification) ──────
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_ADMIN_EMAIL=admin@example.com
ADDITIONAL_REDIRECT_URLS=
`.trimStart();

writeFileSync(ENV_PATH, envContent, "utf-8");

console.log("✔  deploy/.env written");
console.log("");
console.log("   JWT_SECRET        =", JWT_SECRET.slice(0, 12) + "…");
console.log("   ANON_KEY          =", ANON_KEY.slice(0, 24) + "…");
console.log("   SERVICE_ROLE_KEY  =", SERVICE_ROLE_KEY.slice(0, 24) + "…");
console.log("");
console.log("⚠  IMPORTANT: Open deploy/.env and set POSTGRES_PASSWORD,");
console.log("   POSTGRES_PASSWORD_URLENCODED, SITE_URL, and API_EXTERNAL_URL");
console.log("   before running docker compose up.");
