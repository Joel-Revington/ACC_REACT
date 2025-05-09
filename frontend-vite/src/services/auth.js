// src/services/auth.js
// Handles authentication with Autodesk Platform Services

/**
 * Fetches the profile of the authenticated user
 * @returns {Promise<Object>} User profile data
 */
export async function getProfile() {
    try {
      const response = await fetch('/api/auth/profile');
      if (!response.ok) {
        throw new Error(`Failed to get profile: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting profile:', error);
      throw error;
    }
  }
  
  /**
   * Logout the current user
   * @returns {Promise<void>}
   */
  // export async function logout() {
  //   try {
  //     const response = await fetch('/api/auth/logout', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     });
      
  //     if (!response.ok) {
  //       throw new Error(`Logout failed: ${response.statusText}`);
  //     }
      
  //     return true;
  //   } catch (error) {
  //     console.error('Error during logout:', error);
  //     throw error;
  //   }
  // }
  
  /**
   * Checks if the current user's token is still valid
   * @returns {Promise<boolean>} True if token is valid, false otherwise
   */
  export async function isTokenValid() {
    try {
      const response = await fetch('/api/auth/token/validate');
      return response.ok;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }
  
  /**
   * Refreshes the access token
   * @returns {Promise<void>}
   */
  export async function refreshToken() {
    try {
      const response = await fetch('/api/auth/token/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }
  
  /**
   * Setup token refresh interval
   * Refreshes the token every 30 minutes (assuming tokens last 1 hour)
   * @returns {number} The interval ID
   */
  export function setupTokenRefresh() {
    // Refresh token every 30 minutes
    const refreshInterval = 30 * 60 * 1000;
    
    const intervalId = setInterval(async () => {
      try {
        const isValid = await isTokenValid();
        if (!isValid) {
          await refreshToken();
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refreshing fails, might need to redirect to login
        // This could happen if the refresh token is expired
        clearInterval(intervalId);
        window.location.href = '/api/auth/login';
      }
    }, refreshInterval);
    
    return intervalId;
  }
  
  /**
   * Clear the token refresh interval
   * @param {number} intervalId - The interval ID to clear
   */
  export function clearTokenRefresh(intervalId) {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }