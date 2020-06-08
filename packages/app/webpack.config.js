require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

module.exports = require('../../webpack/index')(true, isProduction, __dirname);
