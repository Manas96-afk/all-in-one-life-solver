# Quick Start: Adding a New Tool

## 🚀 Super Simple - 3 Steps Only!

### Step 1: Add Tool Configuration
Open `js/tool-template.js` and add your tool to the `toolConfig` object:

```javascript
const toolConfig = {
    // ... existing tools ...
    
    'your-tool-id': {
        icon: '🎯',                           // Pick an emoji
        name: 'Your Tool Name',               // Display name
        description: 'What your tool does',   // Short description
        prompts: [                            // 4 quick suggestions
            'Suggestion 1',
            'Suggestion 2',
            'Suggestion 3',
            'Suggestion 4'
        ],
        placeholder: 'Type your question here...'  // Input placeholder
    }
};
```

### Step 2: Add Demo Response
In the same file, add your demo response in the `generateDemoResponse()` function:

```javascript
const responses = {
    // ... existing responses ...
    
    'your-tool-id': `Your demo response here.
    
    You can use:
    • Bullet points
    • Multiple lines
    • Emojis 🎉
    • Formatting
    
    Make it helpful and engaging!`
};
```

### Step 3: Link from Homepage
Your tool is automatically available at:
```
pages/tool-template.html?tool=your-tool-id
```

That's it! No HTML or CSS changes needed. The template handles everything automatically.

---

## 📋 Complete Example: "Meal Planner" Tool

### 1. Configuration
```javascript
'meal-planner': {
    icon: '🍽️',
    name: 'Meal Planner',
    description: 'Get personalized weekly meal plans',
    prompts: [
        'Healthy meal plan',
        'Budget-friendly meals',
        'Quick 30-min recipes',
        'Vegetarian options'
    ],
    placeholder: 'Tell me your dietary preferences and goals...'
}
```

### 2. Demo Response
```javascript
'meal-planner': `Here's your personalized meal plan:

📅 Weekly Meal Plan:

Monday:
• Breakfast: Oatmeal with berries
• Lunch: Grilled chicken salad
• Dinner: Salmon with roasted vegetables

Tuesday:
• Breakfast: Greek yogurt parfait
• Lunch: Quinoa bowl
• Dinner: Stir-fry with tofu

... (continue for the week)

💡 Shopping List:
• Proteins: Chicken, salmon, tofu
• Vegetables: Broccoli, carrots, spinach
• Grains: Quinoa, oats, brown rice

Prep Time: 2 hours on Sunday
Budget: ~$50/week`
```

### 3. Access
```
pages/tool-template.html?tool=meal-planner
```

---

## 🎨 Customization Options

### Change Tool Colors
Edit `css/tool-template.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #YOUR_COLOR1, #YOUR_COLOR2);
}
```

### Adjust Typing Speed
Edit `js/tool-template.js`:
```javascript
// In typeResponse function
const interval = setInterval(() => {
    // Change 20 to adjust speed (lower = faster)
}, 20);
```

### Modify History Limit
```javascript
// In saveToHistory function
history = history.slice(0, 10);  // Change 10 to your limit
```

---

## 🔗 Adding Tool to Homepage

### Option 1: Add to Quick Tools Grid
Edit `index.html`:
```html
<div class="quick-tool-widget" data-tool="your-tool-id">
    <div class="widget-icon">🎯</div>
    <h3 class="widget-name">Your Tool Name</h3>
    <p class="widget-desc">Short description</p>
    <button class="widget-btn">Open Tool</button>
</div>
```

### Option 2: Add to Featured Tools
```html
<div class="tool-card">
    <div class="tool-icon">🎯</div>
    <h3>Your Tool Name</h3>
    <p>Description of what it does</p>
    <button class="tool-btn" onclick="window.location.href='pages/tool-template.html?tool=your-tool-id'">
        Open Tool
    </button>
</div>
```

---

## ✅ Testing Checklist

After adding a new tool:

- [ ] Tool loads with correct icon and name
- [ ] Description displays properly
- [ ] Quick prompts appear and work
- [ ] Input placeholder is correct
- [ ] Generate button works
- [ ] Demo response displays
- [ ] Typing animation plays
- [ ] Copy button works
- [ ] History saves and loads
- [ ] Back button returns to homepage
- [ ] Mobile responsive

---

## 🚨 Common Mistakes

### ❌ Wrong tool ID
```javascript
// In config
'meal-planner': { ... }

// In URL (WRONG - doesn't match)
?tool=mealplanner
```

✅ **Fix**: Make sure tool ID matches exactly (including hyphens)

### ❌ Missing demo response
If you add a tool config but forget the demo response, users will see a generic message.

✅ **Fix**: Always add both config AND demo response

### ❌ Forgetting to save
Changes to JS files require page refresh.

✅ **Fix**: Hard refresh (Ctrl+Shift+R) after changes

---

## 🎯 Real API Integration

When ready to connect to a real backend, replace the demo in `generateResponse()`:

```javascript
async function generateResponse() {
    const input = document.getElementById('userInput').value.trim();
    const toolId = getToolId();
    
    // Call your API
    const response = await fetch('https://your-api.com/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            tool: toolId,
            query: input
        })
    });
    
    const data = await response.json();
    
    // Display response
    await typeResponse(data.response, outputBox);
    saveToHistory(input, data.response);
}
```

---

## 📚 More Examples

### Relationship Advisor
```javascript
'relationship-advisor': {
    icon: '💑',
    name: 'Relationship Advisor',
    description: 'Get advice on relationship challenges',
    prompts: [
        'Communication issues',
        'Trust problems',
        'Long distance tips',
        'Conflict resolution'
    ],
    placeholder: 'Describe your relationship situation...'
}
```

### Budget Calculator
```javascript
'budget-calculator': {
    icon: '💵',
    name: 'Budget Calculator',
    description: 'Create and manage your monthly budget',
    prompts: [
        'Monthly budget plan',
        'Track expenses',
        'Save for goals',
        'Reduce spending'
    ],
    placeholder: 'Enter your income and expenses...'
}
```

### Interview Prep
```javascript
'interview-prep': {
    icon: '🎤',
    name: 'Interview Prep',
    description: 'Practice common interview questions',
    prompts: [
        'Tell me about yourself',
        'Strengths and weaknesses',
        'Why this company?',
        'Salary negotiation'
    ],
    placeholder: 'What position are you interviewing for?'
}
```

---

## 🎉 You're Done!

Your new tool is ready to use. The template handles:
- ✅ UI layout
- ✅ Styling
- ✅ Animations
- ✅ History storage
- ✅ Mobile responsiveness
- ✅ Copy functionality
- ✅ Loading states

Just focus on creating great content and prompts!

---

## 📞 Need Help?

- Check `tool-template-documentation.md` for detailed info
- Review existing tools in `toolConfig` for examples
- Test on multiple devices before launching
- Start with demo responses, add real API later

Happy building! 🚀
