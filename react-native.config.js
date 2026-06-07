/** Impede link nativo do MaskedView (evita RNCMaskedView duplicado). */
module.exports = {
  dependencies: {
    '@react-native-masked-view/masked-view': {
      platforms: {
        ios: null,
        android: null,
      },
    },
  },
};
