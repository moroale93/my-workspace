const getCompilingConfig = require('./compiling');
const styling = require('./styling');
const fonts = require('./fonts');
const images = require('./images');
const graphql = require('./graphql');

module.exports = function getRules(__packageDirname) {
  return {
    compiling: getCompilingConfig(__packageDirname),
    styling,
    fonts,
    images,
    graphql,
  };
};
