## API Integration System - Complete Guide

## Overview
A flexible API integration system that supports multiple AI providers (OpenAI, Gemini, Groq, Custom) with secure local storage of API keys and automatic fallback to demo responses.

## Files Created

### Core Files
1. **js/api-config.js** - API configuration and integration logic
2. **pages/api-settings.html** - User-friendly settings page
3. **API-INTEGRATION-GUIDE.md** - This documentation

### Updated Files
4. **pages/tool-template.html** - Added API settings link and provider status
5. **js/tool-template.js** - Integrated API calls with fallback

## Features

### ✅ Multi-Provider Support
- **OpenAI** (GPT-3.5-turbo, GPT-4)
- **Google Gemini** (gemini-pro)
- **Groq** (mixtral-8x7b-32768) - Fast & Free!
- **Custom API** - Any compatible endpoint

### ✅ Secure Storage
- API keys stored in browser's localStorage
- Never sent to your servers
- Only used for direct API calls
- Can be cleared anytime

### ✅ Smart Features
- Automatic fallback to demo mode
- Error handling with user-friendly messages
- Context-aware prompts per tool
- History included in API calls (last 3 conversations)
- Test API connection before using

### ✅ User Experience
- Settings page with clear instructions
- Provider status shown in tool header
- One-click provider switching
- API key validation
- Connection testing

## How It Works

### 1. User Configuration Flow

```
User visits API Settings
    ↓
Selects Provider (OpenAI/Gemini/Groq/Custom)
    ↓
Enters API Key
    ↓
(Optional) Tests Connection
    ↓
Saves Settings to localStorage
    ↓
Returns to Tool
```

### 2. API Call Flow

```
User submits query
    ↓
Check if API configured
    ↓
YES: Call real API with context
    ↓
Display response with typing animation
    ↓
NO: Use demo response
```

### 3. Error Handling

```
API call fails
    ↓
Show error message to user
    ↓
Wait 2 seconds
    ↓
Fallback to demo response
    ↓
User can still use the tool
```

## API Request Format

### Standard Request Structure
```javascript
{
    user_input: "User's question",
    selected_tool: "life-advisor",
    system_prompt: "You are a compassionate life advisor...",
    model: "gpt-3.5-turbo",
    history: [
        {
            query: "Previous question",
            response: "Previous answer"
        }
    ]
}
```

### OpenAI Format
```javascript
{
    model: "gpt-3.5-turbo",
    messages: [
        { role: "system", content: "System prompt" },
        { role: "user", content: "Previous query" },
        { role: "assistant", content: "Previous response" },
        { role: "user", content: "Current query" }
    ],
    temperature: 0.7,
    max_tokens: 1000
}
```

### Gemini Format
```javascript
{
    contents: [{
        parts: [{
            text: "Full prompt with history"
        }]
    }]
}
```

### Groq Format
Same as OpenAI (OpenAI-compatible API)

## Configuration Guide

### For OpenAI

1. **Get API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create new secret key
   - Copy the key (shown only once!)

2. **Configure:**
   - Go to API Settings page
   - Select "OpenAI"
   - Paste API key
   - Click "Save Settings"

3. **Models Available:**
   - gpt-3.5-turbo (default, fast & cheap)
   - gpt-4 (more capable, slower, expensive)

### For Google Gemini

1. **Get API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create API key
   - Copy the key

2. **Configure:**
   - Go to API Settings page
   - Select "Google Gemini"
   - Paste API key
   - Click "Save Settings"

3. **Models Available:**
   - gemini-pro (default)

### For Groq (Recommended - Free & Fast!)

1. **Get API Key:**
   - Visit: https://console.groq.com/keys
   - Sign up (free)
   - Create API key
   - Copy the key

2. **Configure:**
   - Go to API Settings page
   - Select "Groq"
   - Paste API key
   - Click "Save Settings"

3. **Models Available:**
   - mixtral-8x7b-32768 (default, very fast!)
   - llama2-70b-4096
   - gemma-7b-it

### For Custom API

1. **Requirements:**
   - Your API endpoint URL
   - API key (if required)
   - Model name (optional)

2. **Configure:**
   - Go to API Settings page
   - Select "Custom API"
   - Enter endpoint URL
   - Enter API key
   - Enter model name (optional)
   - Click "Save Settings"

3. **Expected Response Format:**
   Your API should return JSON with one of these fields:
   - `response`
   - `message`
   - `content`
   - `text`

## System Prompts

Each tool has a tailored system prompt:

