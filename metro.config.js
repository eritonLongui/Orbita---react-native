const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin');

const maskedViewStub = path.resolve(__dirname, 'src/shims/MaskedViewStub.tsx');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = false;

const tamaguiConfig = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
});

const defaultResolveRequest = tamaguiConfig.resolver.resolveRequest;

tamaguiConfig.resolver.resolveRequest = (context, moduleName, platform) => {
  if (
    moduleName === '@react-native-masked-view/masked-view' ||
    moduleName.startsWith('@react-native-masked-view/masked-view/')
  ) {
    return {
      filePath: maskedViewStub,
      type: 'sourceFile',
    };
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

module.exports = tamaguiConfig;
