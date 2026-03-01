# Life Solver - Component Usage Guide

## Quick Start

### 1. Include the Brand Components CSS

Add this to your HTML `<head>`:

```html
<link rel="stylesheet" href="../css/brand-components.css">
```

### 2. Use Components with Class Names

All components use the `ls-` prefix (Life Solver) to avoid conflicts.

---

## Component Examples

### Buttons

```html
<!-- Primary Button -->
<button class="ls-btn ls-btn-primary">Get Started</button>

<!-- Secondary Button -->
<button class="ls-btn ls-btn-secondary">Learn More</button>

<!-- Ghost Button -->
<button class="ls-btn ls-btn-ghost">Cancel</button>

<!-- Success Button -->
<button class="ls-btn ls-btn-success">Save</button>

<!-- Danger Button -->
<button class="ls-btn ls-btn-danger">Delete</button>

<!-- Small Button -->
<button class="ls-btn ls-btn-primary ls-btn-sm">Small</button>

<!-- Large Button -->
<button class="ls-btn ls-btn-primary ls-btn-lg">Large</button>

<!-- Full Width Button -->
<button class="ls-btn ls-btn-primary ls-btn-block">Full Width</button>
```

---

### Cards

```html
<!-- Standard Card -->
<div class="ls-card">
  <div class="ls-card-header">
    <h3 class="ls-card-title">Card Title</h3>
    <p class="ls-card-subtitle">Card subtitle</p>
  </div>
  <div class="ls-card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="ls-card-footer">
    <button class="ls-btn ls-btn-primary ls-btn-sm">Action</button>
  </div>
</div>

<!-- Featured Card -->
<div class="ls-card-featured">
  <h3 class="ls-card-title">Featured Content</h3>
  <p>This card stands out with gradient background.</p>
</div>

<!-- Tool Card -->
<div class="ls-tool-card">
  <span class="ls-tool-icon">💼</span>
  <h3 class="ls-card-title">Career Coach</h3>
  <p>Get personalized career advice</p>
  <button class="ls-btn ls-btn-primary ls-btn-sm">Open Tool</button>
</div>

<!-- Guide Card -->
<div class="ls-guide-card">
  <div class="ls-guide-image">📚</div>
  <div class="ls-guide-content">
    <h3 class="ls-card-title">Study Guide</h3>
    <p>Learn how to study effectively</p>
  </div>
</div>

<!-- Hack Tile -->
<div class="ls-hack-tile">
  <h4>💡 Quick Tip</h4>
  <p>Use the Pomodoro technique for better focus.</p>
</div>
```

---

### Form Inputs

```html
<!-- Text Input -->
<input type="text" class="ls-input" placeholder="Enter text">

<!-- Input with Icon -->
<div class="ls-input-group">
  <span class="ls-input-icon">🔍</span>
  <input type="text" class="ls-input" placeholder="Search...">
</div>

<!-- Textarea -->
<textarea class="ls-textarea" placeholder="Your message"></textarea>

<!-- Select -->
<select class="ls-select">
  <option>Choose option</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

---

### Badges

```html
<span class="ls-badge ls-badge-primary">New</span>
<span class="ls-badge ls-badge-success">Active</span>
<span class="ls-badge ls-badge-warning">Pending</span>
<span class="ls-badge ls-badge-error">Error</span>
```

---

### Alerts

```html
<!-- Info Alert -->
<div class="ls-alert ls-alert-info">
  <strong>Info:</strong> This is an informational message.
</div>

<!-- Success Alert -->
<div class="ls-alert ls-alert-success">
  <strong>Success:</strong> Action completed!
</div>

<!-- Warning Alert -->
<div class="ls-alert ls-alert-warning">
  <strong>Warning:</strong> Please review this.
</div>

<!-- Error Alert -->
<div class="ls-alert ls-alert-error">
  <strong>Error:</strong> Something went wrong.
