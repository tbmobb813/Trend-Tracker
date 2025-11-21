import { VoiceToneProfile, BrandProfile } from '../types';

/**
 * Voice & Tone Customization Service
 *
 * Manages voice/tone profiles and brand profiles for consistent content generation
 * Includes pre-built profiles and custom profile creation
 */

export class VoiceToneService {
  /**
   * Get predefined voice/tone profiles
   */
  getPresetProfiles(): VoiceToneProfile[] {
    return [
      {
        id: 'casual_friendly',
        name: 'Casual & Friendly',
        description: 'Warm, approachable, conversational tone like talking to a friend',
        characteristics: {
          formality: 'casual',
          enthusiasm: 'medium',
          humor: 'subtle',
          empathy: 'high',
          expertise: 'beginner-friendly',
        },
        vocabularyPreferences: [
          'you',
          'we',
          'let\'s',
          'awesome',
          'great',
          'easy',
          'simple',
          'fun',
        ],
        sentenceStructure: 'short',
        punctuationStyle: 'standard',
        emojiUsage: 'moderate',
        examplePhrases: [
          'Hey there!',
          'Let\'s dive in',
          'Here\'s the thing...',
          'You got this!',
          'Pretty cool, right?',
        ],
        avoidPhrases: [
          'Furthermore',
          'Henceforth',
          'Notwithstanding',
          'In conclusion',
          'To whom it may concern',
        ],
      },
      {
        id: 'professional_authoritative',
        name: 'Professional & Authoritative',
        description: 'Expert voice with credibility and professional polish',
        characteristics: {
          formality: 'professional',
          enthusiasm: 'low',
          humor: 'none',
          empathy: 'medium',
          expertise: 'expert',
        },
        vocabularyPreferences: [
          'optimize',
          'strategic',
          'implement',
          'leverage',
          'insights',
          'data-driven',
          'metrics',
        ],
        sentenceStructure: 'medium',
        punctuationStyle: 'standard',
        emojiUsage: 'none',
        examplePhrases: [
          'Based on industry research',
          'Our analysis indicates',
          'Best practices suggest',
          'Strategic implementation of',
          'Optimizing for maximum results',
        ],
        avoidPhrases: [
          'Awesome!',
          'Super cool',
          'You guys',
          'Totally',
          'Kinda',
        ],
      },
      {
        id: 'inspirational_motivational',
        name: 'Inspirational & Motivational',
        description: 'Uplifting, empowering tone that drives action',
        characteristics: {
          formality: 'casual',
          enthusiasm: 'high',
          humor: 'subtle',
          empathy: 'high',
          expertise: 'intermediate',
        },
        vocabularyPreferences: [
          'transform',
          'empower',
          'breakthrough',
          'achieve',
          'unlock',
          'potential',
          'dream',
          'success',
        ],
        sentenceStructure: 'varied',
        punctuationStyle: 'expressive',
        emojiUsage: 'moderate',
        examplePhrases: [
          'You have the power to',
          'Imagine what\'s possible',
          'Your breakthrough starts here',
          'Transform your life today',
          'This is your moment',
        ],
        avoidPhrases: [
          'It\'s hard',
          'You can\'t',
          'Impossible',
          'Give up',
          'Too difficult',
        ],
      },
      {
        id: 'educational_teacherly',
        name: 'Educational & Clear',
        description: 'Clear, instructive tone focused on learning and understanding',
        characteristics: {
          formality: 'professional',
          enthusiasm: 'medium',
          humor: 'subtle',
          empathy: 'high',
          expertise: 'beginner-friendly',
        },
        vocabularyPreferences: [
          'learn',
          'understand',
          'discover',
          'step-by-step',
          'guide',
          'tutorial',
          'explain',
        ],
        sentenceStructure: 'medium',
        punctuationStyle: 'standard',
        emojiUsage: 'minimal',
        examplePhrases: [
          'Here\'s how it works',
          'Let me explain',
          'The key concept is',
          'Follow these steps',
          'To break it down',
        ],
        avoidPhrases: [
          'It\'s obvious',
          'Everyone knows',
          'Simply do this',
          'Just figure it out',
          'This is basic',
        ],
      },
      {
        id: 'witty_entertaining',
        name: 'Witty & Entertaining',
        description: 'Clever, fun, engaging tone with personality',
        characteristics: {
          formality: 'casual',
          enthusiasm: 'high',
          humor: 'playful',
          empathy: 'medium',
          expertise: 'intermediate',
        },
        vocabularyPreferences: [
          'literally',
          'honestly',
          'plot twist',
          'spoiler alert',
          'pro tip',
          'real talk',
        ],
        sentenceStructure: 'varied',
        punctuationStyle: 'expressive',
        emojiUsage: 'heavy',
        examplePhrases: [
          'Wait for it...',
          'Plot twist:',
          'Here\'s the tea',
          'No cap,',
          'And just like that,',
        ],
        avoidPhrases: [
          'In my professional opinion',
          'Therefore',
          'Subsequently',
          'As previously mentioned',
          'In accordance with',
        ],
      },
      {
        id: 'luxury_premium',
        name: 'Luxury & Premium',
        description: 'Sophisticated, exclusive tone for high-end brands',
        characteristics: {
          formality: 'formal',
          enthusiasm: 'low',
          humor: 'none',
          empathy: 'low',
          expertise: 'expert',
        },
        vocabularyPreferences: [
          'exclusive',
          'curated',
          'bespoke',
          'refined',
          'elegant',
          'sophisticated',
          'artisan',
          'premium',
        ],
        sentenceStructure: 'long',
        punctuationStyle: 'standard',
        emojiUsage: 'none',
        examplePhrases: [
          'Meticulously crafted',
          'An exclusive experience',
          'Refined elegance',
          'Uncompromising quality',
          'For the discerning',
        ],
        avoidPhrases: [
          'Cheap',
          'Budget',
          'Sale',
          'Hurry',
          'Limited time only',
        ],
      },
      {
        id: 'direct_no_nonsense',
        name: 'Direct & No-Nonsense',
        description: 'Straight to the point, no fluff, actionable',
        characteristics: {
          formality: 'professional',
          enthusiasm: 'low',
          humor: 'none',
          empathy: 'low',
          expertise: 'intermediate',
        },
        vocabularyPreferences: [
          'results',
          'action',
          'bottom line',
          'facts',
          'data',
          'proven',
          'effective',
        ],
        sentenceStructure: 'short',
        punctuationStyle: 'minimal',
        emojiUsage: 'none',
        examplePhrases: [
          'Here\'s what works:',
          'Bottom line:',
          'The facts are',
          'Cut through the noise',
          'Results speak',
        ],
        avoidPhrases: [
          'I think maybe',
          'Sort of',
          'Perhaps we could',
          'If you feel like it',
          'You might want to consider',
        ],
      },
      {
        id: 'empathetic_caring',
        name: 'Empathetic & Caring',
        description: 'Compassionate, understanding, supportive tone',
        characteristics: {
          formality: 'casual',
          enthusiasm: 'medium',
          humor: 'subtle',
          empathy: 'high',
          expertise: 'beginner-friendly',
        },
        vocabularyPreferences: [
          'understand',
          'support',
          'journey',
          'together',
          'care',
          'listen',
          'validate',
        ],
        sentenceStructure: 'medium',
        punctuationStyle: 'standard',
        emojiUsage: 'moderate',
        examplePhrases: [
          'I understand how you feel',
          'You\'re not alone in this',
          'It\'s okay to',
          'Take your time',
          'We\'re here for you',
        ],
        avoidPhrases: [
          'Just get over it',
          'It\'s not a big deal',
          'Stop complaining',
          'Man up',
          'You should be fine',
        ],
      },
    ];
  }

