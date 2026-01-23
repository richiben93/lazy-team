#!/usr/bin/env node

/**
 * Lazy Team Content Upload CLI
 * 
 * Usage:
 *   npm run upload:trip
 *   npm run upload:member
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

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (question) => new Promise((resolve) => {
  rl.question(question, resolve);
});

// Ensure directories exist
if (!fs.existsSync(TRIPS_DIR)) fs.mkdirSync(TRIPS_DIR, { recursive: true });
if (!fs.existsSync(MEMBERS_DIR)) fs.mkdirSync(MEMBERS_DIR, { recursive: true });

// Slugify helper
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Upload Trip
async function uploadTrip() {
  console.log('\n🚴 UPLOAD NEW TRIP\n');
  
  const title = await ask('Trip Title: ');
  const date = await ask('Date (YYYY-MM-DD): ');
  const location = await ask('Location (e.g., "Dolomites, Italy"): ');
  const tags = await ask('Tags (comma-separated, e.g., "Mountain, Epic"): ');
  
  let coverImage;
  while (true) {
    coverImage = await ask('Cover Image URL or path: ');
    const validatedPath = validateImagePath(coverImage);
    
    if (validatedPath === null) {
      console.log('❌ Invalid path format. Please try again.\n');
      continue;
    }
    
    coverImage = validatedPath;
    console.log(`✅ Using path: ${coverImage}`);
    break;
  }
  
  const excerpt = await ask('Short Description: ');
  const gpxPath = await ask('Path to GPX file (or press Enter to skip): ');
  const photosInput = await ask('Photo URLs/paths (comma-separated, or press Enter to skip): ');
  
  const slug = slugify(title);
  const tripDir = path.join(TRIPS_DIR, slug);
  
  if (fs.existsSync(tripDir)) {
    console.log(`\n⚠️  Trip "${slug}" already exists!`);
    const overwrite = await ask('Overwrite? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Upload cancelled.');
      rl.close();
      return;
    }
  }
  
  fs.mkdirSync(tripDir, { recursive: true });
  
  // Parse tags and photos with validation
  const tagArray = tags.split(',').map(t => `"${t.trim()}"`).join(', ');
  
  let photos = '';
  if (photosInput) {
    const photoUrls = photosInput.split(',').map(url => {
      const trimmed = url.trim();
      const validated = validateImagePath(trimmed);
      return validated || trimmed; // Use validated or original if validation failed
    });
    photos = photoUrls.map(url => `  - "${url}"`).join('\n');
  }
  
  // Create MDX content
  const mdxContent = `---
title: "${title}"
date: "${date}"
location: "${location}"
tags: [${tagArray}]
coverImage: "${coverImage}"
gpxFile: "route.gpx"${photos ? `\nphotos:\n${photos}` : ''}
excerpt: "${excerpt}"
---

# The Story

Write your adventure story here...

## Section 1

Add your content...
`;
  
  // Write MDX file
  fs.writeFileSync(path.join(tripDir, 'trip.mdx'), mdxContent);
  
  // Copy GPX file if provided
  if (gpxPath && fs.existsSync(gpxPath)) {
    fs.copyFileSync(gpxPath, path.join(tripDir, 'route.gpx'));
    console.log('✅ GPX file copied');
  }
  
  console.log(`\n✅ Trip created successfully!`);
  console.log(`📁 Location: content/trips/${slug}/`);
  
  // If local paths used, remind user to place images
  if (coverImage.startsWith('/') || (photos && photos.includes('/'))) {
    console.log(`\n📸 Image reminder:`);
    if (coverImage.startsWith('/')) {
      console.log(`   Cover image should be at: public${coverImage}`);
    }
    console.log(`   Make sure all local images are in the public/ folder!`);
  }
  
  console.log('\n📝 Next steps:');
  console.log(`1. Edit content/trips/${slug}/trip.mdx to add your story`);
  console.log('2. Run: npm run generate');
  console.log('3. Run: npm run dev\n');
  
  rl.close();
}

// Validate and fix image path
function validateImagePath(path) {
  // If it's a URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // If it starts with public/, remove it and add /
  if (path.startsWith('public/')) {
    return '/' + path.substring(7);
  }
  
  // If it starts with ~/ or absolute path, warn user
  if (path.startsWith('~/') || path.startsWith('/Users/') || path.startsWith('/home/')) {
    console.log('\n⚠️  WARNING: System paths are not supported!');
    console.log('   Please use one of these formats:');
    console.log('   - /images/members/photo.jpg (for files in public/ folder)');
    console.log('   - https://example.com/photo.jpg (for external URLs)');
    return null;
  }
  
  // If it doesn't start with /, add it
  if (!path.startsWith('/')) {
    return '/' + path;
  }
  
  return path;
}

// Upload Member
async function uploadMember() {
  console.log('\n👥 UPLOAD NEW LAZIER/MEMBER\n');
  
  const name = await ask('Full Name: ');
  const nickname = await ask('Nickname: ');
  const role = await ask('Role (e.g., "Climber", "Sprinter"): ');
  const bio = await ask('Short Bio (1 sentence): ');
  
  let avatar;
  while (true) {
    avatar = await ask('Avatar Image URL or path: ');
    const validatedPath = validateImagePath(avatar);
    
    if (validatedPath === null) {
      console.log('❌ Invalid path format. Please try again.\n');
      continue;
    }
    
    avatar = validatedPath;
    console.log(`✅ Using path: ${avatar}`);
    break;
  }
  
  const slug = slugify(name);
  const memberPath = path.join(MEMBERS_DIR, `${slug}.mdx`);
  
  if (fs.existsSync(memberPath)) {
    console.log(`\n⚠️  Member "${slug}" already exists!`);
    const overwrite = await ask('Overwrite? (yes/no): ');
    if (overwrite.toLowerCase() !== 'yes') {
      console.log('❌ Upload cancelled.');
      rl.close();
      return;
    }
  }
  
  const mdxContent = `---
name: "${name}"
nickname: "${nickname}"
role: "${role}"
bio: "${bio}"
avatar: "${avatar}"
---

Add optional extended bio here...
`;
  
  fs.writeFileSync(memberPath, mdxContent);
  
  console.log(`\n✅ Member created successfully!`);
  console.log(`📁 Location: content/members/${slug}.mdx`);
  
  // If local path, remind user to place the image
  if (avatar.startsWith('/')) {
    console.log(`\n📸 Image reminder:`);
    console.log(`   Make sure your image is at: public${avatar}`);
  }
  
  console.log('\n📝 Next steps:');
  console.log(`1. (Optional) Edit content/members/${slug}.mdx to add extended bio`);
  console.log('2. Run: npm run generate');
  console.log('3. Run: npm run dev\n');
  
  rl.close();
}

// Main CLI
const args = process.argv.slice(2);
const command = args[0];

if (command === 'trip') {
  uploadTrip().catch(err => {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  });
} else if (command === 'member') {
  uploadMember().catch(err => {
    console.error('Error:', err);
    rl.close();
    process.exit(1);
  });
} else {
  console.log('\n🌽 Lazy Team Content Uploader\n');
  console.log('Usage:');
  console.log('  npm run upload:trip     - Upload a new trip/adventure');
  console.log('  npm run upload:member   - Upload a new member/lazier\n');
  rl.close();
}
