// AI Tools Core - Shared functionality for all mini tools

// API Configuration
const AI_CONFIG = {
    // 🔑 DEFAULT GEMINI API KEY (Used for all users)
    defaultGeminiKey: 'AIzaSyCUDQSN0mlMirZyDBN7MBD3z5R3ZIoCnEI', // Your API key for all users
    
    // Premium users can override with their own keys
    openaiKey: localStorage.getItem('openai_api_key') || '',
    geminiKey: localStorage.getItem('gemini_api_key') || '', // Premium user's custom Gemini key
    
    provider: localStorage.getItem('ai_provider') || 'gemini', // Default to Gemini
    model: 'gpt-3.5-turbo',
    maxTokens: 500,
    temperature: 0.7,
    
    // AI enabled by default for all users
    mode: localStorage.getItem('ai_mode') || 'api'
};

// Check if API is configured
function isAPIConfigured() {
    if (AI_CONFIG.provider === 'gemini') {
        // Check if user has custom key OR default key is available
        const userKey = AI_CONFIG.geminiKey;
        const defaultKey = AI_CONFIG.defaultGeminiKey;
        
        return (userKey && userKey.length > 10) || 
               (defaultKey && defaultKey.length > 10 && defaultKey !== 'YOUR_GEMINI_API_KEY_HERE');
    } else {
        return AI_CONFIG.openaiKey && AI_CONFIG.openaiKey.length > 10;
    }
}

// Get the active Gemini API key (user's custom key or default)
function getActiveGeminiKey() {
    const userKey = AI_CONFIG.geminiKey;
    const defaultKey = AI_CONFIG.defaultGeminiKey;
    
    // Use user's custom key if available, otherwise use default
    if (userKey && userKey.length > 10) {
        return userKey;
    } else if (defaultKey && defaultKey.length > 10 && defaultKey !== 'YOUR_GEMINI_API_KEY_HERE') {
        return defaultKey;
    }
    
    return null;
}

