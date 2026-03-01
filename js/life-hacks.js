// Life Hacks Page JavaScript

let allHacks = [];
let categories = [];
let currentCategory = 'all';
let savedHacks = JSON.parse(localStorage.getItem('savedHacks') || '[]');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadHacks();
});

// Load Hacks from JSON
async function loadHacks() {
    try {
        const response = await fetch('../data/hacks.json');
        const data = await response.json();
        allHacks = data.hacks || [];
        categories = data.categories || [];
        
        renderCategoryTabs();
        renderHacks(allHacks);
        displayHackOfDay();
        updateHackCount(allHacks.length);
    } catch (error) {
        console.error('Error loading hacks:', error);
        showError();
    }
}

// Render Category Tabs
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabs');
    
    let html = `
        <button class="filter-tab active" data-category="all" onclick="filterByCategory('all')">
            🌟 All Hacks
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

// Render Hacks
function renderHacks(hacks) {
    const container = document.getElementById('hacksGrid');
    
    if (hacks.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>😕 No hacks found</h3>
                <p>Try a different search or category</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = hacks.map(hack => {
        const category = categories.find(c => c.id === hack.category) || {};
        const isSaved = savedHacks.includes(hack.id);
        
        return `
            <div class="hack-card" style="border-left-color: ${category.color || '#667eea'}">
                <div class="hack-card-header">
                    <h3>${hack.title}</h3>
                    <span class="hack-number">#${hack.id}</span>
                </div>
                <p>${hack.description}</p>
                <div class="hack-card-footer">
                    <span class="hack-category" style="background: ${category.color}20; color: ${category.color}">
                        ${category.icon || '💡'} ${category.name || hack.category}
                    </span>
                    <div class="hack-meta">
                        <span class="hack-difficulty difficulty-${hack.difficulty}">
                            ${getDifficultyIcon(hack.difficulty)} ${hack.difficulty}
                        </span>
                        <span class="hack-time">⏱️ ${hack.timeToApply}</span>
                    </div>
                    <button class="hack-save-btn ${isSaved ? 'saved' : ''}" 
                            onclick="toggleSaveHack(${hack.id}, event)"
                            title="${isSaved ? 'Remove from saved' : 'Save hack'}">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Get Difficulty Icon
function getDifficultyIcon(difficulty) {
    switch(difficulty) {
        case 'easy': return '🟢';
        case 'medium': return '🟡';
        case 'hard': return '🔴';
        default: return '⚪';
    }
}

// Filter by Category
function filterByCategory(category) {
    currentCategory = category;
    
    // Update active tab
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });
    
    // Filter hacks
    let filtered = category === 'all' 
        ? allHacks 
        : allHacks.filter(h => h.category === category);
    
    // Apply search filter if exists
    const searchTerm = document.getElementById('hackSearch').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(h => 
            h.title.toLowerCase().includes(searchTerm) ||
            h.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderHacks(filtered);
    updateHackCount(filtered.length);
}

// Filter Hacks (Search)
function filterHacks() {
    const searchTerm = document.getElementById('hackSearch').value.toLowerCase();
    
    let filtered = currentCategory === 'all'
        ? allHacks
        : allHacks.filter(h => h.category === currentCategory);
    
    if (searchTerm) {
        filtered = filtered.filter(h => 
            h.title.toLowerCase().includes(searchTerm) ||
            h.description.toLowerCase().includes(searchTerm)
        );
    }
    
    renderHacks(filtered);
    updateHackCount(filtered.length);
}

// Sort Hacks
function sortHacks() {
    const sortBy = document.getElementById('sortSelect').value;
    
    let filtered = currentCategory === 'all'
        ? [...allHacks]
        : allHacks.filter(h => h.category === currentCategory);
    
    switch(sortBy) {
        case 'easy':
            filtered.sort((a, b) => {
                const order = { easy: 1, medium: 2, hard: 3 };
                return order[a.difficulty] - order[b.difficulty];
            });
            break;
        case 'hard':
            filtered.sort((a, b) => {
                const order = { easy: 1, medium: 2, hard: 3 };
                return order[b.difficulty] - order[a.difficulty];
            });
            break;
        case 'quick':
            filtered.sort((a, b) => {
                const getMinutes = (time) => {
                    if (time.includes('instant')) return 0;
                    if (time.includes('min')) return parseInt(time);
                    if (time.includes('hour')) return parseInt(time) * 60;
                    return 999;
                };
                return getMinutes(a.timeToApply) - getMinutes(b.timeToApply);
            });
            break;
        default:
            // Default order
            break;
    }
    
    renderHacks(filtered);
}

// Update Hack Count
function updateHackCount(count) {
    document.getElementById('hackCount').textContent = `${count} hack${count !== 1 ? 's' : ''}`;
}

// Display Hack of the Day
function displayHackOfDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const hackIndex = dayOfYear % allHacks.length;
    const hack = allHacks[hackIndex];
    
    if (hack) {
        const category = categories.find(c => c.id === hack.category) || {};
        
        document.getElementById('hodTitle').textContent = hack.title;
        document.getElementById('hodDescription').textContent = hack.description;
        document.getElementById('hodCategory').textContent = `${category.icon || '💡'} ${category.name || hack.category}`;
    }
}

// Toggle Save Hack
function toggleSaveHack(hackId, event) {
    event.stopPropagation();
    
    const index = savedHacks.indexOf(hackId);
    
    if (index > -1) {
        savedHacks.splice(index, 1);
    } else {
        savedHacks.push(hackId);
    }
    
    localStorage.setItem('savedHacks', JSON.stringify(savedHacks));
    
    // Update button
    const btn = event.target;
    btn.classList.toggle('saved');
    btn.textContent = savedHacks.includes(hackId) ? '❤️' : '🤍';
    
    // Show notification
    if (typeof showInAppNotification === 'function') {
        const message = savedHacks.includes(hackId) 
            ? '❤️ Hack saved!' 
            : '💔 Hack removed from saved';
        showInAppNotification(message, 'success', 2000);
    }
}

// Show Error
function showError() {
    document.getElementById('hacksGrid').innerHTML = `
        <div class="no-results">
            <h3>⚠️ Error loading hacks</h3>
            <p>Please try refreshing the page</p>
        </div>
    `;
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.ls-nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}
