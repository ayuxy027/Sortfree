import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Moon, Sun } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  const AuthButton = () => {
    if (isLoading) {
      return <div className={`animate-pulse ${darkMode ? 'bg-primary-700' : 'bg-primary-200'} h-10 w-20 rounded-md`}></div>;
    }

    return (
      <button
        onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}
        className={`px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300 ${
          isAuthenticated ? 'bg-secondary-600 hover:bg-secondary-700' : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isAuthenticated ? 'Log Out' : 'Log In'}
      </button>
    );
  };

  return (
    <nav className={`${darkMode ? 'bg-surface-dark' : 'bg-surface-light'} shadow-ambient-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className={`font-semibold text-xl ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`}>
              SortFree.AI
            </a>
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/" className={`${darkMode ? 'text-text-dark-secondary hover:text-text-dark-primary' : 'text-text-light-secondary hover:text-text-light-primary'} px-3 py-2 rounded-md text-sm font-medium`}>
                Home
              </a>
              {isAuthenticated && (
                <a href="/profile" className={`${darkMode ? 'text-text-dark-secondary hover:text-text-dark-primary' : 'text-text-light-secondary hover:text-text-light-primary'} px-3 py-2 rounded-md text-sm font-medium`}>
                  Profile
                </a>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'text-text-dark-secondary hover:bg-primary-800' : 'text-text-light-secondary hover:bg-primary-100'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <AuthButton />
            {isAuthenticated && user && (
              <span className={`text-sm ${darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>{user.name}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;