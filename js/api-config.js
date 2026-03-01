// API Configuration and Integration System

// API Provider Configurations
const API_PROVIDERS = {
    openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        requiresKey: true
    },
    gemini: {
        name: 'Google Gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        requiresKey: true
    },
    groq: {
        name: 'Groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768',
        requiresKey: true
    },
    custom: {
        name: 'Custom API',
        endpoint: '',
        model: '',
        requiresKey: true
    }
};

// LocalStorage keys
const STORAGE_KEYS = {
    provider: 'ai_provider',
    apiKey: 'ai_api_key',
    customEndpoint: 'ai_custom_endpoint',
    customModel: 'ai_custom_model'
};

// Get stored API configuration
function getAPIConfig() {
    return {
        provider: localStorage.getItem(STORAGE_KEYS.provider) || 'demo',
        apiKey: localStorage.getItem(STORAGE_KEYS.apiKey) || '',
        customEndpoint: localStorage.getItem(STORAGE_KEYS.customEndpoint) || '',
        customModel: localStorage.getItem(STORAGE_KEYS.customModel) || ''
    };
}

// Save API configuration
function saveAPIConfig(provider, apiKey, customEndpoint = '', customModel = '') {
    localStorage.setItem(STORAGE_KEYS.provider, provider);
    if (apiKey) {
        localStorage.setItem(STORAGE_KEYS.apiKey, apiKey);
    }
    if (customEndpoint) {
        localStorage.setItem(STORAGE_KEYS.customEndpoint, customEndpoint);
    }
    if (customModel) {
        localStorage.setItem(STORAGE_KEYS.customModel, customModel);
    }
}

// Clear API configuration
function clearAPIConfig() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
}

// Check if API is configured
function isAPIConfigured() {
    const config = getAPIConfig();
    if (config.provider === 'demo') return true;
    return config.apiKey && config.apiKey.length > 0;
}

// Build system prompt for each tool
function getSystemPrompt(toolId) {
    const prompts = {
        'life-advisor': 'You are a compassionate life advisor. Provide thoughtful, actionable advice for daily life problems. Use friendly language, bullet points, and emojis. Be encouraging and supportive.',
        'mood-fixer': 'You are a motivational coach. Provide uplifting quotes, positive affirmations, and mood-boosting advice. Be energetic, encouraging, and inspiring.',
        'career-coach': 'You are a career counselor. Provide practical career advice, job search tips, and professional development guidance. Be professional yet approachable.',
        'study-planner': 'You are a study coach. Create effective study plans, provide learning strategies, and help with time management. Be organized and encouraging.',
        'workout-suggestor': 'You are a fitness coach. Suggest home workouts, exercise routines, and fitness tips. Be motivating and safety-conscious.',
        'breakup-friend': 'You are a supportive friend helping someone through a breakup. Provide emotional support, coping strategies, and healing advice. Be empathetic and gentle.',
        'money-mentor': 'You are a financial advisor. Provide simple budgeting tips, savings strategies, and money management advice. Be practical and non-judgmental.',
        'productivity-boost': 'You are a productivity expert. Provide time management tips, focus strategies, and productivity hacks. Be practical and actionable.'
    };
    
    return prompts[toolId] || 'You are a helpful AI assistant. Provide clear, actionable advice in a friendly manner.';
}

// Call OpenAI API
async function callOpenAI(userInput, toolId, history = []) {
    const config = getAPIConfig();
    const provider = API_PROVIDERS.openai;
    
    const messages = [
        { role: 'system', content: getSystemPrompt(toolId) }
    ];
    
    // Add history if provided
    if (history.length > 0) {
        history.slice(-3).forEach(item => {
            messages.push({ role: 'user', content: item.query });
            messages.push({ role: 'assistant', content: item.response });
        });
    }
    
    // Add current message
    messages.push({ role: 'user', content: userInput });
    
    const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: provider.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        })
    });
    
    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Call Gemini API
async function callGemini(userInput, toolId, history = []) {
    const config = getAPIConfig();
    const provider = API_PROVIDERS.gemini;
    
    // Build prompt with system instructions and history
    let fullPrompt = getSystemPrompt(toolId) + '\n\n';
    
    if (history.length > 0) {
        fullPrompt += 'Previous conversation:\n';
        history.slice(-3).forEach(item => {
            fullPrompt += `User: ${item.query}\nAssistant: ${item.response}\n\n`;
        });
    }
    
    fullPrompt += `User: ${userInput}\nAssistant:`;
    
    const response = await fetch(`${provider.endpoint}?key=${config.apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: fullPrompt
                }]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// Call Groq API
async function callGroq(userInput, toolId, history = []) {
    const config = getAPIConfig();
    const provider = API_PROVIDERS.groq;
    
    const messages = [
        { role: 'system', content: getSystemPrompt(toolId) }
    ];
    
    // Add history if provided
    if (history.length > 0) {
        history.slice(-3).forEach(item => {
            messages.push({ role: 'user', content: item.query });
            messages.push({ role: 'assistant', content: item.response });
        });
    }
    
    // Add current message
    messages.push({ role: 'user', content: userInput });
    
    const response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
            model: provider.model,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1000
        })
    });
    
    if (!response.ok) {
        throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
}

// Call Custom API
async function callCustomAPI(userInput, toolId, history = []) {
    const config = getAPIConfig();
    
    const endpoint = config.customEndpoint || API_PROVIDERS.custom.endpoint;
    const model = config.customModel || API_PROVIDERS.custom.model;
    
    if (!endpoint) {
        throw new Error('Custom API endpoint not configured');
    }
    
    // Standard format that most APIs accept
    const requestBody = {
        user_input: userInput,
        selected_tool: toolId,
        system_prompt: getSystemPrompt(toolId),
        model: model,
        history: history.slice(-3).map(item => ({
            query: item.query,
            response: item.response
        }))
    };
    
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Try to extract response from common response formats
    return data.response || data.message || data.content || data.text || JSON.stringify(data);
}

// Main API call function
async function callAI(userInput, toolId, history = []) {
    const config = getAPIConfig();
    
    // If demo mode or no API key, return null (will use demo responses)
    if (config.provider === 'demo' || !config.apiKey) {
        return null;
    }
    
    try {
        switch (config.provider) {
            case 'openai':
                return await callOpenAI(userInput, toolId, history);
            case 'gemini':
                return await callGemini(userInput, toolId, history);
            case 'groq':
                return await callGroq(userInput, toolId, history);
            case 'custom':
                return await callCustomAPI(userInput, toolId, history);
            default:
                throw new Error('Unknown API provider');
        }
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Get current provider name
function getCurrentProviderName() {
    const config = getAPIConfig();
    if (config.provider === 'demo') return 'Demo Mode';
    return API_PROVIDERS[config.provider]?.name || 'Unknown';
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_PROVIDERS,
        getAPIConfig,
        saveAPIConfig,
        clearAPIConfig,
        isAPIConfigured,
        callAI,
        getCurrentProviderName
    };
}