// Show API setup prompt
function showAPISetupPrompt() {
    const modal = createAPISetupModal();
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// Create API setup modal
function createAPISetupModal() {
    const modal = document.createElement('div');
    modal.className = 'api-setup-modal';
    modal.innerHTML = `
        <div class="api-setup-content">
            <div class="api-setup-header">
                <h3>🤖 Enable AI Features</h3>
                <button class="api-close-btn" onclick="this.closest('.api-setup-modal').remove()">✕</button>
            </div>
            <div class="api-setup-body">
                <p>Choose your AI provider:</p>
                
                <div class="provider-tabs" style="display: flex; gap: 0.5rem; margin: 1rem 0;">
                    <button id="geminiTab" class="provider-tab active" onclick="switchProvider('gemini')">Gemini (Recommended)</button>
                    <button id="openaiTab" class="provider-tab" onclick="switchProvider('openai')">OpenAI</button>
                </div>
                
                <div id="geminiSetup">
                    <div class="api-input-group">
                        <input type="password" id="geminiKeyInput" placeholder="AIza..." style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; margin: 0.5rem 0;">
                        <small style="color: #718096;">Get your free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a></small>
                    </div>
                    <div class="api-info">
                        <p><strong>✅ Works directly from browser</strong> - No backend needed!</p>
                        <p><strong>✅ Free tier:</strong> 60 requests per minute</p>
                        <p><strong>Privacy:</strong> Your API key is stored locally only.</p>
                    </div>
                </div>
                
                <div id="openaiSetup" style="display: none;">
                    <div class="api-input-group">
                        <input type="password" id="openaiKeyInput" placeholder="sk-..." style="width: 100%; padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; margin: 0.5rem 0;">
                        <small style="color: #718096;">Get your API key at <a href="https://platform.openai.com/api-keys" target="_blank">platform.openai.com</a></small>
                    </div>
                    <div class="api-info">
                        <p><strong>⚠️ Requires backend proxy</strong> due to browser security</p>
                        <p><strong>Cost:</strong> ~$0.002 per request</p>
                        <p><strong>Privacy:</strong> Your API key is stored locally only.</p>
                    </div>
                </div>
                
                <div class="api-actions">
                    <button onclick="saveAPIKey()" class="api-save-btn">Save Key</button>
                    <button onclick="this.closest('.api-setup-modal').remove()" class="api-cancel-btn">Use Offline Mode</button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .api-setup-modal {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 10000; opacity: 0; transition: opacity 0.3s ease; padding: 1rem;
        }
        .api-setup-modal.show { opacity: 1; }
        .api-setup-content {
            background: white; border-radius: 16px; max-width: 500px; width: 100%;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: modalSlideUp 0.4s ease;
        }
        .api-setup-header {
            padding: 1.5rem 2rem; border-bottom: 1px solid #e2e8f0;
            display: flex; align-items: center; justify-content: space-between;
        }
        .api-setup-header h3 { margin: 0; color: #2d3748; }
        .api-close-btn {
            background: none; border: none; font-size: 1.5rem; cursor: pointer;
            color: #a0aec0; padding: 0; width: 32px; height: 32px;
            display: flex; align-items: center; justify-content: center; border-radius: 50%;
        }
        .api-close-btn:hover { background: #edf2f7; color: #4a5568; }
        .api-setup-body { padding: 2rem; }
        .api-setup-body p { margin-bottom: 1rem; color: #4a5568; }
        .api-actions {
            display: flex; gap: 0.75rem; margin: 1.5rem 0 1rem;
        }
        .api-save-btn {
            flex: 1; padding: 0.75rem 1.5rem; background: #667eea; color: white;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .api-save-btn:hover { background: #5568d3; }
        .api-cancel-btn {
            padding: 0.75rem 1.5rem; background: #e2e8f0; color: #4a5568;
            border: none; border-radius: 8px; font-weight: 600; cursor: pointer;
        }
        .api-cancel-btn:hover { background: #cbd5e0; }
        .api-info { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
        .api-info p { margin: 0.5rem 0; font-size: 0.875rem; color: #718096; }
        .provider-tabs { display: flex; gap: 0.5rem; margin: 1rem 0; }
        .provider-tab { 
            flex: 1; padding: 0.5rem 1rem; border: 2px solid #e2e8f0; 
            background: white; border-radius: 8px; cursor: pointer; font-weight: 600;
        }
        .provider-tab.active { border-color: #667eea; background: #667eea; color: white; }
        @keyframes modalSlideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    return modal;
}

// Switch provider in modal
function switchProvider(provider) {
    document.querySelectorAll('.provider-tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(provider + 'Tab').classList.add('active');
    
    document.getElementById('geminiSetup').style.display = provider === 'gemini' ? 'block' : 'none';
    document.getElementById('openaiSetup').style.display = provider === 'openai' ? 'block' : 'none';
}

// Save API key from modal
function saveAPIKey() {
    const activeProvider = document.querySelector('.provider-tab.active').id.replace('Tab', '');
    let key, keyPrefix;
    
    if (activeProvider === 'gemini') {
        key = document.getElementById('geminiKeyInput').value.trim();
        keyPrefix = 'AIza';
    } else {
        key = document.getElementById('openaiKeyInput').value.trim();
        keyPrefix = 'sk-';
    }
    
    if (!key) {
        alert('Please enter an API key');
        return;
    }
    
    if (!key.startsWith(keyPrefix)) {
        alert(`${activeProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key should start with "${keyPrefix}"`);
        return;
    }
    
    // Save the key and provider
    if (activeProvider === 'gemini') {
        localStorage.setItem('gemini_api_key', key);
        AI_CONFIG.geminiKey = key;
    } else {
        localStorage.setItem('openai_api_key', key);
        AI_CONFIG.openaiKey = key;
    }
    
    localStorage.setItem('ai_provider', activeProvider);
    localStorage.setItem('ai_mode', 'api');
    AI_CONFIG.provider = activeProvider;
    AI_CONFIG.mode = 'api';
    
    document.querySelector('.api-setup-modal').remove();
    showNotification(`✅ ${activeProvider === 'gemini' ? 'Gemini' : 'OpenAI'} API key saved! AI features enabled.`, 'success');
}

// Make functions available globally
window.switchProvider = switchProvider;

// Call AI API with Gemini and OpenAI support
async function callAI(systemPrompt, userMessage) {
    if (AI_CONFIG.mode === 'offline' || !isAPIConfigured()) {
        return getFallbackResponse(systemPrompt, userMessage);
    }
    
    try {
        if (AI_CONFIG.provider === 'gemini') {
            return await callGeminiAPI(systemPrompt, userMessage);
        } else {
            return await callOpenAIAPI(systemPrompt, userMessage);
        }
    } catch (error) {
        console.error('AI API Error:', error);
        showNotification('⚠️ API connection failed. Using offline mode.', 'warning');
        return getFallbackResponse(systemPrompt, userMessage);
    }
}

// Call Gemini API (works directly from browser)
async function callGeminiAPI(systemPrompt, userMessage) {
    const apiKey = getActiveGeminiKey();
    
    if (!apiKey) {
        throw new Error('No Gemini API key available');
    }
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser: ${userMessage}`
                }]
            }],
            generationConfig: {
                temperature: AI_CONFIG.temperature,
                maxOutputTokens: AI_CONFIG.maxTokens,
            }
        })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Gemini API Error: ${errorData.error?.message || response.status}`);
    }
    
    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Invalid Gemini API response format');
    }
}

// Call OpenAI API (requires backend proxy due to CORS)
async function callOpenAIAPI(systemPrompt, userMessage) {
    // This would need a backend proxy to work from browser
    throw new Error('OpenAI API requires backend proxy due to CORS restrictions');
}

// Fallback responses when API is not available
function getFallbackResponse(systemPrompt, userMessage) {
    // Detect tool type from system prompt
    const prompt = systemPrompt.toLowerCase();
    
    if (prompt.includes('life advisor') || prompt.includes('life advice')) {
        return getLifeAdvisorFallback(userMessage);
    }
    if (prompt.includes('mood') || prompt.includes('motivat')) {
        return getMoodFixerFallback();
    }
    if (prompt.includes('career')) {
        return getCareerCoachFallback(userMessage);
    }
    if (prompt.includes('study') || prompt.includes('planner')) {
        return getStudyPlannerFallback(userMessage);
    }
    if (prompt.includes('workout') || prompt.includes('exercise')) {
        return getWorkoutFallback(userMessage);
    }
    if (prompt.includes('breakup') || prompt.includes('coping')) {
        return getBreakupFriendFallback();
    }
    if (prompt.includes('money') || prompt.includes('saving') || prompt.includes('finance')) {
        return getMoneyMentorFallback(userMessage);
    }
    if (prompt.includes('productivity') || prompt.includes('focus')) {
        return getProductivityFallback();
    }
    
    return "I'm here to help! For the best experience, please set up your API key in settings.";
}

// Fallback: Life Advisor
function getLifeAdvisorFallback(input) {
    const responses = [
        `Here's my advice for your situation:\n\n1. Take a step back and breathe. Whatever you're facing, it's manageable.\n\n2. Break down the problem into smaller parts. What's the first small step you can take?\n\n3. Remember that asking for help is a sign of strength, not weakness.\n\n4. Focus on what you can control, and let go of what you can't.\n\n5. This too shall pass. You've overcome challenges before, and you'll overcome this one too.`,
        `Based on what you've shared:\n\n✨ First, acknowledge your feelings - they're valid.\n\n✨ Consider: What would you tell a friend in this situation?\n\n✨ Small progress is still progress. Start with one tiny action today.\n\n✨ Surround yourself with supportive people.\n\n✨ Remember: You're doing better than you think.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Fallback: Mood Fixer
function getMoodFixerFallback() {
    const quotes = [
        `🌟 "The only way to do great work is to love what you do." - Steve Jobs\n\nRemember: Every day is a fresh start. You have the power to make today amazing. Take a deep breath, smile, and tackle one thing at a time. You've got this!`,
        `💪 "Believe you can and you're halfway there." - Theodore Roosevelt\n\nYou are stronger than you know. Every challenge you've faced has prepared you for this moment. Keep going - your breakthrough is closer than you think!`,
        `✨ "The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt\n\nYour dreams are valid. Your goals are achievable. Take it one step at a time, and don't forget to celebrate the small wins along the way.`,
        `🌈 "In the middle of difficulty lies opportunity." - Albert Einstein\n\nWhatever you're going through right now is temporary. Look for the lesson, find the silver lining, and remember that growth often comes from our toughest moments.`
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
}

