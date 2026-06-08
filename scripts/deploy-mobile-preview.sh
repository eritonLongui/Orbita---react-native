#!/usr/bin/env bash
# Build de preview (EAS) — app instalável com login Google para qualquer testador.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "==> Orbita — deploy mobile (preview)"
echo ""

if [ ! -f "$ROOT_DIR/google-services.json" ]; then
  echo "❌ google-services.json não encontrado na raiz do projeto."
  exit 1
fi

if [ ! -f "$ROOT_DIR/GoogleService-Info.plist" ]; then
  echo "❌ GoogleService-Info.plist não encontrado."
  exit 1
fi

EAS="$ROOT_DIR/node_modules/.bin/eas"

if ! "$EAS" whoami >/dev/null 2>&1; then
  echo "1) Faça login na Expo (abre o browser):"
  echo "   npx eas login"
  echo ""
  read -r -p "Pressione Enter depois do login..."
fi

echo "✓ Logado como: $("$EAS" whoami 2>/dev/null | tail -1)"
echo ""

if ! grep -q '"projectId"' "$ROOT_DIR/app.json" 2>/dev/null; then
  echo "2) Vinculando projeto Expo (só na primeira vez)..."
  "$EAS" init
  echo ""
fi

PLATFORM="${1:-all}"
PROFILE="${EAS_PROFILE:-preview}"

case "$PLATFORM" in
  ios)
    echo "3) Build iOS ($PROFILE)..."
    "$EAS" build --platform ios --profile "$PROFILE"
    ;;
  android)
    echo "3) Build Android ($PROFILE)..."
    "$EAS" build --platform android --profile "$PROFILE"
    ;;
  all)
    echo "3) Build Android ($PROFILE)..."
    "$EAS" build --platform android --profile "$PROFILE"
    echo ""
    echo "4) Build iOS ($PROFILE)..."
    "$EAS" build --platform ios --profile "$PROFILE"
    ;;
  *)
    echo "Uso: bash scripts/deploy-mobile-preview.sh [ios|android|all]"
    exit 1
    ;;
esac

echo ""
echo "==> Próximo passo (Android — login Google)"
echo "   npx eas credentials -p android"
echo "   Copie o SHA-1 e cadastre no Firebase → Project Settings → Android → Add fingerprint"
echo "   Baixe o google-services.json atualizado se o Firebase pedir."
echo ""
echo "   Testadores instalam pelo link que o EAS exibe ao final do build."
