// Tool Template JavaScript

// Tool Configuration - CUSTOMIZE THIS FOR EACH TOOL
const toolConfig = {
    'life-advisor': {
        icon: '🧭',
        name: 'Life Advisor',
        description: 'Ask anything about daily problems and get quick clarity.',
        prompts: [
            'I feel stuck in life',
            'How to stay motivated?',
            'How to fix my routine?',
            'How to deal with stress?',
            'I feel lonely',
            'I want to improve myself'
        ],
        placeholder: 'Ask anything about your daily problems...'
    },
    'mood-fixer': {
        icon: '😊',
        name: 'Mood Fixer',
        description: 'Get motivational quotes and mood boosters',
        prompts: [
            'I need motivation',
            'Feeling down today',
            'Boost my confidence',
            'Inspire me'
        ],
        placeholder: 'How are you feeling today?'
    },
    'career-coach': {
        icon: '💼',
        name: 'Mini Career Coach',
        description: 'Get guidance on your career path',
        prompts: [
            'Should I change careers?',
            'How to get promoted?',
            'Best career for me?',
            'Improve my skills'
        ],
        placeholder: 'Tell me about your career situation...'
    },
    'study-planner': {
        icon: '📚',
        name: 'Study Planner',
        description: 'Create effective study schedules',
        prompts: [
            'Plan my exam prep',
            'Study schedule for finals',
            'Learn faster tips',
            'Beat procrastination'
        ],
        placeholder: 'What do you need to study and when?'
    },
    'workout-suggestor': {
        icon: '💪',
        name: 'Workout Suggestor',
        description: 'Get personalized home workout plans',
        prompts: [
            '15-minute workout',
            'No equipment exercises',
            'Build muscle at home',
            'Beginner friendly'
        ],
        placeholder: 'What are your fitness goals?'
    },
    'breakup-friend': {
        icon: '💙',
        name: 'Breakup Friend',
        description: 'Get support and coping strategies',
        prompts: [
            'Just broke up',
            'How to move on?',
            'Dealing with heartbreak',
            'Self-care tips'
        ],
        placeholder: 'Share what you\'re going through...'
    },
    'money-mentor': {
        icon: '💰',
        name: 'Money Mentor',
        description: 'Get simple savings and budgeting tips',
        prompts: [
            'Save money fast',
            'Budget on low income',
            'Cut expenses',
            'Build emergency fund'
        ],
        placeholder: 'What\'s your financial situation?'
    },
    'productivity-boost': {
        icon: '⚡',
        name: 'Productivity Boost',
        description: 'Get tasks and tips to boost focus',
        prompts: [
            'Beat procrastination',
            'Focus better',
            'Time management',
            'Daily routine'
        ],
        placeholder: 'What\'s blocking your productivity?'
    }
};

// Get tool ID from URL
function getToolId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tool') || 'life-advisor';
}

// Initialize tool
function initTool() {
    const toolId = getToolId();
    const config = toolConfig[toolId] || toolConfig['life-advisor'];

    // Update page content
    document.getElementById('toolIcon').textContent = config.icon;
    document.getElementById('toolName').textContent = config.name;
    document.getElementById('toolDesc').textContent = config.description;
    document.getElementById('userInput').placeholder = config.placeholder;
    document.title = `${config.name} - Life Problem Solver`;

    // Load quick prompts
    loadQuickPrompts(config.prompts);

    // Load history
    loadHistory(toolId);
}

// Load quick prompts
function loadQuickPrompts(prompts) {
    const container = document.getElementById('quickPrompts');
    container.innerHTML = prompts.map(prompt =>
        `<div class="prompt-chip" onclick="usePrompt('${prompt}')">${prompt}</div>`
    ).join('');
}

// Use quick prompt
function usePrompt(prompt) {
    document.getElementById('userInput').value = prompt;
    document.getElementById('userInput').focus();
}

