module.exports = {
  // Use ts-jest preset for testing TypeScript files with Jest
  preset: "ts-jest",
  // Set the test environment to Node.js
  testEnvironment: "node",

  // Define the root directory for tests and modules
  roots: ["<rootDir>/__tests__"],

  // Use ts-jest to transform TypeScript files, against the dedicated
  // __tests__/tsconfig.json (not the root tsconfig.json, whose `include`
  // only covers src/** and whose inherited `types: ["node"]` would
  // otherwise exclude Jest's own ambient globals).
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      { tsconfig: "<rootDir>/__tests__/tsconfig.json" },
    ],
  },

  // Regular expression to find test files
  testRegex: "((\\.|/)(test|spec))\\.tsx?$",

  // File extensions to recognize in module resolution
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
