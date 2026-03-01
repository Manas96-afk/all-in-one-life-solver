# Sofi AI Chatbot

## Overview
Sofi is a friendly AI assistant chatbot widget that provides helpful advice and tips across various life categories. The chatbot uses predefined responses to simulate intelligent conversation.

## Features

### 🤖 Smart Responses
- **Study & Learning**: Focus techniques, memory tips, exam strategies
- **Productivity**: Time management, organization, workflow optimization
- **Motivation**: Goal setting, encouragement, success mindset
- **Fitness**: Exercise tips, health advice, workout guidance
- **Career**: Professional development, networking, skill building
- **Finance**: Budgeting, saving, investment basics
- **Stress Management**: Relaxation techniques, anxiety relief
- **Relationships**: Communication tips, social skills

### 💬 Interactive Features
- **Quick Questions**: Pre-defined buttons for common topics
- **Typing Indicators**: Realistic conversation flow
- **Smart Keyword Detection**: Recognizes topics from user messages
- **Contextual Responses**: Appropriate replies based on message content
- **Greeting & Goodbye**: Natural conversation starters and endings

### 🎨 Visual Design
- **Floating Chat Bubble**: Attractive bottom-right corner placement
- **Smooth Animations**: Bounce effects, pulse animations, slide transitions
- **Mobile Responsive**: Adapts to all screen sizes
- **Notification Badge**: Subtle encouragement for user interaction
- **Modern UI**: Clean, friendly interface with gradient colors

## Files Structure

```
├── js/chatbot.js          # Main chatbot functionality
├── css/chatbot.css        # Chatbot styling and animations
└── chatbot-readme.md      # This documentation file
```

## Integration

### HTML Pages
Add these lines before closing `</body>` tag:

```html
<link rel="stylesheet" href="../css/chatbot.css">
<script src="../js/chatbot.js"></script>
```

### Automatic Initialization
The chatbot automatically initializes when the DOM is loaded. No additional setup required.

## Customization

### Adding New Responses
Edit the `responses` object in `js/chatbot.js`:

```javascript
this.responses = {
    'new-category': [
        "Response 1 for new category",
        "Response 2 for new category"
    ]
};
```

### Adding Keywords
Update the `checkKeywords` method to include new keyword mappings:

```javascript
const keywords = {
    'new-category': ['keyword1', 'keyword2', 'keyword3']
};
```

### Styling Changes
Modify `css/chatbot.css` to change colors, sizes, or animations:

```css
.chat-bubble {
    background: your-custom-gradient;
}
```

## Response Categories

1. **Study**: Focus, learning techniques, exam preparation
2. **Productivity**: Time management, organization, efficiency
3. **Motivation**: Goal setting, encouragement, mindset
4. **Fitness**: Exercise, health, wellness
5. **Career**: Professional development, networking
6. **Finance**: Money management, budgeting, saving
7. **Stress**: Anxiety relief, relaxation techniques
8. **Relationships**: Communication, social skills

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance
- Lightweight: ~15KB total (JS + CSS)
- No external dependencies
- Minimal DOM manipulation
- Efficient event handling

## Future Enhancements
- [ ] Local storage for conversation history
- [ ] More sophisticated NLP for better keyword detection
- [ ] Integration with real AI APIs
- [ ] Voice input/output capabilities
- [ ] Multi-language support
- [ ] Analytics and usage tracking