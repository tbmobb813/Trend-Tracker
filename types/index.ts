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
