# Life Solver - Brand Identity Guide

## Brand Overview

**Life Solver** is a friendly, supportive platform that helps people solve everyday problems with simple AI tools, guides, and hacks.

---

## Brand Personality

- **Friendly** - Approachable and welcoming
- **Supportive** - Always there to help
- **Simple** - Easy to understand and use
- **Practical** - Real solutions that work
- **Minimal** - Clean and uncluttered
- **Trustworthy** - Reliable and honest

---

## Brand Tone of Voice

### Writing Style
- **Clear** - No confusion, straight to the point
- **Easy-to-understand** - Simple language everyone gets
- **Action-focused** - Tells you what to do next
- **No complicated words** - Plain English only
- **Encouraging** - Positive and motivating

### Examples

✅ **Good:**
- "Fix your mood in 2 minutes"
- "Get your study plan now"
- "Start feeling better today"

❌ **Avoid:**
- "Utilize our comprehensive mood optimization system"
- "Leverage advanced study methodologies"
- "Commence your wellness journey"

---

## Color Palette

### Primary Colors

**Primary Blue**
- Hex: `#667eea`
- RGB: `102, 126, 234`
- Use: Main actions, links, primary buttons
- Meaning: Trust, calm, professional

**Primary Purple**
- Hex: `#764ba2`
- RGB: `118, 75, 162`
- Use: Accents, gradients, highlights
- Meaning: Creativity, wisdom, support

### Secondary Colors

**Success Green**
- Hex: `#48bb78`
- RGB: `72, 187, 120`
- Use: Success messages, positive actions

**Warning Orange**
- Hex: `#ed8936`
- RGB: `237, 137, 54`
- Use: Warnings, important notices

**Error Red**
- Hex: `#fc8181`
- RGB: `252, 129, 129`
- Use: Errors, delete actions

**Info Cyan**
- Hex: `#4facfe`
- RGB: `79, 172, 254`
- Use: Information, tips

### Neutral Colors

**Dark Text**
- Hex: `#2d3748`
- RGB: `45, 55, 72`
- Use: Headings, primary text

**Body Text**
- Hex: `#4a5568`
- RGB: `74, 85, 104`
- Use: Body text, descriptions

**Light Text**
- Hex: `#718096`
- RGB: `113, 128, 150`
- Use: Secondary text, captions

**Border Gray**
- Hex: `#e2e8f0`
- RGB: `226, 232, 240`
- Use: Borders, dividers

**Background Gray**
- Hex: `#f7fafc`
- RGB: `247, 250, 252`
- Use: Card backgrounds, sections

**Pure White**
- Hex: `#ffffff`
- RGB: `255, 255, 255`
- Use: Main backgrounds, cards

---

## Gradients

### Primary Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```
Use: Hero sections, primary CTAs, featured cards

### Soft Background Gradient
```css
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```
Use: Page backgrounds, sections

### Success Gradient
```css
background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
```
Use: Success states, positive feedback

### Warm Gradient
```css
background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
```
Use: Warm sections, creative areas

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Font Sizes

**Headings**
- H1: `2.5rem` (40px) - Page titles
- H2: `2rem` (32px) - Section titles
- H3: `1.5rem` (24px) - Card titles
- H4: `1.25rem` (20px) - Subsections
- H5: `1.125rem` (18px) - Small headings
- H6: `1rem` (16px) - Tiny headings

**Body Text**
- Large: `1.125rem` (18px) - Subtitles
- Normal: `1rem` (16px) - Body text
- Small: `0.875rem` (14px) - Captions
- Tiny: `0.75rem` (12px) - Labels

### Font Weights
- Light: `300` - Rarely used
- Regular: `400` - Body text
- Medium: `500` - Emphasis
- Semibold: `600` - Buttons, labels
- Bold: `700` - Headings

### Line Heights
- Tight: `1.2` - Headings
- Normal: `1.5` - Body text
- Relaxed: `1.75` - Long-form content

---

## Spacing System

### Base Unit: 4px

**Spacing Scale**
- `0.25rem` (4px) - Tiny gaps
- `0.5rem` (8px) - Small gaps
- `0.75rem` (12px) - Medium-small gaps
- `1rem` (16px) - Standard gap
- `1.25rem` (20px) - Medium gap
- `1.5rem` (24px) - Large gap
- `2rem` (32px) - Extra large gap
- `2.5rem` (40px) - Section spacing
- `3rem` (48px) - Major sections
- `4rem` (64px) - Hero spacing

