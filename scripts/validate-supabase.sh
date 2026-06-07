#!/usr/bin/env bash
# Valida conectividade e deploy básico do Supabase (sem precisar de .env local).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

# Lê defaults commitados (mesmo que o app usa)
SUPABASE_URL="${EXPO_PUBLIC_SUPABASE_URL:-https://yifgbmrpnpljjrmjwwfq.supabase.co}"
ANON_KEY="${EXPO_PUBLIC_SUPABASE_ANON_KEY:-sb_publishable_IvRXj33P9hLrpR2Dr7Btmw_BP98I1C5}"
FUNCTION_URL="${SUPABASE_URL}/functions/v1/lyra-chat"
REST_URL="${SUPABASE_URL}/rest/v1/"

echo "==> Validando Supabase Orbita"
echo "    URL: $SUPABASE_URL"
echo ""

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; }
warn() { echo "  ⚠ $1"; }

echo "[1] API REST (anon key)"
REST_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$REST_URL" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" || echo "000")
if [ "$REST_CODE" = "200" ] || [ "$REST_CODE" = "401" ] || [ "$REST_CODE" = "404" ]; then
  pass "REST responde (HTTP $REST_CODE)"
else
  fail "REST inacessível (HTTP $REST_CODE)"
fi

echo ""
echo "[2] Edge Function lyra-chat (OPTIONS)"
OPT_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS "$FUNCTION_URL" \
  -H "apikey: $ANON_KEY" || echo "000")
if [ "$OPT_CODE" = "200" ] || [ "$OPT_CODE" = "204" ]; then
  pass "lyra-chat deployada (OPTIONS HTTP $OPT_CODE)"
else
  fail "lyra-chat não encontrada ou offline (OPTIONS HTTP $OPT_CODE)"
  echo "    Rode: npm run deploy:supabase (com SUPABASE_ACCESS_TOKEN no .env local)"
fi

echo ""
echo "[3] lyra-chat sem login (deve recusar 401)"
BODY=$(curl -s -w "\n%{http_code}" -X POST "$FUNCTION_URL" \
  -H "apikey: $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text":"teste"}' || echo -e "\n000")
HTTP_CODE=$(echo "$BODY" | tail -n1)
RESP=$(echo "$BODY" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  pass "exige autenticação (401) — esperado"
elif echo "$RESP" | grep -q "OPENAI_API_KEY não configurada"; then
  fail "OPENAI_API_KEY não está nos Secrets do Supabase"
  echo "    Dashboard → Edge Functions → Secrets, ou npm run deploy:supabase"
elif [ "$HTTP_CODE" = "404" ]; then
  fail "function não deployada (404)"
else
  warn "resposta inesperada HTTP $HTTP_CODE: $RESP"
fi

echo ""
echo "[4] Tabelas (schema público)"
PROFILES_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "${REST_URL}profiles?select=id&limit=1" \
  -H "apikey: $ANON_KEY" \
  -H "Authorization: Bearer $ANON_KEY" || echo "000")
if [ "$PROFILES_CODE" = "200" ] || [ "$PROFILES_CODE" = "401" ] || [ "$PROFILES_CODE" = "403" ]; then
  pass "tabela profiles existe (HTTP $PROFILES_CODE — RLS pode bloquear sem login)"
else
  fail "tabela profiles (HTTP $PROFILES_CODE) — migrations aplicadas?"
fi

echo ""
echo "==> Resumo"
echo "• App mobile: só precisa de publicEnv.ts — sem .env para rodar/buildar"
echo "• Lyra com voz/texto: OPENAI fica no Supabase Secrets (você configura no deploy)"
echo "• Deploy: só quem publica precisa de SUPABASE_ACCESS_TOKEN no .env local (gitignored)"
echo ""
echo "Teste manual com usuário logado: abra Lyra e envie uma mensagem."
