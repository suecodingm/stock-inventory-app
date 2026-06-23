const { Pool } = require('pg');

// Wait for database to be ready with retry logic
const createPool = () => {
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

  return pool;
};

let pool;
let retries = 0;
const maxRetries = 10;

const getPool = async () => {
  if (pool) return pool;

  while (retries < maxRetries) {
    try {
      pool = createPool();
      // Test the connection
      await pool.query('SELECT NOW()');
      console.log('✅ Database connection successful');
      return pool;
    } catch (err) {
      retries++;
      console.log(`⏳ Waiting for database... (${retries}/${maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      pool = null;
    }
  }

  throw new Error('Could not connect to database after multiple retries');
};

module.exports = {
  getPool,
  query: async (text, params) => {
    const pool = await getPool();
    return pool.query(text, params);
  }
};
