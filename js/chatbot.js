// Chatbot functionality for Sofi AI Assistant
class SofiChatbot {
    constructor() {
        this.isOpen = false;
        this.responses = {
            // Study and Learning
            'study': [
                "🎯 Try the Pomodoro technique: 25 minutes focused study, 5 minute break!",
                "📚 Create a distraction-free zone and put your phone in another room.",
                "✨ Break big topics into smaller chunks - your brain loves bite-sized learning!",
                "🧠 Use active recall: test yourself instead of just re-reading notes.",
                "⏰ Study during your peak energy hours - usually morning for most people!"
            ],
            'focus': [
                "🎯 Remove distractions first - close unnecessary tabs and apps!",
                "🧘 Try the 2-minute rule: if it takes less than 2 minutes, do it now.",
                "🎵 Use focus music or white noise to create your concentration zone.",
                "📱 Put your phone on 'Do Not Disturb' mode while working.",
                "⚡ Take regular breaks - your brain needs rest to stay sharp!"
            ],
            'motivation': [
                "💪 Remember your 'why' - what's driving you toward this goal?",
                "🌟 Celebrate small wins along the way - progress is progress!",
                "🚀 Start with just 5 minutes - momentum builds naturally.",
                "🎯 Visualize your success - see yourself achieving your goals!",
                "💎 You're capable of more than you think - trust the process!"
            ],
            'productivity': [
                "⚡ Use the 80/20 rule - focus on the 20% that gives 80% results!",
                "📝 Write tomorrow's top 3 tasks before bed tonight.",
                "🎯 Time-block your calendar - assign specific times for specific tasks.",
                "🔄 Batch similar tasks together to maintain flow state.",
                "✅ Use the 'two-minute rule' - if it's quick, do it now!"
            ],
            'fitness': [
                "🏃‍♀️ Start with just 10 minutes a day - consistency beats intensity!",
                "💧 Drink water before, during, and after workouts.",
                "🎯 Find activities you enjoy - exercise shouldn't feel like punishment!",
                "📱 Track your progress - seeing improvement is super motivating!",
                "🌅 Morning workouts can boost your energy for the entire day!"
            ],
            'career': [
                "🎯 Network authentically - focus on helping others first.",
                "📚 Learn one new skill every quarter to stay competitive.",
                "💼 Update your LinkedIn regularly with your achievements.",
                "🤝 Seek feedback actively - it's the fastest way to grow.",
                "🚀 Take on projects that stretch your comfort zone!"
            ],
            'finance': [
                "💰 Follow the 50/30/20 rule: needs, wants, savings.",
                "📊 Track your expenses for a week - awareness is the first step!",
                "🎯 Automate your savings - pay yourself first.",
                "📱 Use budgeting apps to make money management easier.",
                "💡 Invest in yourself first - education pays the best dividends!"
            ],
            'stress': [
                "🧘 Take 5 deep breaths - in for 4, hold for 4, out for 6.",
                "🚶‍♀️ Go for a 10-minute walk - movement changes your mindset.",
                "📝 Write down what's bothering you - externalize the worry.",
                "🎵 Listen to calming music or nature sounds.",
                "💤 Prioritize sleep - a rested mind handles stress better!"
            ],
            'relationships': [
                "💝 Listen more than you speak - everyone wants to feel heard.",
                "🤗 Express gratitude regularly - appreciation strengthens bonds.",
                "📱 Put devices away during quality time together.",
                "💬 Ask open-ended questions to deepen conversations.",
                "🎯 Focus on understanding, not being right in disagreements."
            ],
            'default': [
                "🤔 That's an interesting question! I'd love to help you explore that.",
                "💡 Great question! Here's what I think might help...",
                "🌟 I'm here to help! Could you tell me more about what you're looking for?",
                "🎯 Let me share some thoughts that might be useful...",
                "✨ That's something many people wonder about! Here's my take..."
            ],
            'greeting': [
                "👋 Hi there! I'm Sofi, your friendly life assistant. What can I help you with today?",
                "🌟 Hello! I'm here to help with study tips, productivity, motivation, and more!",
                "💫 Hey! Ask me about anything - from focus techniques to life hacks!",
                "🎯 Hi! I'm Sofi, and I love helping people solve daily challenges. What's on your mind?"
            ]
        };
        
        this.quickQuestions = [
            { text: "📚 Study tips", question: "Best way to focus on studies?" },
            { text: "💪 Motivation", question: "How to stay motivated?" },
            { text: "⚡ Productivity", question: "Quick productivity hacks?" },
            { text: "🧘 Stress relief", question: "How to manage stress?" },
            { text: "💰 Money tips", question: "How to save money?" }
        ];
        
        this.init();
    }
    