  /**
   * Get predefined brand profiles for different industries
   */
  getPresetBrandProfiles(): BrandProfile[] {
    return [
      {
        id: 'startup_tech',
        name: 'Tech Startup',
        industry: 'Technology',
        targetAudience: 'Early adopters, tech-savvy professionals, entrepreneurs',
        coreValues: ['Innovation', 'Disruption', 'Speed', 'User-first'],
        voiceToneProfile: this.getPresetProfiles()[0], // Casual & Friendly
        brandGuidelines: `
We're building the future of [category]. Our brand is:
- Bold and confident about our vision
- Transparent about our journey
- Community-driven and collaborative
- Fast-moving and adaptable

Content should emphasize innovation, user benefits, and the future we're building together.`,
        uniqueSellingPoints: [
          'First-to-market innovative solution',
          'User-centric design philosophy',
          'Rapid iteration and improvement',
          'Strong community engagement',
        ],
      },
      {
        id: 'personal_brand_creator',
        name: 'Content Creator Personal Brand',
        industry: 'Media & Entertainment',
        targetAudience: 'Followers, fans, aspiring creators',
        coreValues: ['Authenticity', 'Value', 'Consistency', 'Community'],
        voiceToneProfile: this.getPresetProfiles()[2], // Inspirational
        brandGuidelines: `
Personal brand focused on [niche]. Voice should be:
- Authentic and relatable
- Educational but entertaining
- Encouraging and motivational
- Vulnerable when appropriate

Share behind-the-scenes, lessons learned, and actionable insights. Build parasocial connection.`,
        uniqueSellingPoints: [
          'Unique personal story and perspective',
          'Proven results and track record',
          'Accessible and responsive to community',
          'Consistent value delivery',
        ],
      },
      {
        id: 'ecommerce_fashion',
        name: 'Fashion E-commerce Brand',
        industry: 'Fashion & Retail',
        targetAudience: 'Style-conscious consumers, 25-40 years old',
        coreValues: ['Style', 'Quality', 'Sustainability', 'Inclusivity'],
        voiceToneProfile: this.getPresetProfiles()[5], // Luxury
        brandGuidelines: `
Premium fashion brand with sustainable focus. Voice should be:
- Sophisticated but accessible
- Style-focused and trendsetting
- Values-driven (sustainability, ethics)
- Inclusive and body-positive

Emphasize quality, craftsmanship, and the story behind each piece.`,
        uniqueSellingPoints: [
          'Sustainably sourced materials',
          'Timeless designs with modern edge',
          'Inclusive sizing and representation',
          'Transparent supply chain',
        ],
      },
      {
        id: 'saas_b2b',
        name: 'B2B SaaS Company',
        industry: 'Enterprise Software',
        targetAudience: 'Business decision-makers, IT professionals, executives',
        coreValues: ['Efficiency', 'ROI', 'Reliability', 'Innovation'],
        voiceToneProfile: this.getPresetProfiles()[1], // Professional
        brandGuidelines: `
Enterprise SaaS solution. Communication should be:
- Professional and credible
- Data-driven and results-focused
- Clear about ROI and business value
- Technically accurate but digestible

Focus on solving business problems, reducing costs, and increasing efficiency.`,
        uniqueSellingPoints: [
          'Proven ROI with existing customers',
          'Enterprise-grade security and reliability',
          'Seamless integration with existing tools',
          'Dedicated customer success team',
        ],
      },
      {
        id: 'fitness_wellness',
        name: 'Fitness & Wellness Brand',
        industry: 'Health & Wellness',
        targetAudience: 'Health-conscious individuals, fitness enthusiasts',
        coreValues: ['Health', 'Empowerment', 'Balance', 'Progress'],
        voiceToneProfile: this.getPresetProfiles()[2], // Inspirational
        brandGuidelines: `
Fitness and wellness brand promoting holistic health. Voice should be:
- Motivational but not preachy
- Inclusive of all fitness levels
- Science-backed but accessible
- Celebrating progress over perfection

Emphasize sustainable lifestyle changes, not quick fixes.`,
        uniqueSellingPoints: [
          'Holistic approach to wellness',
          'Customizable programs for all levels',
          'Science-backed methodology',
          'Supportive community',
        ],
      },
      {
        id: 'education_online',
        name: 'Online Education Platform',
        industry: 'Education & E-Learning',
        targetAudience: 'Lifelong learners, career switchers, skill developers',
        coreValues: ['Learning', 'Accessibility', 'Excellence', 'Growth'],
        voiceToneProfile: this.getPresetProfiles()[3], // Educational
        brandGuidelines: `
Online education platform making learning accessible. Voice should be:
- Clear and instructive
- Encouraging and supportive
- Celebrating learning milestones
- Removing barriers to education

Focus on transformation, career outcomes, and personal growth.`,
        uniqueSellingPoints: [
          'Expert instructors with real-world experience',
          'Self-paced, flexible learning',
          'Hands-on, project-based approach',
          'Career support and job placement',
        ],
      },
    ];
  }

