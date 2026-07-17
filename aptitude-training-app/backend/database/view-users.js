const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function viewUsers() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'aptitude_training',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  await client.connect();

  console.log('\n📊 --- REGISTERED USERS --- 📊');
  const res = await client.query(`
    SELECT id, email, full_name, created_at, last_login, onboarding_completed 
    FROM users 
    ORDER BY created_at DESC
  `);

  if (res.rowCount === 0) {
    console.log('ℹ️ No users registered yet. Try registering an account on http://localhost:3000!');
  } else {
    console.table(res.rows);
  }

  await client.end();
}

viewUsers().catch(err => {
  console.error('❌ Error fetching users:', err.message);
});
