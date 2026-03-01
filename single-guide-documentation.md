# Single Guide Page Template Documentation

## Overview
A beautiful, reading-focused template for displaying comprehensive guide articles. Features clean typography, comfortable spacing, and an optimal reading experience across all devices.

## Files Created
- `pages/single-guide.html` - Main HTML template
- `css/single-guide.css` - Complete styling for guide pages
- `js/single-guide.js` - Dynamic functionality and content loading

## Features

### 1. Hero Header Section
- **Dynamic Content**: Updates based on guide data
- **Elements**: Category badge, title, intro text
- **Design**: Gradient background with subtle pattern overlay
- **Animation**: Smooth fade-down effect on load

### 2. Meta Information Row
- **Displays**: Author name, reading time, publish date
- **Style**: Clean, minimal with icons
- **Color**: Light grey for non-intrusive appearance

### 3. Main Article Body
- **Max Width**: 800px for optimal readability
- **Typography**: 
  - H2: 32px, bold
  - H3: 24px, semi-bold
  - Body: 18px with 1.8 line-height
- **Supported Elements**:
  - Headings (H2, H3)
  - Paragraphs
  - Bullet lists (styled with purple markers)
  - Numbered lists (styled with purple numbers)
  - Highlight boxes (blue gradient background)
  - Quote boxes (grey background with purple border)
  - Horizontal dividers
  - Custom styled sections

### 4. Key Takeaways Section
- **Design**: Green gradient card with checkmarks
- **Purpose**: Summarize main points
- **Style**: High contrast, easy to scan
- **Position**: Embedded within article content

### 5. Action Steps Section
- **Design**: Purple gradient card with numbered circles
- **Purpose**: Provide actionable next steps
- **Style**: Numbered list with custom counter styling
- **Position**: Embedded within article content

### 6. Recommended Guides Section
- **Layout**: Responsive grid (3-4 cards)
- **Card Elements**:
  - Thumbnail with emoji/icon
  - Category badge
  - Title
  - Summary (1-2 lines)
  - "Read Guide" button
- **Interaction**: Hover lift effect with enhanced shadow

### 7. Comments Section
- **Current State**: Placeholder for future feature
- **Design**: Dashed border box with icon
- **Message**: "Comments feature coming soon"

### 8. Reading Progress Bar
- **Feature**: Fixed top bar showing scroll progress
- **Color**: Purple gradient
- **Height**: 4px
- **Behavior**: Updates smoothly as user scrolls

## How to Use

### Basic Usage
Navigate to: `pages/single-guide.html?guide=winning-resume-2024`

The page dynamically loads guide content based on the URL parameter.

### Adding New Guides
Edit `js/single-guide.js` and add to the `guideData` object:

```javascript
'your-guide-id': {
    category: 'Category Name',
    title: 'Your Guide Title',
    intro: 'Brief introduction (1-2 sentences)',
    author: 'Author Name',
    readTime: 'X min read',
    date: 'Month Day, Year',
    content: `
        <h2>Section Title</h2>
        <p>Your content here...</p>
        
        <div class="highlight-box">
            <p><strong>💡 Tip:</strong> Important information</p>
        </div>
        
        <h3>Subsection</h3>
        <ul>
            <li>Point one</li>
            <li>Point two</li>
        </ul>
        
        <div class="key-takeaways">
            <h3>Key Takeaways</h3>
            <ul>
                <li>Takeaway 1</li>
                <li>Takeaway 2</li>
            </ul>
        </div>
        
        <div class="action-steps">
            <h3>Action Steps You Can Apply Today</h3>
            <ol>
                <li>Step 1</li>
                <li>Step 2</li>
            </ol>
        </div>
    `
}
```

### Content Formatting Guide

#### Standard Elements
```html
<!-- Heading 2 -->
<h2>Main Section Title</h2>

<!-- Heading 3 -->
<h3>Subsection Title</h3>

<!-- Paragraph -->
<p>Regular paragraph text with good spacing.</p>

<!-- Bullet List -->
<ul>
    <li>First item</li>
    <li>Second item</li>
</ul>

<!-- Numbered List -->
<ol>
    <li>First step</li>
    <li>Second step</li>
</ol>
```

