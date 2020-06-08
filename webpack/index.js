const getBaseConfig = require('./base.config');

module.exports = function getConfiguration(isApp, isProd, __packageDirname) {
  const baseConfig = getBaseConfig(__packageDirname, isApp);
  if (isApp) {
    baseConfig.target = 'web';
  }
  return {
    ...baseConfig,
    mode: process.env.NODE_ENV,
    devServer: (isProd || !isApp) ? undefined : {
      clientLogLevel: 'error',
      compress: true,
      historyApiFallback: true,
      port: 8888,
      open: true,
    },
  };
};
