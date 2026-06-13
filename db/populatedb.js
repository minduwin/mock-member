const { Client } = require('pg');
require('dotenv').config();

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_sql = process.env.DB_SQL;
const db_pw = process.env.DB_PW;
const db_port = process.env.DB_PORT;

const SQL = `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR ( 255 ) NOT NULL,
        lastname VARCHAR ( 255 ) NOT NULL,
        username VARCHAR ( 255 ) NOT NULL,
        password VARCHAR ( 255 ) NOT NULL,
        member BOOLEAN DEFAULT false NOT NULL,
        admin BOOLEAN DEFAULT false NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        username_id INT REFERENCES users(id),
        text VARCHAR ( 255 ) NOT NULL,
        added DATE DEFAULT CURRENT_DATE
    );

    CREATE VIEW msg_details AS
    SELECT 
        m.id AS message_id,
        m.username_id,
        u.username,
        m.text,
        m.added
    FROM messages m
    JOIN users u ON m.username_id = u.id;
`;

async function main() {
    console.log('Seeding...');
    const client = new Client({
        connectionString: `postgresql://${db_user}:${db_pw}@${db_host}:${db_port}/${db_sql}`,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('Done...');
};

main();