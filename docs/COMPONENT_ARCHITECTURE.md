# Component Architecture - AI Content Tools

## 🏗️ Component Structure

This document outlines all React Native components needed for the AI content tools UI/UX.

---

## 📁 Folder Structure

```
components/
├── ai/
│   ├── AIQuickGenerate.tsx          # Quick AI generation widget
│   ├── AIGenerationModal.tsx        # Full-screen AI generation UI
│   ├── AIConfigWizard.tsx           # First-time AI setup wizard
│   ├── VoiceToneSelector.tsx        # Voice/tone profile picker
│   ├── BrandProfileSelector.tsx     # Brand profile picker
│   ├── GenerationProgress.tsx       # AI generation loading state
│   ├── GeneratedContent.tsx         # Display generated content
│   ├── CostBadge.tsx                # Show generation cost
│   └── PromptInput.tsx              # Smart prompt input field
│
├── tools/
│   ├── ContentToolCard.tsx          # Existing - enhanced with AI badge
│   ├── ToolScreenWrapper.tsx        # Wrapper for tool screens
│   ├── AIToolToggle.tsx             # Toggle between static/AI mode
│   └── GenerationHistory.tsx        # Show past generations
│
├── workflows/
│   ├── WorkflowSelector.tsx         # Choose prompt chain workflow
│   ├── WorkflowProgress.tsx         # Multi-step workflow progress
│   └── WorkflowResult.tsx           # Display workflow output
│
├── settings/
│   ├── AIConfigScreen.tsx           # AI settings screen
│   ├── ProviderSelector.tsx         # Choose OpenAI/Anthropic
│   ├── APIKeyInput.tsx              # Secure API key entry
│   ├── UsageStats.tsx               # Usage & cost dashboard
│   └── ProfileManager.tsx           # Manage custom profiles
│
└── common/
    ├── AIBadge.tsx                  # ✨ badge component
    ├── LoadingSpinner.tsx           # Custom loading animations
    ├── BottomSheet.tsx              # Modal bottom sheet
    └── ExpandableSection.tsx        # Collapsible sections
```

---

## 🎨 Core Components

### 1. **AIQuickGenerate.tsx**

**Purpose:** Prominent widget at top of Create tab for quick AI generation

**Props:**
```typescript
interface AIQuickGenerateProps {
  onGenerate: (type: string, prompt: string) => void;
  isConfigured: boolean;
  currentVoice?: string;
  currentBrand?: string;
}
```

**States:**
- Collapsed (default)
- Expanded (shows templates)
- Loading (generating)

**Usage:**
```tsx
<AIQuickGenerate
  onGenerate={(type, prompt) => handleQuickGen(type, prompt)}
  isConfigured={aiStore.isConfigured}
  currentVoice={aiStore.selectedVoiceToneProfile?.name}
/>
```

---

### 2. **AIGenerationModal.tsx**

**Purpose:** Full-screen modal for AI generation with form inputs

**Props:**
```typescript
interface AIGenerationModalProps {
  visible: boolean;
  toolType: string;
  templateId: string;
  onClose: () => void;
  onGenerate: (result: string) => void;
}
```

**Features:**
- Dynamic form based on template variables
- Show/hide advanced options
- Real-time cost estimation
- Loading state with progress
- Generated content display
- Regenerate option

**Usage:**
```tsx
<AIGenerationModal
  visible={showAIModal}
  toolType="tiktok_hooks"
  templateId="TIKTOK_HOOKS"
  onClose={() => setShowAIModal(false)}
  onGenerate={(result) => handleResult(result)}
/>
```

---

### 3. **VoiceToneSelector.tsx**

**Purpose:** Select voice/tone profile

**Props:**
```typescript
interface VoiceToneSelectorProps {
  selectedId?: string;
  onSelect: (profileId: string) => void;
  compact?: boolean; // Show as dropdown vs full list
}
```

