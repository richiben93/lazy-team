# Mapbox Configuration

This project uses Mapbox GL JS for beautiful, responsive map visualizations.

## Getting Your Mapbox Token

1. Go to [Mapbox](https://account.mapbox.com/)
2. Sign up for a free account (no credit card required)
3. Navigate to **Access Tokens** in your account dashboard
4. Copy your **Default Public Token** or create a new one
5. The free tier includes:
   - 50,000 map loads per month
   - Unlimited map requests
   - All map styles including Outdoors, Satellite, and more

## Setup

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Add your Mapbox token to `.env.local`:
   ```
   NEXT_PUBLIC_MAPBOX_TOKEN=your_actual_token_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Features

### Global Map
- Shows all trip routes overlaid on a single map
- Interactive hover effects (routes light up)
- Click on any route to see trip details
- Smooth zoom and pan controls

### Trip Detail Maps
- Individual trip route visualization
- 3D terrain rendering
- Start/end point markers
- Auto-fit to route bounds
- Outdoors style with topographic details

## Map Styles

The project uses:
- **Global Map**: `outdoors-v12` - Perfect for cycling routes with terrain contours
- **Trip Maps**: `outdoors-v12` with 3D terrain - Enhanced elevation visualization

You can change map styles by editing the `mapStyle` prop in the components:
- `streets-v12` - Clean street map
- `light-v11` - Minimal light theme
- `dark-v11` - Dark theme
- `satellite-v9` - Satellite imagery
- `satellite-streets-v12` - Satellite with labels

## Performance

Mapbox GL JS is highly optimized:
- Vector tiles load progressively
- WebGL-powered rendering
- Smooth 60fps animations
- Responsive on mobile devices
- Works great with large GPX files

## Comparison with Leaflet

**Why Mapbox GL JS?**

| Feature | Mapbox GL JS | Leaflet + OSM |
|---------|-------------|---------------|
| Performance | WebGL (60fps) | Canvas (slower) |
| 3D Terrain | ✅ Yes | ❌ No |
| Vector Tiles | ✅ Yes | ❌ No (raster only) |
| Mobile | ✅ Excellent | ⚠️ Good |
| Customization | ✅ Extensive | ⚠️ Limited |
| Free Tier | 50k loads/month | Unlimited (but slower) |

**When to use Leaflet:**
- No API key management
- Simple 2D maps only
- Very low traffic sites

**When to use Mapbox GL JS:** ✅
- Modern, beautiful maps
- Large GPX files
- Mobile responsiveness
- 3D terrain visualization
- Professional appearance
