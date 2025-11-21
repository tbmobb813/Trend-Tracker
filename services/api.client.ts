// Minimal API client wrapper.
// Uses EXPO_PUBLIC_API_URL when available; in its absence callers should
// handle fallbacks (this keeps the client zero-config for development).

export type RequestOptions = RequestInit & { absolute?: boolean };

const base = typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_URL
  ? process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')
  : '';

export async function get<T = any>(path: string, opts?: RequestOptions): Promise<T> {
  const url = opts?.absolute ? path : `${base}${path}`;

  if (!url) {
    throw new Error('No API base URL configured. Set EXPO_PUBLIC_API_URL or call get with absolute:true');
  }

  const res = await fetch(url, { method: 'GET', ...opts });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export async function post<T = any>(path: string, body?: any, opts?: RequestOptions): Promise<T> {
  const url = opts?.absolute ? path : `${base}${path}`;
  if (!url) {
    throw new Error('No API base URL configured. Set EXPO_PUBLIC_API_URL or call post with absolute:true');
  }

  const res = await fetch(url, { method: 'POST', body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

export default { get, post };
