// jest runs in comonjs so dont change imports below
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  testTimeout: 20000,
};