  /**
   * Create a custom voice/tone profile
   */
  createCustomProfile(profileData: Partial<VoiceToneProfile>): VoiceToneProfile {
    return {
      id: profileData.id || this.generateId(),
      name: profileData.name || 'Custom Profile',
      description: profileData.description || '',
      characteristics: profileData.characteristics || {
        formality: 'professional',
        enthusiasm: 'medium',
        humor: 'subtle',
        empathy: 'medium',
        expertise: 'intermediate',
      },
      vocabularyPreferences: profileData.vocabularyPreferences || [],
      sentenceStructure: profileData.sentenceStructure || 'medium',
      punctuationStyle: profileData.punctuationStyle || 'standard',
      emojiUsage: profileData.emojiUsage || 'minimal',
      examplePhrases: profileData.examplePhrases || [],
      avoidPhrases: profileData.avoidPhrases || [],
    };
  }

  /**
   * Create a custom brand profile
   */
  createCustomBrandProfile(brandData: Partial<BrandProfile>): BrandProfile {
    const defaultVoiceProfile = this.getPresetProfiles()[0];

    return {
      id: brandData.id || this.generateId(),
      name: brandData.name || 'Custom Brand',
      industry: brandData.industry || '',
      targetAudience: brandData.targetAudience || '',
      coreValues: brandData.coreValues || [],
      voiceToneProfile: brandData.voiceToneProfile || defaultVoiceProfile,
      brandGuidelines: brandData.brandGuidelines || '',
      competitorAnalysis: brandData.competitorAnalysis,
      uniqueSellingPoints: brandData.uniqueSellingPoints || [],
    };
  }

