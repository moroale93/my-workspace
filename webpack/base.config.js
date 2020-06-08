const path = require('path');
const getRules = require('./rules');
const applyPlugins = require('./utils/applyPlugins');
const getPlugins = require('./plugins');

module.exports = function getBaseConfig(__packageDirname, isApp) {
  let output = {
    path: path.resolve(__packageDirname, './dist'),
    publicPath: '/',
    filename: 'assets/[name].[contenthash:8].js',
  };
  if (!isApp) {
    output = {
      path: path.resolve(__packageDirname, './dist'),
      filename: './index.js',
    };
  }
  return {
    stats: {
      children: false,
      entrypoints: false,
      modules: false,
    },
    devtool: 'source-map',
    node: {
      Buffer: true,
      fs: 'empty',
      tls: 'empty',
    },
    output,
    entry: path.resolve(__packageDirname, './src/index.js'),
    module: {
      rules: Object.values(getRules(__packageDirname)),
    },
    resolve: {
      extensions: [
        '.js',
        '.json',
        '.ts',
        '.tsx',
      ],
      modules: [
        'node_modules',
        'src',
      ],
    },
    plugins: applyPlugins(getPlugins(__packageDirname, isApp)),
  };
};
