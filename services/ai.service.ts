import { AIConfig, VoiceToneProfile, BrandProfile } from '../types';

/**
 * AI Service - Core service for AI text generation
 * Supports both OpenAI and Anthropic APIs
 */

export class AIService {
  private config: AIConfig | null = null;

  /**
   * Initialize the AI service with configuration
   */
  initialize(config: AIConfig): void {
    this.config = config;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    return this.config !== null && this.config.apiKey.length > 0;
  }

  /**
   * Generate text using the configured AI provider
   */
  async generateText(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<{ text: string; tokens: number; cost: number }> {
    if (!this.config) {
      throw new Error('AI Service not initialized. Please configure API keys in settings.');
    }

    // Apply voice/tone and brand profile to prompts
    const enhancedSystemPrompt = this.enhanceSystemPrompt(
      systemPrompt,
      options?.voiceToneProfile,
      options?.brandProfile
    );

    if (this.config.provider === 'openai') {
      return this.generateWithOpenAI(enhancedSystemPrompt, userPrompt, options);
    } else {
      return this.generateWithAnthropic(enhancedSystemPrompt, userPrompt, options);
    }
  }

  /**
   * Enhance system prompt with voice/tone and brand profile
   */
  private enhanceSystemPrompt(
    basePrompt: string,
    voiceTone?: VoiceToneProfile,
    brand?: BrandProfile
  ): string {
    let enhanced = basePrompt;

    if (voiceTone) {
      enhanced += `\n\n## Voice & Tone Guidelines\n`;
      enhanced += `- Formality: ${voiceTone.characteristics.formality}\n`;
      enhanced += `- Enthusiasm: ${voiceTone.characteristics.enthusiasm}\n`;
      enhanced += `- Humor: ${voiceTone.characteristics.humor}\n`;
      enhanced += `- Empathy: ${voiceTone.characteristics.empathy}\n`;
      enhanced += `- Expertise Level: ${voiceTone.characteristics.expertise}\n`;
      enhanced += `- Sentence Structure: ${voiceTone.sentenceStructure}\n`;
      enhanced += `- Punctuation: ${voiceTone.punctuationStyle}\n`;
      enhanced += `- Emoji Usage: ${voiceTone.emojiUsage}\n`;

      if (voiceTone.vocabularyPreferences.length > 0) {
        enhanced += `\nPreferred Vocabulary: ${voiceTone.vocabularyPreferences.join(', ')}\n`;
      }

      if (voiceTone.examplePhrases.length > 0) {
        enhanced += `\nExample Phrases to Use:\n${voiceTone.examplePhrases.map(p => `- "${p}"`).join('\n')}\n`;
      }

      if (voiceTone.avoidPhrases.length > 0) {
        enhanced += `\nPhrases to Avoid:\n${voiceTone.avoidPhrases.map(p => `- "${p}"`).join('\n')}\n`;
      }
    }

    if (brand) {
      enhanced += `\n\n## Brand Profile\n`;
      enhanced += `Brand: ${brand.name}\n`;
      enhanced += `Industry: ${brand.industry}\n`;
      enhanced += `Target Audience: ${brand.targetAudience}\n`;
      enhanced += `Core Values: ${brand.coreValues.join(', ')}\n`;
      enhanced += `Unique Selling Points:\n${brand.uniqueSellingPoints.map(p => `- ${p}`).join('\n')}\n`;

      if (brand.brandGuidelines) {
        enhanced += `\nBrand Guidelines:\n${brand.brandGuidelines}\n`;
      }

      if (brand.competitorAnalysis) {
        enhanced += `\nCompetitor Context:\n${brand.competitorAnalysis}\n`;
      }
    }

    return enhanced;
  }

  /**
   * Generate text using OpenAI API
   */
  private async generateWithOpenAI(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<{ text: string; tokens: number; cost: number }> {
    const temperature = options?.temperature ?? this.config!.temperature;
    const maxTokens = options?.maxTokens ?? this.config!.maxTokens;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config!.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config!.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.choices[0].message.content;
    const tokens = data.usage.total_tokens;
    const cost = this.calculateOpenAICost(tokens, this.config!.model);

    return { text, tokens, cost };
  }

  /**
   * Generate text using Anthropic API
   */
  private async generateWithAnthropic(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<{ text: string; tokens: number; cost: number }> {
    const temperature = options?.temperature ?? this.config!.temperature;
    const maxTokens = options?.maxTokens ?? this.config!.maxTokens;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config!.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature,
        max_tokens: maxTokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const text = data.content[0].text;
    const tokens = data.usage.input_tokens + data.usage.output_tokens;
    const cost = this.calculateAnthropicCost(
      data.usage.input_tokens,
      data.usage.output_tokens,
      this.config!.model
    );

    return { text, tokens, cost };
  }

  /**
   * Calculate OpenAI API cost
   */
  private calculateOpenAICost(tokens: number, model: string): number {
    // Approximate costs per 1K tokens (as of 2024)
    const costs: Record<string, number> = {
      'gpt-4': 0.03,
      'gpt-4-turbo': 0.01,
      'gpt-3.5-turbo': 0.0015,
    };

    const costPer1K = costs[model] || 0.01;
    return (tokens / 1000) * costPer1K;
  }

  /**
   * Calculate Anthropic API cost
   */
  private calculateAnthropicCost(
    inputTokens: number,
    outputTokens: number,
    model: string
  ): number {
    // Approximate costs per 1M tokens (as of 2024)
    const costs: Record<string, { input: number; output: number }> = {
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
    };

    const modelCost = costs[model] || { input: 3, output: 15 };
    return (inputTokens / 1_000_000) * modelCost.input + (outputTokens / 1_000_000) * modelCost.output;
  }

  /**
   * Generate multiple variations of content
   */
  async generateVariations(
    systemPrompt: string,
    userPrompt: string,
    count: number = 3,
    options?: {
      temperature?: number;
      maxTokens?: number;
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<Array<{ text: string; tokens: number; cost: number }>> {
    const variations = [];

    for (let i = 0; i < count; i++) {
      const result = await this.generateText(systemPrompt, userPrompt, {
        ...options,
        temperature: (options?.temperature || 0.7) + i * 0.1, // Vary temperature for diversity
      });
      variations.push(result);
    }

    return variations;
  }

  /**
   * Stream text generation (for real-time UI updates)
   */
  async *streamText(
    systemPrompt: string,
    userPrompt: string,
    options?: {
      temperature?: number;
      maxTokens?: number;
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): AsyncGenerator<string, void, unknown> {
    if (!this.config) {
      throw new Error('AI Service not initialized');
    }

    const enhancedSystemPrompt = this.enhanceSystemPrompt(
      systemPrompt,
      options?.voiceToneProfile,
      options?.brandProfile
    );

    if (this.config.provider === 'openai') {
      yield* this.streamOpenAI(enhancedSystemPrompt, userPrompt, options);
    } else {
      yield* this.streamAnthropic(enhancedSystemPrompt, userPrompt, options);
    }
  }

  /**
   * Stream OpenAI responses
   */
  private async *streamOpenAI(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config!.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config!.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: options?.temperature ?? this.config!.temperature,
        max_tokens: options?.maxTokens ?? this.config!.maxTokens,
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }

  /**
   * Stream Anthropic responses
   */
  private async *streamAnthropic(
    systemPrompt: string,
    userPrompt: string,
    options?: { temperature?: number; maxTokens?: number }
  ): AsyncGenerator<string, void, unknown> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config!.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config!.model,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
        temperature: options?.temperature ?? this.config!.temperature,
        max_tokens: options?.maxTokens ?? this.config!.maxTokens,
        stream: true,
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.trim() !== '');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);

          try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'content_block_delta') {
              const content = parsed.delta?.text;
              if (content) yield content;
            }
          } catch (e) {
            // Skip invalid JSON
          }
        }
      }
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
