# Single Tool Page Template Documentation

## Overview
A dynamic, reusable template for displaying individual AI tools with a clean, modern UI. The template features input/output areas, instructions, tips, related tools, and FAQ sections.

## Files Created
- `pages/single-tool.html` - Main HTML template
- `css/single-tool.css` - Styling for the tool page
- `js/single-tool.js` - Dynamic functionality and interactions

## Features

### 1. Dynamic Header Section
- Updates based on tool data
- Displays tool icon, category, name, and description
- Beautiful gradient background with animations
- Fully responsive

### 2. Tool Interaction Area
- **Input Section**: Clean textarea with instructions
- **Output Section**: Displays results with placeholder state
- Split-screen layout (stacks on mobile)
- Smooth animations and transitions

### 3. Tips Section
- Three cards: How It Helps, Best Practices, Common Mistakes
- Dynamically populated based on tool data
- Hover effects and animations

### 4. Related Tools Section
- Shows 4 related tools from the same category
- Click to navigate to other tools
- Responsive grid layout

### 5. FAQ Section
- Accordion-style questions and answers
- Smooth expand/collapse animations
- 4 common questions included

### 6. Responsive Design
- Mobile-first approach
- Breakpoints at 968px and 640px
- Touch-friendly on all devices

## How to Use

### Basic Usage
1. Navigate to: `pages/single-tool.html?tool=resume-analyzer`
2. The page will load the tool data dynamically
3. Users can enter content and click "Generate Result"

### Adding New Tools
Edit `js/single-tool.js` and add to the `toolData` object:

```javascript
'your-tool-id': {
    icon: '🎯',
    category: 'Category Name',
    title: 'Tool Title',
    description: 'Short description of what the tool does',
    instructions: 'Instructions for users',
    placeholder: 'Placeholder text for input...',
    helpList: ['Benefit 1', 'Benefit 2', 'Benefit 3'],
    practicesList: ['Practice 1', 'Practice 2', 'Practice 3'],
    mistakesList: ['Mistake 1', 'Mistake 2', 'Mistake 3']
}
```

### URL Parameters
- `?tool=resume-analyzer` - Loads the Resume Analyzer tool
- `?tool=cover-letter` - Loads the Cover Letter Generator
- Add more tools by extending the toolData object

### Customization

#### Change Colors
Edit `css/single-tool.css`:
- Primary gradient: `.tool-header` background
- Accent color: `#667eea` (used throughout)
- Button colors: `.generate-btn` background

#### Modify Layout
- Input/Output split: `.tool-workspace` grid
- Card spacing: Adjust `gap` values
- Section padding: Modify `.tool-interaction`, `.tool-tips`, etc.

#### Update Content
All content is dynamically loaded from `toolData` in `js/single-tool.js`

## Integration with Existing Site

### Navigation
The template includes your existing navbar structure. Update links as needed in `pages/single-tool.html`.

### Footer
Uses the same footer structure as other pages. Modify in the HTML file if needed.

### Styling
- Requires `css/style.css` (your main stylesheet)
- Adds `css/single-tool.css` (tool-specific styles)
- No conflicts with existing styles

## Demo Functionality

The current implementation includes a demo output generator:
- Simulates 2-second processing time
- Generates sample analysis output
- Shows loading state on button
- Smooth scroll to results

### Connecting to Real Backend
Replace the `generateDemoOutput()` function in `js/single-tool.js` with actual API calls:

```javascript
async function generateResult(input) {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input, tool: getToolIdFromURL() })
    });
    return await response.json();
}
```

## SEO Features
- Dynamic title updates based on tool
- Meta description updates
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for accessibility

## Performance
- Lightweight CSS (no external dependencies)
- Minimal JavaScript
- Smooth animations using CSS
- Lazy loading ready
- Mobile optimized

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- Connect to actual AI backend
- Add more input field types (dropdowns, file uploads)
- Implement result export (PDF, copy to clipboard)
- Add user authentication for saved results
- Analytics tracking
- Social sharing buttons

## Example Tools to Add
- Interview Prep Assistant
- Salary Negotiation Guide
- LinkedIn Profile Optimizer
- Career Path Advisor
- Job Description Analyzer
- Networking Email Templates

## Support
For questions or issues, refer to the main project documentation or contact the development team.
