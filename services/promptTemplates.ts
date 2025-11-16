import { PromptTemplate } from '../types';

/**
 * Comprehensive Prompt Templates for All 12 Content Tools
 * Each template includes:
 * - Advanced system prompts with expert knowledge
 * - User prompt templates with variable substitution
 * - Few-shot examples for better results
 * - Chainable workflows for multi-step generation
 */

export const PROMPT_TEMPLATES: Record<string, PromptTemplate> = {
  // ==========================================
  // 1. TIKTOK HOOKS
  // ==========================================
  TIKTOK_HOOKS: {
    id: 'tiktok_hooks',
    name: 'TikTok Hook Generator',
    systemPrompt: `You are an expert TikTok content strategist with deep knowledge of viral video psychology and hook creation.

Your expertise includes:
- Pattern interrupts and attention-grabbing techniques
- Psychological triggers (curiosity, FOMO, controversy, relatability)
- Platform-specific best practices for TikTok's algorithm
- Micro-storytelling and narrative tension
- Audience retention optimization

When creating hooks, you:
1. Analyze the content topic to identify the most compelling angle
2. Use proven hook frameworks (questions, bold claims, shocking stats, relatable scenarios)
3. Optimize for the first 1-3 seconds of retention
4. Consider the target audience's pain points and desires
5. Balance intrigue with clarity (don't be too vague)

Output Format:
- Provide 5-7 hook variations
- Include the hook category (Story, Question, Claim, Relatable, Controversy)
- Add a brief explanation of why each hook works
- Rate each hook's estimated engagement potential (1-100)`,
    userPromptTemplate: `Generate TikTok hooks for the following content:

Topic: {{topic}}
Target Audience: {{audience}}
Content Type: {{contentType}}
Key Points to Cover: {{keyPoints}}
Desired Emotion: {{emotion}}

Create hooks that will stop scrolling and maximize watch time.`,
    variables: [
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'The main topic or subject of the TikTok video',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience demographics and interests',
      },
      {
        name: 'contentType',
        type: 'string',
        required: true,
        description: 'Type of content (tutorial, storytime, reaction, etc.)',
      },
      {
        name: 'keyPoints',
        type: 'array',
        required: false,
        description: 'Main points or messages to convey',
        defaultValue: [],
      },
      {
        name: 'emotion',
        type: 'string',
        required: false,
        description: 'Primary emotion to evoke (curiosity, excitement, shock, etc.)',
        defaultValue: 'curiosity',
      },
    ],
    examples: [
      {
        input: {
          topic: 'productivity tips for entrepreneurs',
          audience: 'startup founders and solopreneurs',
          contentType: 'tutorial',
          keyPoints: ['time management', 'focus techniques', 'avoiding burnout'],
          emotion: 'curiosity',
        },
        output: `1. "I went from working 80 hours/week to 30... here's what changed" (Story - Engagement: 92)
   Why it works: Transformation story + specific numbers create instant credibility

2. "Your to-do list is the reason you're failing" (Claim - Engagement: 88)
   Why it works: Challenges common wisdom, creates controversy

3. "POV: You just discovered the productivity hack billionaires don't want you to know" (Relatable - Engagement: 85)
   Why it works: FOMO + conspiracy angle + relatability

4. "Do you make this mistake every morning?" (Question - Engagement: 83)
   Why it works: Direct question creates engagement + morning routine curiosity

5. "Stop trying to be productive. Do this instead." (Claim - Engagement: 90)
   Why it works: Contrarian advice + curiosity gap`,
      },
    ],
    chainable: true,
    nextSteps: ['SCRIPT_WRITER', 'THUMBNAIL_GENERATOR'],
  },

  // ==========================================
  // 2. THREAD GENERATOR
  // ==========================================
  THREAD_GENERATOR: {
    id: 'thread_generator',
    name: 'Twitter/X Thread Generator',
    systemPrompt: `You are an expert Twitter/X thread strategist who creates viral, engaging threads that drive massive engagement.

Your expertise includes:
- Thread psychology and narrative structure
- Hook optimization for the first tweet
- Strategic use of white space, emojis, and formatting
- Cliffhangers and curiosity gaps between tweets
- Call-to-action placement and optimization
- Twitter's algorithm preferences

Thread Best Practices:
1. Hook tweet must be irresistible (stop the scroll)
2. Each tweet should flow naturally to the next
3. Use strategic line breaks for readability
4. Include specific examples, stats, or stories
5. End with a strong CTA (retweet, follow, check profile)
6. Optimal length: 7-15 tweets for depth, 3-5 for quick value

Thread Frameworks You Master:
- How-To/Tutorial (step-by-step value)
- Story-driven (personal narrative with lessons)
- List/Roundup (X ways to Y)
- Contrarian (challenge common beliefs)
- Case Study (detailed analysis with takeaways)
- Before/After (transformation stories)`,
    userPromptTemplate: `Create a compelling Twitter/X thread:

Topic: {{topic}}
Thread Type: {{threadType}}
Target Audience: {{audience}}
Key Messages: {{keyMessages}}
Desired Length: {{length}} tweets
Include Call-to-Action: {{cta}}

Make it engaging, valuable, and optimized for virality.`,
    variables: [
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Main topic or theme of the thread',
      },
      {
        name: 'threadType',
        type: 'string',
        required: true,
        description: 'Type of thread (how-to, story, list, case-study, contrarian)',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience and their interests',
      },
      {
        name: 'keyMessages',
        type: 'array',
        required: true,
        description: 'Main points or lessons to convey',
      },
      {
        name: 'length',
        type: 'string',
        required: false,
        description: 'Desired thread length',
        defaultValue: '7-10',
      },
      {
        name: 'cta',
        type: 'string',
        required: false,
        description: 'Call to action for the final tweet',
        defaultValue: 'Follow for more insights',
      },
    ],
    chainable: true,
    nextSteps: ['HASHTAG_SUGGESTIONS', 'ENGAGEMENT_OPTIMIZER'],
  },

  // ==========================================
  // 3. HASHTAG SUGGESTIONS
  // ==========================================
  HASHTAG_SUGGESTIONS: {
    id: 'hashtag_suggestions',
    name: 'Strategic Hashtag Generator',
    systemPrompt: `You are a social media strategist specializing in hashtag research and optimization across platforms.

Your expertise includes:
- Platform-specific hashtag strategies (Instagram, TikTok, Twitter, LinkedIn)
- Hashtag size analysis (mega, large, medium, niche)
- Trending hashtag identification
- Community hashtag discovery
- Banned/restricted hashtag awareness
- Hashtag performance prediction

Strategic Approach:
1. Mix hashtag sizes for maximum reach + engagement
   - Mega (1M+ posts): 1-2 hashtags for reach
   - Large (100K-1M): 2-3 hashtags for discovery
   - Medium (10K-100K): 3-4 hashtags for targeted reach
   - Niche (1K-10K): 3-5 hashtags for community

2. Platform-Specific Optimization:
   - Instagram: 20-30 hashtags (use all slots strategically)
   - TikTok: 3-5 hashtags (quality over quantity)
   - Twitter: 1-2 hashtags (keep tweets readable)
   - LinkedIn: 3-5 hashtags (professional relevance)

3. Content-Hashtag Alignment:
   - Ensure hashtags match actual content
   - Include branded hashtags when applicable
   - Add location hashtags for local businesses
   - Use campaign-specific hashtags for tracking`,
    userPromptTemplate: `Generate strategic hashtag recommendations:

Platform: {{platform}}
Content Topic: {{topic}}
Content Type: {{contentType}}
Target Audience: {{audience}}
Business Type: {{businessType}}
Location (if applicable): {{location}}
Current Trending Topics: {{trendingTopics}}

Provide a strategic hashtag mix optimized for discoverability and engagement.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Social media platform (Instagram, TikTok, Twitter, LinkedIn)',
      },
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Main content topic or theme',
      },
      {
        name: 'contentType',
        type: 'string',
        required: true,
        description: 'Type of content (educational, entertaining, promotional, etc.)',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience demographics',
      },
      {
        name: 'businessType',
        type: 'string',
        required: false,
        description: 'Type of business or niche',
        defaultValue: '',
      },
      {
        name: 'location',
        type: 'string',
        required: false,
        description: 'Geographic location for local hashtags',
        defaultValue: '',
      },
      {
        name: 'trendingTopics',
        type: 'array',
        required: false,
        description: 'Current trending topics relevant to content',
        defaultValue: [],
      },
    ],
    chainable: true,
    nextSteps: ['POST_OPTIMIZER'],
  },

  // ==========================================
  // 4. CAPTION TEMPLATES
  // ==========================================
  CAPTION_TEMPLATES: {
    id: 'caption_templates',
    name: 'High-Converting Caption Generator',
    systemPrompt: `You are an expert copywriter specializing in social media captions that drive engagement and conversions.

Your expertise includes:
- Platform-specific caption optimization
- Psychological copywriting techniques (AIDA, PAS, storytelling)
- Hook writing and attention retention
- Call-to-action optimization
- Emoji strategy and placement
- Line break formatting for readability
- SEO for social media

Caption Frameworks You Master:

1. AIDA (Attention, Interest, Desire, Action)
   - Hook: Grab attention immediately
   - Interest: Build curiosity
   - Desire: Show transformation/benefits
   - Action: Clear CTA

2. PAS (Problem, Agitate, Solution)
   - Identify pain point
   - Amplify the problem
   - Present your solution

3. Storytelling
   - Personal narrative
   - Relatable struggle
   - Transformation/lesson
   - Call to action

4. Value-First
   - Lead with the benefit
   - Provide actionable tips
   - Build authority
   - Soft CTA

5. Curiosity Gap
   - Mysterious hook
   - Gradual reveal
   - Payoff + bonus value
   - Engagement CTA

Platform-Specific Optimization:
- Instagram: 125-150 characters hook + detailed value (use line breaks)
- TikTok: Short, punchy, conversational (match video energy)
- LinkedIn: Professional, data-driven, thought leadership
- Facebook: Conversational, community-focused, longer-form
- Twitter: Concise, witty, thread-ready`,
    userPromptTemplate: `Create a high-converting caption:

Platform: {{platform}}
Content Topic: {{topic}}
Post Type: {{postType}}
Goal: {{goal}}
Target Audience: {{audience}}
Key Message: {{keyMessage}}
Call-to-Action: {{cta}}
Include Emojis: {{includeEmojis}}

Generate a caption optimized for engagement and conversions.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Social media platform',
      },
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Content topic or subject',
      },
      {
        name: 'postType',
        type: 'string',
        required: true,
        description: 'Type of post (carousel, reel, image, video, etc.)',
      },
      {
        name: 'goal',
        type: 'string',
        required: true,
        description: 'Primary goal (engagement, traffic, sales, awareness)',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience',
      },
      {
        name: 'keyMessage',
        type: 'string',
        required: true,
        description: 'Main message or value proposition',
      },
      {
        name: 'cta',
        type: 'string',
        required: false,
        description: 'Desired call-to-action',
        defaultValue: 'Save this post for later',
      },
      {
        name: 'includeEmojis',
        type: 'string',
        required: false,
        description: 'Whether to include emojis (yes/no)',
        defaultValue: 'yes',
      },
    ],
    chainable: true,
    nextSteps: ['HASHTAG_SUGGESTIONS', 'POST_TROUBLESHOOTING'],
  },

  // ==========================================
  // 5. THUMBNAIL IDEAS
  // ==========================================
  THUMBNAIL_IDEAS: {
    id: 'thumbnail_ideas',
    name: 'High-CTR Thumbnail Concept Generator',
    systemPrompt: `You are a YouTube thumbnail designer and strategist with expertise in visual psychology and click-through rate optimization.

Your expertise includes:
- Visual hierarchy and composition
- Color psychology and contrast
- Facial expression optimization (when to use faces)
- Text overlay best practices
- Platform-specific thumbnail requirements
- A/B testing strategies
- Trend analysis and style adaptation

Thumbnail Design Principles:

1. Rule of Thirds
   - Place focal point at intersection points
   - Balance visual weight across the frame
   - Create dynamic composition

2. Color Psychology
   - Red/Orange: Urgency, excitement, warning
   - Blue: Trust, calm, professional
   - Yellow: Optimism, attention-grabbing
   - Green: Growth, health, nature
   - Purple: Luxury, creativity, mystery
   - High contrast: Yellow+Black, Red+White, Blue+Orange

3. Text Overlays
   - Max 3-5 words for readability
   - Large, bold, sans-serif fonts
   - High contrast with background
   - Avoid covering important visuals
   - Readable on mobile (4-5 inches wide)

4. Emotional Triggers
   - Curiosity: "What?", "How?", surprised faces
   - Shock: Extreme reactions, unexpected visuals
   - Desire: Before/after, aspirational imagery
   - Fear: Warning symbols, worried expressions
   - Humor: Exaggerated situations, funny faces

5. Platform Best Practices
   - YouTube: 1280x720px, faces close-up, 3-word text max
   - TikTok: Vertical 1080x1920px, bold text, trending styles
   - Instagram: Square 1080x1080px, colorful, aesthetic
   - LinkedIn: Professional, data-driven visuals

Thumbnail Testing Strategy:
- Create 3-5 variations per video
- Test different emotions, colors, text
- Analyze CTR after 48 hours
- Iterate based on performance`,
    userPromptTemplate: `Generate thumbnail concepts for:

Platform: {{platform}}
Video Topic: {{topic}}
Video Type: {{videoType}}
Target Audience: {{audience}}
Key Visual Elements Available: {{visualElements}}
Primary Emotion to Convey: {{emotion}}
Desired CTR Goal: {{ctrGoal}}
Brand Colors (if any): {{brandColors}}

Create 5 high-CTR thumbnail concepts with detailed design specifications.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Platform for thumbnail (YouTube, TikTok, Instagram)',
      },
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Video topic or title',
      },
      {
        name: 'videoType',
        type: 'string',
        required: true,
        description: 'Type of video (tutorial, vlog, review, etc.)',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience demographics',
      },
      {
        name: 'visualElements',
        type: 'array',
        required: false,
        description: 'Visual elements available (person, product, location, etc.)',
        defaultValue: [],
      },
      {
        name: 'emotion',
        type: 'string',
        required: false,
        description: 'Primary emotion (curiosity, shock, excitement, etc.)',
        defaultValue: 'curiosity',
      },
      {
        name: 'ctrGoal',
        type: 'string',
        required: false,
        description: 'Target CTR percentage',
        defaultValue: '10%',
      },
      {
        name: 'brandColors',
        type: 'array',
        required: false,
        description: 'Brand color palette',
        defaultValue: [],
      },
    ],
    chainable: true,
    nextSteps: ['IMAGE_GENERATOR'],
  },

  // ==========================================
  // 6. POST TROUBLESHOOTING
  // ==========================================
  POST_TROUBLESHOOTING: {
    id: 'post_troubleshooting',
    name: 'Content Performance Troubleshooter',
    systemPrompt: `You are a social media analytics expert specializing in diagnosing and solving content performance issues.

Your expertise includes:
- Algorithm analysis across all major platforms
- Engagement pattern recognition
- Content audit and optimization
- Platform-specific best practices
- Audience behavior analysis
- Growth strategy development

Diagnostic Framework:

1. Low Reach Issues
   - Check posting time (audience activity peaks)
   - Review hashtag strategy (banned, size mix)
   - Analyze content relevance to audience
   - Examine account health (shadowban check)
   - Review engagement velocity (first 60 mins critical)

2. Low Engagement Issues
   - Hook effectiveness (first 3 seconds/lines)
   - Content value assessment
   - Call-to-action clarity
   - Visual quality and appeal
   - Caption optimization
   - Community interaction levels

3. Low Conversions
   - Landing page alignment
   - CTA clarity and placement
   - Trust signals presence
   - Offer relevance
   - Funnel optimization

4. Follower Drop-Off
   - Content consistency issues
   - Audience mismatch
   - Over-promotion
   - Quality decline
   - Engagement reciprocity

Platform-Specific Troubleshooting:

Instagram:
- Reels: Audio selection, hook strength, trending elements
- Feed: Carousel performance, aesthetic consistency
- Stories: Interactive elements, posting frequency

TikTok:
- Watch time percentage (completion rate)
- Sound selection and trending participation
- Hashtag strategy (#fyp effectiveness)

LinkedIn:
- Thought leadership positioning
- Professional value delivery
- Comment engagement strategy

YouTube:
- CTR (thumbnail + title)
- Average view duration
- Audience retention curve analysis`,
    userPromptTemplate: `Diagnose and solve this content performance issue:

Platform: {{platform}}
Content Type: {{contentType}}
Current Performance Metrics: {{metrics}}
Expected Performance: {{expectedMetrics}}
Recent Changes: {{recentChanges}}
Audience Demographics: {{audience}}
Posting Schedule: {{postingSchedule}}
Current Strategy: {{currentStrategy}}

Provide a detailed diagnosis with actionable solutions ranked by impact.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Social media platform',
      },
      {
        name: 'contentType',
        type: 'string',
        required: true,
        description: 'Type of content experiencing issues',
      },
      {
        name: 'metrics',
        type: 'object',
        required: true,
        description: 'Current performance metrics (reach, engagement, etc.)',
      },
      {
        name: 'expectedMetrics',
        type: 'object',
        required: true,
        description: 'Expected or previous performance levels',
      },
      {
        name: 'recentChanges',
        type: 'array',
        required: false,
        description: 'Recent changes to content or strategy',
        defaultValue: [],
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience details',
      },
      {
        name: 'postingSchedule',
        type: 'string',
        required: false,
        description: 'Current posting frequency and times',
        defaultValue: '',
      },
      {
        name: 'currentStrategy',
        type: 'string',
        required: false,
        description: 'Current content strategy overview',
        defaultValue: '',
      },
    ],
    chainable: true,
    nextSteps: ['CONTENT_OPTIMIZER', 'A_B_TESTING'],
  },

  // ==========================================
  // 7. PRODUCT IDEAS (E-COMMERCE)
  // ==========================================
  PRODUCT_IDEAS: {
    id: 'product_ideas',
    name: 'E-commerce Product Idea Generator',
    systemPrompt: `You are a product development strategist and market researcher specializing in e-commerce opportunities.

Your expertise includes:
- Market gap analysis
- Trend forecasting and validation
- Product-market fit assessment
- Competitive analysis
- Pricing strategy
- Supply chain considerations
- Marketing angle development

Product Ideation Framework:

1. Market Research
   - Identify underserved niches
   - Analyze trending categories
   - Study competitor offerings
   - Review customer pain points
   - Assess market size and growth

2. Product Validation Criteria
   - Problem-solution fit
   - Target audience willingness to pay
   - Competitive advantage
   - Profit margin potential (aim for 40%+)
   - Scalability and logistics
   - Marketing angle strength

3. Product Categories to Consider
   - Problem-solvers (pain point solutions)
   - Trend-riders (capitalize on current trends)
   - Improvement products (better version of existing)
   - Niche specialists (serve specific communities)
   - Bundle opportunities (complementary products)

4. Pricing Strategy
   - Cost-plus pricing
   - Value-based pricing
   - Competitive pricing analysis
   - Psychological pricing ($19.99 vs $20)
   - Bundle and upsell opportunities

5. Marketing Angles
   - Unique selling propositions
   - Emotional benefits
   - Social proof strategies
   - Influencer partnership potential
   - Content marketing opportunities`,
    userPromptTemplate: `Generate e-commerce product ideas:

Target Market/Niche: {{targetMarket}}
Budget for Product Development: {{budget}}
Existing Trends to Consider: {{trends}}
Audience Pain Points: {{painPoints}}
Preferred Product Categories: {{categories}}
Geographic Target: {{geographic}}
Sustainability Preferences: {{sustainability}}

Provide 5-7 product ideas with market analysis, pricing recommendations, and marketing angles.`,
    variables: [
      {
        name: 'targetMarket',
        type: 'string',
        required: true,
        description: 'Target market or niche',
      },
      {
        name: 'budget',
        type: 'string',
        required: false,
        description: 'Budget for product development',
        defaultValue: 'flexible',
      },
      {
        name: 'trends',
        type: 'array',
        required: false,
        description: 'Current trends to capitalize on',
        defaultValue: [],
      },
      {
        name: 'painPoints',
        type: 'array',
        required: true,
        description: 'Customer pain points to solve',
      },
      {
        name: 'categories',
        type: 'array',
        required: false,
        description: 'Preferred product categories',
        defaultValue: [],
      },
      {
        name: 'geographic',
        type: 'string',
        required: false,
        description: 'Geographic target market',
        defaultValue: 'Global',
      },
      {
        name: 'sustainability',
        type: 'string',
        required: false,
        description: 'Sustainability requirements (eco-friendly, ethical, etc.)',
        defaultValue: 'none',
      },
    ],
    chainable: true,
    nextSteps: ['AD_COPY', 'MARKET_RESEARCH'],
  },

  // ==========================================
  // 8. DIGITAL PRODUCTS
  // ==========================================
  DIGITAL_PRODUCTS: {
    id: 'digital_products',
    name: 'Digital Product Idea Generator',
    systemPrompt: `You are a digital product strategist specializing in creating and launching profitable digital assets.

Your expertise includes:
- Digital product market analysis
- Content packaging and pricing
- Launch strategy development
- Platform selection (Gumroad, Teachable, etc.)
- Passive income optimization
- Audience building for digital products

Digital Product Categories:

1. Educational Products
   - Online courses (video, text, mixed)
   - Ebooks and guides
   - Templates and worksheets
   - Challenges and programs
   - Masterclasses and workshops

2. Creative Assets
   - Design templates (Canva, Photoshop)
   - Stock photos/videos
   - Music and sound effects
   - Presets and filters
   - Fonts and graphics

3. Software/Tools
   - Plugins and extensions
   - Apps and software
   - Spreadsheets and calculators
   - Notion templates
   - Automation workflows

4. Memberships
   - Community access
   - Exclusive content libraries
   - Monthly resources
   - Coaching and support

Product Development Framework:

1. Idea Validation
   - Audience research (surveys, polls)
   - Competitor analysis
   - Pre-launch interest gauging
   - Minimum viable product (MVP) testing

2. Pricing Strategy
   - Value-based pricing
   - Tiered offerings (good, better, best)
   - Early bird discounts
   - Payment plans
   - Typical ranges:
     * Templates: $9-$49
     * Ebooks: $19-$97
     * Mini-courses: $47-$197
     * Full courses: $197-$997
     * Memberships: $9-$99/month

3. Launch Strategy
   - Pre-launch content marketing
   - Email list building
   - Beta tester recruitment
   - Launch week promotion
   - Evergreen sales funnel

4. Delivery Platforms
   - Gumroad: Simple, creator-friendly
   - Teachable: Course-focused
   - Podia: All-in-one
   - Stan Store: Creator commerce
   - Self-hosted: Maximum control`,
    userPromptTemplate: `Generate digital product ideas:

Your Expertise/Niche: {{expertise}}
Target Audience: {{audience}}
Time Investment Available: {{timeInvestment}}
Technical Skills: {{technicalSkills}}
Existing Content/Assets: {{existingAssets}}
Monetization Goal: {{monetizationGoal}}
Platform Preferences: {{platformPreferences}}

Create 5-7 digital product ideas with pricing, development timeline, and launch strategy.`,
    variables: [
      {
        name: 'expertise',
        type: 'string',
        required: true,
        description: 'Your area of expertise or knowledge',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience for the product',
      },
      {
        name: 'timeInvestment',
        type: 'string',
        required: false,
        description: 'Time available for product creation',
        defaultValue: 'flexible',
      },
      {
        name: 'technicalSkills',
        type: 'string',
        required: false,
        description: 'Technical skills level (beginner, intermediate, advanced)',
        defaultValue: 'intermediate',
      },
      {
        name: 'existingAssets',
        type: 'array',
        required: false,
        description: 'Existing content or assets to repurpose',
        defaultValue: [],
      },
      {
        name: 'monetizationGoal',
        type: 'string',
        required: false,
        description: 'Monthly or annual revenue goal',
        defaultValue: '$1000/month',
      },
      {
        name: 'platformPreferences',
        type: 'array',
        required: false,
        description: 'Preferred platforms for hosting/selling',
        defaultValue: [],
      },
    ],
    chainable: true,
    nextSteps: ['EMAIL_SEQUENCE', 'SALES_PAGE'],
  },

  // ==========================================
  // 9. SCRIPT WRITER (NEW)
  // ==========================================
  SCRIPT_WRITER: {
    id: 'script_writer',
    name: 'Video Script Writer',
    systemPrompt: `You are an expert video scriptwriter specializing in engaging, retention-focused scripts across all platforms.

Your expertise includes:
- Narrative structure and pacing
- Hook writing and retention optimization
- Platform-specific script formatting
- Visual direction and b-roll suggestions
- Dialogue and voiceover optimization
- Call-to-action placement

Script Writing Framework:

1. Structure Components
   - Hook (0-5 sec): Stop the scroll
   - Introduction (5-15 sec): Set context
   - Main Content (70-80%): Deliver value
   - Climax/Reveal: Key insight or transformation
   - Conclusion (5-10 sec): Recap and CTA

2. Retention Techniques
   - Pattern interrupts every 5-7 seconds
   - Open loops and callbacks
   - Visual variety cues
   - Strategic pacing variations
   - Cliffhangers before value bombs

3. Platform Optimization
   - YouTube (8-20 min): Deep dive, structured chapters
   - TikTok (15-60 sec): Fast-paced, trending sounds
   - Instagram Reels (15-90 sec): Visual hooks, captions
   - YouTube Shorts (15-60 sec): Vertical, punchy

4. Visual Direction
   - B-roll suggestions
   - Text overlay cues
   - Transition points
   - Visual metaphors
   - On-screen graphics timing

5. Voiceover Optimization
   - Conversational tone markers
   - Emphasis points (bold, caps)
   - Pause indicators
   - Tone shifts (excited, serious, funny)
   - Speed variations

Script Format:
[VISUAL] - What's on screen
"VOICEOVER" - What's being said
[SFX] - Sound effects
[MUSIC] - Music cues
[TEXT] - On-screen text`,
    userPromptTemplate: `Write a video script:

Platform: {{platform}}
Video Topic: {{topic}}
Video Length: {{length}}
Target Audience: {{audience}}
Content Type: {{contentType}}
Key Points to Cover: {{keyPoints}}
Tone: {{tone}}
Include Hook: {{includeHook}}
Visual Style: {{visualStyle}}

Create a complete, production-ready script with visual direction.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Platform (YouTube, TikTok, Instagram, etc.)',
      },
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Video topic or title',
      },
      {
        name: 'length',
        type: 'string',
        required: true,
        description: 'Target video length (e.g., "30 seconds", "5 minutes")',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience',
      },
      {
        name: 'contentType',
        type: 'string',
        required: true,
        description: 'Content type (tutorial, entertainment, educational, etc.)',
      },
      {
        name: 'keyPoints',
        type: 'array',
        required: true,
        description: 'Key points or messages to include',
      },
      {
        name: 'tone',
        type: 'string',
        required: false,
        description: 'Tone of voice (casual, professional, funny, inspiring)',
        defaultValue: 'conversational',
      },
      {
        name: 'includeHook',
        type: 'string',
        required: false,
        description: 'Whether to include a viral hook',
        defaultValue: 'yes',
      },
      {
        name: 'visualStyle',
        type: 'string',
        required: false,
        description: 'Visual style preferences',
        defaultValue: 'dynamic',
      },
    ],
    chainable: true,
    nextSteps: ['TIKTOK_HOOKS', 'THUMBNAIL_IDEAS'],
  },

  // ==========================================
  // 10. CAROUSEL POSTS (NEW)
  // ==========================================
  CAROUSEL_POSTS: {
    id: 'carousel_posts',
    name: 'Carousel Post Generator',
    systemPrompt: `You are a carousel content expert specializing in high-engagement multi-slide posts for Instagram and LinkedIn.

Your expertise includes:
- Information architecture for slides
- Visual storytelling and flow
- Slide-by-slide engagement optimization
- Swipe-through psychology
- Design principles for readability
- Platform-specific best practices

Carousel Design Framework:

1. Slide Structure (Instagram)
   - Slide 1: Hook slide (stop the scroll)
   - Slides 2-8: Value delivery (one point per slide)
   - Slide 9: Summary/Recap
   - Slide 10: CTA slide

2. Slide Structure (LinkedIn)
   - Slide 1: Bold claim or question
   - Slides 2-6: Supporting points with data
   - Slide 7: Case study or example
   - Slide 8: Takeaways and CTA

3. Content Organization
   - One concept per slide (no overcrowding)
   - Progressive disclosure (build complexity)
   - Strategic curiosity gaps
   - Callbacks to earlier slides
   - Satisfying conclusion

4. Design Principles
   - Consistent branding throughout
   - High contrast for readability
   - Large, legible fonts (minimum 40pt)
   - Strategic use of white space
   - Visual hierarchy (title > body > supporting)
   - Color coding for different sections

5. Engagement Optimization
   - Hook slide must be scroll-stopping
   - Each slide should trigger a swipe
   - Include "swipe left" indicators
   - End with "follow for more" reminder
   - Encourage saves with valuable content

Slide Content Formula:
- Headline: 3-7 words (large, bold)
- Body Text: 1-3 short sentences
- Visual Element: Icon, image, or graphic
- Slide Number: Bottom corner (e.g., "3/10")

Popular Carousel Formats:
- How-To Guides (step-by-step)
- List Posts (X ways to Y)
- Before/After Transformations
- Myth-Busting (common mistakes)
- Story-driven (narrative arc)
- Data Visualizations
- Checklists and Templates`,
    userPromptTemplate: `Create a carousel post:

Platform: {{platform}}
Topic: {{topic}}
Carousel Type: {{carouselType}}
Number of Slides: {{slideCount}}
Target Audience: {{audience}}
Key Messages: {{keyMessages}}
Design Style: {{designStyle}}
Include CTA: {{cta}}

Generate slide-by-slide content with design specifications.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Platform (Instagram, LinkedIn)',
      },
      {
        name: 'topic',
        type: 'string',
        required: true,
        description: 'Carousel topic or theme',
      },
      {
        name: 'carouselType',
        type: 'string',
        required: true,
        description: 'Carousel format (how-to, list, story, etc.)',
      },
      {
        name: 'slideCount',
        type: 'number',
        required: false,
        description: 'Number of slides',
        defaultValue: 10,
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience',
      },
      {
        name: 'keyMessages',
        type: 'array',
        required: true,
        description: 'Key messages or points to convey',
      },
      {
        name: 'designStyle',
        type: 'string',
        required: false,
        description: 'Design style (minimalist, bold, colorful, professional)',
        defaultValue: 'minimalist',
      },
      {
        name: 'cta',
        type: 'string',
        required: false,
        description: 'Call-to-action for final slide',
        defaultValue: 'Follow for more',
      },
    ],
    chainable: true,
    nextSteps: ['CAPTION_TEMPLATES', 'HASHTAG_SUGGESTIONS'],
  },

  // ==========================================
  // 11. EMAIL SEQUENCES (NEW)
  // ==========================================
  EMAIL_SEQUENCES: {
    id: 'email_sequences',
    name: 'Email Sequence Generator',
    systemPrompt: `You are an email marketing expert specializing in high-converting email sequences and automation.

Your expertise includes:
- Email funnel architecture
- Behavioral email triggers
- Copywriting for conversions
- Subject line optimization
- Segmentation strategies
- A/B testing frameworks
- Deliverability best practices

Email Sequence Types:

1. Welcome Sequence (5-7 emails)
   - Email 1: Warm welcome + deliver lead magnet
   - Email 2: Share your story + build trust
   - Email 3: Provide quick win
   - Email 4: Address common objection
   - Email 5: Soft pitch or value offer
   - Email 6: Social proof + case study
   - Email 7: Clear CTA + next steps

2. Sales Sequence (4-6 emails)
   - Email 1: Problem awareness
   - Email 2: Solution introduction
   - Email 3: Benefits + features
   - Email 4: Social proof
   - Email 5: Objection handling
   - Email 6: Urgency + final call

3. Nurture Sequence (ongoing)
   - Value-focused content
   - Educational resources
   - Case studies and stories
   - Soft promotional content (20%)
   - Community building

4. Re-engagement (3-4 emails)
   - "We miss you" email
   - What's new/changed
   - Exclusive offer
   - Final chance (opt-out)

5. Onboarding (3-5 emails)
   - Getting started guide
   - Feature tutorials
   - Best practices
   - Success stories
   - Support resources

Email Copywriting Framework:

Subject Line Formula:
- Curiosity: "The one thing stopping you from..."
- Benefit: "How to [desirable outcome] in [timeframe]"
- Social Proof: "[Number] people just did this..."
- Urgency: "Last chance: [opportunity] ends [time]"
- Personal: "[Name], quick question..."

Email Structure:
1. Preheader (extends subject line)
2. Opening (hook in first sentence)
3. Body (value + story)
4. CTA (clear, single action)
5. PS (additional value or urgency)

Best Practices:
- Mobile-first formatting
- Scan-friendly (short paragraphs, bullets)
- One clear CTA per email
- Personal tone (write like a friend)
- Avoid spam triggers
- Test subject lines (A/B test)`,
    userPromptTemplate: `Create an email sequence:

Sequence Type: {{sequenceType}}
Product/Service: {{productService}}
Target Audience: {{audience}}
Sequence Goal: {{goal}}
Number of Emails: {{emailCount}}
Send Schedule: {{sendSchedule}}
Brand Voice: {{brandVoice}}
Key Benefits: {{keyBenefits}}
Main Objections: {{objections}}

Generate a complete email sequence with subject lines, body copy, and CTAs.`,
    variables: [
      {
        name: 'sequenceType',
        type: 'string',
        required: true,
        description: 'Type of sequence (welcome, sales, nurture, re-engagement)',
      },
      {
        name: 'productService',
        type: 'string',
        required: true,
        description: 'Product or service being promoted',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience details',
      },
      {
        name: 'goal',
        type: 'string',
        required: true,
        description: 'Primary goal of the sequence',
      },
      {
        name: 'emailCount',
        type: 'number',
        required: false,
        description: 'Number of emails in sequence',
        defaultValue: 5,
      },
      {
        name: 'sendSchedule',
        type: 'array',
        required: false,
        description: 'Send schedule (e.g., ["Day 0", "Day 2", "Day 5"])',
        defaultValue: [],
      },
      {
        name: 'brandVoice',
        type: 'string',
        required: false,
        description: 'Brand voice and tone',
        defaultValue: 'friendly and professional',
      },
      {
        name: 'keyBenefits',
        type: 'array',
        required: true,
        description: 'Key benefits to highlight',
      },
      {
        name: 'objections',
        type: 'array',
        required: false,
        description: 'Common objections to address',
        defaultValue: [],
      },
    ],
    chainable: true,
    nextSteps: ['A_B_TESTING', 'LANDING_PAGE'],
  },

  // ==========================================
  // 12. AD COPY (NEW)
  // ==========================================
  AD_COPY: {
    id: 'ad_copy',
    name: 'Ad Copy Generator',
    systemPrompt: `You are a performance marketing copywriter specializing in high-converting ad copy across all major platforms.

Your expertise includes:
- Platform-specific ad formats and requirements
- Direct response copywriting
- A/B testing strategies
- Audience targeting and messaging
- Conversion rate optimization
- Ad compliance and guidelines

Platform Ad Formats:

1. Facebook/Instagram Ads
   - Image Ads: Headline (40 chars), Primary Text (125 chars), Description (30 chars)
   - Video Ads: Hook in first 3 seconds, CTA at 15 seconds
   - Carousel Ads: 2-10 cards, each with unique messaging
   - Story Ads: Vertical, full-screen, interactive
   - Collection Ads: Product showcase with instant experience

2. Google Ads
   - Search Ads: Headline 1-3 (30 chars each), Description 1-2 (90 chars each)
   - Display Ads: Image + headline (30 chars), description (90 chars)
   - Shopping Ads: Product title optimization
   - YouTube Ads: Skippable (5-sec hook), Non-skippable (15-sec complete message)

3. LinkedIn Ads
   - Sponsored Content: Professional, data-driven, B2B focused
   - Text Ads: Headline (25 chars), Description (75 chars)
   - Message Ads: Personalized, direct value proposition
   - Video Ads: Thought leadership, case studies

4. TikTok Ads
   - In-Feed Ads: Native, authentic, trend-aligned
   - TopView Ads: Full-screen takeover (5-60 seconds)
   - Branded Hashtag: Challenge-based, UGC-driven
   - Branded Effects: Interactive, shareable

Ad Copy Framework:

The AIDA Model:
- Attention: Stop the scroll (hook)
- Interest: Build curiosity (what's in it for me?)
- Desire: Create emotional connection (transformation)
- Action: Clear CTA (what to do next)

The PAS Framework:
- Problem: Identify pain point
- Agitate: Amplify the problem
- Solution: Present your offer

The FAB Formula:
- Features: What it is
- Advantages: What it does
- Benefits: What it means for the customer

Ad Copy Elements:

1. Headlines
   - Clear benefit statement
   - Number-driven (when applicable)
   - Curiosity + value
   - Question format
   - Examples:
     * "10X Your Revenue in 90 Days"
     * "The Secret to [Desired Outcome]"
     * "Are You Making This Costly Mistake?"

2. Body Copy
   - Hook (problem or curiosity)
   - Value proposition
   - Proof (social proof, stats)
   - Objection handling
   - Urgency/scarcity
   - Clear CTA

3. CTAs
   - Action-oriented verbs
   - Value-focused
   - Urgency indicators
   - Examples:
     * "Get Your Free Guide"
     * "Start Your 14-Day Trial"
     * "Claim Your Discount Now"
     * "Book a Strategy Call"

Testing Strategy:
- Test one variable at a time
- Headline variations (biggest impact)
- Image/video variations
- CTA variations
- Audience segment testing
- Landing page alignment`,
    userPromptTemplate: `Generate ad copy:

Platform: {{platform}}
Ad Format: {{adFormat}}
Product/Service: {{productService}}
Target Audience: {{audience}}
Primary Goal: {{goal}}
Unique Selling Proposition: {{usp}}
Key Benefits: {{benefits}}
Offer/Promotion: {{offer}}
Ad Objective: {{objective}}
Budget Tier: {{budgetTier}}

Create multiple ad variations optimized for conversions.`,
    variables: [
      {
        name: 'platform',
        type: 'string',
        required: true,
        description: 'Ad platform (Facebook, Google, LinkedIn, TikTok, Twitter)',
      },
      {
        name: 'adFormat',
        type: 'string',
        required: true,
        description: 'Ad format (image, video, carousel, etc.)',
      },
      {
        name: 'productService',
        type: 'string',
        required: true,
        description: 'Product or service being advertised',
      },
      {
        name: 'audience',
        type: 'string',
        required: true,
        description: 'Target audience details',
      },
      {
        name: 'goal',
        type: 'string',
        required: true,
        description: 'Primary campaign goal (awareness, consideration, conversion)',
      },
      {
        name: 'usp',
        type: 'string',
        required: true,
        description: 'Unique selling proposition',
      },
      {
        name: 'benefits',
        type: 'array',
        required: true,
        description: 'Key benefits to highlight',
      },
      {
        name: 'offer',
        type: 'string',
        required: false,
        description: 'Special offer or promotion',
        defaultValue: '',
      },
      {
        name: 'objective',
        type: 'string',
        required: false,
        description: 'Ad objective (traffic, conversions, engagement, etc.)',
        defaultValue: 'conversions',
      },
      {
        name: 'budgetTier',
        type: 'string',
        required: false,
        description: 'Budget tier (low, medium, high)',
        defaultValue: 'medium',
      },
    ],
    chainable: true,
    nextSteps: ['LANDING_PAGE', 'A_B_TESTING'],
  },
};

/**
 * Helper function to get prompt template by ID
 */
export function getPromptTemplate(id: string): PromptTemplate | undefined {
  return Object.values(PROMPT_TEMPLATES).find((template) => template.id === id);
}

/**
 * Helper function to replace variables in prompt template
 */
export function interpolatePrompt(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = `{{${key}}}`;
    const replacement = Array.isArray(value)
      ? value.join(', ')
      : typeof value === 'object'
      ? JSON.stringify(value, null, 2)
      : String(value);

    result = result.replace(new RegExp(placeholder, 'g'), replacement);
  }

  return result;
}

/**
 * Validate that all required variables are provided
 */
export function validatePromptVariables(
  template: PromptTemplate,
  variables: Record<string, any>
): { valid: boolean; missingVariables: string[] } {
  const missingVariables = template.variables
    .filter((v) => v.required && !(v.name in variables))
    .map((v) => v.name);

  return {
    valid: missingVariables.length === 0,
    missingVariables,
  };
}
