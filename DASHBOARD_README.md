# Admin Dashboard - Life Solver

## 🎯 Overview
The Admin Dashboard provides a comprehensive interface to review and manage user requests submitted through the "Request a Tool or Guide" form.

## 🔐 Access
- **URL**: `/pages/dashboard.html`
- **Passcode**: `solvee2025`
- **Session Duration**: 1 hour (auto-logout)

## ✨ Features

### 📊 **Statistics Dashboard**
- **Total Requests**: All submitted requests
- **Urgent Requests**: High-priority items
- **AI Tool Requests**: Requests for AI-powered tools
- **This Week**: Recent submissions (last 7 days)

### 🔍 **Filtering & Sorting**
- **Category Filter**: AI Tool, Life Hack, Short Guide
- **Priority Filter**: Urgent, Normal, Future Idea
- **Date Sorting**: Toggle between Newest/Oldest first
- **Real-time Updates**: Smooth animations when filters change

### 📱 **Responsive Design**
- **Desktop**: Clean table view with all columns
- **Mobile**: Card-based layout for better readability
- **Adaptive**: Automatically switches based on screen size

### ⚙️ **Actions**
- **Download CSV**: Export filtered data with proper formatting
- **Clear All Requests**: Delete all requests (with confirmation)
- **Add Sample Data**: Add test data for demonstration

## 🎨 **Visual Features**
- **Category Icons**: 🤖 AI Tool, 💡 Life Hack, 📘 Short Guide
- **Priority Badges**: 🚨 Urgent, 📅 Normal, 💭 Future Idea
- **Hover Effects**: Subtle animations and highlights
- **Loading States**: Smooth transitions and feedback

## 🔧 **Technical Details**

### **Data Storage**
- **localStorage Key**: `life_solver_requests`
- **Format**: JSON array of request objects
- **Fields**: name, email, category, topic, description, priority, date

### **Security**
- **Front-end Protection**: Simple passcode authentication
- **Session Management**: Automatic timeout after 1 hour
- **Input Validation**: HTML escaping to prevent XSS

### **Browser Compatibility**
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Features Used**: localStorage, CSS Grid, Flexbox, ES6+

## 📝 **Usage Instructions**

### **First Time Setup**
1. Navigate to `/pages/dashboard.html`
2. Enter passcode: `solvee2025`
3. Click "Add Sample Data" to see demo requests

### **Daily Operations**
1. **Review Requests**: Check new submissions in the table
2. **Filter by Priority**: Focus on urgent items first
3. **Export Data**: Download CSV for offline analysis
4. **Manage Storage**: Clear old requests when needed

### **Filtering Examples**
- **Urgent AI Tools**: Set Category="AI Tool" + Priority="Urgent"
- **Recent Guides**: Set Category="Short Guide" + Sort="Newest First"
- **All Future Ideas**: Set Priority="Future Idea"

## 🚀 **Integration**

### **Request Form Integration**
- Requests from `/pages/request.html` automatically appear
- Real-time data synchronization via localStorage
- No server setup required

### **Navigation Links**
- **From Request Page**: "Admin Dashboard" link in footer
- **To Request Page**: "Request Tool" link in navbar
- **Home Navigation**: Available in all pages

## 🛠️ **Customization**

### **Adding New Categories**
Update the category options in both:
- `pages/request.html` (form dropdown)
- `pages/dashboard.html` (filter dropdown)

### **Changing Passcode**
Modify `this.correctPasscode` in the AdminAuth class

### **Styling Adjustments**
All dashboard styles are contained in the `<style>` section of `dashboard.html`

## 📊 **Sample Data Structure**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "category": "AI Tool",
  "topic": "Study Planner",
  "description": "AI-powered study schedule optimizer",
  "priority": "Normal",
  "date": "2025-11-03",
  "timestamp": 1699027200000
}
```

## 🔄 **Workflow**
1. **User submits request** → `request.html`
2. **Data saved to localStorage** → `life_solver_requests`
3. **Admin reviews in dashboard** → `dashboard.html`
4. **Admin exports/manages data** → CSV download/clear functions

## 💡 **Tips**
- Use "Add Sample Data" to test filtering and export features
- CSV exports include all filtered data (respects current filters)
- Mobile view automatically activates on screens < 768px
- Session expires after 1 hour for security

## 🐛 **Troubleshooting**
- **No data showing**: Try "Add Sample Data" button
- **Passcode not working**: Check for typos (`solvee2025`)
- **Export not working**: Ensure browser supports file downloads
- **Mobile layout issues**: Check screen width and CSS media queries