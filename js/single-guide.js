// Single Guide Page Dynamic Functionality

// Guide data structure
const guideData = {
    'winning-resume-2024': {
        category: 'Career',
        title: 'How to Build a Winning Resume in 2024',
        intro: 'A comprehensive guide to creating a resume that gets you noticed by recruiters and lands you interviews',
        author: 'Sarah Johnson',
        readTime: '8 min read',
        date: 'January 15, 2024',
        content: `
            <h2>Why Your Resume Matters More Than Ever</h2>
            <p>In today's competitive job market, your resume is often your first and only chance to make an impression. With recruiters spending an average of 6-7 seconds on initial resume reviews, every word counts.</p>
            
            <div class="highlight-box">
                <p><strong>💡 Did you know?</strong> 75% of resumes never make it past Applicant Tracking Systems (ATS). This guide will help you beat the odds.</p>
            </div>

            <h2>The Essential Components of a Modern Resume</h2>
            <p>A winning resume in 2024 needs to balance traditional professionalism with modern design sensibilities. Here are the must-have sections:</p>
            
            <h3>1. Contact Information</h3>
            <p>Keep it simple and professional:</p>
            <ul>
                <li>Full name (larger font, bold)</li>
                <li>Phone number</li>
                <li>Professional email address</li>
                <li>LinkedIn profile URL</li>
                <li>Location (city and state only)</li>
            </ul>

            <h3>2. Professional Summary</h3>
            <p>Replace the outdated "objective statement" with a powerful 2-3 sentence summary that highlights:</p>
            <ul>
                <li>Your current role or expertise</li>
                <li>Years of experience</li>
                <li>Key achievements or specializations</li>
                <li>What you're looking for</li>
            </ul>

            <div class="quote-box">
                <p>"Your professional summary is your elevator pitch. Make every word count and focus on what makes you unique in your field."</p>
            </div>

            <h3>3. Work Experience</h3>
            <p>This is the heart of your resume. For each position, include:</p>
            <ol>
                <li>Job title and company name</li>
                <li>Employment dates (month and year)</li>
                <li>3-5 bullet points describing achievements</li>
                <li>Quantifiable results whenever possible</li>
            </ol>

            <hr class="article-divider">

            <h2>The Power of Action Verbs and Metrics</h2>
            <p>Transform weak bullet points into powerful statements by using strong action verbs and including specific metrics.</p>

            <p><strong>Weak:</strong> Responsible for managing social media accounts</p>
            <p><strong>Strong:</strong> Increased social media engagement by 150% across 5 platforms, growing follower base from 10K to 45K in 6 months</p>

            <div class="highlight-box">
                <p><strong>Pro Tip:</strong> Use the CAR method (Challenge, Action, Result) to structure your bullet points for maximum impact.</p>
            </div>

            <h2>Optimizing for Applicant Tracking Systems</h2>
            <p>Even the best-written resume won't help if it never reaches human eyes. Here's how to make your resume ATS-friendly:</p>
            <ul>
                <li>Use standard section headings (Work Experience, Education, Skills)</li>
                <li>Include relevant keywords from the job description</li>
                <li>Avoid tables, text boxes, and complex formatting</li>
                <li>Save as a .docx or PDF (check job posting requirements)</li>
                <li>Use standard fonts like Arial, Calibri, or Times New Roman</li>
            </ul>

            <h3>Skills Section Strategy</h3>
            <p>Create a balanced skills section that includes:</p>
            <ul>
                <li>Technical skills relevant to your field</li>
                <li>Software and tools you're proficient in</li>
                <li>Soft skills that match the job requirements</li>
                <li>Certifications and licenses</li>
            </ul>

            <hr class="article-divider">

            <h2>Design and Formatting Best Practices</h2>
            <p>Your resume's visual appeal matters, but clarity should always come first:</p>
            <ul>
                <li>Keep it to 1-2 pages (1 page for <10 years experience)</li>
                <li>Use consistent formatting throughout</li>
                <li>Maintain 0.5-1 inch margins</li>
                <li>Use 10-12 point font for body text</li>
                <li>Include plenty of white space</li>
                <li>Use bold and italics sparingly for emphasis</li>
            </ul>

            <div class="key-takeaways">
                <h3>Key Takeaways</h3>
                <ul>
                    <li>Tailor your resume to each job application using keywords from the job description</li>
                    <li>Focus on achievements and results, not just responsibilities</li>
                    <li>Keep formatting clean and ATS-friendly</li>
                    <li>Quantify your accomplishments with specific numbers and metrics</li>
                    <li>Proofread multiple times and have others review it</li>
                </ul>
            </div>

            <h2>Common Resume Mistakes to Avoid</h2>
            <p>Even experienced professionals make these errors:</p>
            <ol>
                <li><strong>Typos and grammatical errors</strong> - These are instant red flags</li>
                <li><strong>Using personal pronouns</strong> - Avoid "I," "me," "my"</li>
                <li><strong>Including irrelevant information</strong> - Keep it focused on the job</li>
                <li><strong>Lying or exaggerating</strong> - Always be truthful</li>
                <li><strong>Using an unprofessional email</strong> - Create a simple firstname.lastname@email.com</li>
                <li><strong>Listing references on the resume</strong> - Save space, provide when asked</li>
            </ol>

            <div class="action-steps">
                <h3>Action Steps You Can Apply Today</h3>
                <ol>
                    <li>Review your current resume and identify 3 bullet points that need stronger action verbs and metrics</li>
                    <li>Research 10-15 keywords from your target job descriptions and incorporate them naturally</li>
                    <li>Rewrite your professional summary to focus on your unique value proposition</li>
                    <li>Remove any outdated information (jobs from 15+ years ago, old technologies)</li>
                    <li>Ask 2-3 trusted colleagues or mentors to review your updated resume</li>
                </ol>
            </div>

            <h2>Final Thoughts</h2>
            <p>Building a winning resume is an ongoing process, not a one-time task. As you gain new experiences and skills, update your resume regularly. Keep multiple versions tailored to different types of positions you're interested in.</p>
            
            <p>Remember, your resume is a marketing document designed to get you an interview, not to tell your entire life story. Focus on what's most relevant and impressive, and let your personality shine through in the interview.</p>

            <div class="highlight-box">
                <p><strong>Next Steps:</strong> Once your resume is polished, complement it with a strong cover letter and optimized LinkedIn profile for maximum impact.</p>
            </div>
        `
    },
    'master-time-management': {
        category: 'Productivity',
        title: 'Master Time Management: The Ultimate Guide',
        intro: 'Learn proven strategies to take control of your time and boost your productivity',
        author: 'Michael Chen',
        readTime: '6 min read',
        date: 'January 10, 2024',
        content: `
            <h2>Understanding Time Management</h2>
            <p>Time management isn't about doing more things—it's about doing the right things. This guide will help you prioritize effectively and make the most of every day.</p>
            
            <div class="highlight-box">
                <p><strong>💡 Key Insight:</strong> The most productive people don't work harder; they work smarter by focusing on high-impact activities.</p>
            </div>

            <h2>The 80/20 Rule (Pareto Principle)</h2>
            <p>80% of your results come from 20% of your efforts. Identify and focus on that critical 20%.</p>
        `
    }
};

