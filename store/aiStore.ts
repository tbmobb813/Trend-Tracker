import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AIConfig,
  VoiceToneProfile,
  BrandProfile,
  AIGenerationResult,
  GeneratedImage,
  ReasoningChain,
} from '../types';
import { aiService } from '../services/ai.service';
import { voiceToneService } from '../services/voiceTone.service';
import { imageGenerationService } from '../services/imageGeneration.service';

interface AIStore {
  // AI Configuration
  config: AIConfig | null;
  isConfigured: boolean;

  // Voice/Tone Profiles
  voiceToneProfiles: VoiceToneProfile[];
  selectedVoiceToneProfile: VoiceToneProfile | null;
  customVoiceToneProfiles: VoiceToneProfile[];

  // Brand Profiles
  brandProfiles: BrandProfile[];
  selectedBrandProfile: BrandProfile | null;
  customBrandProfiles: BrandProfile[];

  // Generated Content History
  generationHistory: AIGenerationResult[];
  generatedImages: GeneratedImage[];
  reasoningChains: ReasoningChain[];

  // Loading States
  isGenerating: boolean;
  currentGenerationStep: string | null;

  // Statistics
  totalGenerations: number;
  totalTokensUsed: number;
  totalCostIncurred: number;
  // Convenience aggregated statistics used by UI
  statistics?: {
    totalCost: number;
    totalGenerations: number;
    totalTokens?: number;
  };

  // Actions - Configuration
  setConfig: (config: AIConfig) => void;
  clearConfig: () => void;
  updateConfig: (updates: Partial<AIConfig>) => void;

  // Actions - Voice/Tone Profiles
  loadPresetProfiles: () => void;
  selectVoiceToneProfile: (profileId: string | null) => void;
  addCustomVoiceToneProfile: (profile: VoiceToneProfile) => void;
  updateVoiceToneProfile: (profileId: string, updates: Partial<VoiceToneProfile>) => void;
  deleteVoiceToneProfile: (profileId: string) => void;

  // Actions - Brand Profiles
  loadPresetBrandProfiles: () => void;
  selectBrandProfile: (profileId: string | null) => void;
  addCustomBrandProfile: (profile: BrandProfile) => void;
  updateBrandProfile: (profileId: string, updates: Partial<BrandProfile>) => void;
  deleteBrandProfile: (profileId: string) => void;

  // Actions - Content Generation
  generateContent: (
    toolType: string,
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      saveToHistory?: boolean;
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ) => Promise<string>;

  generateWithChain: (
    chainId: string,
    inputs: Record<string, any>
  ) => Promise<string>;

  generateWithReasoning: (
    goal: string,
    context: string
  ) => Promise<ReasoningChain>;

  generateImage: (
    prompt: string,
    platform: string,
    style: string
  ) => Promise<GeneratedImage>;

  // Actions - History Management
  saveToHistory: (result: AIGenerationResult) => void;
  clearHistory: () => void;
  deleteFromHistory: (id: string) => void;
  getHistoryByTool: (toolType: string) => AIGenerationResult[];

