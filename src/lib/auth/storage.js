const ACCESS_TOKEN_KEY = 'accessToken';
const USER_ID_KEY = 'userId';
const USER_KEY = 'user';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function removeAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getUserId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function setUserId(userId) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try { return JSON.parse(userStr); } catch { return null; }
}

export function setUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function clearAuth() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('passqo_is_organizer');
}

