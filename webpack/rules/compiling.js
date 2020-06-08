const path = require('path');

module.exports = function getCompilingConfig(__packageDirname) {
  return {
    test: /\.(jsx|js|ts|tsx)$/,
    include: [
      path.resolve(__packageDirname, '../src'),
      /\/packages\//,
    ],
    use: [
      {
        loader: 'babel-loader',
        options: {
          rootMode: 'upward',
        },
      },
    ],
  };
};
