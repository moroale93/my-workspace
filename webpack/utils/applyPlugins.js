module.exports = function applyPlugins(pluginsConfiguration) {
  const configurations = Object.values(pluginsConfiguration);
  return configurations.map(({ plugin: Constructor, options }) => new Constructor(options));
};
