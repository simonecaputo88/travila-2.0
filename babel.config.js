// babel.config.js (root del monorepo)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Mantienili come stringhe semplici, senza oggetti di opzioni
      require.resolve('expo-router/babel'),
      'nativewind/babel',
      // Se in futuro userai reanimated, deve stare SEMPRE per ultimo:
      // 'react-native-reanimated/plugin',
    ],
  };
};
