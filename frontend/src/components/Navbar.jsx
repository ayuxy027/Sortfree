import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const { isAuthenticated, user, loginWithRedirect, logout, isLoading } = useAuth0();

  const AuthButton = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <button
        onClick={() => isAuthenticated ? logout({ returnTo: window.location.origin }) : loginWithRedirect()}
        className={`px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300 ${
          isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isAuthenticated ? 'Log Out' : 'Log In'}
      </button>
    );
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="font-semibold text-xl text-gray-800">
              SortFree.AI
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              {isAuthenticated && (
                <Link to="/profile" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Profile
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <AuthButton />
            {isAuthenticated && user && (
              <span className="ml-4 text-sm text-gray-600">{user.name}</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;