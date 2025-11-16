import { ReasoningChain, ReasoningStep, VoiceToneProfile, BrandProfile } from '../types';
import { aiService } from './ai.service';

/**
 * Multi-Step Reasoning Service
 *
 * Implements advanced reasoning patterns for complex content generation:
 * - Chain-of-thought reasoning
 * - Self-reflection and critique
 * - Iterative refinement
 * - Multi-perspective analysis
 * - Research and validation
 */

export class ReasoningService {
  /**
   * Execute a reasoning chain with multiple steps
   */
  async executeReasoningChain(
    goal: string,
    context: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
      maxSteps?: number;
      onStepComplete?: (step: ReasoningStep) => void;
    }
  ): Promise<ReasoningChain> {
    const maxSteps = options?.maxSteps || 5;
    const steps: ReasoningStep[] = [];

    const chain: ReasoningChain = {
      id: this.generateId(),
      goal,
      steps,
      status: 'in_progress',
      startedAt: new Date().toISOString(),
    };

    try {
      // Step 1: Analysis - Understand the goal and context
      const analysisStep = await this.performAnalysis(goal, context, options);
      steps.push(analysisStep);
      options?.onStepComplete?.(analysisStep);

      // Step 2: Research - Gather relevant information and considerations
      const researchStep = await this.performResearch(
        goal,
        context,
        analysisStep.response || '',
        options
      );
      steps.push(researchStep);
      options?.onStepComplete?.(researchStep);

      // Step 3: Ideation - Generate multiple approaches or solutions
      const ideationStep = await this.performIdeation(
        goal,
        context,
        analysisStep.response || '',
        researchStep.response || '',
        options
      );
      steps.push(ideationStep);
      options?.onStepComplete?.(ideationStep);

      // Step 4: Refinement - Select and refine the best approach
      const refinementStep = await this.performRefinement(
        goal,
        context,
        ideationStep.response || '',
        options
      );
      steps.push(refinementStep);
      options?.onStepComplete?.(refinementStep);

      // Step 5: Validation - Critique and validate the final output
      const validationStep = await this.performValidation(
        goal,
        refinementStep.response || '',
        options
      );
      steps.push(validationStep);
      options?.onStepComplete?.(validationStep);

      chain.finalOutput = refinementStep.response;
      chain.status = 'completed';
      chain.completedAt = new Date().toISOString();
    } catch (error) {
      chain.status = 'failed';
      chain.completedAt = new Date().toISOString();
      throw error;
    }

    return chain;
  }

  /**
   * Step 1: Analysis - Deep understanding of the task
   */
  private async performAnalysis(
    goal: string,
    context: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<ReasoningStep> {
    const systemPrompt = `You are an expert analyst tasked with deeply understanding content creation goals.

Your role is to:
1. Break down the goal into key components
2. Identify the target audience and their needs
3. Determine success criteria
4. Recognize constraints and requirements
5. Identify potential challenges

Be thorough, analytical, and specific in your analysis.`;

    const userPrompt = `Analyze this content creation goal:

Goal: ${goal}

Context: ${context}

Provide a comprehensive analysis including:
- Goal breakdown and key objectives
- Target audience analysis
- Success metrics and criteria
- Potential challenges and considerations
- Recommended approach`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    return {
      stepNumber: 1,
      type: 'analysis',
      prompt: userPrompt,
      response: result.text,
      metadata: {
        tokens: result.tokens,
        cost: result.cost,
      },
    };
  }

  /**
   * Step 2: Research - Gather relevant information
   */
  private async performResearch(
    goal: string,
    context: string,
    analysisResult: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<ReasoningStep> {
    const systemPrompt = `You are a content strategy researcher with deep knowledge of:
- Platform algorithms and best practices
- Viral content patterns
- Audience psychology
- Copywriting frameworks
- Marketing strategies
- Current trends and tactics

Your role is to provide research-backed insights and recommendations.`;

    const userPrompt = `Based on this analysis, provide research and strategic insights:

Goal: ${goal}
Context: ${context}

Analysis:
${analysisResult}

Research and provide:
1. Relevant content strategies and frameworks
2. Platform-specific best practices
3. Psychological triggers and persuasion techniques
4. Examples of successful similar content
5. Data-driven recommendations`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    return {
      stepNumber: 2,
      type: 'research',
      prompt: userPrompt,
      response: result.text,
      metadata: {
        tokens: result.tokens,
        cost: result.cost,
      },
    };
  }

  /**
   * Step 3: Ideation - Generate multiple creative approaches
   */
  private async performIdeation(
    goal: string,
    context: string,
    analysisResult: string,
    researchResult: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<ReasoningStep> {
    const systemPrompt = `You are a creative content strategist who excels at generating diverse, innovative ideas.

Your role is to:
1. Generate multiple unique approaches (at least 5 distinct variations)
2. Think outside the box while staying practical
3. Consider different angles, formats, and styles
4. Evaluate pros and cons of each approach
5. Recommend the best approach with justification

Be creative, diverse, and strategic in your ideation.`;

    const userPrompt = `Generate creative approaches for this goal:

Goal: ${goal}
Context: ${context}

Analysis:
${analysisResult}

Research Insights:
${researchResult}

Generate 5-7 distinct creative approaches, each with:
- Unique angle or hook
- Format and structure
- Key elements and features
- Pros and cons
- Estimated effectiveness (1-10)

Then recommend the top approach with detailed justification.`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    return {
      stepNumber: 3,
      type: 'ideation',
      prompt: userPrompt,
      response: result.text,
      metadata: {
        tokens: result.tokens,
        cost: result.cost,
      },
    };
  }

  /**
   * Step 4: Refinement - Create polished final output
   */
  private async performRefinement(
    goal: string,
    context: string,
    ideationResult: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<ReasoningStep> {
    const systemPrompt = `You are an expert content creator who transforms ideas into polished, high-quality content.

Your role is to:
1. Take the selected approach and create the actual content
2. Apply best practices and optimization techniques
3. Ensure clarity, engagement, and effectiveness
4. Polish language, structure, and flow
5. Make it ready for immediate use

Create content that is professional, engaging, and conversion-optimized.`;

    const userPrompt = `Create the final polished content:

Goal: ${goal}
Context: ${context}

Selected Approach and Ideas:
${ideationResult}

Create the complete, polished content that:
- Follows the recommended approach
- Incorporates all best practices
- Is optimized for the platform and audience
- Is ready to use immediately
- Includes all necessary elements (hooks, CTAs, formatting, etc.)

Deliver the final content in a clear, well-structured format.`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    return {
      stepNumber: 4,
      type: 'refinement',
      prompt: userPrompt,
      response: result.text,
      metadata: {
        tokens: result.tokens,
        cost: result.cost,
      },
    };
  }

  /**
   * Step 5: Validation - Critique and suggest improvements
   */
  private async performValidation(
    goal: string,
    finalContent: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<ReasoningStep> {
    const systemPrompt = `You are a critical content reviewer and optimization expert.

Your role is to:
1. Objectively critique the content
2. Identify strengths and weaknesses
3. Suggest specific improvements
4. Validate against best practices
5. Rate overall quality and effectiveness

Be honest, constructive, and actionable in your critique.`;

    const userPrompt = `Review and validate this content:

Goal: ${goal}

Content to Review:
${finalContent}

Provide:
1. Strengths (what works well)
2. Weaknesses (what could be improved)
3. Specific improvement suggestions
4. Validation against best practices
5. Overall quality rating (1-10)
6. Estimated effectiveness for the goal (1-10)
7. Final verdict (ready to use / needs revision)`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    return {
      stepNumber: 5,
      type: 'validation',
      prompt: userPrompt,
      response: result.text,
      metadata: {
        tokens: result.tokens,
        cost: result.cost,
      },
    };
  }

  /**
   * Perform iterative refinement based on feedback
   */
  async refineWithFeedback(
    originalContent: string,
    feedback: string,
    iterations: number = 3,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<{
    refinedContent: string;
    iterationResults: Array<{ iteration: number; content: string; improvements: string }>;
  }> {
    let currentContent = originalContent;
    const iterationResults: Array<{
      iteration: number;
      content: string;
      improvements: string;
    }> = [];

    for (let i = 1; i <= iterations; i++) {
      const systemPrompt = `You are a content optimization expert specializing in iterative refinement.

Your role is to improve content based on specific feedback while maintaining its core message and structure.`;

      const userPrompt = `Refine this content based on the feedback:

Current Content:
${currentContent}

Feedback:
${feedback}

Iteration ${i} of ${iterations}:
${i === 1 ? 'Make initial improvements based on feedback' : i === iterations ? 'Polish and finalize all improvements' : 'Continue refining and optimizing'}

Provide:
1. The improved content
2. List of specific improvements made
3. Explanation of changes

Format your response as:
## Improved Content
[refined content here]

## Improvements Made
- [list improvements]`;

      const result = await aiService.generateText(systemPrompt, userPrompt, options);

      // Extract the improved content (simplified parsing)
      const contentMatch = result.text.match(/## Improved Content\n([\s\S]*?)(?=\n## |$)/);
      const improvementsMatch = result.text.match(/## Improvements Made\n([\s\S]*?)$/);

      const refinedIterationContent = contentMatch
        ? contentMatch[1].trim()
        : result.text;
      const improvements = improvementsMatch ? improvementsMatch[1].trim() : '';

      iterationResults.push({
        iteration: i,
        content: refinedIterationContent,
        improvements,
      });

      currentContent = refinedIterationContent;
    }

    return {
      refinedContent: currentContent,
      iterationResults,
    };
  }

  /**
   * Multi-perspective analysis
   * Analyze content from different expert perspectives
   */
  async analyzeFromMultiplePerspectives(
    content: string,
    perspectives: Array<{
      role: string;
      focus: string;
    }>,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<Array<{ perspective: string; analysis: string; recommendations: string }>> {
    const results = [];

    for (const perspective of perspectives) {
      const systemPrompt = `You are a ${perspective.role} analyzing content.

Your expertise: ${perspective.focus}

Provide expert analysis and actionable recommendations from this specific perspective.`;

      const userPrompt = `Analyze this content from the perspective of a ${perspective.role}:

Content:
${content}

Focus Areas: ${perspective.focus}

Provide:
1. Expert analysis from this perspective
2. Strengths and weaknesses
3. Specific, actionable recommendations
4. Priority improvements (ranked)`;

      const result = await aiService.generateText(systemPrompt, userPrompt, options);

      // Parse the response
      const analysisMatch = result.text.match(/analysis[:\n]+([\s\S]*?)(?=\n##|recommendations|$)/i);
      const recommendationsMatch = result.text.match(/recommendations[:\n]+([\s\S]*?)$/i);

      results.push({
        perspective: `${perspective.role} (${perspective.focus})`,
        analysis: analysisMatch ? analysisMatch[1].trim() : result.text,
        recommendations: recommendationsMatch ? recommendationsMatch[1].trim() : '',
      });
    }

    return results;
  }

  /**
   * Comparative analysis - Compare multiple content versions
   */
  async compareVersions(
    versions: Array<{ label: string; content: string }>,
    criteria: string[],
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): Promise<{
    comparison: string;
    winner: string;
    reasoning: string;
  }> {
    const systemPrompt = `You are a content analysis expert specializing in comparative evaluation.

Your role is to objectively compare content versions and recommend the best option based on specific criteria.`;

    const versionsText = versions
      .map((v, i) => `### Version ${i + 1}: ${v.label}\n${v.content}`)
      .join('\n\n');

    const userPrompt = `Compare these content versions:

${versionsText}

Evaluation Criteria:
${criteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Provide:
1. Detailed comparison for each criterion
2. Scores for each version (1-10 per criterion)
3. Pros and cons of each version
4. Overall winner and why
5. Specific recommendations for the winning version

Be objective, data-driven, and specific in your analysis.`;

    const result = await aiService.generateText(systemPrompt, userPrompt, options);

    // Parse winner (simplified)
    const winnerMatch = result.text.match(/winner[:\s]+version\s+(\d+)[:\s]+([^\n]+)/i);
    const reasoningMatch = result.text.match(/(?:why|reasoning)[:\n]+([\s\S]*?)(?=\n##|$)/i);

    return {
      comparison: result.text,
      winner: winnerMatch ? `Version ${winnerMatch[1]}: ${winnerMatch[2]}` : 'Unknown',
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : '',
    };
  }

  /**
   * Generate a unique ID for chains
   */
  private generateId(): string {
    return `reasoning_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Execute reasoning with streaming for real-time updates
   */
  async *executeReasoningWithStreaming(
    goal: string,
    context: string,
    options?: {
      voiceToneProfile?: VoiceToneProfile;
      brandProfile?: BrandProfile;
    }
  ): AsyncGenerator<
    { stepNumber: number; stepType: string; chunk: string; isComplete: boolean },
    void,
    unknown
  > {
    const steps = [
      {
        number: 1,
        type: 'analysis',
        fn: (g: string, c: string) => this.performAnalysis(g, c, options),
      },
    ];

    for (const step of steps) {
      const systemPrompt = this.getSystemPromptForStepType(step.type);
      const userPrompt = this.getUserPromptForStepType(step.type, goal, context);

      let fullOutput = '';

      for await (const chunk of aiService.streamText(systemPrompt, userPrompt, options)) {
        fullOutput += chunk;
        yield {
          stepNumber: step.number,
          stepType: step.type,
          chunk,
          isComplete: false,
        };
      }

      yield {
        stepNumber: step.number,
        stepType: step.type,
        chunk: '',
        isComplete: true,
      };
    }
  }

  private getSystemPromptForStepType(type: string): string {
    // Implementation would return appropriate system prompts
    return '';
  }

  private getUserPromptForStepType(type: string, goal: string, context: string): string {
    // Implementation would return appropriate user prompts
    return '';
  }
}

// Export singleton instance
export const reasoningService = new ReasoningService();
