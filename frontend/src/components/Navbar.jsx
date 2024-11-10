"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Sun, Moon, LogOut, User } from 'lucide-react';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { 
    isAuthenticated, 
    user, 
    loginWithRedirect, 
    logout, 
    isLoading,
    error
  } = useAuth0();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);
  
  const notifications = [
    { id: 1, text: "Welcome back! 👋", time: "just now" },
    { id: 2, text: "Your last login was from a new device", time: "2h ago" },
    { id: 3, text: "Check out new AI features!", time: "1d ago" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showUserMenu) setShowNotifications(false);
  }, [showUserMenu]);

  useEffect(() => {
    if (showNotifications) setShowUserMenu(false);
  }, [showNotifications]);

  // Handle Auth0 errors gracefully
  useEffect(() => {
    if (error) {
      console.error('Auth0 Error:', error.message);
      // You might want to show a toast notification here
    }
  }, [error]);

  const menuVariants = {
    hidden: { 
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const LoginButton = () => (
    <motion.button
      variants={buttonVariants}
      whileHover="hover"
      whileTap="tap"
      onClick={() => loginWithRedirect()}
      className={`
        px-6 py-2.5 text-lg font-semibold text-white rounded-lg
        bg-gradient-to-r from-primary-500 to-primary-600 
        hover:from-primary-600 hover:to-primary-700 
        transition-all duration-300 shadow-ambient hover:shadow-ambient-lg
      `}
    >
      Sign In
    </motion.button>
  );

  const UserProfile = () => {
    // Ensure we have user data before rendering
    if (!user) return null;

    const userImage = user.picture || '/api/placeholder/40/40';
    const userName = user.name || 'User';
    const userEmail = user.email || '';

    return (
      <div className="relative flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              p-2 rounded-full relative
              ${darkMode ? 'hover:bg-secondary-800/50' : 'hover:bg-primary-50'}
              transition-colors duration-200
            `}
          >
            <Bell className={`w-6 h-6 ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full" />
            )}
          </motion.button>

          <AnimatePresence mode="wait">
            {showNotifications && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                className={`
                  absolute right-0 mt-2 w-80 rounded-xl
                  shadow-ambient-lg border
                  ${darkMode 
                    ? 'bg-surface-dark border-secondary-800/50' 
                    : 'bg-surface-light border-primary-100'}
                  z-50
                `}
              >
                <div className="p-4">
                  <h3 className={`font-semibold mb-3 ${
                    darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
                  }`}>
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className={`
                          p-3 rounded-lg cursor-pointer
                          ${darkMode ? 'hover:bg-secondary-800/30' : 'hover:bg-primary-50'}
                          transition-colors duration-200
                        `}
                      >
                        <p className={`text-sm ${
                          darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
                        }`}>
                          {notification.text}
                        </p>
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                        }`}>
                          {notification.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full border-2 border-primary-500 overflow-hidden">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/40/40';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-100">
                    <User className="w-6 h-6 text-primary-500" />
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 ${
                darkMode ? 'border-surface-dark' : 'border-surface-light'
              }`} />
            </div>
            <span className={`text-lg font-medium hidden md:block ${
              darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
            }`}>
              {userName}
            </span>
          </motion.button>

          <AnimatePresence mode="wait">
            {showUserMenu && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={menuVariants}
                className={`
                  absolute right-0 mt-2 w-64 rounded-xl
                  shadow-ambient-lg border
                  ${darkMode 
                    ? 'bg-surface-dark border-secondary-800/50' 
                    : 'bg-surface-light border-primary-100'}
                  z-50
                `}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/48/48';
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100">
                          <User className="w-8 h-8 text-primary-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${
                        darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
                      }`}>
                        {userName}
                      </p>
                      <p className={`text-sm ${
                        darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                      }`}>
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => {
                      try {
                        logout({ returnTo: window.location.origin });
                      } catch (error) {
                        console.error('Logout error:', error);
                        // Handle logout error gracefully
                      }
                    }}
                    className={`
                      w-full p-2 rounded-lg
                      flex items-center gap-2
                      ${darkMode 
                        ? 'hover:bg-secondary-800/30 text-red-400' 
                        : 'hover:bg-primary-50 text-red-500'}
                      transition-colors duration-200
                    `}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0
        w-full z-40
        ${darkMode 
          ? 'bg-surface-dark border-b border-secondary-800/20' 
          : 'bg-surface-light border-b border-primary-100'}
        transition-colors duration-300
        backdrop-blur-sm
      `}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.a
            href="/"
            variants={buttonVariants}
            whileHover="hover"
            className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"
          >
            SortFree.AI
          </motion.a>

          <div className="flex items-center gap-4">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={toggleDarkMode}
              className={`
                p-2.5 rounded-lg
                ${darkMode 
                  ? 'text-text-dark-secondary hover:bg-secondary-800/50' 
                  : 'text-text-light-secondary hover:bg-primary-50'}
                transition-colors duration-200
              `}
            >
              {darkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </motion.button>

            {isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            ) : error ? (
              <div className="text-red-500">Authentication Error</div>
            ) : (
              isAuthenticated ? <UserProfile /> : <LoginButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}