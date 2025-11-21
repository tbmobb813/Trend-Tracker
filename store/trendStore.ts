import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trend, SavedTrend } from '@/types';
import { fetchTrends as fetchTrendsService } from '@/services/trend.service';

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

// mock data moved to services/trend.service.ts

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
        try {
          const trends = await fetchTrendsService();
          set({ trends, isLoading: false });
        } catch (err) {
          // Keep isLoading false on error; in a real app surface error to UI
          set({ isLoading: false });
          // eslint-disable-next-line no-console
          console.error('Failed to fetch trends', err);
        }
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
