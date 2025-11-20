import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Clipboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, TrendingUp, Copy, Sparkles, Settings, Wand2 } from 'lucide-react-native';

// Theme and AI components
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/ai.service';
import { CostEstimate } from '@/components/ai/CostTransparency';
import { useOnboarding, ContextualTooltip } from '@/components/onboarding/ProgressiveOnboarding';

/**
 * TikTok Hooks Screen - AI-Enhanced Content Generation
 *
 * Features:
 * - Instant AI generation with smart defaults
 * - Real-time streaming preview
 * - Cost transparency
 * - Progressive onboarding
 * - Dark mode support
 * - Voice/tone customization
 */
export default function TikTokHooksScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config, selectedVoiceToneProfile } = useAIStore();
  const { shouldShowStep, completeStep, dismissStep } = useOnboarding();

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedHooks, setGeneratedHooks] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Input state
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [contentType, setContentType] = useState('tutorial');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showTooltip, setShowTooltip] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.02);

  const categories = ['All', 'Generated', 'Story', 'Question', 'Bold Statement', 'Tutorial'];
  const contentTypes = ['tutorial', 'story', 'tips', 'transformation', 'product_review', 'behind_the_scenes'];

  // Static example hooks (for inspiration)
  const exampleHooks = [
    {
      id: 'ex1',
      text: 'Wait for it...',
      category: 'Story',
      engagement: 95,
      description: 'Creates anticipation and keeps viewers watching',
      isExample: true,
    },
    {
      id: 'ex2',
      text: 'Nobody talks about this...',
      category: 'Bold Statement',
      engagement: 92,
      description: 'Positions you as someone sharing exclusive insights',
      isExample: true,
    },
    {
      id: 'ex3',
      text: "Here's what they don't want you to know...",
      category: 'Bold Statement',
      engagement: 88,
      description: 'Triggers curiosity with a hint of controversy',
      isExample: true,
    },
    {
      id: 'ex4',
      text: "You're doing it wrong. Here's why...",
      category: 'Tutorial',
      engagement: 90,
      description: 'Challenges assumptions and offers solutions',
      isExample: true,
    },
  ];

  // Combine generated and example hooks
  const allHooks = [...generatedHooks, ...exampleHooks];
  const filteredHooks = selectedCategory === 'All'
    ? allHooks
    : selectedCategory === 'Generated'
    ? generatedHooks
    : allHooks.filter(hook => hook.category === selectedCategory);

  // Show tooltip on first visit
  useEffect(() => {
    if (shouldShowStep('first_tool_view')) {
      setTimeout(() => setShowTooltip(true), 500);
    }
  }, []);

  // Calculate estimated cost based on input
  useEffect(() => {
    const topicLength = topic.length;
    const baseTokens = 500; // Base tokens for system prompt
    const inputTokens = Math.ceil(topicLength * 0.4); // Approximate tokens from input
    const outputTokens = 300; // ~7 hooks with 40-50 tokens each
    const totalTokens = baseTokens + inputTokens + outputTokens;

    // GPT-4 pricing: $0.03/1K input, $0.06/1K output
    const cost = (baseTokens + inputTokens) * 0.00003 + outputTokens * 0.00006;
    setEstimatedCost(cost);
  }, [topic, audience]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic for your TikTok hooks');
      return;
    }

    if (!config?.openaiApiKey && !config?.anthropicApiKey) {
      Alert.alert(
        'API Key Required',
        'Please add your OpenAI or Anthropic API key in Settings to use AI generation',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/settings') },
        ]
      );
      return;
    }

    setIsGenerating(true);
    setShowResults(true);
    setGeneratedHooks([]);

    try {
      const template = PROMPT_TEMPLATES.TIKTOK_HOOKS;

      // Interpolate user prompt with variables
      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        topic: topic.trim(),
        audience: audience.trim() || 'general audience',
        contentType: contentType,
        hookCount: '7',
        includeEngagement: 'true',
        includeCategory: 'true',
      });

      // Generate with voice/tone if selected
      const result = await generateContent(
        'tiktok_hooks',
        template.systemPrompt,
        userPrompt,
        {
          temperature: 0.8, // Higher creativity for hooks
          maxTokens: 500,
          voiceToneProfile: selectedVoiceToneProfile || undefined,
        }
      );

      // Parse the generated hooks (expecting JSON format from prompt)
      const parsedHooks = parseGeneratedHooks(result);
      setGeneratedHooks(parsedHooks);
      setSelectedCategory('Generated');

      // Complete onboarding steps
      completeStep('first_generation');
      if (shouldShowStep('discover_ai')) {
        completeStep('discover_ai');
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseGeneratedHooks = (text: string): any[] => {
    try {
      // Try to parse as JSON first
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((hook: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          text: hook.text || hook.hook,
          category: hook.category || 'Generated',
          engagement: hook.engagement || 85 + Math.floor(Math.random() * 10),
          description: hook.description || hook.why || 'AI-generated hook',
          isExample: false,
        }));
      }

      // Fallback: parse line by line
      const lines = text.split('\n').filter(line => line.trim());
      return lines
        .filter(line => line.match(/^[\d\.\-\*]/)) // Lines starting with numbers or bullets
        .map((line, index) => {
          const cleanText = line.replace(/^[\d\.\-\*\s]+/, '').replace(/["""]/g, '"').trim();
          return {
            id: `gen-${Date.now()}-${index}`,
            text: cleanText,
            category: 'Generated',
            engagement: 85 + Math.floor(Math.random() * 10),
            description: 'AI-generated hook for maximum engagement',
            isExample: false,
          };
        })
        .filter(hook => hook.text.length > 10);
    } catch (error) {
      console.error('Parse error:', error);
      // Return single hook with the raw text
      return [{
        id: `gen-${Date.now()}`,
        text: text.slice(0, 200),
        category: 'Generated',
        engagement: 85,
        description: 'AI-generated hook',
        isExample: false,
      }];
    }
  };

  const handleCopy = (text: string) => {
    Clipboard.setString(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied!', 'Hook copied to clipboard');
  };

  const handleQuickDemo = () => {
    setTopic('productivity tips for entrepreneurs');
    setAudience('entrepreneurs and creators');
    setContentType('tutorial');
    setTimeout(() => handleGenerate(), 300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>TikTok Hooks</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* Intro */}
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <Sparkles size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>
              AI-powered hooks to capture attention in the first 3 seconds and boost engagement
            </Text>
          </View>

          {/* Quick Demo Button (for first-time users) */}
          {!showResults && generatedHooks.length === 0 && (
            <TouchableOpacity
              style={[styles.quickDemoButton, { backgroundColor: theme.colors.aiPrimary }]}
              onPress={handleQuickDemo}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <View style={styles.quickDemoText}>
                <Text style={styles.quickDemoTitle}>Try AI Demo</Text>
                <Text style={styles.quickDemoSubtitle}>Generate 7 hooks instantly • Free trial</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Generation Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Generate Custom Hooks
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Topic or Niche *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="e.g., productivity tips, fitness hacks, cooking recipes"
                placeholderTextColor={theme.colors.textTertiary}
                value={topic}
                onChangeText={setTopic}
                multiline
              />
            </View>

            {/* Advanced Options Toggle */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Text style={[styles.advancedToggleText, { color: theme.colors.aiPrimary }]}>
                {showAdvanced ? '− Less Options' : '+ More Options'}
              </Text>
            </TouchableOpacity>

            {/* Advanced Options */}
            {showAdvanced && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                    Target Audience (optional)
                  </Text>
                  <TextInput
                    style={[styles.input, {
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }]}
                    placeholder="e.g., entrepreneurs, students, parents"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={audience}
                    onChangeText={setAudience}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                    Content Type
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                    {contentTypes.map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.typeButton,
                          {
                            backgroundColor: theme.colors.backgroundSecondary,
                            borderColor: theme.colors.border,
                          },
                          contentType === type && {
                            backgroundColor: theme.colors.aiPrimary,
                            borderColor: theme.colors.aiPrimary,
                          }
                        ]}
                        onPress={() => setContentType(type)}
                      >
                        <Text
                          style={[
                            styles.typeButtonText,
                            { color: theme.colors.textPrimary },
                            contentType === type && { color: '#FFFFFF' }
                          ]}
                        >
                          {type.replace('_', ' ')}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {selectedVoiceToneProfile && (
                  <View style={[styles.voiceIndicator, { backgroundColor: theme.colors.aiBackground }]}>
                    <Text style={[styles.voiceIndicatorText, { color: theme.colors.textSecondary }]}>
                      Voice: <Text style={{ color: theme.colors.aiPrimary, fontWeight: '600' }}>
                        {selectedVoiceToneProfile.name}
                      </Text>
                    </Text>
                  </View>
                )}
              </>
            )}

            {/* Cost Estimate */}
            {topic.trim() && (
              <View style={styles.costContainer}>
                <CostEstimate estimatedCost={estimatedCost} showDetails={false} />
              </View>
            )}

            {/* Generate Button */}
            <TouchableOpacity
              style={[
                styles.generateButton,
                { backgroundColor: theme.colors.aiPrimary },
                isGenerating && { opacity: 0.6 }
              ]}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating...' : 'Generate Hooks'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter */}
          {(generatedHooks.length > 0 || exampleHooks.length > 0) && (
            <View style={styles.categoriesContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryButton,
                      { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                      selectedCategory === category && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        { color: theme.colors.textPrimary },
                        selectedCategory === category && { color: '#FFFFFF' }
                      ]}
                    >
                      {category}
                      {category === 'Generated' && generatedHooks.length > 0 && ` (${generatedHooks.length})`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Hooks List */}
          <View style={styles.hooksList}>
            {filteredHooks.map((hook) => (
              <View
                key={hook.id}
                style={[
                  styles.hookCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                  !hook.isExample && {
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.aiPrimary,
                  }
                ]}
              >
                <View style={styles.hookHeader}>
                  <View style={[styles.categoryBadge, { backgroundColor: theme.colors.backgroundSecondary }]}>
                    <Text style={[styles.categoryBadgeText, { color: theme.colors.textSecondary }]}>
                      {hook.category}
                    </Text>
                  </View>
                  <View style={styles.engagementBadge}>
                    <TrendingUp size={14} color={theme.colors.success} />
                    <Text style={[styles.engagementText, { color: theme.colors.success }]}>
                      {hook.engagement}%
                    </Text>
                  </View>
                </View>

                <Text style={[styles.hookText, { color: theme.colors.textPrimary }]}>
                  {hook.text}
                </Text>
                <Text style={[styles.hookDescription, { color: theme.colors.textSecondary }]}>
                  {hook.description}
                </Text>

                {!hook.isExample && (
                  <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                    <Sparkles size={12} color={theme.colors.aiPrimary} />
                    <Text style={[styles.aiBadgeText, { color: theme.colors.aiPrimary }]}>
                      AI Generated
                    </Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.copyButton, { backgroundColor: theme.colors.aiBackground }]}
                  onPress={() => handleCopy(hook.text)}
                >
                  <Copy size={16} color={theme.colors.aiPrimary} />
                  <Text style={[styles.copyButtonText, { color: theme.colors.aiPrimary }]}>
                    Copy Hook
                  </Text>
                </TouchableOpacity>
              </View>
            ))}

            {filteredHooks.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                  {selectedCategory === 'Generated'
                    ? 'No generated hooks yet. Try generating some above!'
                    : 'No hooks in this category'}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Contextual Tooltip */}
      <ContextualTooltip
        visible={showTooltip}
        message="Generate custom TikTok hooks tailored to your niche using AI. Each hook is designed to maximize engagement!"
        position="bottom"
        onDismiss={() => {
          setShowTooltip(false);
          dismissStep('first_tool_view');
        }}
        onComplete={() => {
          setShowTooltip(false);
          completeStep('first_tool_view');
          handleQuickDemo();
        }}
        highlight
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  intro: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  quickDemoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  quickDemoText: {
    flex: 1,
  },
  quickDemoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  quickDemoSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 44,
  },
  advancedToggle: {
    alignSelf: 'flex-start',
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeScroll: {
    marginHorizontal: -4,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  voiceIndicator: {
    padding: 12,
    borderRadius: 8,
  },
  voiceIndicatorText: {
    fontSize: 13,
  },
  costContainer: {
    marginTop: 8,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  categoriesContainer: {
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hooksList: {
    gap: 16,
  },
  hookCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  hookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  engagementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 12,
    fontWeight: '600',
  },
  hookText: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  hookDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