**Modes:**
- Compact: Simple dropdown (for quick access)
- Full: Grid view with descriptions (for settings)

**Usage:**
```tsx
<VoiceToneSelector
  selectedId={currentProfile?.id}
  onSelect={selectVoiceToneProfile}
  compact={true}
/>
```

---

### 4. **GenerationProgress.tsx**

**Purpose:** Beautiful loading state during AI generation

**Props:**
```typescript
interface GenerationProgressProps {
  step?: string; // Current step message
  progress?: number; // 0-100
  estimatedTime?: number; // seconds
  canCancel?: boolean;
  onCancel?: () => void;
}
```

**Features:**
- Animated progress bar
- Status messages
- Estimated time remaining
- Cancel option
- Streaming text preview (optional)

**Usage:**
```tsx
<GenerationProgress
  step="Analyzing your topic..."
  progress={45}
  estimatedTime={8}
  canCancel={true}
  onCancel={cancelGeneration}
/>
```

---

### 5. **GeneratedContent.tsx**

**Purpose:** Display AI-generated content with actions

**Props:**
```typescript
interface GeneratedContentProps {
  content: string | object;
  contentType: string;
  metadata?: {
    tokens: number;
    cost: number;
    createdAt: string;
  };
  onCopy?: () => void;
  onEdit?: () => void;
  onUse?: () => void;
  onRegenerate?: () => void;
  onSave?: () => void;
}
```

**Features:**
- Formatted content display
- Copy to clipboard
- Edit inline
- Use in compose
- Regenerate
- Save to history
- Cost/tokens display

**Usage:**
```tsx
<GeneratedContent
  content={generatedHooks}
  contentType="tiktok_hooks"
  metadata={{ tokens: 450, cost: 0.03, createdAt: new Date().toISOString() }}
  onCopy={copyToClipboard}
  onUse={useInCompose}
  onRegenerate={regenerate}
/>
```

---

### 6. **AIToolToggle.tsx**

**Purpose:** Toggle button to switch between static and AI modes

**Props:**
```typescript
interface AIToolToggleProps {
  mode: 'static' | 'ai';
  onToggle: (mode: 'static' | 'ai') => void;
  isConfigured: boolean;
}
```

**Usage:**
```tsx
<AIToolToggle
  mode={currentMode}
  onToggle={setMode}
  isConfigured={aiStore.isConfigured}
/>
```

---

### 7. **PromptInput.tsx**

**Purpose:** Smart input field with templates and suggestions

**Props:**
```typescript
interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  templates?: string[]; // Quick templates
  maxLength?: number;
  estimatedCost?: number;
}
```

**Features:**
- Auto-resize multiline input
- Character counter
- Template suggestions
- Cost estimation
- Placeholder examples

**Usage:**
```tsx
<PromptInput
  value={prompt}
  onChange={setPrompt}
  placeholder="e.g., Productivity tips for entrepreneurs"
  templates={[
    "Productivity tips for [audience]",
    "How to [achieve goal]",
    "Common mistakes in [topic]"
  ]}
/>
```

---

### 8. **WorkflowSelector.tsx**

**Purpose:** Choose a multi-step workflow chain

**Props:**
```typescript
interface WorkflowSelectorProps {
  workflows: PromptChain[];
  onSelect: (chainId: string) => void;
}
```

**Features:**
- Display workflow steps visually
- Show estimated time
- Show estimated cost
- Workflow descriptions
- Popular/recommended badges

---

### 9. **UsageStats.tsx**

**Purpose:** Dashboard showing AI usage and costs

**Props:**
```typescript
interface UsageStatsProps {
  period: 'day' | 'week' | 'month' | 'all';
  onPeriodChange: (period: string) => void;
}
```

**Features:**
- Total cost
- Total generations
- Breakdown by tool
- Cost trends chart
- Budget alerts
- Export data

---

### 10. **ToolScreenWrapper.tsx**

**Purpose:** Standardized wrapper for all tool screens with AI integration

