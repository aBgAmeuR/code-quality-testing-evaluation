const config = {
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
  preset: "ts-jest/presets/default-esm",
  testMatch: ["<rootDir>/src/__tests__/**/*.test.[jt]s?(x)"],
};

module.exports = config;
