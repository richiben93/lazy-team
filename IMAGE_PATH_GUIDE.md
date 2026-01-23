# 📸 Image Path Guide - Quick Reference

## ✅ CORRECT Image Path Formats

### For Local Images (in public folder)

```yaml
# ✅ CORRECT - starts with /
avatar: "/images/members/photo.jpg"
coverImage: "/trips/my-trip/cover.jpg"

# The actual file location:
# public/images/members/photo.jpg
# public/trips/my-trip/cover.jpg
```

### For External URLs

```yaml
# ✅ CORRECT - full URL
avatar: "https://images.unsplash.com/photo-123...?w=800"
coverImage: "https://example.com/photo.jpg"
```

---

## ❌ WRONG Image Path Formats

### Never Use System Paths

```yaml
# ❌ WRONG - tilde path
avatar: "~/Documents/photos/me.jpg"

# ❌ WRONG - absolute system path
avatar: "/Users/yourname/Documents/photo.jpg"

# ❌ WRONG - relative path
avatar: "../images/photo.jpg"

# ❌ WRONG - includes "public" in path
avatar: "public/images/photo.jpg"
```

---

## 🔧 How to Fix Common Errors

### Error: "Failed to load image"

**Symptom:**
```
Error: Invalid src prop on next/image
```

**Cause:** Using system path instead of web path

**Fix:**

1. **Move image to public folder:**
   ```bash
   mkdir -p public/images/members
   cp ~/Documents/photo.jpg public/images/members/
   ```

2. **Update the path in your .mdx file:**
   ```yaml
   # Change from:
   avatar: "~/Documents/photo.jpg"
   
   # To:
   avatar: "/images/members/photo.jpg"
   ```

3. **Regenerate data:**
   ```bash
   npm run generate
   ```

---

## 📁 Recommended Folder Structure

```
public/
├── images/
│   ├── members/           # Member avatars
│   │   ├── john.jpg
│   │   └── jane.jpg
│   └── common/            # Shared images
│       └── logo.png
└── trips/
    ├── dolomites-2025/    # Trip-specific images
    │   ├── cover.jpg
    │   ├── photo1.jpg
    │   └── photo2.jpg
    └── coastal-ride/
        └── cover.jpg
```

---

## 🎯 Quick Checklist

When adding images, check:

- [ ] Image is in `public/` folder (or using external URL)
- [ ] Path starts with `/` (not `public/`)
- [ ] No `~` or system paths
- [ ] Run `npm run generate` after changes
- [ ] Test with `npm run dev`

---

## 🔄 Upload Script Auto-Validation

The upload scripts now automatically validate paths:

```bash
$ npm run upload:member

Avatar Image URL or path: public/images/members/john.jpg
✅ Using path: /images/members/john.jpg

# Auto-fixes "public/" prefix!
```

**Auto-corrections:**
- `public/images/photo.jpg` → `/images/photo.jpg` ✅
- `images/photo.jpg` → `/images/photo.jpg` ✅
- `~/Documents/photo.jpg` → ❌ Error + instructions

---

## 💡 Pro Tips

### 1. Use Consistent Naming

```
public/
└── images/
    └── members/
        ├── john-smith.jpg      # Match slug
        ├── jane-doe.jpg        # Match slug
        └── alex-rider.jpg      # Match slug
```

### 2. Optimize Images Before Upload

- **Members:** 800x800px (square)
- **Trip Covers:** 2000x1200px (16:9)
- **Gallery Photos:** 1200x800px

### 3. Use External URLs for Large Collections

If you have many photos, consider:
- Unsplash (free stock photos)
- Imgur (free hosting)
- Cloudinary (free tier: 25GB)

---

## 🆘 Still Having Issues?

### Debug Steps:

1. **Check file exists:**
   ```bash
   ls public/images/members/photo.jpg
   ```

2. **Check generated data:**
   ```bash
   cat public/data/members.json | grep avatar
   ```

3. **Verify path format:**
   ```bash
   # Should show paths starting with /
   # ✅ "/images/members/photo.jpg"
   # ❌ "public/images/members/photo.jpg"
   ```

4. **Clear cache and rebuild:**
   ```bash
   rm -rf .next
   npm run generate
   npm run build
   ```

---

## 📋 Common Scenarios

### Scenario 1: Adding Member with Local Photo

```bash
# 1. Place image in public folder
mkdir -p public/images/members
cp ~/Downloads/john-photo.jpg public/images/members/john.jpg

# 2. Upload member
npm run upload:member
# Avatar: /images/members/john.jpg

# 3. Generate & view
npm run generate
npm run dev
```

### Scenario 2: Adding Trip with Multiple Photos

```bash
# 1. Create trip folder in public
mkdir -p public/trips/epic-ride

# 2. Copy all photos
cp ~/Photos/ride/*.jpg public/trips/epic-ride/

# 3. Upload trip
npm run upload:trip
# Cover: /trips/epic-ride/cover.jpg
# Photos: /trips/epic-ride/photo1.jpg, /trips/epic-ride/photo2.jpg

# 4. Generate & view
npm run generate
npm run dev
```

### Scenario 3: Using Unsplash

```bash
# 1. Go to https://unsplash.com
# 2. Find image and copy URL
# 3. Add to upload

npm run upload:member
# Avatar: https://images.unsplash.com/photo-123...?w=800

# No file management needed! ✅
```

---

## ✅ Summary

**Golden Rules:**
1. 🌐 External URLs: Use full `https://` URL
2. 📁 Local files: Must be in `public/` folder
3. 🔗 Local paths: Must start with `/` (not `public/`)
4. ❌ Never: Use `~`, system paths, or `public/` prefix
5. 🔄 Always: Run `npm run generate` after changes

Follow these rules and your images will work perfectly! 📸✨