// Generate response
async function generateResponse() {
    const input = document.getElementById('userInput').value.trim();

    if (!input) {
        if (typeof showInAppNotification === 'function') {
            showInAppNotification('Please enter something first!', 'error');
        } else {
            alert('Please enter something first!');
        }
        return;
    }

    const generateBtn = document.getElementById('generateBtn');
    const outputSection = document.getElementById('outputSection');
    const outputBox = document.getElementById('outputBox');
    const toolId = getToolId();

    // Show loading state
    generateBtn.classList.add('loading');
    generateBtn.querySelector('.btn-text').textContent = 'Generating...';

    // Show output section
    outputSection.style.display = 'block';
    outputBox.innerHTML = '';

    let response;

    try {
        // Get history for context
        const historyKey = `history_${toolId}`;
        const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

        // Try to call real API first
        response = await callAI(input, toolId, history);

        // If API returns null (demo mode or no API key), use demo response
        if (!response) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            response = generateDemoResponse(input);
        }
    } catch (error) {
        console.error('API call failed:', error);

        // Show error message
        outputBox.innerHTML = `<div style="color: #f56565; padding: 20px; background: #fff5f5; border-radius: 10px;">
            <strong>⚠️ API Error:</strong><br>
            ${error.message}<br><br>
            <small>Falling back to demo response...</small>
        </div>`;

        // Wait a moment then show demo response
        await new Promise(resolve => setTimeout(resolve, 2000));
        outputBox.innerHTML = '';
        response = generateDemoResponse(input);
    }

    // Type out response with animation
    await typeResponse(response, outputBox);

    // Save to history
    saveToHistory(input, response);

    // Reset button
    generateBtn.classList.remove('loading');
    generateBtn.querySelector('.btn-text').textContent = 'Generate';
}

// Type response with animation
function typeResponse(text, element) {
    return new Promise(resolve => {
        let index = 0;
        element.innerHTML = '';

        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);

        const interval = setInterval(() => {
            if (index < text.length) {
                const char = text[index];
                const textNode = document.createTextNode(char);
                element.insertBefore(textNode, cursor);
                index++;

                // Auto-scroll
                element.scrollTop = element.scrollHeight;
            } else {
                cursor.remove();
                clearInterval(interval);
                resolve();
            }
        }, 20);
    });
}

