import fs from 'fs';
import path from 'path';
import gpxParser from 'gpxparser';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const TRIPS_DIR = path.join(CONTENT_DIR, 'trips');
const MEMBERS_DIR = path.join(CONTENT_DIR, 'members');
const GENERATED_DIR = path.join(process.cwd(), 'public', 'data');

if (!fs.existsSync(GENERATED_DIR)) {
  fs.mkdirSync(GENERATED_DIR, { recursive: true });
}

async function generate() {
  // Process Trips
  const trips = [];
  const tripDirs = fs.readdirSync(TRIPS_DIR).filter(dir => 
    fs.statSync(path.join(TRIPS_DIR, dir)).isDirectory()
  );

  for (const slug of tripDirs) {
    const tripPath = path.join(TRIPS_DIR, slug);
    const mdxPath = path.join(tripPath, 'trip.mdx');
    const gpxPath = path.join(tripPath, 'route.gpx');

    if (!fs.existsSync(mdxPath)) continue;

    const mdxContent = fs.readFileSync(mdxPath, 'utf8');
    const { data: frontmatter } = matter(mdxContent);

    let stats = { distance: 0, elevationGain: 0, bounds: null };
    let geojson = null;

    if (fs.existsSync(gpxPath)) {
      const gpxContent = fs.readFileSync(gpxPath, 'utf8');
      const gpx = new gpxParser();
      gpx.parse(gpxContent);

      const track = gpx.tracks[0];
      if (track) {
        stats = {
          distance: track.distance.total,
          elevationGain: track.elevation.pos || 0,
          bounds: [
            [Math.min(...track.points.map(p => p.lon)), Math.min(...track.points.map(p => p.lat))],
            [Math.max(...track.points.map(p => p.lon)), Math.max(...track.points.map(p => p.lat))]
          ]
        };
        geojson = gpx.toGeoJSON();
        
        fs.writeFileSync(
          path.join(GENERATED_DIR, `trip-${slug}.json`),
          JSON.stringify(geojson)
        );
      }
    }

    trips.push({
      slug,
      ...frontmatter,
      stats,
      geojsonUrl: `/data/trip-${slug}.json`
    });
  }

  trips.sort((a, b) => new Date(b.date) - new Date(a.date));
  fs.writeFileSync(path.join(GENERATED_DIR, 'trips.json'), JSON.stringify(trips, null, 2));

  // Process Members
  const members = [];
  if (fs.existsSync(MEMBERS_DIR)) {
    const memberFiles = fs.readdirSync(MEMBERS_DIR).filter(file => file.endsWith('.mdx'));
    for (const file of memberFiles) {
      const slug = file.replace('.mdx', '');
      const mdxPath = path.join(MEMBERS_DIR, file);
      const mdxContent = fs.readFileSync(mdxPath, 'utf8');
      const { data: frontmatter } = matter(mdxContent);
      members.push({
        slug,
        ...frontmatter
      });
    }
  }
  fs.writeFileSync(path.join(GENERATED_DIR, 'members.json'), JSON.stringify(members, null, 2));

  console.log(`Generated data for ${trips.length} trips and ${members.length} members.`);
}

// Check if gray-matter is installed, if not we might need it
// (I didn't install it earlier, let me check)
generate().catch(err => {
  console.error(err);
  process.exit(1);
});