  // Actions - Statistics
  updateStatistics: (tokens: number, cost: number) => void;
  resetStatistics: () => void;
}

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // Initial State
      config: null,
      isConfigured: false,

      voiceToneProfiles: [],
      selectedVoiceToneProfile: null,
      customVoiceToneProfiles: [],

      brandProfiles: [],
      selectedBrandProfile: null,
      customBrandProfiles: [],

      generationHistory: [],
      generatedImages: [],
      reasoningChains: [],

      isGenerating: false,
      currentGenerationStep: null,

      totalGenerations: 0,
      totalTokensUsed: 0,
      totalCostIncurred: 0,
  statistics: { totalCost: 0, totalGenerations: 0, totalTokens: 0 },

      // Configuration Actions
      setConfig: (config) => {
        aiService.initialize(config);
        imageGenerationService.initialize(config);

        set({
          config,
          isConfigured: true,
        });
      },

      clearConfig: () => {
        set({
          config: null,
          isConfigured: false,
        });
      },

      updateConfig: (updates) => {
        const currentConfig = get().config;
        if (!currentConfig) return;

        const newConfig = { ...currentConfig, ...updates };
        get().setConfig(newConfig);
      },

      // Voice/Tone Profile Actions
      loadPresetProfiles: () => {
        const presets = voiceToneService.getPresetProfiles();
        set({ voiceToneProfiles: presets });
      },

      selectVoiceToneProfile: (profileId) => {
        if (!profileId) {
          set({ selectedVoiceToneProfile: null });
          return;
        }

        const allProfiles = [
          ...get().voiceToneProfiles,
          ...get().customVoiceToneProfiles,
        ];

        const profile = allProfiles.find((p) => p.id === profileId);
        set({ selectedVoiceToneProfile: profile || null });
      },

      addCustomVoiceToneProfile: (profile) => {
        set((state) => ({
          customVoiceToneProfiles: [...state.customVoiceToneProfiles, profile],
        }));
      },

      updateVoiceToneProfile: (profileId, updates) => {
        set((state) => ({
          customVoiceToneProfiles: state.customVoiceToneProfiles.map((p) =>
            p.id === profileId ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteVoiceToneProfile: (profileId) => {
        set((state) => ({
          customVoiceToneProfiles: state.customVoiceToneProfiles.filter(
            (p) => p.id !== profileId
          ),
          selectedVoiceToneProfile:
            state.selectedVoiceToneProfile?.id === profileId
              ? null
              : state.selectedVoiceToneProfile,
        }));
      },

      // Brand Profile Actions
      loadPresetBrandProfiles: () => {
        const presets = voiceToneService.getPresetBrandProfiles();
        set({ brandProfiles: presets });
      },

      selectBrandProfile: (profileId) => {
        if (!profileId) {
          set({ selectedBrandProfile: null });
          return;
        }

        const allProfiles = [...get().brandProfiles, ...get().customBrandProfiles];
        const profile = allProfiles.find((p) => p.id === profileId);
        set({ selectedBrandProfile: profile || null });
      },

      addCustomBrandProfile: (profile) => {
        set((state) => ({
          customBrandProfiles: [...state.customBrandProfiles, profile],
        }));
      },

      updateBrandProfile: (profileId, updates) => {
        set((state) => ({
          customBrandProfiles: state.customBrandProfiles.map((p) =>
            p.id === profileId ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteBrandProfile: (profileId) => {
        set((state) => ({
          customBrandProfiles: state.customBrandProfiles.filter(
            (p) => p.id !== profileId
          ),
          selectedBrandProfile:
            state.selectedBrandProfile?.id === profileId
              ? null
              : state.selectedBrandProfile,
        }));
      },

      // Content Generation Actions
      generateContent: async (toolType, systemPrompt, userPrompt, options = {}) => {
        const { config, selectedVoiceToneProfile, selectedBrandProfile } = get();

        if (!config) {
          throw new Error('AI not configured. Please set up your API keys in settings.');
        }

        set({ isGenerating: true, currentGenerationStep: `Generating ${toolType}...` });

        try {
          const voice = options.voiceToneProfile ?? selectedVoiceToneProfile ?? undefined;
          const brand = options.brandProfile ?? selectedBrandProfile ?? undefined;

          const result = await aiService.generateText(
            systemPrompt,
            userPrompt,
            {
              temperature: options.temperature,
              maxTokens: options.maxTokens,
              voiceToneProfile: voice,
              brandProfile: brand,
            }
          );

          // Save to history if requested
          if (options.saveToHistory !== false) {
            const historyItem: AIGenerationResult = {
              id: `gen_${Date.now()}`,
              toolType,
              prompt: userPrompt,
              result: result.text,
              voiceToneProfileId: voice?.id,
              brandProfileId: brand?.id,
              createdAt: new Date().toISOString(),
              tokens: result.tokens,
              cost: result.cost,
            };

            get().saveToHistory(historyItem);
          }

          // Update statistics
          get().updateStatistics(result.tokens, result.cost);

          return result.text;
        } finally {
          set({ isGenerating: false, currentGenerationStep: null });
        }
      },

      generateWithChain: async (chainId, inputs) => {
        set({ isGenerating: true, currentGenerationStep: 'Initializing chain...' });

        // Chain implementation would go here
        throw new Error('Chain generation not yet implemented');
      },

      generateWithReasoning: async (goal, context) => {
        set({ isGenerating: true, currentGenerationStep: 'Step 1: Analysis...' });

        // Reasoning implementation would go here
        throw new Error('Reasoning generation not yet implemented');
      },

      generateImage: async (prompt, platform, style) => {
        const { config } = get();

        if (!config) {
          throw new Error('AI not configured');
        }

        set({ isGenerating: true, currentGenerationStep: 'Generating image...' });

        try {
          const request: any = {
            id: `img_${Date.now()}`,
            prompt,
            platform,
            style,
            dimensions: { width: 1024, height: 1024 },
          };

          const image = await imageGenerationService.generateImage(request);

          set((state) => ({
            generatedImages: [...state.generatedImages, image],
          }));

          return image;
        } finally {
          set({ isGenerating: false, currentGenerationStep: null });
        }
      },

      // History Management
      saveToHistory: (result) => {
        set((state) => ({
          generationHistory: [result, ...state.generationHistory].slice(0, 100), // Keep last 100
          totalGenerations: state.totalGenerations + 1,
          statistics: {
            totalCost: state.statistics?.totalCost || 0,
            totalGenerations: (state.statistics?.totalGenerations || 0) + 1,
            totalTokens: state.statistics?.totalTokens || 0,
          },
        }));
      },

      clearHistory: () => {
        set({ generationHistory: [] });
      },

      deleteFromHistory: (id) => {
        set((state) => ({
          generationHistory: state.generationHistory.filter((item) => item.id !== id),
        }));
      },

      getHistoryByTool: (toolType) => {
        return get().generationHistory.filter((item) => item.toolType === toolType);
      },

      // Statistics
      updateStatistics: (tokens, cost) => {
        set((state) => {
          const totalTokensUsed = state.totalTokensUsed + tokens;
          const totalCostIncurred = state.totalCostIncurred + cost;
          return {
            totalTokensUsed,
            totalCostIncurred,
            statistics: {
              totalCost: totalCostIncurred,
              totalGenerations: state.statistics?.totalGenerations || state.totalGenerations || 0,
              totalTokens: totalTokensUsed,
            },
          };
        });
      },

      resetStatistics: () => {
        set({
          totalGenerations: 0,
          totalTokensUsed: 0,
          totalCostIncurred: 0,
        });
      },
    }),
    {
      name: 'ai-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        config: state.config,
        customVoiceToneProfiles: state.customVoiceToneProfiles,
        customBrandProfiles: state.customBrandProfiles,
        selectedVoiceToneProfile: state.selectedVoiceToneProfile,
        selectedBrandProfile: state.selectedBrandProfile,
        generationHistory: state.generationHistory.slice(0, 50), // Persist only last 50
        totalGenerations: state.totalGenerations,
        totalTokensUsed: state.totalTokensUsed,
        totalCostIncurred: state.totalCostIncurred,
      }),
    }
  )
);
