import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScheduledPost {
  id: string;
  caption?: string;
  mediaFiles?: string[];
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: string;
  contentType: string;
}

interface CalendarState {
  scheduledPosts: ScheduledPost[];
  currentMonth: string;
  addScheduledPost: (post: ScheduledPost) => void;
  updateScheduledPost: (id: string, post: Partial<ScheduledPost>) => void;
  deleteScheduledPost: (id: string) => void;
  setCurrentMonth: (month: string) => void;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      scheduledPosts: [
        {
          id: '1',
          caption: 'Excited to announce our new product launch! Stay tuned for more details. #NewProduct #ComingSoon',
          mediaFiles: ['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdCUyMGxhdW5jaHxlbnwwfHwwfHx8MA%3D%3D'],
          platforms: ['Instagram', 'Twitter'],
          scheduledDate: '2023-06-15',
          scheduledTime: '2023-06-15T09:00:00.000Z',
          status: 'scheduled',
          contentType: 'image',
        },
        {
          id: '2',
          caption: 'Check out our latest blog post on content marketing strategies for 2023!',
          mediaFiles: [],
          platforms: ['Twitter', 'LinkedIn'],
          scheduledDate: '2023-06-18',
          scheduledTime: '2023-06-18T14:30:00.000Z',
          status: 'scheduled',
          contentType: 'text',
        },
        {
          id: '3',
          caption: 'Behind the scenes look at our team working on the next big thing!',
          mediaFiles: ['https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbSUyMHdvcmtpbmd8ZW58MHx8MHx8fDA%3D'],
          platforms: ['Instagram'],
          scheduledDate: '2023-06-20',
          scheduledTime: '2023-06-20T11:15:00.000Z',
          status: 'scheduled',
          contentType: 'image',
        },
      ],
      currentMonth: new Date().toISOString(),
      
      addScheduledPost: (post) => {
        set((state) => ({
          scheduledPosts: [...state.scheduledPosts, post]
        }));
      },
      
      updateScheduledPost: (id, post) => {
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((p) => 
            p.id === id ? { ...p, ...post } : p
          )
        }));
      },
      
      deleteScheduledPost: (id) => {
        set((state) => ({
          scheduledPosts: state.scheduledPosts.filter((p) => p.id !== id)
        }));
      },
      
      setCurrentMonth: (month) => {
        set({ currentMonth: month });
      },
    }),
    {
      name: 'calendar-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
