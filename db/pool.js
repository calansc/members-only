require("dotenv").config();

const { Pool } = require("pg");
// const connectionString = process.env.CONNECTION_STRING;
// const pool = new Pool({
//   connectionString,
// });

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
});

module.exports = pool;
