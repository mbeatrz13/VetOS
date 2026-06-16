import { useEffect, useState } from 'react';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if token exists on mount
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch {
        // Invalid stored data, clear it
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    }
  }, []);

  return state;
}
