const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDb() {
  const dbName = process.env.DB_NAME || 'aptitude_training';
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  };

  console.log('🔌 Connecting to postgres default database...');
  let client = new Client({ ...connectionConfig, database: 'postgres' });
  await client.connect();

  console.log(`🔍 Checking if database "${dbName}" exists...`);
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
  if (res.rowCount === 0) {
    console.log(`✨ Database "${dbName}" does not exist. Creating it...`);
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database "${dbName}" created successfully.`);
  } else {
    console.log(`ℹ️ Database "${dbName}" already exists.`);
  }
  await client.end();

  console.log(`🔌 Connecting to database "${dbName}"...`);
  client = new Client({ ...connectionConfig, database: dbName });
  await client.connect();

  console.log('📝 Reading schema.sql...');
  const schemaSqlPath = path.join(__dirname, 'schema.sql');
  if (fs.existsSync(schemaSqlPath)) {
    const schemaSql = fs.readFileSync(schemaSqlPath, 'utf8');
    console.log('🚀 Executing schema.sql...');
    await client.query(schemaSql);
    console.log('✅ schema.sql executed successfully.');
  } else {
    console.warn('⚠️ schema.sql not found.');
  }

  console.log('📝 Reading schema-auth.sql...');
  const schemaAuthSqlPath = path.join(__dirname, 'schema-auth.sql');
  if (fs.existsSync(schemaAuthSqlPath)) {
    const schemaAuthSql = fs.readFileSync(schemaAuthSqlPath, 'utf8');
    console.log('🚀 Executing schema-auth.sql...');
    await client.query(schemaAuthSql);
    console.log('✅ schema-auth.sql executed successfully.');
  } else {
    console.warn('⚠️ schema-auth.sql not found.');
  }

  // Seed default badges
  console.log('🌱 Seeding default badges...');
  const checkBadges = await client.query('SELECT COUNT(*) FROM badges');
  if (parseInt(checkBadges.rows[0].count) === 0) {
    const seedBadgesQuery = `
      INSERT INTO badges (name, description, category, icon, points_required, criteria)
      VALUES 
        ('Quick Starter', 'Completed your first quiz!', 'quiz', 'Zap', 10, '{"quizzes": 1}'),
        ('Math Whiz', 'Score 100% on a Quantitative Aptitude quiz', 'quant', 'Calculator', 50, '{"score": 100, "category": "quant"}'),
        ('Consistency King', 'Maintain a 5-day quiz streak', 'streak', 'Flame', 100, '{"streak": 5}'),
        ('Perfect Score', 'Get a perfect score on any adaptive quiz', 'quiz', 'Award', 100, '{"score": 100}'),
        ('Expert Solver', 'Complete 10 challenges successfully', 'challenge', 'Shield', 200, '{"challenges": 10}')
    `;
    await client.query(seedBadgesQuery);
    console.log('✅ Badges seeded successfully.');
  } else {
    console.log('ℹ️ Badges already seeded.');
  }

  // Seed default challenges if empty
  console.log('🌱 Seeding default challenges...');
  const checkChallenges = await client.query('SELECT COUNT(*) FROM challenges');
  if (parseInt(checkChallenges.rows[0].count) === 0) {
    const seedChallengesQuery = `
      INSERT INTO challenges (title, description, category, challenge_type, difficulty_level, content, points_reward, experience_reward, time_limit)
      VALUES 
        (
          'Quantitative Reasoning Riddle', 
          'Solve a classic logical puzzle involving ratios and age calculations.', 
          'Quantitative Aptitude', 
          'puzzle', 
          'intermediate', 
          '{"question": "A father is twice as old as his son. Twenty years ago, the age of the father was 12 times the age of the son. What is the current age of the father?", "options": ["44", "22", "40", "36"], "correctAnswer": "44"}', 
          50, 
          100, 
          120
        ),
        (
          'Algorithm Optimization Challenge', 
          'Optimize a pattern-matching algorithm for minimum time complexity.', 
          'Logical Reasoning', 
          'coding', 
          'advanced', 
          '{"question": "What is the best-case time complexity of finding a pattern in a text of length N using KMP algorithm?", "options": ["O(N)", "O(N+M)", "O(M)", "O(1)"], "correctAnswer": "O(N)"}', 
          75, 
          150, 
          180
        )
    `;
    await client.query(seedChallengesQuery);
    console.log('✅ Challenges seeded successfully.');
  } else {
    console.log('ℹ️ Challenges already seeded.');
  }

  await client.end();
  console.log('🎉 Database initialization completed successfully! 🎉');
}

initDb().catch(err => {
  console.error('❌ Error during database initialization:', err);
  process.exit(1);
});
