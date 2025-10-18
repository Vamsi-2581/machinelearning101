# Responsive Text Sizing

## Overview

All text in this application uses relative units (rem, em) to support browser zoom up to 200% as required by WCAG 2.1 Level AA (Success Criterion 1.4.4).

## Implementation

### Base Font Size

The base font size is set to 16px on the `<html>` element:

```css
html {
  font-size: 16px;
}
```

All other font sizes are defined using `rem` units, which are relative to this base size.

### Typography Scale

We use a fluid typography scale that adapts to viewport size using `clamp()`:

```css
h1 {
  font-size: clamp(1.75rem, 2.5vw + 1rem, 3rem);
}
```

This ensures:
- Minimum size: 1.75rem (28px)
- Preferred size: 2.5vw + 1rem (scales with viewport)
- Maximum size: 3rem (48px)

### Font Size Scale

| Element | Min Size | Base Size | Max Size | Use Case |
|---------|----------|-----------|----------|----------|
| h1 | 1.75rem (28px) | 2.5vw + 1rem | 3rem (48px) | Page titles |
| h2 | 1.5rem (24px) | 2vw + 0.75rem | 2.25rem (36px) | Section headings |
| h3 | 1.25rem (20px) | 1.5vw + 0.5rem | 1.875rem (30px) | Subsection headings |
| h4 | 1.125rem (18px) | 1.25vw + 0.375rem | 1.5rem (24px) | Minor headings |
| h5 | 1rem (16px) | 1vw + 0.25rem | 1.25rem (20px) | Small headings |
| h6 | 0.875rem (14px) | 0.75vw + 0.25rem | 1.125rem (18px) | Tiny headings |
| p | 0.875rem (14px) | 0.5vw + 0.75rem | 1.125rem (18px) | Body text |
| small | 0.75rem (12px) | 0.5vw + 0.5rem | 0.875rem (14px) | Small text |

### Line Height

All text has a minimum line height of 1.5 for better readability:

```css
p, li, td, th, label {
  line-height: 1.5;
}
```

On larger screens, body text uses a line height of 1.6 for improved readability.

## Tailwind Configuration

All Tailwind font sizes use rem units:

```typescript
fontSize: {
  'xs': ['0.75rem', { lineHeight: '1rem' }],
  'sm': ['0.875rem', { lineHeight: '1.25rem' }],
  'base': ['1rem', { lineHeight: '1.5rem' }],
  'lg': ['1.125rem', { lineHeight: '1.75rem' }],
  'xl': ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  // ... and so on
}
```

## Spacing

All spacing values use rem units to scale proportionally with text:

```typescript
spacing: {
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  // ... and so on
}
```

## Testing Text Zoom

### Browser Zoom

Test the application at different zoom levels:

1. **100% (default)**: Verify baseline appearance
2. **125%**: Check for layout issues
3. **150%**: Ensure text remains readable
4. **200%**: Verify WCAG compliance (maximum required)

### Keyboard Shortcuts

- **Chrome/Firefox/Edge**: `Ctrl/Cmd + Plus` to zoom in, `Ctrl/Cmd + Minus` to zoom out
- **Safari**: `Cmd + Plus` to zoom in, `Cmd + Minus` to zoom out
- **Reset**: `Ctrl/Cmd + 0`

### Browser Settings

Users can also change their default font size in browser settings:
- Chrome: Settings → Appearance → Font size
- Firefox: Settings → Language and Appearance → Fonts
- Safari: Preferences → Advanced → Accessibility

## Mobile Considerations

### Prevent iOS Zoom on Input Focus

On iOS, inputs with font-size less than 16px trigger automatic zoom. We prevent this by setting a minimum font size:

```css
@media (max-width: 640px) {
  input,
  select,
  textarea {
    font-size: 16px;
  }
}
```

### Responsive Breakpoints

Text sizes adapt at these breakpoints:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Best Practices

### 1. Always Use Relative Units

❌ **Don't:**
```css
.heading {
  font-size: 24px;
  margin-bottom: 16px;
}
```

✅ **Do:**
```css
.heading {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
```

### 2. Use Tailwind Classes

❌ **Don't:**
```html
<h1 style="font-size: 32px">Title</h1>
```

✅ **Do:**
```html
<h1 class="text-3xl">Title</h1>
```

### 3. Test at Different Zoom Levels

Always test your components at:
- 100% zoom (baseline)
- 150% zoom (common user setting)
- 200% zoom (WCAG requirement)

### 4. Avoid Fixed Widths

❌ **Don't:**
```css
.container {
  width: 800px;
}
```

✅ **Do:**
```css
.container {
  max-width: 50rem; /* 800px at base size */
  width: 100%;
}
```

### 5. Use Fluid Typography

For headings and important text, use `clamp()` for fluid scaling:

```css
.hero-title {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

## Accessibility Checklist

- [ ] All font sizes use rem or em units
- [ ] All spacing uses rem or em units
- [ ] Text remains readable at 200% zoom
- [ ] No horizontal scrolling at 200% zoom
- [ ] Line height is at least 1.5 for body text
- [ ] Paragraph spacing is at least 1.5x font size
- [ ] Letter spacing is at least 0.12x font size
- [ ] Word spacing is at least 0.16x font size
- [ ] Containers don't have fixed widths
- [ ] Text doesn't overflow containers when zoomed

## Testing Tools

### Browser DevTools

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl/Cmd + Shift + M)
3. Set zoom level in the toolbar
4. Test at 100%, 150%, and 200%

### Automated Testing

```bash
# Run accessibility tests
npm run test:a11y

# Check for fixed pixel values
npm run lint:css
```

### Manual Testing

1. Zoom to 200% using browser controls
2. Navigate through all pages
3. Check for:
   - Text overflow
   - Horizontal scrolling
   - Overlapping elements
   - Unreadable text
   - Broken layouts

## Common Issues and Solutions

### Issue: Text Overflows Container

**Solution:** Use `overflow-wrap: break-word` and `max-width: 100%`

```css
.text-container {
  overflow-wrap: break-word;
  max-width: 100%;
}
```

### Issue: Fixed Width Breaks Layout

**Solution:** Use max-width with percentage or rem units

```css
.container {
  max-width: 60rem;
  width: 100%;
  padding: 0 1rem;
}
```

### Issue: Buttons Too Small When Zoomed

**Solution:** Use rem units for padding and min-height

```css
.button {
  padding: 0.5rem 1rem;
  min-height: 2.75rem; /* 44px minimum touch target */
}
```

## References

- [WCAG 2.1 - Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html)
- [MDN - CSS Values and Units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
- [CSS Tricks - Fluid Typography](https://css-tricks.com/snippets/css/fluid-typography/)
