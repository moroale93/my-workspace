const HtmlWebpackPlugin = require('./HtmlWebpackPlugin');
const CleanWebpackPlugin = require('./CleanWebpackPlugin');
const HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
const MiniCssExtractPlugin = require('./MiniCssExtractPlugin');
const getDotenv = require('./Dotenv');

module.exports = function getPlugins(__packageDirname, isApp) {
  const config = {
    CleanWebpackPlugin,
    HashedModuleIdsPlugin,
    MiniCssExtractPlugin,
    Dotenv: getDotenv(__packageDirname),
  };
  if (isApp) {
    config.HtmlWebpackPlugin = HtmlWebpackPlugin;
  }
  return config;
};
