import { ImageGenerationRequest, GeneratedImage, AIConfig } from '../types';

/**
 * Image Generation Service
 *
 * Supports multiple AI image generation providers:
 * - OpenAI DALL-E 3
 * - Stability AI (Stable Diffusion)
 * - Midjourney (via API when available)
 *
 * Specialized for social media visuals, thumbnails, and marketing assets
 */

export class ImageGenerationService {
  private config: AIConfig | null = null;

  /**
   * Initialize the service with configuration
   */
  initialize(config: AIConfig): void {
    this.config = config;
  }

  /**
   * Check if service is initialized
   */
  isInitialized(): boolean {
    if (!this.config) return false;
    // If provider is openai, require openaiApiKey (or legacy apiKey)
    return !!(this.config.openaiApiKey || this.config.apiKey);
  }

  /**
   * Generate an image based on request parameters
   */
  async generateImage(request: ImageGenerationRequest): Promise<GeneratedImage> {
    if (!this.config) {
      throw new Error('Image Generation Service not initialized');
    }

    // Enhance the prompt with platform-specific optimizations
    const enhancedPrompt = this.enhancePromptForPlatform(request);

    // Generate image using the configured provider
    let imageUrl: string;
    let metadata: Record<string, any> = {};

    if (this.config.provider === 'openai') {
      const result = await this.generateWithDALLE(enhancedPrompt, request.dimensions);
      imageUrl = result.url;
      metadata = result.metadata;
    } else {
      const result = await this.generateWithStabilityAI(enhancedPrompt, request.dimensions);
      imageUrl = result.url;
      metadata = result.metadata;
    }

    return {
      id: this.generateId(),
      requestId: request.id,
      url: imageUrl,
      prompt: enhancedPrompt,
      style: request.style,
      createdAt: new Date().toISOString(),
      metadata,
    };
  }

  /**
   * Generate thumbnail specifically optimized for YouTube/TikTok
   */
  async generateThumbnail(
    topic: string,
    platform: 'YouTube' | 'TikTok' | 'Instagram',
    options: {
      emotion?: 'curiosity' | 'shock' | 'excitement' | 'desire' | 'fear';
      includeText?: string;
      colorScheme?: string[];
      style?: 'realistic' | 'illustration' | 'bold' | 'minimalist';
      faceExpression?: string;
      brandColors?: string[];
    }
  ): Promise<GeneratedImage> {
    const dimensions = this.getPlatformDimensions(platform);
    const style = options.style || 'bold';

    // Construct optimized thumbnail prompt
    const prompt = this.buildThumbnailPrompt(topic, platform, options);

    const request: ImageGenerationRequest = {
      id: this.generateId(),
      prompt,
      style,
      platform,
      dimensions,
      colorScheme: options.colorScheme,
      includeText: options.includeText,
      brandElements: options.brandColors,
    };

    return this.generateImage(request);
  }

  /**
   * Build an optimized thumbnail prompt
   */
  private buildThumbnailPrompt(
    topic: string,
    platform: string,
    options: {
      emotion?: string;
      includeText?: string;
      colorScheme?: string[];
      faceExpression?: string;
    }
  ): string {
    let prompt = '';

    // Platform-specific guidelines
    if (platform === 'YouTube') {
      prompt += 'High-quality YouTube thumbnail, professional, eye-catching, ';
    } else if (platform === 'TikTok') {
      prompt += 'Bold, vibrant TikTok thumbnail, trendy, attention-grabbing, ';
    } else if (platform === 'Instagram') {
      prompt += 'Aesthetic Instagram thumbnail, colorful, engaging, ';
    }

    // Style specifications
    prompt += `${options.emotion || 'exciting'} mood, `;

    // Add face expression if specified
    if (options.faceExpression) {
      prompt += `person with ${options.faceExpression} expression, `;
    }

    // Topic integration
    prompt += `focused on: ${topic}, `;

    // Color scheme
    if (options.colorScheme && options.colorScheme.length > 0) {
      prompt += `color palette: ${options.colorScheme.join(', ')}, `;
    } else {
      prompt += 'vibrant high-contrast colors, ';
    }

    // Text integration
    if (options.includeText) {
      prompt += `include bold text overlay: "${options.includeText}", `;
    }

    // Quality modifiers
    prompt += 'rule of thirds composition, dramatic lighting, sharp focus, ';
    prompt += 'professional photography quality, 8K, highly detailed';

    return prompt;
  }

