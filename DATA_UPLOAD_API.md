# Lazy Team Data Upload API Documentation

This document describes the standardized format for uploading new content to your Lazy Team website.

## 📁 Directory Structure

```
content/
├── trips/              # Adventure/Rides data
│   └── [trip-slug]/
│       ├── trip.mdx    # Trip metadata and story
│       ├── route.gpx   # GPX file for map
│       └── photos/     # (optional) Local photos
│
└── members/            # Team members (Laziers)
    └── [name].mdx      # Member profile
```

---

## 🚴 1. Adding a New Trip/Adventure

### Step 1: Create Trip Directory
Create a new folder in `content/trips/` with a URL-friendly slug:

```bash
content/trips/your-trip-name/
```

### Step 2: Create `trip.mdx` File

```markdown
---
title: "Your Trip Title"
date: "YYYY-MM-DD"
location: "City, Country"
tags: ["Mountain", "Epic", "Gravel"]
coverImage: "https://your-image-url.com/cover.jpg"
gpxFile: "route.gpx"
photos:
  - "https://image-url-1.jpg"
  - "https://image-url-2.jpg"
  - "https://image-url-3.jpg"
  - "https://image-url-4.jpg"
excerpt: "A short description (1-2 sentences) of the adventure."
---

# Your Trip Story

Write your adventure story here in Markdown format.

You can include:
- **Bold text** and *italic text*
- Lists and bullet points
- Links: [text](url)
- Images: ![alt](url)

## Sections

Add as many sections as you want to tell your story.
```

### Step 3: Add GPX File
Add your GPS track file as `route.gpx` in the same folder:

```
content/trips/your-trip-name/route.gpx
```

The system will automatically:
- Extract distance, elevation gain, and bounds
- Generate a map visualization
- Create an elevation profile chart
- Convert GPX to GeoJSON for display

---

## 👥 2. Adding a New Lazier/Member

Create a new file in `content/members/`:

```bash
content/members/firstname-lastname.mdx
```

### Member File Format

```markdown
---
name: "Full Name"
nickname: "Cool Nickname"
role: "Climber / Sprinter / All-Rounder / etc."
bio: "Short bio (1 sentence describing the member)"
avatar: "https://photo-url.com/avatar.jpg"
---

Optional extended bio or story in Markdown format.
```

---

## 📊 3. Data Fields Reference

### Trip Fields (Required)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `title` | String | Trip name | `"Alpine Challenge"` |
| `date` | Date | Trip date (YYYY-MM-DD) | `"2025-08-20"` |
| `location` | String | Location/region | `"Dolomites, Italy"` |
| `tags` | Array | Category tags | `["Mountain", "Epic"]` |
| `coverImage` | URL | Hero image URL | `"https://..."` |
| `gpxFile` | String | GPX filename | `"route.gpx"` |
| `excerpt` | String | Short description | `"A grueling..."` |

### Trip Fields (Optional)

| Field | Type | Description |
|-------|------|-------------|
| `photos` | Array | Additional photo URLs |

### Member Fields (Required)

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Full name | `"Marco Rossi"` |
| `nickname` | String | Nickname/alias | `"The Bullet"` |
| `role` | String | Riding specialty | `"Sprinter"` |
| `bio` | String | Short bio | `"Fast on flats..."` |
| `avatar` | URL | Profile photo URL | `"https://..."` |

---

## 🎯 4. Quick Upload Checklist

### For a New Trip:
- [ ] Create folder: `content/trips/trip-slug/`
- [ ] Add `trip.mdx` with all required fields
- [ ] Add `route.gpx` GPX file
- [ ] Upload cover image (use Unsplash or host your own)
- [ ] Upload additional photos (optional)
- [ ] Run `npm run generate` to process data
- [ ] Run `npm run dev` to preview locally

### For a New Lazier:
- [ ] Create file: `content/members/name.mdx`
- [ ] Add all required fields
- [ ] Upload avatar image
- [ ] Run `npm run generate` to process data
- [ ] Run `npm run dev` to preview locally

