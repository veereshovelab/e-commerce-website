# ShopSphere - E-Commerce Backend

Complete REST API for the ShopSphere e-commerce platform built with Node.js, Express.js, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables (see `.env.example`)

3. Start MongoDB:
```bash
# Local MongoDB
mongod

# Or use MongoDB Atlas
```

4. Seed database with sample products:
```bash
npm run seed
```

5. Start the server:
```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

Server runs on `http://localhost:5000`

## API Documentation

See main README.md for complete API documentation.

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
SMTP_SERVICE=gmail
SMTP_USER=your_email
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=5000
```
