const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  plugin: MiniCssExtractPlugin,
  options: {
    filename: 'assets/[name].css',
  },
};
