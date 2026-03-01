// Category Template - Dynamic Content Loader

// Category Data Configuration
const categoryData = {
    career: {
        title: "Career Solutions",
        subtitle: "Tools and guides to help you grow professionally.",
        icon: "💼",
        subcategories: ["Job Search", "Interview", "Resume", "Skill Development"],
        tools: [
            { icon: "📝", name: "Resume Analyzer", description: "Get instant feedback on your resume" },
            { icon: "💼", name: "Interview Answer Generator", description: "Prepare perfect interview responses" },
            { icon: "🎯", name: "Career Path Selector", description: "Find the right career direction" },
            { icon: "✉️", name: "Professional Email Helper", description: "Write clear professional emails" }
        ],
        guides: [
            { icon: "💼", title: "How to Impress in Interviews", summary: "Master the art of making a great first impression and answering tough questions confidently." },
            { icon: "🎯", title: "How to Choose the Right Career Path", summary: "Discover your strengths and find a career that matches your passion and skills." },
            { icon: "📝", title: "How to Write a Perfect Resume", summary: "Create a resume that stands out and gets you noticed by recruiters." }
        ]
    },
    study: {
        title: "Study Solutions",
        subtitle: "Study smarter, plan better, score higher.",
        icon: "📚",
        subcategories: ["Notes", "Exams", "Planning", "Focus"],
        tools: [
            { icon: "📅", name: "Study Planner", description: "Create perfect study schedules" },
            { icon: "📋", name: "Notes Summarizer", description: "Condense notes into key points" },
            { icon: "📚", name: "Exam Preparation Guide", description: "Get personalized exam strategies" },
            { icon: "🎯", name: "Focus Booster", description: "Improve concentration and focus" }
        ],
        guides: [
            { icon: "📚", title: "How to Study Smarter in 20 Minutes", summary: "Learn proven techniques to maximize your study efficiency and retain more information." },
            { icon: "📖", title: "How to Take Notes Like a Top Student", summary: "Master note-taking methods that help you understand and remember better." },
            { icon: "🎯", title: "How to Boost Focus Without Motivation", summary: "Simple tricks to concentrate even when you don't feel like studying." }
        ]
    },
    relationship: {
        title: "Relationship Solutions",
        subtitle: "Communicate better, understand deeper, love smarter.",
        icon: "❤️",
        subcategories: ["Communication", "Dating", "Conflict", "Understanding"],
        tools: [
            { icon: "💑", name: "Relationship Analyzer", description: "Understand your relationship better" },
            { icon: "💬", name: "Message Tone Checker", description: "Ensure your messages sound right" },
            { icon: "🤝", name: "Conflict Resolution Advice", description: "Handle disagreements peacefully" },
            { icon: "📱", name: "First Text Generator", description: "Start conversations confidently" }
        ],
        guides: [
            { icon: "💬", title: "How to Text Someone You Like", summary: "Start conversations naturally and keep them interesting without overthinking." },
            { icon: "🤝", title: "How to Solve Misunderstandings Calmly", summary: "Handle conflicts peacefully and strengthen your relationships." },
            { icon: "❤️", title: "How to Build Healthy Communication", summary: "Express yourself clearly and listen actively to create deeper connections." }
        ]
    },
    fitness: {
        title: "Fitness Solutions",
        subtitle: "Build habits, improve your body, stay healthy.",
        icon: "💪",
        subcategories: ["Diet", "Workout", "Sleep", "Habits"],
        tools: [
            { icon: "🥗", name: "Diet Generator", description: "Get personalized meal plans" },
            { icon: "💪", name: "Workout Planner", description: "Create custom workout routines" },
            { icon: "✅", name: "Daily Habit Maker", description: "Build lasting healthy habits" },
            { icon: "😴", name: "Sleep Routine Fixer", description: "Improve your sleep quality" }
        ],
        guides: [
            { icon: "💪", title: "How to Start Working Out as a Beginner", summary: "Simple steps to begin your fitness journey without feeling overwhelmed." },
            { icon: "🥗", title: "How to Make a Diet You Can Actually Follow", summary: "Create sustainable eating habits that fit your lifestyle and goals." },
            { icon: "😴", title: "How to Fix Your Sleep Cycle Naturally", summary: "Reset your sleep schedule and wake up feeling refreshed every day." }
        ]
    },
    productivity: {
        title: "Productivity Solutions",
        subtitle: "Manage time, plan tasks, simplify your routine.",
        icon: "⚡",
        subcategories: ["Time Management", "Task Planning", "Motivation", "Routine"],
        tools: [
            { icon: "⏰", name: "Time Management Planner", description: "Organize your day effectively" },
            { icon: "📊", name: "Task Breakdown Tool", description: "Split big tasks into small steps" },
            { icon: "🚀", name: "Motivation Booster", description: "Get inspired to take action" },
            { icon: "🌅", name: "Morning Routine Builder", description: "Start your day with energy" }
        ],
        guides: [
            { icon: "⚡", title: "How to Stop Procrastination in 2 Minutes", summary: "Quick mental tricks to overcome procrastination and start taking action." },
            { icon: "📅", title: "How to Plan Your Day Efficiently", summary: "Organize your tasks and time to get more done with less stress." },
            { icon: "🌅", title: "How to Build a Morning Routine That Works", summary: "Start your day with energy, focus, and a positive mindset." }
        ]
    },
    "mental-wellness": {
        title: "Mental Wellness Solutions",
        subtitle: "Reduce stress, control overthinking, feel better.",
        icon: "🧘",
        subcategories: ["Stress Relief", "Confidence", "Mindfulness", "Emotions"],
        tools: [
            { icon: "😊", name: "Mood Helper", description: "Track and improve your mood" },
            { icon: "💎", name: "Confidence Builder", description: "Boost your self-confidence" },
            { icon: "🧘", name: "Stress Relief Tips", description: "Calm your mind instantly" },
            { icon: "🧠", name: "Overthinking Fixer", description: "Stop overthinking and act" }
        ],
        guides: [
            { icon: "🧠", title: "How to Reduce Overthinking Daily", summary: "Calm your mind and stop worrying about things you can't control." },
            { icon: "💎", title: "How to Build Confidence Slowly", summary: "Small daily actions that gradually boost your self-confidence." },
            { icon: "🧘", title: "How to Manage Stress Without Running Away", summary: "Face challenges calmly and develop healthy coping mechanisms." }
        ]
    }
};