### Life Advisor
```
You are a compassionate life advisor. Provide thoughtful, actionable 
advice for daily life problems. Use friendly language, bullet points, 
and emojis. Be encouraging and supportive.
```

### Mood Fixer
```
You are a motivational coach. Provide uplifting quotes, positive 
affirmations, and mood-boosting advice. Be energetic, encouraging, 
and inspiring.
```

### Career Coach
```
You are a career counselor. Provide practical career advice, job 
search tips, and professional development guidance. Be professional 
yet approachable.
```

(And so on for each tool...)

## localStorage Structure

### Keys Used
```javascript
{
    ai_provider: 'openai',           // Selected provider
    ai_api_key: 'sk-...',            // API key (encrypted by browser)
    ai_custom_endpoint: 'https://...', // Custom endpoint (if used)
    ai_custom_model: 'model-name'    // Custom model (if used)
}
```

### Security Notes
- localStorage is domain-specific
- Keys are not accessible from other websites
- Keys are stored in plain text locally (browser security)
- Never log or expose keys in console
- Users can clear keys anytime

## API Functions Reference

### Main Functions

#### `callAI(userInput, toolId, history)`
Main function to call any configured AI provider.

**Parameters:**
- `userInput` (string): User's question/input
- `toolId` (string): Tool identifier (e.g., 'life-advisor')
- `history` (array): Previous conversation history

**Returns:**
- `string`: AI response
- `null`: If demo mode or no API key

**Example:**
```javascript
const response = await callAI(
    "I feel stuck in life",
    "life-advisor",
    []
);
```

#### `getAPIConfig()`
Get current API configuration from localStorage.

**Returns:**
```javascript
{
    provider: 'openai',
    apiKey: 'sk-...',
    customEndpoint: '',
    customModel: ''
}
```

#### `saveAPIConfig(provider, apiKey, customEndpoint, customModel)`
Save API configuration to localStorage.

**Parameters:**
- `provider` (string): 'openai', 'gemini', 'groq', 'custom', or 'demo'
- `apiKey` (string): API key
- `customEndpoint` (string): Custom endpoint URL (optional)
- `customModel` (string): Custom model name (optional)

#### `isAPIConfigured()`
Check if API is properly configured.

**Returns:**
- `boolean`: true if configured, false otherwise

#### `getCurrentProviderName()`
Get human-readable name of current provider.

**Returns:**
- `string`: 'Demo Mode', 'OpenAI', 'Google Gemini', etc.

### Provider-Specific Functions

#### `callOpenAI(userInput, toolId, history)`
Call OpenAI API directly.

#### `callGemini(userInput, toolId, history)`
Call Google Gemini API directly.

#### `callGroq(userInput, toolId, history)`
Call Groq API directly.

#### `callCustomAPI(userInput, toolId, history)`
Call custom API endpoint.

## Error Handling

### Common Errors

#### "API key not configured"
**Solution:** Go to API Settings and enter your API key

#### "OpenAI API error: 401"
**Solution:** Invalid API key. Check and re-enter your key

#### "OpenAI API error: 429"
**Solution:** Rate limit exceeded. Wait a moment or upgrade plan

#### "Gemini API error: 400"
**Solution:** Invalid request format. Check API key and try again

#### "Network error"
**Solution:** Check internet connection

#### "Custom API endpoint not configured"
**Solution:** Enter your custom endpoint URL in settings

### Error Display
When an API error occurs:
1. Error message shown in output box (red background)
2. Wait 2 seconds
3. Automatically fallback to demo response
4. User can continue using the tool

## Testing

### Test API Connection

1. Go to API Settings page
2. Configure your provider and API key
3. Click "🧪 Test API" button
4. Wait for result:
   - ✅ Success: "API test successful!"
   - ❌ Error: Shows specific error message

### Manual Testing

```javascript
// In browser console
const response = await callAI(
    "Hello, this is a test",
    "life-advisor",
    []
);
console.log(response);
```

## Cost Considerations

### OpenAI Pricing (as of 2024)
- GPT-3.5-turbo: ~$0.002 per 1K tokens
- GPT-4: ~$0.03 per 1K tokens
- Average query: 500-1000 tokens
- Cost per query: $0.001 - $0.03

### Gemini Pricing
- Free tier: 60 requests per minute
- Paid tier: Variable pricing

### Groq Pricing
- **FREE** during beta
- Very fast responses
- Generous rate limits

