#!/usr/bin/env bash
# Valida pré-requisitos pós-login (Firebase + Supabase).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FIREBASE_PROJECT="${FIREBASE_PROJECT_ID:-orbita-fiap}"

cd "$ROOT_DIR"

echo "==> Validando setup de auth Orbita"
echo ""

echo "[1] Firebase apps"
firebase apps:list --project "$FIREBASE_PROJECT" 2>/dev/null || echo "⚠️  firebase CLI não autenticado"

echo ""
echo "[2] Cloud Function processSignUp"
firebase functions:list --project "$FIREBASE_PROJECT" 2>/dev/null | grep -i processSignUp || echo "⚠️  Function não listada"

echo ""
echo "[3] Variáveis .env"
for key in EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID EXPO_PUBLIC_SUPABASE_URL; do
  if grep -q "^${key}=" "$ROOT_DIR/.env" 2>/dev/null && ! grep -q "^${key}=$" "$ROOT_DIR/.env"; then
    echo "  ✓ $key"
  else
    echo "  ✗ $key (faltando)"
  fi
done

echo ""
echo "[4] GoogleService-Info.plist"
if [ -f "$ROOT_DIR/GoogleService-Info.plist" ] && [ -f "$ROOT_DIR/ios/Orbita/GoogleService-Info.plist" ]; then
  echo "  ✓ presente na raiz e em ios/Orbita/"
else
  echo "  ✗ faltando"
fi

echo ""
echo "[5] iosUrlScheme (app.json)"
grep -A2 "iosUrlScheme" "$ROOT_DIR/app.json" || true

echo ""
echo "Após login no simulador, verifique manualmente:"
echo "  - Firebase Console → Authentication → Users"
echo "  - Supabase Dashboard → Table Editor → profiles"
echo ""
echo "Se profile não criar, rode:"
echo "  node firebase/scripts/set-role-claims.js"
