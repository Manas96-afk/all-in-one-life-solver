// Life Solver - Main JavaScript
class LifeSolver {
    constructor() {
        this.toolsData = null;
        this.isLoading = false;
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupScrollAnimations();
        this.loadToolsData();
        this.setupCategoryCards();
        this.setupSearch();
    }

    // Load tools data from JSON file
    async loadToolsData() {
        if (this.isLoading || this.toolsData) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            const response = await fetch('data/tools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.toolsData = await response.json();
            
            // Load content based on current page
            if (this.isHomePage()) {
                this.loadPopularItems();
            }
            
            this.hideLoadingState();
        } catch (error) {
            console.error('Error loading tools data:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    isHomePage() {
        return window.location.pathname.includes('index.html') || 
               window.location.pathname === '/' ||
               window.location.pathname.endsWith('/');
    }

    showLoadingState() {
        const popularGrid = document.getElementById('popular-grid');
        if (popularGrid) {
            popularGrid.innerHTML = this.createLoadingCards(6);
        }
    }

    hideLoadingState() {
        // Loading cards will be replaced by actual content
    }

    createLoadingCards(count) {
        return Array(count).fill(0).map(() => `
            <div class="popular-item loading-card">
                <div class="loading-shimmer">
                    <div class="shimmer-header"></div>
                    <div class="shimmer-title"></div>
                    <div class="shimmer-description"></div>
                    <div class="shimmer-button"></div>
                </div>
            </div>
        `).join('');
    }

    handleLoadError() {
        const popularGrid = document.getElementById('popular-grid');
        if (popularGrid) {
            popularGrid.innerHTML = `
                <div class="error-state">
                    <div class="error-icon">⚠️</div>
                    <h3>Unable to load content</h3>
                    <p>Please check your connection and try again.</p>
                    <button onclick="location.reload()" class="retry-btn">Retry</button>
                </div>
            `;
        }
    }

    // Navbar functionality
    setupNavbar() {
        const navbar = document.getElementById('navbar');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    }

    // Scroll animations
    setupScrollAnimations() {
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

        // Observe category cards and popular items
        document.querySelectorAll('.category-card, .popular-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Load popular items from JSON data
    loadPopularItems() {
        const popularGrid = document.getElementById('popular-grid');
        if (!popularGrid || !this.toolsData) return;

        // Get popular/featured tools (limit to 6 for homepage)
        const popularTools = this.toolsData.tools
            .filter(tool => tool.popular || tool.featured)
            .slice(0, 6);

        // If not enough popular tools, fill with random tools
        if (popularTools.length < 6) {
            const remainingTools = this.toolsData.tools
                .filter(tool => !tool.popular && !tool.featured)
                .sort(() => Math.random() - 0.5)
                .slice(0, 6 - popularTools.length);
            
            popularTools.push(...remainingTools);
        }

        // Render popular items with fade-in animation
        popularGrid.style.opacity = '0';
        
        setTimeout(() => {
            popularGrid.innerHTML = popularTools.map((tool, index) => 
                this.createPopularItem(tool, index)
            ).join('');
            
            popularGrid.style.opacity = '1';
            
            // Add click handlers
            this.setupPopularItemHandlers();
        }, 200);
    }

    setupPopularItemHandlers() {
        const popularItems = document.querySelectorAll('.popular-item');
        
        popularItems.forEach(item => {
            item.addEventListener('click', () => {
                const toolId = item.dataset.toolId;
                this.openTool(toolId);
            });
        });
    }

    createPopularItem(tool, index = 0) {
        const animationDelay = `style="animation-delay: ${index * 0.1}s"`;
        
        return `
            <div class="popular-item" data-tool-id="${tool.id}" data-title="${tool.name}" ${animationDelay}>
                <div class="popular-header">
                    <span class="popular-icon">${tool.icon}</span>
                    <h3 class="popular-title">${tool.name}</h3>
                    <span class="popular-category">${tool.category}</span>
                </div>
                <p class="popular-description">${tool.description}</p>
                <button class="popular-btn">Open</button>
            </div>
        `;
    }

    openTool(toolId) {
        // Navigate to tool page with ID parameter
        if (toolId) {
            window.location.href = `pages/tool.html?id=${toolId}`;
        }
    }

    // Category cards functionality
    setupCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.navigateToCategory(category);
            });

            // Add hover glow effect
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = 'var(--shadow-glow)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = 'var(--shadow-md)';
            });
        });
    }

    navigateToCategory(category) {
        // Navigate to category page
        window.location.href = `pages/category.html?category=${category}`;
    }

    // Search functionality
    setupSearch() {
        const searchInput = document.querySelector('.search-input');
        const searchSubmit = document.querySelector('.search-submit');
        const searchBtn = document.getElementById('search-btn');

        if (searchSubmit) {
            searchSubmit.addEventListener('click', () => {
                this.performSearch();
            });
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Add search suggestions (future enhancement)
            searchInput.addEventListener('input', (e) => {
                // Implement search suggestions
                console.log('Search query:', e.target.value);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                // Focus on search input or show search modal
                if (searchInput) {
                    searchInput.focus();
                }
            });
        }
    }

    performSearch() {
        const searchInput = document.querySelector('.search-input');
        const query = searchInput?.value.trim();
        
        if (query) {
            // Navigate to search results or category page
            window.location.href = `pages/category.html?search=${encodeURIComponent(query)}`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LifeSolver();
});

// Smooth scroll for anchor links
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    const currentPage = getCurrentPage();
    
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'category':
            initializeCategoryPage();
            break;
        case 'tool':
            initializeToolPage();
            break;
    }
    
    setupEventListeners();
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('category.html')) return 'category';
    if (path.includes('tool.html')) return 'tool';
    return 'index';
}

function initializeHomePage() {
    loadPopularTools();
    setupMainCardNavigation();
}

function initializeCategoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const type = urlParams.get('type');
    
    loadCategoryPageData();
    setupCategoryFilters();
    setupSearch();
    setupMobileFilters();
    
    // Apply initial filters from URL
    if (category) {
        setActiveFilter('category', category);
    }
    if (type) {
        setActiveFilter('type', type);
    }
}

function initializeToolPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const toolId = urlParams.get('id');
    if (toolId) {
        loadToolPage(toolId);
    }
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
    
    // Category card clicks
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            window.location.href = `category.html?category=${category}`;
        });
    });
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            filterTools(filter);
        });
    });
}

function setupMainCardNavigation() {
    // AI Tools card
    const aiToolsCard = document.querySelector('.ai-tools-card');
    if (aiToolsCard) {
        aiToolsCard.addEventListener('click', function() {
            window.location.href = 'category.html?type=ai-tool';
        });
    }
    
    // Life Hacks card
    const lifeHacksCard = document.querySelector('.life-hacks-card');
    if (lifeHacksCard) {
        lifeHacksCard.addEventListener('click', function() {
            window.location.href = 'category.html?type=life-hack';
        });
    }
    
    // Guides card
    const guidesCard = document.querySelector('.guides-card');
    if (guidesCard) {
        guidesCard.addEventListener('click', function() {
            window.location.href = 'category.html?type=guide';
        });
    }
    
    // Add navigation for individual card buttons
    const cardButtons = document.querySelectorAll('.card-btn');
    cardButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            const card = this.closest('.main-card');
            if (card.classList.contains('ai-tools-card')) {
                window.location.href = 'category.html?type=ai-tool';
            } else if (card.classList.contains('life-hacks-card')) {
                window.location.href = 'category.html?type=life-hack';
            } else if (card.classList.contains('guides-card')) {
                window.location.href = 'category.html?type=guide';
            }
        });
    });
}

function setupCategoryNavigation() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            navigateToCategory(category);
        });
    });
}

function navigateToCategory(category) {
    window.location.href = `category.html?category=${category}`;
}

function handleSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // Simulate search functionality
        console.log('Searching for:', query);
        // In a real app, this would search through the tools database
        alert(`Searching for: "${query}"\n\nThis would show relevant tools and guides.`);
    }
}

