import React from 'react';
import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

export const AuthButtons: React.FC = () => {
  const { isSignedIn } = useUser();
  
  return (
    <div className="flex items-center space-x-4">
      {isSignedIn ? (
        <UserButton afterSignOutUrl="/" />
      ) : (
        <>
          <SignInButton mode="modal">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              Sign Up
            </button>
          </SignUpButton>
        </>
      )}
    </div>
  );
}; 