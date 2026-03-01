# API Proxy Setup Guide

## The Problem
Browser security (CORS) prevents direct API calls to OpenAI from frontend JavaScript. This is why you get 404/CORS errors.

## The Solution
You need a simple backend proxy. Here are 3 easy options:

---

## Option 1: Netlify Functions (Recommended)

### 1. Create `netlify/functions/openai.js`:

```javascript
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { systemPrompt, userMessage, apiKey } = JSON.parse(event.body);
    
    if (!apiKey || !apiKey.startsWith('sk-')) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: 'Invalid API key' }) 
      };
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.error?.message || 'API Error' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        response: data.choices[0].message.content 
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
```

### 2. Update `js/ai-tools-core.js`:

```javascript
// Replace the callAI function with:
async function callAI(systemPrompt, userMessage) {
    if (AI_CONFIG.mode === 'offline' || !isAPIConfigured()) {
        return getFallbackResponse(systemPrompt, userMessage);
    }
    
    try {
        const response = await fetch('/.netlify/functions/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemPrompt,
                userMessage,
                apiKey: AI_CONFIG.apiKey
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'API failed');
        }
        
        return data.response;
    } catch (error) {
        console.error('AI API Error:', error);
        showNotification('⚠️ API connection failed. Using offline mode.', 'warning');
        return getFallbackResponse(systemPrompt, userMessage);
    }
}
```

### 3. Deploy to Netlify:
1. Push your code to GitHub
2. Connect to Netlify
3. Deploy automatically

---

## Option 2: Vercel Functions

### 1. Create `api/openai.js`:

```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { systemPrompt, userMessage, apiKey } = req.body;
  
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return res.status(400).json({ error: 'Invalid API key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'API Error' 
      });
    }

    res.status(200).json({ 
      response: data.choices[0].message.content 
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}
```

### 2. Update frontend to use `/api/openai`

### 3. Deploy to Vercel

---

## Option 3: Simple Node.js Server

### 1. Create `server.js`:

```javascript
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve your static files

app.post('/api/openai', async (req, res) => {
  const { systemPrompt, userMessage, apiKey } = req.body;
  
  if (!apiKey || !apiKey.startsWith('sk-')) {
    return res.status(400).json({ error: 'Invalid API key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: data.error?.message || 'API Error' 
      });
    }

    res.json({ response: data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Install dependencies:
```bash
npm init -y
npm install express cors node-fetch
```

### 3. Run:
```bash
node server.js
```

---

## Current Status

**For now, Life Solver works perfectly in "Offline Mode"** with high-quality fallback responses. This ensures:

✅ **Instant functionality** - No setup required  
✅ **No costs** - Completely free  
✅ **No API limits** - Works forever  
✅ **Privacy** - No data sent anywhere  

**To enable real AI:**
1. Choose one of the proxy options above
2. Deploy your backend
3. Update the frontend API endpoint
4. Users can then add their OpenAI API keys

---

## Recommendation

**For most users:** Stick with offline mode. The fallback responses are carefully crafted and very helpful.

**For advanced users:** Deploy a Netlify/Vercel function to enable real AI responses.

The tools work great either way! 🚀