import { create } from 'zustand';

interface AnalyticsState {
  metrics: {
    followers: {
      total: number;
      change: number;
    };
    engagement: {
      rate: number;
      change: number;
    };
    impressions: {
      total: number;
      change: number;
    };
    growth: {
      rate: number;
      change: number;
    };
    performanceData: {
      followers: {
        '7d': any[];
        '30d': any[];
        '90d': any[];
      };
      engagement: {
        '7d': any[];
        '30d': any[];
        '90d': any[];
      };
      impressions: {
        '7d': any[];
        '30d': any[];
        '90d': any[];
      };
      growth: {
        '7d': any[];
        '30d': any[];
        '90d': any[];
      };
    };
  };
  platformData: {
    instagram: {
      followers: number;
      engagement: number;
      change: number;
    };
    twitter: {
      followers: number;
      engagement: number;
      change: number;
    };
    youtube: {
      followers: number;
      engagement: number;
      change: number;
    };
    facebook: {
      followers: number;
      engagement: number;
      change: number;
    };
  };
  contentPerformance: any[];
  fetchAnalytics: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  metrics: {
    followers: {
      total: 12458,
      change: 5.2,
    },
    engagement: {
      rate: 3.8,
      change: 0.7,
    },
    impressions: {
      total: 45789,
      change: 12.3,
    },
    growth: {
      rate: 4.5,
      change: -1.2,
    },
    performanceData: {
      followers: {
        '7d': [
          { date: '2023-06-01', value: 11800 },
          { date: '2023-06-02', value: 11900 },
          { date: '2023-06-03', value: 12000 },
          { date: '2023-06-04', value: 12100 },
          { date: '2023-06-05', value: 12200 },
          { date: '2023-06-06', value: 12350 },
          { date: '2023-06-07', value: 12458 },
        ],
        '30d': [
          { date: '2023-05-07', value: 10500 },
          { date: '2023-05-14', value: 11000 },
          { date: '2023-05-21', value: 11500 },
          { date: '2023-05-28', value: 12000 },
          { date: '2023-06-07', value: 12458 },
        ],
        '90d': [
          { date: '2023-03-07', value: 8000 },
          { date: '2023-04-07', value: 9500 },
          { date: '2023-05-07', value: 11000 },
          { date: '2023-06-07', value: 12458 },
        ],
      },
      engagement: {
        '7d': [
          { date: '2023-06-01', value: 3.2 },
          { date: '2023-06-02', value: 3.3 },
          { date: '2023-06-03', value: 3.5 },
          { date: '2023-06-04', value: 3.4 },
          { date: '2023-06-05', value: 3.6 },
          { date: '2023-06-06', value: 3.7 },
          { date: '2023-06-07', value: 3.8 },
        ],
        '30d': [
          { date: '2023-05-07', value: 3.0 },
          { date: '2023-05-14', value: 3.2 },
          { date: '2023-05-21', value: 3.4 },
          { date: '2023-05-28', value: 3.6 },
          { date: '2023-06-07', value: 3.8 },
        ],
        '90d': [
          { date: '2023-03-07', value: 2.5 },
          { date: '2023-04-07', value: 2.8 },
          { date: '2023-05-07', value: 3.2 },
          { date: '2023-06-07', value: 3.8 },
        ],
      },
      impressions: {
        '7d': [
          { date: '2023-06-01', value: 40000 },
          { date: '2023-06-02', value: 41000 },
          { date: '2023-06-03', value: 42000 },
          { date: '2023-06-04', value: 43000 },
          { date: '2023-06-05', value: 44000 },
          { date: '2023-06-06', value: 45000 },
          { date: '2023-06-07', value: 45789 },
        ],
        '30d': [
          { date: '2023-05-07', value: 30000 },
          { date: '2023-05-14', value: 35000 },
          { date: '2023-05-21', value: 40000 },
          { date: '2023-05-28', value: 43000 },
          { date: '2023-06-07', value: 45789 },
        ],
        '90d': [
          { date: '2023-03-07', value: 20000 },
          { date: '2023-04-07', value: 25000 },
          { date: '2023-05-07', value: 35000 },
          { date: '2023-06-07', value: 45789 },
        ],
      },
      growth: {
        '7d': [
          { date: '2023-06-01', value: 4.8 },
          { date: '2023-06-02', value: 4.7 },
          { date: '2023-06-03', value: 4.6 },
          { date: '2023-06-04', value: 4.6 },
          { date: '2023-06-05', value: 4.5 },
          { date: '2023-06-06', value: 4.5 },
          { date: '2023-06-07', value: 4.5 },
        ],
        '30d': [
          { date: '2023-05-07', value: 5.2 },
          { date: '2023-05-14', value: 5.0 },
          { date: '2023-05-21', value: 4.8 },
          { date: '2023-05-28', value: 4.6 },
          { date: '2023-06-07', value: 4.5 },
        ],
        '90d': [
          { date: '2023-03-07', value: 6.0 },
          { date: '2023-04-07', value: 5.5 },
          { date: '2023-05-07', value: 5.0 },
          { date: '2023-06-07', value: 4.5 },
        ],
      },
    },
  },
  platformData: {
    instagram: {
      followers: 8245,
      engagement: 4.2,
      change: 3.5,
    },
    twitter: {
      followers: 2150,
      engagement: 2.8,
      change: 1.2,
    },
    youtube: {
      followers: 1563,
      engagement: 6.7,
      change: 8.4,
    },
    facebook: {
      followers: 500,
      engagement: 1.5,
      change: -2.3,
    },
  },
  contentPerformance: [
    {
      id: '1',
      title: '10 Tips for Better Content Creation',
      thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29udGVudCUyMGNyZWF0aW9ufGVufDB8fDB8fHww',
      platform: 'Instagram',
      date: 'Jun 5, 2023',
      metrics: {
        likes: 245,
        comments: 32,
        views: 1250,
      },
    },
    {
      id: '2',
      title: 'How to Grow Your Social Media Following',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c29jaWFsJTIwbWVkaWF8ZW58MHx8MHx8fDA%3D',
      platform: 'Twitter',
      date: 'Jun 3, 2023',
      metrics: {
        likes: 189,
        comments: 24,
        views: 980,
      },
    },
    {
      id: '3',
      title: 'The Ultimate Guide to Video Marketing',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBtYXJrZXRpbmd8ZW58MHx8MHx8fDA%3D',
      platform: 'YouTube',
      date: 'May 28, 2023',
      metrics: {
        likes: 312,
        comments: 45,
        views: 2150,
      },
    },
  ],
  fetchAnalytics: () => {
    // In a real app, this would fetch data from an API
    // For now, we're using mock data
  },
}));
