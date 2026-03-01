// Dashboard JavaScript

// Motivational Quotes
const quotes = [
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" }
];

// Daily Tips
const dailyTips = [
    "Save your outputs regularly to keep track of your best work!",
    "Try combining multiple AI tools for more powerful results.",
    "Bookmark your favorite tools for quick access.",
    "Clear your history periodically to keep your dashboard clean.",
    "Explore new tools weekly to discover hidden gems.",
    "Use specific prompts for better AI tool results.",
    "Share useful tools with your team to boost productivity.",
    "Check the guides section for tips on using tools effectively.",
    "Experiment with different tools for the same task to find your favorite.",
    "Keep your saved outputs organized with descriptive names."
];

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', function () {
    displayMotivationalQuote();
    displayDailyTip();
    loadRecentTools();
    loadSavedOutputs();
    loadTopTools();
    loadRecommendedTool();
    setupEventListeners();
});

// Display Random Motivational Quote
function displayMotivationalQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('motivationalQuote').textContent = `"${randomQuote.text}"`;
    document.getElementById('quoteAuthor').textContent = `— ${randomQuote.author}`;
}

// Display Daily Tip
function displayDailyTip() {
    const today = new Date().getDate();
    const tipIndex = today % dailyTips.length;
    document.getElementById('dailyTip').textContent = dailyTips[tipIndex];
}

// Load Recent Tools from Local Storage
function loadRecentTools() {
    const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');
    const container = document.getElementById('recentTools');

    if (recentTools.length === 0) {
        container.innerHTML = '<p class="empty-state">No tools used yet. Start exploring!</p>';
        return;
    }

    container.innerHTML = recentTools.slice(0, 5).map(tool => `
        <div class="tool-item" onclick="window.location.href='${tool.url}'">
            <h3>${tool.name}</h3>
            <p>${tool.category || 'AI Tool'}</p>
            <p class="timestamp">${formatTimestamp(tool.timestamp)}</p>
        </div>
    `).join('');
}

// Load Saved Outputs from Local Storage
function loadSavedOutputs() {
    const savedOutputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');
    const container = document.getElementById('savedOutputs');

    if (savedOutputs.length === 0) {
        container.innerHTML = '<p class="empty-state">No saved outputs yet.</p>';
        return;
    }

    container.innerHTML = savedOutputs.slice(0, 5).map((output, index) => `
        <div class="output-item">
            <h3>${output.toolName}</h3>
            <p class="timestamp">${formatTimestamp(output.timestamp)}</p>
            <div class="output-preview">${truncateText(output.content, 100)}</div>
            <div class="output-actions">
                <button class="btn-small btn-copy" onclick="copyOutput(${index})">📋 Copy</button>
                <button class="btn-small btn-delete" onclick="deleteOutput(${index})">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

// Load Top Tools
async function loadTopTools() {
    try {
        const response = await fetch('../data/tools.json');
        const data = await response.json();
        const tools = data.tools || [];

        // Get top 5 tools (you can customize this logic)
        const topTools = tools.slice(0, 5);

        const container = document.getElementById('topTools');
        container.innerHTML = topTools.map(tool => `
            <a href="../pages/tool.html?id=${tool.id}" class="quick-link-item">
                <span class="icon">${tool.icon || '🔧'}</span>
                <div class="link-text">
                    <h3>${tool.name}</h3>
                    <p>${tool.category}</p>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading top tools:', error);
        document.getElementById('topTools').innerHTML = '<p class="empty-state">Unable to load tools.</p>';
    }
}

// Load Recommended Tool of the Day
async function loadRecommendedTool() {
    try {
        const response = await fetch('../data/tools.json');
        const data = await response.json();
        const tools = data.tools || [];

        if (tools.length === 0) {
            document.getElementById('recommendedTool').innerHTML = '<p class="empty-state">No tools available.</p>';
            return;
        }

        // Get tool based on day of year for consistency
        const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const recommendedTool = tools[dayOfYear % tools.length];

        document.getElementById('recommendedTool').innerHTML = `
            <div class="recommended-tool-content">
                <h3>${recommendedTool.name}</h3>
                <p>${recommendedTool.description || 'Discover this amazing AI tool today!'}</p>
                <a href="../pages/tool.html?id=${recommendedTool.id}" class="tool-link">Try It Now →</a>
            </div>
        `;
    } catch (error) {
        console.error('Error loading recommended tool:', error);
        document.getElementById('recommendedTool').innerHTML = '<p class="empty-state">Unable to load recommendation.</p>';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Clear History Button
    document.getElementById('clearHistoryBtn').addEventListener('click', function () {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            localStorage.removeItem('recentTools');
            localStorage.removeItem('savedOutputs');
            loadRecentTools();
            loadSavedOutputs();
            if (typeof showInAppNotification === 'function') {
                showInAppNotification('History cleared successfully!', 'success');
            } else {
                alert('History cleared successfully!');
            }
        }
    });
}

// Copy Output to Clipboard
function copyOutput(index) {
    const savedOutputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');
    const output = savedOutputs[index];

    if (output) {
        navigator.clipboard.writeText(output.content).then(() => {
            if (typeof showInAppNotification === 'function') {
                showInAppNotification('Output copied to clipboard!', 'success');
            } else {
                alert('Output copied to clipboard!');
            }
        }).catch(err => {
            console.error('Failed to copy:', err);
            if (typeof showInAppNotification === 'function') {
                showInAppNotification('Failed to copy output.', 'error');
            } else {
                alert('Failed to copy output.');
            }
        });
    }
}

// Delete Output
function deleteOutput(index) {
    if (confirm('Delete this saved output?')) {
        const savedOutputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');
        savedOutputs.splice(index, 1);
        localStorage.setItem('savedOutputs', JSON.stringify(savedOutputs));
        loadSavedOutputs();
    }
}

// Helper: Format Timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

// Helper: Truncate Text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Track Tool Usage (call this from tool pages)
function trackToolUsage(toolName, toolUrl, category) {
    const recentTools = JSON.parse(localStorage.getItem('recentTools') || '[]');

    // Remove duplicate if exists
    const filtered = recentTools.filter(tool => tool.url !== toolUrl);

    // Add to beginning
    filtered.unshift({
        name: toolName,
        url: toolUrl,
        category: category,
        timestamp: Date.now()
    });

    // Keep only last 20
    const trimmed = filtered.slice(0, 20);

    localStorage.setItem('recentTools', JSON.stringify(trimmed));
}

// Save Output (call this from tool pages)
function saveOutput(toolName, content) {
    const savedOutputs = JSON.parse(localStorage.getItem('savedOutputs') || '[]');

    savedOutputs.unshift({
        toolName: toolName,
        content: content,
        timestamp: Date.now()
    });

    // Keep only last 50
    const trimmed = savedOutputs.slice(0, 50);

    localStorage.setItem('savedOutputs', JSON.stringify(trimmed));
    if (typeof showInAppNotification === 'function') {
        showInAppNotification('Output saved to dashboard!', 'success');
    } else {
        alert('Output saved to dashboard!');
    }
}

// Export functions for use in other pages
window.trackToolUsage = trackToolUsage;
window.saveOutput = saveOutput;
