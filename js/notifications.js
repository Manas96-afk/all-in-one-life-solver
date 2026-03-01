// Notification System - Local Storage Based

// Notification Data
const motivationalMessages = [
    "You're doing amazing! Keep going! 💪",
    "Believe in yourself and all that you are! ✨",
    "Today is a great day to achieve your goals! 🎯",
    "Small progress is still progress! 🌟",
    "You've got this! Stay focused! 🔥",
    "Every step forward is a step toward success! 🚀",
    "Your potential is endless! 🌈",
    "Make today count! 💫",
    "You're stronger than you think! 💪",
    "Keep pushing forward! Success is near! 🏆"
];

const studyReminders = [
    "Time to study! Your future self will thank you! 📚",
    "Study session time! Let's make it productive! 📖",
    "Knowledge is power! Time to hit the books! 🎓",
    "Your study time is now! Stay focused! 💡",
    "Learning time! Make every minute count! 📝"
];

const hydrationReminders = [
    "Time to drink water! Stay hydrated! 💧",
    "Hydration check! Drink some water! 🥤",
    "Your body needs water! Take a sip! 💦",
    "Stay healthy! Drink water now! 💧",
    "Hydrate yourself! Water break time! 🌊"
];

const workoutReminders = [
    "Time to move! Let's get that workout in! 💪",
    "Workout time! Your body will thank you! 🏃",
    "Exercise time! Let's get active! 🤸",
    "Time to sweat! Workout session now! 🏋️",
    "Move your body! Workout reminder! 🚴"
];

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

// Initialize Notification System
function initNotificationSystem() {
    // Request notification permission on first load
    requestNotificationPermission();
    
    // Show welcome back message
    showWelcomeBackMessage();
    
    // Load and display reminders
    loadReminders();
    
    // Check for due notifications
    checkDueNotifications();
    
    // Set up periodic checks (every minute)
    setInterval(checkDueNotifications, 60000);
}

// Request Notification Permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showInAppNotification('🔔 Notifications enabled! You\'ll receive helpful reminders.', 'success');
            }
        });
    }
}

// Show Welcome Back Message
function showWelcomeBackMessage() {
    const lastVisit = localStorage.getItem('lastVisit');
    const now = Date.now();
    
    if (lastVisit) {
        const hoursSinceLastVisit = (now - parseInt(lastVisit)) / (1000 * 60 * 60);
        
        if (hoursSinceLastVisit >= 1) {
            // Show welcome back notification
            setTimeout(() => {
                showWelcomeNotification();
            }, 1000);
        }
    } else {
        // First time visitor
        setTimeout(() => {
            showFirstTimeNotification();
        }, 1000);
    }
    
    // Update last visit
    localStorage.setItem('lastVisit', now.toString());
}

// Show Welcome Notification
function showWelcomeNotification() {
    const userName = localStorage.getItem('userName') || 'there';
    const tip = getRandomTip();
    const recommendedTool = getRecommendedTool();
    
    const message = `
        <div class="welcome-notification">
            <h3>👋 Welcome back, ${userName}!</h3>
            <div class="notification-section">
                <strong>💡 Today's Tip:</strong>
                <p>${tip}</p>
            </div>
            <div class="notification-section">
                <strong>⭐ Recommended Tool:</strong>
                <p>${recommendedTool}</p>
            </div>
        </div>
    `;
    
    showInAppNotification(message, 'welcome', 8000);
}

// Show First Time Notification
function showFirstTimeNotification() {
    const message = `
        <div class="welcome-notification">
            <h3>👋 Welcome to Quick AI Tools!</h3>
            <div class="notification-section">
                <p>Explore our curated AI tools and set up reminders to stay productive!</p>
            </div>
            <button onclick="openNotificationSettings()" class="btn-notification-settings">
                ⚙️ Set Up Reminders
            </button>
        </div>
    `;
    
    showInAppNotification(message, 'welcome', 10000);
}

// Get Random Tip
function getRandomTip() {
    return dailyTips[Math.floor(Math.random() * dailyTips.length)];
}

// Get Recommended Tool
function getRecommendedTool() {
    const tools = [
        "Try the Study Planner to organize your day!",
        "Check out the Mood Fixer for instant positivity!",
        "Use the Workout Suggestor for fitness ideas!",
        "Explore the Career Coach for professional growth!",
        "Visit the Collections page for curated bundles!"
    ];
    return tools[Math.floor(Math.random() * tools.length)];
}

