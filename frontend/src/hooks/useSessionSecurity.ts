import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { logout } from '../services/auth.service';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export function useSessionSecurity() {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Reset activity timer on user interaction
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
      
      if (warningRef.current) clearTimeout(warningRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      warningRef.current = setTimeout(() => {
        const warning = confirm('Your session is about to expire in 5 minutes. Click OK to stay logged in.');
        if (!warning) {
          handleSessionExpired();
        } else {
          resetTimer();
        }
      }, SESSION_TIMEOUT - WARNING_TIME);

      timeoutRef.current = setTimeout(() => {
        handleSessionExpired();
      }, SESSION_TIMEOUT);
    };

    const handleSessionExpired = () => {
      logout();
      navigate('/login', { replace: true });
      alert('Your session has expired. Please log in again.');
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    // Check page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (warningRef.current) clearTimeout(warningRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      } else {
        // Page became visible again - check if session expired
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > SESSION_TIMEOUT) {
          handleSessionExpired();
        } else {
          resetTimer();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize timers
    resetTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (warningRef.current) clearTimeout(warningRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate]);
}