// Get category from URL parameter
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('category') || 'career';
}

// Load category content
function loadCategoryContent() {
    const category = getCategoryFromURL();
    const data = categoryData[category] || categoryData.career;

    // Update page title and meta
    document.getElementById('page-title').textContent = `${data.title} | Life Solver`;
    document.getElementById('page-description').content = data.subtitle;

    // Update header
    document.getElementById('category-title').textContent = data.title;
    document.getElementById('category-subtitle').textContent = data.subtitle;
    document.getElementById('category-icon').textContent = data.icon;

    // Load subcategories
    loadSubcategories(data.subcategories);

    // Load tools
    loadTools(data.tools);

    // Load guides
    loadGuides(data.guides, category);

    // Load recommendations
    loadRecommendations(category);
}

// Load subcategories
function loadSubcategories(subcategories) {
    const container = document.getElementById('filter-chips');
    if (!subcategories || subcategories.length === 0) {
        document.getElementById('subcategory-section').style.display = 'none';
        return;
    }

    container.innerHTML = subcategories.map(sub =>
        `<button class="filter-chip">${sub}</button>`
    ).join('');

    // Add click handlers
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', function () {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Load tools
function loadTools(tools) {
    const container = document.getElementById('tools-grid');
    container.innerHTML = tools.map(tool => `
        <div class="tool-card">
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <button class="tool-btn">Open Tool</button>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const toolName = this.closest('.tool-card').querySelector('.tool-name').textContent;
            // Map common names to IDs. This could be more robust with real IDs in the data.
            const nameMap = {
                'Resume Analyzer': 'career-coach',
                'Mood Helper': 'mood-fixer',
                'Study Planner': 'study-planner',
                'Diet Generator': 'workout-suggestor',
                'Habit Maker': 'productivity-boost',
                'Relationship Analyzer': 'breakup-friend',
                'Interview Answer Generator': 'career-coach',
                'Career Path Selector': 'career-coach',
                'Professional Email Helper': 'career-coach',
                'Notes Summarizer': 'study-planner',
                'Exam Preparation Guide': 'study-planner',
                'Focus Booster': 'productivity-boost',
                'Message Tone Checker': 'breakup-friend',
                'Conflict Resolution Advice': 'breakup-friend',
                'First Text Generator': 'breakup-friend',
                'Workout Planner': 'workout-suggestor',
                'Daily Habit Maker': 'productivity-boost',
                'Sleep Routine Fixer': 'life-advisor',
                'Time Management Planner': 'productivity-boost',
                'Task Breakdown Tool': 'productivity-boost',
                'Motivation Booster': 'mood-fixer',
                'Morning Routine Builder': 'life-advisor',
                'Confidence Builder': 'mood-fixer',
                'Stress Relief Tips': 'life-advisor',
                'Overthinking Fixer': 'life-advisor'
            };
            const toolId = nameMap[toolName] || 'life-advisor';
            window.location.href = `tool-template.html?tool=${toolId}`;
        });
    });
}

// Load guides
function loadGuides(guides, category) {
    const container = document.getElementById('guides-grid');
    container.innerHTML = guides.map(guide => `
        <div class="guide-card">
            <div class="guide-thumbnail">
                <div class="guide-thumbnail-icon">${guide.icon}</div>
            </div>
            <div class="guide-content">
                <span class="category-tag">${category.replace('-', ' ')}</span>
                <h3 class="guide-title">${guide.title}</h3>
                <p class="guide-summary">${guide.summary}</p>
                <button class="guide-btn">Read Guide</button>
            </div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.guide-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const guideTitle = this.closest('.guide-card').querySelector('.guide-title').textContent;
            const encodedTitle = encodeURIComponent(guideTitle);
            window.location.href = `single-guide.html?guide=${encodedTitle}`;
        });
    });
}

// Load recommendations
function loadRecommendations(currentCategory) {
    const container = document.getElementById('carousel-track');
    const otherCategories = Object.keys(categoryData).filter(cat => cat !== currentCategory);

    const recommendations = otherCategories.slice(0, 4).map(cat => {
        const data = categoryData[cat];
        return `
            <div class="carousel-item">
                <div style="font-size: 3rem; text-align: center; margin-bottom: 1rem;">${data.icon}</div>
                <h4 style="font-weight: 600; margin-bottom: 0.5rem;">${data.title}</h4>
                <p style="font-size: 0.9rem; color: var(--text-secondary);">${data.subtitle}</p>
            </div>
        `;
    });

    container.innerHTML = recommendations.join('');
}

// Carousel controls
document.getElementById('prev-btn').addEventListener('click', function () {
    document.getElementById('carousel-track').scrollBy({ left: -320, behavior: 'smooth' });
});

document.getElementById('next-btn').addEventListener('click', function () {
    document.getElementById('carousel-track').scrollBy({ left: 320, behavior: 'smooth' });
});

// Navbar scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 8px rgba(135, 206, 235, 0.15)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        const icon = this.querySelector('i');
        if (icon) {
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', loadCategoryContent);

console.log('Category Template Loaded ✨');