async function loadPopularTools() {
    const toolsContainer = document.getElementById('popular-tools');
    if (!toolsContainer) return;
    
    try {
        // Load tools from JSON file
        const response = await fetch('../data/tools.json');
        const data = await response.json();
        
        // Extract all tools from categories and mark popular ones
        const allTools = [];
        Object.keys(data.categories).forEach(categoryKey => {
            const category = data.categories[categoryKey];
            category.tools.forEach(tool => {
                allTools.push({
                    ...tool,
                    category: categoryKey,
                    categoryName: category.name,
                    categoryIcon: category.icon
                });
            });
        });
        
        // Select popular tools first, then fill with others if needed
        const popularTools = allTools.filter(tool => tool.popular);
        const otherTools = allTools.filter(tool => !tool.popular);
        const selectedTools = [...popularTools, ...otherTools].slice(0, 6);
        
        toolsContainer.innerHTML = selectedTools.map(tool => createPopularToolCard(tool)).join('');
        
        // Add click listeners to tool cards
        const toolCards = toolsContainer.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', function() {
                const toolId = this.dataset.toolId;
                window.location.href = `tool.html?id=${toolId}`;
            });
        });
        
    } catch (error) {
        console.error('Error loading tools:', error);
        // Fallback to sample data
        loadSamplePopularTools(toolsContainer);
    }
}

function loadSamplePopularTools(container) {
    const sampleTools = [
        {
            id: 'resume-builder',
            title: 'Resume Builder AI',
            description: 'Create professional resumes with AI assistance',
            category: 'career',
            type: 'ai-tool',
            categoryIcon: 'fas fa-briefcase',
            timeRequired: '15 minutes'
        },
        {
            id: 'study-planner',
            title: 'Study Schedule Optimizer',
            description: 'Create optimal study schedules',
            category: 'study',
            type: 'ai-tool',
            categoryIcon: 'fas fa-graduation-cap',
            timeRequired: '20 minutes'
        },
        {
            id: 'workout-generator',
            title: 'Personalized Workout Generator',
            description: 'Get custom workout plans',
            category: 'fitness',
            type: 'ai-tool',
            categoryIcon: 'fas fa-dumbbell',
            timeRequired: '5 minutes'
        },
        {
            id: 'budget-tracker',
            title: 'Smart Budget Tracker',
            description: 'Track and optimize your spending',
            category: 'finance',
            type: 'life-hack',
            categoryIcon: 'fas fa-chart-line',
            timeRequired: '30 minutes'
        },
        {
            id: 'communication-helper',
            title: 'Communication Helper',
            description: 'Improve your conversation skills',
            category: 'relationship',
            type: 'ai-tool',
            categoryIcon: 'fas fa-heart',
            timeRequired: '10 minutes'
        },
        {
            id: 'stress-relief',
            title: 'Stress Relief Techniques',
            description: 'Quick stress management methods',
            category: 'mental-health',
            type: 'guide',
            categoryIcon: 'fas fa-leaf',
            timeRequired: '15 minutes'
        }
    ];
    
    container.innerHTML = sampleTools.map(tool => createPopularToolCard(tool)).join('');
}

function loadCategoryPage(category) {
    const categoryInfo = categories[category];
    if (!categoryInfo) return;
    
    // Update category header
    const categoryIcon = document.getElementById('category-icon');
    const categoryTitle = document.getElementById('category-title');
    const categoryDescription = document.getElementById('category-description');
    
    if (categoryIcon) {
        categoryIcon.innerHTML = `<i class="${categoryInfo.icon}"></i>`;
    }
    if (categoryTitle) {
        categoryTitle.textContent = categoryInfo.title;
    }
    if (categoryDescription) {
        categoryDescription.textContent = categoryInfo.description;
    }
    
    // Load category tools
    loadCategoryTools(category);
}

function loadCategoryTools(category) {
    const toolsContainer = document.getElementById('category-tools');
    if (!toolsContainer) return;
    
    // Sample tools for the category
    const tools = generateSampleTools(category);
    toolsContainer.innerHTML = tools.map(tool => createToolCard(tool)).join('');
    
    // Add click listeners
    const toolCards = toolsContainer.querySelectorAll('.tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolId = this.dataset.toolId;
            window.location.href = `tool.html?id=${toolId}`;
        });
    });
}

function generateSampleTools(category) {
    const toolTemplates = {
        career: [
            { title: 'Resume Builder AI', description: 'Create professional resumes', type: 'AI Tool', icon: 'fas fa-file-alt' },
            { title: 'Interview Prep Guide', description: 'Ace your next interview', type: 'Guide', icon: 'fas fa-comments' },
            { title: 'Salary Negotiation Tips', description: 'Get the salary you deserve', type: 'Life Hack', icon: 'fas fa-handshake' }
        ],
        relationship: [
            { title: 'Communication Helper', description: 'Improve your conversations', type: 'AI Tool', icon: 'fas fa-heart' },
            { title: 'Date Ideas Generator', description: 'Creative date suggestions', type: 'Life Hack', icon: 'fas fa-lightbulb' },
            { title: 'Conflict Resolution Guide', description: 'Handle disagreements better', type: 'Guide', icon: 'fas fa-balance-scale' }
        ],
        study: [
            { title: 'Study Schedule AI', description: 'Optimize your study time', type: 'AI Tool', icon: 'fas fa-calendar' },
            { title: 'Memory Techniques', description: 'Remember more effectively', type: 'Life Hack', icon: 'fas fa-brain' },
            { title: 'Note-Taking System', description: 'Organize your notes better', type: 'Guide', icon: 'fas fa-sticky-note' }
        ]
    };
    
    const templates = toolTemplates[category] || toolTemplates.career;
    return templates.map((template, index) => ({
        id: `${category}-${index + 1}`,
        category,
        ...template
    }));
}

function createToolCard(tool) {
    return `
        <div class="tool-card" data-tool-id="${tool.id}">
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.icon}"></i>
                </div>
                <span class="tool-type">${tool.type}</span>
            </div>
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
        </div>
    `;
}

function createPopularToolCard(tool) {
    const typeDisplay = tool.type ? tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Tool';
    const timeDisplay = tool.timeRequired || '10 minutes';
    
    return `
        <div class="tool-card popular-tool-card" data-tool-id="${tool.id}">
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.categoryIcon || 'fas fa-tools'}"></i>
                </div>
                <div class="tool-meta">
                    <span class="tool-type">${typeDisplay}</span>
                    <span class="tool-time">
                        <i class="fas fa-clock"></i>
                        ${timeDisplay}
                    </span>
                </div>
            </div>
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
            <div class="tool-tags">
                ${tool.tags ? tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}
            </div>
        </div>
    `;
}

function loadToolPage(toolId) {
    // Sample tool data
    const toolData = {
        id: toolId,
        title: 'Resume Builder AI',
        description: 'Create professional resumes with AI assistance and smart formatting',
        category: 'Career',
        type: 'AI Tool'
    };
    
    // Update tool page content
    const toolTitle = document.getElementById('tool-title');
    const toolDescription = document.getElementById('tool-description');
    const toolCategory = document.getElementById('tool-category');
    const toolType = document.getElementById('tool-type');
    const toolInterface = document.getElementById('tool-interface');
    
    if (toolTitle) toolTitle.textContent = toolData.title;
    if (toolDescription) toolDescription.textContent = toolData.description;
    if (toolCategory) toolCategory.textContent = toolData.category;
    if (toolType) toolType.textContent = toolData.type;
    
    if (toolInterface) {
        toolInterface.innerHTML = `
            <h3>Tool Interface</h3>
            <p>This is where the interactive tool would be loaded.</p>
            <div style="background: white; padding: 20px; border-radius: 12px; margin-top: 16px;">
                <p><strong>Sample Tool:</strong> ${toolData.title}</p>
                <p>Interactive features would be implemented here based on the tool type.</p>
            </div>
        `;
    }
}

