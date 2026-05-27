/**
 * Auth Manager - Centralized token and auth session management
 */

export const AuthManager = {
  /**
   * Store tokens in all required locations
   */
  setTokens(accessToken: string, refreshToken?: string) {
    // Store access token for API requests
    sessionStorage.setItem('accessToken', accessToken);
    localStorage.setItem('accessToken', accessToken);
    
    if (refreshToken) {
      sessionStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  },

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  },

  /**
   * Get refresh token from storage (usually in HttpOnly cookie, fallback to storage)
   */
  getRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');
  },

  /**
   * Check if user has valid session (token exists)
   */
  hasValidSession(): boolean {
    const token = this.getAccessToken();
    return !!token && token.length > 0;
  },

  /**
   * Clear all auth data
   */
  clearAll() {
    // Clear from sessionStorage
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');

    // Clear from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('auth-store');
  },

  /**
   * Get refresh token from cookies (for HttpOnly cookies)
   */
  getRefreshTokenFromCookie(): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split('; ');
    const refreshTokenCookie = cookies.find(c => c.startsWith('refreshToken='));
    return refreshTokenCookie ? refreshTokenCookie.split('=')[1] : null;
  },

  /**
   * Attempt silent refresh using refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/v1/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken = data?.data?.accessToken;
        
        if (newAccessToken) {
          this.setTokens(newAccessToken);
          return newAccessToken;
        }
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    return null;
  },
};
