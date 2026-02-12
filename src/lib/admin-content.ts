import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

const CONTENT_DIR = path.join(process.cwd(), 'content');
const TRIPS_DIR = path.join(CONTENT_DIR, 'trips');
const MEMBERS_DIR = path.join(CONTENT_DIR, 'members');
const GENERATED_DIR = path.join(process.cwd(), 'public', 'data');

type TripInput = {
  title: string;
  date: string;
  location: string;
  tags: string[];
  coverImage: string;
  excerpt: string;
  photos?: string[];
  gpxContent?: string | null;
};

type MemberInput = {
  name: string;
  nickname: string;
  role: string;
  bio: string;
  avatar: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeImagePath(value: string) {
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return value;
  }

  if (value.startsWith('public/')) {
    return `/${value.substring(7)}`;
  }

  if (value.startsWith('~/') || value.startsWith('/Users/') || value.startsWith('/home/')) {
    return null;
  }

  if (!value.startsWith('/')) {
    return `/${value}`;
  }

  return value;
}

function ensureDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function renderTripMdx(input: TripInput) {
  const tags = input.tags.map((tag) => `"${tag}"`).join(', ');
  const photos = input.photos?.length
    ? `\nphotos:\n${input.photos.map((photo) => `  - "${photo}"`).join('\n')}`
    : '';

  return `---
title: "${input.title}"
date: "${input.date}"
location: "${input.location}"
tags: [${tags}]
coverImage: "${input.coverImage}"
gpxFile: "route.gpx"${photos}
excerpt: "${input.excerpt}"
---

# The Story

Write your adventure story here...
`;
}

function renderMemberMdx(input: MemberInput) {
  return `---
name: "${input.name}"
nickname: "${input.nickname}"
role: "${input.role}"
bio: "${input.bio}"
avatar: "${input.avatar}"
---

Add optional extended bio here...
`;
}

async function runGenerate() {
  await execFileAsync('node', ['scripts/generate-data.mjs'], {
    cwd: process.cwd(),
  });
}

export async function createTrip(input: TripInput) {
  ensureDirectory(TRIPS_DIR);

  const slug = slugify(input.title);
  const tripDir = path.join(TRIPS_DIR, slug);

  if (fs.existsSync(path.join(tripDir, 'trip.mdx'))) {
    throw new Error('Trip already exists');
  }

  ensureDirectory(tripDir);

  const mdx = renderTripMdx(input);
  fs.writeFileSync(path.join(tripDir, 'trip.mdx'), mdx);

  if (input.gpxContent && input.gpxContent.trim().length > 0) {
    fs.writeFileSync(path.join(tripDir, 'route.gpx'), input.gpxContent.trim());
  }

  await runGenerate();

  return slug;
}

export async function updateTrip(slug: string, input: TripInput) {
  const tripDir = path.join(TRIPS_DIR, slug);
  const mdxPath = path.join(tripDir, 'trip.mdx');

  if (!fs.existsSync(mdxPath)) {
    throw new Error('Trip not found');
  }

  const mdx = renderTripMdx(input);
  fs.writeFileSync(mdxPath, mdx);

  if (input.gpxContent && input.gpxContent.trim().length > 0) {
    fs.writeFileSync(path.join(tripDir, 'route.gpx'), input.gpxContent.trim());
  }

  await runGenerate();
}

export async function createMember(input: MemberInput) {
  ensureDirectory(MEMBERS_DIR);

  const slug = slugify(input.name);
  const memberPath = path.join(MEMBERS_DIR, `${slug}.mdx`);

  if (fs.existsSync(memberPath)) {
    throw new Error('Member already exists');
  }
  const mdx = renderMemberMdx(input);

  fs.writeFileSync(memberPath, mdx);

  await runGenerate();

  return slug;
}

export async function updateMember(slug: string, input: MemberInput) {
  const memberPath = path.join(MEMBERS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(memberPath)) {
    throw new Error('Member not found');
  }

  const mdx = renderMemberMdx(input);
  fs.writeFileSync(memberPath, mdx);

  await runGenerate();
}

export function sanitizeTripInput(raw: TripInput) {
  const normalizedCover = normalizeImagePath(raw.coverImage.trim());
  if (!normalizedCover) {
    throw new Error('Invalid cover image path');
  }

  const tags = raw.tags.map((tag) => tag.trim()).filter(Boolean);
  const photos = raw.photos
    ?.map((photo) => normalizeImagePath(photo.trim()) ?? '')
    .filter(Boolean);

  return {
    ...raw,
    title: raw.title.trim(),
    date: raw.date.trim(),
    location: raw.location.trim(),
    excerpt: raw.excerpt.trim(),
    coverImage: normalizedCover,
    tags,
    photos,
  };
}

export function sanitizeMemberInput(raw: MemberInput) {
  const normalizedAvatar = normalizeImagePath(raw.avatar.trim());
  if (!normalizedAvatar) {
    throw new Error('Invalid avatar image path');
  }

  return {
    ...raw,
    name: raw.name.trim(),
    nickname: raw.nickname.trim(),
    role: raw.role.trim(),
    bio: raw.bio.trim(),
    avatar: normalizedAvatar,
  };
}

export async function removeTrip(slug: string) {
  const tripDir = path.join(TRIPS_DIR, slug);
  if (fs.existsSync(tripDir)) {
    fs.rmSync(tripDir, { recursive: true, force: true });
  }

  const geojsonPath = path.join(GENERATED_DIR, `trip-${slug}.json`);
  if (fs.existsSync(geojsonPath)) {
    fs.rmSync(geojsonPath, { force: true });
  }

  await runGenerate();
}

export async function removeMember(slug: string) {
  const memberPath = path.join(MEMBERS_DIR, `${slug}.mdx`);
  if (fs.existsSync(memberPath)) {
    fs.rmSync(memberPath, { force: true });
  }

  await runGenerate();
}
