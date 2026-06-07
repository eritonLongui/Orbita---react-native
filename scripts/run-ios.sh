#!/usr/bin/env bash
# Build e run no simulador iOS (workaround Xcode 26 sem simctl no xcrun padrão).
set -euo pipefail

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
export DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
SIMCTL="/Library/Developer/PrivateFrameworks/CoreSimulator.framework/Versions/A/Resources/bin/simctl"
DEVICE_NAME="${IOS_DEVICE:-iPhone 16}"
BUNDLE_ID="com.orbita.fiap"
APP_PATH="$ROOT_DIR/ios/build/Build/Products/Debug-iphonesimulator/Orbita.app"

if [ ! -x "$SIMCTL" ]; then
  echo "❌ simctl não encontrado. Rode: sudo xcode-select --reset && abra o Xcode."
  exit 1
fi

export PATH="$ROOT_DIR/scripts/bin:$(dirname "$SIMCTL"):/opt/homebrew/bin:/usr/local/bin:$PATH"
mkdir -p "$ROOT_DIR/scripts/bin"
ln -sf "$SIMCTL" "$ROOT_DIR/scripts/bin/simctl"

cd "$ROOT_DIR"

# Tenta expo run:ios primeiro (funciona quando xcrun encontra simctl).
if "$ROOT_DIR/node_modules/.bin/expo" run:ios -d "$DEVICE_NAME" "$@" 2>/dev/null; then
  exit 0
fi

echo "⚠️  expo run:ios falhou (Xcode 26). Usando xcodebuild + simctl..."

UDID=$("$SIMCTL" list devices available | grep "$DEVICE_NAME (" | head -1 | sed -E 's/.*\(([A-F0-9-]+)\).*/\1/')
if [ -z "$UDID" ]; then
  echo "❌ Simulador '$DEVICE_NAME' não encontrado."
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
  echo "❌ Build falhou — Orbita.app não encontrado."
  exit 1
fi

echo "✅ Instalando no simulador $DEVICE_NAME ($UDID)..."
"$SIMCTL" install "$UDID" "$APP_PATH"
"$SIMCTL" launch "$UDID" "$BUNDLE_ID"

echo "▶️  Inicie o Metro em outro terminal: npm start"
echo "✅ App lançado no simulador."
