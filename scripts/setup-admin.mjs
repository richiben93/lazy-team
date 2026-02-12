#!/usr/bin/env node

import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const envPath = join(process.cwd(), '.env.local');
const envExamplePath = join(process.cwd(), '.env.example');

const defaultEnv = `# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=
NEXTAUTH_SECRET=`;

const exampleEnv = `# Admin Credentials
# Generate a bcrypt hash with: node scripts/hash-password.mjs "your-password"
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$12$replace_with_bcrypt_hash
NEXTAUTH_SECRET=replace_with_random_secret`;

console.log('🔧 Setting up Admin Authentication...\n');

if (existsSync(envPath)) {
  console.log('✅ .env.local already exists');
  console.log('📝 Please update admin credentials in .env.local');
} else {
  writeFileSync(envPath, defaultEnv);
  console.log('✅ Created .env.local template for admin credentials');
}

if (!existsSync(envExamplePath)) {
  writeFileSync(envExamplePath, exampleEnv);
  console.log('✅ Created .env.example for reference');
}

console.log('\n📋 Next Steps:');
console.log('1. Generate a hash: node scripts/hash-password.mjs "your-password"');
console.log('2. Set ADMIN_PASSWORD_HASH and NEXTAUTH_SECRET in .env.local');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000/admin/login');
console.log('\n🔒 Security: Never commit .env.local to version control!');
