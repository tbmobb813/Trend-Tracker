import { describe, it, expect } from 'vitest';
import { fetchTrends } from '../services/trend.service';

describe('trend.service', () => {
  it('returns an array of trends', async () => {
    const trends = await fetchTrends();
    expect(Array.isArray(trends)).toBe(true);
    expect(trends.length).toBeGreaterThan(0);
    expect(trends[0]).toHaveProperty('id');
  });
});
