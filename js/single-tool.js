// Single Tool Page Dynamic Functionality

// Tool data structure (can be loaded from tools.json or URL params)
const toolData = {
    'resume-analyzer': {
        icon: '📝',
        category: 'Career',
        title: 'Resume Analyzer',
        description: 'Get instant feedback on your resume and improve your chances of landing your dream job',
        instructions: '📋 Paste your resume text below to get detailed analysis and improvement suggestions',
        placeholder: 'Paste your resume text here...',
        helpList: [
            'Analyzes resume structure and content',
            'Identifies missing key sections',
            'Suggests improvements for ATS optimization',
            'Provides actionable feedback'
        ],
        practicesList: [
            'Include all relevant work experience',
            'Use action verbs and quantifiable achievements',
            'Keep formatting clean and consistent',
            'Tailor resume to job description'
        ],
        mistakesList: [
            'Using generic objective statements',
            'Including irrelevant information',
            'Poor formatting and typos',
            'Making resume too long or too short'
        ]
    },
    'cover-letter': {
        icon: '✉️',
        category: 'Career',
        title: 'Cover Letter Generator',
        description: 'Create compelling cover letters that get you noticed by employers',
        instructions: '📋 Enter job details and your background to generate a professional cover letter',
        placeholder: 'Enter job title, company name, and your key qualifications...',
        helpList: [
            'Generates personalized cover letters',
            'Matches your skills to job requirements',
            'Uses professional language and tone',
            'Saves time on applications'
        ],
        practicesList: [
            'Research the company beforehand',
            'Highlight relevant achievements',
            'Show enthusiasm for the role',
            'Keep it concise (3-4 paragraphs)'
        ],
        mistakesList: [
            'Using generic templates',
            'Repeating resume content',
            'Being too formal or too casual',
            'Forgetting to customize for each job'
        ]
    }
};

// Get tool ID from URL parameter
function getToolIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tool') || 'resume-analyzer';
}

// Load tool data and update page
function loadToolData() {
    const toolId = getToolIdFromURL();
    const tool = toolData[toolId] || toolData['resume-analyzer'];
    
    // Update header
    document.getElementById('toolIcon').textContent = tool.icon;
    document.getElementById('toolCategory').textContent = tool.category;
    document.getElementById('toolTitle').textContent = tool.title;
    document.getElementById('toolDescription').textContent = tool.description;
    document.title = `${tool.title} - All-in-One Life Problem Solver`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', tool.description);
    }
    
    // Update input section
    document.getElementById('inputInstructions').innerHTML = `<p>${tool.instructions}</p>`;
    document.getElementById('mainInput').placeholder = tool.placeholder;
    
    // Update tips section
    updateList('helpList', tool.helpList);
    updateList('practicesList', tool.practicesList);
    updateList('mistakesList', tool.mistakesList);
    
    // Load related tools
    loadRelatedTools(tool.category, toolId);
}

// Update list items
function updateList(elementId, items) {
    const list = document.getElementById(elementId);
    if (list && items) {
        list.innerHTML = items.map(item => `<li>${item}</li>`).join('');
    }
}

// Load related tools from the same category
function loadRelatedTools(category, currentToolId) {
    const relatedTools = [
        { id: 'cover-letter', icon: '✉️', name: 'Cover Letter Generator', desc: 'Create professional cover letters instantly', category: 'Career' },
        { id: 'interview-prep', icon: '🎤', name: 'Interview Prep Assistant', desc: 'Practice common interview questions', category: 'Career' },
        { id: 'salary-negotiation', icon: '💰', name: 'Salary Negotiation Guide', desc: 'Get tips for negotiating better pay', category: 'Career' },
        { id: 'linkedin-optimizer', icon: '💼', name: 'LinkedIn Profile Optimizer', desc: 'Improve your LinkedIn presence', category: 'Career' }
    ];
    
    const filtered = relatedTools.filter(tool => tool.id !== currentToolId).slice(0, 4);
    const grid = document.getElementById('relatedToolsGrid');
    
    grid.innerHTML = filtered.map(tool => `
        <div class="related-tool-card">
            <div class="related-tool-icon">${tool.icon}</div>
            <h3 class="related-tool-name">${tool.name}</h3>
            <p class="related-tool-desc">${tool.desc}</p>
            <button class="open-tool-btn" onclick="openTool('${tool.id}')">Open Tool</button>
        </div>
    `).join('');
}

// Open tool function
function openTool(toolId) {
    window.location.href = `single-tool.html?tool=${toolId}`;
}

// FAQ accordion functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Generate result functionality (demo)
function initGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');
    const mainInput = document.getElementById('mainInput');
    const outputPlaceholder = document.getElementById('outputPlaceholder');
    const outputContent = document.getElementById('outputContent');
    
    generateBtn.addEventListener('click', () => {
        const inputValue = mainInput.value.trim();
        
        if (!inputValue) {
            alert('Please enter some content first!');
            return;
        }
        
        // Show loading state
        generateBtn.classList.add('loading');
        generateBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Hide placeholder, show output
            outputPlaceholder.style.display = 'none';
            outputContent.style.display = 'block';
            
            // Generate demo output
            const demoOutput = generateDemoOutput(inputValue);
            outputContent.innerHTML = demoOutput;
            
            // Remove loading state
            generateBtn.classList.remove('loading');
            generateBtn.disabled = false;
            
            // Smooth scroll to output
            outputContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 2000);
    });
}

// Generate demo output based on input
function generateDemoOutput(input) {
    const wordCount = input.split(/\s+/).length;
    
    return `
        <h3 style="color: #667eea; margin-bottom: 15px;">✅ Analysis Complete</h3>
        
        <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">📊 Overview</h4>
            <p><strong>Word Count:</strong> ${wordCount} words</p>
            <p><strong>Character Count:</strong> ${input.length} characters</p>
            <p><strong>Overall Score:</strong> <span style="color: #48bb78; font-weight: bold;">8.5/10</span></p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">💪 Strengths</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Clear and concise content</li>
                <li>Good structure and organization</li>
                <li>Professional tone maintained</li>
            </ul>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="margin-bottom: 10px;">🔧 Areas for Improvement</h4>
            <ul style="margin: 0; padding-left: 20px;">
                <li>Consider adding more specific examples</li>
                <li>Include quantifiable achievements</li>
                <li>Enhance with action-oriented language</li>
            </ul>
        </div>
        
        <div style="background: #f0f4ff; padding: 20px; border-radius: 12px; border-left: 4px solid #667eea;">
            <h4 style="margin-bottom: 10px;">💡 Recommendations</h4>
            <p style="margin: 0;">This is a demo output. In the full version, you'll receive detailed AI-powered analysis with specific suggestions tailored to your content.</p>
        </div>
    `;
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadToolData();
    initFAQ();
    initGenerateButton();
});
