import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import './index.css';
import AppRoutes from './App.routes';

// Import environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const convexUrl = import.meta.env.VITE_CONVEX_URL;

// Check if environment variables are defined
if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

if (!convexUrl) {
  throw new Error('Missing VITE_CONVEX_URL environment variable');
}

// Initialize Convex client
const convex = new ConvexReactClient(convexUrl);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ConvexProvider client={convex}>
        <AppRoutes />
      </ConvexProvider>
    </ClerkProvider>
  </React.StrictMode>
); 