// Generate Life Advisor specific responses
function generateLifeAdvisorResponse(input) {
    const inputLower = input.toLowerCase();

    // Check for specific keywords and provide tailored responses
    if (inputLower.includes('stuck') || inputLower.includes('lost')) {
        return `I understand feeling stuck can be overwhelming. Here's how to move forward:\n\n🌟 Steps to Get Unstuck:\n\n• Identify what's holding you back\n  Take time to reflect on the root cause of feeling stuck\n\n• Set one small goal for today\n  Progress starts with tiny steps, not giant leaps\n\n• Talk to someone you trust\n  Sometimes an outside perspective brings clarity\n\n• Try something new this week\n  New experiences can spark fresh motivation\n\n• Remember: Being stuck is temporary\n  You've overcome challenges before, and you will again\n\n💡 Action Step:\nWrite down 3 things you're grateful for right now. This shifts your mindset from stuck to possibility.\n\nYou're not alone in this. Every successful person has felt stuck at some point. The difference? They kept moving forward, even if just one small step at a time.`;
    }

    if (inputLower.includes('motivat')) {
        return `Let's reignite your motivation! Here's your personalized motivation plan:\n\n🔥 How to Stay Motivated:\n\n• Connect to your "why"\n  Remember the deeper reason behind your goals\n\n• Break goals into tiny wins\n  Small victories build momentum and confidence\n\n• Create a morning ritual\n  Start each day with intention (exercise, meditation, journaling)\n\n• Surround yourself with inspiration\n  Follow people who uplift you, read motivating content\n\n• Track your progress visually\n  Use a calendar, app, or journal to see how far you've come\n\n• Reward yourself for milestones\n  Celebrate progress, no matter how small\n\n💪 Remember:\n"Motivation gets you started. Habit keeps you going."\n\nOn days when motivation is low, rely on your routine. Show up anyway. That's where real growth happens.\n\n✨ Quick Boost: Do one thing right now that your future self will thank you for.`;
    }

    if (inputLower.includes('routine') || inputLower.includes('schedule')) {
        return `Let's build a routine that actually works for you:\n\n📅 Your Ideal Daily Routine:\n\n🌅 Morning (6:00 - 9:00 AM):\n• Wake up at the same time daily\n• Hydrate (drink water first thing)\n• Move your body (10-min stretch or walk)\n• Eat a healthy breakfast\n• Plan your top 3 priorities for the day\n\n☀️ Midday (9:00 AM - 5:00 PM):\n• Focus on your most important task first\n• Take breaks every 90 minutes\n• Eat lunch away from your desk\n• Stay hydrated throughout the day\n\n🌙 Evening (5:00 PM - 10:00 PM):\n• Wind down with a relaxing activity\n• Prepare for tomorrow (lay out clothes, pack bag)\n• No screens 1 hour before bed\n• Reflect on 3 wins from today\n• Sleep at the same time each night\n\n💡 Pro Tips:\n• Start with just ONE new habit at a time\n• Be flexible - life happens, adjust as needed\n• Track your routine for 21 days to build the habit\n\nA good routine isn't about perfection. It's about consistency and progress.`;
    }

    if (inputLower.includes('stress') || inputLower.includes('anxious') || inputLower.includes('overwhelm')) {
        return `I hear you. Stress is tough, but you can manage it. Here's how:\n\n🧘 Stress Management Toolkit:\n\n• Practice the 4-7-8 breathing technique\n  Breathe in for 4, hold for 7, exhale for 8\n  Do this 3 times when stress hits\n\n• Identify your stress triggers\n  Write them down, then plan how to handle each one\n\n• Move your body daily\n  Even 10 minutes of walking reduces stress hormones\n\n• Set boundaries\n  It's okay to say "no" to protect your peace\n\n• Create a worry time\n  Set aside 15 minutes daily to process worries, then let them go\n\n• Connect with others\n  Talk to a friend, family member, or therapist\n\n🌿 Quick Stress Relief:\n• 5-4-3-2-1 grounding technique\n  Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste\n\n• Progressive muscle relaxation\n  Tense and release each muscle group from toes to head\n\n💙 Remember:\nYou don't have to handle everything at once. Take it one moment, one breath, one step at a time.\n\nIf stress feels unmanageable, please reach out to a mental health professional. You deserve support.`;
    }

    if (inputLower.includes('lonely') || inputLower.includes('alone') || inputLower.includes('isolated')) {
        return `Feeling lonely is more common than you think. You're not alone in feeling alone. Here's how to connect:\n\n💙 Overcoming Loneliness:\n\n• Reach out to one person today\n  Text an old friend, call a family member, or message someone you admire\n\n• Join a community or group\n  Find people with shared interests (book club, sports team, hobby group)\n\n• Volunteer your time\n  Helping others creates meaningful connections\n\n• Try online communities\n  Join forums, Discord servers, or social media groups around your interests\n\n• Be present in public spaces\n  Work from a café, visit a library, attend local events\n\n• Practice self-compassion\n  Being alone doesn't mean you're unworthy of connection\n\n🌟 Quality Over Quantity:\nYou don't need 100 friends. You need a few genuine connections.\n\n💡 Action Steps:\n1. List 3 people you'd like to reconnect with\n2. Send them a simple "thinking of you" message\n3. Suggest a low-pressure meetup (coffee, walk, video call)\n\n🤝 Remember:\nBuilding connections takes time. Be patient with yourself. Every small interaction is a step toward feeling less lonely.\n\nYou are worthy of friendship and belonging. The right people are out there.`;
    }

    if (inputLower.includes('improve') || inputLower.includes('better') || inputLower.includes('grow')) {
        return `Amazing! Self-improvement is a journey, not a destination. Here's your growth roadmap:\n\n🚀 Personal Growth Plan:\n\n📚 Learn Something New:\n• Read 10 pages daily (books, articles, blogs)\n• Take an online course in something you're curious about\n• Listen to educational podcasts during commutes\n• Watch TED talks or documentaries\n\n💪 Build Better Habits:\n• Start with ONE keystone habit (exercise, meditation, journaling)\n• Use the 2-minute rule: Make it so easy you can't say no\n• Track your progress visually (calendar, app, journal)\n• Stack new habits onto existing ones\n\n🧠 Develop Your Mind:\n• Practice gratitude daily (write 3 things you're grateful for)\n• Meditate for 5-10 minutes each morning\n• Journal your thoughts and feelings\n• Challenge negative self-talk with evidence\n\n🤝 Improve Relationships:\n• Practice active listening\n• Express appreciation to people you care about\n• Set healthy boundaries\n• Forgive yourself and others\n\n💼 Advance Your Skills:\n• Identify your top 3 strengths and develop them further\n• Learn a skill that complements your career\n• Seek feedback from mentors or peers\n• Take on projects outside your comfort zone\n\n✨ The 1% Rule:\nImprove just 1% each day. In a year, you'll be 37 times better.\n\n🎯 This Week's Challenge:\nPick ONE area above and commit to ONE small action daily for 7 days.\n\nYou're already on the right path by wanting to improve. That awareness is the first step. Keep going!`;
    }

    // Default response for general queries
    return `Thank you for sharing. Here's some thoughtful guidance:\n\n🌟 Key Insights:\n\n• Take time to reflect on what truly matters to you\n  Clarity comes from quiet moments of self-reflection\n\n• Break down big challenges into smaller steps\n  Progress happens one step at a time\n\n• Seek advice from people you trust\n  Different perspectives can illuminate new paths\n\n• Trust your intuition\n  You know yourself better than anyone else\n\n• Remember that change takes time\n  Be patient and compassionate with yourself\n\n• It's okay to not have all the answers\n  Life is about learning and growing continuously\n\n💡 Action Steps:\n1. Write down your thoughts and feelings\n2. Identify one small thing you can do today\n3. Talk to someone who cares about you\n4. Give yourself permission to take it slow\n\n🌈 Remember:\nEvery challenge is an opportunity for growth. You're stronger than you think, and you have everything you need within you to navigate this.\n\nLife is a journey of continuous learning. Every decision, every experience shapes who you're becoming. Trust the process.`;
}

