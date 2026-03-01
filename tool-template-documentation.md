# Universal Tool Template Documentation

## Overview
A reusable, production-ready template for all AI tools. Simply duplicate and customize the configuration object - no need to rewrite HTML/CSS/JS for each tool.

## Files Created
- `pages/tool-template.html` - Master HTML template
- `css/tool-template.css` - Complete styling with glassmorphism
- `js/tool-template.js` - Full functionality with localStorage

## Key Features

### ✅ Clean Header
- Tool icon (animated bounce)
- Tool name and description
- Back button to homepage
- Sticky header on scroll

### ✅ Main Interface
- Large text input box with focus effects
- Quick prompt chips (clickable suggestions)
- Generate button with loading state
- Glassmorphism/soft white styling

### ✅ Output Section
- Smooth typing animation for responses
- Copy to clipboard button
- Scrollable output box
- "New Query" button

### ✅ Session History
- Saves last 10 queries per tool
- Uses localStorage (persists across sessions)
- Click to reload previous queries
- Clear all history option
- Shows "time ago" for each entry

### ✅ Mobile Responsive
- Adapts to all screen sizes
- Touch-friendly buttons
- Optimized spacing on mobile

### ✅ Footer
- Link to Home
- Link to All Tools
- Contact link
- Minimal design

## How to Use

### For Each New Tool:

1. **Duplicate the template**
   ```bash
   cp pages/tool-template.html pages/life-advisor.html
   ```

2. **Update the tool configuration in JS**
   
   The template automatically loads configuration based on URL parameter `?tool=tool-id`
   
   All 8 tools are already configured in `js/tool-template.js`:
   - life-advisor
   - mood-fixer
   - career-coach
   - study-planner
   - workout-suggestor
   - breakup-friend
   - money-mentor
   - productivity-boost

3. **No HTML/CSS changes needed!**
   
   The template dynamically updates:
   - Icon
   - Tool name
   - Description
   - Quick prompts
   - Placeholder text
   - Demo responses

### URL Structure
```
pages/tool-template.html?tool=life-advisor
pages/tool-template.html?tool=mood-fixer
pages/tool-template.html?tool=career-coach
```

## Configuration Object

Each tool is configured in `js/tool-template.js`:

```javascript
const toolConfig = {
    'tool-id': {
        icon: '🧭',                    // Emoji icon
        name: 'Tool Name',             // Display name
        description: 'Tool description', // Subtitle
        prompts: [                     // Quick prompt chips
            'Prompt 1',
            'Prompt 2',
            'Prompt 3',
            'Prompt 4'
        ],
        placeholder: 'Input placeholder text...'
    }
};
```

## Features in Detail

### 1. Input Section
- **Large textarea**: 6 rows, auto-resize
- **Focus effects**: Border color change, shadow glow
- **Placeholder**: Customizable per tool
- **Keyboard shortcut**: Ctrl+Enter to generate

### 2. Quick Prompts
- **Clickable chips**: Pre-filled suggestions
- **Hover effects**: Color change, lift animation
- **Auto-fill**: Clicks populate the input box
- **Customizable**: 4 prompts per tool

### 3. Generate Button
- **Loading state**: Shows "Generating..." with spinner
- **Disabled during generation**: Prevents double-clicks
- **Gradient background**: Purple gradient
- **Hover effects**: Lift and shadow

### 4. Output Section
- **Typing animation**: Character-by-character reveal
- **Typing speed**: 20ms per character (adjustable)
- **Blinking cursor**: Appears during typing
- **Auto-scroll**: Follows typing progress
- **Copy button**: One-click copy with feedback

### 5. History System
- **localStorage**: Persists across sessions
- **Per-tool storage**: Each tool has separate history
- **Last 10 items**: Automatically limits storage
- **Timestamps**: Shows "Just now", "5 min ago", etc.
- **Click to load**: Restores query and response
- **Clear all**: Removes all history for current tool

### 6. Animations
- **Fade in up**: Output section entrance
- **Typing effect**: Character-by-character
- **Bounce**: Icon animation
- **Hover lifts**: Cards and buttons
- **Smooth transitions**: All state changes

## Styling Features

### Glassmorphism Effect
```css
background: rgba(255, 255, 255, 0.9);
backdrop-filter: blur(10px);
```

### Gradient Background
```css
background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
```

### Soft Shadows
- Small: `0 2px 10px rgba(0, 0, 0, 0.05)`
- Medium: `0 8px 30px rgba(0, 0, 0, 0.1)`
- Large: `0 20px 50px rgba(0, 0, 0, 0.15)`

### Color Scheme
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Text: `#2d3748` (dark grey)
- Secondary text: `#718096` (medium grey)
- Success: `#48bb78` (green)

## Responsive Breakpoints

### Desktop (>768px)
- Full width container (900px max)
- Large text and icons
- Side-by-side layouts

### Tablet (768px)
- Reduced padding
- Smaller fonts
- Stacked footer links

### Mobile (480px)
- Minimal padding
- Compact spacing
- Vertical layouts
- Touch-optimized buttons

## localStorage Structure

### Storage Keys
```javascript
history_life-advisor
history_mood-fixer
history_career-coach
// etc.
```

