# ShopSphere - E-Commerce Frontend

Modern React.js frontend for the ShopSphere e-commerce platform with a premium design inspired by Amazon, Nike, and Apple.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with required variables (see `.env.example`)

3. Start development server:
```bash
npm start
```

Application opens at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Features

- Modern, responsive UI
- Dark mode support
- Product search and filtering
- Shopping cart management
- User authentication
- Order management
- Wishlist functionality
- Smooth animations
- Mobile-first design
- Accessibility compliant

## Technologies

- React 18
- React Router v6
- Context API
- Tailwind CSS
- Axios
- React Icons
- React Toastify

## Environment Variables

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## Project Structure

```
src/
├── components/   # Reusable components
├── pages/        # Page components
├── context/      # Global state management
├── hooks/        # Custom React hooks
├── utils/        # Helper functions
├── assets/       # Images and static files
├── App.js        # Main app component
└── index.js      # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (cannot be reversed)

## Deployment

Deploy to Vercel, Netlify, or any static hosting:

```bash
npm run build
# Deploy the build folder
```

## Notes

- Ensure backend API is running on the URL specified in `.env`
- Update `REACT_APP_API_URL` if backend URL changes
- Cart and wishlist are stored in localStorage
- Theme preference is saved in localStorage
