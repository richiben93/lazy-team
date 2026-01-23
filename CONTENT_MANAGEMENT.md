# 🗑️ Content Management System - Complete Guide

## ✅ Full CRUD Operations Now Available!

Your Lazy Team website now has a complete content management system with CLI tools.

---

## 📋 Available Commands

### CREATE (Upload)
```bash
npm run upload:trip      # Add a new trip/adventure
npm run upload:member    # Add a new member/lazier
npm run upload           # Show upload help
```

### READ (View)
```bash
npm run dev              # Start server to view content
# Visit: http://localhost:3000
```

### UPDATE (Edit)
```bash
# Edit directly in content/ folders
# Then run: npm run generate
```

### DELETE (Remove)
```bash
npm run remove:trip      # Remove a trip
npm run remove:member    # Remove a member
npm run remove           # Show removal help
```

---

## 🚴 Managing Trips

### Add a New Trip

```bash
npm run upload:trip
```

**Interactive prompts:**
- Trip Title
- Date (YYYY-MM-DD)
- Location
- Tags (comma-separated)
- Cover Image URL
- Short Description
- Path to GPX file
- Photo URLs (optional)

**Result:**
- ✅ Creates `content/trips/[slug]/trip.mdx`
- ✅ Copies GPX file
- ✅ Ready to edit and publish

### Remove a Trip

```bash
npm run remove:trip
```

**Interactive steps:**
1. Shows numbered list of all trips
2. Select trip number
3. Confirm deletion by typing "DELETE"
4. Removes all trip files and data

**What gets deleted:**
- `content/trips/[slug]/` (entire folder)
- `public/data/trip-[slug].json`
- All GPX files, photos, and content

### Edit a Trip

```bash
# 1. Edit the file directly
code content/trips/[slug]/trip.mdx

# 2. Regenerate data
npm run generate

# 3. View changes
npm run dev
```

---

## 👥 Managing Members/Laziers

### Add a New Member

```bash
npm run upload:member
```

**Interactive prompts:**
- Full Name
- Nickname
- Role (e.g., "Climber", "Sprinter")
- Short Bio
- Avatar Image URL

**Result:**
- ✅ Creates `content/members/[slug].mdx`
- ✅ Ready to edit and publish

### Remove a Member

```bash
npm run remove:member
```

**Interactive steps:**
1. Shows numbered list of all members
2. Select member number
3. Confirm deletion by typing "DELETE"
4. Removes member file

**What gets deleted:**
- `content/members/[slug].mdx`

### Edit a Member

```bash
# 1. Edit the file directly
code content/members/[slug].mdx

# 2. Regenerate data
npm run generate

# 3. View changes
npm run dev
```

---

## 🔄 Complete Workflow Examples

### Workflow 1: Add → Edit → Publish

```bash
# 1. Add new trip
npm run upload:trip
# (Answer prompts)

# 2. Edit the generated file
code content/trips/dolomites-epic/trip.mdx
# (Write your story, adjust metadata)

# 3. Generate data files
npm run generate

# 4. Preview locally
npm run dev
# Visit: http://localhost:3000

# 5. Deploy (when ready)
npm run build
```

### Workflow 2: Remove → Regenerate

```bash
# 1. Remove unwanted trip
npm run remove:trip
# (Select trip, type DELETE)

# 2. Update data files
npm run generate

# 3. Verify removal
npm run dev
# Visit homepage - removed trip no longer appears
```

### Workflow 3: Bulk Update

```bash
# 1. Manually edit multiple trip files
# Edit content/trips/trip1/trip.mdx
# Edit content/trips/trip2/trip.mdx
# Edit content/trips/trip3/trip.mdx

# 2. Regenerate all data at once
npm run generate

# 3. Preview all changes
npm run dev
```

---

## 🛡️ Safety Features

### Upload Safety
- ✅ Checks for existing content
- ✅ Asks before overwriting
- ✅ Validates file paths
- ✅ Auto-generates valid slugs

### Removal Safety
- ✅ Shows what will be deleted
- ✅ Requires "DELETE" confirmation
- ✅ Lists all affected files
- ✅ Cancel anytime option
- ✅ No accidental deletions

---

## 📊 Data Files

### Generated Files (Auto-created)

```
public/data/
├── trips.json              # All trips metadata
├── members.json            # All members data
├── trip-[slug].json        # Individual trip GeoJSON
└── ...
```

**When to regenerate:**
```bash
npm run generate
```

**Regenerate after:**
- ✅ Adding new content
- ✅ Editing content
- ✅ Removing content
- ✅ Modifying GPX files

---

## 🎯 Quick Reference

### Common Tasks

| Task | Command |
|------|---------|
| Add trip | `npm run upload:trip` |
| Remove trip | `npm run remove:trip` |
| Add member | `npm run upload:member` |
| Remove member | `npm run remove:member` |
| Update data | `npm run generate` |
| Preview site | `npm run dev` |
| Build site | `npm run build` |

### File Locations

| Content Type | Location |
|--------------|----------|
| Trip content | `content/trips/[slug]/trip.mdx` |
| Trip GPX | `content/trips/[slug]/route.gpx` |
| Trip images | `public/trips/[slug]/` |
| Member profiles | `content/members/[slug].mdx` |
| Generated data | `public/data/` |

---

## 🔍 Troubleshooting

### "Trip doesn't appear on homepage map"

```bash
# 1. Check if GPX file exists
ls content/trips/[slug]/route.gpx

# 2. Regenerate data
npm run generate

# 3. Check generated GeoJSON
cat public/data/trip-[slug].json

# 4. Restart dev server
npm run dev
```

### "Image not showing"

Check image path format:
- ✅ `/trips/my-trip/photo.jpg` (public folder)
- ✅ `https://images.unsplash.com/...` (external)
- ❌ `~/Documents/photo.jpg` (invalid)
- ❌ `../images/photo.jpg` (invalid)

### "Removal didn't work"

```bash
# 1. Check if file still exists
ls content/trips/[slug]/

# 2. Regenerate data
npm run generate

# 3. Clear Next.js cache
rm -rf .next

# 4. Rebuild
npm run build
```

---

## 📝 Best Practices

### Before Adding Content
1. ✅ Prepare all files (GPX, photos)
2. ✅ Upload images to hosting
3. ✅ Have metadata ready (title, date, location)

### Before Removing Content
1. ✅ Double-check you're removing the right item
2. ✅ Backup if needed (copy folder elsewhere)
3. ✅ Remember: deletion is permanent!

### After Any Changes
1. ✅ Run `npm run generate`
2. ✅ Test locally with `npm run dev`
3. ✅ Check homepage map shows correctly
4. ✅ Verify trip detail pages work

---

## 🎉 Summary

You now have a complete content management system:

**✅ Can Add:**
- Trips with GPX routes
- Members/Laziers
- Photos and metadata

**✅ Can Remove:**
- Trips (with all files)
- Members
- Safely with confirmations

**✅ Can Edit:**
- Direct file editing
- Auto-regeneration
- Live preview

**✅ Fully Integrated:**
- Homepage map updates
- Trip listings update
- Member pages update
- Zero manual JSON editing

**All operations are:**
- 🛡️ Safe (confirmation required)
- 🎯 Simple (interactive CLI)
- ⚡ Fast (instant generation)
- 🔄 Reversible (can re-add content)

Your Lazy Team website is now fully manageable! 🚴‍♂️🌽