function filterTools(filter) {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else {
            const toolType = card.querySelector('.tool-type').textContent.toLowerCase();
            const shouldShow = toolType.includes(filter.replace('-', ' '));
            card.style.display = shouldShow ? 'block' : 'none';
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
// Category Page Functions
let allToolsData = [];
let filteredToolsData = [];
let activeFilters = {
    category: 'all',
    type: null,
    difficulty: null,
    search: ''
};

async function loadCategoryPageData() {
    try {
        const response = await fetch('../data/tools.json');
        const data = await response.json();
        
        // Extract all tools with category information
        allToolsData = [];
        Object.keys(data.categories).forEach(categoryKey => {
            const category = data.categories[categoryKey];
            category.tools.forEach(tool => {
                allToolsData.push({
                    ...tool,
                    category: categoryKey,
                    categoryName: category.name,
                    categoryIcon: category.icon
                });
            });
        });
        
        filteredToolsData = [...allToolsData];
        renderCategoryFilters(data.categories);
        updateToolCounts();
        renderFilteredTools();
        
    } catch (error) {
        console.error('Error loading category data:', error);
        loadSampleCategoryData();
    }
}

function loadSampleCategoryData() {
    // Fallback sample data
    allToolsData = [
        {
            id: 'resume-builder',
            title: 'Resume Builder AI',
            description: 'Create professional resumes with AI assistance',
            type: 'ai-tool',
            difficulty: 'beginner',
            timeRequired: '15 minutes',
            tags: ['resume', 'job-search', 'ai'],
            category: 'career',
            categoryName: 'Career',
            categoryIcon: 'fas fa-briefcase'
        },
        {
            id: 'workout-generator',
            title: 'Personalized Workout Generator',
            description: 'Get custom workout plans',
            type: 'ai-tool',
            difficulty: 'beginner',
            timeRequired: '5 minutes',
            tags: ['fitness', 'workout', 'health'],
            category: 'fitness',
            categoryName: 'Fitness',
            categoryIcon: 'fas fa-dumbbell'
        }
    ];
    
    filteredToolsData = [...allToolsData];
    renderFilteredTools();
}

function renderCategoryFilters(categories) {
    const categoryFilters = document.getElementById('category-filters');
    if (!categoryFilters) return;
    
    // Keep the "All Categories" button and add category-specific filters
    const categoryButtons = Object.keys(categories).map(categoryKey => {
        const category = categories[categoryKey];
        return `
            <button class="filter-item" data-category="${categoryKey}">
                <i class="${category.icon}"></i>
                <span>${category.name}</span>
                <span class="count" id="count-${categoryKey}">0</span>
            </button>
        `;
    }).join('');
    
    // Append to existing "All Categories" button
    categoryFilters.innerHTML += categoryButtons;
}

function setupCategoryFilters() {
    // Category filters
    const categoryFilters = document.getElementById('category-filters');
    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            const filterItem = e.target.closest('.filter-item');
            if (filterItem && filterItem.dataset.category) {
                setActiveFilter('category', filterItem.dataset.category);
            }
        });
    }
    
    // Type filters
    const typeFilters = document.getElementById('type-filters');
    if (typeFilters) {
        typeFilters.addEventListener('click', (e) => {
            const filterItem = e.target.closest('.filter-item');
            if (filterItem && filterItem.dataset.type) {
                const type = filterItem.dataset.type;
                setActiveFilter('type', activeFilters.type === type ? null : type);
            }
        });
    }
    
    // Difficulty filters
    const difficultyFilters = document.getElementById('difficulty-filters');
    if (difficultyFilters) {
        difficultyFilters.addEventListener('click', (e) => {
            const filterItem = e.target.closest('.filter-item');
            if (filterItem && filterItem.dataset.difficulty) {
                const difficulty = filterItem.dataset.difficulty;
                setActiveFilter('difficulty', activeFilters.difficulty === difficulty ? null : difficulty);
            }
        });
    }
    
    // Sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortTools(e.target.value);
        });
    }
    
    // Clear filters button
    const clearFilters = document.getElementById('clear-filters');
    if (clearFilters) {
        clearFilters.addEventListener('click', clearAllFilters);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase();
            applyFilters();
        });
    }
}

function setActiveFilter(filterType, value) {
    activeFilters[filterType] = value;
    
    // Update UI
    updateFilterUI();
    applyFilters();
    updatePageTitle();
}

function updateFilterUI() {
    // Update category filter buttons
    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === activeFilters.category);
    });
    
    // Update type filter buttons
    document.querySelectorAll('[data-type]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === activeFilters.type);
    });
    
    // Update difficulty filter buttons
    document.querySelectorAll('[data-difficulty]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.difficulty === activeFilters.difficulty);
    });
}

