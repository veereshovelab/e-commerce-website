# ShopSphere E-Commerce Project Setup Guide

## Project Overview
ShopSphere is a production-ready, full-stack e-commerce platform built with React.js, Node.js, Express.js, MongoDB, and Tailwind CSS. It features a modern premium design inspired by Amazon, Nike, and Apple, with complete customer and admin functionality.

## Project Structure
- **frontend/**: React.js client application
- **backend/**: Node.js/Express.js server application
- **Sample Data**: Product and user seed data

## Setup Checklist

- [ ] Install Backend Dependencies
- [ ] Install Frontend Dependencies
- [ ] Configure Environment Variables
- [ ] Start MongoDB
- [ ] Seed Database
- [ ] Run Backend Server
- [ ] Run Frontend Development Server
- [ ] Verify Application

## Installation & Running Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:
```
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SMTP_SERVICE=gmail
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```

Start Backend:
```bash
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend directory:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

Start Frontend:
```bash
npm start
```

## Features Implemented

### Customer Features
- ✅ User registration & login with JWT authentication
- ✅ Google OAuth login
- ✅ Password recovery (forgot/reset password)
- ✅ Product catalog with search, filter, and sort
- ✅ Product details with reviews and ratings
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ Checkout with address management
- ✅ Order history and tracking
- ✅ User dashboard with profile management
- ✅ Newsletter subscription
- ✅ Dark mode support

### Admin Features
- ✅ Product management (CRUD)
- ✅ Order management and tracking
- ✅ Customer management
- ✅ Analytics dashboard
- ✅ Sales reports
- ✅ Inventory management

### Technical Features
- ✅ Responsive mobile-first design
- ✅ Skeleton loading states
- ✅ Toast notifications
- ✅ Accessibility support (WCAG 2.1)
- ✅ SEO optimization
- ✅ Lazy loading
- ✅ Pagination
- ✅ Error handling
- ✅ Loading states
- ✅ Coupon system

## Technology Stack

### Frontend
- React.js 18
- React Router v6
- Context API
- Axios
- Tailwind CSS
- React Icons
- React Toastify
- React Query (for data fetching)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (jsonwebtoken)
- Bcryptjs
- Multer (file upload)
- Nodemailer (email notifications)
- Passport (OAuth)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Send reset link
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add to cart
- `DELETE /api/cart/:productId` - Remove from cart
- `PUT /api/cart/:productId` - Update quantity

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `GET /api/users` - Get all users (admin)

## Database Models

### User Schema
```
- _id (ObjectId)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (String: 'user' | 'admin')
- addresses (Array)
- wishlist (Array of Product IDs)
- orders (Array of Order IDs)
- profileImage (String)
- createdAt (Date)
- updatedAt (Date)
```

### Product Schema
```
- _id (ObjectId)
- name (String)
- slug (String, unique)
- description (String)
- category (String)
- brand (String)
- images (Array of URLs)
- price (Number)
- discountPrice (Number)
- stock (Number)
- rating (Number)
- reviews (Array of Review objects)
- specifications (Object)
- createdAt (Date)
- updatedAt (Date)
```

### Order Schema
```
- _id (ObjectId)
- orderId (String, unique)
- user (ObjectId, ref User)
- products (Array of Product references with quantity)
- totalPrice (Number)
- paymentStatus (String: 'pending' | 'completed' | 'failed')
- orderStatus (String: 'pending' | 'processing' | 'shipped' | 'delivered')
- shippingAddress (Object)
- billingAddress (Object)
- createdAt (Date)
- updatedAt (Date)
```

## Deployment

### Backend Deployment (Heroku/Railway)
1. Set environment variables in deployment platform
2. Deploy to cloud service

### Frontend Deployment (Vercel/Netlify)
1. Build: `npm run build`
2. Connect GitHub repository
3. Deploy automatically on push

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings for port 27017

### CORS Errors
- Verify backend FRONTEND_URL is correct
- Check backend CORS configuration

### Authentication Errors
- Verify JWT_SECRET is set
- Clear browser cookies and try again
- Check token expiration time

## Performance Optimization

- Images optimized with lazy loading
- Code splitting with React.lazy()
- Caching strategies implemented
- Database indexing for fast queries
- CDN-ready asset structure

## Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention (MongoDB)
- XSS protection
- CSRF token implementation (where applicable)

## Support & Contributing

For issues or questions, please create a GitHub issue in the repository.

## License

This project is licensed under the MIT License.

---

**Last Updated**: 2026-06-06
**Version**: 1.0.0
