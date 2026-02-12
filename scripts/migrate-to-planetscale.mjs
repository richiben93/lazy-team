#!/usr/bin/env node

/**
 * Script per migrare admin da SQLite locale a PlanetScale
 * Usage: node scripts/migrate-to-planetscale.mjs
 */

import Database from 'better-sqlite3';
import { connect } from '@planetscale/database';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check environment variable
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable not set!');
  console.log('\nAdd to your .env.local:');
  console.log('DATABASE_URL=mysql://user:password@host/database');
  process.exit(1);
}

console.log('╔═══════════════════════════════════════════╗');
console.log('║   Database Migration: SQLite → PlanetScale║');
console.log('╚═══════════════════════════════════════════╝\n');

async function migrate() {
  // Connect to SQLite
  const sqlitePath = path.join(process.cwd(), 'data', 'admins.db');
  
  console.log('📂 Reading from SQLite:', sqlitePath);
  
  if (!require('fs').existsSync(sqlitePath)) {
    console.error('❌ SQLite database not found!');
    console.log('Run the app locally first to create the database.');
    process.exit(1);
  }
  
  const sqlite = new Database(sqlitePath);
  
  // Get all admins from SQLite
  const admins = sqlite.prepare('SELECT * FROM admins').all();
  console.log(`✅ Found ${admins.length} admin(s) in SQLite\n`);
  
  if (admins.length === 0) {
    console.log('⚠️  No admins to migrate. Exiting.');
    process.exit(0);
  }
  
  // Connect to PlanetScale
  console.log('🌐 Connecting to PlanetScale...');
  const planetscale = connect({ url: process.env.DATABASE_URL });
  
  // Create table in PlanetScale
  console.log('📋 Creating admins table in PlanetScale...');
  try {
    await planetscale.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Table created or already exists\n');
  } catch (error) {
    console.error('❌ Failed to create table:', error.message);
    process.exit(1);
  }
  
  // Migrate each admin
  console.log('🔄 Migrating admins...\n');
  let migrated = 0;
  let skipped = 0;
  
  for (const admin of admins) {
    try {
      await planetscale.execute(
        'INSERT INTO admins (username, password_hash, name, email, created_at) VALUES (?, ?, ?, ?, ?)',
        [admin.username, admin.password_hash, admin.name, admin.email, admin.created_at]
      );
      console.log(`  ✅ Migrated: ${admin.username} (${admin.name})`);
      migrated++;
    } catch (error) {
      if (error.message?.includes('Duplicate entry')) {
        console.log(`  ⚠️  Skipped: ${admin.username} (already exists)`);
        skipped++;
      } else {
        console.error(`  ❌ Failed: ${admin.username}`, error.message);
      }
    }
  }
  
  console.log('\n╔═══════════════════════════════════════════╗');
  console.log('║           Migration Complete!             ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log(`\n✅ Migrated: ${migrated}`);
  console.log(`⚠️  Skipped: ${skipped}`);
  console.log(`📊 Total: ${admins.length}\n`);
  
  // Verify
  console.log('🔍 Verifying migration...');
  const result = await planetscale.execute('SELECT COUNT(*) as count FROM admins');
  const count = result.rows[0].count;
  console.log(`✅ PlanetScale now has ${count} admin(s)\n`);
  
  sqlite.close();
}

migrate().catch(err => {
  console.error('\n❌ Migration failed:', err.message);
  process.exit(1);
});
