import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DraftPost {
  id: string;
  caption: string;
  hashtags: string[];
  mediaFiles: string[];
  platforms: string[];
  createdAt: string;
  lastModified: string;
}

interface DraftState {
  drafts: DraftPost[];
  addDraft: (draft: Omit<DraftPost, 'id' | 'createdAt' | 'lastModified'>) => void;
  updateDraft: (id: string, draft: Partial<DraftPost>) => void;
  deleteDraft: (id: string) => void;
  getDraft: (id: string) => DraftPost | undefined;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set, get) => ({
      drafts: [],
      
      addDraft: (draft) => {
        const newDraft: DraftPost = {
          ...draft,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
        
        set((state) => ({
          drafts: [newDraft, ...state.drafts]
        }));
      },
      
      updateDraft: (id, draft) => {
        set((state) => ({
          drafts: state.drafts.map((d) => 
            d.id === id 
              ? { 
                  ...d, 
                  ...draft, 
                  lastModified: new Date().toISOString() 
                }
              : d
          )
        }));
      },
      
      deleteDraft: (id) => {
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id)
        }));
      },
      
      getDraft: (id) => {
        return get().drafts.find((d) => d.id === id);
      },
    }),
    {
      name: 'draft-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
