#!/usr/bin/env bash
# Imprime SHA-1/SHA-256 para cadastrar no Firebase (login Google no Android).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

echo "=========================================="
echo " Orbita — fingerprints para Firebase"
echo "=========================================="
echo ""
echo "Cadastre no Firebase Console:"
echo "  Project Settings → Your apps → Android (com.orbita.fiap)"
echo "  → Add fingerprint"
echo ""
echo "Cada máquina de desenvolvimento tem SHA-1 diferente no debug."
echo "Sem isso, o login Google no Android retorna DEVELOPER_ERROR."
echo ""

print_keystore() {
  local label="$1"
  local keystore="$2"
  local pass="${3:-android}"

  if [ ! -f "$keystore" ]; then
    echo "[$label] keystore não encontrado: $keystore"
    return
  fi

  echo "[$label] $keystore"
  keytool -list -v -keystore "$keystore" -alias androiddebugkey -storepass "$pass" -keypass "$pass" 2>/dev/null \
    | grep -E 'SHA1:|SHA256:' \
    | sed 's/^/  /' || echo "  (falha ao ler — verifique Java/keytool no PATH)"
  echo ""
}

print_keystore "Debug padrão (~/.android/debug.keystore)" "$HOME/.android/debug.keystore"

if [ -d "$ROOT_DIR/android" ]; then
  print_keystore "Debug do projeto" "$ROOT_DIR/android/app/debug.keystore"
  echo "[Gradle signingReport]"
  if [ -f "$ROOT_DIR/android/gradlew" ]; then
    (cd "$ROOT_DIR/android" && ./gradlew signingReport 2>/dev/null | grep -E 'SHA1:|SHA-256:' | head -20) || true
  fi
  echo ""
fi

echo "iOS (simulador/dispositivo com dev build):"
echo "  Não usa SHA-1. Use GoogleService-Info.plist + npm run ios:prebuild"
echo ""
echo "Depois de adicionar os SHA-1 no Firebase, baixe o novo google-services.json"
echo "e coloque na raiz do projeto (veja docs/GOOGLE_LOGIN.md)."