**Props:**
```typescript
interface ToolScreenWrapperProps {
  title: string;
  description: string;
  toolType: string;
  templateId: string;
  staticContent?: React.ReactNode;
  children: React.ReactNode;
}
```

**Features:**
- Standard header with AI button
- Auto-handle AI modal
- Auto-handle mode switching
- History integration
- Consistent layout

**Usage:**
```tsx
<ToolScreenWrapper
  title="TikTok Hooks"
  description="Viral hooks to stop the scroll"
  toolType="tiktok_hooks"
  templateId="TIKTOK_HOOKS"
>
  {/* Static content or AI results */}
</ToolScreenWrapper>
```

---

## 🎯 Reusable Hooks

### **useAIGeneration.ts**

```typescript
interface UseAIGenerationOptions {
  toolType: string;
  templateId: string;
  onSuccess?: (result: string) => void;
  onError?: (error: Error) => void;
}

function useAIGeneration(options: UseAIGenerationOptions) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const generate = async (inputs: Record<string, any>) => {
    // Generation logic
  };

  const regenerate = async () => {
    // Regenerate with same inputs
  };

  const cancel = () => {
    // Cancel generation
  };

  return {
    isGenerating,
    result,
    error,
    progress,
    generate,
    regenerate,
    cancel
  };
}
```

### **usePromptTemplate.ts**

```typescript
function usePromptTemplate(templateId: string) {
  const template = getPromptTemplate(templateId);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);

  const updateInput = (key: string, value: any) => {
    // Update and validate
  };

  const interpolate = () => {
    // Return interpolated prompt
  };

  return {
    template,
    inputs,
    isValid,
    updateInput,
    interpolate
  };
}
```

### **useVoiceTone.ts**

```typescript
function useVoiceTone() {
  const { selectedVoiceToneProfile, selectVoiceToneProfile } = useAIStore();
  const presets = voiceToneService.getPresetProfiles();

  return {
    current: selectedVoiceToneProfile,
    presets,
    select: selectVoiceToneProfile
  };
}
```

---

## 📱 Screen Components

### **AIConfigScreen.tsx**

Full AI configuration screen with wizard for first-time setup.

**Sections:**
1. Provider selection
2. API key entry
3. Model & settings
4. Test connection
5. Success confirmation

### **VoiceToneScreen.tsx**

Manage voice/tone profiles.

**Features:**
- List preset profiles
- View profile details
- Select active profile
- Create custom profile
- Edit custom profiles
- Delete custom profiles

### **BrandProfileScreen.tsx**

Manage brand profiles.

**Features:**
- List preset profiles
- View profile details
- Select active profile
- Create custom profile
- Edit custom profiles
- Link to voice/tone

### **UsageCostsScreen.tsx**

View usage statistics and costs.

**Features:**
- Period selector (day/week/month/all)
- Cost summary
- Usage breakdown
- Generation history
- Budget alerts
- Export data

### **GenerationHistoryScreen.tsx**

View all past AI generations.

**Features:**
- Filter by tool type
- Search by content
- Sort by date/cost
- View details
- Reuse generation
- Delete items
- Export data

---

## 🎨 Component Styling

### **Theme Integration**

All components use consistent theming:

```typescript
const aiTheme = {
  colors: {
    aiPrimary: '#9333EA',      // Purple for AI features
    aiSecondary: '#C084FC',    // Light purple
    success: '#10B981',        // Green
    warning: '#F59E0B',        // Orange
    error: '#EF4444',          // Red
    text: {
      primary: '#1F2937',
      secondary: '#6B7280',
      tertiary: '#9CA3AF'
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F9FAFB',
      tertiary: '#F3F4F6'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5
    }
  }
};
```

### **Animation Utilities**

```typescript
const aiAnimations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  slideUp: {
    from: { transform: [{ translateY: 20 }], opacity: 0 },
    to: { transform: [{ translateY: 0 }], opacity: 1 }
  },
  pulse: {
    from: { scale: 1 },
    to: { scale: 1.05 }
  },
  shimmer: {
    // Loading shimmer effect
  }
};
```

