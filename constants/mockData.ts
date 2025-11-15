import { Insight } from '@/types';

export const insightsMock: Insight[] = [
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

export const categories = [
  'All',
  'Technology',
  'Marketing',
  'Lifestyle',
  'Food',
  'Health',
  'Ecommerce',
  'Education',
];

export const platforms = [
  { name: 'TikTok', icon: 'video' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'Pinterest', icon: 'pinterest' },
];
