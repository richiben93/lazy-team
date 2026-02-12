export interface TripStats {
  distance: number;
  elevationGain: number;
  bounds: [[number, number], [number, number]] | null;
}

export type TripType = 'one-day' | 'overnight' | 'multi-day';
export type TerrainType = 'road' | 'gravel' | 'mtb' | 'mixed';

export interface Trip {
  slug: string;
  title: string;
  date: string;
  location: string;
  tags: string[];
  coverImage: string;
  gpxFile: string;
  excerpt: string;
  photos?: string[];
  stats: TripStats;
  geojsonUrl: string;
  author: string; // Member slug
  type: TripType;
  terrain: TerrainType;
}

export interface Member {
  slug: string;
  name: string;
  nickname: string;
  role: string;
  bio: string;
  avatar: string;
  emoji: string; // Emoji per identificare il Lazer
  isAdmin?: boolean; // Flag per admin
}

export interface AboutContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  values: {
    title: string;
    description: string;
  }[];
}

