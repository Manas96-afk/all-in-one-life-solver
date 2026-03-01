# Notification System Documentation

## Overview
A complete local notification system with browser notifications and reminder management. Everything is stored in local storage - no backend required.

## Features

### 1. Welcome Back Messages
- Shows personalized greeting when user returns
- Displays "Today's Tip" with helpful advice
- Shows "Recommended Tool" suggestion
- Tracks last visit time in local storage

### 2. Browser Notifications
- Daily Motivation reminders
- Study reminders
- Hydration reminders
- Workout reminders
- Requires user permission (requested automatically)

### 3. In-App Notifications
- Beautiful slide-in notifications
- Multiple types: info, success, welcome, reminder
- Auto-dismiss after set duration
- Manual close button

### 4. Reminder Management
- Set custom times for each reminder type
- Enable/disable individual reminders
- Toggle switches for easy control
- Remove reminders when not needed
- Prevents duplicate notifications on same day

## Files Created

1. **css/notifications.css** - All notification styles
2. **js/notifications.js** - Complete notification logic
3. **Updated pages** - Added notification bell icon and scripts

## How to Use

### For Users

1. **Enable Notifications**
   - Click the 🔔 bell icon in the navigation bar
   - Click "Enable Notifications" button
   - Allow browser notifications when prompted

2. **Set Reminders**
   - Click the bell icon to open settings
   - Toggle reminders on/off
   - Set custom times for each reminder
   - Save automatically

3. **Notification Types**
   - 💫 Daily Motivation - Inspirational messages
   - 📚 Study Reminder - Study session alerts
   - 💧 Hydration Reminder - Drink water alerts
   - 💪 Workout Reminder - Exercise time alerts

### For Developers

#### Initialize Notification System
```javascript
// Automatically initializes on page load
// Or manually call:
initNotificationSystem();
```

#### Show Custom In-App Notification
```javascript
showInAppNotification('Your message here', 'info', 5000);
// Types: 'info', 'success', 'welcome', 'reminder'
// Duration in milliseconds (0 = no auto-dismiss)
```

#### Set a Reminder Programmatically
```javascript
setReminder('motivation', '09:00', true);
// Types: 'motivation', 'study', 'hydration', 'workout'
```

#### Open Settings Modal
```javascript
openNotificationSettings();
```

#### Test a Notification
```javascript
testNotification('motivation');
```

## Local Storage Structure

### Last Visit
```javascript
localStorage.setItem('lastVisit', timestamp);
```

### Reminders
```javascript
{
  "motivation": {
    "time": "09:00",
    "enabled": true,
    "lastTriggered": "2024-11-22T09:00:00.000Z"
  },
  "study": {
    "time": "14:00",
    "enabled": true,
    "lastTriggered": null
  }
}
```

### User Name (Optional)
```javascript
localStorage.setItem('userName', 'John');
```

## Browser Notification API

The system uses the standard Notification API:
- Requests permission on first load
- Shows notifications with custom icon
- Auto-closes after 5 seconds
- Clicking notification focuses the window

## Notification Messages

### Daily Motivation (10 messages)
- "You're doing amazing! Keep going! 💪"
- "Believe in yourself and all that you are! ✨"
- And more...

### Study Reminders (5 messages)
- "Time to study! Your future self will thank you! 📚"
- "Study session time! Let's make it productive! 📖"
- And more...

### Hydration Reminders (5 messages)
- "Time to drink water! Stay hydrated! 💧"
- "Hydration check! Drink some water! 🥤"
- And more...

### Workout Reminders (5 messages)
- "Time to move! Let's get that workout in! 💪"
- "Workout time! Your body will thank you! 🏃"
- And more...

### Daily Tips (10 tips)
- "Save your outputs regularly to keep track of your best work!"
- "Try combining multiple AI tools for more powerful results."
- And more...

## Features in Detail

### Smart Notification Timing
- Checks every minute for due notifications
- Prevents duplicate notifications on same day
- Tracks last triggered time per reminder
- Resets daily automatically

### Permission Handling
- Shows status: Enabled, Blocked, or Not enabled
- Provides enable button if not granted
- Shows help text if blocked
- Gracefully handles denied permissions

### Responsive Design
- Mobile-friendly modal
- Touch-optimized controls
- Adaptive notification positioning
- Works on all screen sizes

## Customization

### Add New Reminder Types
Edit `js/notifications.js`:

```javascript
const reminderTypes = [
  { id: 'custom', name: 'Custom Reminder', icon: '⏰', defaultTime: '10:00' }
];
```

### Add New Messages
Edit the message arrays in `js/notifications.js`:

```javascript
const customMessages = [
  "Your custom message here!",
  "Another custom message!"
];
```

### Change Notification Duration
```javascript
showInAppNotification(message, type, 8000); // 8 seconds
```

### Customize Styles
Edit `css/notifications.css` to change:
- Colors and gradients
- Animation timing
- Modal size and position
- Button styles

## Browser Compatibility

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari (full support)
- ✅ Mobile browsers (with limitations)

**Note:** Some mobile browsers may restrict background notifications.

## Privacy & Security

- All data stored locally in browser
- No server communication
- No tracking or analytics
- User can clear data anytime
- Respects browser notification settings

## Troubleshooting

### Notifications Not Showing
1. Check browser notification permission
2. Ensure notifications are enabled in OS settings
3. Check if browser is in Do Not Disturb mode
4. Verify reminder is enabled and time is set

### Welcome Message Not Appearing
1. Clear local storage and refresh
2. Wait at least 1 hour between visits
3. Check browser console for errors

### Reminders Not Triggering
1. Keep browser tab open (background tabs may be throttled)
2. Check system time is correct
3. Verify reminder time matches current time
4. Check lastTriggered timestamp in local storage

## Future Enhancements

Potential features to add:
- Custom reminder messages
- Snooze functionality
- Notification history
- Sound alerts
- Recurring patterns (weekdays only, etc.)
- Integration with calendar
- Export/import settings
- Multiple reminders per type

## Integration with Other Pages

The notification system is integrated into:
- ✅ Homepage (index.html)
- ✅ Dashboard (pages/dashboard.html)
- ✅ Collections (pages/collections.html)

To add to other pages:
1. Include CSS: `<link rel="stylesheet" href="../css/notifications.css">`
2. Include JS: `<script src="../js/notifications.js"></script>`
3. Add bell icon: `<span class="notification-bell" onclick="openNotificationSettings()">🔔</span>`

## Support

For issues or questions:
- Check browser console for errors
- Verify local storage is enabled
- Test in incognito mode to rule out extensions
- Clear cache and local storage if needed

---

**Made with ❤️ for Quick AI Tools**
