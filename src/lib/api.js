const TOKEN_KEY = 'glory_catering_service_token';
const GUEST_TOKEN_KEY = 'glory_catering_service_guest_tokens';

// API base — defaults to same-origin (dev proxy or Vercel rewrite). In
// production, point this at the hosted backend, e.g. https://api.example.com
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getGuestTokens = () => {
  try {
    const v = JSON.parse(localStorage.getItem(GUEST_TOKEN_KEY) || '[]');
    return Array.isArray(v) ? v.filter((t) => typeof t === 'string' && t) : [];
  } catch {
    return [];
  }
};

export const addGuestToken = (token) => {
  if (!token) return;
  const list = getGuestTokens();
  if (!list.includes(token)) list.push(token);
  try {
    localStorage.setItem(GUEST_TOKEN_KEY, JSON.stringify(list));
  } catch {
    /* ignore quota errors */
  }
};

export const clearGuestTokens = () => {
  try {
    localStorage.removeItem(GUEST_TOKEN_KEY);
  } catch {
    /* ignore */
  }
};

export async function api(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;
  const config = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  };
  if (body !== undefined) config.body = JSON.stringify(body);

  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api${path}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data.message || 'Something went wrong. Please try again.');
    err.status = res.status;
    if (res.status === 401 && !path.startsWith('/auth/')) {
      clearToken();
      window.dispatchEvent(new Event('auth:logout'));
    }
    throw err;
  }
  return data;
}

export const formatMoney = (n) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

export const formatDateTime = (d) =>
  new Date(d).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
