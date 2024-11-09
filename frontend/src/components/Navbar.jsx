import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Moon, Sun, LogOut, User, Loader2, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { 
    isAuthenticated, 
    user, 
    loginWithRedirect, 
    logout, 
    isLoading,
    getAccessTokenSilently 
  } = useAuth0();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setUserToken(token);
          setNotifications([
            { id: 1, text: "Welcome back! 👋", time: "just now" },
            { id: 2, text: "Your last login was from a new device", time: "2h ago" },
            { id: 3, text: "Check out new AI features!", time: "1d ago" },
          ]);
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
      className="px-6 py-2.5 text-lg font-semibold text-white rounded-lg
        bg-gradient-to-r from-primary-500 to-primary-600 
        hover:from-primary-600 hover:to-primary-700 
        transition-all duration-300 shadow-ambient hover:shadow-ambient-lg"
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
          <Bell className={`w-6 h-6 ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`} />
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
                    <User className="w-5 h-5" />
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
                    <LogOut className="w-5 h-5" />
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
    <motion.nav 
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`w-full z-50 ${
        darkMode 
          ? 'bg-surface-dark border-b border-secondary-800/20' 
          : 'bg-surface-light border-b border-primary-100'
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.a
            href="/"
            variants={buttonVariants}
            whileHover="hover"
            className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"
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
              {darkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
            </motion.button>

            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              isAuthenticated ? <UserProfile /> : <LoginButton />
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;