function applyFilters() {
    filteredToolsData = allToolsData.filter(tool => {
        // Category filter
        if (activeFilters.category !== 'all' && tool.category !== activeFilters.category) {
            return false;
        }
        
        // Type filter
        if (activeFilters.type && tool.type !== activeFilters.type) {
            return false;
        }
        
        // Difficulty filter
        if (activeFilters.difficulty && tool.difficulty !== activeFilters.difficulty) {
            return false;
        }
        
        // Search filter
        if (activeFilters.search) {
            const searchTerm = activeFilters.search;
            const searchableText = `${tool.title} ${tool.description} ${tool.tags?.join(' ') || ''}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    updateToolCounts();
    renderFilteredTools();
    updateResultsCount();
}

function updateToolCounts() {
    // Count tools by category
    const categoryCounts = {};
    const typeCounts = { 'ai-tool': 0, 'life-hack': 0, 'guide': 0 };
    const difficultyCounts = { 'beginner': 0, 'intermediate': 0, 'advanced': 0 };
    
    allToolsData.forEach(tool => {
        // Category counts
        categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
        
        // Type counts
        if (typeCounts.hasOwnProperty(tool.type)) {
            typeCounts[tool.type]++;
        }
        
        // Difficulty counts
        if (difficultyCounts.hasOwnProperty(tool.difficulty)) {
            difficultyCounts[tool.difficulty]++;
        }
    });
    
    // Update category counts
    Object.keys(categoryCounts).forEach(category => {
        const countElement = document.getElementById(`count-${category}`);
        if (countElement) {
            countElement.textContent = categoryCounts[category];
        }
    });
    
    // Update type counts
    Object.keys(typeCounts).forEach(type => {
        const countElement = document.getElementById(`count-${type}`);
        if (countElement) {
            countElement.textContent = typeCounts[type];
        }
    });
    
    // Update difficulty counts
    Object.keys(difficultyCounts).forEach(difficulty => {
        const countElement = document.getElementById(`count-${difficulty}`);
        if (countElement) {
            countElement.textContent = difficultyCounts[difficulty];
        }
    });
    
    // Update total count
    const totalCountElement = document.getElementById('count-all');
    if (totalCountElement) {
        totalCountElement.textContent = allToolsData.length;
    }
}

function renderFilteredTools() {
    const toolsContainer = document.getElementById('filtered-tools');
    const emptyState = document.getElementById('empty-state');
    
    if (!toolsContainer) return;
    
    if (filteredToolsData.length === 0) {
        toolsContainer.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        return;
    }
    
    toolsContainer.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    
    toolsContainer.innerHTML = filteredToolsData.map(tool => createCategoryToolCard(tool)).join('');
    
    // Add click listeners
    const toolCards = toolsContainer.querySelectorAll('.category-tool-card');
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const toolId = this.dataset.toolId;
            window.location.href = `tool.html?id=${toolId}`;
        });
    });
}

function createCategoryToolCard(tool) {
    const typeDisplay = tool.type ? tool.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Tool';
    const difficultyClass = `difficulty-${tool.difficulty || 'beginner'}`;
    const timeDisplay = tool.timeRequired || '10 minutes';
    
    return `
        <div class="category-tool-card" data-tool-id="${tool.id}">
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.categoryIcon || 'fas fa-tools'}"></i>
                </div>
                <div class="tool-badges">
                    <span class="tool-type">${typeDisplay}</span>
                    <span class="difficulty-badge ${difficultyClass}">${tool.difficulty || 'beginner'}</span>
                </div>
            </div>
            <h3>${tool.title}</h3>
            <p>${tool.description}</p>
            <div class="tool-meta">
                <span class="time-required">
                    <i class="fas fa-clock"></i>
                    ${timeDisplay}
                </span>
                <span class="category-name">${tool.categoryName}</span>
            </div>
            ${tool.tags ? `
                <div class="tool-tags">
                    ${tool.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function sortTools(sortBy) {
    filteredToolsData.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.title.localeCompare(b.title);
            case 'type':
                return a.type.localeCompare(b.type);
            case 'time':
                const timeA = parseInt(a.timeRequired) || 0;
                const timeB = parseInt(b.timeRequired) || 0;
                return timeA - timeB;
            case 'difficulty':
                const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
                return (difficultyOrder[a.difficulty] || 1) - (difficultyOrder[b.difficulty] || 1);
            default:
                return 0;
        }
    });
    
    renderFilteredTools();
}

function updateResultsCount() {
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        const count = filteredToolsData.length;
        resultsCount.textContent = `${count} result${count !== 1 ? 's' : ''}`;
    }
}

function updatePageTitle() {
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');
    const currentCategory = document.getElementById('current-category');
    
    if (activeFilters.category !== 'all') {
        const categoryData = allToolsData.find(tool => tool.category === activeFilters.category);
        if (categoryData) {
            if (pageTitle) pageTitle.textContent = `${categoryData.categoryName} Tools & Guides`;
            if (pageSubtitle) pageSubtitle.textContent = `Discover ${categoryData.categoryName.toLowerCase()} solutions and resources`;
            if (currentCategory) currentCategory.textContent = categoryData.categoryName;
        }
    } else {
        if (pageTitle) pageTitle.textContent = 'Explore Tools & Guides';
        if (pageSubtitle) pageSubtitle.textContent = 'Find the perfect solution for your needs';
        if (currentCategory) currentCategory.textContent = 'All Categories';
    }
}

function clearAllFilters() {
    activeFilters = {
        category: 'all',
        type: null,
        difficulty: null,
        search: ''
    };
    
    // Clear search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    // Reset sort dropdown
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'name';
    
    updateFilterUI();
    applyFilters();
    updatePageTitle();
}

// Mobile filter toggle functionality
function setupMobileFilters() {
    const showFiltersBtn = document.getElementById('show-filters-btn');
    const mobileFilterToggle = document.getElementById('mobile-filter-toggle');
    const filtersSidebar = document.querySelector('.filters-sidebar');
    
    if (showFiltersBtn && filtersSidebar) {
        showFiltersBtn.addEventListener('click', () => {
            filtersSidebar.classList.add('active');
        });
    }
    
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', () => {
            filtersSidebar.classList.remove('active');
        });
    }
    
    // Close filters when clicking outside
    if (filtersSidebar) {
        filtersSidebar.addEventListener('click', (e) => {
            if (e.target === filtersSidebar) {
                filtersSidebar.classList.remove('active');
            }
        });
    }
}

// Mobile Navigation Toggle
function setupMobileNavigation() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMobile = document.getElementById('nav-mobile');
    
    if (mobileMenuBtn && navMobile) {
        mobileMenuBtn.addEventListener('click', function() {
            const isActive = navMobile.classList.contains('active');
            
            if (isActive) {
                navMobile.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                navMobile.classList.add('active');
                mobileMenuBtn.classList.add('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = navMobile.querySelectorAll('.nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMobile.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !navMobile.contains(e.target)) {
                navMobile.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    }
}

// Initialize mobile navigation on all pages
document.addEventListener('DOMContentLoaded', function() {
    setupMobileNavigation();
});

// Category Page Functionality
class CategoryPage {
    constructor(toolsData = null) {
        this.currentFilter = 'all';
        this.items = [];
        this.toolsData = toolsData;
        this.isLoading = false;
        this.init();
    }

    init() {
        if (this.isCategoryPage()) {
            if (this.toolsData) {
                this.loadItemsFromData();
                this.setupFilters();
                this.renderItems();
            } else {
                this.loadToolsData();
            }
        }
    }

    isCategoryPage() {
        return window.location.pathname.includes('category.html');
    }

    async loadToolsData() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.showLoadingState();

        try {
            const response = await fetch('../data/tools.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.toolsData = await response.json();
            this.loadItemsFromData();
            this.setupFilters();
            this.renderItems();
            this.hideLoadingState();
        } catch (error) {
            console.error('Error loading tools data:', error);
            this.handleLoadError();
        } finally {
            this.isLoading = false;
        }
    }

    loadItemsFromData() {
        if (!this.toolsData || !this.toolsData.tools) return;
        
        // Convert tools data to category page format
        this.items = this.toolsData.tools.map(tool => ({
            id: tool.id,
            name: tool.name,
            category: tool.category.toLowerCase().replace(/\s+/g, '-'),
            type: tool.type,
            description: tool.description,
            icon: tool.icon,
            link: tool.link
        }));
    }

    showLoadingState() {
        const cardsGrid = document.getElementById('cards-grid');
        if (cardsGrid) {
            cardsGrid.innerHTML = this.createLoadingCards(8);
        }
    }

    hideLoadingState() {
        // Loading cards will be replaced by actual content
    }

    createLoadingCards(count) {
        return Array(count).fill(0).map(() => `
            <div class="category-card-item loading-card">
                <div class="loading-shimmer">
                    <div class="shimmer-header"></div>
                    <div class="shimmer-title"></div>
                    <div class="shimmer-description"></div>
                    <div class="shimmer-footer"></div>
                </div>
            </div>
        `).join('');
    }

    handleLoadError() {
        const cardsGrid = document.getElementById('cards-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (cardsGrid) {
            cardsGrid.style.display = 'none';
        }
        
        if (emptyState) {
            emptyState.innerHTML = `
                <div class="error-icon">⚠️</div>
                <h3>Unable to load tools</h3>
                <p>Please check your connection and try again.</p>
                <button onclick="location.reload()" class="retry-btn">Retry</button>
            `;
            emptyState.style.display = 'block';
        }
    }

    setupFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Update current filter
                this.currentFilter = e.target.dataset.category;
                
                // Re-render items with animation
                this.renderItems();
            });
        });
    }

    renderItems() {
        const cardsGrid = document.getElementById('cards-grid');
        const emptyState = document.getElementById('empty-state');
        
        if (!cardsGrid) return;

        // Filter items based on current filter
        const filteredItems = this.currentFilter === 'all' 
            ? this.items 
            : this.items.filter(item => item.category === this.currentFilter);

        // Show/hide empty state with custom message
        if (filteredItems.length === 0) {
            cardsGrid.style.display = 'none';
            if (emptyState) {
                emptyState.innerHTML = `
                    <div class="empty-icon">🔍</div>
                    <h3>No results found in this category yet!</h3>
                    <p>Try selecting a different category or check back later for new content.</p>
                `;
                emptyState.style.display = 'block';
            }
            return;
        } else {
            cardsGrid.style.display = 'grid';
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }

        // Add fade out animation
        cardsGrid.style.opacity = '0';
        
        setTimeout(() => {
            // Render filtered items with staggered animation
            cardsGrid.innerHTML = filteredItems.map((item, index) => 
                this.createItemCard(item, index)
            ).join('');
            
            // Add fade in animation
            cardsGrid.style.opacity = '1';
            
            // Setup click handlers for new cards
            this.setupCardHandlers();
        }, 150);
    }

    createItemCard(item, index) {
        const categoryClass = `category-${item.category}`;
        const animationDelay = `style="animation-delay: ${index * 0.1}s"`;
        
        return `
            <div class="category-card-item" data-item-id="${item.id}" data-item="${item.name}" ${animationDelay}>
                <div class="card-header">
                    <div class="card-icon-title">
                        <span class="card-icon">${item.icon || '🔧'}</span>
                        <div>
                            <h3 class="card-title">${item.name}</h3>
                            <span class="card-category ${categoryClass}">${this.formatCategory(item.category)}</span>
                        </div>
                    </div>
                </div>
                <p class="card-description">${item.description}</p>
                <div class="card-footer">
                    <span class="card-type">${item.type}</span>
                    <button class="card-open-btn">Open</button>
                </div>
            </div>
        `;
    }

    formatCategory(category) {
        return category.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    setupCardHandlers() {
        const cards = document.querySelectorAll('.category-card-item');
        
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('card-open-btn')) {
                    // Handle card click (not button)
                    const itemId = card.dataset.itemId;
                    const itemName = card.dataset.item;
                    console.log('Card clicked:', itemName);
                }
            });
            
            const openBtn = card.querySelector('.card-open-btn');
            if (openBtn) {
                openBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const itemId = card.dataset.itemId;
                    const itemName = card.dataset.item;
                    this.openItem(itemId, itemName);
                });
            }
        });
    }

    openItem(itemId, itemName) {
        // Navigate to tool page with ID parameter
        if (itemId) {
            window.location.href = `tool.html?id=${itemId}`;
        } else {
            // Fallback for items without ID
            console.log('Opening item:', itemName);
            alert(`Opening: ${itemName}\n\nThis would navigate to the tool page or open a modal with the tool interface.`);
        }
    }
}

// Enhanced LifeSolver class to handle category page
class EnhancedLifeSolver extends LifeSolver {
    constructor() {
        super();
        this.categoryPage = null;
    }

    async init() {
        super.init();
        
        // Wait for tools data to load, then initialize category page
        if (this.isCategoryPage()) {
            this.setupCategoryPageNavbar();
            
            // Wait for data to load before initializing category page
            if (this.toolsData) {
                this.categoryPage = new CategoryPage(this.toolsData);
            } else {
                // Wait for data to load
                const checkData = setInterval(() => {
                    if (this.toolsData) {
                        this.categoryPage = new CategoryPage(this.toolsData);
                        clearInterval(checkData);
                    }
                }, 100);
            }
        }
    }

    async loadToolsData() {
        await super.loadToolsData();
        
        // Initialize category page after data loads
        if (this.isCategoryPage() && !this.categoryPage && this.toolsData) {
            this.categoryPage = new CategoryPage(this.toolsData);
        }
    }

    isCategoryPage() {
        return window.location.pathname.includes('category.html');
    }

    setupCategoryPageNavbar() {
        // Ensure navbar scroll effect works on category page
        const navbar = document.getElementById('navbar');
        if (navbar) {
            // Add scrolled class immediately since category page has content at top
            navbar.classList.add('scrolled');
        }
    }
}

// Update initialization to use enhanced class
document.addEventListener('DOMContentLoaded', () => {
    new EnhancedLifeSolver();
});

// Solvee Chat Widget
class SolveeChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.responses = [
            {
                keywords: ["study", "focus", "concentration", "learning"],
                reply: "Try the 25-min Pomodoro method and short breaks — it boosts focus a lot! 🎯"
            },
            {
                keywords: ["relationship", "love", "dating", "communication"],
                reply: "Communication and understanding are key ❤️ be kind, not just right."
            },
            {
                keywords: ["fitness", "energy", "exercise", "workout", "health"],
                reply: "Start your day with stretching + 1 glass of water. It works wonders! 💪"
            },
            {
                keywords: ["career", "job", "work", "interview", "resume"],
                reply: "Keep improving small skills weekly — consistency beats talent. 🚀"
            },
            {
                keywords: ["stress", "anxiety", "overwhelm", "pressure"],
                reply: "Pause, breathe deep 3 times, and remind yourself — it's okay to reset. 🧘"
            },
            {
                keywords: ["life", "help", "advice", "guidance"],
                reply: "I'm here for you 💫 sometimes just starting is all you need."
            },
            {
                keywords: ["money", "finance", "budget", "save", "investment"],
                reply: "Start small with budgeting — track expenses for a week, then set realistic savings goals! 💰"
            },
            {
                keywords: ["motivation", "inspire", "goal", "dream"],
                reply: "Remember: progress over perfection. Every small step counts! ✨"
            },
            {
                keywords: ["time", "productivity", "organize", "schedule"],
                reply: "Time-block your day and tackle the hardest task first — you'll feel unstoppable! ⏰"
            },
            {
                keywords: ["sleep", "tired", "rest", "insomnia"],
                reply: "Good sleep = good life! Try no screens 1 hour before bed and keep your room cool. 😴"
            }
        ];
        
        this.init();
    }

    init() {
        this.loadChatHistory();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const chatClose = document.getElementById('chat-close');
        const sendButton = document.getElementById('send-button');
        const chatInput = document.getElementById('chat-input');

        if (chatButton) {
            chatButton.addEventListener('click', () => this.toggleChat());
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => this.closeChat());
        }

        if (sendButton) {
            sendButton.addEventListener('click', () => this.sendMessage());
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });

            chatInput.addEventListener('input', (e) => {
                const sendBtn = document.getElementById('send-button');
                if (sendBtn) {
                    sendBtn.disabled = !e.target.value.trim();
                }
            });
        }

        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            const chatWidget = document.getElementById('chat-widget');
            if (this.isOpen && chatWidget && !chatWidget.contains(e.target)) {
                this.closeChat();
            }
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        
        if (chatWindow && chatButton) {
            chatWindow.classList.add('active');
            chatButton.style.transform = 'scale(0.8)';
            this.isOpen = true;
            
            // Focus on input after animation
            setTimeout(() => {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) {
                    chatInput.focus();
                }
            }, 300);

            // Add subtle glow effect
            this.addGlowEffect();
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        
        if (chatWindow && chatButton) {
            chatWindow.classList.remove('active');
            chatButton.style.transform = 'scale(1)';
            this.isOpen = false;
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value.trim();
        
        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        chatInput.value = '';
        const sendBtn = document.getElementById('send-button');
        if (sendBtn) sendBtn.disabled = true;

        // Show typing indicator
        this.showTypingIndicator();

        // Generate Solvee's response after delay
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateResponse(message);
            this.addMessage(response, 'solvee');
            this.addGlowEffect();
        }, 1000 + Math.random() * 1000); // 1-2 second delay
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const messageClass = sender === 'user' ? 'user-message' : 'solvee-message';
        
        const messageHTML = `
            <div class="message ${messageClass}">
                ${sender === 'solvee' ? '<div class="message-avatar">🤖</div>' : ''}
                <div class="message-content">
                    <p>${content}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;

        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Store message
        const messageObj = { content, sender, time: Date.now() };
        this.messages.push(messageObj);
        this.saveChatHistory();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for keyword matches
        for (const response of this.responses) {
            if (response.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return response.reply;
            }
        }

        // Default response
        return "I'm still learning about that! Try checking Life Hacks or Guides section 💡";
    }

    showTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            
            // Scroll to bottom
            const messagesContainer = document.getElementById('chat-messages');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
        }
    }

    addGlowEffect() {
        const chatButton = document.getElementById('chat-button');
        if (chatButton && !this.isOpen) {
            chatButton.style.boxShadow = '0 0 20px rgba(135, 206, 235, 0.6)';
            setTimeout(() => {
                chatButton.style.boxShadow = '';
            }, 2000);
        }
    }

    showWelcomeMessage() {
        // Only show welcome message if no chat history
        if (this.messages.length === 0) {
            setTimeout(() => {
                this.addMessage("Hi there! I'm Solvee, your friendly life helper. Ask me about study tips, relationships, fitness, career advice, or anything else! 💫", 'solvee');
            }, 500);
        }
    }

    saveChatHistory() {
        try {
            // Keep only last 5 messages
            const recentMessages = this.messages.slice(-5);
            localStorage.setItem('solvee_chat_history', JSON.stringify(recentMessages));
        } catch (error) {
            console.log('Could not save chat history:', error);
        }
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('solvee_chat_history');
            if (saved) {
                this.messages = JSON.parse(saved);
                
                // Restore messages to UI
                setTimeout(() => {
                    const messagesContainer = document.getElementById('chat-messages');
                    if (messagesContainer && this.messages.length > 0) {
                        // Clear welcome message
                        messagesContainer.innerHTML = '';
                        
                        // Add saved messages
                        this.messages.forEach(msg => {
                            const messageClass = msg.sender === 'user' ? 'user-message' : 'solvee-message';
                            const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            
                            const messageHTML = `
                                <div class="message ${messageClass}">
                                    ${msg.sender === 'solvee' ? '<div class="message-avatar">🤖</div>' : ''}
                                    <div class="message-content">
                                        <p>${msg.content}</p>
                                        <span class="message-time">${time}</span>
                                    </div>
                                </div>
                            `;
                            
                            messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
                        });
                        
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }
                }, 100);
            }
        } catch (error) {
            console.log('Could not load chat history:', error);
            this.messages = [];
        }
    }
}