### Data Format
```javascript
[
    {
        query: "User's input text",
        response: "AI generated response",
        timestamp: "2024-01-15T10:30:00.000Z"
    },
    // ... up to 10 items
]
```

## Customization Guide

### Change Colors
Edit `css/tool-template.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
    --text-primary: #YOUR_TEXT_COLOR;
}
```

### Adjust Typing Speed
Edit `js/tool-template.js`:
```javascript
const interval = setInterval(() => {
    // Change 20 to your desired speed (milliseconds)
}, 20);
```

### Modify History Limit
Edit `js/tool-template.js`:
```javascript
// Keep only last 10 items (change 10 to your limit)
history = history.slice(0, 10);
```

### Add New Tool
1. Add configuration to `toolConfig` object
2. Add demo response to `generateDemoResponse()` function
3. Create link from homepage with `?tool=your-tool-id`

## API Integration

### Replace Demo with Real API

In `js/tool-template.js`, replace the `generateResponse()` function:

```javascript
async function generateResponse() {
    const input = document.getElementById('userInput').value.trim();
    
    if (!input) {
        alert('Please enter something first!');
        return;
    }
    
    const generateBtn = document.getElementById('generateBtn');
    const outputSection = document.getElementById('outputSection');
    const outputBox = document.getElementById('outputBox');
    
    // Show loading state
    generateBtn.classList.add('loading');
    generateBtn.querySelector('.btn-text').textContent = 'Generating...';
    
    // Show output section
    outputSection.style.display = 'block';
    outputBox.innerHTML = '';
    
    try {
        // Real API call
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tool: getToolId(),
                query: input
            })
        });
        
        const data = await response.json();
        
        // Type out response
        await typeResponse(data.response, outputBox);
        
        // Save to history
        saveToHistory(input, data.response);
        
    } catch (error) {
        outputBox.textContent = 'Error: ' + error.message;
    }
    
    // Reset button
    generateBtn.classList.remove('loading');
    generateBtn.querySelector('.btn-text').textContent = 'Generate';
}
```

## Performance

### Optimizations
- CSS animations use GPU acceleration
- Minimal DOM manipulation
- Efficient localStorage usage
- Debounced scroll events
- Lazy loading of history

### Loading Speed
- No external dependencies (except fonts)
- Inline critical CSS
- Minimal JavaScript
- Fast initial render

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

### Features
- Semantic HTML
- Keyboard navigation (Tab, Enter, Ctrl+Enter)
- Focus indicators
- High contrast text
- Touch-friendly (44px minimum)

### Future Enhancements
- ARIA labels
- Screen reader support
- Keyboard shortcuts guide
- Voice input option

## Testing Checklist

- [ ] Tool loads with correct configuration
- [ ] Input box accepts text
- [ ] Quick prompts populate input
- [ ] Generate button works
- [ ] Loading state displays
- [ ] Typing animation plays
- [ ] Output displays correctly
- [ ] Copy button works
- [ ] New query resets form
- [ ] History saves to localStorage
- [ ] History items load correctly
- [ ] Clear history works
- [ ] Back button navigates
- [ ] Responsive on mobile
- [ ] All links work

## Common Issues & Solutions

### History Not Saving
- Check localStorage is enabled
- Verify browser supports localStorage
- Check for quota exceeded errors

### Typing Animation Laggy
- Reduce typing speed (increase interval)
- Check for other heavy scripts
- Test on different devices

### Styles Not Loading
- Verify CSS file path is correct
- Check for CSS conflicts
- Clear browser cache

### Tool Config Not Loading
- Verify URL parameter is correct
- Check toolConfig object has the tool ID
- Ensure JavaScript is loaded

## Future Enhancements

### Planned Features
- Export history as PDF/JSON
- Share results via link
- Dark mode toggle
- Voice input/output
- Multi-language support
- Tool ratings/feedback
- Advanced filters for history
- Favorite/bookmark queries
- Collaborative sessions
- Analytics dashboard

### Advanced Features
- Real-time collaboration
- AI model selection
- Custom prompt templates
- Integration with other tools
- API key management
- Usage statistics
- A/B testing variants

## Deployment

### Production Checklist
1. Replace demo responses with real API
2. Add error handling
3. Implement rate limiting
4. Add analytics tracking
5. Optimize images
6. Minify CSS/JS
7. Enable HTTPS
8. Add meta tags for SEO
9. Test on all devices
10. Set up monitoring

## Support
For questions or customization help, refer to the main project documentation or contact the development team.

---

## Quick Start Example

To create a new tool called "Sleep Coach":

1. Add to `toolConfig`:
```javascript
'sleep-coach': {
    icon: '😴',
    name: 'Sleep Coach',
    description: 'Get better sleep with personalized tips',
    prompts: [
        'Can\'t fall asleep',
        'Wake up tired',
        'Better sleep routine',
        'Insomnia help'
    ],
    placeholder: 'Describe your sleep issues...'
}
```

2. Add demo response in `generateDemoResponse()`:
```javascript
'sleep-coach': `Here's your personalized sleep plan:...`
```

3. Link from homepage:
```html
<a href="pages/tool-template.html?tool=sleep-coach">Sleep Coach</a>
```

Done! The tool is ready to use.
