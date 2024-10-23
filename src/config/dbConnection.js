const { Pool } = require('pg');
const dbConfig = require('./configDB'); // Import the configuration

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  // console.log('Connected to the database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const query = async (text, params) => {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;
  }
};

module.exports = {
  query,
};
