module.exports = function babelExports(api) {
  const isTest = api.env().toLowerCase() === 'test';
  const presetEnvConf = {
    corejs: 3,
    useBuiltIns: 'entry',
  };
  const presets = [['@babel/preset-env', presetEnvConf], '@babel/preset-react', '@babel/preset-typescript'];

  const plugins = [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from',
  ];

  const testPresets = [
    [
      '@babel/preset-env',
      {
        ...presetEnvConf,
        ...{
          targets: {
            node: 'current',
          },
        },
      },
    ],
    '@babel/preset-react',
  ];

  if (isTest) {
    return {
      presets: testPresets,
      plugins,
    };
  }

  return {
    presets,
    plugins,
  };
};
