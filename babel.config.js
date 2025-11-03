module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // (opzionale) se non usi alias, puoi togliere anche questo blocco
      ["module-resolver", {
        root: ["./"],
        alias: {
          "@": "./apps/travila",
        },
      }],
    ],
  };
};
