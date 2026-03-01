# All-in-One Life Problem Solver Backend

A clean, modular Node.js + Express backend API for the Life Problem Solver website. Provides endpoints for AI tools, guides, categories, and contact form management.

## 🚀 Features

- **RESTful API**: Clean, well-documented endpoints
- **Modular Architecture**: Organized controllers, services, and routes
- **In-Memory Storage**: Dummy JSON data (ready for database integration)
- **Input Validation**: Comprehensive validation with Joi
- **Error Handling**: Robust error management middleware
- **Security**: Helmet, CORS, rate limiting protection
- **Logging**: Structured logging with Winston
- **Contact Forms**: Full contact form processing with validation

## 🛠 Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit
- **Logging**: Winston
- **Development**: Nodemon for hot reloading

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions
│   ├── config/          # Configuration files
│   └── app.js           # Express app setup
├── .env                 # Environment variables
├── package.json         # Dependencies
└── server.js            # Server entry point
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Test the API**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Get all tools
   curl http://localhost:5000/api/tools
   ```

## 📡 API Endpoints

### Tools
- `GET /api/tools` - Get all tools (with filtering)
- `GET /api/tools/:id` - Get single tool
- `GET /api/tools/featured` - Get featured tools
- `GET /api/tools/category/:category` - Get tools by category
- `GET /api/tools/search?q=query` - Search tools
- `GET /api/tools/stats` - Get tool statistics

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `GET /api/categories/with-tools` - Get categories with tools
- `GET /api/categories/popular` - Get popular categories
- `GET /api/categories/search?q=query` - Search categories
- `GET /api/categories/stats` - Get category statistics

### Guides
- `GET /api/guides` - Get all guides (with filtering)
- `GET /api/guides/:id` - Get single guide
- `GET /api/guides/featured` - Get featured guides
- `GET /api/guides/recent` - Get recent guides
- `GET /api/guides/category/:category` - Get guides by category
- `GET /api/guides/search?q=query` - Search guides
- `GET /api/guides/stats` - Get guide statistics

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/health` - Contact system health check
- `GET /api/contact/admin/all` - Get all submissions (admin)
- `GET /api/contact/admin/:id` - Get submission by ID (admin)
- `PUT /api/contact/admin/:id/status` - Update submission status (admin)
- `GET /api/contact/admin/stats` - Get contact statistics (admin)

### System
- `GET /health` - API health check
- `GET /` - API welcome message

## 📝 Example API Calls

### Get Featured Tools
```bash
curl "http://localhost:5000/api/tools/featured?limit=3"
```

### Submit Contact Form
```bash
curl -X POST "http://localhost:5000/api/contact" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about tools",
    "message": "I love your life advisor tool!",
    "category": "feedback"
  }'
```

### Search Tools
```bash
curl "http://localhost:5000/api/tools/search?q=career&limit=5"
```

## 🔧 Configuration

Key environment variables in `.env`:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

## 🗄️ Data Structure

The API uses in-memory storage with dummy data for:
- **8 AI Tools** across 8 categories
- **9 Categories** with tool counts
- **3 Sample Guides** with different topics
- **Contact Forms** stored temporarily in memory

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation
- **Input Sanitization**: XSS protection
- **Error Handling**: No sensitive data exposure

## 🚀 Production Ready

- Environment-based configuration
- Structured logging
- Error handling middleware
- Input validation and sanitization
- Security best practices
- Modular, maintainable code structure

## 📈 Next Steps

- Add MongoDB integration
- Implement user authentication
- Add caching layer (Redis)
- Add API documentation (Swagger)
- Add comprehensive testing
- Add monitoring and metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.