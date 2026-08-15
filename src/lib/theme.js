export const THEME_KEY = 'glory-catering-theme';

export const THEME_COLORS = { light: '#ffffff', dark: '#080808' };

export function getSavedTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark' || t === 'system') return t;
  } catch {
    return 'system';
  }
  return 'system';
}

export function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function resolveTheme(pref) {
  return pref === 'system' ? getSystemTheme() : pref;
}

export function applyTheme(pref) {
  const resolved = resolveTheme(pref);
  document.documentElement.dataset.theme = resolved;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[resolved]);
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    return resolved;
  }
  return resolved;
}
