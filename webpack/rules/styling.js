const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

module.exports = {
  test: /\.(css|scss)$/,
  exclude: [
    {
      test: /node_modules/,
      exclude: /@usabilla\//,
    },
  ],
  loaders: [
    'style-loader',
    {
      loader: 'css-loader',
      options: { sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        plugins: [
          autoprefixer(), // Uses the .browserslistrc automatically
          cssnano(),
        ],
      },
    },
    'sass-loader',
  ],
  oneOf: [
    {
      test: /\.module\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            modules: true,
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader,
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 0,
          },
        },
      ],
    },
  ],
};
