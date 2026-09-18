# 🛍️ ShopSphere - Modern Full-Stack E-Commerce Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)](https://www.mongodb.com/)

**ShopSphere** is a high-performance, modern full-stack e-commerce web application engineered with **React 18**, **Vite**, **Tailwind CSS**, **Framer Motion**, **Node.js**, **Express**, and **MongoDB**. It offers a premium shopping experience featuring interactive product comparison, real-time promo code discounts, dynamic dark/light mode themes, smooth page transitions, and comprehensive user/admin dashboards.

---

## ✨ Features Overview

### 🛍️ Shopping & User Experience
* **Product Catalog & Discovery**: Filter products by categories, price range, stock levels, and ratings. Includes interactive search and quick view modals.
* **Product Comparison Drawer & Modal**: Select and compare multiple products side-by-side on detailed spec tables.
* **Promo Code & Discount Engine**: Apply instant coupon codes at checkout with dynamic calculations for shipping, taxes, and final totals.
* **Urgency & Low Stock Badges**: Real-time inventory status indicators to highlight limited stock items.
* **Wishlist & Cart Management**: Persistent cart and wishlist states with instant quantity adjustments and notifications via `react-toastify`.
* **Dark / Light Mode**: Seamless global theme toggle with smooth CSS transitions, Tailwind dark mode, and persistent preferences.
* **Smooth Navigation & Micro-animations**: Animated route transitions powered by **Framer Motion** and floating **ScrollToTop** navigation controls.

### 🛡️ Backend & Security
* **Authentication**: JWT-based authentication with bcrypt password hashing and Passport.js Google OAuth integration.
* **RESTful API Architecture**: Express API endpoints for products, users, cart, orders, reviews, and admin operations.
* **Fallback Mock Engine**: Axios client fallback logic ensuring full standalone frontend functionality even when backend APIs are offline.
* **File Uploads & Media**: Cloudinary and Multer integration for product image handling.
* **Rate Limiting & Validation**: Express-rate-limit protection against spam and brute-force requests.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: [React 18](https://reactjs.org/)
* **Build Tool**: [Vite 8](https://vitejs.dev/)
* **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) & Vanilla CSS
* **Animations**: [Framer Motion](https://www.framer.com/motion/)
* **Icons & Notifications**: [React Icons](https://react-icons.github.io/react-icons/) & [React Toastify](https://fkhadra.github.io/react-toastify/)
* **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
* **Runtime**: [Node.js](https://nodejs.org/)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ORM](https://mongoosejs.com/)
* **Auth**: JSON Web Tokens (JWT) & Passport.js
* **Storage**: Cloudinary & Multer

---

## 📁 Repository Structure

```text
e-commerce/
├── frontend/                  # React + Vite Client Application
│   ├── src/
│   │   ├── components/        # Reusable UI components (Header, Footer, ProductCard, Drawer...)
│   │   ├── context/           # React Context (Auth, Cart, Theme, Compare)
│   │   ├── pages/             # App views (Home, Products, Checkout, UserDashboard, Admin...)
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── utils/             # Helper functions and Axios instance
│   │   ├── App.jsx            # Main App container & Framer Motion routes
│   │   └── index.css          # Global Tailwind styles & dark mode definitions
│   ├── package.json
│   └── vite.config.js
├── backend/                   # Node.js + Express REST API Server
│   ├── config/                # Database & Cloudinary configurations
│   ├── controllers/           # Route controller functions
│   ├── models/                # Mongoose database schemas
│   ├── routes/                # Express API routes
│   ├── scripts/               # Database seed scripts
│   ├── server.js              # Server entry point
│   └── package.json
├── package.json               # Root monorepo script executor (concurrently)
├── vercel.json                # Single-click Vercel deployment configuration
└── README.md                  # Project documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js** v16.x or higher
* **npm** v8.x or higher
* **MongoDB** (Local instance or MongoDB Atlas cluster)

### 1. Clone the Repository
```bash
git clone https://github.com/veereshovelab/e-commerce-website.git
cd e-commerce-website
```

### 2. Install Dependencies
Install dependencies for both root monorepo, frontend, and backend:

```bash
npm install
npm install --prefix frontend
npm install --prefix backend
```

### 3. Configure Environment Variables
Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/shopsphere
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Seed Initial Data (Optional)
To populate MongoDB with initial products:

```bash
npm run seed --prefix backend
```

### 5. Run the Application
Run both backend and frontend servers simultaneously using concurrent execution:

```bash
npm run dev
```

* **Frontend App**: `http://localhost:3000` (Vite is configured for this port; `5173` is also allowed)
* **Backend API**: `http://localhost:5001`

---

## 📜 Available NPM Scripts

| Script | Location | Description |
| :--- | :--- | :--- |
| `npm run dev` | Root | Concurrently launches frontend and backend development servers |
| `npm run dev:frontend` | Root | Launches only the Vite frontend dev server |
| `npm run dev:backend` | Root | Launches only the Express backend server with nodemon |
| `npm run build` | Root / Frontend | Builds production production-ready bundles in `frontend/dist` |

---

## 🌐 Deployment (Vercel)

This repository includes a pre-configured `vercel.json` optimized for zero-config deployment on **Vercel**:

```json
{
  "buildCommand": "npm install --prefix frontend && npm run build --prefix frontend",
  "outputDirectory": "frontend/dist",
  "cleanUrls": true,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

1. Push your changes to GitHub.
2. Import your repository into [Vercel](https://vercel.com).
3. Set the root directory as `./` and deploy!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

Developed with ❤️ for **ShopSphere**.
