// src/database/sequelize.config.js
require('ts-node/register');
const dotenv = require('@dotenvx/dotenvx');
dotenv.config();

module.exports = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  dialect: 'mysql',
  port: process.env.DB_PORT,
};