    init() {
        this.createChatbotHTML();
        this.bindEvents();
        this.showWelcomeMessage();
    }
    
    createChatbotHTML() {
        const chatbotHTML = `
            <div class="chatbot-widget" id="chatbot-widget">
                <!-- Chat Bubble Button -->
                <div class="chat-bubble" id="chat-bubble">
                    <div class="bubble-icon">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="bubble-text">
                        <span>Hi! I'm Sofi</span>
                        <small>Ask me anything!</small>
                    </div>
                    <div class="bubble-pulse"></div>
                    <div class="notification-badge" id="notification-badge">1</div>
                </div>

                <!-- Chat Window -->
                <div class="chat-window" id="chat-window">
                    <div class="chat-header">
                        <div class="assistant-info">
                            <div class="assistant-avatar">
                                <i class="fas fa-robot"></i>
                                <div class="status-dot"></div>
                            </div>
                            <div class="assistant-details">
                                <h4>Sofi</h4>
                                <span class="status">Always here to help ✨</span>
                            </div>
                        </div>
                        <button class="close-chat" id="close-chat">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be added dynamically -->
                    </div>

                    <div class="chat-input-area">
                        <div class="quick-questions" id="quick-questions">
                            ${this.quickQuestions.map(q => 
                                `<button class="quick-question" data-question="${q.question}">${q.text}</button>`
                            ).join('')}
                        </div>
                        <div class="chat-input-container">
                            <input type="text" id="chat-input" placeholder="Ask me anything..." maxlength="200">
                            <button class="send-button" id="send-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }
    
    bindEvents() {
        const chatBubble = document.getElementById('chat-bubble');
        const closeChat = document.getElementById('close-chat');
        const sendButton = document.getElementById('send-button');
        const chatInput = document.getElementById('chat-input');
        const quickQuestions = document.getElementById('quick-questions');
        
        chatBubble.addEventListener('click', () => this.openChat());
        closeChat.addEventListener('click', () => this.closeChat());
        sendButton.addEventListener('click', () => this.sendMessage());
        
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        quickQuestions.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-question')) {
                const question = e.target.dataset.question;
                this.sendMessage(question);
            }
        });
    }
    
    openChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatBubble = document.getElementById('chat-bubble');
        const notificationBadge = document.getElementById('notification-badge');
        
        chatWindow.classList.add('active');
        chatBubble.style.display = 'none';
        this.isOpen = true;
        
        // Hide notification badge when chat opens
        if (notificationBadge) {
            notificationBadge.classList.add('hidden');
        }
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('chat-input').focus();
        }, 300);
    }
    
    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatBubble = document.getElementById('chat-bubble');
        
        chatWindow.classList.remove('active');
        chatBubble.style.display = 'flex';
        this.isOpen = false;
    }
    
    sendMessage(predefinedMessage = null) {
        const chatInput = document.getElementById('chat-input');
        const message = predefinedMessage || chatInput.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        if (!predefinedMessage) {
            chatInput.value = '';
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate response and calculate typing delay based on message length
        const response = this.generateResponse(message);
        const typingDelay = Math.min(800 + (response.length * 20), 3000); // 20ms per character, max 3 seconds
        
        setTimeout(() => {
            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        }, typingDelay);
    }
    
    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message ${sender}-message">
                ${sender === 'bot' ? `
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                ` : ''}
                <div class="message-content">
                    <p>${content}</p>
                    <span class="message-time">${time}</span>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingHTML = `
            <div class="message bot-message typing-indicator" id="typing-indicator">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific question patterns first
        if (this.isThankYou(lowerMessage)) {
            return this.getThankYouResponse();
        }
        
        if (this.isGoodbye(lowerMessage)) {
            return this.getGoodbyeResponse();
        }
        
        // Check for greeting patterns
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse(this.responses.greeting);
        }
        
