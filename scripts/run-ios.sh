#!/usr/bin/env bash
# Build e run no simulador iOS.
# Uso: npm run ios
# O script sobe Metro (se não estiver rodando) + builda + instala + abre.
set -euo pipefail

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SIMCTL="/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl"
EXPO_BIN="$ROOT_DIR/node_modules/.bin/expo"
DEVICE_NAME="${IOS_DEVICE:-iPhone 16}"
BUNDLE_ID="com.orbita.fiap"
APP_PATH="$ROOT_DIR/ios/build/Build/Products/Debug-iphonesimulator/Orbita.app"
METRO_PORT="${METRO_PORT:-8081}"

if [ ! -x "$SIMCTL" ]; then
  echo "simctl nao encontrado. Rode: sudo xcode-select -s /Applications/Xcode.app"
  exit 1
fi

export PATH="$ROOT_DIR/scripts/bin:$(dirname "$SIMCTL"):/opt/homebrew/bin:/usr/local/bin:$PATH"
mkdir -p "$ROOT_DIR/scripts/bin"
ln -sf "$SIMCTL" "$ROOT_DIR/scripts/bin/simctl"

cd "$ROOT_DIR"

metro_ready() {
  curl -sf "http://127.0.0.1:${METRO_PORT}/status" >/dev/null 2>&1
}

ensure_metro() {
  if metro_ready; then
    return
  fi
  echo "Iniciando Metro na porta ${METRO_PORT}..."
  "$EXPO_BIN" start --dev-client --host lan --port "$METRO_PORT" >/tmp/orbita-metro.log 2>&1 &
  for _ in $(seq 1 30); do
    if metro_ready; then
      echo "Metro pronto."
      return
    fi
    sleep 0.5
  done
  echo "Metro nao subiu a tempo. Veja /tmp/orbita-metro.log"
  exit 1
}

# Plano A: expo run:ios (funciona se xcode-select aponta pro Xcode correto)
if "$EXPO_BIN" run:ios -d "$DEVICE_NAME" "$@" 2>/dev/null; then
  exit 0
fi

# Plano B: xcodebuild manual + simctl
echo "expo run:ios falhou (Xcode 26 / xcode-select). Usando xcodebuild + simctl..."
ensure_metro

UDID=$("$SIMCTL" list devices available | grep "$DEVICE_NAME (" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/')
if [ -z "$UDID" ]; then
  echo "Simulador '$DEVICE_NAME' nao encontrado."
  "$SIMCTL" list devices available
  exit 1
fi

"$SIMCTL" boot "$UDID" 2>/dev/null || true
open -a Simulator

cd "$ROOT_DIR/ios"
xcodebuild \
  -workspace Orbita.xcworkspace \
  -scheme Orbita \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination "id=$UDID" \
  -derivedDataPath build \
  | tee /tmp/orbita-ios-build.log | tail -20

cd "$ROOT_DIR"

if [ ! -d "$APP_PATH" ]; then
  echo "Build falhou — Orbita.app nao encontrado."
  exit 1
fi

echo "Instalando no simulador..."
"$SIMCTL" install "$UDID" "$APP_PATH"
"$SIMCTL" launch "$UDID" "$BUNDLE_ID"

sleep 2
METRO_URL="http%3A%2F%2F127.0.0.1%3A${METRO_PORT}"
"$SIMCTL" openurl "$UDID" "orbita://expo-development-client/?url=${METRO_URL}" 2>/dev/null || true

echo "App rodando no simulador."