// Initialize Solvee Chat
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if chat widget exists and not already initialized
    if (document.getElementById('chat-widget') && !window.solveeChat) {
        window.solveeChat = new SolveeChat();
    }
});

// Request Form Functionality
class RequestForm {
    constructor() {
        this.init();
    }

    init() {
        if (this.isRequestPage()) {
            this.setupFormHandlers();
            this.setupAnimations();
        }
    }

    isRequestPage() {
        return window.location.pathname.includes('request.html');
    }

    setupFormHandlers() {
        const form = document.getElementById('request-form');
        const newRequestBtn = document.getElementById('new-request-btn');

        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        if (newRequestBtn) {
            newRequestBtn.addEventListener('click', () => this.showNewRequestForm());
        }

        // Add input validation and styling
        this.setupInputValidation();
    }

    setupInputValidation() {
        const inputs = document.querySelectorAll('.request-form input, .request-form select, .request-form textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity() && value !== '';
        
        if (!isValid) {
            this.showFieldError(field);
        } else {
            this.clearFieldError(field);
        }
        
        return isValid;
    }

    showFieldError(field) {
        field.style.borderColor = '#ef4444';
        field.style.backgroundColor = '#fef2f2';
    }

    clearFieldError(field) {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
    }

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const requestData = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            category: formData.get('category'),
            topic: formData.get('topic').trim(),
            description: formData.get('description').trim(),
            priority: formData.get('priority'),
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now()
        };