// Generate demo response
function generateDemoResponse(input) {
    const toolId = getToolId();
    const responses = {
        'life-advisor': generateLifeAdvisorResponse(input),

        'mood-fixer': `Here's something to lift your spirits:\n\n"The only way to do great work is to love what you do." - Steve Jobs\n\n✨ Remember:\n• You are stronger than you think\n• This feeling is temporary\n• You've overcome challenges before\n• Tomorrow is a new opportunity\n• You are worthy of happiness\n\nTake a deep breath. You've got this! 💪`,

        'career-coach': `Let's think about your career path:\n\n📊 Key Considerations:\n• What skills do you enjoy using?\n• What problems do you want to solve?\n• What work environment suits you?\n• What are your long-term goals?\n\n💡 Next Steps:\n1. Research roles that align with your interests\n2. Network with people in those fields\n3. Develop relevant skills through courses\n4. Start with small career experiments\n\nYour career is a marathon, not a sprint!`,

        'study-planner': `Here's your personalized study plan:\n\n📅 Study Schedule:\n\nWeek 1-2: Foundation Building\n• Review core concepts (2 hours/day)\n• Create summary notes\n• Practice basic problems\n\nWeek 3-4: Deep Practice\n• Solve advanced problems (3 hours/day)\n• Take practice tests\n• Review mistakes\n\nFinal Week: Revision\n• Quick reviews (1 hour/day)\n• Focus on weak areas\n• Stay calm and confident\n\n💡 Pro Tips: Take breaks, stay hydrated, sleep well!`,

        'workout-suggestor': `Here's your home workout plan:\n\n💪 15-Minute Full Body Workout:\n\nWarm-up (2 min):\n• Jumping jacks - 30 sec\n• Arm circles - 30 sec\n• High knees - 1 min\n\nMain Workout (10 min):\n• Push-ups - 3 sets of 10\n• Squats - 3 sets of 15\n• Plank - 3 sets of 30 sec\n• Lunges - 3 sets of 10 each leg\n\nCool-down (3 min):\n• Stretching\n\nDo this 3-4 times per week. Consistency is key!`,

        'breakup-friend': `I'm here for you. Breakups are tough, but you will get through this.\n\n💙 Healing Steps:\n\n1. Allow yourself to feel\n   It's okay to be sad, angry, or confused\n\n2. Lean on your support system\n   Talk to friends and family\n\n3. Focus on self-care\n   Exercise, eat well, sleep enough\n\n4. Rediscover yourself\n   Try new hobbies, reconnect with passions\n\n5. Give it time\n   Healing isn't linear, be patient\n\nRemember: This ending is also a new beginning. You deserve happiness.`,

        'money-mentor': `Let's improve your financial situation:\n\n💰 Smart Money Tips:\n\n1. Track Your Spending\n   • Use a budgeting app\n   • Review expenses weekly\n\n2. The 50/30/20 Rule\n   • 50% needs (rent, food)\n   • 30% wants (entertainment)\n   • 20% savings\n\n3. Cut Unnecessary Costs\n   • Cancel unused subscriptions\n   • Cook at home more\n   • Use public transport\n\n4. Build Emergency Fund\n   • Start with $500\n   • Gradually reach 3-6 months expenses\n\nSmall changes lead to big savings!`,

        'productivity-boost': `Let's boost your productivity:\n\n⚡ Focus Strategy:\n\n1. Use the Pomodoro Technique\n   • Work 25 minutes\n   • Break 5 minutes\n   • Repeat 4 times\n   • Long break 15-30 min\n\n2. Eliminate Distractions\n   • Turn off notifications\n   • Use website blockers\n   • Create a dedicated workspace\n\n3. Prioritize Tasks\n   • Use the Eisenhower Matrix\n   • Do important tasks first\n   • Delegate when possible\n\n4. Take Care of Yourself\n   • Sleep 7-8 hours\n   • Exercise regularly\n   • Stay hydrated\n\nProductivity = Focus + Energy + Time Management`
    };

    return responses[toolId] || `Thank you for your input: "${input}"\n\nThis is a demo response. In the full version, you'll receive personalized AI-powered advice based on your specific situation.\n\nThe tool will analyze your input and provide actionable suggestions, tips, and guidance to help you solve your problem.`;
}

