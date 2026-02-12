# Interactive Global Map Features

## ✨ New Features Added

### 1. **Trip Legend**
- Located in the top-left corner of the map
- Shows all trips with unique color-coded lines
- Each trip displays:
  - Colored line indicator (matching the route on the map)
  - Trip title
  - Distance and elevation gain
- **Interactive**: Click any trip in the legend to navigate to its detail page
- **Hover effect**: Legend items highlight when you hover over them
- **Scrollable**: If you have many trips, the legend scrolls smoothly

### 2. **Color-Coded Routes**
- Each trip route has a unique color automatically generated using HSL color space
- Colors are distributed evenly across the spectrum for maximum distinction
- Routes become brighter and thicker when hovered

### 3. **Rich Hover Tooltips**
When you hover over a route (either on the map or in the legend), you see:
- **Trip cover image** - Full-width beautiful photo
- **Trip title** - Bold and prominent
- **Location** - Where the trip took place
- **Stats** - Distance, elevation gain, and year
- **Excerpt** - Short description preview
- **Call to action** - "Click to view →" indicator

### 4. **Interactive Navigation**
- **Click any route** on the map → Navigate to trip detail page
- **Click any legend item** → Navigate to trip detail page
- **Smooth transitions** with animations

## 🎨 Design Details

### Legend Styling
- Semi-transparent white background with blur effect
- Rounded corners for modern look
- Compact layout optimized for small screens
- Max height with scroll for many trips
- Custom scrollbar styling

### Tooltip Styling
- Card-based design with shadow
- Image gradient overlay for text readability
- Clean typography hierarchy
- Fade-in animation on appearance
- Follows mouse cursor with offset

### Route Visualization
- Default: 3px width, 70% opacity
- Hovered: 6px width, 100% opacity
- Smooth color transitions
- Routes reorder on hover (hovered route on top)

## 🎯 User Experience

### Desktop
- Tooltip appears 20px to the right and 100px above cursor
- Smooth hover transitions
- Click anywhere on route to navigate

### Mobile Considerations
- Legend is scrollable
- Touch-friendly hit targets
- Optimized image loading

## 🔧 Technical Implementation

### Color Generation
```javascript
const generateTripColor = (index: number, total: number) => {
  const hue = (index * 360) / total;
  return `hsl(${hue}, 70%, 55%)`;
};
```
- Evenly distributes hue values (0-360°)
- Fixed saturation (70%) and lightness (55%) for consistency
- Ensures all colors are vibrant and distinguishable

### Performance
- Tooltips only render when hovering
- Images use Next.js Image component with optimization
- Route data loaded asynchronously
- Smooth animations with CSS transitions

## 📱 Responsive Behavior

- Legend: Top-left on all screen sizes
- Tooltip: Adjusts position to stay on screen
- Routes: Touch-friendly with larger hit areas on mobile

## 🎨 Customization Options

You can easily customize:
- **Colors**: Modify `generateTripColor` function
- **Tooltip position**: Adjust `mousePosition.x + 20` and `mousePosition.y - 100`
- **Legend max height**: Change `max-h-[50vh]`
- **Animation speed**: Modify `tooltipFadeIn` duration in CSS

## Example Usage

The map automatically:
1. Loads all trip routes
2. Assigns unique colors to each
3. Renders the legend
4. Sets up hover and click handlers
5. Shows tooltips on interaction
6. Navigates on click

No additional configuration needed!

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Keyboard navigation support (via legend items)
- Clear visual feedback on hover
- High contrast text on images (gradient overlay)
- Semantic HTML structure
