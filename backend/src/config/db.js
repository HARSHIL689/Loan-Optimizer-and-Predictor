const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "harshil",
  database: process.env.DB_NAME || "loan_optimizer"
});

pool.on("connect", () => {
  console.log("PostgreSQL connected");
});

module.exports = pool;
