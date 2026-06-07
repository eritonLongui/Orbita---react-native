#!/usr/bin/env bash
# Alternativa: rodar migration via Management API (sem supabase link)
# Uso: SUPABASE_ACCESS_TOKEN=sbp_... bash scripts/setup-supabase-api.sh

set -euo pipefail

REF="${SUPABASE_PROJECT_REF:-yifgbmrpnpljjrmjwwfq}"
TOKEN="${SUPABASE_ACCESS_TOKEN:?Defina SUPABASE_ACCESS_TOKEN}"
SQL_FILE="$(cd "$(dirname "$0")/.." && pwd)/supabase/migrations/001_initial_schema.sql"

echo "==> Executando migration via Management API..."

# Escapa SQL para JSON
SQL=$(cat "$SQL_FILE" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')

curl -sS -X POST "https://api.supabase.com/v1/projects/${REF}/database/query" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"query\": ${SQL}}" | python3 -m json.tool

echo ""
echo "==> Habilitando Firebase Third-Party Auth via config push..."
echo "    (requer supabase link + config.toml já configurado)"
