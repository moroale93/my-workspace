const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugin: CleanWebpackPlugin,
  options: {
    verbose: false,
  },
};