**Container Widths**
- Mobile: `100%` with 1rem padding
- Tablet: `768px`
- Desktop: `1200px`
- Wide: `1400px`

---

## Border Radius

### Sizes
- Small: `8px` - Buttons, inputs
- Medium: `12px` - Cards, containers
- Large: `16px` - Featured cards
- Extra Large: `20px` - Hero sections
- Round: `50%` - Avatars, icons

### Usage
```css
.btn { border-radius: 8px; }
.card { border-radius: 12px; }
.featured-card { border-radius: 16px; }
.modal { border-radius: 20px; }
.avatar { border-radius: 50%; }
```

---

## Shadows

### Elevation Levels

**Level 1 - Subtle**
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```
Use: Inputs, small cards

**Level 2 - Standard**
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```
Use: Cards, buttons

**Level 3 - Elevated**
```css
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
```
Use: Hover states, modals

**Level 4 - Floating**
```css
box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
```
Use: Dropdowns, popovers

**Level 5 - Maximum**
```css
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
```
Use: Modals, overlays

**Colored Shadow (Primary)**
```css
box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
```
Use: Primary buttons on hover

---

## Button Styles

### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}
```

### Secondary Button
```css
.btn-secondary {
  background: white;
  color: #667eea;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid #667eea;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #667eea;
  color: white;
}
```

### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: #4a5568;
  padding: 0.875rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  border-color: #667eea;
  color: #667eea;
}
```

---

## Card Styles

### Standard Card
```css
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
```

### Featured Card
```css
.card-featured {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}
```

---

## Input Styles

### Text Input
```css
.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  color: #2d3748;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}
```

---

## Animation Guidelines

### Timing Functions
- **Ease**: `cubic-bezier(0.4, 0, 0.2, 1)` - Standard
- **Ease-in**: `cubic-bezier(0.4, 0, 1, 1)` - Exits
- **Ease-out**: `cubic-bezier(0, 0, 0.2, 1)` - Entrances

### Durations
- Fast: `0.15s` - Micro-interactions
- Normal: `0.3s` - Standard transitions
- Slow: `0.5s` - Complex animations

### Common Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## Icon Guidelines

### Icon Style
- Use emoji for friendly feel
- Consistent size: `1.5rem` to `2rem`
- Colorful and expressive
- Match category themes

### Category Icons
- Career: 💼
- Relationship: ❤️
- Study: 📚
- Fitness: 💪
- Productivity: ⚡
- Mental Wellness: 🧘
- Creative: 🎨
- Finance: 💰

---

## Responsive Breakpoints

```css
/* Mobile First Approach */

/* Small phones */
@media (max-width: 480px) { }

/* Phones */
@media (max-width: 768px) { }

/* Tablets */
@media (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

---

## Accessibility

### Color Contrast
- All text must meet WCAG AA standards
- Minimum contrast ratio: 4.5:1 for normal text
- Minimum contrast ratio: 3:1 for large text

### Focus States
- Always visible focus indicators
- Use outline or box-shadow
- Never remove focus styles

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover states
- Descriptive labels

---

## Do's and Don'ts

### ✅ Do
- Use soft, rounded corners
- Keep layouts spacious
- Use gradients for emphasis
- Maintain consistent spacing
- Use clear, simple language
- Add smooth transitions
- Make buttons obvious

### ❌ Don't
- Use sharp corners
- Crowd elements together
- Overuse bright colors
- Mix different styles
- Use complex jargon
- Add jarring animations
- Hide important actions

---

## Component Checklist

Every component should have:
- [ ] Consistent border radius
- [ ] Proper spacing (padding/margin)
- [ ] Hover state
- [ ] Focus state (if interactive)
- [ ] Mobile responsive
- [ ] Smooth transitions
- [ ] Accessible colors
- [ ] Clear typography

---

## Brand Applications

### Logo Usage
- Always use "Life Solver" with lightbulb icon 💡
- Maintain clear space around logo
- Never distort or rotate logo
- Use on white or light backgrounds

### Tagline
"Solve Any Life Problem in Minutes"

### Voice Examples
- "Let's fix that together"
- "You've got this"
- "Simple solutions that work"
- "Made easy for you"

---

**Last Updated:** November 2024
**Version:** 1.0
