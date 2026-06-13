const pool = require('./pool');
const bcrypt = require('bcryptjs');

async function saveUser(firstname, lastname, username, password) {
    const hashedPwd = await bcrypt.hash(password, 10);
    await pool.query(
        'INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)',
        [firstname, lastname, username, hashedPwd]
    );
};

async function saveMessage(alias_id, info) {
    await pool.query(
        'INSERT INTO messages (username_id, text) VALUES ($1, $2)',
        [alias_id, info]
    );
};

async function getAllMessages() {
    const { rows } = await pool.query('SELECT * FROM msg_details');
    return rows;
};

async function beMember(userId) {
    await pool.query(
        'UPDATE users SET member = true WHERE id = $1',
        [userId]
    );
};

// Function to count how many messages the member posted. If more 
// than 3, he will be elegible to become Admin
async function countMessages(userId) {
    const result = await pool.query(
        'SELECT COUNT(*) FROM messages WHERE username_id = $1',
        [userId]
    );

    // PostgreSQL return COUNT as a String. Parse will convert it to number
    return parseInt(result.rows[0].count, 10);
};

async function makeUserAdmin(userId) {
    await pool.query(
        'UPDATE users SET admin = true WHERE id = $1',
        [userId]
    );
};

async function deleteMsg(id) {
    const res = await pool.query(
        'DELETE FROM messages WHERE id = $1 RETURNING *',
        [id]
    );

    return res.rows;
}

module.exports = {
    saveUser,
    saveMessage, 
    getAllMessages, 
    beMember,
    countMessages, 
    makeUserAdmin,
    deleteMsg
}