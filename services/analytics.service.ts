import { Insight } from '@/types';
import api from '@/services/api.client';

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Video Content Dominates',
    description: 'Short-form videos are getting 3x more engagement than static posts across all platforms.',
    category: 'Marketing',
    date: '2024-01-15',
  },
  {
    id: '2',
    title: 'AI Tools Surge',
    description: 'ChatGPT usage among content creators has increased by 400% in the last quarter.',
    category: 'Technology',
    date: '2024-01-14',
  },
  {
    id: '3',
    title: 'Sustainable Brands Win',
    description: 'Eco-friendly product searches are up 85% year-over-year, signaling a major shift in consumer preferences.',
    category: 'Lifestyle',
    date: '2024-01-13',
  },
  {
    id: '4',
    title: 'TikTok Shop Boom',
    description: 'Live shopping on TikTok is projected to reach $20B in sales this year.',
    category: 'Ecommerce',
    date: '2024-01-12',
  },
  {
    id: '5',
    title: 'Mental Health Content',
    description: 'Mental wellness content is seeing unprecedented engagement, particularly among Gen Z audiences.',
    category: 'Health',
    date: '2024-01-11',
  },
];

export async function fetchInsights(): Promise<Insight[]> {
  if (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_URL) {
    try {
      return await api.get<Insight[]>('/insights');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Failed to fetch insights from API, falling back to mock data', err);
    }
  }

  // dev fallback
  return mockInsights;
}

export default { fetchInsights };