        // Check for keywords and return appropriate response
        for (const [category, responses] of Object.entries(this.responses)) {
            if (category === 'default' || category === 'greeting') continue;
            
            if (lowerMessage.includes(category) || 
                this.checkKeywords(lowerMessage, category)) {
                return this.getRandomResponse(responses);
            }
        }
        
        // Check for question words to provide helpful response
        if (this.isQuestion(lowerMessage)) {
            return "🤔 That's a great question! While I'd love to help with that specific topic, I'm best at giving advice on study tips, productivity, motivation, fitness, career guidance, and stress management. Try asking about one of those areas!";
        }
        
        // Default response
        return this.getRandomResponse(this.responses.default);
    }
    
    checkKeywords(message, category) {
        const keywords = {
            'study': ['learn', 'exam', 'test', 'homework', 'assignment', 'education', 'school', 'college'],
            'focus': ['concentrate', 'attention', 'distraction', 'procrastination'],
            'motivation': ['inspire', 'encourage', 'drive', 'goal', 'achieve', 'success'],
            'productivity': ['efficient', 'organize', 'time management', 'workflow', 'task'],
            'fitness': ['exercise', 'workout', 'health', 'gym', 'running', 'weight'],
            'career': ['job', 'work', 'professional', 'interview', 'resume', 'promotion'],
            'finance': ['money', 'budget', 'save', 'invest', 'financial', 'income'],
            'stress': ['anxiety', 'worry', 'pressure', 'overwhelm', 'calm', 'relax'],
            'relationships': ['friend', 'family', 'partner', 'social', 'communication']
        };
        
        return keywords[category]?.some(keyword => message.includes(keyword)) || false;
    }
    
    isGreeting(message) {
        const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'];
        return greetings.some(greeting => message.includes(greeting));
    }
    
    isThankYou(message) {
        const thankYouPhrases = ['thank', 'thanks', 'appreciate', 'helpful', 'great'];
        return thankYouPhrases.some(phrase => message.includes(phrase));
    }
    
    isGoodbye(message) {
        const goodbyePhrases = ['bye', 'goodbye', 'see you', 'talk later', 'gtg', 'gotta go'];
        return goodbyePhrases.some(phrase => message.includes(phrase));
    }
    
    isQuestion(message) {
        const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'can you', 'could you', 'would you'];
        return questionWords.some(word => message.includes(word)) || message.includes('?');
    }
    
    getThankYouResponse() {
        const responses = [
            "😊 You're so welcome! I'm always happy to help!",
            "🌟 Glad I could help! Feel free to ask me anything else!",
            "💫 My pleasure! That's what I'm here for!",
            "✨ Anytime! I love helping people achieve their goals!"
        ];
        return this.getRandomResponse(responses);
    }
    
    getGoodbyeResponse() {
        const responses = [
            "👋 See you later! Remember, I'm always here when you need me!",
            "🌟 Goodbye! Keep being awesome and reach out anytime!",
            "✨ Take care! I'll be here whenever you need some advice!",
            "💫 Bye for now! Wishing you success in everything you do!"
        ];
        return this.getRandomResponse(responses);
    }
    
    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    showWelcomeMessage() {
        // Add a subtle bounce animation to the chat bubble after page load
        setTimeout(() => {
            const chatBubble = document.getElementById('chat-bubble');
            if (chatBubble) {
                chatBubble.style.animation = 'bounce 0.6s ease-out';
            }
        }, 2000);
        
        // Pre-load welcome message for when chat opens
        setTimeout(() => {
            this.addMessage("👋 Hi! I'm Sofi, your friendly assistant. I can help with study tips, productivity hacks, motivation, and more! What would you like to know?", 'bot');
        }, 500);
        
        // Show notification badge after some time to encourage interaction
        setTimeout(() => {
            const notificationBadge = document.getElementById('notification-badge');
            if (notificationBadge && !this.isOpen) {
                notificationBadge.classList.remove('hidden');
            }
        }, 10000); // Show after 10 seconds
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if not already initialized
    if (!window.sofiChatbot) {
        window.sofiChatbot = new SofiChatbot();
    }
});