---

## 🔧 5. Processing Your Data

After adding content, run:

```bash
# Generate JSON data files from content
npm run generate

# Start development server to preview
npm run dev

# Build for production
npm run build
```

The `generate` script will:
1. Parse all `.mdx` files in `content/trips/` and `content/members/`
2. Process GPX files and extract stats
3. Generate GeoJSON for map visualization
4. Create optimized JSON files in `public/data/`:
   - `trips.json` - All trips metadata
   - `members.json` - All members data
   - `trip-[slug].json` - Individual trip GeoJSON

---

## 📸 6. Image Guidelines

### Cover Images (Trips)
- **Recommended size:** 2000x1200px or larger
- **Aspect ratio:** 16:9 or 5:3
- **Format:** JPG or WebP
- **Sources:** Unsplash, your own photos

### Gallery Photos (Trips)
- **Recommended size:** 1200x800px or larger
- **Format:** JPG or WebP

### Avatar Images (Members)
- **Recommended size:** 800x800px
- **Aspect ratio:** 1:1 (square)
- **Format:** JPG or WebP

### Image Hosting Options

#### Option 1: Self-Hosted (Recommended for Local Photos)
1. Place your images in the `public/` directory
2. Create organized subfolders: `public/trips/[trip-slug]/`
3. Reference with a leading slash: `/trips/my-trip/photo.jpg`

**Example:**
```
public/
└── trips/
    └── dolomites-2025/
        ├── cover.jpg
        ├── photo1.jpg
        └── photo2.jpg
```

**In trip.mdx:**
```yaml
coverImage: "/trips/dolomites-2025/cover.jpg"
photos:
  - "/trips/dolomites-2025/photo1.jpg"
  - "/trips/dolomites-2025/photo2.jpg"
```

⚠️ **IMPORTANT:** Never use `~` or absolute system paths like:
- ❌ `~/Documents/me/lazy-team/infos/photo.jpg`
- ❌ `/Users/yourname/Documents/photo.jpg`

Always use:
- ✅ `/trips/my-trip/photo.jpg` (for public folder)
- ✅ `https://images.unsplash.com/...` (for external URLs)

#### Option 2: Unsplash (Free Stock Photos)
Use direct URLs: `https://images.unsplash.com/photo-123...?auto=format&fit=crop&q=80&w=2000`

#### Option 3: Cloud Storage
Use any CDN (Cloudinary, Imgur, etc.): `https://your-cdn.com/image.jpg`

---

## 🗺️ 7. GPX File Requirements

### Creating GPX Files
- Export from Strava, Garmin Connect, or any GPS device
- Ensure it's a `.gpx` file (not `.fit` or `.tcx`)
- Include elevation data for best results

### GPX Data Extracted
The system automatically extracts:
- **Total distance** (in meters)
- **Elevation gain** (positive meters)
- **Bounding box** (for map centering)
- **Route coordinates** (for map line)
- **Elevation profile** (for chart)

---

## 📝 8. Example API Call (Manual Upload)

If you want to send me data to upload for you, use this format:

### Trip Upload Request

```json
{
  "type": "trip",
  "data": {
    "slug": "epic-dolomites-2025",
    "title": "Dolomites Epic Ride",
    "date": "2025-09-15",
    "location": "Dolomites, Italy",
    "tags": ["Mountain", "Epic", "Climbing"],
    "coverImage": "https://images.unsplash.com/photo-123...",
    "excerpt": "5 mountain passes in one day. Pain and beauty in equal measure.",
    "story": "# The Challenge\n\nWe started at dawn...",
    "photos": [
      "https://images.unsplash.com/photo-456...",
      "https://images.unsplash.com/photo-789..."
    ]
  },
  "gpx": "<?xml version=\"1.0\"?><gpx>...</gpx>"
}
```

### Member Upload Request

```json
{
  "type": "member",
  "data": {
    "slug": "alex-rider",
    "name": "Alex Rider",
    "nickname": "The Engine",
    "role": "All-Rounder",
    "bio": "Consistent power, never gives up.",
    "avatar": "https://images.unsplash.com/photo-234..."
  }
}
```

