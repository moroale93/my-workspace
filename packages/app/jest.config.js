const baseConfig = require('../../jest.base.config');

const packageName = require('./package.json').name.split('@amoretto/').pop();

module.exports = {
  ...baseConfig,
  name: packageName,
  displayName: packageName,

  roots: [
    `<rootDir>/packages/${packageName}`,
  ],

  transform: {
    ...baseConfig.transform,
    '^.+\\.gql$': './test/transformers/gql.js',
  },
};