// Show In-App Notification
function showInAppNotification(message, type = 'info', duration = 5000) {
    // Remove existing notifications
    const existing = document.querySelector('.in-app-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `in-app-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto remove
    if (duration > 0) {
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }
}

// Load Reminders
function loadReminders() {
    const reminders = JSON.parse(localStorage.getItem('reminders') || '{}');
    return reminders;
}

// Save Reminders
function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Set Reminder
function setReminder(type, time, enabled = true) {
    const reminders = loadReminders();
    reminders[type] = {
        time: time,
        enabled: enabled,
        lastTriggered: null
    };
    saveReminders(reminders);
    
    showInAppNotification(`✅ ${formatReminderType(type)} reminder set for ${time}!`, 'success');
}

// Remove Reminder
function removeReminder(type) {
    const reminders = loadReminders();
    delete reminders[type];
    saveReminders(reminders);
    
    showInAppNotification(`🗑️ ${formatReminderType(type)} reminder removed!`, 'info');
}

// Toggle Reminder
function toggleReminder(type, enabled) {
    const reminders = loadReminders();
    if (reminders[type]) {
        reminders[type].enabled = enabled;
        saveReminders(reminders);
        
        const status = enabled ? 'enabled' : 'disabled';
        showInAppNotification(`${formatReminderType(type)} reminder ${status}!`, 'info');
    }
}

// Check Due Notifications
function checkDueNotifications() {
    const reminders = loadReminders();
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    Object.keys(reminders).forEach(type => {
        const reminder = reminders[type];
        
        if (reminder.enabled && reminder.time === currentTime) {
            // Check if already triggered today
            const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : null;
            const isToday = lastTriggered && 
                lastTriggered.getDate() === now.getDate() &&
                lastTriggered.getMonth() === now.getMonth() &&
                lastTriggered.getFullYear() === now.getFullYear();
            
            if (!isToday) {
                triggerNotification(type);
                
                // Update last triggered
                reminder.lastTriggered = now.toISOString();
                saveReminders(reminders);
            }
        }
    });
}

// Trigger Notification
function triggerNotification(type) {
    let message = '';
    
    switch(type) {
        case 'motivation':
            message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
            break;
        case 'study':
            message = studyReminders[Math.floor(Math.random() * studyReminders.length)];
            break;
        case 'hydration':
            message = hydrationReminders[Math.floor(Math.random() * hydrationReminders.length)];
            break;
        case 'workout':
            message = workoutReminders[Math.floor(Math.random() * workoutReminders.length)];
            break;
        default:
            message = 'Reminder notification!';
    }
    
    // Show browser notification
    showBrowserNotification(formatReminderType(type), message);
    
    // Show in-app notification
    showInAppNotification(`<strong>${formatReminderType(type)}:</strong><br>${message}`, 'reminder', 6000);
}

// Show Browser Notification
function showBrowserNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: message,
            icon: '../favicon.svg',
            badge: '../favicon.svg',
            tag: 'quick-ai-tools-reminder',
            requireInteraction: false
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000);
    }
}

// Format Reminder Type
function formatReminderType(type) {
    const types = {
        'motivation': '💫 Daily Motivation',
        'study': '📚 Study Reminder',
        'hydration': '💧 Hydration Reminder',
        'workout': '💪 Workout Reminder'
    };
    return types[type] || type;
}

// Open Notification Settings
function openNotificationSettings() {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'notification-modal';
    modal.innerHTML = `
        <div class="notification-modal-content">
            <div class="modal-header">
                <h2>⚙️ Notification Settings</h2>
                <button class="modal-close" onclick="this.closest('.notification-modal').remove()">✕</button>
            </div>
            <div class="modal-body">
                ${renderReminderSettings()}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// Render Reminder Settings
function renderReminderSettings() {
    const reminders = loadReminders();
    const reminderTypes = [
        { id: 'motivation', name: 'Daily Motivation', icon: '💫', defaultTime: '09:00' },
        { id: 'study', name: 'Study Reminder', icon: '📚', defaultTime: '14:00' },
        { id: 'hydration', name: 'Hydration Reminder', icon: '💧', defaultTime: '12:00' },
        { id: 'workout', name: 'Workout Reminder', icon: '💪', defaultTime: '18:00' }
    ];
    
    let html = '<div class="reminder-settings">';
    
    // Notification permission status
    if ('Notification' in window) {
        const permission = Notification.permission;
        html += `
            <div class="permission-status ${permission}">
                <p><strong>Browser Notifications:</strong> ${permission === 'granted' ? '✅ Enabled' : permission === 'denied' ? '❌ Blocked' : '⚠️ Not enabled'}</p>
                ${permission === 'default' ? '<button onclick="requestNotificationPermission()" class="btn-enable-notifications">Enable Notifications</button>' : ''}
                ${permission === 'denied' ? '<p class="help-text">Please enable notifications in your browser settings.</p>' : ''}
            </div>
        `;
    }
    
    // Reminder settings
    reminderTypes.forEach(type => {
        const reminder = reminders[type.id];
        const isEnabled = reminder ? reminder.enabled : false;
        const time = reminder ? reminder.time : type.defaultTime;
        
        html += `
            <div class="reminder-item">
                <div class="reminder-header">
                    <span class="reminder-icon">${type.icon}</span>
                    <span class="reminder-name">${type.name}</span>
                    <label class="toggle-switch">
                        <input type="checkbox" ${isEnabled ? 'checked' : ''} 
                               onchange="toggleReminder('${type.id}', this.checked)">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="reminder-time">
                    <input type="time" value="${time}" 
                           onchange="setReminder('${type.id}', this.value, ${isEnabled})"
                           class="time-input">
                    ${reminder ? `<button onclick="removeReminder('${type.id}')" class="btn-remove">🗑️</button>` : ''}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Test Notification
function testNotification(type) {
    triggerNotification(type);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNotificationSystem);
} else {
    initNotificationSystem();
}

// Export functions
window.initNotificationSystem = initNotificationSystem;
window.openNotificationSettings = openNotificationSettings;
window.setReminder = setReminder;
window.removeReminder = removeReminder;
window.toggleReminder = toggleReminder;
window.requestNotificationPermission = requestNotificationPermission;
window.testNotification = testNotification;
