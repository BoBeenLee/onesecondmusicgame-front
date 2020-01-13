const path = require(`path`);

module.exports = {
  moduleDirectories: ["node_modules", path.resolve(__dirname)],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": `<rootDir>/jest-preprocess.js`,
  },
  testPathIgnorePatterns: [`node_modules`, `.cache`],
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
  globals: {
    __PATH_PREFIX__: ``,
  },
  testURL: `http://localhost`,
};
