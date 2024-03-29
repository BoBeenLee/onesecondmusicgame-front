module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "transform-inline-environment-variables",
      {
        include: ["REACT_ENV"]
      }
    ],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [".js", ".ios.js", ".android.js", ".ts", ".tsx"]
      }
    ]
  ]
};
