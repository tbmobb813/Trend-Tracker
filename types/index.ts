export interface Trend {
  id: string;
  name: string;
  category: string;
  description: string;
  growth: number;
  mentions: number;
  platforms: string[];
  relatedTopics: string[];
  history: number[];
}

export interface SavedTrend {
  id: string;
  name: string;
  dateAdded: string;
  category: string;
  growth: number;
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
}

export interface TikTokHook {
  id: string;
  title: string;
  description: string;
  category: string;
  engagement: number;
}

export interface ThreadTemplate {
  id: string;
  title: string;
  format: string;
  example: string;
  structure: string[];
}

export interface CaptionTemplate {
  id: string;
  template: string;
  platform: string;
  category: string;
}

export interface HashtagGroup {
  id: string;
  category: string;
  hashtags: string[];
}

export interface PostTroubleshooting {
  id: string;
  problem: string;
  solutions: string[];
}

export interface ThumbnailTemplate {
  id: string;
  name: string;
  description: string;
  elements: string[];
  bestFor: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailConcept: string;
  estimatedCTR: number;
}

export interface EcommerceProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  salesPotential: number;
  marketingAngles: string[];
}

export interface DigitalProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  bestFor: string;
}

// AI Configuration Types
export interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

export interface VoiceToneProfile {
  id: string;
  name: string;
  description: string;
  characteristics: {
    formality: 'casual' | 'professional' | 'formal';
    enthusiasm: 'low' | 'medium' | 'high';
    humor: 'none' | 'subtle' | 'playful';
    empathy: 'low' | 'medium' | 'high';
    expertise: 'beginner-friendly' | 'intermediate' | 'expert';
  };
  vocabularyPreferences: string[];
  sentenceStructure: 'short' | 'medium' | 'long' | 'varied';
  punctuationStyle: 'minimal' | 'standard' | 'expressive';
  emojiUsage: 'none' | 'minimal' | 'moderate' | 'heavy';
  examplePhrases: string[];
  avoidPhrases: string[];
}

export interface BrandProfile {
  id: string;
  name: string;
  industry: string;
  targetAudience: string;
  coreValues: string[];
  voiceToneProfile: VoiceToneProfile;
  brandGuidelines: string;
  competitorAnalysis?: string;
  uniqueSellingPoints: string[];
}

// New Content Tool Types
export interface ScriptTemplate {
  id: string;
  title: string;
  duration: string;
  structure: ScriptSection[];
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'General';
  category: string;
}

export interface ScriptSection {
  name: string;
  duration: string;
  content: string;
  tips: string[];
}

export interface CarouselPost {
  id: string;
  title: string;
  slides: CarouselSlide[];
  platform: 'Instagram' | 'LinkedIn' | 'Facebook';
  category: string;
  designTips: string[];
}

export interface CarouselSlide {
  slideNumber: number;
  heading: string;
  content: string;
  visualSuggestion: string;
}

export interface EmailSequence {
  id: string;
  name: string;
  goal: string;
  emails: EmailTemplate[];
  category: string;
  sendSchedule: string[];
}

export interface EmailTemplate {
  emailNumber: number;
  subject: string;
  preheader: string;
  body: string;
  cta: string;
  purpose: string;
}

export interface AdCopy {
  id: string;
  platform: 'Facebook' | 'Google' | 'LinkedIn' | 'Twitter' | 'TikTok';
  objective: string;
  headline: string;
  description: string;
  cta: string;
  targetAudience: string;
  category: string;
}

// Prompt Engineering Types
export interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  userPromptTemplate: string;
  variables: PromptVariable[];
  examples?: PromptExample[];
  chainable: boolean;
  nextSteps?: string[];
}

export interface PromptVariable {
  name: string;
  type: 'string' | 'number' | 'array' | 'object';
  required: boolean;
  description: string;
  defaultValue?: any;
}

export interface PromptExample {
  input: Record<string, any>;
  output: string;
}

export interface PromptChain {
  id: string;
  name: string;
  description: string;
  steps: PromptChainStep[];
  finalOutputFormat: string;
}

export interface PromptChainStep {
  stepNumber: number;
  promptTemplateId: string;
  inputMapping: Record<string, string>; // Maps variables to previous step outputs
  outputKey: string;
  requiresUserInput: boolean;
}

// Multi-Step Reasoning Types
export interface ReasoningStep {
  stepNumber: number;
  type: 'analysis' | 'research' | 'ideation' | 'refinement' | 'validation';
  prompt: string;
  response?: string;
  metadata?: Record<string, any>;
}

export interface ReasoningChain {
  id: string;
  goal: string;
  steps: ReasoningStep[];
  finalOutput?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  startedAt?: string;
  completedAt?: string;
}

// Image Generation Types
export interface ImageGenerationRequest {
  id: string;
  prompt: string;
  style: 'realistic' | 'illustration' | 'minimalist' | 'bold' | 'vintage' | 'modern';
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'LinkedIn' | 'General';
  dimensions: {
    width: number;
    height: number;
  };
  colorScheme?: string[];
  includeText?: string;
  brandElements?: string[];
}

export interface GeneratedImage {
  id: string;
  requestId: string;
  url: string;
  prompt: string;
  style: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

// AI Generation Result Types
export interface AIGenerationResult {
  id: string;
  toolType: string;
  prompt: string;
  result: string | object;
  voiceToneProfileId?: string;
  brandProfileId?: string;
  chainId?: string;
  createdAt: string;
  tokens?: number;
  cost?: number;
}

// Content Analysis Types
export interface ContentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  readabilityScore: number;
  keywordDensity: Record<string, number>;
  suggestedImprovements: string[];
  seoScore?: number;
  engagementPrediction?: number;
}
