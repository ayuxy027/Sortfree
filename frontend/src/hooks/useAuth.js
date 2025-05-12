import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState, useCallback } from 'react';

export const useAuth = () => {
  const { 
    isAuthenticated,
    getAccessTokenSilently,
    logout,
    loginWithRedirect,
    user,
    isLoading,
    error
  } = useAuth0();
  
  const [token, setToken] = useState(null);
  const [tokenError, setTokenError] = useState(null);

  const getToken = useCallback(async () => {
    if (!isAuthenticated) return null;
    
    try {
      setTokenError(null);
      const accessToken = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email read:data write:data'
        }
      });
      setToken(accessToken);
      return accessToken;
    } catch (e) {
      console.error('Error getting access token:', e);
      setTokenError(e);
      
      // If the error is related to login_required, attempt to refresh silently
      if (e.error === 'login_required' || e.error === 'consent_required') {
        try {
          await loginWithRedirect({
            authorizationParams: {
              audience: import.meta.env.VITE_AUTH0_AUDIENCE,
              scope: 'openid profile email read:data write:data'
            }
          });
        } catch (redirectError) {
          console.error('Failed to redirect for authentication:', redirectError);
        }
      }
      return null;
    }
  }, [isAuthenticated, getAccessTokenSilently, loginWithRedirect]);

  useEffect(() => {
    if (isAuthenticated && !token) {
      getToken();
    }
  }, [isAuthenticated, token, getToken]);

  return { 
    isAuthenticated, 
    token, 
    tokenError,
    getToken,
    user,
    isLoading,
    error,
    logout,
    loginWithRedirect
  };
};