  /**
   * Generate social media post image
   */
  async generateSocialMediaImage(
    concept: string,
    platform: 'Instagram' | 'LinkedIn' | 'Facebook' | 'Twitter',
    options: {
      style?: 'minimalist' | 'bold' | 'modern' | 'vintage';
      colorScheme?: string[];
      includeText?: string;
      brandElements?: string[];
    }
  ): Promise<GeneratedImage> {
    const dimensions = this.getPlatformDimensions(platform);

    const prompt = this.buildSocialMediaPrompt(concept, platform, options);

    const request: ImageGenerationRequest = {
      id: this.generateId(),
      prompt,
      style: options.style || 'modern',
      platform,
      dimensions,
      colorScheme: options.colorScheme,
      includeText: options.includeText,
      brandElements: options.brandElements,
    };

    return this.generateImage(request);
  }

  /**
   * Build social media image prompt
   */
  private buildSocialMediaPrompt(
    concept: string,
    platform: string,
    options: {
      style?: string;
      colorScheme?: string[];
      includeText?: string;
      brandElements?: string[];
    }
  ): string {
    let prompt = `${options.style || 'modern'} social media graphic for ${platform}, `;
    prompt += `concept: ${concept}, `;

    if (options.colorScheme && options.colorScheme.length > 0) {
      prompt += `color palette: ${options.colorScheme.join(', ')}, `;
    }

    if (options.includeText) {
      prompt += `text overlay: "${options.includeText}", `;
    }

    if (options.brandElements && options.brandElements.length > 0) {
      prompt += `incorporating brand elements: ${options.brandElements.join(', ')}, `;
    }

    prompt += 'clean composition, professional design, high quality, ';
    prompt += 'social media optimized, visually appealing';

    return prompt;
  }

  /**
   * Enhance prompt based on platform requirements
   */
  private enhancePromptForPlatform(request: ImageGenerationRequest): string {
    let enhanced = request.prompt;

    // Add platform-specific optimizations
    switch (request.platform) {
      case 'YouTube':
        enhanced += ', optimized for YouTube thumbnail, clickable, high CTR design';
        break;
      case 'TikTok':
        enhanced += ', optimized for TikTok, trending aesthetic, Gen-Z appeal';
        break;
      case 'Instagram':
        enhanced += ', Instagram-worthy, aesthetic, shareable';
        break;
      case 'LinkedIn':
        enhanced += ', professional, business-appropriate, sophisticated';
        break;
    }

    // Add style modifiers
    switch (request.style) {
      case 'realistic':
        enhanced += ', photorealistic, natural lighting, high detail';
        break;
      case 'illustration':
        enhanced += ', illustrated style, artistic, creative';
        break;
      case 'minimalist':
        enhanced += ', minimalist design, clean, simple, elegant';
        break;
      case 'bold':
        enhanced += ', bold colors, high contrast, striking';
        break;
      case 'vintage':
        enhanced += ', vintage aesthetic, retro feel, nostalgic';
        break;
      case 'modern':
        enhanced += ', modern design, contemporary, sleek';
        break;
    }

    // Add dimension optimization
    if (request.dimensions.width > request.dimensions.height) {
      enhanced += ', landscape orientation';
    } else if (request.dimensions.height > request.dimensions.width) {
      enhanced += ', portrait orientation';
    } else {
      enhanced += ', square composition';
    }

    return enhanced;
  }

