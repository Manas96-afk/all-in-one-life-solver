// Guides Page JavaScript

// Category filtering functionality
const chips = document.querySelectorAll('.chip');
const guideCards = document.querySelectorAll('.guide-card');

chips.forEach(chip => {
    chip.addEventListener('click', function() {
        // Remove active class from all chips
        chips.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked chip
        this.classList.add('active');
        
        // Get selected category
        const category = this.dataset.category;
        
        // Filter guides
        filterGuides(category);
    });
});

function filterGuides(category) {
    guideCards.forEach(card => {
        if (category === 'all') {
            // Show all cards
            card.classList.remove('hidden');
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // Show only matching category
            if (card.dataset.category === category) {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.classList.add('hidden');
                }, 300);
            }
        }
    });
}

// Read Guide button handlers
const readButtons = document.querySelectorAll('.read-btn');
readButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const guideCard = this.closest('.guide-card');
        const guideTitle = guideCard.querySelector('.guide-title').textContent;
        alert(`Opening guide: ${guideTitle}\n\nThis would navigate to the full guide page.`);
    });
});

// Load More functionality
const loadMoreBtn = document.getElementById('load-more-btn');
if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function() {
        // Simulate loading more guides
        this.innerHTML = '<span>Loading...</span>';
        
        setTimeout(() => {
            alert('More guides would be loaded here.\n\nThis feature will be connected to the backend later.');
            this.innerHTML = '<span>Load More Guides</span><i class="fas fa-chevron-down"></i>';
        }, 1000);
    });
}

// Newsletter form submission
const newsletterForm = document.getElementById('newsletter-form');
const successMessage = document.getElementById('success-message');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            // Show success message
            successMessage.classList.add('show');
            
            // Reset form
            this.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            console.log('Newsletter subscription:', email);
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

// Observe guide cards for animation
guideCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
});

// Add hover effect enhancement
guideCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Count guides by category
function countGuidesByCategory() {
    const counts = {
        all: guideCards.length,
        career: 0,
        study: 0,
        relationship: 0,
        fitness: 0,
        productivity: 0,
        'mental-wellness': 0
    };
    
    guideCards.forEach(card => {
        const category = card.dataset.category;
        if (counts.hasOwnProperty(category)) {
            counts[category]++;
        }
    });
    
    console.log('Guides by category:', counts);
}

// Initialize
countGuidesByCategory();

console.log('Guides Page Loaded ✨');
console.log(`Total guides: ${guideCards.length}`);
