/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  collectCoverage: true,
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/build'],
  transform: {
    '^.+.tsx?$': ['ts-jest', {}],
  },
};