// Fallback: Career Coach
function getCareerCoachFallback(input) {
    return `Career Guidance:\n\n📌 Self-Assessment:\n- What activities make you lose track of time?\n- What skills do others often compliment you on?\n- What problems do you enjoy solving?\n\n📌 Next Steps:\n1. Research 3 careers that align with your interests\n2. Connect with professionals in those fields on LinkedIn\n3. Take on a small project or volunteer work in that area\n4. Update your resume to highlight transferable skills\n\n📌 Remember:\n- Career paths are rarely linear\n- It's okay to pivot and change direction\n- Focus on building skills, not just job titles\n- Network authentically - help others first`;
}

// Fallback: Study Planner
function getStudyPlannerFallback(input) {
    return `📚 Your Study Plan:\n\n⏰ Morning Session (2 hours):\n- 25 min: Review yesterday's material\n- 5 min: Break\n- 25 min: New topic - active reading\n- 5 min: Break\n- 25 min: Practice problems\n- 5 min: Break\n- 25 min: Summarize key points\n\n🌅 Afternoon Session (2 hours):\n- 25 min: Difficult concepts\n- 5 min: Break\n- 25 min: Flashcard review\n- 5 min: Break\n- 25 min: Practice questions\n- 5 min: Break\n- 25 min: Teach what you learned\n\n💡 Tips:\n- Use active recall, not passive reading\n- Take real breaks - walk, stretch\n- Stay hydrated and snack healthy\n- Review before sleep for better retention`;
}

