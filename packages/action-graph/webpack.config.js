const path = require('path');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const config = require('../../webpack/index')(false, isProduction, __dirname);

config.entry = path.resolve(__dirname, './src/index.ts');
module.exports = config;