---

## 🔄 State Management Integration

### **Connect to AI Store**

All components use Zustand AI store:

```typescript
import { useAIStore } from '@/store/aiStore';

function MyComponent() {
  const {
    isConfigured,
    selectedVoiceToneProfile,
    generateContent,
    generationHistory
  } = useAIStore();

  // Component logic
}
```

### **Real-time Updates**

Use store subscriptions for live updates:

```typescript
useEffect(() => {
  const unsubscribe = useAIStore.subscribe(
    (state) => state.isGenerating,
    (isGenerating) => {
      // React to generation state changes
    }
  );

  return unsubscribe;
}, []);
```

---

## 📊 Performance Optimizations

### **Lazy Loading**

```typescript
const AIGenerationModal = lazy(() => import('./ai/AIGenerationModal'));
const WorkflowSelector = lazy(() => import('./workflows/WorkflowSelector'));
```

### **Memoization**

```typescript
const GeneratedContent = React.memo(({ content, metadata }) => {
  // Component implementation
});

const sortedHistory = useMemo(
  () => history.sort((a, b) => b.createdAt - a.createdAt),
  [history]
);
```

### **Virtualized Lists**

For long lists (history, profiles):

```typescript
import { FlashList } from '@shopify/flash-list';

<FlashList
  data={generationHistory}
  renderItem={({ item }) => <HistoryItem item={item} />}
  estimatedItemSize={100}
/>
```

---

## 🧪 Testing Strategy

### **Component Tests**

```typescript
describe('AIQuickGenerate', () => {
  it('shows setup prompt when not configured', () => {
    render(<AIQuickGenerate isConfigured={false} />);
    expect(screen.getByText(/setup ai/i)).toBeInTheDocument();
  });

  it('shows templates when configured and expanded', () => {
    render(<AIQuickGenerate isConfigured={true} />);
    fireEvent.press(screen.getByText(/quick generate/i));
    expect(screen.getByText(/viral tiktok hook/i)).toBeInTheDocument();
  });
});
```

### **Integration Tests**

```typescript
describe('AI Generation Flow', () => {
  it('generates content end-to-end', async () => {
    const { getByText, getByPlaceholderText } = render(<TikTokHooksScreen />);

    // Tap AI button
    fireEvent.press(getByText(/✨ ai/i));

    // Enter prompt
    fireEvent.changeText(
      getByPlaceholderText(/video about/i),
      'Productivity tips'
    );

    // Generate
    fireEvent.press(getByText(/generate/i));

    // Wait for result
    await waitFor(() => {
      expect(getByText(/7 hooks created/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📦 Component Export Structure

```typescript
// components/ai/index.ts
export { AIQuickGenerate } from './AIQuickGenerate';
export { AIGenerationModal } from './AIGenerationModal';
export { VoiceToneSelector } from './VoiceToneSelector';
export { GenerationProgress } from './GenerationProgress';
export { GeneratedContent } from './GeneratedContent';

// components/index.ts
export * from './ai';
export * from './tools';
export * from './workflows';
export * from './settings';
export * from './common';
```

---

## 🚀 Implementation Order

### **Phase 1 Components (Week 1-2):**
1. AIQuickGenerate
2. AIGenerationModal
3. PromptInput
4. GenerationProgress
5. GeneratedContent
6. AIConfigScreen (wizard)
7. VoiceToneSelector (compact mode)

### **Phase 2 Components (Week 3-4):**
8. ToolScreenWrapper
9. AIToolToggle
10. GenerationHistory
11. UsageStats
12. CostBadge

### **Phase 3 Components (Week 5-6):**
13. WorkflowSelector
14. WorkflowProgress
15. BrandProfileSelector
16. ProfileManager
17. Full voice/tone management

---

Ready to start building! Which component would you like me to implement first?
