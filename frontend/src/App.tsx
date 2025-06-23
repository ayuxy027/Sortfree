import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth0Provider, AppState } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

interface AppProps { }

const App: React.FC<AppProps> = () => {
  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return JSON.parse(savedMode);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle dark mode function
  const toggleDarkMode = (): void => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update localStorage and document class when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent): void => {
      if (localStorage.getItem('darkMode') === null) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Function to handle Auth0 redirect callback
  const onRedirectCallback = (appState?: AppState): void => {
    window.history.replaceState(
      {},
      document.title,
      appState?.returnTo || window.location.pathname
    );
  };

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: 'openid profile email read:data write:data'
      }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      <Router>
        <div className={`App min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-background-dark' : 'bg-background-light'
          }`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route path="/" element={<Hero darkMode={darkMode} />} />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
};

export default App;