</div>
```

---

### Pagination

```html
<div class="ls-pagination">
  <button class="ls-page-item" disabled>←</button>
  <a href="#" class="ls-page-item active">1</a>
  <a href="#" class="ls-page-item">2</a>
  <a href="#" class="ls-page-item">3</a>
  <button class="ls-page-item">→</button>
</div>
```

---

### Loading Spinner

```html
<!-- Small Spinner -->
<div class="ls-spinner ls-spinner-sm"></div>

<!-- Normal Spinner -->
<div class="ls-spinner"></div>

<!-- Large Spinner -->
<div class="ls-spinner ls-spinner-lg"></div>
```

---

### Grid System

```html
<!-- 2 Column Grid -->
<div class="ls-grid ls-grid-2">
  <div class="ls-card">Column 1</div>
  <div class="ls-card">Column 2</div>
</div>

<!-- 3 Column Grid -->
<div class="ls-grid ls-grid-3">
  <div class="ls-card">Column 1</div>
  <div class="ls-card">Column 2</div>
  <div class="ls-card">Column 3</div>
</div>

<!-- 4 Column Grid -->
<div class="ls-grid ls-grid-4">
  <div class="ls-card">Column 1</div>
  <div class="ls-card">Column 2</div>
  <div class="ls-card">Column 3</div>
  <div class="ls-card">Column 4</div>
</div>
```

---

### Container

```html
<!-- Standard Container (1200px max) -->
<div class="ls-container">
  Content here
</div>

<!-- Wide Container (1400px max) -->
<div class="ls-container ls-container-wide">
  Content here
</div>

<!-- Narrow Container (800px max) -->
<div class="ls-container ls-container-narrow">
  Content here
</div>
```

---

## Utility Classes

### Text Alignment
```html
<p class="ls-text-center">Centered text</p>
<p class="ls-text-left">Left aligned</p>
<p class="ls-text-right">Right aligned</p>
```

### Text Colors
```html
<p class="ls-text-primary">Primary color text</p>
<p class="ls-text-dark">Dark text</p>
<p class="ls-text-body">Body text</p>
<p class="ls-text-light">Light text</p>
<p class="ls-text-success">Success text</p>
<p class="ls-text-warning">Warning text</p>
<p class="ls-text-error">Error text</p>
```

### Spacing
```html
<!-- Margin Top -->
<div class="ls-mt-0">No margin top</div>
<div class="ls-mt-1">Small margin top</div>
<div class="ls-mt-2">Medium margin top</div>
<div class="ls-mt-3">Large margin top</div>
<div class="ls-mt-4">Extra large margin top</div>

<!-- Margin Bottom -->
<div class="ls-mb-1">Small margin bottom</div>
<div class="ls-mb-2">Medium margin bottom</div>

<!-- Padding -->
<div class="ls-p-1">Small padding</div>
<div class="ls-p-2">Medium padding</div>
<div class="ls-p-3">Large padding</div>
```

### Display & Flexbox
```html
<!-- Flex -->
<div class="ls-flex">Flex container</div>

<!-- Flex Center -->
<div class="ls-flex-center">Centered content</div>

<!-- Flex Space Between -->
<div class="ls-flex-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

---

## Using CSS Variables

You can use CSS variables directly in your custom styles:

```css
.my-custom-element {
  color: var(--primary-blue);
  background: var(--gradient-primary);
  padding: var(--space-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: all var(--transition-normal);
}
```

### Available Variables

**Colors:**
- `--primary-blue`
- `--primary-purple`
- `--success-green`
- `--warning-orange`
- `--error-red`
- `--info-cyan`
- `--dark-text`
- `--body-text`
- `--light-text`
- `--border-gray`
- `--bg-gray`
- `--white`

**Gradients:**
- `--gradient-primary`
- `--gradient-soft-bg`
- `--gradient-success`
- `--gradient-warm`