  /**
   * Generate image using OpenAI DALL-E 3
   */
  private async generateWithDALLE(
    prompt: string,
    dimensions: { width: number; height: number }
  ): Promise<{ url: string; metadata: Record<string, any> }> {
    // DALL-E 3 only supports specific sizes
    const size = this.mapToDALLESize(dimensions);

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config!.openaiApiKey || this.config!.apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        quality: 'hd',
        style: 'vivid',
      }),
    });

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`DALL-E API Error: ${error?.error?.message || 'Unknown error'}`);
    }

    const data: any = await response.json();

    return {
      url: data?.data?.[0]?.url,
      metadata: {
        provider: 'openai-dalle3',
        revisedPrompt: data?.data?.[0]?.revised_prompt,
        model: 'dall-e-3',
        size,
      },
    };
  }

  /**
   * Generate image using Stability AI
   */
  private async generateWithStabilityAI(
    prompt: string,
    dimensions: { width: number; height: number }
  ): Promise<{ url: string; metadata: Record<string, any> }> {
    // Note: This is a placeholder. Actual Stability AI integration would require
    // their specific API endpoints and authentication

    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config!.openaiApiKey || this.config!.apiKey}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1,
          },
        ],
        cfg_scale: 7,
        height: dimensions.height,
        width: dimensions.width,
        samples: 1,
        steps: 30,
      }),
    });

    if (!response.ok) {
      const error: any = await response.json();
      throw new Error(`Stability AI Error: ${error?.message || 'Unknown error'}`);
    }

    const data: any = await response.json();
    const imageBase64 = data?.artifacts?.[0]?.base64;

    // Convert base64 to URL (in a real app, you'd upload this to your storage)
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return {
      url: imageUrl,
      metadata: {
        provider: 'stability-ai',
        model: 'stable-diffusion-xl',
        seed: data?.artifacts?.[0]?.seed,
      },
    };
  }

  /**
   * Get platform-specific dimensions
   */
  private getPlatformDimensions(platform: string): { width: number; height: number } {
    const dimensions: Record<string, { width: number; height: number }> = {
      YouTube: { width: 1280, height: 720 },
      TikTok: { width: 1080, height: 1920 },
      Instagram: { width: 1080, height: 1080 },
      LinkedIn: { width: 1200, height: 627 },
      Facebook: { width: 1200, height: 630 },
      Twitter: { width: 1200, height: 675 },
      General: { width: 1024, height: 1024 },
    };

    return dimensions[platform] || dimensions.General;
  }

  /**
   * Map custom dimensions to DALL-E supported sizes
   */
  private mapToDALLESize(dimensions: { width: number; height: number }): '1024x1024' | '1024x1792' | '1792x1024' {
    const aspectRatio = dimensions.width / dimensions.height;

    if (aspectRatio > 1.5) {
      return '1792x1024'; // Landscape
    } else if (aspectRatio < 0.7) {
      return '1024x1792'; // Portrait
    } else {
      return '1024x1024'; // Square
    }
  }

  /**
   * Generate variations of an existing image
   */
  async generateVariations(
    baseImageUrl: string,
    count: number = 3
  ): Promise<GeneratedImage[]> {
    if (!this.config) {
      throw new Error('Image Generation Service not initialized');
    }

    if (this.config.provider !== 'openai') {
      throw new Error('Image variations only supported with OpenAI provider');
    }

    // Note: This would require downloading the base image and uploading to OpenAI
    // Implementation would use the /v1/images/variations endpoint

    throw new Error('Image variations not yet implemented');
  }

  /**
   * Upscale an image for higher quality
   */
  async upscaleImage(imageUrl: string, scale: number = 2): Promise<string> {
    // This would integrate with an upscaling service
    throw new Error('Image upscaling not yet implemented');
  }

  /**
   * Generate a batch of images with different prompts
   */
  async generateBatch(
    requests: ImageGenerationRequest[]
  ): Promise<GeneratedImage[]> {
    const results: GeneratedImage[] = [];

    for (const request of requests) {
      try {
        const image = await this.generateImage(request);
        results.push(image);
      } catch (error) {
        console.error(`Failed to generate image for request ${request.id}:`, error);
        // Continue with other images even if one fails
      }
    }

    return results;
  }

  /**
   * Generate prompt suggestions for better image quality
   */
  generatePromptSuggestions(basePrompt: string, category: string): string[] {
    const suggestions: Record<string, string[]> = {
      thumbnail: [
        `${basePrompt}, high contrast, bold colors, dramatic lighting`,
        `${basePrompt}, professional photography, 8K quality, sharp focus`,
        `${basePrompt}, cinematic composition, vibrant, eye-catching`,
      ],
      social: [
        `${basePrompt}, modern design, clean aesthetic, minimalist`,
        `${basePrompt}, colorful, engaging, Instagram-worthy`,
        `${basePrompt}, professional marketing graphic, sleek design`,
      ],
      marketing: [
        `${basePrompt}, advertising quality, commercial photography`,
        `${basePrompt}, lifestyle imagery, aspirational, premium feel`,
        `${basePrompt}, brand photography, professional, polished`,
      ],
    };

    return suggestions[category] || [basePrompt];
  }

  /**
   * Estimate cost for image generation
   */
  estimateCost(
    provider: 'openai' | 'anthropic',
    size: string,
    quantity: number = 1
  ): number {
    const costs: Record<string, Record<string, number>> = {
      openai: {
        '1024x1024': 0.04,
        '1024x1792': 0.08,
        '1792x1024': 0.08,
      },
      'stability-ai': {
        default: 0.02,
      },
    };

    const costPer = costs[provider]?.[size] || costs[provider]?.['default'] || 0.04;
    return costPer * quantity;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const imageGenerationService = new ImageGenerationService();
