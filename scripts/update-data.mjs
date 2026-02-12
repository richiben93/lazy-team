#!/usr/bin/env node

/**
 * Script interattivo per aggiornare trip e membri con i nuovi campi
 * Usage: node scripts/update-data.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Emoji suggestions for members
const EMOJI_SUGGESTIONS = [
  '🚴', '🏔️', '⚡', '🦾', '🎯', '🔥', '💨', '🌟', 
  '🚀', '⭐', '🌙', '☀️', '🎪', '🎨', '🎭', '🎬'
];

// Default values
const TRIP_TYPES = ['one-day', 'overnight', 'multi-day'];
const TERRAIN_TYPES = ['road', 'gravel', 'mtb', 'mixed'];

async function updateMembers() {
  console.log('\n📝 AGGIORNAMENTO MEMBRI\n');
  
  const membersDir = path.join(rootDir, 'content', 'members');
  const memberFiles = fs.readdirSync(membersDir)
    .filter(file => file.endsWith('.mdx'));

  console.log(`Trovati ${memberFiles.length} membri da aggiornare.\n`);

  const members = [];
  
  for (const file of memberFiles) {
    const filePath = path.join(membersDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const frontmatter = match[1];
    const bodyContent = content.substring(match[0].length);
    
    // Parse existing data
    const nameMatch = frontmatter.match(/name:\s*"([^"]+)"/);
    const nicknameMatch = frontmatter.match(/nickname:\s*"([^"]+)"/);
    const name = nameMatch ? nameMatch[1] : file.replace('.mdx', '');
    const nickname = nicknameMatch ? nicknameMatch[1] : name;
    
    console.log(`\n👤 Membro: ${name} (${nickname})`);
    console.log(`File: ${file}`);
    
    // Check if emoji already exists
    const hasEmoji = frontmatter.includes('emoji:');
    
    let emoji;
    if (hasEmoji) {
      const emojiMatch = frontmatter.match(/emoji:\s*"([^"]+)"/);
      emoji = emojiMatch ? emojiMatch[1] : '';
      console.log(`Emoji esistente: ${emoji}`);
      const change = await question('Vuoi cambiarlo? (y/n): ');
      if (change.toLowerCase() !== 'y') {
        members.push({ file, slug: file.replace('.mdx', ''), emoji });
        continue;
      }
    }
    
    console.log(`\nEmoji suggerite: ${EMOJI_SUGGESTIONS.join(' ')}`);
    emoji = await question('Scegli un emoji per questo Lazer: ');
    
    // Ask if admin
    const isAdminResponse = await question('È un admin? (y/n): ');
    const isAdmin = isAdminResponse.toLowerCase() === 'y';
    
    // Update frontmatter
    let newFrontmatter = frontmatter;
    if (hasEmoji) {
      newFrontmatter = newFrontmatter.replace(/emoji:\s*"[^"]*"/, `emoji: "${emoji}"`);
    } else {
      newFrontmatter += `\nemoji: "${emoji}"`;
    }
    
    if (isAdmin) {
      if (!frontmatter.includes('isAdmin:')) {
        newFrontmatter += `\nisAdmin: true`;
      }
    }
    
    const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;
    fs.writeFileSync(filePath, newContent);
    
    console.log(`✅ Aggiornato ${file}`);
    members.push({ 
      file, 
      slug: file.replace('.mdx', ''), 
      emoji,
      isAdmin 
    });
  }
  
  return members;
}

async function updateTrips(members) {
  console.log('\n\n📍 AGGIORNAMENTO TRIP\n');
  
  const tripsDir = path.join(rootDir, 'content', 'trips');
  const tripDirs = fs.readdirSync(tripsDir)
    .filter(dir => fs.statSync(path.join(tripsDir, dir)).isDirectory());

  console.log(`Trovati ${tripDirs.length} trip da aggiornare.\n`);
  
  for (const dir of tripDirs) {
    const tripFile = path.join(tripsDir, dir, 'trip.mdx');
    if (!fs.existsSync(tripFile)) continue;
    
    const content = fs.readFileSync(tripFile, 'utf8');
    
    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) continue;

    const frontmatter = match[1];
    const bodyContent = content.substring(match[0].length);
    
    // Parse existing data
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : dir;
    
    console.log(`\n🚴 Trip: ${title}`);
    console.log(`Directory: ${dir}`);
    
    // Check existing fields
    const hasAuthor = frontmatter.includes('author:');
    const hasType = frontmatter.includes('type:');
    const hasTerrain = frontmatter.includes('terrain:');
    
    let newFrontmatter = frontmatter;
    
    // Author
    if (!hasAuthor) {
      console.log('\nMembri disponibili:');
      members.forEach((m, i) => {
        console.log(`  ${i + 1}. ${m.emoji} ${m.slug}`);
      });
      const authorIndex = await question('Scegli il numero del Lazer autore: ');
      const author = members[parseInt(authorIndex) - 1]?.slug || members[0].slug;
      newFrontmatter += `\nauthor: "${author}"`;
    }
    
    // Type
    if (!hasType) {
      console.log('\nTipo di trip:');
      TRIP_TYPES.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t}`);
      });
      const typeIndex = await question('Scegli il numero (default: 1): ') || '1';
      const type = TRIP_TYPES[parseInt(typeIndex) - 1] || TRIP_TYPES[0];
      newFrontmatter += `\ntype: "${type}"`;
    }
    
    // Terrain
    if (!hasTerrain) {
      console.log('\nTerreno:');
      TERRAIN_TYPES.forEach((t, i) => {
        console.log(`  ${i + 1}. ${t}`);
      });
      const terrainIndex = await question('Scegli il numero (default: 1): ') || '1';
      const terrain = TERRAIN_TYPES[parseInt(terrainIndex) - 1] || TERRAIN_TYPES[0];
      newFrontmatter += `\nterrain: "${terrain}"`;
    }
    
    const newContent = `---\n${newFrontmatter}\n---${bodyContent}`;
    fs.writeFileSync(tripFile, newContent);
    
    console.log(`✅ Aggiornato ${dir}`);
  }
}

async function main() {
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   LAZY TEAM - Aggiornamento Dati v1.0    ║');
  console.log('╚═══════════════════════════════════════════╝\n');
  
  try {
    const members = await updateMembers();
    await updateTrips(members);
    
    console.log('\n\n✅ COMPLETATO!\n');
    console.log('Prossimi step:');
    console.log('1. Verifica i file aggiornati');
    console.log('2. Esegui: npm run generate');
    console.log('3. Testa il sito\n');
  } catch (error) {
    console.error('\n❌ Errore:', error.message);
  } finally {
    rl.close();
  }
}

main();
