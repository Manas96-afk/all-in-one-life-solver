// Guides Library Page JavaScript

let allGuides = [];
let categories = [];
let currentCategory = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadGuides();
});

// Load Guides from JSON
async function loadGuides() {
    try {
        const response = await fetch('../data/guides.json');
        const data = await response.json();
        allGuides = data.guides || [];
        categories = data.categories || [];
        
        renderCategoryTabs();
        renderFeaturedGuides();
        renderGuides(allGuides);
        updateGuideCount(allGuides.length);
    } catch (error) {
        console.error('Error loading guides:', error);
        showError();
    }
}

// Render Category Tabs
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabs');
    
    let html = `
        <button class="filter-tab active" data-category="all" onclick="filterByCategory('all')">
            📚 All Guides
        </button>
    `;
    
    categories.forEach(cat => {
        html += `
            <button class="filter-tab" data-category="${cat.id}" onclick="filterByCategory('${cat.id}')">
                ${cat.icon} ${cat.name}
            </button>
        `;
    });
    
    container.innerHTML = html;
}

// Render Featured Guides
function renderFeaturedGuides() {
    const container = document.getElementById('featuredGrid');
    const featured = allGuides.filter(g => g.featured).slice(0, 4);
    
    if (featured.length === 0) {
        document.querySelector('.featured-section').style.display = 'none';
        return;
    }
    
    container.innerHTML = featured.map(guide => renderGuideCard(guide)).join('');
}

// Render Guides
function renderGuides(guides) {
    const container = document.getElementById('guidesGrid');
    
    if (guides.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>😕 No guides found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = guides.map(guide => renderGuideCard(guide)).join('');
}

// Render Single Guide Card
function renderGuideCard(guide) {
    const category = categories.find(c => c.id === guide.category) || {};
    
    return `
        <a href="single-guide.html?id=${guide.id}" class="guide-card">
            <div class="guide-card-image">${guide.image}</div>
            <div class="guide-card-content">
                <span class="guide-card-category">
                    ${category.icon || '📖'} ${category.name || guide.category}
                </span>
                <h3>${guide.title}</h3>
                <p>${guide.description}</p>
                <div class="guide-card-meta">
                    <span class="guide-read-time">⏱️ ${guide.readTime}</span>
                    <span class="guide-difficulty ${guide.difficulty}">${guide.difficulty}</span>
                </div>
            </div>
        </a>
    `;
}

// Filter by Category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // Filter guides
    let filtered = category === 'all' 
        ? allGuides 
        : allGuides.filter(g => g.category === category);
    
    // Apply search filter if exists
    const searchTerm = document.getElementById('guideSearch').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(g => 
            g.title.toLowerCase().includes(searchTerm) ||
            g.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGuides(filtered);
    updateGuideCount(filtered.length);
}

// Filter Guides (Search)
function filterGuides() {
    const searchTerm = document.getElementById('guideSearch').value.toLowerCase();
    
    let filtered = currentCategory === 'all'
        ? allGuides
        : allGuides.filter(g => g.category === currentCategory);
    
    if (searchTerm) {
        filtered = filtered.filter(g => 
            g.title.toLowerCase().includes(searchTerm) ||
            g.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderGuides(filtered);
    updateGuideCount(filtered.length);
}

// Update Guide Count
function updateGuideCount(count) {
    document.getElementById('guideCount').textContent = `${count} guide${count !== 1 ? 's' : ''}`;
}

// Show Error
function showError() {
    document.getElementById('guidesGrid').innerHTML = `
        <div class="no-results">
            <h3>⚠️ Error loading guides</h3>
            <p>Please try refreshing the page</p>
        </div>
    `;
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.ls-nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}
