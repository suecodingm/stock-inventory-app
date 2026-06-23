const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'stockuser',
  password: process.env.DB_PASSWORD || 'stockpass',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'stock_inventory'
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
