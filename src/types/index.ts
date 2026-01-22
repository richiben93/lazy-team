export interface TripStats {
  distance: number;
  elevationGain: number;
  bounds: [[number, number], [number, number]] | null;
}

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
}

export interface Member {
  slug: string;
  name: string;
  nickname: string;
  role: string;
  bio: string;
  avatar: string;
}