        // Validate all fields
        if (!this.validateFormData(requestData)) {
            this.showValidationError();
            return;
        }

        // Save to localStorage
        if (this.saveRequest(requestData)) {
            this.showSuccessMessage();
        } else {
            this.showSaveError();
        }
    }

    validateFormData(data) {
        const requiredFields = ['name', 'email', 'category', 'topic', 'description', 'priority'];
        
        for (const field of requiredFields) {
            if (!data[field] || data[field] === '') {
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }

        return true;
    }

    saveRequest(requestData) {
        try {
            // Get existing requests or initialize empty array
            const existingRequests = JSON.parse(localStorage.getItem('life_solver_requests') || '[]');
            
            // Add new request
            existingRequests.push(requestData);
            
            // Save back to localStorage
            localStorage.setItem('life_solver_requests', JSON.stringify(existingRequests));
            
            console.log('Request saved successfully:', requestData);
            return true;
        } catch (error) {
            console.error('Error saving request:', error);
            return false;
        }
    }

    showSuccessMessage() {
        const formContainer = document.getElementById('request-form-container');
        const successMessage = document.getElementById('success-message');
        
        if (formContainer && successMessage) {
            formContainer.style.display = 'none';
            successMessage.style.display = 'block';
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add confetti effect (optional)
            this.addConfettiEffect();
        }
    }

    showNewRequestForm() {
        const formContainer = document.getElementById('request-form-container');
        const successMessage = document.getElementById('success-message');
        const form = document.getElementById('request-form');
        
        if (formContainer && successMessage && form) {
            // Reset form
            form.reset();
            
            // Clear any field errors
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => this.clearFieldError(input));
            
            // Show form, hide success message
            successMessage.style.display = 'none';
            formContainer.style.display = 'block';
            
            // Scroll to form
            formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    showValidationError() {
        // Create or show validation error message
        let errorMsg = document.querySelector('.validation-error');
        
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'validation-error';
            errorMsg.innerHTML = `
                <div style="background: #fef2f2; border: 2px solid #ef4444; border-radius: 12px; padding: 16px; margin-bottom: 20px; color: #dc2626; text-align: center;">
                    <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
                    Please fill in all required fields correctly.
                </div>
            `;
            
            const form = document.getElementById('request-form');
            if (form) {
                form.insertBefore(errorMsg, form.firstChild);
            }
        }
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            if (errorMsg && errorMsg.parentNode) {
                errorMsg.parentNode.removeChild(errorMsg);
            }
        }, 5000);
    }

    showSaveError() {
        alert('Sorry, there was an error saving your request. Please try again.');
    }

    addConfettiEffect() {
        // Simple confetti effect using emojis
        const emojis = ['🎉', '✨', '💫', '🌟', '💖'];
        const container = document.querySelector('.success-message');
        
        if (!container) return;
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.cssText = `
                    position: absolute;
                    font-size: 1.5rem;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: confettiFall 2s ease-out forwards;
                `;
                
                container.style.position = 'relative';
                container.appendChild(emoji);
                
                // Remove emoji after animation
                setTimeout(() => {
                    if (emoji.parentNode) {
                        emoji.parentNode.removeChild(emoji);
                    }
                }, 2000);
            }, i * 100);
        }
    }

    setupAnimations() {
        // Add staggered animation to form fields
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach((group, index) => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            group.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                group.style.opacity = '1';
                group.style.transform = 'translateY(0)';
            }, 800 + (index * 100));
        });
    }

    // Utility method to get all saved requests (for future admin use)
    getAllRequests() {
        try {
            return JSON.parse(localStorage.getItem('life_solver_requests') || '[]');
        } catch (error) {
            console.error('Error loading requests:', error);
            return [];
        }
    }
}

// Add confetti animation CSS
const confettiCSS = `
@keyframes confettiFall {
    0% {
        transform: translateY(-20px) rotate(0deg);
        opacity: 1;
    }
    100% {
        transform: translateY(100px) rotate(360deg);
        opacity: 0;
    }
}
`;

// Inject confetti CSS
const style = document.createElement('style');
style.textContent = confettiCSS;
document.head.appendChild(style);

// Initialize Request Form
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('request-form')) {
        window.requestForm = new RequestForm();
    }
});

 //Dashboard Functionality
class Dashboard {
    constructor() {
        this.requests = [];
        this.filteredRequests = [];
        this.sortOrder = 'desc'; // desc = newest first, asc = oldest first
        this.filters = {
            category: 'all',
            priority: 'all'
        };
        
        this.init();
    }
    
    init() {
        this.loadRequests();
        this.calculateStats();
        this.setupEventListeners();
        this.renderTable();
        this.renderMobileCards();
    }
    
    loadRequests() {
        try {
            const stored = localStorage.getItem('life_solver_requests');
            this.requests = stored ? JSON.parse(stored) : [];
            this.filteredRequests = [...this.requests];
        } catch (error) {
            console.error('Error loading requests:', error);
            this.requests = [];
            this.filteredRequests = [];
        }
    }
    
