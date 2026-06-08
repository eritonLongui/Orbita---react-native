#!/usr/bin/env bash
# Setup automático do Orbita — instala, valida e opcionalmente roda prebuild.
#
# Uso:
#   bash scripts/setup.sh              # install + validações
#   bash scripts/setup.sh --ios        # + prebuild iOS
#   bash scripts/setup.sh --android    # + prebuild Android
#   bash scripts/setup.sh --all        # + prebuild ambos
#   bash scripts/setup.sh --check-only # só valida, sem npm install
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

PREBUILD_IOS=false
PREBUILD_ANDROID=false
CHECK_ONLY=false

for arg in "$@"; do
  case "$arg" in
    --ios) PREBUILD_IOS=true ;;
    --android) PREBUILD_ANDROID=true ;;
    --all) PREBUILD_IOS=true; PREBUILD_ANDROID=true ;;
    --check-only) CHECK_ONLY=true ;;
    -h|--help)
      echo "Uso: bash scripts/setup.sh [--ios] [--android] [--all] [--check-only]"
      exit 0
      ;;
    *)
      echo "Flag desconhecida: $arg"
      exit 1
      ;;
  esac
done

export PATH="$ROOT_DIR/node_modules/.bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

EXPO="$ROOT_DIR/node_modules/.bin/expo"
WARNINGS=0

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; exit 1; }
warn() { echo "  ⚠ $1"; WARNINGS=$((WARNINGS + 1)); }

echo "==> Orbita — setup"
echo ""

# --- Pré-requisitos ---
echo "[1/6] Pré-requisitos"

if ! command -v node >/dev/null 2>&1; then
  fail "Node.js não encontrado. Instale Node 20+: https://nodejs.org"
fi

NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]")
if [ "$NODE_MAJOR" -lt 20 ]; then
  warn "Node $NODE_MAJOR detectado — recomendado Node 20+"
else
  pass "Node $(node -v)"
fi

if ! command -v npm >/dev/null 2>&1; then
  fail "npm não encontrado no PATH"
fi
pass "npm $(npm -v)"

if [ "$PREBUILD_IOS" = true ] || [ "$PREBUILD_ANDROID" = true ]; then
  if [ "$(uname -s)" = "Darwin" ] && [ ! -d "/Applications/Xcode.app" ]; then
    warn "Xcode não encontrado — prebuild iOS pode falhar"
  fi
fi

echo ""

# --- Arquivos obrigatórios ---
echo "[2/6] Arquivos do projeto"

for file in google-services.json GoogleService-Info.plist src/config/publicEnv.ts app.json; do
  if [ -f "$ROOT_DIR/$file" ]; then
    pass "$file"
  else
    fail "$file ausente — necessário para o app funcionar"
  fi
done

if ! grep -q '"googleServicesFile"' "$ROOT_DIR/app.json"; then
  warn "app.json sem googleServicesFile configurado"
fi

echo ""

# --- Instalação ---
if [ "$CHECK_ONLY" = true ]; then
  echo "[3/6] Dependências — pulado (--check-only)"
else
  echo "[3/6] Instalando dependências (npm install)..."
  npm install
  pass "node_modules instalado"
fi

echo ""

# --- Ferramentas locais ---
echo "[4/6] Ferramentas locais"

if [ -x "$EXPO" ]; then
  pass "expo CLI local"
else
  fail "expo não encontrado em node_modules — rode npm install"
fi

if [ -x "$ROOT_DIR/node_modules/.bin/eas" ]; then
  pass "eas CLI local"
else
  warn "eas-cli não instalado — builds EAS indisponíveis até npm install"
fi

echo ""

# --- Supabase na nuvem ---
echo "[5/6] Backend Supabase"
if bash "$ROOT_DIR/scripts/validate-supabase.sh"; then
  pass "Supabase validado"
else
  warn "validate:supabase falhou — Lyra pode estar indisponível"
fi

echo ""

# --- Prebuild opcional ---
echo "[6/6] Prebuild nativo"

if [ "$PREBUILD_IOS" = false ] && [ "$PREBUILD_ANDROID" = false ]; then
  echo "  (pulado — use --ios, --android ou --all)"
else
  if [ "$PREBUILD_IOS" = true ]; then
    echo "  → iOS..."
    "$EXPO" prebuild --platform ios
    pass "prebuild iOS"
  fi
  if [ "$PREBUILD_ANDROID" = true ]; then
    echo "  → Android..."
    "$EXPO" prebuild --platform android
    pass "prebuild Android"
  fi
fi

echo ""
echo "=========================================="
echo " Setup concluído"
if [ "$WARNINGS" -gt 0 ]; then
  echo " ($WARNINGS aviso(s))"
fi
echo "=========================================="
echo ""

if [ "$PREBUILD_IOS" = true ]; then
  echo "Rodar iOS:"
  echo "  npm start          # terminal 1"
  echo "  npm run ios        # terminal 2"
  echo ""
fi

if [ "$PREBUILD_ANDROID" = true ]; then
  echo "Rodar Android:"
  echo "  npm start          # terminal 1"
  echo "  npm run android    # terminal 2"
  echo ""
fi

if [ "$PREBUILD_IOS" = false ] && [ "$PREBUILD_ANDROID" = false ]; then
  echo "Próximo passo (dev):"
  echo "  npm run setup:ios       # ou setup:android — primeira vez"
  echo "  npm start && npm run ios"
  echo ""
fi

echo "Só testar (sem clonar):"
echo "  https://expo.dev/accounts/marcomendessv/projects/Orbita/builds"
echo ""
echo "Docs: README.md · docs/GOOGLE_LOGIN.md · docs/PRODUCTION.md"
