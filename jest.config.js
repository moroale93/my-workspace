const baseConfig = require('./jest.base.config');

module.exports = {
  ...baseConfig,

  projects: [
    '<rootDir>/packages/*/jest.config.js',
  ],

  coverageDirectory: '<rootDir>/test-results/coverage',
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.js',
    '<rootDir>/packages/*/src/**/*.ts',
  ],

  coverageThreshold: {
    './packages': {
      branches: 90, functions: 90, lines: 90, statements: 90,
    },
  },
};
