import { useAuth0, User } from '@auth0/auth0-react';
import { useEffect, useState, useCallback } from 'react';

interface UseAuthReturn {
  isAuthenticated: boolean;
  token: string | null;
  tokenError: Error | null;
  getToken: () => Promise<string | null>;
  user?: User;
  isLoading: boolean;
  error?: Error;
  logout: (options?: { logoutParams?: { returnTo?: string } }) => Promise<void>;
  loginWithRedirect: (options?: any) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const { 
    isAuthenticated,
    getAccessTokenSilently,
    logout,
    loginWithRedirect,
    user,
    isLoading,
    error
  } = useAuth0();
  
  const [token, setToken] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<Error | null>(null);

  const getToken = useCallback(async (): Promise<string | null> => {
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
      const error = e as Error;
      console.error('Error getting access token:', error);
      setTokenError(error);
      
      // If the error is related to login_required, attempt to refresh silently
      if ((error as any).error === 'login_required' || (error as any).error === 'consent_required') {
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