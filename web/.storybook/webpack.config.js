const path = require("path");

module.exports = ({ config }) => {
  // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
  config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];

  // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
  config.module.rules[0].use[0].loader = require.resolve("babel-loader");

  // use @babel/preset-react for JSX and env (instead of staged presets)
  config.module.rules[0].use[0].options.presets = [
    require.resolve("@babel/preset-react"),
    require.resolve("@babel/preset-env")
  ];

  // use @babel/plugin-proposal-class-properties for class arrow functions
  config.module.rules[0].use[0].options.plugins = [
    require.resolve("@babel/plugin-proposal-class-properties")
  ];

  // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
  config.resolve.mainFields = ["browser", "module", "main"];
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    loader: require.resolve("babel-loader"),
    options: {
      presets: [["react-app", { flow: false, typescript: true }]]
    }
  });
  config.resolve.modules = [
    ...(config.resolve.modules || []),
    path.resolve("../")
  ];
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    "react-native": path.resolve(__dirname, "../__mocks__/react-native"),
    "@app": path.resolve(__dirname, "../../src"),
    "@web": path.resolve(__dirname, "../src")
  };
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
