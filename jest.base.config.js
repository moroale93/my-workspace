process.env.NODE_ENV = process.env.NODE_ENV || 'test';

module.exports = {
  rootDir: __dirname,

  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'ts'],

  testEnvironment: 'jsdom',
  testRegex: null,
  testMatch: ['**/*.test.{js,ts}'],

  preset: 'ts-jest/presets/js-with-babel',

  bail: true,
  verbose: true,
  timers: 'real',
  clearMocks: true,

  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',

  transformIgnorePatterns: ['node_modules/(?!@usabilla)'],
  transform: {
    '\\.js$': '<rootDir>/test/transformers/babel.js',
  },

  setupFiles: [
    '<rootDir>/test/env-setup',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/test/setup-file-after-env-react',
  ],
};