### Recommendations
1. **Start with Groq** - Free and fast
2. **Use GPT-3.5** for production - Good balance
3. **Use GPT-4** for complex queries only
4. **Monitor usage** to avoid unexpected costs

## Privacy & Security

### What's Stored Locally
- ✅ API provider selection
- ✅ API key
- ✅ Custom endpoint (if used)
- ✅ Custom model name (if used)
- ✅ Conversation history (per tool)

### What's NOT Stored
- ❌ API keys are never sent to your servers
- ❌ Conversations are not logged server-side
- ❌ User data is not tracked

### Security Best Practices
1. **Never share API keys** with anyone
2. **Rotate keys regularly** (monthly recommended)
3. **Use environment-specific keys** (dev vs prod)
4. **Monitor API usage** for unusual activity
5. **Clear keys** when using shared computers
6. **Use browser's private mode** for sensitive queries

## Troubleshooting

### API not working?

**Check:**
1. Is provider selected correctly?
2. Is API key entered correctly?
3. Is internet connection working?
4. Are there any console errors?
5. Try the "Test API" button

**Solutions:**
1. Clear settings and reconfigure
2. Try a different provider
3. Check API provider's status page
4. Verify API key is still valid

### Demo mode stuck?

**Check:**
1. Go to API Settings
2. Verify provider is not "Demo Mode"
3. Verify API key is entered
4. Click "Save Settings"

### Responses too slow?

**Solutions:**
1. Switch to Groq (fastest)
2. Use GPT-3.5 instead of GPT-4
3. Reduce history context
4. Check internet speed

### Responses not relevant?

**Solutions:**
1. Provide more context in query
2. Try rephrasing question
3. Check if correct tool is selected
4. System prompt may need adjustment

## Advanced Customization

### Adding New Provider

1. **Add to API_PROVIDERS:**
```javascript
newprovider: {
    name: 'New Provider',
    endpoint: 'https://api.newprovider.com/v1/chat',
    model: 'model-name',
    requiresKey: true
}
```

2. **Create call function:**
```javascript
async function callNewProvider(userInput, toolId, history) {
    // Implementation
}
```

3. **Add to callAI switch:**
```javascript
case 'newprovider':
    return await callNewProvider(userInput, toolId, history);
```

### Customizing System Prompts

Edit `getSystemPrompt()` function in `js/api-config.js`:

```javascript
function getSystemPrompt(toolId) {
    const prompts = {
        'your-tool': 'Your custom system prompt here...'
    };
    return prompts[toolId] || 'Default prompt';
}
```

### Adjusting API Parameters

In provider-specific functions, modify:
- `temperature`: 0.0 (focused) to 1.0 (creative)
- `max_tokens`: Response length limit
- `top_p`: Nucleus sampling
- `frequency_penalty`: Reduce repetition
- `presence_penalty`: Encourage new topics

## Future Enhancements

### Planned Features
- [ ] Multiple API key support (rotation)
- [ ] Usage tracking and analytics
- [ ] Cost estimation per query
- [ ] Response caching
- [ ] Streaming responses
- [ ] Voice input/output
- [ ] Image generation support
- [ ] Fine-tuned model support
- [ ] Conversation export
- [ ] API key encryption

### Community Requests
- Azure OpenAI support
- Anthropic Claude support
- Local LLM support (Ollama)
- Batch processing
- API key sharing (team accounts)

## Support

### Getting Help
1. Check this documentation
2. Review console errors
3. Test with demo mode first
4. Try different providers
5. Check provider's documentation

### Reporting Issues
When reporting API issues, include:
- Provider name
- Error message
- Browser console logs
- Steps to reproduce
- Expected vs actual behavior

## Quick Reference

### Access API Settings
```
pages/api-settings.html
```

### Check Current Provider
Look at tool header: "⚙️ [Provider Name]"

### Switch to Demo Mode
1. Go to API Settings
2. Select "Demo Mode"
3. Click "Save Settings"

### Clear All Settings
1. Go to API Settings
2. Click "🗑️ Clear All"
3. Confirm

### Test Connection
1. Go to API Settings
2. Configure provider
3. Click "🧪 Test API"

---

## Status: ✅ COMPLETE AND READY TO USE

All API integration features are implemented and tested:
- ✅ Multi-provider support (OpenAI, Gemini, Groq, Custom)
- ✅ Secure local storage
- ✅ Settings page with UI
- ✅ Automatic fallback to demo
- ✅ Error handling
- ✅ Context-aware prompts
- ✅ History integration
- ✅ Connection testing

The system is production-ready and can be used immediately! 🎉
