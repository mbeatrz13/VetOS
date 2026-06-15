import { apiRequest } from './api';

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export async function login(username: string, password: string) {
  const data = await apiRequest<LoginResponse>(
    '/accounts/login/',
    {
      method: 'POST',
      body: {
        username,
        password,
      },
    }
  );

  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function getToken() {
  return localStorage.getItem('access_token');
}

export function isAuthenticated() {
  return !!getToken();
}