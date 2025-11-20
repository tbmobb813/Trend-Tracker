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
import { ArrowLeft, FileText, Copy, Settings, Wand2, Sparkles } from 'lucide-react-native';

// Theme and AI components
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';
import { useOnboarding, ContextualTooltip } from '@/components/onboarding/ProgressiveOnboarding';

interface CaptionTemplate {
  id: string;
  template: string;
  platform: string;
  category: string;
  isGenerated?: boolean;
}

/**
 * Caption Templates Screen - AI-Enhanced Caption Generation
 *
 * Features:
 * - AI-powered custom caption generation
 * - Platform-specific optimization
 * - Multiple caption variations
 * - Emoji and hashtag suggestions
 * - Call-to-action templates
 */
export default function CaptionTemplatesScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config, selectedVoiceToneProfile } = useAIStore();
  const { shouldShowStep, completeStep, dismissStep } = useOnboarding();

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaptions, setGeneratedCaptions] = useState<CaptionTemplate[]>([]);

  // Input state
  const [contentTopic, setContentTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [captionStyle, setCaptionStyle] = useState('engaging');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);

  // UI state
  const [showTooltip, setShowTooltip] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.025);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const platforms = ['instagram', 'tiktok', 'twitter', 'linkedin', 'facebook'];
  const styles_list = ['engaging', 'educational', 'story', 'promotional', 'inspirational', 'conversational'];

  // Static example templates
  const exampleTemplates: CaptionTemplate[] = [
    {
      id: 'ex1',
      template: '[Problem Statement]\n\nHere\'s what I learned:\n\n[Solution 1]\n[Solution 2]\n[Solution 3]\n\nWhich one resonates with you?',
      platform: 'Instagram',
      category: 'Educational',
      isGenerated: false,
    },
    {
      id: 'ex2',
      template: 'POV: You just discovered [topic]\n\nIt changed everything.\n\nHere\'s why 👇',
      platform: 'TikTok',
      category: 'Story',
      isGenerated: false,
    },
    {
      id: 'ex3',
      template: 'Unpopular opinion:\n\n[Your take]\n\nHere\'s why this matters...',
      platform: 'Twitter',
      category: 'Thought Leadership',
      isGenerated: false,
    },
    {
      id: 'ex4',
      template: '3 years ago, I [past situation]\n\nToday, I [current situation]\n\nHere\'s what changed:',
      platform: 'LinkedIn',
      category: 'Inspirational',
      isGenerated: false,
    },
  ];

  const allTemplates = [...generatedCaptions, ...exampleTemplates];

  // Show tooltip on first visit
  useEffect(() => {
    if (shouldShowStep('first_tool_view')) {
      setTimeout(() => setShowTooltip(true), 500);
    }
  }, []);

  // Calculate estimated cost
  useEffect(() => {
    const baseTokens = 700;
    const inputTokens = Math.ceil(contentTopic.length * 0.4);
    const outputTokens = 300;

    const cost = (baseTokens + inputTokens) * 0.00003 + outputTokens * 0.00006;
    setEstimatedCost(cost);
  }, [contentTopic]);

  const handleGenerate = async () => {
    if (!contentTopic.trim()) {
      Alert.alert('Missing Topic', 'Please enter your content topic');
      return;
    }

    if (!config?.openaiApiKey && !config?.anthropicApiKey) {
      Alert.alert(
        'API Key Required',
        'Please add your OpenAI or Anthropic API key in Settings',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Settings', onPress: () => router.push('/settings') },
        ]
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedCaptions([]);

    try {
      const template = PROMPT_TEMPLATES.CAPTION_TEMPLATES;

      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        contentTopic: contentTopic.trim(),
        platform: selectedPlatform,
        captionStyle: captionStyle,
        includeEmojis: includeEmojis ? 'true' : 'false',
        includeHashtags: includeHashtags ? 'true' : 'false',
        variationCount: '5',
      });

      const result = await generateContent(
        'caption_templates',
        template.systemPrompt,
        userPrompt,
        {
          temperature: 0.8,
          maxTokens: 500,
          voiceToneProfile: selectedVoiceToneProfile || undefined,
        }
      );

      const parsed = parseGeneratedCaptions(result);
      setGeneratedCaptions(parsed);

      completeStep('first_generation');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseGeneratedCaptions = (text: string): CaptionTemplate[] => {
    try {
      // Try JSON parsing first
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((caption: any, index: number) => ({
          id: `gen-${Date.now()}-${index}`,
          template: caption.caption || caption.text,
          platform: selectedPlatform,
          category: captionStyle,
          isGenerated: true,
        }));
      }

      // Fallback: split by numbers or separators
      const captions = text
        .split(/\n\n+|\d+\.\s+/)
        .map(c => c.trim())
        .filter(c => c.length > 20 && !c.match(/^(Caption|Variation|Here)/i));

      return captions.slice(0, 5).map((caption, index) => ({
        id: `gen-${Date.now()}-${index}`,
        template: caption,
        platform: selectedPlatform,
        category: captionStyle,
        isGenerated: true,
      }));
    } catch (error) {
      console.error('Parse error:', error);
      return [];
    }
  };

  const handleCopyTemplate = (template: string) => {
    Clipboard.setString(template);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied!', 'Caption copied to clipboard');
  };

  const handleQuickDemo = () => {
    setContentTopic('sharing productivity tips for morning routines');
    setSelectedPlatform('instagram');
    setCaptionStyle('engaging');
    setTimeout(() => handleGenerate(), 300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Caption Templates</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* Intro */}
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <FileText size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>
              AI-powered caption generation for maximum engagement across all platforms
            </Text>
          </View>

          {/* Quick Demo Button */}
          {generatedCaptions.length === 0 && (
            <TouchableOpacity
              style={[styles.quickDemoButton, { backgroundColor: theme.colors.aiPrimary }]}
              onPress={handleQuickDemo}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <View style={styles.quickDemoText}>
                <Text style={styles.quickDemoTitle}>Try AI Demo</Text>
                <Text style={styles.quickDemoSubtitle}>Generate 5 caption variations instantly</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Generation Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Generate Custom Captions
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Content Topic *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="e.g., morning routine tips, product launch announcement"
                placeholderTextColor={theme.colors.textTertiary}
                value={contentTopic}
                onChangeText={setContentTopic}
                multiline
              />
            </View>

            {/* Platform Selection */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Platform
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
                {platforms.map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[
                      styles.platformButton,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.border,
                      },
                      selectedPlatform === p && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setSelectedPlatform(p)}
                  >
                    <Text
                      style={[
                        styles.platformButtonText,
                        { color: theme.colors.textPrimary },
                        selectedPlatform === p && { color: '#FFFFFF' }
                      ]}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Caption Style */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Style
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.platformScroll}>
                {styles_list.map((style) => (
                  <TouchableOpacity
                    key={style}
                    style={[
                      styles.styleButton,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.border,
                      },
                      captionStyle === style && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setCaptionStyle(style)}
                  >
                    <Text
                      style={[
                        styles.styleButtonText,
                        { color: theme.colors.textPrimary },
                        captionStyle === style && { color: '#FFFFFF' }
                      ]}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Advanced Options */}
            <TouchableOpacity
              style={styles.advancedToggle}
              onPress={() => setShowAdvanced(!showAdvanced)}
            >
              <Text style={[styles.advancedToggleText, { color: theme.colors.aiPrimary }]}>
                {showAdvanced ? '− Less Options' : '+ More Options'}
              </Text>
            </TouchableOpacity>

            {showAdvanced && (
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setIncludeEmojis(!includeEmojis)}
                >
                  <View style={[
                    styles.checkbox,
                    { borderColor: theme.colors.border },
                    includeEmojis && { backgroundColor: theme.colors.aiPrimary, borderColor: theme.colors.aiPrimary }
                  ]}>
                    {includeEmojis && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: theme.colors.textPrimary }]}>
                    Include emojis
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setIncludeHashtags(!includeHashtags)}
                >
                  <View style={[
                    styles.checkbox,
                    { borderColor: theme.colors.border },
                    includeHashtags && { backgroundColor: theme.colors.aiPrimary, borderColor: theme.colors.aiPrimary }
                  ]}>
                    {includeHashtags && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.checkboxLabel, { color: theme.colors.textPrimary }]}>
                    Include hashtags
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Cost Estimate */}
            {contentTopic.trim() && (
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
                {isGenerating ? 'Generating...' : 'Generate Captions'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Templates */}
          <View style={styles.templatesSection}>
            {allTemplates.map((template) => (
              <View
                key={template.id}
                style={[
                  styles.templateCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                  template.isGenerated && {
                    borderLeftWidth: 4,
                    borderLeftColor: theme.colors.aiPrimary,
                  }
                ]}
              >
                <View style={styles.templateHeader}>
                  <Text style={[styles.categoryText, { color: theme.colors.textPrimary }]}>
                    {template.category}
                  </Text>
                  <View style={styles.templateBadges}>
                    <Text style={[styles.platformTag, { color: theme.colors.textSecondary }]}>
                      {template.platform}
                    </Text>
                    {template.isGenerated && (
                      <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                        <Sparkles size={10} color={theme.colors.aiPrimary} />
                        <Text style={[styles.aiBadgeText, { color: theme.colors.aiPrimary }]}>
                          AI
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={[styles.templateContent, { backgroundColor: theme.colors.backgroundSecondary }]}>
                  <Text style={[styles.templateText, { color: theme.colors.textPrimary }]}>
                    {template.template}
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.copyButton, { backgroundColor: theme.colors.aiBackground }]}
                  onPress={() => handleCopyTemplate(template.template)}
                >
                  <Copy size={16} color={theme.colors.aiPrimary} />
                  <Text style={[styles.copyButtonText, { color: theme.colors.aiPrimary }]}>
                    Copy Caption
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Contextual Tooltip */}
      <ContextualTooltip
        visible={showTooltip}
        message="Generate platform-optimized captions with your brand voice. Get multiple variations to test!"
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
  platformScroll: {
    marginHorizontal: -4,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  platformButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  styleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  styleButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  advancedToggle: {
    alignSelf: 'flex-start',
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  checkboxLabel: {
    fontSize: 14,
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
  templatesSection: {
    gap: 16,
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  templateBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  platformTag: {
    fontSize: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  templateContent: {
    padding: 12,
    borderRadius: 8,
  },
  templateText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'monospace',
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
});
