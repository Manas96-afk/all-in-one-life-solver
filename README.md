# 🌟 All-in-One Life Problem Solver

> A comprehensive web application featuring AI-powered tools, life hacks, and quick guides designed to solve common life problems in minutes. Whether you need career advice, relationship tips, fitness guidance, or study help — we provide immediate, actionable clarity.

---

## 🎯 Features

**🧠 AI-Powered Tools**  
Access specialized sub-tools (like a *Mini Career Coach*, *Mood Fixer*, and *Workout Suggestor*) that use AI to give you curated, personalized advice based on your input.

**📚 Actionable Guides & Life Hacks**  
Quick, practical, and step-by-step solutions to everyday problems. Need to know how to nail an interview or how to reduce stress naturally? Our guides have you covered.

**🔒 100% Private Dashboard**  
Your tool history, favorite outputs, and dashboard data are completely private. All activity is stored locally on your device in your browser, meaning no accounts, no centralized database, and absolute peace of mind.

**⚡ Bring Your Own Key (BYOK)**   
You are in complete control of the AI engine. Easily plug in your OpenAI, Google Gemini, or Groq API keys directly into the app settings to turbo-charge responses, or simply use our built-in curated demo mode.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher) installed on your machine.
- Your favorite Web Browser (Chrome, Firefox, Safari).

### 2. Setup the Backend 
The backend is a lightweight Express Node.js server that helps mock database connections and acts as a foundation if you ever want to centralize the app.

```bash
# Clone the repository
git clone https://github.com/Manas96-afk/all-in-one-life-solver.git

# Navigate to the backend directory
cd all-in-one-life-solver/backend

# Install the server dependencies 
npm install

# Start the Node.js server
npm run start 
```

### 3. Setup the Frontend
The frontend consists of vanilla HTML, CSS, and JS. You simply need to serve it using a local static file server.

If you use **VS Code**, you can use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) Extension to serve the root directory.

Alternatively, you can start a simple static server using Python:
```bash
# In the root 'all-in-one-life-solver' directory, run:
python -m http.server 5500
```

### 4. Open the App
Visit `http://localhost:5500` in your browser. Start exploring!

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Font Awesome
- **Storage**: Browser Local Storage (Zero-database setup for maximum privacy)
- **Backend**: Node.js, Express.js (Foundation setup for future integration)
- **AI Integrations**: Ready for OpenAI, Google Gemini, and Groq via user-provided API keys.

---

## 📁 Project Structure

```
all_in_one_life_solver/
├── backend/                  # Node.js + Express backend (foundation)
├── components/               # Reusable HTML snippets
├── css/                      # Responsive cascading stylesheets
│   └── homepage.css
├── data/                     # JSON datasets for categories/tools
├── js/                       # Core Vanilla JS Logic
│   ├── api-config.js         # AI Key Configuration & Prompts
│   ├── dashboard.js          # LocalStorage Dashboard Logic
│   ├── homepage.js           # UI & Animations
│   ├── notifications.js      # Custom in-app alert UI
│   └── tool-template.js      # Dynamic tool rendering
├── pages/                    # Individual feature pages (Terms, FAQ, Dashboard)
├── .gitignore                # Excludes node_modules 
├── index.html                # Main entry point website
└── README.md                 # Project Documentation
```

---

## 🤝 Contributing

We welcome contributions to expand the library of tools, improve the AI system prompts, and squash bugs!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

*Empowering people to solve life's problems, one tool at a time.*