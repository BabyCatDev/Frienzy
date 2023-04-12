module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@lavanda": "./",
          "@components": "./src/components/",
          "@core": "./src/core/",
          "@screens": "./src/screens/",
          "@navigators": "./src/navigators/",
          "@redux": "./src/redux/",
          "@utils": "./src/utils/",
          "@services": "./src/services/",
          "@assets": "./assets/",
        },
      },
    ],
    "react-native-reanimated/plugin",
  ],
};