#### Special Elements
```html
<!-- Highlight Box (Blue) -->
<div class="highlight-box">
    <p><strong>💡 Pro Tip:</strong> Your important message here</p>
</div>

<!-- Quote Box (Grey) -->
<div class="quote-box">
    <p>Your inspirational or important quote here</p>
</div>

<!-- Divider -->
<hr class="article-divider">

<!-- Key Takeaways (Green) -->
<div class="key-takeaways">
    <h3>Key Takeaways</h3>
    <ul>
        <li>Takeaway point 1</li>
        <li>Takeaway point 2</li>
    </ul>
</div>

<!-- Action Steps (Purple) -->
<div class="action-steps">
    <h3>Action Steps You Can Apply Today</h3>
    <ol>
        <li>Actionable step 1</li>
        <li>Actionable step 2</li>
    </ol>
</div>
```

### Customization

#### Change Colors
Edit `css/single-guide.css`:
- **Primary gradient**: `.guide-hero` background
- **Accent color**: `#667eea` (purple)
- **Secondary accent**: `#764ba2` (darker purple)
- **Success color**: `#48bb78` (green for takeaways)

#### Adjust Typography
```css
/* Body text */
.article-content p {
    font-size: 18px;
    line-height: 1.8;
}

/* Headings */
.article-content h2 {
    font-size: 32px;
}

.article-content h3 {
    font-size: 24px;
}
```

#### Modify Layout Width
```css
/* Article content width */
.article-content {
    max-width: 800px; /* Change this value */
}
```

## SEO Features
- Dynamic title updates based on guide
- Meta description updates automatically
- Semantic HTML structure (article, section tags)
- Proper heading hierarchy (H1 → H2 → H3)
- Clean URL structure with query parameters
- Reading time indicator for user engagement

## Performance Features
- Lightweight CSS (no external dependencies)
- Minimal JavaScript
- CSS animations (hardware accelerated)
- Optimized for fast loading
- Mobile-first responsive design

## Accessibility
- Semantic HTML elements
- Proper heading structure
- High contrast text
- Readable font sizes
- Touch-friendly buttons (min 44px)
- Keyboard navigation support

## Responsive Breakpoints
- **Desktop**: Full layout (>768px)
- **Tablet**: Adjusted spacing (768px)
- **Mobile**: Single column, smaller text (480px)

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Integration with Existing Site

### Navigation
Uses your existing navbar structure. The template integrates seamlessly with your site navigation.

### Footer
Includes the standard site footer with all links and social media icons.

### Styling
- Requires `css/style.css` (main stylesheet)
- Adds `css/single-guide.css` (guide-specific styles)
- No conflicts with existing styles

## Example Guide Categories
- **Career**: Resume tips, interview prep, career advancement
- **Productivity**: Time management, goal setting, habits
- **Health**: Fitness routines, nutrition, mental health
- **Finance**: Budgeting, investing, saving strategies
- **Relationships**: Communication, conflict resolution
- **Study**: Learning techniques, exam preparation
- **Personal Growth**: Self-improvement, mindfulness

## Content Best Practices

### Writing Tips
1. **Start with a hook**: Grab attention in the first paragraph
2. **Use subheadings**: Break content into scannable sections
3. **Include examples**: Make concepts concrete and relatable
4. **Add visuals**: Use highlight boxes and quotes strategically
5. **End with action**: Always include actionable takeaways
6. **Keep it focused**: One main topic per guide
7. **Optimize length**: 1500-2500 words is ideal

### Structure Template
1. Introduction (why this matters)
2. Main content (3-5 major sections)
3. Key takeaways box
4. Action steps box
5. Conclusion
6. Next steps or related resources

## Future Enhancements
- Add table of contents for long guides
- Implement social sharing buttons
- Add bookmark/save functionality
- Include print-friendly version
- Add estimated reading progress
- Implement actual comments system
- Add related tools section
- Include downloadable resources (PDFs, templates)

## Testing Checklist
- [ ] Content loads correctly
- [ ] All links work
- [ ] Responsive on mobile
- [ ] Readable typography
- [ ] Smooth animations
- [ ] Progress bar functions
- [ ] Recommended guides display
- [ ] SEO meta tags update

## Support
For questions or customization help, refer to the main project documentation.