    calculateStats() {
        const totalRequests = this.requests.length;
        const urgentRequests = this.requests.filter(req => req.priority === 'Urgent').length;
        const aiToolRequests = this.requests.filter(req => req.category === 'AI Tool').length;
        
        // Calculate requests from this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentRequests = this.requests.filter(req => {
            const requestDate = new Date(req.date);
            return requestDate >= oneWeekAgo;
        }).length;
        
        // Update stat displays with animation
        this.animateCounter('total-requests', totalRequests);
        this.animateCounter('urgent-requests', urgentRequests);
        this.animateCounter('ai-tool-requests', aiToolRequests);
        this.animateCounter('recent-requests', recentRequests);
    }
    
    animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const startValue = 0;
        const duration = 1000;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    setupEventListeners() {
        // Filter event listeners
        const categoryFilter = document.getElementById('category-filter');
        const priorityFilter = document.getElementById('priority-filter');
        const sortToggle = document.getElementById('sort-toggle');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.filters.category = e.target.value;
                this.applyFilters();
            });
        }
        
        if (priorityFilter) {
            priorityFilter.addEventListener('change', (e) => {
                this.filters.priority = e.target.value;
                this.applyFilters();
            });
        }
        
        if (sortToggle) {
            sortToggle.addEventListener('click', () => {
                this.toggleSort();
            });
        }
        
        // Action button listeners
        const downloadBtn = document.getElementById('download-csv');
        const clearBtn = document.getElementById('clear-all');
        
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCSV();
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllRequests();
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.requests];
        
        // Apply category filter
        if (this.filters.category !== 'all') {
            filtered = filtered.filter(req => req.category === this.filters.category);
        }
        
        // Apply priority filter
        if (this.filters.priority !== 'all') {
            filtered = filtered.filter(req => req.priority === this.filters.priority);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return this.sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        
        this.filteredRequests = filtered;
        
        // Animate the update
        this.fadeAndUpdate();
    }
    
    fadeAndUpdate() {
        const tableContainer = document.getElementById('table-container');
        const cardsContainer = document.getElementById('cards-container');
        
        // Fade out
        if (tableContainer) tableContainer.style.opacity = '0.5';
        if (cardsContainer) cardsContainer.style.opacity = '0.5';
        
        setTimeout(() => {
            this.renderTable();
            this.renderMobileCards();
            
            // Fade in
            if (tableContainer) tableContainer.style.opacity = '1';
            if (cardsContainer) cardsContainer.style.opacity = '1';
        }, 150);
    }
    
    toggleSort() {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        
        const sortToggle = document.getElementById('sort-toggle');
        const icon = sortToggle.querySelector('i');
        const text = sortToggle.querySelector('span');
        
        if (this.sortOrder === 'desc') {
            icon.className = 'fas fa-sort-amount-down';
            text.textContent = 'Newest First';
        } else {
            icon.className = 'fas fa-sort-amount-up';
            text.textContent = 'Oldest First';
        }
        
        this.applyFilters();
    }
    
    renderTable() {
        const tableBody = document.getElementById('table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (!tableBody || !emptyState) return;
        
        if (this.filteredRequests.length === 0) {
            tableBody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tableBody.innerHTML = this.filteredRequests.map(request => `
            <tr>
                <td>${this.escapeHtml(request.name)}</td>
                <td>${this.escapeHtml(request.email)}</td>
                <td>
                    <span class="category-badge category-${this.getCategoryClass(request.category)}">
                        ${this.getCategoryIcon(request.category)} ${request.category}
                    </span>
                </td>
                <td>${this.escapeHtml(request.topic)}</td>
                <td class="description-cell" title="${this.escapeHtml(request.description)}">
                    ${this.escapeHtml(request.description)}
                </td>
                <td>
                    <span class="priority-badge priority-${this.getPriorityClass(request.priority)}">
                        ${this.getPriorityIcon(request.priority)} ${request.priority}
                    </span>
                </td>
                <td>${this.formatDate(request.date)}</td>
            </tr>
        `).join('');
    }
    
    renderMobileCards() {
        const cardsContainer = document.getElementById('cards-container');
        if (!cardsContainer) return;
        
        if (this.filteredRequests.length === 0) {
            cardsContainer.innerHTML = '';
            return;
        }
        
        cardsContainer.innerHTML = this.filteredRequests.map(request => `
            <div class="request-card">
                <div class="card-header">
                    <div>
                        <div class="card-name">${this.escapeHtml(request.name)}</div>
                        <div class="card-email">${this.escapeHtml(request.email)}</div>
                    </div>
                    <span class="category-badge category-${this.getCategoryClass(request.category)}">
                        ${this.getCategoryIcon(request.category)} ${request.category}
                    </span>
                </div>
                <div class="card-topic">${this.escapeHtml(request.topic)}</div>
                <div class="card-description">${this.escapeHtml(request.description)}</div>
                <div class="card-footer">
                    <span class="priority-badge priority-${this.getPriorityClass(request.priority)}">
                        ${this.getPriorityIcon(request.priority)} ${request.priority}
                    </span>
                    <span class="card-date">${this.formatDate(request.date)}</span>
                </div>
            </div>
        `).join('');
    }
    
    getCategoryClass(category) {
        return category.toLowerCase().replace(' ', '-');
    }
    
    getCategoryIcon(category) {
        const icons = {
            'AI Tool': '🤖',
            'Life Hack': '💡',
            'Short Guide': '📘'
        };
        return icons[category] || '📄';
    }
    
    getPriorityClass(priority) {
        return priority.toLowerCase().replace(' ', '-');
    }
    
    getPriorityIcon(priority) {
        const icons = {
            'Urgent': '🚨',
            'Normal': '📅',
            'Future Idea': '💭'
        };
        return icons[priority] || '📋';
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    downloadCSV() {
        if (this.filteredRequests.length === 0) {
            alert('No data to export');
            return;
        }
        
        const headers = ['Name', 'Email', 'Category', 'Topic', 'Description', 'Priority', 'Date'];
        const csvContent = [
            headers.join(','),
            ...this.filteredRequests.map(request => [
                `"${request.name.replace(/"/g, '""')}"`,
                `"${request.email.replace(/"/g, '""')}"`,
                `"${request.category.replace(/"/g, '""')}"`,
                `"${request.topic.replace(/"/g, '""')}"`,
                `"${request.description.replace(/"/g, '""')}"`,
                `"${request.priority.replace(/"/g, '""')}"`,
                `"${request.date}"`
            ].join(','))
        ].join('\\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `life-solver-requests-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    
    clearAllRequests() {
        if (this.requests.length === 0) {
            alert('No requests to clear');
            return;
        }
        
        const confirmed = confirm(`Are you sure you want to delete all ${this.requests.length} requests? This action cannot be undone.`);
        
        if (confirmed) {
            localStorage.removeItem('life_solver_requests');
            this.requests = [];
            this.filteredRequests = [];
            this.calculateStats();
            this.renderTable();
            this.renderMobileCards();
            
            // Show success message
            const emptyState = document.getElementById('empty-state');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
        }
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        // Initialize dashboard after authentication
        window.dashboardInstance = null;
    }
});

// Admin Access Control
class AdminAuth {
    constructor() {
        this.correctPasscode = 'solvee2025';
        this.sessionKey = 'adminAuthenticated';
        this.sessionDuration = 60 * 60 * 1000; // 1 hour in milliseconds
        
        this.init();
    }
    
    init() {
        // Check if we're on dashboard page
        if (!window.location.pathname.includes('dashboard.html')) {
            return;
        }
        
        // Check if already authenticated
        if (this.isAuthenticated()) {
            this.grantAccess();
        } else {
            this.showAuthModal();
        }
        
        this.setupEventListeners();
    }
    
    isAuthenticated() {
        const authData = localStorage.getItem(this.sessionKey);
        if (!authData) return false;
        
        try {
            const { timestamp } = JSON.parse(authData);
            const now = Date.now();
            
            // Check if session is still valid (within 1 hour)
            return (now - timestamp) < this.sessionDuration;
        } catch (error) {
            return false;
        }
    }
    
    showAuthModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.style.display = 'flex';
            
            // Focus on passcode input
            const passcodeInput = document.getElementById('admin-passcode');
            if (passcodeInput) {
                setTimeout(() => passcodeInput.focus(), 100);
            }
        }
    }
    
    hideAuthModal() {
        const modal = document.getElementById('admin-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    setupEventListeners() {
        const accessBtn = document.getElementById('access-btn');
        const cancelBtn = document.getElementById('cancel-btn');
        const passcodeInput = document.getElementById('admin-passcode');
        
        if (accessBtn) {
            accessBtn.addEventListener('click', () => {
                this.verifyPasscode();
            });
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.redirectToHome();
            });
        }
        
        if (passcodeInput) {
            passcodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.verifyPasscode();
                }
            });
            
            // Clear any error styling on input
            passcodeInput.addEventListener('input', () => {
                passcodeInput.style.borderColor = '';
                passcodeInput.style.backgroundColor = '';
            });
        }
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('admin-modal');
                if (modal && modal.style.display === 'flex') {
                    this.redirectToHome();
                }
            }
        });
    }
    
    verifyPasscode() {
        const passcodeInput = document.getElementById('admin-passcode');
        if (!passcodeInput) return;
        
        const enteredPasscode = passcodeInput.value.trim();
        
        if (enteredPasscode === this.correctPasscode) {
            this.authenticateUser();
            this.grantAccess();
        } else {
            this.showError();
        }
    }
    
    authenticateUser() {
        const authData = {
            timestamp: Date.now(),
            authenticated: true
        };
        
        localStorage.setItem(this.sessionKey, JSON.stringify(authData));
    }
    
    grantAccess() {
        this.hideAuthModal();
        
        // Initialize dashboard
        if (!window.dashboardInstance) {
            window.dashboardInstance = new Dashboard();
        }
        
        // Show success message briefly
        this.showAccessGranted();
    }
    
    showError() {
        const passcodeInput = document.getElementById('admin-passcode');
        if (passcodeInput) {
            passcodeInput.style.borderColor = '#dc2626';
            passcodeInput.style.backgroundColor = '#fef2f2';
            passcodeInput.value = '';
            passcodeInput.placeholder = 'Incorrect passcode - try again';
            
            // Shake animation
            passcodeInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                passcodeInput.style.animation = '';
                passcodeInput.placeholder = 'Enter passcode';
            }, 500);
        }
    }
    
    showAccessGranted() {
        // Create temporary success message
        const successMsg = document.createElement('div');
        successMsg.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                font-weight: 600;
                animation: slideInRight 0.3s ease-out;
            ">
                ✅ Access Granted - Welcome to Dashboard
            </div>
        `;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            if (successMsg.parentNode) {
                successMsg.parentNode.removeChild(successMsg);
            }
        }, 3000);
    }
    
    redirectToHome() {
        window.location.href = '../index.html';
    }
    
    logout() {
        localStorage.removeItem(this.sessionKey);
        this.redirectToHome();
    }
}

// Add shake animation CSS
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
`;

// Inject shake animation CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = shakeCSS;
document.head.appendChild(styleSheet);

// Initialize admin authentication when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('dashboard.html')) {
        window.adminAuth = new AdminAuth();
        
        // Add sample data if no requests exist (for testing)
        addSampleDataIfEmpty();
    }
});