**Spacing:**
- `--space-xs` (4px)
- `--space-sm` (8px)
- `--space-md` (16px)
- `--space-lg` (24px)
- `--space-xl` (32px)
- `--space-2xl` (48px)
- `--space-3xl` (64px)

**Border Radius:**
- `--radius-sm` (8px)
- `--radius-md` (12px)
- `--radius-lg` (16px)
- `--radius-xl` (20px)
- `--radius-round` (50%)

**Shadows:**
- `--shadow-sm`
- `--shadow-md`
- `--shadow-lg`
- `--shadow-xl`
- `--shadow-2xl`
- `--shadow-primary`

**Transitions:**
- `--transition-fast` (0.15s)
- `--transition-normal` (0.3s)
- `--transition-slow` (0.5s)

---

## Complete Page Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Page - Life Solver</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/brand-components.css">
</head>
<body style="background: var(--gradient-soft-bg); padding: 2rem 0;">
  
  <div class="ls-container">
    <!-- Hero Section -->
    <div class="ls-card-featured ls-text-center ls-mb-4">
      <h1>Welcome to Life Solver</h1>
      <p>Solve any life problem in minutes</p>
      <button class="ls-btn ls-btn-secondary ls-mt-2">Get Started</button>
    </div>

    <!-- Tools Grid -->
    <h2 class="ls-text-center ls-mb-3">Featured Tools</h2>
    <div class="ls-grid ls-grid-3">
      <div class="ls-tool-card">
        <span class="ls-tool-icon">💼</span>
        <h3 class="ls-card-title">Career Coach</h3>
        <p>Get personalized career advice</p>
        <button class="ls-btn ls-btn-primary ls-btn-sm ls-mt-2">Open Tool</button>
      </div>
      
      <div class="ls-tool-card">
        <span class="ls-tool-icon">📚</span>
        <h3 class="ls-card-title">Study Planner</h3>
        <p>Create your perfect study schedule</p>
        <button class="ls-btn ls-btn-primary ls-btn-sm ls-mt-2">Open Tool</button>
      </div>
      
      <div class="ls-tool-card">
        <span class="ls-tool-icon">💪</span>
        <h3 class="ls-card-title">Workout Guide</h3>
        <p>Get simple home workouts</p>
        <button class="ls-btn ls-btn-primary ls-btn-sm ls-mt-2">Open Tool</button>
      </div>
    </div>

    <!-- Newsletter -->
    <div class="ls-card ls-mt-4">
      <h3 class="ls-card-title">Stay Updated</h3>
      <p class="ls-mb-2">Get weekly tips and new tools</p>
      <div class="ls-input-group ls-mb-2">
        <span class="ls-input-icon">✉️</span>
        <input type="email" class="ls-input" placeholder="Your email">
      </div>
      <button class="ls-btn ls-btn-primary ls-btn-block">Subscribe</button>
    </div>
  </div>

</body>
</html>
```

---

## Best Practices

### ✅ Do
- Use consistent spacing with utility classes
- Combine components for complex layouts
- Use semantic HTML with brand classes
- Test on mobile devices
- Use CSS variables for custom styles
- Keep hover states smooth
- Make buttons obvious and clickable

### ❌ Don't
- Mix different design systems
- Override core component styles
- Use inline styles instead of classes
- Forget mobile responsiveness
- Remove focus states
- Use too many colors at once
- Make text too small

---

## Responsive Design

All components are mobile-responsive by default. Grids automatically stack on mobile:

```html
<!-- This grid will be 3 columns on desktop, 1 column on mobile -->
<div class="ls-grid ls-grid-3">
  <div class="ls-card">Card 1</div>
  <div class="ls-card">Card 2</div>
  <div class="ls-card">Card 3</div>
</div>
```

---

## Need Help?

- View live examples: `/pages/brand-showcase.html`
- Read brand guide: `BRAND-GUIDE.md`
- Check JSON config: `brand-styles.json`
- See component CSS: `css/brand-components.css`

---

**Happy Building! 🚀**
