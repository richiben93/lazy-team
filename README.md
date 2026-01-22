# LAZY TEAM

A premium portfolio-grade website for the Lazy Team cycling collective. Built with Next.js, Tailwind CSS, Framer Motion, and Mapbox.

## Features

- **Dynamic GPX Processing**: Build-time parsing of GPX files into GeoJSON and stats.
- **Interactive Maps**: Global overview and individual trip routes using Mapbox GL.
- **Premium Editorial Design**: High-end typography, large imagery, and smooth transitions.
- **Content-Driven**: Fully file-based content using MDX and frontmatter.
- **Responsive & Accessible**: Optimized for all devices with a focus on performance.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Motion**: Framer Motion
- **Maps**: Mapbox GL JS / react-map-gl
- **Content**: MDX + Gray-matter
- **Data**: GPXParser

## Getting Started

### 1. Prerequisites

You'll need a Mapbox public token. Get one at [mapbox.com](https://www.mapbox.com/).

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 3. Installation

```bash
npm install
```

### 4. Data Generation

Before running the dev server or building, generate the trip and member data:

```bash
npm run generate
```

### 5. Development

```bash
npm run dev
```

## Adding Content

### Adding a Trip

1. Create a folder in `content/trips/{slug}/`.
2. Add `trip.mdx` with the following frontmatter:
   ```markdown
   ---
   title: "Trip Title"
   date: "YYYY-MM-DD"
   location: "Region, Country"
   tags: ["Tag1", "Tag2"]
   coverImage: "https://..."
   gpxFile: "route.gpx"
   excerpt: "Short summary..."
   photos:
     - "https://..."
   ---
   ```
3. Place `route.gpx` in the same folder.
4. Run `npm run generate`.

### Adding a Member

1. Create a file in `content/members/{slug}.mdx`.
2. Add the following frontmatter:
   ```markdown
   ---
   name: "Full Name"
   nickname: "The Legend"
   role: "Role"
   bio: "Brief bio..."
   avatar: "https://..."
   ---
   ```
3. Run `npm run generate`.

## Deployment

This project is ready to be deployed on Vercel.

1. Push the code to a GitHub repository.
2. Connect the repository to Vercel.
3. Add `NEXT_PUBLIC_MAPBOX_TOKEN` as an Environment Variable in Vercel.
4. Vercel will automatically run `npm run build` (which includes `npm run generate`).

## License

MIT
