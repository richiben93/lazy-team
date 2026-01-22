import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Trip, Member } from '@/types';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const GENERATED_DIR = path.join(process.cwd(), 'public', 'data');

export async function getTrips(): Promise<Trip[]> {
  const tripsJson = fs.readFileSync(path.join(GENERATED_DIR, 'trips.json'), 'utf8');
  return JSON.parse(tripsJson);
}

export async function getTripBySlug(slug: string): Promise<{ trip: Trip; content: string } | null> {
  const trips = await getTrips();
  const trip = trips.find((t) => t.slug === slug);
  if (!trip) return null;

  const mdxPath = path.join(CONTENT_DIR, 'trips', slug, 'trip.mdx');
  const mdxContent = fs.readFileSync(mdxPath, 'utf8');
  const { content } = matter(mdxContent);

  return { trip, content };
}

export async function getMembers(): Promise<Member[]> {
  const membersJson = fs.readFileSync(path.join(GENERATED_DIR, 'members.json'), 'utf8');
  return JSON.parse(membersJson);
}
