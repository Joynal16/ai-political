export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
export const FILE_URL = process.env.NEXT_PUBLIC_FILE_URL || 'http://localhost:5000';

export function token() { return typeof window === 'undefined' ? '' : localStorage.getItem('poster_token') || ''; }
export function saveSession(data: any) { localStorage.setItem('poster_token', data.token); localStorage.setItem('poster_user', JSON.stringify(data.user)); }
export function user() { if (typeof window === 'undefined') return null; try { return JSON.parse(localStorage.getItem('poster_user') || 'null'); } catch { return null; } }
export function logout() { localStorage.removeItem('poster_token'); localStorage.removeItem('poster_user'); window.location.href = '/'; }
export async function api(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const t = token(); if (t) headers.set('Authorization', `Bearer ${t}`);
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || 'Request failed');
  return data;
}
