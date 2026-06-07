#!/usr/bin/env bash
# Setup Orbita infra via CLI (Supabase + Firebase)
# Uso:
#   1. export SUPABASE_ACCESS_TOKEN="sbp_..."  # https://supabase.com/dashboard/account/tokens
#   2. firebase login   (uma vez, interativo)
#   3. bash scripts/setup-infra.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SUPABASE_PROJECT_REF="${SUPABASE_PROJECT_REF:-yifgbmrpnpljjrmjwwfq}"
FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID:-orbita-fiap}"

echo "==> Orbita infra setup"
echo "    Supabase ref: $SUPABASE_PROJECT_REF"
echo "    Firebase id:  $FIREBASE_PROJECT_ID"
echo ""

# --- Supabase ---
if [ -z "${SUPABASE_ACCESS_TOKEN:-}" ]; then
  echo "⚠️  SUPABASE_ACCESS_TOKEN não definido."
  echo "    Gere em: https://supabase.com/dashboard/account/tokens"
  echo "    Depois: export SUPABASE_ACCESS_TOKEN=\"sbp_...\""
  echo ""
  echo "    Ou rode: supabase login"
  if ! supabase projects list 2>/dev/null | grep -q "$SUPABASE_PROJECT_REF"; then
    echo "❌ Conta Supabase atual não tem acesso ao projeto $SUPABASE_PROJECT_REF"
    exit 1
  fi
else
  export SUPABASE_ACCESS_TOKEN
fi

cd "$ROOT_DIR"

echo "==> [1/4] Linkando projeto Supabase..."
supabase link --project-ref "$SUPABASE_PROJECT_REF" --yes

echo "==> [2/4] Enviando config (Firebase Third-Party Auth)..."
supabase config push --yes

echo "==> [3/4] Aplicando migrations no banco..."
supabase db push --yes

# --- Firebase Functions ---
echo "==> [4/4] Deploy Firebase Cloud Function (role: authenticated)..."
if ! firebase projects:list 2>/dev/null | grep -q "$FIREBASE_PROJECT_ID"; then
  echo "⚠️  Firebase CLI não autenticado. Rode: firebase login"
  echo "    Depois execute novamente este script."
  exit 1
fi

cd "$ROOT_DIR/firebase/functions"
npm install --silent
cd "$ROOT_DIR/firebase"
firebase deploy --only functions --project "$FIREBASE_PROJECT_ID"

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos (se já tinha usuários antes do deploy):"
echo "  1. Baixe service-account.json no Firebase Console"
echo "  2. Salve em firebase/service-account.json"
echo "  3. node firebase/scripts/set-role-claims.js"
echo ""
echo "O que NÃO dá via CLI (só no browser, uma vez):"
echo "  - Ativar plano Blaze no Firebase (necessário para Functions)"
