import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Hero = () => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const Button = ({ onClick, children, className = '' }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Simplify Your Sorting with</span>
            <span className="block text-green-600">SortFree.AI</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Effortlessly sort and organize web content using AI-powered custom sorting. Just paste the class or ID, add your parameters, and let SortFree.AI do the rest.
          </p>
          {!isAuthenticated ? (
            <div className="mt-5 max-w-md mx-auto">
              <p className="text-xl font-semibold text-gray-700 mb-4">Please sign in to get started</p>
              <Button
                onClick={() => loginWithRedirect()}
                className="bg-green-500 hover:bg-green-600 w-full"
              >
                Sign In
              </Button>
            </div>
          ) : (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <Button className="bg-green-500 hover:bg-green-600 w-full sm:w-auto">
                Get Started
              </Button>
              <Button className="mt-3 sm:mt-0 sm:ml-3 bg-white text-green-600 hover:bg-gray-50 w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;