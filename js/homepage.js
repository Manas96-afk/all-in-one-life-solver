// Homepage JavaScript

// Smooth scroll function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
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

// Category cards click handler
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', function() {
        const category = this.dataset.category;
        window.location.href = `pages/category.html?category=${category}`;
    });
});

// Quick AI Tools widget click handler
document.querySelectorAll('.quick-tool-widget').forEach(widget => {
    widget.addEventListener('click', function() {
        const toolId = this.dataset.tool;
        const toolName = this.querySelector('.widget-name').textContent;
        // Navigate to the universal tool template with tool ID
        window.location.href = `pages/tool-template.html?tool=${toolId}`;
    });
});

// Widget button click handler (prevent double navigation)
document.querySelectorAll('.widget-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const widget = this.closest('.quick-tool-widget');
        const toolId = widget.dataset.tool;
        window.location.href = `pages/tool-template.html?tool=${toolId}`;
    });
});

// Tool cards click handler
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const toolName = this.closest('.tool-card').querySelector('h3').textContent;
        // Map common names to IDs
        const nameMap = {
            'Resume Analyzer': 'career-coach',
            'Mood Helper': 'mood-fixer',
            'Study Planner': 'study-planner',
            'Diet Generator': 'workout-suggestor',
            'Habit Maker': 'productivity-boost',
            'Relationship Analyzer': 'breakup-friend'
        };
        const toolId = nameMap[toolName] || 'life-advisor';
        window.location.href = `pages/tool-template.html?tool=${toolId}`;
    });
});

// Guide cards click handler
document.querySelectorAll('.guide-card').forEach(card => {
    card.addEventListener('click', function() {
        // Map guide names to a single guide template structure
        // In a real database this would map by ID
        const guideName = this.querySelector('h3').textContent;
        const encodedName = encodeURIComponent(guideName);
        window.location.href = `pages/single-guide.html?guide=${encodedName}`;
    });
});

// Hero search functionality
const heroSearchInput = document.getElementById('hero-search-input');
if (heroSearchInput) {
    heroSearchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.trim();
            if (query) {
                window.location.href = `pages/category.html?search=${encodeURIComponent(query)}`;
            }
        }
    });
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 8px rgba(135, 206, 235, 0.15)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('.categories, .quick-tools, .tools, .guides, .testimonials').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Intersection Observer for Quick AI Tools widgets
const widgetObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe each widget
document.querySelectorAll('.quick-tool-widget').forEach(widget => {
    widget.style.animationPlayState = 'paused';
    widgetObserver.observe(widget);
});

// Add hover effect to cards
document.querySelectorAll('.category-card, .tool-card, .guide-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

console.log('Life Solver Homepage Loaded ✨');
