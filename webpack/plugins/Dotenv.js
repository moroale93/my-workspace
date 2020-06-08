const Dotenv = require('dotenv-webpack');
const path = require('path');

module.exports = function getDotenvConfig(__packageDirname) {
  return {
    plugin: Dotenv,
    options: {
      path: path.resolve(__packageDirname, './.env'),
    },
  };
};
