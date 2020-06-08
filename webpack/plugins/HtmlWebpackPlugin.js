const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugin: HtmlWebpackPlugin,
  options: {
    template: './src/index.html',
    filename: 'index.html',
  },
};