  /**
   * Analyze text and suggest matching voice/tone profile
   */
  analyzeTextForProfile(text: string): {
    suggestedProfile: VoiceToneProfile;
    confidence: number;
    reasoning: string;
  } {
    const profiles = this.getPresetProfiles();

    // Simple heuristic-based analysis
    const scores: Array<{ profile: VoiceToneProfile; score: number }> = [];

    for (const profile of profiles) {
      let score = 0;

      // Check for vocabulary preferences
      const vocabMatches = profile.vocabularyPreferences.filter((word) =>
        text.toLowerCase().includes(word.toLowerCase())
      ).length;
      score += vocabMatches * 2;

      // Check for example phrases
      const phraseMatches = profile.examplePhrases.filter((phrase) =>
        text.toLowerCase().includes(phrase.toLowerCase())
      ).length;
      score += phraseMatches * 3;

      // Check for avoided phrases (negative score)
      const avoidMatches = profile.avoidPhrases.filter((phrase) =>
        text.toLowerCase().includes(phrase.toLowerCase())
      ).length;
      score -= avoidMatches * 5;

      // Check emoji usage
      const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
      if (profile.emojiUsage === 'heavy' && emojiCount > 3) score += 3;
      if (profile.emojiUsage === 'none' && emojiCount === 0) score += 3;

      // Check sentence length
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
      const avgLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;

      if (profile.sentenceStructure === 'short' && avgLength < 50) score += 2;
      if (profile.sentenceStructure === 'long' && avgLength > 100) score += 2;

      scores.push({ profile, score });
    }

    // Sort by score
    scores.sort((a, b) => b.score - a.score);

    const bestMatch = scores[0];
    const maxPossibleScore = 20;
    const confidence = Math.min((bestMatch.score / maxPossibleScore) * 100, 100);

    return {
      suggestedProfile: bestMatch.profile,
      confidence,
      reasoning: `Based on vocabulary, phrase patterns, and structure, this text best matches the "${bestMatch.profile.name}" profile.`,
    };
  }

  /**
   * Get profile by ID
   */
  getProfileById(id: string): VoiceToneProfile | undefined {
    return this.getPresetProfiles().find((p) => p.id === id);
  }

  /**
   * Get brand profile by ID
   */
  getBrandProfileById(id: string): BrandProfile | undefined {
    return this.getPresetBrandProfiles().find((p) => p.id === id);
  }

  /**
   * Generate a unique ID
   */
  private generateId(): string {
    return `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Merge multiple profiles (for hybrid voice)
   */
  mergeProfiles(profiles: VoiceToneProfile[], weights?: number[]): VoiceToneProfile {
    if (profiles.length === 0) {
      throw new Error('At least one profile required for merging');
    }

    if (weights && weights.length !== profiles.length) {
      throw new Error('Weights array must match profiles array length');
    }

    const defaultWeights = profiles.map(() => 1 / profiles.length);
    const normalizedWeights = weights || defaultWeights;

    // Combine vocabulary preferences
    const allVocab = profiles.flatMap((p) => p.vocabularyPreferences);
    const uniqueVocab = [...new Set(allVocab)];

    // Combine example phrases
    const allPhrases = profiles.flatMap((p) => p.examplePhrases);
    const uniquePhrases = [...new Set(allPhrases)];

    // Combine avoid phrases
    const allAvoid = profiles.flatMap((p) => p.avoidPhrases);
    const uniqueAvoid = [...new Set(allAvoid)];

    return {
      id: this.generateId(),
      name: `Hybrid: ${profiles.map((p) => p.name).join(' + ')}`,
      description: `Merged profile combining: ${profiles.map((p) => p.name).join(', ')}`,
      characteristics: profiles[0].characteristics, // Use first profile's characteristics
      vocabularyPreferences: uniqueVocab,
      sentenceStructure: profiles[0].sentenceStructure,
      punctuationStyle: profiles[0].punctuationStyle,
      emojiUsage: profiles[0].emojiUsage,
      examplePhrases: uniquePhrases,
      avoidPhrases: uniqueAvoid,
    };
  }
}

// Export singleton instance
export const voiceToneService = new VoiceToneService();
