// AI Tools Page JavaScript

// Category filtering functionality
const tabButtons = document.querySelectorAll('.tab-btn');
const toolCards = document.querySelectorAll('.tool-card');

tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Get selected category
        const category = this.dataset.category;
        
        // Filter tools
        filterTools(category);
    });
});

function filterTools(category) {
    toolCards.forEach(card => {
        if (category === 'all') {
            // Show all cards
            card.classList.remove('hidden');
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
        } else {
            // Show only matching category
            if (card.dataset.category === category) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        }
    });
}

// Tool button click handlers
const toolButtons = document.querySelectorAll('.tool-btn');
toolButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const toolCard = this.closest('.tool-card');
        const toolName = toolCard.querySelector('.tool-name').textContent;
        alert(`Opening ${toolName}...\n\nThis would navigate to the tool interface.`);
    });
});

// Modal functionality
const recommendBtn = document.getElementById('recommend-btn');
const modal = document.getElementById('recommend-modal');
const modalClose = document.getElementById('modal-close');
const recommendForm = document.getElementById('recommend-form');

if (recommendBtn) {
    recommendBtn.addEventListener('click', function() {
        modal.classList.add('active');
    });
}

if (modalClose) {
    modalClose.addEventListener('click', function() {
        modal.classList.remove('active');
    });
}

// Close modal when clicking outside
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('active');
    }
});

// Form submission
if (recommendForm) {
    recommendForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your suggestion! We\'ll review it and consider building this tool.');
        modal.classList.remove('active');
        this.reset();
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

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        alert('Mobile menu - Add mobile navigation here');
    });
}

// Animate cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 50);
        }
    });
}, observerOptions);

// Observe tool cards for animation
toolCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Add hover effect enhancement
toolCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Count tools by category
function countToolsByCategory() {
    const counts = {
        all: toolCards.length,
        career: 0,
        study: 0,
        relationship: 0,
        fitness: 0,
        productivity: 0,
        'mental-wellness': 0
    };
    
    toolCards.forEach(card => {
        const category = card.dataset.category;
        if (counts.hasOwnProperty(category)) {
            counts[category]++;
        }
    });
    
    console.log('Tools by category:', counts);
}

// Initialize
countToolsByCategory();

console.log('AI Tools Page Loaded ✨');
console.log(`Total tools: ${toolCards.length}`);
