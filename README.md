# Author-Ally

Author-Ally is a modern writing platform designed to help authors create, manage, and enhance their writing projects. It features AI-assisted writing tools, document management, and book cover generation capabilities.

## Features

- **Document Management**: Create, edit, and organize your writing projects
- **AI-Assisted Writing**: Get help with writer's block and generate ideas
- **Speech-to-Text**: Dictate your writing for a hands-free experience
- **Book Cover Generator**: Create professional book covers for your manuscripts
- **User Authentication**: Secure user accounts with Clerk
- **Real-time Data Sync**: Powered by Convex backend

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Convex (real-time backend)
- **Authentication**: Clerk
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/author-ally.git
   cd author-ally
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the client directory with the following variables:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_CONVEX_URL=your_convex_url
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. In a separate terminal, start the Convex development server:
   ```
   npx convex dev
   ```

## Project Structure

- `/client`: React frontend application
  - `/src`: Source code
    - `/components`: Reusable UI components
    - `/pages`: Page components
    - `/services`: Service modules for API interactions
    - `/utils`: Utility functions
- `/convex`: Convex backend
  - `/schema.ts`: Database schema
  - `/documents.ts`: Document-related functions
  - `/bookCovers.ts`: Book cover-related functions
  - `/users.ts`: User management functions
  - `/http.ts`: HTTP endpoints for webhooks

## Authentication Flow

1. User signs in using Clerk
2. Clerk webhook notifies Convex of user creation/updates
3. Convex creates/updates user record in the database
4. User can access their documents and book covers

## Data Models

### User
- `_id`: Unique identifier
- `clerkId`: ID from Clerk authentication
- `email`: User's email address
- `name`: User's name

### Document
- `_id`: Unique identifier
- `userId`: Reference to user
- `title`: Document title
- `content`: Document content
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### BookCover
- `_id`: Unique identifier
- `userId`: Reference to user
- `title`: Book title
- `author`: Author name
- `genre`: Book genre
- `description`: Book description
- `style`: Cover style
- `imageUrl`: URL to the generated cover image

## Deployment

The application is deployed on Netlify with continuous deployment from the main branch.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Convex](https://www.convex.dev/) for the real-time backend
- [Clerk](https://clerk.dev/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for the frontend framework
