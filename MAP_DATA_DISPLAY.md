# 🗺️ Trip Data on Homepage Map - Implementation Guide

## ✅ Current Status: ALREADY WORKING!

Your homepage map is **already displaying trip data** from all your trips! Here's how it works:

---

## 📍 How It Works

### 1. **Homepage Map Section** (`src/app/page.tsx` line 99)
```tsx
<GlobalMapClient trips={trips} />
```
This passes ALL your trips to the map component.

### 2. **FreeGlobalMap Component** (`src/components/map/FreeGlobalMap.tsx`)

The component automatically:
- ✅ Loads GPX data for each trip
- ✅ Converts coordinates to map format
- ✅ Draws route lines on the map
- ✅ Makes routes interactive (hover/click)
- ✅ Shows popup with trip details

### 3. **Interactive Features**

When users interact with the map:
- **Hover on route** → Line highlights in blue (#1743C6)
- **Click on route** → Popup shows trip details
- **Popup displays:**
  - Trip title
  - Location
  - Distance (km)
  - Elevation gain (m+)
  - Link to full trip page

---

## 🎨 Visual Behavior

### Route Styling
```javascript
// Default state
color: '#000000'      // Black
weight: 3             // Line thickness
opacity: 0.7          // Slightly transparent

// Hover state
color: '#1743C6'      // Your blue
weight: 5             // Thicker
opacity: 1            // Fully opaque
```

### Map View
- **Initial zoom level**: 5 (shows Europe region)
- **Center**: latitude: 45, longitude: 7 (around Northern Italy/Swiss Alps)
- **Scroll zoom**: Disabled (prevents accidental zooming)
- **Dragging**: Enabled (users can pan the map)

---

## 📊 Data Flow

```
1. Trips loaded from content/trips/
         ↓
2. npm run generate creates trips.json & trip-[slug].json files
         ↓
3. Homepage fetches trips data
         ↓
4. GlobalMapClient receives trips array
         ↓
5. FreeGlobalMap loads each trip's GeoJSON
         ↓
6. Routes rendered as interactive polylines
         ↓
7. User sees all trips on the map! 🎉
```

---

## 🔧 Customization Options

### Change Map Center/Zoom
Edit `src/components/map/FreeGlobalMap.tsx` line 44:

```tsx
// Current: Shows Northern Italy/Alps
initialViewState={{ latitude: 45, longitude: 7, zoom: 5 }}

// Example: Center on Modena
initialViewState={{ latitude: 44.6471, longitude: 10.9252, zoom: 6 }}

// Example: Show all of Italy
initialViewState={{ latitude: 42.5, longitude: 12.5, zoom: 6 }}
```

### Change Route Colors
Edit `src/components/map/FreeGlobalMap.tsx` lines 56-59:

```tsx
pathOptions={{
  color: '#000000',        // Change to any color (hex)
  weight: 3,               // Line thickness (1-10)
  opacity: 0.7,            // Transparency (0-1)
}}
```

### Change Hover Color
Edit line 66:

```tsx
color: '#1743C6',  // Your blue - change to any color
```

### Enable Scroll Zoom
Edit line 45:

```tsx
scrollZoom={true}  // Change false to true
```

---

## 🐛 Troubleshooting

### "I don't see routes on the map"

**Check 1**: Do your trips have GPX files?
```bash
ls content/trips/*/route.gpx
```

**Check 2**: Did you run generate?
```bash
npm run generate
```

**Check 3**: Check public/data folder:
```bash
ls public/data/trip-*.json
```

**Check 4**: Open browser console (F12) and check for errors

### "Routes are there but not in the right place"

Your GPX coordinates might be in a different region. Check the bounds in `public/data/trips.json`:

```json
"bounds": [
  [lon_min, lat_min],
  [lon_max, lat_max]
]
```

Adjust the initial map view to match your region.

---

## 📝 Adding More Trips

When you add new trips, they automatically appear on the homepage map:

```bash
# 1. Add new trip
npm run upload:trip

# 2. Regenerate data
npm run generate

# 3. Restart dev server
npm run dev

# Your new trip route now appears on the homepage map! 🎉
```

---

## 🎯 What the Map Shows

The homepage map displays:
- ✅ All trip routes from `content/trips/`
- ✅ Routes with valid GPX files
- ✅ Interactive hover effects
- ✅ Click-to-view popups
- ✅ Direct links to trip detail pages

It **automatically excludes**:
- ❌ Trips without GPX files
- ❌ Trips with invalid GeoJSON
- ❌ Empty routes

---

## 💡 Pro Tips

### 1. **Color-code trips by type**

Add different colors based on trip tags:

```tsx
const getRouteColor = (trip: Trip) => {
  if (trip.tags.includes('Mountain')) return '#8B4513';
  if (trip.tags.includes('Coastal')) return '#0077BE';
  return '#000000';
};

// Then use in pathOptions:
pathOptions={{
  color: getRouteColor(trip),
  // ...
}}
```

### 2. **Show trip stats on map**

Add markers at start/end points with elevation/distance info.

### 3. **Animate route drawing**

Use Leaflet's animated line plugins to "draw" routes on load.

---

## 🌍 Current Map Coverage

Based on your trips:
- **random**: Modena, Italy
- **coastal-ride**: French Riviera
- **alpine-climb**: Swiss Alps

All three should be visible on the map at the default zoom level!

---

## ✅ Summary

Your homepage map is **fully functional** and **already displays trip data**! 

**What you have:**
- ✅ Interactive map with all trip routes
- ✅ Hover effects
- ✅ Click popups with trip info
- ✅ Links to trip detail pages
- ✅ 100% free (no API keys)
- ✅ Unlimited usage

**No additional setup needed** - it just works! 🚴‍♂️🗺️

---

## 🔍 Visual Example

When a user visits your homepage:

1. They scroll to "Una mappa globale del dolore" section
2. They see a map with multiple black lines (your routes)
3. They hover over a route → it highlights in blue
4. They click the route → popup appears with trip details
5. They click "View Trip →" in popup → goes to trip detail page

Perfect! 🎉
