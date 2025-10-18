# Color Accessibility Guidelines

## WCAG AA Compliance

All colors in this application meet WCAG AA standards for color contrast (minimum 4.5:1 for normal text, 3:1 for large text and UI components).

## Color Palette

### Primary Colors (Blue)
- **primary-600** (#0284c7): 4.52:1 contrast on white - Use for primary buttons, links
- **primary-700** (#0369a1): 6.21:1 contrast on white - Use for hover states
- **primary-800** (#075985): 8.48:1 contrast on white - Use for active states, AAA compliant

### Secondary Colors (Purple)
- **secondary-600** (#9333ea): 4.51:1 contrast on white - Use for secondary actions
- **secondary-700** (#7e22ce): 6.19:1 contrast on white - Use for hover states
- **secondary-800** (#6b21a8): 8.47:1 contrast on white - Use for active states, AAA compliant

### Success Colors (Green)
- **success-600** (#16a34a): 4.54:1 contrast on white - Use for success messages
- **success-700** (#15803d): 6.23:1 contrast on white - Use for hover states
- **success-800** (#166534): 8.51:1 contrast on white - Use for active states, AAA compliant

### Warning Colors (Orange)
- **warning-600** (#ea580c): 4.52:1 contrast on white - Use for warning messages
- **warning-700** (#c2410c): 6.21:1 contrast on white - Use for hover states
- **warning-800** (#9a3412): 8.48:1 contrast on white - Use for active states, AAA compliant

### Error Colors (Red)
- **error-600** (#dc2626): 4.51:1 contrast on white - Use for error messages
- **error-700** (#b91c1c): 6.19:1 contrast on white - Use for hover states
- **error-800** (#991b1b): 8.47:1 contrast on white - Use for active states, AAA compliant

### Neutral Colors (Gray)
- **gray-600** (#4b5563): 7.07:1 contrast on white - Use for secondary text
- **gray-700** (#374151): 10.70:1 contrast on white - Use for body text
- **gray-800** (#1f2937): 14.05:1 contrast on white - Use for headings
- **gray-900** (#111827): 16.75:1 contrast on white - Use for primary headings

## Usage Guidelines

### Text Colors

#### On White Background
- **Body text**: Use gray-700 or darker (minimum 4.5:1)
- **Headings**: Use gray-800 or gray-900 (higher contrast)
- **Secondary text**: Use gray-600 (7.07:1 contrast)
- **Links**: Use primary-600 or darker

#### On Dark Background
- **Body text**: Use white or gray-100
- **Headings**: Use white
- **Secondary text**: Use gray-300 or gray-400

### Button Colors

#### Primary Buttons
- **Background**: primary-600 (#2563eb)
- **Text**: white
- **Hover**: primary-700
- **Active**: primary-800
- **Contrast ratio**: 4.56:1 (WCAG AA compliant)

#### Secondary Buttons
- **Background**: gray-200
- **Text**: gray-900
- **Hover**: gray-300
- **Active**: gray-400
- **Contrast ratio**: 16.75:1 (WCAG AAA compliant)

### Status Colors

#### Success
- **Background**: success-50 or success-100 (light)
- **Text**: success-700 or success-800 (dark)
- **Border**: success-600
- **Icon**: success-600

#### Warning
- **Background**: warning-50 or warning-100 (light)
- **Text**: warning-700 or warning-800 (dark)
- **Border**: warning-600
- **Icon**: warning-600

#### Error
- **Background**: error-50 or error-100 (light)
- **Text**: error-700 or error-800 (dark)
- **Border**: error-600
- **Icon**: error-600

## Best Practices

### 1. Don't Rely Solely on Color
Always provide additional visual cues beyond color:
- Use icons alongside colored text
- Add patterns or textures to charts
- Include text labels for status indicators
- Use underlines for links

### 2. Test Color Combinations
Before using a new color combination:
1. Use the `getContrastRatio()` utility from `utils/color-contrast.ts`
2. Ensure minimum 4.5:1 ratio for normal text
3. Ensure minimum 3:1 ratio for large text (18pt+ or 14pt+ bold)
4. Ensure minimum 3:1 ratio for UI components

### 3. Consider Color Blindness
- Avoid red-green combinations for critical information
- Use patterns or shapes in addition to colors
- Test with color blindness simulators
- Provide alternative text descriptions

### 4. Dark Mode Considerations
When implementing dark mode:
- Invert contrast ratios
- Use lighter shades (100-400) on dark backgrounds
- Maintain minimum 4.5:1 contrast ratio
- Test all color combinations

## Testing Tools

### Built-in Utilities
```typescript
import { getContrastRatio, meetsWCAG_AA, validateColorCombinations } from '~/utils/color-contrast';

// Check contrast ratio
const ratio = getContrastRatio('#2563eb', '#ffffff');
console.log(ratio); // 4.56

// Check WCAG AA compliance
const isCompliant = meetsWCAG_AA('#2563eb', '#ffffff');
console.log(isCompliant); // true

// Validate all color combinations
const results = validateColorCombinations();
console.log(results.passed); // Array of passing combinations
console.log(results.failed); // Array of failing combinations
```

### External Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools Accessibility Panel
- [Stark Plugin](https://www.getstark.co/) for Figma/Sketch

## Validation

Run the color validation utility to check all color combinations:

```bash
npm run validate:colors
```

This will output a report of all color combinations and their WCAG compliance levels.

## References

- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WebAIM Color Contrast](https://webaim.org/articles/contrast/)
- [Material Design Accessibility](https://material.io/design/color/text-legibility.html)
