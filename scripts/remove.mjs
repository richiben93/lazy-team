#!/usr/bin/env node

/**
 * Lazy Team Content Removal CLI
 * 
 * Usage:
 *   npm run remove:trip
 *   npm run remove:member
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(path.dirname(__dirname), 'content');
const TRIPS_DIR = path.join(CONTENT_DIR, 'trips');
const MEMBERS_DIR = path.join(CONTENT_DIR, 'members');
const PUBLIC_DATA_DIR = path.join(path.dirname(__dirname), 'public', 'data');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => {
  rl.question(question, resolve);
});

// List all trips
function listTrips() {
  if (!fs.existsSync(TRIPS_DIR)) {
    return [];
  }
  
  const trips = fs.readdirSync(TRIPS_DIR)
    .filter(dir => fs.statSync(path.join(TRIPS_DIR, dir)).isDirectory())
    .map(slug => {
      const tripMdxPath = path.join(TRIPS_DIR, slug, 'trip.mdx');
      let title = slug;
      
      if (fs.existsSync(tripMdxPath)) {
        const content = fs.readFileSync(tripMdxPath, 'utf8');
        const titleMatch = content.match(/title:\s*["'](.+?)["']/);
        if (titleMatch) title = titleMatch[1];
      }
      
      return { slug, title };
    });
  
  return trips;
}

// List all members
function listMembers() {
  if (!fs.existsSync(MEMBERS_DIR)) {
    return [];
  }
  
  const members = fs.readdirSync(MEMBERS_DIR)
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const slug = file.replace('.mdx', '');
      const memberPath = path.join(MEMBERS_DIR, file);
      let name = slug;
      
      const content = fs.readFileSync(memberPath, 'utf8');
      const nameMatch = content.match(/name:\s*["'](.+?)["']/);
      if (nameMatch) name = nameMatch[1];
      
      return { slug, name, file };
    });
  
  return members;
}

// Remove directory recursively
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDirectory(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
}

// Remove Trip
async function removeTrip() {
  console.log('\n🗑️  REMOVE TRIP\n');
  
  const trips = listTrips();
  
  if (trips.length === 0) {
    console.log('❌ No trips found!');
    rl.close();
    return;
  }
  
  console.log('Available trips:\n');
  trips.forEach((trip, index) => {
    console.log(`  ${index + 1}. ${trip.title} (${trip.slug})`);
  });
  
  console.log();
  const choice = await ask('Enter trip number to remove (or "cancel"): ');
  
  if (choice.toLowerCase() === 'cancel') {
    console.log('❌ Cancelled.');
    rl.close();
    return;
  }
  
  const index = parseInt(choice) - 1;
  
  if (isNaN(index) || index < 0 || index >= trips.length) {
    console.log('❌ Invalid choice!');
    rl.close();
    return;
  }
  
  const tripToRemove = trips[index];
  
  console.log(`\n⚠️  You are about to remove:`);
  console.log(`   Title: ${tripToRemove.title}`);
  console.log(`   Slug: ${tripToRemove.slug}`);
  console.log(`   This will delete:`);
  console.log(`   - content/trips/${tripToRemove.slug}/`);
  console.log(`   - public/data/trip-${tripToRemove.slug}.json`);
  console.log(`   - All associated files (GPX, images, etc.)\n`);
  
  const confirm = await ask('Type "DELETE" to confirm: ');
  
  if (confirm !== 'DELETE') {
    console.log('❌ Deletion cancelled.');
    rl.close();
    return;
  }
  
  // Remove trip directory
  const tripDir = path.join(TRIPS_DIR, tripToRemove.slug);
  console.log(`\n🗑️  Removing ${tripDir}...`);
  removeDirectory(tripDir);
  
  // Remove generated GeoJSON
  const geojsonPath = path.join(PUBLIC_DATA_DIR, `trip-${tripToRemove.slug}.json`);
  if (fs.existsSync(geojsonPath)) {
    console.log(`🗑️  Removing ${geojsonPath}...`);
    fs.unlinkSync(geojsonPath);
  }
  
  console.log(`\n✅ Trip "${tripToRemove.title}" removed successfully!`);
  console.log('\n📝 Next steps:');
  console.log('1. Run: npm run generate (to update trips.json)');
  console.log('2. Run: npm run dev\n');
  
  rl.close();
}

// Remove Member
async function removeMember() {
  console.log('\n🗑️  REMOVE MEMBER/LAZIER\n');
  
  const members = listMembers();
  
  if (members.length === 0) {
    console.log('❌ No members found!');
    rl.close();
    return;
  }
  
  console.log('Available members:\n');
  members.forEach((member, index) => {
    console.log(`  ${index + 1}. ${member.name} (${member.slug})`);
  });
  
  console.log();
  const choice = await ask('Enter member number to remove (or "cancel"): ');
  
  if (choice.toLowerCase() === 'cancel') {
    console.log('❌ Cancelled.');
    rl.close();
    return;
  }
  
  const index = parseInt(choice) - 1;
  
  if (isNaN(index) || index < 0 || index >= members.length) {
    console.log('❌ Invalid choice!');
    rl.close();
    return;
  }
  
  const memberToRemove = members[index];
  
  console.log(`\n⚠️  You are about to remove:`);
  console.log(`   Name: ${memberToRemove.name}`);
  console.log(`   Slug: ${memberToRemove.slug}`);
  console.log(`   This will delete:`);
  console.log(`   - content/members/${memberToRemove.file}\n`);
  
  const confirm = await ask('Type "DELETE" to confirm: ');
  
  if (confirm !== 'DELETE') {
    console.log('❌ Deletion cancelled.');
    rl.close();
    return;
  }
  
  // Remove member file
  const memberPath = path.join(MEMBERS_DIR, memberToRemove.file);
  console.log(`\n🗑️  Removing ${memberPath}...`);
  fs.unlinkSync(memberPath);
  
  console.log(`\n✅ Member "${memberToRemove.name}" removed successfully!`);
  console.log('\n📝 Next steps:');
  console.log('1. Run: npm run generate (to update members.json)');
  console.log('2. Run: npm run dev\n');
  
  rl.close();
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'trip') {
  removeTrip().catch(err => {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  });
} else if (command === 'member') {
  removeMember().catch(err => {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  });
} else {
  console.log('\n🗑️  Lazy Team Content Remover\n');
  console.log('Usage:');
  console.log('  npm run remove:trip     - Remove a trip/adventure');
  console.log('  npm run remove:member   - Remove a member/lazier\n');
  rl.close();
}