// Get guide ID from URL parameter
function getGuideIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('guide') || 'winning-resume-2024';
}

// Load guide data and update page
function loadGuideData() {
    const guideId = getGuideIdFromURL();
    const guide = guideData[guideId] || guideData['winning-resume-2024'];
    
    // Update meta information
    document.getElementById('guideCategory').textContent = guide.category;
    document.getElementById('guideTitle').textContent = guide.title;
    document.getElementById('guideIntro').textContent = guide.intro;
    document.getElementById('guideAuthor').textContent = guide.author;
    document.getElementById('guideReadTime').textContent = guide.readTime;
    document.getElementById('guideDate').textContent = guide.date;
    
    // Update page title and meta
    document.title = `${guide.title} - All-in-One Life Problem Solver`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', guide.intro);
    }
    
    // Load article content
    document.getElementById('articleContent').innerHTML = guide.content;
    
    // Load recommended guides
    loadRecommendedGuides(guide.category, guideId);
}

// Load recommended guides
function loadRecommendedGuides(category, currentGuideId) {
    const recommendedGuides = [
        {
            id: 'cover-letter-mastery',
            icon: '✉️',
            category: 'Career',
            title: 'Cover Letter Mastery: Stand Out from the Crowd',
            summary: 'Learn how to write compelling cover letters that complement your resume and capture attention.',
            thumbnail: '✉️'
        },
        {
            id: 'interview-success',
            icon: '🎤',
            category: 'Career',
            title: 'Interview Success: Ace Any Job Interview',
            summary: 'Master the art of interviewing with proven strategies and practice techniques.',
            thumbnail: '🎤'
        },
        {
            id: 'linkedin-optimization',
            icon: '💼',
            category: 'Career',
            title: 'LinkedIn Profile Optimization Guide',
            summary: 'Transform your LinkedIn profile into a powerful personal branding tool.',
            thumbnail: '💼'
        },
        {
            id: 'master-time-management',
            icon: '⏰',
            category: 'Productivity',
            title: 'Master Time Management: The Ultimate Guide',
            summary: 'Learn proven strategies to take control of your time and boost productivity.',
            thumbnail: '⏰'
        }
    ];
    
    // Filter out current guide and limit to 3-4 guides
    const filtered = recommendedGuides.filter(g => g.id !== currentGuideId).slice(0, 4);
    const grid = document.getElementById('recommendedGuidesGrid');
    
    grid.innerHTML = filtered.map(guide => `
        <div class="guide-card">
            <div class="guide-thumbnail">${guide.thumbnail}</div>
            <div class="guide-card-content">
                <span class="guide-card-category">${guide.category}</span>
                <h3 class="guide-card-title">${guide.title}</h3>
                <p class="guide-card-summary">${guide.summary}</p>
                <button class="read-guide-btn" onclick="openGuide('${guide.id}')">Read Guide</button>
            </div>
        </div>
    `).join('');
}

// Open guide function
function openGuide(guideId) {
    window.location.href = `single-guide.html?guide=${guideId}`;
}

// Smooth scroll for internal links
function initSmoothScroll() {
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
}

// Add reading progress indicator
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(to right, #667eea, #764ba2);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadGuideData();
    initSmoothScroll();
    initReadingProgress();
});
