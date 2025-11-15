import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trend, SavedTrend } from '@/types';

interface TrendStore {
  trends: Trend[];
  savedTrends: SavedTrend[];
  selectedCategory: string;
  searchQuery: string;
  isLoading: boolean;

  // Actions
  fetchTrends: () => Promise<void>;
  saveTrend: (trend: Trend) => void;
  removeSavedTrend: (trendId: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  isTrendSaved: (trendId: string) => boolean;
}

// Mock trends data
const mockTrends: Trend[] = [
  {
    id: '1',
    name: 'AI-Generated Content',
    category: 'Technology',
    description: 'The rise of AI tools like ChatGPT and Midjourney is transforming content creation across all platforms.',
    growth: 156,
    mentions: 45820,
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    relatedTopics: ['ChatGPT', 'Midjourney', 'AI Art', 'Automation'],
    history: [20, 35, 50, 78, 100, 135, 156],
  },
  {
    id: '2',
    name: 'Sustainable Living',
    category: 'Lifestyle',
    description: 'Growing interest in eco-friendly products, zero-waste lifestyles, and sustainable fashion choices.',
    growth: 89,
    mentions: 32150,
    platforms: ['Instagram', 'TikTok', 'Pinterest'],
    relatedTopics: ['Zero Waste', 'Eco-Friendly', 'Thrifting', 'Composting'],
    history: [45, 52, 60, 68, 75, 82, 89],
  },
  {
    id: '3',
    name: 'Short-Form Video Marketing',
    category: 'Marketing',
    description: 'Brands are shifting focus to bite-sized video content for higher engagement and viral potential.',
    growth: 142,
    mentions: 58930,
    platforms: ['TikTok', 'Instagram', 'YouTube Shorts'],
    relatedTopics: ['Reels', 'TikTok Marketing', 'Video Strategy', 'Viral Content'],
    history: [30, 50, 70, 95, 115, 130, 142],
  },
  {
    id: '4',
    name: 'Remote Work Tools',
    category: 'Technology',
    description: 'Increased demand for collaboration software, productivity apps, and virtual office solutions.',
    growth: 67,
    mentions: 28440,
    platforms: ['LinkedIn', 'Twitter', 'YouTube'],
    relatedTopics: ['Slack', 'Zoom', 'Asana', 'Productivity'],
    history: [55, 58, 61, 63, 65, 66, 67],
  },
  {
    id: '5',
    name: 'Health Tech Wearables',
    category: 'Health',
    description: 'Smart watches and fitness trackers continue to dominate the personal health monitoring market.',
    growth: 94,
    mentions: 41260,
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    relatedTopics: ['Apple Watch', 'Fitbit', 'Whoop', 'Health Tracking'],
    history: [60, 68, 74, 80, 86, 90, 94],
  },
  {
    id: '6',
    name: 'Plant-Based Diet',
    category: 'Food',
    description: 'Rising popularity of vegan and vegetarian recipes, meal plans, and restaurant options.',
    growth: 78,
    mentions: 36780,
    platforms: ['TikTok', 'Instagram', 'Pinterest'],
    relatedTopics: ['Vegan Recipes', 'Plant Protein', 'Veganism', 'Healthy Eating'],
    history: [50, 56, 62, 68, 72, 75, 78],
  },
  {
    id: '7',
    name: 'NFT Art',
    category: 'Technology',
    description: 'Digital art and collectibles on blockchain platforms continue to attract creators and collectors.',
    growth: 45,
    mentions: 19320,
    platforms: ['Twitter', 'Discord', 'Instagram'],
    relatedTopics: ['Blockchain', 'Crypto Art', 'Digital Collectibles', 'OpenSea'],
    history: [80, 75, 65, 55, 50, 47, 45],
  },
  {
    id: '8',
    name: 'Mental Health Awareness',
    category: 'Health',
    description: 'Open conversations about mental wellness, therapy, and self-care practices are becoming mainstream.',
    growth: 112,
    mentions: 52180,
    platforms: ['TikTok', 'Instagram', 'Twitter'],
    relatedTopics: ['Therapy', 'Self-Care', 'Mindfulness', 'Mental Wellness'],
    history: [40, 55, 70, 82, 95, 105, 112],
  },
  {
    id: '9',
    name: 'E-commerce Live Shopping',
    category: 'Ecommerce',
    description: 'Interactive live-stream shopping events are revolutionizing online retail experiences.',
    growth: 128,
    mentions: 44590,
    platforms: ['TikTok', 'Instagram', 'Amazon'],
    relatedTopics: ['Live Shopping', 'Social Commerce', 'TikTok Shop', 'Shoppable Videos'],
    history: [25, 45, 65, 85, 100, 115, 128],
  },
  {
    id: '10',
    name: 'Micro-Learning',
    category: 'Education',
    description: 'Bite-sized educational content and quick skill tutorials are reshaping how people learn online.',
    growth: 101,
    mentions: 38920,
    platforms: ['TikTok', 'YouTube', 'Instagram'],
    relatedTopics: ['EdTech', 'Online Courses', 'Skill Learning', 'Educational Content'],
    history: [30, 45, 60, 72, 85, 93, 101],
  },
  {
    id: '11',
    name: 'Creator Economy',
    category: 'Marketing',
    description: 'Individual content creators are building sustainable businesses through multiple revenue streams.',
    growth: 134,
    mentions: 47650,
    platforms: ['YouTube', 'TikTok', 'Patreon'],
    relatedTopics: ['Monetization', 'Content Creation', 'Influencer Marketing', 'Personal Branding'],
    history: [50, 70, 85, 100, 115, 125, 134],
  },
  {
    id: '12',
    name: 'Home Automation',
    category: 'Technology',
    description: 'Smart home devices and IoT technology are making homes more connected and efficient.',
    growth: 73,
    mentions: 31480,
    platforms: ['YouTube', 'Reddit', 'Instagram'],
    relatedTopics: ['Smart Home', 'IoT', 'Home Assistant', 'Alexa'],
    history: [55, 60, 64, 67, 70, 72, 73],
  },
];

export const useTrendStore = create<TrendStore>()(
  persist(
    (set, get) => ({
      trends: [],
      savedTrends: [],
      selectedCategory: 'All',
      searchQuery: '',
      isLoading: false,

      fetchTrends: async () => {
        set({ isLoading: true });

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));

        set({
          trends: mockTrends,
          isLoading: false
        });
      },

      saveTrend: (trend: Trend) => {
        const savedTrends = get().savedTrends;

        // Check if already saved
        if (savedTrends.some(t => t.id === trend.id)) {
          return;
        }

        const savedTrend: SavedTrend = {
          id: trend.id,
          name: trend.name,
          dateAdded: new Date().toISOString(),
          category: trend.category,
          growth: trend.growth,
        };

        set({ savedTrends: [...savedTrends, savedTrend] });
      },

      removeSavedTrend: (trendId: string) => {
        set({
          savedTrends: get().savedTrends.filter(t => t.id !== trendId)
        });
      },

      setSelectedCategory: (category: string) => {
        set({ selectedCategory: category });
      },

      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },

      isTrendSaved: (trendId: string) => {
        return get().savedTrends.some(t => t.id === trendId);
      },
    }),
    {
      name: 'trend-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist saved trends, not the full trends list
      partialize: (state) => ({
        savedTrends: state.savedTrends,
        selectedCategory: state.selectedCategory,
      }),
    }
  )
);
