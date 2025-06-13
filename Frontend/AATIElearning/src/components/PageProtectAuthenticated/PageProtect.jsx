import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

// Get a specific cookie
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(';').shift() || null;
  }
  return null;
};

// Basic token validator
const isValidToken = (token) => {
  return typeof token === 'string' && token.length > 10 && !token.includes(' ');
};

const useProtectPage = ({
  redirectPath = "/login",
  cookieName = "access_token",
  enableLoading = true,
  onUnauthorized = null,
  validateToken = true
} = {}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(enableLoading);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = useCallback(() => {
    try {
      const token = getCookie(cookieName);

      if (!token || (validateToken && !isValidToken(token))) {
        if (token) {
          // Clear invalid token
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        }
        setIsAuthenticated(false);
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      return false;
    }
  }, [cookieName, validateToken]);

  const handleUnauthorized = useCallback(() => {
    if (typeof onUnauthorized === "function") onUnauthorized();
    setTimeout(() => navigate(redirectPath, { replace: true }), 100);
  }, [navigate, redirectPath, onUnauthorized]);

  useEffect(() => {
    const isAuth = checkAuthentication();
    if (!isAuth) handleUnauthorized();
    setIsLoading(false);
  }, [checkAuthentication, handleUnauthorized]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = getCookie(cookieName);
      const valid = token && (!validateToken || isValidToken(token));
      if (isAuthenticated && !valid) {
        handleUnauthorized();
      }
    }, 5000); // every 5 sec

    return () => clearInterval(interval);
  }, [cookieName, isAuthenticated, validateToken, handleUnauthorized]);

  return {
    isLoading,
    isAuthenticated,
    checkAuthentication,
    getCookie: (name) => getCookie(name)
  };
};

export default useProtectPage;

// 🔐 HOC version
export const withProtection = (WrappedComponent, options = {}) => {
  return function ProtectedComponent(props) {
    const { isLoading, isAuthenticated } = useProtectPage(options);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Checking authentication...</span>
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

// 🔐 Component wrapper version
export const ProtectedRoute = ({
  children,
  fallback = null,
  showLoading = true,
  ...options
}) => {
  const { isLoading, isAuthenticated } = useProtectPage(options);

  if (isLoading && showLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return isAuthenticated ? children : fallback;
};