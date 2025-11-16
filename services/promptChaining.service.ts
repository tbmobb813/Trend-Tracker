import { PromptChain, PromptChainStep, VoiceToneProfile, BrandProfile } from '../types';
import { aiService } from './ai.service';
import { getPromptTemplate, interpolatePrompt, validatePromptVariables } from './promptTemplates';

/**
 * Advanced Prompt Chaining Service
 *
 * Enables sophisticated multi-step AI workflows where:
 * - Each step builds on previous outputs
 * - Conditional branching based on results
 * - Complex content generation pipelines
 * - Iterative refinement processes
 */

export class PromptChainingService {
  /**
   * Execute a complete prompt chain
   */
  async executeChain(
    chain: PromptChain,
    initialInputs: Record<string, any>,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
      onStepComplete?: (stepNumber: number, result: string) => void;
    }
  ): Promise<{
    finalOutput: string;
    stepResults: Array<{ stepNumber: number; output: string; tokens: number; cost: number }>;
    totalTokens: number;
    totalCost: number;
  }> {
    const stepResults: Array<{ stepNumber: number; output: string; tokens: number; cost: number }> =
      [];
    let totalTokens = 0;
    let totalCost = 0;

    // Context accumulator - stores all step outputs
    const context: Record<string, any> = { ...initialInputs };

    // Execute each step in sequence
    for (const step of chain.steps) {
      // Get the prompt template for this step
      const template = getPromptTemplate(step.promptTemplateId);
      if (!template) {
        throw new Error(`Prompt template not found: ${step.promptTemplateId}`);
      }

      // Map inputs from context using input mapping
      const stepInputs = this.mapInputs(step.inputMapping, context);

      // Validate that all required variables are provided
      const validation = validatePromptVariables(template, stepInputs);
      if (!validation.valid) {
        throw new Error(
          `Missing required variables for step ${step.stepNumber}: ${validation.missingVariables.join(', ')}`
        );
      }

      // Check if this step requires user input
      if (step.requiresUserInput) {
        // In a real implementation, this would pause and wait for user input
        // For now, we'll just log a warning
        console.warn(`Step ${step.stepNumber} requires user input but none was provided`);
      }

      // Interpolate the user prompt with the mapped inputs
      const userPrompt = interpolatePrompt(template.userPromptTemplate, stepInputs);

      // Generate AI response for this step
      const result = await aiService.generateText(
        template.systemPrompt,
        userPrompt,
        {
          voiceToneProfile: options?.voiceToneProfile,
          brandProfile: options?.brandProfile,
        }
      );

      // Store the result in context with the output key
      context[step.outputKey] = result.text;

      // Track step result
      stepResults.push({
        stepNumber: step.stepNumber,
        output: result.text,
        tokens: result.tokens,
        cost: result.cost,
      });

      totalTokens += result.tokens;
      totalCost += result.cost;

      // Notify callback if provided
      if (options?.onStepComplete) {
        options.onStepComplete(step.stepNumber, result.text);
      }
    }

    // Get the final output based on the chain's final output format
    const finalOutput = this.formatFinalOutput(chain.finalOutputFormat, context);

    return {
      finalOutput,
      stepResults,
      totalTokens,
      totalCost,
    };
  }

  /**
   * Map inputs from context using the step's input mapping
   */
  private mapInputs(
    inputMapping: Record<string, string>,
    context: Record<string, any>
  ): Record<string, any> {
    const mappedInputs: Record<string, any> = {};

    for (const [variableName, sourceKey] of Object.entries(inputMapping)) {
      // Support dot notation for nested access (e.g., "step1.result.title")
      const value = this.getNestedValue(context, sourceKey);
      if (value !== undefined) {
        mappedInputs[variableName] = value;
      }
    }

    return mappedInputs;
  }

  /**
   * Get nested value from object using dot notation
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  /**
   * Format the final output based on the specified format
   */
  private formatFinalOutput(format: string, context: Record<string, any>): string {
    // Replace placeholders in the format string with actual values from context
    return interpolatePrompt(format, context);
  }

  /**
   * Create a predefined chain for common workflows
   */
  createChain(chainType: string, config: any): PromptChain {
    switch (chainType) {
      case 'viral_tiktok_workflow':
        return this.createViralTikTokChain(config);
      case 'complete_youtube_video':
        return this.createCompleteYouTubeVideoChain(config);
      case 'product_launch_campaign':
        return this.createProductLaunchCampaign(config);
      case 'content_repurpose':
        return this.createContentRepurposeChain(config);
      case 'thread_to_blog':
        return this.createThreadToBlogChain(config);
      default:
        throw new Error(`Unknown chain type: ${chainType}`);
    }
  }

  /**
   * Viral TikTok Workflow Chain
   * Steps: Hook → Script → Thumbnail Concept
   */
  private createViralTikTokChain(config: any): PromptChain {
    return {
      id: 'viral_tiktok_workflow',
      name: 'Viral TikTok Creation Workflow',
      description: 'Generate hook → script → thumbnail concept for a viral TikTok',
      steps: [
        {
          stepNumber: 1,
          promptTemplateId: 'tiktok_hooks',
          inputMapping: {
            topic: 'topic',
            audience: 'audience',
            contentType: 'contentType',
            emotion: 'emotion',
          },
          outputKey: 'hooks',
          requiresUserInput: false,
        },
        {
          stepNumber: 2,
          promptTemplateId: 'script_writer',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            length: 'length',
            audience: 'audience',
            contentType: 'contentType',
            keyPoints: 'keyPoints',
          },
          outputKey: 'script',
          requiresUserInput: false,
        },
        {
          stepNumber: 3,
          promptTemplateId: 'thumbnail_ideas',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            videoType: 'contentType',
            audience: 'audience',
            emotion: 'emotion',
          },
          outputKey: 'thumbnail',
          requiresUserInput: false,
        },
      ],
      finalOutputFormat: `# Viral TikTok Complete Package

## Hooks
{{hooks}}

## Full Script
{{script}}

## Thumbnail Concepts
{{thumbnail}}`,
    };
  }

  /**
   * Complete YouTube Video Chain
   * Steps: Hook → Script → Thumbnail → Description with Hashtags
   */
  private createCompleteYouTubeVideoChain(config: any): PromptChain {
    return {
      id: 'complete_youtube_video',
      name: 'Complete YouTube Video Package',
      description: 'Generate everything needed for a YouTube video',
      steps: [
        {
          stepNumber: 1,
          promptTemplateId: 'script_writer',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            length: 'length',
            audience: 'audience',
            contentType: 'contentType',
            keyPoints: 'keyPoints',
          },
          outputKey: 'script',
          requiresUserInput: false,
        },
        {
          stepNumber: 2,
          promptTemplateId: 'thumbnail_ideas',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            videoType: 'contentType',
            audience: 'audience',
          },
          outputKey: 'thumbnails',
          requiresUserInput: false,
        },
        {
          stepNumber: 3,
          promptTemplateId: 'caption_templates',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            postType: 'contentType',
            goal: 'goal',
            audience: 'audience',
            keyMessage: 'topic',
          },
          outputKey: 'description',
          requiresUserInput: false,
        },
        {
          stepNumber: 4,
          promptTemplateId: 'hashtag_suggestions',
          inputMapping: {
            platform: 'platform',
            topic: 'topic',
            contentType: 'contentType',
            audience: 'audience',
          },
          outputKey: 'hashtags',
          requiresUserInput: false,
        },
      ],
      finalOutputFormat: `# Complete YouTube Video Package

## Script
{{script}}

## Thumbnail Concepts
{{thumbnails}}

## Description
{{description}}

## Hashtags
{{hashtags}}`,
    };
  }

  /**
   * Product Launch Campaign Chain
   * Steps: Ad Copy → Email Sequence → Social Posts
   */
  private createProductLaunchCampaign(config: any): PromptChain {
    return {
      id: 'product_launch_campaign',
      name: 'Product Launch Campaign',
      description: 'Generate complete marketing campaign for product launch',
      steps: [
        {
          stepNumber: 1,
          promptTemplateId: 'ad_copy',
          inputMapping: {
            platform: 'adPlatform',
            adFormat: 'adFormat',
            productService: 'product',
            audience: 'audience',
            goal: 'goal',
            usp: 'usp',
            benefits: 'benefits',
          },
          outputKey: 'adCopy',
          requiresUserInput: false,
        },
        {
          stepNumber: 2,
          promptTemplateId: 'email_sequences',
          inputMapping: {
            sequenceType: 'sequenceType',
            productService: 'product',
            audience: 'audience',
            goal: 'goal',
            keyBenefits: 'benefits',
          },
          outputKey: 'emailSequence',
          requiresUserInput: false,
        },
        {
          stepNumber: 3,
          promptTemplateId: 'carousel_posts',
          inputMapping: {
            platform: 'socialPlatform',
            topic: 'product',
            carouselType: 'carouselType',
            audience: 'audience',
            keyMessages: 'benefits',
          },
          outputKey: 'carouselPost',
          requiresUserInput: false,
        },
        {
          stepNumber: 4,
          promptTemplateId: 'thread_generator',
          inputMapping: {
            topic: 'product',
            threadType: 'threadType',
            audience: 'audience',
            keyMessages: 'benefits',
          },
          outputKey: 'thread',
          requiresUserInput: false,
        },
      ],
      finalOutputFormat: `# Product Launch Campaign Package

## Paid Ad Copy
{{adCopy}}

## Email Sequence
{{emailSequence}}

## Social Media Carousel
{{carouselPost}}

## Twitter/X Thread
{{thread}}`,
    };
  }

  /**
   * Content Repurpose Chain
   * Takes long-form content and creates multiple short-form versions
   */
  private createContentRepurposeChain(config: any): PromptChain {
    return {
      id: 'content_repurpose',
      name: 'Content Repurposing Workflow',
      description: 'Repurpose long-form content into multiple formats',
      steps: [
        {
          stepNumber: 1,
          promptTemplateId: 'thread_generator',
          inputMapping: {
            topic: 'originalContent',
            threadType: 'threadType',
            audience: 'audience',
            keyMessages: 'keyPoints',
          },
          outputKey: 'thread',
          requiresUserInput: false,
        },
        {
          stepNumber: 2,
          promptTemplateId: 'carousel_posts',
          inputMapping: {
            platform: 'platform',
            topic: 'originalContent',
            carouselType: 'carouselType',
            audience: 'audience',
            keyMessages: 'keyPoints',
          },
          outputKey: 'carousel',
          requiresUserInput: false,
        },
        {
          stepNumber: 3,
          promptTemplateId: 'tiktok_hooks',
          inputMapping: {
            topic: 'originalContent',
            audience: 'audience',
            contentType: 'contentType',
            keyPoints: 'keyPoints',
          },
          outputKey: 'tiktokHooks',
          requiresUserInput: false,
        },
        {
          stepNumber: 4,
          promptTemplateId: 'email_sequences',
          inputMapping: {
            sequenceType: 'sequenceType',
            productService: 'originalContent',
            audience: 'audience',
            goal: 'goal',
            keyBenefits: 'keyPoints',
          },
          outputKey: 'emailSequence',
          requiresUserInput: false,
        },
      ],
      finalOutputFormat: `# Repurposed Content Package

## Twitter/X Thread
{{thread}}

## Instagram Carousel
{{carousel}}

## TikTok Hooks
{{tiktokHooks}}

## Email Sequence
{{emailSequence}}`,
    };
  }

  /**
   * Thread to Blog Post Chain
   * Expand a Twitter thread into a full blog post
   */
  private createThreadToBlogChain(config: any): PromptChain {
    return {
      id: 'thread_to_blog',
      name: 'Thread to Blog Post Expansion',
      description: 'Expand a Twitter thread into a comprehensive blog post',
      steps: [
        {
          stepNumber: 1,
          promptTemplateId: 'caption_templates',
          inputMapping: {
            platform: 'blogPlatform',
            topic: 'threadTopic',
            postType: 'postType',
            goal: 'goal',
            audience: 'audience',
            keyMessage: 'mainMessage',
          },
          outputKey: 'introduction',
          requiresUserInput: false,
        },
        {
          stepNumber: 2,
          promptTemplateId: 'hashtag_suggestions',
          inputMapping: {
            platform: 'blogPlatform',
            topic: 'threadTopic',
            contentType: 'contentType',
            audience: 'audience',
          },
          outputKey: 'seoKeywords',
          requiresUserInput: false,
        },
      ],
      finalOutputFormat: `# Blog Post from Thread

## Introduction
{{introduction}}

## SEO Keywords & Tags
{{seoKeywords}}

## Original Thread
{{threadContent}}`,
    };
  }

  /**
   * Execute chain with streaming for real-time updates
   */
  async *executeChainWithStreaming(
    chain: PromptChain,
    initialInputs: Record<string, any>,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): AsyncGenerator<
    { stepNumber: number; chunk: string; isComplete: boolean },
    void,
    unknown
  > {
    const context: Record<string, any> = { ...initialInputs };

    for (const step of chain.steps) {
      const template = getPromptTemplate(step.promptTemplateId);
      if (!template) {
        throw new Error(`Prompt template not found: ${step.promptTemplateId}`);
      }

      const stepInputs = this.mapInputs(step.inputMapping, context);
      const userPrompt = interpolatePrompt(template.userPromptTemplate, stepInputs);

      let fullOutput = '';

      // Stream the AI generation
      for await (const chunk of aiService.streamText(
        template.systemPrompt,
        userPrompt,
        options
      )) {
        fullOutput += chunk;
        yield {
          stepNumber: step.stepNumber,
          chunk,
          isComplete: false,
        };
      }

      // Store completed output in context
      context[step.outputKey] = fullOutput;

      yield {
        stepNumber: step.stepNumber,
        chunk: '',
        isComplete: true,
      };
    }
  }

  /**
   * Validate a chain before execution
   */
  validateChain(
    chain: PromptChain,
    initialInputs: Record<string, any>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check that all referenced prompt templates exist
    for (const step of chain.steps) {
      const template = getPromptTemplate(step.promptTemplateId);
      if (!template) {
        errors.push(`Step ${step.stepNumber}: Template not found - ${step.promptTemplateId}`);
      }
    }

    // Check that the first step can be executed with initial inputs
    if (chain.steps.length > 0) {
      const firstStep = chain.steps[0];
      const template = getPromptTemplate(firstStep.promptTemplateId);

      if (template) {
        const stepInputs = this.mapInputs(firstStep.inputMapping, initialInputs);
        const validation = validatePromptVariables(template, stepInputs);

        if (!validation.valid) {
          errors.push(
            `Step 1: Missing required inputs - ${validation.missingVariables.join(', ')}`
          );
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const promptChainingService = new PromptChainingService();
