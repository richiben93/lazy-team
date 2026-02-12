import bcrypt from 'bcryptjs';

// Database interfaces
export interface Admin {
  id: number;
  username: string;
  name: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminWithPassword extends Admin {
  password_hash: string;
}

// Environment-based database adapter
let dbAdapter: any;

if (process.env.DATABASE_URL) {
  // Production: PlanetScale
  const { connect } = require('@planetscale/database');
  
  const config = {
    url: process.env.DATABASE_URL
  };
  
  dbAdapter = connect(config);
  
  // Initialize table in PlanetScale (idempotent)
  dbAdapter.execute(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `).catch((err: any) => {
    // Table might already exist, ignore error
    if (!err.message?.includes('already exists')) {
      console.error('Failed to create admins table:', err);
    }
  });
  
} else {
  // Development: SQLite
  const Database = require('better-sqlite3');
  const path = require('path');
  
  const dbPath = path.join(process.cwd(), 'data', 'admins.db');
  dbAdapter = new Database(dbPath);
  
  // Create table in SQLite
  dbAdapter.exec(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

const isProduction = !!process.env.DATABASE_URL;

// Get all admins
export async function getAllAdmins(): Promise<Admin[]> {
  if (isProduction) {
    const result = await dbAdapter.execute(
      'SELECT id, username, name, email, created_at, updated_at FROM admins'
    );
    return result.rows as Admin[];
  } else {
    const stmt = dbAdapter.prepare('SELECT id, username, name, email, created_at, updated_at FROM admins');
    return stmt.all() as Admin[];
  }
}

// Get admin by username
export async function getAdminByUsername(username: string): Promise<AdminWithPassword | null> {
  if (isProduction) {
    const result = await dbAdapter.execute(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    return result.rows[0] as AdminWithPassword | null;
  } else {
    const stmt = dbAdapter.prepare('SELECT * FROM admins WHERE username = ?');
    return stmt.get(username) as AdminWithPassword | null;
  }
}

// Get admin by ID
export async function getAdminById(id: number): Promise<Admin | null> {
  if (isProduction) {
    const result = await dbAdapter.execute(
      'SELECT id, username, name, email, created_at, updated_at FROM admins WHERE id = ?',
      [id]
    );
    return result.rows[0] as Admin | null;
  } else {
    const stmt = dbAdapter.prepare('SELECT id, username, name, email, created_at, updated_at FROM admins WHERE id = ?');
    return stmt.get(id) as Admin | null;
  }
}

// Create admin
export async function createAdmin(username: string, password: string, name: string, email?: string): Promise<Admin> {
  const passwordHash = bcrypt.hashSync(password, 12);
  
  if (isProduction) {
    const result = await dbAdapter.execute(
      'INSERT INTO admins (username, password_hash, name, email) VALUES (?, ?, ?, ?)',
      [username, passwordHash, name, email || null]
    );
    const admin = await getAdminById(Number(result.insertId));
    if (!admin) throw new Error('Failed to create admin');
    return admin;
  } else {
    const stmt = dbAdapter.prepare(`
      INSERT INTO admins (username, password_hash, name, email)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(username, passwordHash, name, email || null);
    const admin = await getAdminById(result.lastInsertRowid as number);
    if (!admin) throw new Error('Failed to create admin');
    return admin;
  }
}

// Update admin
export async function updateAdmin(id: number, data: Partial<Omit<Admin, 'id' | 'created_at' | 'updated_at'>>): Promise<Admin | null> {
  const fields: string[] = [];
  const values: any[] = [];
  
  if (data.username) {
    fields.push('username = ?');
    values.push(data.username);
  }
  if (data.name) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.email !== undefined) {
    fields.push('email = ?');
    values.push(data.email || null);
  }
  
  if (fields.length === 0) {
    return getAdminById(id);
  }
  
  if (isProduction) {
    fields.push('updated_at = CURRENT_TIMESTAMP');
  } else {
    fields.push('updated_at = CURRENT_TIMESTAMP');
  }
  
  values.push(id);
  
  if (isProduction) {
    await dbAdapter.execute(
      `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  } else {
    const stmt = dbAdapter.prepare(`UPDATE admins SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
  }
  
  return getAdminById(id);
}

// Update password
export async function updateAdminPassword(id: number, newPassword: string): Promise<void> {
  const passwordHash = bcrypt.hashSync(newPassword, 12);
  
  if (isProduction) {
    await dbAdapter.execute(
      'UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [passwordHash, id]
    );
  } else {
    const stmt = dbAdapter.prepare(`
      UPDATE admins SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `);
    stmt.run(passwordHash, id);
  }
}

// Delete admin
export async function deleteAdmin(id: number): Promise<void> {
  if (isProduction) {
    await dbAdapter.execute('DELETE FROM admins WHERE id = ?', [id]);
  } else {
    const stmt = dbAdapter.prepare('DELETE FROM admins WHERE id = ?');
    stmt.run(id);
  }
}

// Verify password
export async function verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
  const admin = await getAdminByUsername(username);
  if (!admin) return null;
  
  const isValid = bcrypt.compareSync(password, admin.password_hash);
  if (!isValid) return null;
  
  const { password_hash, ...adminWithoutPassword } = admin;
  return adminWithoutPassword as Admin;
}

// Count admins
export async function countAdmins(): Promise<number> {
  if (isProduction) {
    const result = await dbAdapter.execute('SELECT COUNT(*) as count FROM admins');
    return result.rows[0].count;
  } else {
    const stmt = dbAdapter.prepare('SELECT COUNT(*) as count FROM admins');
    const result = stmt.get() as { count: number };
    return result.count;
  }
}

// Initialize first admin if database is empty
export async function initializeFirstAdmin(): Promise<void> {
  const count = await countAdmins();
  
  if (count === 0) {
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'changeme';
    const defaultName = 'Administrator';
    
    console.log('Creating first admin user...');
    await createAdmin(defaultUsername, defaultPassword, defaultName);
    console.log(`✅ First admin created: ${defaultUsername}`);
    console.log('⚠️  Please change the password immediately!');
  }
}

// Initialize database on import
if (typeof window === 'undefined') {
  initializeFirstAdmin().catch(err => {
    console.error('Failed to initialize admin:', err);
  });
}

export default dbAdapter;
