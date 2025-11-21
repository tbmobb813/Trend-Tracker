# Trend-Tracker

A comprehensive AI-powered content creation suite for social media creators. Generate viral TikTok hooks, Twitter threads, optimized hashtags, video scripts, and more - all with transparent cost tracking and professional-grade prompts.

## Features

### AI-Powered Content Tools

| Tool | Description |
|------|-------------|
| **TikTok Hooks** | Generate attention-grabbing opening lines with engagement scores |
| **Thread Generator** | Create viral Twitter/X threads with multiple styles (How-To, Story, Listicle, Insight) |
| **Hashtag Suggestions** | Platform-specific hashtags with reach estimates and trending indicators |
| **Caption Templates** | Multi-platform captions in 6 styles (engaging, educational, story, etc.) |
| **Thumbnail Ideas** | High-CTR thumbnail concepts with design specifications |
| **Product Ideas** | E-commerce product opportunities with market analysis |
| **Digital Products** | Info product ideas (courses, ebooks, templates) by expertise |
| **Post Troubleshooting** | AI-powered solutions for content performance issues |
| **Script Writer** | Complete video scripts with hooks, visual direction, and CTAs |

### Key Capabilities

- **Dual AI Providers**: Support for OpenAI GPT-4 and Anthropic Claude 3.5
- **Cost Transparency**: See estimated costs before every generation
- **Budget Controls**: Set monthly limits and track spending in real-time
- **Multi-Platform**: Optimized content for TikTok, Instagram, YouTube, Twitter, LinkedIn
- **Dark Mode**: Full theme support with automatic system detection
- **Offline Storage**: API keys and history stored securely on device

## Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Navigation**: Expo Router 5
- **State Management**: Zustand 5
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Icons**: Lucide React Native
- **Storage**: AsyncStorage
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator, Android Emulator, or Expo Go app

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/tbmobb813/Trend-Tracker.git
   cd Trend-Tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app for physical device

### Pinning Node version (recommended)

To avoid issues caused by automatic Node version changes, pin a Node version for this project. You can use one of the following methods:

- Volta (recommended — seamless per-project pinning):

```bash
curl https://get.volta.sh | bash
# then in the project root
volta pin node@20.19.5
volta pin npm@latest
```

- nvm (creates a `.nvmrc` file that specifies the version):

```bash
echo "20.19.5" > .nvmrc
# then run `nvm use` in the project folder
```

- asdf (alternative manager): add `nodejs 20.19.5` to `.tool-versions`

Using one of the above ensures your shell uses Node v20.x consistently for installs and the Metro dev server.

### Configuration

#### API Keys Setup

1. Open the app and navigate to **Settings**
2. Enter your API keys:
   - **OpenAI**: Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Anthropic**: Get from [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
3. Set your monthly budget limit (default: $50)
4. Choose your default AI provider
5. Save settings

Your API keys are encrypted and stored locally on your device - they're never sent to any server except the AI provider.

## Project Structure

Trend-Tracker/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   ├── create/                   # Content creation tools
│   │   ├── tiktok-hooks.tsx
│   │   ├── thread-generator.tsx
│   │   ├── hashtag-suggestions.tsx
│   │   ├── caption-templates.tsx
│   │   ├── thumbnail-ideas.tsx
│   │   ├── product-ideas.tsx
│   │   ├── digital-products.tsx
│   │   ├── post-troubleshooting.tsx
│   │   └── script-writer.tsx
│   ├── settings.tsx              # AI configuration
│   └── _layout.tsx               # Root layout
├── components/
│   └── ai/
│       └── CostTransparency.tsx  # Cost estimation component
├── constants/
│   └── theme.ts                  # Light/dark theme definitions
├── services/
│   ├── ai.service.ts             # AI generation logic
│   └── promptTemplates.ts        # Expert prompt templates
├── store/
│   └── aiStore.ts                # Zustand state management
└── types/
    └── index.ts                  # TypeScript definitions

## Usage

### Basic Workflow

1. **Configure API Key** (one-time)
   - Go to Settings → Enter API key → Save

2. **Choose a Tool**
   - Navigate to any content creation tool

3. **Enter Your Input**
   - Provide topic, audience, or content details
   - Adjust options (platform, style, length, etc.)

4. **Review Cost Estimate**
   - See estimated cost before generating

5. **Generate Content**
   - Tap "Generate" to create AI content
   - Results appear with AI badge indicator

6. **Use Your Content**
   - Copy individual items or full results
   - Regenerate for variations

### Example: Creating TikTok Hooks

1. Open TikTok Hooks tool
2. Enter topic: "Morning routine for productivity"
3. Select category: "Story Hooks"
4. Tap "Generate Hooks"
5. Get 5-7 viral hook variations with engagement scores
6. Copy your favorites and use in your videos

### Cost Estimates

Typical costs per generation:

- **Simple tools** (hashtags, captions): ~$0.01-0.02
- **Complex tools** (scripts, threads): ~$0.03-0.05
- **Average monthly usage**: $5-15 for active creators

## AI Prompt System

The app uses 12 expert-crafted prompt templates optimized for content creation:

- Each template includes detailed system prompts with industry expertise
- Variable substitution for personalized outputs
- Few-shot examples for better results
- Chainable workflows for multi-step generation

Templates are located in `services/promptTemplates.ts`.

## Development

### Available Scripts

```bash
# Start development server
npm start

# Start with web support
npm run start-web

# Start with debug logging
npm run start-web-dev
```

### Adding New Content Tools

1. Create prompt template in `services/promptTemplates.ts`
2. Create screen in `app/create/[tool-name].tsx`
3. Follow established patterns:
   - Import theme, aiStore, prompt templates
   - Add state for generation and results
   - Implement `handleGenerate` with validation
   - Include cost estimate component
   - Parse AI response with fallbacks

### Code Patterns

All content tools follow consistent patterns:

```typescript
// Standard imports
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';

// Generation handler
const handleGenerate = async () => {
  // 1. Validate input
  // 2. Check API key
  // 3. Interpolate prompt template
  // 4. Call generateContent
  // 5. Parse response with fallbacks
  // 6. Update state
  // 7. Haptic feedback
};
```

## Roadmap

### Completed

- [x] 9 AI-powered content tools
- [x] Settings and configuration screen
- [x] Cost tracking and budget controls
- [x] Dark mode support
- [x] Multi-provider support (OpenAI, Anthropic)

### Planned

- [ ] Carousel Posts generator
- [ ] Email Sequences builder
- [ ] Ad Copy generator
- [ ] Voice/Tone profile management
- [ ] Brand profile builder
- [ ] Generation history viewer
- [ ] Workflow chains (multi-tool automation)
- [ ] Content calendar integration
- [ ] Analytics dashboard

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code patterns and architecture
- Maintain TypeScript type safety
- Include dark mode support for new UI
- Add cost estimates to AI-powered features
- Test on both iOS and Android

## License

This project is private and proprietary.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- AI powered by [OpenAI](https://openai.com) and [Anthropic](https://anthropic.com)
- Icons by [Lucide](https://lucide.dev)

---

**Version**: 1.0.0
**Last Updated**: November 2024
