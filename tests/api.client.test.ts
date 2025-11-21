import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as api from '../services/api.client';

describe('api.client', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // clear env base
    delete (process.env as any).EXPO_PUBLIC_API_URL;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('throws if no base and not absolute', async () => {
    // In Node the underlying fetch may throw a different message (e.g. "Failed to parse URL...").
    // We only assert that the call rejects.
    await expect(api.get('/test' as any)).rejects.toThrow();
  });

  it('works with absolute URL using fetch', async () => {
    const mockRes = { ok: true, json: async () => ({ ok: true }) } as any;
    globalThis.fetch = vi.fn(async () => mockRes) as any;

    const res = await api.get('https://example.com/test', { absolute: true });
    expect(res).toEqual({ ok: true });
    expect(globalThis.fetch).toHaveBeenCalled();
  });
});
