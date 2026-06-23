const { Pool } = require('pg');
require('dotenv').config();

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_sql = process.env.DB_SQL;
const db_pw = process.env.DB_PW;
const db_port = process.env.DB_PORT;

module.exports = new Pool({
    host: `${db_host}`,
    user: `${db_user}`,
    database: `${db_sql}`,
    password: `${db_pw}`,
    port: `${db_port}`,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: true,
});