// Save to history (localStorage)
function saveToHistory(query, response) {
    const toolId = getToolId();
    const historyKey = `history_${toolId}`;

    let history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    history.unshift({
        query: query,
        response: response,
        timestamp: new Date().toISOString()
    });

    // Keep only last 10 items
    history = history.slice(0, 10);

    localStorage.setItem(historyKey, JSON.stringify(history));

    // Reload history display
    loadHistory(toolId);
}

// Load history
function loadHistory(toolId) {
    const historyKey = `history_${toolId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');

    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');

    if (history.length === 0) {
        historySection.style.display = 'none';
        return;
    }

    historySection.style.display = 'block';

    historyList.innerHTML = history.map((item, index) => {
        const date = new Date(item.timestamp);
        const timeAgo = getTimeAgo(date);

        return `
            <div class="history-item" onclick="loadHistoryItem(${index})">
                <div class="history-query">${item.query}</div>
                <div class="history-time">${timeAgo}</div>
            </div>
        `;
    }).join('');
}

// Load history item
function loadHistoryItem(index) {
    const toolId = getToolId();
    const historyKey = `history_${toolId}`;
    const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const item = history[index];

    if (item) {
        document.getElementById('userInput').value = item.query;
        document.getElementById('outputBox').textContent = item.response;
        document.getElementById('outputSection').style.display = 'block';

        // Scroll to output
        document.getElementById('outputSection').scrollIntoView({ behavior: 'smooth' });
    }
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        const toolId = getToolId();
        const historyKey = `history_${toolId}`;
        localStorage.removeItem(historyKey);
        loadHistory(toolId);
        if (typeof showInAppNotification === 'function') {
            showInAppNotification('History cleared successfully!', 'success');
        }
    }
}

// Get time ago
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// Copy to clipboard
function copyToClipboard() {
    const outputBox = document.getElementById('outputBox');
    const text = outputBox.textContent;

    navigator.clipboard.writeText(text).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span>✅</span>';
        copyBtn.classList.add('copied');

        setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
            copyBtn.classList.remove('copied');
        }, 2000);
        if (typeof showInAppNotification === 'function') {
            showInAppNotification('Copied to clipboard!', 'success');
        }
    }).catch(err => {
        if (typeof showInAppNotification === 'function') {
            showInAppNotification('Failed to copy. Please select and copy manually.', 'error');
        } else {
            alert('Failed to copy. Please select and copy manually.');
        }
    });
}

// New query
function newQuery() {
    document.getElementById('userInput').value = '';
    document.getElementById('outputSection').style.display = 'none';
    document.getElementById('userInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Go back
function goBack() {
    window.history.back();
}

// Update provider status in header
function updateProviderStatus() {
    const statusEl = document.getElementById('providerStatus');
    if (statusEl && typeof getCurrentProviderName === 'function') {
        statusEl.textContent = getCurrentProviderName();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initTool();
    updateProviderStatus();

    document.getElementById('generateBtn').addEventListener('click', generateResponse);
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('newQueryBtn').addEventListener('click', newQuery);
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);

    // Enter key to generate
    document.getElementById('userInput').addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateResponse();
        }
    });
});
