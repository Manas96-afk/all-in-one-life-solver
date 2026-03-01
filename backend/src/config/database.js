/**
 * Database Configuration
 * Currently using in-memory storage, ready for MongoDB integration
 */

const logger = require('../utils/logger');

// In-memory storage for development (will be replaced with MongoDB)
const memoryStorage = {
  tools: [],
  guides: [],
  categories: [],
  contacts: [],
  
  // Initialize with dummy data
  init() {
    this.loadDummyData();
    logger.info('Memory storage initialized with dummy data');
  },
  
  // Load dummy data
  loadDummyData() {
    // Tools data
    this.tools = [
      {
        id: "life-advisor",
        name: "Life Advisor",
        description: "Get quick, thoughtful suggestions for any life situation",
        icon: "🧭",
        category: "Life",
        url: "tools/life-advisor.html",
        featured: true,
        tags: ["advice", "guidance", "decisions"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mood-fixer",
        name: "Mood Fixer",
        description: "Instant motivation and positivity when you need it most",
        icon: "😊",
        category: "Mental Health",
        url: "tools/mood-fixer.html",
        featured: true,
        tags: ["motivation", "positivity", "mood"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "career-coach",
        name: "Mini Career Coach",
        description: "Personalized career advice and direction",
        icon: "💼",
        category: "Career",
        url: "tools/career-coach.html",
        featured: true,
        tags: ["career", "job", "interview", "salary"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "study-planner",
        name: "Study Planner",
        description: "Create a personalized daily study plan",
        icon: "📚",
        category: "Study",
        url: "tools/study-planner.html",
        featured: true,
        tags: ["study", "learning", "schedule", "exam"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "workout-suggestor",
        name: "Workout Suggestor",
        description: "Simple home workouts - no equipment needed",
        icon: "💪",
        category: "Fitness",
        url: "tools/workout-suggestor.html",
        featured: true,
        tags: ["fitness", "exercise", "workout", "health"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "breakup-friend",
        name: "Breakup Friend",
        description: "Supportive messages to help you through difficult times",
        icon: "💙",
        category: "Relationships",
        url: "tools/breakup-friend.html",
        featured: true,
        tags: ["breakup", "support", "coping", "relationships"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "money-mentor",
        name: "Money Mentor",
        description: "Simple savings tips and financial guidance",
        icon: "💰",
        category: "Finance",
        url: "tools/money-mentor.html",
        featured: true,
        tags: ["money", "savings", "budget", "finance"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "productivity-boost",
        name: "Productivity Boost",
        description: "Small tasks to boost focus and beat procrastination",
        icon: "⚡",
        category: "Productivity",
        url: "tools/productivity-boost.html",
        featured: true,
        tags: ["productivity", "focus", "procrastination", "tasks"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Categories data
    this.categories = [
      { id: "all", name: "All Tools", icon: "🔧", description: "Browse all available tools" },
      { id: "life", name: "Life", icon: "🧭", description: "General life guidance and advice" },
      { id: "mental-health", name: "Mental Health", icon: "🧘", description: "Mental wellness and emotional support" },
      { id: "career", name: "Career", icon: "💼", description: "Professional development and career guidance" },
      { id: "study", name: "Study", icon: "📚", description: "Learning and educational tools" },
      { id: "fitness", name: "Fitness", icon: "💪", description: "Health and fitness guidance" },
      { id: "relationships", name: "Relationships", icon: "❤️", description: "Relationship advice and support" },
      { id: "finance", name: "Finance", icon: "💰", description: "Financial planning and money management" },
      { id: "productivity", name: "Productivity", icon: "⚡", description: "Productivity and time management tools" }
    ];

    // Guides data
    this.guides = [
      {
        id: "getting-started",
        title: "Getting Started with Life Problem Solving",
        description: "A comprehensive guide to using our AI-powered tools effectively",
        category: "General",
        content: "Learn how to make the most of our life problem-solving tools...",
        author: "Life Solver Team",
        readTime: "5 min",
        featured: true,
        tags: ["beginner", "guide", "tutorial"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "career-development",
        title: "Career Development Strategies",
        description: "Expert tips for advancing your career and finding your path",
        category: "Career",
        content: "Discover proven strategies for career growth and development...",
        author: "Career Expert",
        readTime: "8 min",
        featured: true,
        tags: ["career", "development", "strategy"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mental-wellness",
        title: "Mental Wellness in Daily Life",
        description: "Simple practices for maintaining good mental health",
        category: "Mental Health",
        content: "Learn practical techniques for mental wellness...",
        author: "Wellness Coach",
        readTime: "6 min",
        featured: false,
        tags: ["mental-health", "wellness", "daily-practice"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  },
  
  // Clear all data
  clear() {
    this.tools = [];
    this.guides = [];
    this.categories = [];
    this.contacts = [];
    logger.info('Memory storage cleared');
  }
};

// Initialize storage
memoryStorage.init();

// Database connection function (for future MongoDB integration)
const connectDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production' && process.env.MONGODB_URI) {
      // MongoDB connection code would go here
      logger.info('Database connection would be established here in production');
    } else {
      logger.info('Using in-memory storage for development');
    }
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = {
  connectDB,
  memoryStorage
};