// Fallback: Workout Suggestor
function getWorkoutFallback(input) {
    return `💪 Your Home Workout:\n\n🔥 Warm-Up (5 min):\n- Jumping jacks: 30 seconds\n- High knees: 30 seconds\n- Arm circles: 30 seconds\n- Leg swings: 30 seconds\n- Light jogging in place: 2 minutes\n\n💪 Main Workout (20 min):\n1. Push-ups: 3 sets of 10\n2. Squats: 3 sets of 15\n3. Lunges: 3 sets of 10 each leg\n4. Plank: 3 sets of 30 seconds\n5. Mountain climbers: 3 sets of 20\n6. Burpees: 3 sets of 8\n\n🧘 Cool Down (5 min):\n- Forward fold stretch\n- Quad stretch\n- Child's pose\n- Cat-cow stretch\n- Deep breathing\n\n💡 Remember: Listen to your body and modify as needed!`;
}

// Fallback: Breakup Friend
function getBreakupFriendFallback() {
    const messages = [
        `💙 I'm so sorry you're going through this. Breakups are genuinely hard, and your feelings are completely valid.\n\nHere's what I want you to know:\n\n1. It's okay to grieve. Let yourself feel the emotions.\n\n2. This pain is temporary. It doesn't feel like it now, but it will get easier.\n\n3. You are complete on your own. Your worth isn't defined by a relationship.\n\n4. Take care of yourself: eat well, sleep, move your body, talk to friends.\n\n5. Growth often comes from our hardest moments. You'll come out stronger.\n\nBe gentle with yourself. You're doing better than you think. 💙`,
        `🌟 Sending you so much support right now.\n\nBreakups can feel like the end of the world, but I promise you - this is also a beginning.\n\n✨ Allow yourself to feel without judgment\n✨ Lean on friends and family\n✨ Rediscover hobbies you love\n✨ Focus on self-care and growth\n✨ Remember: the right person won't leave\n\nYou deserve someone who chooses you every single day. This chapter is closing so a better one can begin. 🌟`
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Fallback: Money Mentor
function getMoneyMentorFallback(input) {
    return `💰 Money Tips for You:\n\n📊 Quick Budget Framework:\n- 50% Needs (rent, food, utilities)\n- 30% Wants (entertainment, dining out)\n- 20% Savings & Debt\n\n💡 Saving Hacks:\n1. Automate savings on payday\n2. Wait 24 hours before non-essential purchases\n3. Use the "cost per use" mindset\n4. Cancel unused subscriptions\n5. Cook at home more often\n6. Use cashback apps and rewards\n\n🎯 Quick Wins:\n- Track every expense for 1 week\n- Find 3 subscriptions to cancel\n- Set up automatic savings transfer\n- Pack lunch twice this week\n- Have a no-spend day\n\n📈 Remember: Small changes add up to big results over time!`;
}

// Fallback: Productivity Boost
function getProductivityFallback() {
    const tasks = [
        `⚡ Your Productivity Boost:\n\n🎯 Right Now (5 min):\n- Clear your desk of distractions\n- Put phone on Do Not Disturb\n- Write down your #1 priority for today\n\n📋 Quick Wins to Build Momentum:\n1. Reply to that email you've been avoiding\n2. Complete one small task from your list\n3. Organize your workspace for 5 minutes\n4. Schedule your most important task\n5. Take a 2-minute stretch break\n\n💡 Focus Technique:\n- Work for 25 minutes\n- Break for 5 minutes\n- Repeat 4 times\n- Take a longer 15-30 min break\n\n✨ Remember: Done is better than perfect. Start small, build momentum!`,
        `🚀 Productivity Power-Up:\n\n⏰ The Next Hour:\n1. Identify your ONE most important task\n2. Break it into 3 smaller steps\n3. Start with the easiest step\n4. Set a 25-minute timer\n5. Focus only on that task\n\n🧠 Beat Procrastination:\n- "I'll just do 5 minutes" (you'll often continue)\n- Remove all distractions first\n- Reward yourself after completing tasks\n- Visualize how good you'll feel when done\n\n💪 You've got this! Start now, not later.`
    ];
    return tasks[Math.floor(Math.random() * tasks.length)];
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('📋 Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// Save to dashboard
function saveToHistory(toolName, input, output) {
    const history = JSON.parse(localStorage.getItem('toolHistory') || '[]');
    
    history.unshift({
        tool: toolName,
        input: input,
        output: output,
        timestamp: Date.now()
    });
    
    // Keep only last 50 entries
    const trimmed = history.slice(0, 50);
    localStorage.setItem('toolHistory', JSON.stringify(trimmed));
    
    // Also save to savedOutputs for dashboard
    const savedOutputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');
    savedOutputs.unshift({
        toolName: toolName,
        content: output,
        timestamp: Date.now()
    });
    localStorage.setItem('savedOutputs', JSON.stringify(savedOutputs.slice(0, 50)));
    
    showNotification('💾 Saved to dashboard!', 'success');
}

// Track tool usage
function trackToolUsage(toolName, toolUrl) {
    const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
    
    // Remove duplicate if exists
    const filtered = recentTools.filter(tool => tool.name !== toolName);
    
    // Add to beginning
    filtered.unshift({
        name: toolName,
        url: toolUrl,
        timestamp: Date.now()
    });
    
    // Keep only last 20
    localStorage.setItem('recentTools', JSON.stringify(filtered.slice(0, 20)));
}

// Show notification
function showNotification(message, type = 'info') {
    // Check if notification function exists from notifications.js
    if (typeof showInAppNotification === 'function') {
        showInAppNotification(message, type, 3000);
    } else {
        // Fallback alert
        alert(message);
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.ls-nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    }
}

// Export functions
window.callAI = callAI;
window.isAPIConfigured = isAPIConfigured;
window.showAPISetupPrompt = showAPISetupPrompt;
window.copyToClipboard = copyToClipboard;
window.saveToHistory = saveToHistory;
window.trackToolUsage = trackToolUsage;
window.showNotification = showNotification;
window.toggleMobileMenu = toggleMobileMenu;