// Function to add sample data for testing the dashboard
function addSampleDataIfEmpty() {
    try {
        const existing = localStorage.getItem('life_solver_requests');
        if (!existing || JSON.parse(existing).length === 0) {
            const sampleRequests = [
                {
                    name: "Aisha Khan",
                    email: "aisha@email.com",
                    category: "AI Tool",
                    topic: "Focus Tracker",
                    description: "Tool to track study focus and breaks automatically using AI.",
                    priority: "Urgent",
                    date: "2025-11-01",
                    timestamp: Date.now() - 86400000 // 1 day ago
                },
                {
                    name: "Marcus Johnson",
                    email: "marcus.j@gmail.com",
                    category: "Life Hack",
                    topic: "Morning Routine Optimizer",
                    description: "Quick tips to optimize morning routine for better productivity.",
                    priority: "Normal",
                    date: "2025-11-02",
                    timestamp: Date.now() - 43200000 // 12 hours ago
                },
                {
                    name: "Sofia Rodriguez",
                    email: "sofia.r@outlook.com",
                    category: "Short Guide",
                    topic: "Interview Confidence Guide",
                    description: "Step-by-step guide to build confidence before job interviews.",
                    priority: "Normal",
                    date: "2025-11-03",
                    timestamp: Date.now() - 21600000 // 6 hours ago
                },
                {
                    name: "David Chen",
                    email: "d.chen@company.com",
                    category: "AI Tool",
                    topic: "Budget Analyzer",
                    description: "AI tool to analyze spending patterns and suggest improvements.",
                    priority: "Future Idea",
                    date: "2025-10-28",
                    timestamp: Date.now() - 432000000 // 5 days ago
                },
                {
                    name: "Emma Thompson",
                    email: "emma.t@university.edu",
                    category: "Life Hack",
                    topic: "Study Space Setup",
                    description: "How to create the perfect study environment at home.",
                    priority: "Urgent",
                    date: "2025-11-03",
                    timestamp: Date.now() - 7200000 // 2 hours ago
                }
            ];
            
            localStorage.setItem('life_solver_requests', JSON.stringify(sampleRequests));
            console.log('Sample dashboard data added for testing');
        }
    } catch (error) {
        console.log('Could not add sample data:', error);
    }
}

// Enhanced Data Management Features
class DataManager {
    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#dc2626' : '#f59e0b';
        const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️';
        
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${bgColor};
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10001;
                font-weight: 600;
                animation: slideInRight 0.3s ease-out;
                max-width: 300px;
            ">
                ${icon} ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    static validateData(requests) {
        if (!Array.isArray(requests)) {
            throw new Error('Invalid data format');
        }
        
        const requiredFields = ['name', 'email', 'category', 'topic', 'description', 'priority', 'date'];
        
        for (let i = 0; i < requests.length; i++) {
            const request = requests[i];
            for (const field of requiredFields) {
                if (!request.hasOwnProperty(field)) {
                    throw new Error(`Missing field '${field}' in request ${i + 1}`);
                }
            }
        }
        
        return true;
    }
}

// Add slide out animation
const additionalCSS = `
@keyframes slideOutRight {
    from {
        opacity: 1;
        transform: translateX(0);
    }
    to {
        opacity: 0;
        transform: translateX(100px);
    }
}
`;

// Inject additional CSS
const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalCSS;
document.head.appendChild(additionalStyleSheet);

// Enhance the existing Dashboard class methods
if (typeof Dashboard !== 'undefined') {
    // Override the downloadCSV method with enhanced functionality
    Dashboard.prototype.downloadCSV = function() {
        try {
            if (this.filteredRequests.length === 0) {
                DataManager.showNotification('No data to export', 'warning');
                return;
            }
            
            // Validate data before export
            DataManager.validateData(this.filteredRequests);
            
            const headers = ['Name', 'Email', 'Category', 'Topic', 'Description', 'Priority', 'Date'];
            const csvContent = [
                headers.join(','),
                ...this.filteredRequests.map(request => [
                    `"${request.name.replace(/"/g, '""')}"`,
                    `"${request.email.replace(/"/g, '""')}"`,
                    `"${request.category.replace(/"/g, '""')}"`,
                    `"${request.topic.replace(/"/g, '""')}"`,
                    `"${request.description.replace(/"/g, '""')}"`,
                    `"${request.priority.replace(/"/g, '""')}"`,
                    `"${request.date}"`
                ].join(','))
            ].join('\\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const fileSize = DataManager.formatFileSize(blob.size);
            
            const link = document.createElement('a');
            
            if (link.download !== undefined) {
                const url = URL.createObjectURL(blob);
                const fileName = `life-solver-requests-${new Date().toISOString().split('T')[0]}.csv`;
                
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Clean up the URL object
                setTimeout(() => URL.revokeObjectURL(url), 100);
                
                DataManager.showNotification(`Exported ${this.filteredRequests.length} requests (${fileSize})`, 'success');
            } else {
                throw new Error('Download not supported in this browser');
            }
        } catch (error) {
            console.error('Export error:', error);
            DataManager.showNotification('Export failed: ' + error.message, 'error');
        }
    };
    
    // Override the clearAllRequests method with enhanced functionality
    Dashboard.prototype.clearAllRequests = function() {
        try {
            if (this.requests.length === 0) {
                DataManager.showNotification('No requests to clear', 'warning');
                return;
            }
            
            const requestCount = this.requests.length;
            
            // Create custom confirmation dialog
            const confirmDialog = document.createElement('div');
            confirmDialog.innerHTML = `
                <div style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10002;
                    backdrop-filter: blur(5px);
                ">
                    <div style="
                        background: white;
                        border-radius: 12px;
                        padding: 2rem;
                        max-width: 400px;
                        width: 90%;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                        animation: modalSlideIn 0.3s ease-out;
                    ">
                        <div style="text-align: center; margin-bottom: 1.5rem;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">🗑️</div>
                            <h3 style="margin: 0 0 0.5rem 0; color: #dc2626; font-size: 1.25rem;">Delete All Requests</h3>
                            <p style="margin: 0; color: #6b7280;">
                                Are you sure you want to delete all <strong>${requestCount}</strong> requests?<br>
                                <span style="color: #dc2626; font-weight: 600;">This action cannot be undone.</span>
                            </p>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <button id="confirm-delete" style="
                                flex: 1;
                                padding: 12px 20px;
                                background: #dc2626;
                                color: white;
                                border: none;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">Delete All</button>
                            <button id="cancel-delete" style="
                                flex: 1;
                                padding: 12px 20px;
                                background: #f1f5f9;
                                color: #374151;
                                border: none;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s;
                            ">Cancel</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmDialog);
            
            // Add event listeners
            const confirmBtn = confirmDialog.querySelector('#confirm-delete');
            const cancelBtn = confirmDialog.querySelector('#cancel-delete');
            
            const cleanup = () => {
                if (confirmDialog.parentNode) {
                    confirmDialog.parentNode.removeChild(confirmDialog);
                }
            };
            
            confirmBtn.addEventListener('click', () => {
                try {
                    localStorage.removeItem('life_solver_requests');
                    this.requests = [];
                    this.filteredRequests = [];
                    this.calculateStats();
                    this.renderTable();
                    this.renderMobileCards();
                    
                    DataManager.showNotification(`Successfully deleted ${requestCount} requests`, 'success');
                } catch (error) {
                    DataManager.showNotification('Failed to clear requests: ' + error.message, 'error');
                }
                cleanup();
            });
            
            cancelBtn.addEventListener('click', cleanup);
            
            // Close on escape key
            const escapeHandler = (e) => {
                if (e.key === 'Escape') {
                    cleanup();
                    document.removeEventListener('keydown', escapeHandler);
                }
            };
            document.addEventListener('keydown', escapeHandler);
            
        } catch (error) {
            console.error('Clear requests error:', error);
            DataManager.showNotification('Failed to clear requests: ' + error.message, 'error');
        }
    };
}
// End of main.js file