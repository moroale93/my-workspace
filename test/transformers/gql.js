/* istanbul ignore file */
const gql = require('graphql-tag');

module.exports = {
  process: src => (
    `module.exports=${JSON.stringify(gql(src))};module.exports.default=module.exports;`
  ),
};
