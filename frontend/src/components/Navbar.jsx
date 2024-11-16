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

  useEffect(() => {
    if (error) {
      console.error('Auth0 Error:', error.message);
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

  const shimmerVariants = {
    initial: { x: '-100%', opacity: 0.5 },
    animate: {
      x: '100%',
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'linear'
      }
    }
  };
  const UserProfile = () => {
    if (!user) return null;

    const userImage = user.picture || '/api/placeholder/40/40';
    const userName = user.name || 'User';
    const userEmail = user.email || '';

    return (
      <div className="relative flex items-center gap-4">
        <div className="relative" ref={notificationRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              p-2.5 rounded-xl
              ${darkMode 
                ? 'bg-surface-dark/90 border-secondary-800/50' 
                : 'bg-surface-light/90 border-primary-200/50'}
              border backdrop-blur-sm
              transition-all duration-300
              hover:shadow-ambient-lg
            `}
          >
            <Bell className={`w-6 h-6 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-primary-500" />
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
                  ${darkMode 
                    ? 'bg-surface-dark/90 border-secondary-800/50' 
                    : 'bg-surface-light/90 border-primary-200/50'}
                  border backdrop-blur-sm
                  shadow-ambient-lg
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
                      <motion.div
                        key={notification.id}
                        whileHover={{ scale: 1.02 }}
                        className={`
                          p-3 rounded-lg cursor-pointer
                          ${darkMode 
                            ? 'hover:bg-secondary-800/30' 
                            : 'hover:bg-primary-50'}
                          transition-all duration-300
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
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative" ref={userMenuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`
              p-2 rounded-xl
              ${darkMode 
                ? 'bg-surface-dark/90 border-secondary-800/50' 
                : 'bg-surface-light/90 border-primary-200/50'}
              border backdrop-blur-sm
              transition-all duration-300
              hover:shadow-ambient-lg
              flex items-center gap-3
            `}
          >
            <div className="relative">
              <div className="w-10 h-10 overflow-hidden border-2 rounded-full border-primary-500">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/40/40';
                      e.target.onerror = null;
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-primary-100">
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
                  ${darkMode 
                    ? 'bg-surface-dark/90 border-secondary-800/50' 
                    : 'bg-surface-light/90 border-primary-200/50'}
                  border backdrop-blur-sm
                  shadow-ambient-lg
                  z-50
                `}
              >
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 overflow-hidden border-2 rounded-full border-primary-500">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/48/48';
                            e.target.onerror = null;
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-primary-100">
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
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      try {
                        logout({ returnTo: window.location.origin });
                      } catch (error) {
                        console.error('Logout error:', error);
                      }
                    }}
                    className={`
                      w-full p-2 rounded-lg
                      flex items-center gap-2
                      ${darkMode 
                        ? 'hover:bg-secondary-800/30 text-red-400' 
                        : 'hover:bg-primary-50 text-red-500'}
                      transition-all duration-300
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
    <>
      {/* Spacer div to prevent content jump */}
      <div className="w-full h-20" />

      {/* Fixed Navbar */}
      <nav className={`
        fixed top-0 left-0 right-0 w-full z-40
        ${darkMode 
          ? 'bg-gradient-to-br from-background-dark via-primary-950/20 to-primary-950/40 border-secondary-800/10' 
          : 'bg-gradient-to-br from-background-light via-primary-100/50 to-primary-200/30 border-primary-200/20'}
        border-b backdrop-blur-sm
        transition-colors duration-300
      `}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent"></div>
          <div className={`absolute inset-0 opacity-35 
            ${darkMode ? 'bg-[url("/noise-dark.png")]' : 'bg-[url("/noise-light.png")]'}`}
          ></div>
        </div>

        <div className="relative z-10 w-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="relative text-3xl font-bold"
            >
              <span className="text-transparent bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text">
                SortFree
              </span>
            </motion.a>

            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className={`
                  p-2.5 rounded-xl
                  ${darkMode 
                    ? 'bg-surface-dark/90 border-secondary-800/50' 
                    : 'bg-surface-light/90 border-primary-200/50'}
                  border backdrop-blur-sm
                  transition-all duration-300
                  hover:shadow-ambient-lg
                `}
              >
                {darkMode ? (
                  <Sun className={`w-6 h-6 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
                ) : (
                  <Moon className={`w-6 h-6 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
                )}
              </motion.button>

              {isLoading ? (
                <div className="w-6 h-6 border-2 rounded-full border-primary-500 border-t-transparent animate-spin" />
              ) : error ? (
                <div className="text-red-500">Authentication Error</div>
              ) : !isAuthenticated ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loginWithRedirect()}
                  className="relative flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white transition-all duration-300 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-ambient hover:shadow-ambient-lg"
                >
                  <motion.div
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                    className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                  Sign In
                </motion.button>
              ) : (
                <UserProfile />
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}