import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ darkMode, toggleDarkMode }) {
  const { 
    isAuthenticated, 
    user, 
    loginWithRedirect, 
    logout, 
    isLoading,
    getAccessTokenSilently 
  } = useAuth0();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome back! 👋", time: "just now" },
    { id: 2, text: "Your last login was from a new device", time: "2h ago" },
    { id: 3, text: "Check out new AI features!", time: "1d ago" },
  ]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setUserToken(token);
        } catch (error) {
          console.error("Error fetching token:", error);
        }
      }
    };

    fetchUserDetails();
  }, [isAuthenticated, getAccessTokenSilently]);

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
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
      onClick={() => loginWithRedirect({
        appState: { returnTo: window.location.pathname }
      })}
      className={`px-6 py-2.5 text-lg font-semibold text-white rounded-lg
        bg-gradient-to-r from-primary-500 to-primary-600 
        hover:from-primary-600 hover:to-primary-700 
        transition-all duration-300 shadow-ambient hover:shadow-ambient-lg`}
    >
      Sign In
    </motion.button>
  );

  const UserProfile = () => (
    <div className="relative flex items-center gap-4">
      <motion.div className="relative">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowNotifications(!showNotifications)}
          className={`p-2 rounded-full relative ${
            darkMode ? 'hover:bg-secondary-800/50' : 'hover:bg-primary-50'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`w-6 h-6 ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </motion.button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className={`absolute right-0 mt-2 w-80 rounded-xl shadow-ambient-lg border ${
                darkMode 
                  ? 'bg-surface-dark border-secondary-800/50' 
                  : 'bg-surface-light border-primary-100'
              }`}
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
                      className={`p-3 rounded-lg ${
                        darkMode ? 'hover:bg-secondary-800/30' : 'hover:bg-primary-50'
                      }`}
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
      </motion.div>

      <div className="relative">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-3"
        >
          <img
            src={user?.picture}
            alt={user?.name}
            className="w-10 h-10 rounded-full border-2 border-primary-500"
          />
          <span className={`text-lg font-medium hidden md:block ${
            darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
          }`}>
            {user?.name}
          </span>
        </motion.button>

        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
              className={`absolute right-0 mt-2 w-64 rounded-xl shadow-ambient-lg border ${
                darkMode 
                  ? 'bg-surface-dark border-secondary-800/50' 
                  : 'bg-surface-light border-primary-100'
              }`}
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user?.picture}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <p className={`font-medium ${
                      darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'
                    }`}>
                      {user?.name}
                    </p>
                    <p className={`text-sm ${
                      darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'
                    }`}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => window.location.href = '/profile'}
                    className={`w-full p-2 rounded-lg flex items-center gap-2 ${
                      darkMode 
                        ? 'hover:bg-secondary-800/30' 
                        : 'hover:bg-primary-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </motion.button>

                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => logout({ returnTo: window.location.origin })}
                    className={`w-full p-2 rounded-lg flex items-center gap-2 ${
                      darkMode 
                        ? 'hover:bg-secondary-800/30 text-red-400' 
                        : 'hover:bg-primary-50 text-red-500'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Log Out</span>
                  </motion.button>
                </div>

                {userToken && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className={`text-xs ${
                      darkMode ? 'text-text-dark-tertiary' : 'text-text-light-tertiary'
                    }`}>
                      Session active
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full ml-2"></span>
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <nav 
      className={`w-full z-50 ${
        darkMode 
          ? 'bg-surface-dark border-b border-secondary-800/20' 
          : 'bg-surface-light border-b border-primary-100'
      } transition-all duration-300`}
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
              className={`p-2.5 rounded-lg ${
                darkMode 
                  ? 'text-text-dark-secondary hover:bg-secondary-800/50' 
                  : 'text-text-light-secondary hover:bg-primary-50'
              } transition-colors duration-300`}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </motion.button>

            {isLoading ? (
              <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              isAuthenticated ? <UserProfile /> : <LoginButton />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}