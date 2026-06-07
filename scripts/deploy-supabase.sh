#!/usr/bin/env bash
# Deploy Supabase: migrations + Edge Function lyra-chat
#
# Uso:
#   export SUPABASE_ACCESS_TOKEN="sbp_..."   # https://supabase.com/dashboard/account/tokens
#   export OPENAI_API_KEY="sk-..."           # opcional: configura secret da function
#   bash scripts/deploy-supabase.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

REF="${SUPABASE_PROJECT_REF:-yifgbmrpnpljjrmjwwfq}"

if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "❌ Defina SUPABASE_ACCESS_TOKEN em .env ou no shell (conta dona do projeto $REF)"
  echo "   https://supabase.com/dashboard/account/tokens"
  exit 1
fi

export SUPABASE_ACCESS_TOKEN

cd "$ROOT_DIR"

echo "==> [1/4] Linkando projeto $REF..."
supabase link --project-ref "$REF" --yes

echo "==> [2/4] Aplicando migrations..."
supabase db push --yes

echo "==> [3/4] Deploy Edge Function lyra-chat..."
supabase functions deploy lyra-chat --project-ref "$REF" --no-verify-jwt

if [ -n "${OPENAI_API_KEY:-}" ]; then
  echo "==> [4/4] Configurando secret OPENAI_API_KEY..."
  supabase secrets set OPENAI_API_KEY="$OPENAI_API_KEY" --project-ref "$REF"
else
  echo "==> [4/4] OPENAI_API_KEY não definido no shell."
  echo "    Configure no Dashboard: Project Settings → Edge Functions → Secrets"
  echo "    Ou: export OPENAI_API_KEY=sk-... && bash scripts/deploy-supabase.sh"
fi

echo ""
echo "✅ Deploy Supabase concluído!"
echo "   URL: https://${REF}.supabase.co/functions/v1/lyra-chat"
