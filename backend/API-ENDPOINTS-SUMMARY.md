# API Endpoints Summary

## Base URL: `http://localhost:5000`

## 🔧 Tools API (`/api/tools`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/tools` | Get all tools with filtering | `?category=string&featured=boolean&search=string&page=number&limit=number` |
| GET | `/api/tools/:id` | Get single tool by ID | - |
| GET | `/api/tools/featured` | Get featured tools | `?limit=number` (max: 20) |
| GET | `/api/tools/category/:category` | Get tools by category | `?limit=number` (max: 50) |
| GET | `/api/tools/search` | Search tools | `?q=string&limit=number` (max: 50) |
| GET | `/api/tools/stats` | Get tool statistics | - |

## 📚 Categories API (`/api/categories`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/categories` | Get all categories | - |
| GET | `/api/categories/:id` | Get single category with tools | - |
| GET | `/api/categories/with-tools` | Get categories that have tools | - |
| GET | `/api/categories/popular` | Get popular categories | `?limit=number` (max: 10) |
| GET | `/api/categories/search` | Search categories | `?q=string` (max: 50 chars) |
| GET | `/api/categories/stats` | Get category statistics | - |

## 📖 Guides API (`/api/guides`)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/guides` | Get all guides with filtering | `?category=string&featured=boolean&search=string&page=number&limit=number` |
| GET | `/api/guides/:id` | Get single guide by ID | - |
| GET | `/api/guides/featured` | Get featured guides | `?limit=number` (max: 10) |
| GET | `/api/guides/recent` | Get recent guides | `?limit=number` (max: 20) |
| GET | `/api/guides/category/:category` | Get guides by category | `?limit=number` (max: 20) |
| GET | `/api/guides/search` | Search guides | `?q=string&limit=number` (max: 50) |
| GET | `/api/guides/stats` | Get guide statistics | - |

## 📧 Contact API (`/api/contact`)

| Method | Endpoint | Description | Body/Parameters |
|--------|----------|-------------|-----------------|
| POST | `/api/contact` | Submit contact form | `{ name, email, phone?, subject, message, category?, priority? }` |
| GET | `/api/contact/health` | Contact system health check | - |

### Admin Endpoints (No auth required in demo)
| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | `/api/contact/admin/all` | Get all contact submissions | `?status=string&category=string&startDate=date&endDate=date&page=number&limit=number` |
| GET | `/api/contact/admin/:id` | Get contact by ID | - |
| PUT | `/api/contact/admin/:id/status` | Update contact status | `{ status, response? }` |
| GET | `/api/contact/admin/stats` | Get contact statistics | - |

## 🏥 System API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | API health check |
| GET | `/` | API welcome message |

## 📊 Sample Data Available

### Tools (8 total)
- Life Advisor, Mood Fixer, Career Coach, Study Planner
- Workout Suggestor, Breakup Friend, Money Mentor, Productivity Boost

### Categories (9 total)
- All Tools, Life, Mental Health, Career, Study
- Fitness, Relationships, Finance, Productivity

### Guides (3 total)
- Getting Started Guide, Career Development, Mental Wellness

## 🔒 Security & Validation

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schema validation on all inputs
- **CORS**: Configured for frontend integration
- **Helmet**: Security headers applied
- **Error Handling**: Comprehensive error responses

## 📝 Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2025-11-29T18:49:04.326Z",
  "pagination": { ... } // For paginated responses
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "timestamp": "2025-11-29T18:49:04.326Z",
  "validationErrors": [ ... ] // For validation errors
}
```