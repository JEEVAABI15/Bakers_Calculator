# Project Structure (Updated June 2024)

## Monorepo Layout

- `src/client/` — React frontend (Vite, all components, hooks, services)
- `src/server/` — Express backend (controllers, models, routes, middleware, server.js)

## Scripts

- `npm run dev` — Start frontend (Vite, src/client)
- `npm run dev:backend` — Start backend (Nodemon, src/server/server.js)
- `npm run build` — Build frontend for production
- `npm run preview` — Preview frontend production build
- `npm run start:backend` — Start backend in production mode
- `npm run docker:build` — Build Docker images for frontend, backend, and MongoDB
- `npm run docker:up` — Start all services with Docker Compose
- `npm run docker:down` — Stop all Docker Compose services

## Docker Compose

- Runs frontend, backend, and MongoDB in separate containers
- See `docker-compose.yml` for details

# Billing System - MVC Architecture

A modern billing and inventory management system built with Express.js, TypeScript, and MongoDB using the MVC (Model-View-Controller) pattern.

## 🏗️ Architecture Overview

This project follows the MVC (Model-View-Controller) architecture pattern for better separation of concerns and maintainability:

### 📁 Project Structure

```
src/
├── controllers/          # Business logic handlers
│   ├── BillController.ts
│   └── ProductController.ts
├── services/            # Data access and business operations
│   ├── BaseService.ts
│   ├── BillService.ts
│   └── ProductService.ts
├── models/              # Database models (Mongoose schemas)
│   ├── Bill.ts
│   ├── Product.ts
│   ├── InventoryItem.ts
│   └── User.ts
├── middleware/          # Express middleware
│   ├── auth.ts
│   └── validation.ts
├── routes/              # Route definitions
│   ├── bills.ts
│   ├── products.ts
│   ├── inventory.ts
│   └── users.ts
├── types/               # TypeScript type definitions
│   └── index.ts
└── server.ts           # Main application entry point
```

## 🔧 Key Components

### Controllers
- Handle HTTP requests and responses
- Coordinate between routes and services
- Implement business logic
- Handle error responses

### Services
- Contain data access logic
- Implement business operations
- Extend BaseService for common CRUD operations
- Handle complex queries and data transformations

### Models
- Define database schemas using Mongoose
- Include validation rules
- Define relationships between entities

### Middleware
- **Authentication**: JWT token verification
- **Validation**: Request data validation
- **Error Handling**: Centralized error management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd project
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/yourdbname
JWT_SECRET=your-secret-key
PORT=3001
```

5. Start the development server
```bash
npm run dev
```

## 📚 API Endpoints

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Bills
- `GET /api/bills` - Get all bills for user
- `POST /api/bills` - Create new bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill

### Products
- `GET /api/products` - Get all products for user
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

## 🔒 Security Features

- JWT-based authentication
- User-specific data isolation
- Input validation and sanitization
- Error handling without exposing sensitive information

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📦 Building for Production

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository. 