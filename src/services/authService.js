import api from './api.js';

const TOKEN_KEY = 'nextiot_admin_token';
const USER_KEY = 'nextiot_admin_user';

export const login = async (credentials) => {
  const res = await api.post('/api/auth/login', credentials);
  localStorage.setItem(TOKEN_KEY, res.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
  return res;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    logout();
    return null;
  }
};

export const isAuthenticated = () => !!getToken();

