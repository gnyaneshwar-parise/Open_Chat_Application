module.exports = {
  testEnvironment: "node",
  coveragePathIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/tests/**/*.test.js"],
  collectCoverageFrom: [
    "*.js",
    "uiLayer/*.js",
    "!node_modules/**",
    "!coverage/**",
    "!jest.config.js"
  ],
  verbose: true
};
