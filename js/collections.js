// Collections Page JavaScript

let collectionsData = [];

// Initialize Collections Page
document.addEventListener('DOMContentLoaded', function() {
    loadCollections();
});

// Load Collections from JSON
async function loadCollections() {
    try {
        const response = await fetch('../data/collections.json');
        const data = await response.json();
        collectionsData = data.collections || [];
        renderCollections();
    } catch (error) {
        console.error('Error loading collections:', error);
        showError();
    }
}

// Render Collections
function renderCollections() {
    const container = document.getElementById('collectionsGrid');
    
    if (collectionsData.length === 0) {
        container.innerHTML = '<div class="loading-state"><p>No collections available at the moment.</p></div>';
        return;
    }
    
    container.innerHTML = collectionsData.map(collection => {
        const totalItems = 
            collection.items.tools.length + 
            collection.items.guides.length + 
            collection.items.hacks.length;
        
        return `
            <div class="collection-card collapsed" data-id="${collection.id}">
                <div class="card-header" style="background: ${collection.gradient};">
                    <span class="card-icon">${collection.icon}</span>
                    <h2>${collection.name}</h2>
                    <p>${collection.description}</p>
                    <div class="stats-badge">
                        <span>📦</span>
                        <span>${totalItems} items included</span>
                    </div>
                </div>
                
                <div class="card-body collapsed">
                    ${renderItemsSection('Tools', '🔧', collection.items.tools)}
                    ${renderItemsSection('Guides', '📚', collection.items.guides)}
                    ${renderItemsSection('Hacks', '💡', collection.items.hacks)}
                </div>
                
                <div class="card-footer collapsed">
                    <button class="btn-open-pack" onclick="openPack('${collection.id}')">
                        🎁 Open Pack
                    </button>
                    <button class="btn-close" onclick="closeCard('${collection.id}')">
                        ✕ Close
                    </button>
                </div>
                
                <div class="card-body">
                    <button class="toggle-view" onclick="toggleCard('${collection.id}')">
                        <span>View Contents</span>
                        <span class="toggle-icon">▼</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Render Items Section
function renderItemsSection(title, icon, items) {
    if (items.length === 0) return '';
    
    return `
        <div class="items-section">
            <h3 class="section-title">
                <span class="section-icon">${icon}</span>
                ${title}
            </h3>
            <div class="items-list">
                ${items.map(item => `
                    <a href="${item.link}" class="item">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                    </a>
                `).join('')}
            </div>
        </div>
    `;
}

// Toggle Card Expansion
function toggleCard(collectionId) {
    const card = document.querySelector(`[data-id="${collectionId}"]`);
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other cards first
    document.querySelectorAll('.collection-card').forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
            c.classList.add('collapsed');
            c.querySelectorAll('.card-body, .card-footer').forEach(el => {
                if (el.querySelector('.toggle-view')) {
                    el.classList.remove('collapsed');
                } else {
                    el.classList.add('collapsed');
                }
            });
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        closeCard(collectionId);
    } else {
        expandCard(collectionId);
    }
}

// Expand Card
function expandCard(collectionId) {
    const card = document.querySelector(`[data-id="${collectionId}"]`);
    
    card.classList.remove('collapsed');
    card.classList.add('expanded');
    
    // Show content sections
    card.querySelectorAll('.card-body, .card-footer').forEach(el => {
        if (el.querySelector('.toggle-view')) {
            el.classList.add('collapsed');
        } else {
            el.classList.remove('collapsed');
        }
    });
    
    // Smooth scroll to card
    setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Close Card
function closeCard(collectionId) {
    const card = document.querySelector(`[data-id="${collectionId}"]`);
    
    card.classList.remove('expanded');
    card.classList.add('collapsed');
    
    // Hide content sections
    card.querySelectorAll('.card-body, .card-footer').forEach(el => {
        if (el.querySelector('.toggle-view')) {
            el.classList.remove('collapsed');
        } else {
            el.classList.add('collapsed');
        }
    });
}

// Open Pack (Navigate to collection page or show modal)
function openPack(collectionId) {
    const collection = collectionsData.find(c => c.id === collectionId);
    
    if (!collection) return;
    
    // Show success message
    showNotification(`🎉 Opening ${collection.name}!`);
    
    // Track usage
    trackCollectionUsage(collection);
    
    // You can redirect to a dedicated collection page or show a modal
    // For now, we'll just expand the card
    setTimeout(() => {
        expandCard(collectionId);
    }, 500);
}

// Track Collection Usage
function trackCollectionUsage(collection) {
    const usage = JSON.parse(localStorage.getItem('collectionUsage') || '[]');
    
    usage.unshift({
        id: collection.id,
        name: collection.name,
        timestamp: Date.now()
    });
    
    // Keep only last 20
    const trimmed = usage.slice(0, 20);
    localStorage.setItem('collectionUsage', JSON.stringify(trimmed));
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.4s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.4s ease';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// Show Error
function showError() {
    const container = document.getElementById('collectionsGrid');
    container.innerHTML = `
        <div class="loading-state">
            <p>⚠️ Unable to load collections. Please try again later.</p>
        </div>
    `;
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