---

## 🚀 9. Automation Ideas

### Future API Endpoints (To Build)
If you want a proper API for uploads:

1. **POST /api/trips** - Upload new trip
2. **POST /api/members** - Add new member  
3. **POST /api/upload-gpx** - Upload GPX file
4. **POST /api/upload-image** - Upload image

Let me know if you want me to build these REST endpoints using Next.js API routes!

---

## 💡 Quick Tips

- **Slugs** should be lowercase with hyphens: `epic-ride-2025`
- **Dates** must be YYYY-MM-DD format
- **Tags** are case-sensitive, be consistent
- **Images** should be HTTPS URLs
- **GPX files** should include elevation data
- **Stories** support full Markdown syntax

---

## ❓ Need Help?

Just send me:
1. **Trip name** and **date**
2. **GPX file** (attach or send link)
3. **Photos** (URLs or files)
4. **Short description**

I'll format and upload it for you! 🚴‍♂️

---

## 🗑️ Removing Trips or Members

### Remove a Trip

To delete a trip and all its associated files:

```bash
npm run remove:trip
```

**What happens:**
1. Shows a list of all trips with numbers
2. You select the trip number to remove
3. Shows what will be deleted (for confirmation)
4. You type "DELETE" to confirm
5. Removes:
   - `content/trips/[slug]/` (entire folder)
   - `public/data/trip-[slug].json` (generated GeoJSON)
   - All GPX files, images, and content

**Example:**
```bash
$ npm run remove:trip

🗑️  REMOVE TRIP

Available trips:

  1. Coastal Ride (coastal-ride)
  2. Alpine Climb (alpine-climb)
  3. random (random)

Enter trip number to remove (or "cancel"): 3

⚠️  You are about to remove:
   Title: random
   Slug: random
   This will delete:
   - content/trips/random/
   - public/data/trip-random.json
   - All associated files (GPX, images, etc.)

Type "DELETE" to confirm: DELETE

🗑️  Removing content/trips/random...
🗑️  Removing public/data/trip-random.json...

✅ Trip "random" removed successfully!

📝 Next steps:
1. Run: npm run generate (to update trips.json)
2. Run: npm run dev
```

### Remove a Member/Lazier

To delete a member profile:

```bash
npm run remove:member
```

**What happens:**
1. Shows a list of all members with numbers
2. You select the member number to remove
3. Shows what will be deleted (for confirmation)
4. You type "DELETE" to confirm
5. Removes: `content/members/[slug].mdx`

**Example:**
```bash
$ npm run remove:member

🗑️  REMOVE MEMBER/LAZIER

Available members:

  1. Marco Sprint (marco)
  2. Sarah Climber (sarah)
  3. Richi Endurance (richi)

Enter member number to remove (or "cancel"): 2

⚠️  You are about to remove:
   Name: Sarah Climber
   Slug: sarah
   This will delete:
   - content/members/sarah.mdx

Type "DELETE" to confirm: DELETE

🗑️  Removing content/members/sarah.mdx...

✅ Member "Sarah Climber" removed successfully!

📝 Next steps:
1. Run: npm run generate (to update members.json)
2. Run: npm run dev
```

### Safety Features

The removal script includes several safety features:

✅ **Interactive selection** - Shows numbered list, no typing slugs
✅ **Confirmation required** - Must type "DELETE" to confirm
✅ **Shows what will be deleted** - Full list before deletion
✅ **Cancel anytime** - Type "cancel" to abort
✅ **No accidental deletion** - Requires explicit confirmation

### After Removal

After removing a trip or member, remember to:

1. **Regenerate data files:**
   ```bash
   npm run generate
   ```

2. **Restart dev server:**
   ```bash
   npm run dev
   ```

The removed trip/member will:
- ❌ No longer appear on the homepage map
- ❌ No longer appear in the trips/members list
- ❌ Return 404 if someone tries to access its URL
- ✅ Be completely removed from the site

---

