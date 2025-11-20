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
import { ArrowLeft, MessageSquare, Copy, Settings, Wand2, Sparkles } from 'lucide-react-native';

// Theme and AI components
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';
import { useOnboarding, ContextualTooltip } from '@/components/onboarding/ProgressiveOnboarding';

/**
 * Thread Generator Screen - AI-Enhanced Thread Creation
 *
 * Features:
 * - AI-powered thread generation for Twitter/X and Threads
 * - Multiple thread formats (How-To, Storytelling, Listicle)
 * - Cost transparency
 * - Voice/tone customization
 * - Dark mode support
 */
export default function ThreadGeneratorScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config, selectedVoiceToneProfile } = useAIStore();
  const { shouldShowStep, completeStep, dismissStep } = useOnboarding();

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedThread, setGeneratedThread] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Input state
  const [topic, setTopic] = useState('');
  const [threadType, setThreadType] = useState('how_to');
  const [threadLength, setThreadLength] = useState('medium');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [keyPoints, setKeyPoints] = useState('');

  // UI state
  const [showTooltip, setShowTooltip] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.04);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const threadTypes = [
    { id: 'how_to', name: 'How-To', description: '7-10 tweets teaching a process' },
    { id: 'story', name: 'Story', description: '8-12 tweets sharing an experience' },
    { id: 'listicle', name: 'Listicle', description: '11+ tweets with numbered tips' },
    { id: 'insight', name: 'Insight', description: '5-7 tweets sharing a valuable lesson' },
  ];

  const threadLengths = [
    { id: 'short', name: 'Short', tweets: '5-7' },
    { id: 'medium', name: 'Medium', tweets: '8-12' },
    { id: 'long', name: 'Long', tweets: '13-20' },
  ];

  // Static templates
  const templates = [
    {
      id: '1',
      title: 'How-To Thread',
      format: '7-10 tweets',
      type: 'how_to',
      structure: [
        '1. Hook: Start with a bold claim or question',
        '2. Context: Why this matters',
        '3-7. Steps: Break down the process',
        '8. Recap: Summarize key points',
        '9. Call to action'
      ]
    },
    {
      id: '2',
      title: 'Storytelling Thread',
      format: '8-12 tweets',
      type: 'story',
      structure: [
        '1. Hook: Compelling opening',
        '2. Set the scene',
        '3-8. The journey with key moments',
        '9. Turning point',
        '10. Resolution',
        '11. Lesson learned'
      ]
    },
    {
      id: '3',
      title: 'Listicle Thread',
      format: '11+ tweets',
      type: 'listicle',
      structure: [
        '1. Hook with number (10 ways to...)',
        '2-11. Each point with explanation',
        '12. Bonus tip',
        '13. Summary & CTA'
      ]
    }
  ];

  // Show tooltip on first visit
  useEffect(() => {
    if (shouldShowStep('first_tool_view')) {
      setTimeout(() => setShowTooltip(true), 500);
    }
  }, []);

  // Calculate estimated cost
  useEffect(() => {
    const baseTokens = 800; // System prompt
    const inputTokens = Math.ceil((topic.length + keyPoints.length) * 0.4);
    const outputTokens = threadLength === 'short' ? 400 : threadLength === 'medium' ? 800 : 1200;

    const cost = (baseTokens + inputTokens) * 0.00003 + outputTokens * 0.00006;
    setEstimatedCost(cost);
  }, [topic, keyPoints, threadLength]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter a topic for your thread');
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
    setShowResults(true);
    setGeneratedThread([]);

    try {
      const template = PROMPT_TEMPLATES.THREAD_GENERATOR;

      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        topic: topic.trim(),
        threadType: threadType,
        threadLength: threadLength,
        keyPoints: keyPoints.trim() || 'not specified',
      });

      const result = await generateContent(
        'thread_generator',
        template.systemPrompt,
        userPrompt,
        {
          temperature: 0.7,
          maxTokens: threadLength === 'short' ? 600 : threadLength === 'medium' ? 1000 : 1500,
          voiceToneProfile: selectedVoiceToneProfile || undefined,
        }
      );

      const parsedThread = parseGeneratedThread(result);
      setGeneratedThread(parsedThread);

      completeStep('first_generation');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseGeneratedThread = (text: string): string[] => {
    // Split by tweet numbers (1/, 2/, etc.) or newlines
    const tweets = text
      .split(/\n\n+|\d+\/\d+|\d+\.\s/)
      .map(t => t.trim())
      .filter(t => t.length > 10 && !t.match(/^Thread:/i));

    return tweets.length > 0 ? tweets : [text];
  };

  const handleCopyThread = () => {
    const threadText = generatedThread
      .map((tweet, i) => `${i + 1}/${generatedThread.length}\n\n${tweet}`)
      .join('\n\n---\n\n');

    Clipboard.setString(threadText);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied!', 'Thread copied to clipboard');
  };

  const handleCopyTweet = (tweet: string, index: number) => {
    const tweetText = `${index + 1}/${generatedThread.length}\n\n${tweet}`;
    Clipboard.setString(tweetText);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied!', `Tweet ${index + 1} copied to clipboard`);
  };

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template.id);
    setThreadType(template.type);
    setTopic('');
    setShowResults(false);
  };

  const handleQuickDemo = () => {
    setTopic('how to build productive morning routines as an entrepreneur');
    setThreadType('how_to');
    setThreadLength('medium');
    setTimeout(() => handleGenerate(), 300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Thread Generator</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* Intro */}
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <MessageSquare size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>
              AI-powered thread creation for Twitter/X and Threads with proven engagement structures
            </Text>
          </View>

          {/* Quick Demo Button */}
          {!showResults && generatedThread.length === 0 && (
            <TouchableOpacity
              style={[styles.quickDemoButton, { backgroundColor: theme.colors.aiPrimary }]}
              onPress={handleQuickDemo}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <View style={styles.quickDemoText}>
                <Text style={styles.quickDemoTitle}>Try AI Demo</Text>
                <Text style={styles.quickDemoSubtitle}>Generate a complete thread instantly</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Generation Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Generate Custom Thread
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Topic *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="e.g., building a morning routine, productivity tips"
                placeholderTextColor={theme.colors.textTertiary}
                value={topic}
                onChangeText={setTopic}
                multiline
              />
            </View>

            {/* Thread Type */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Thread Type
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                {threadTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.border,
                      },
                      threadType === type.id && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setThreadType(type.id)}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        { color: theme.colors.textPrimary },
                        threadType === type.id && { color: '#FFFFFF' }
                      ]}
                    >
                      {type.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Thread Length */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Length
              </Text>
              <View style={styles.lengthButtons}>
                {threadLengths.map((length) => (
                  <TouchableOpacity
                    key={length.id}
                    style={[
                      styles.lengthButton,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.border,
                      },
                      threadLength === length.id && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setThreadLength(length.id)}
                  >
                    <Text
                      style={[
                        styles.lengthButtonText,
                        { color: theme.colors.textPrimary },
                        threadLength === length.id && { color: '#FFFFFF' }
                      ]}
                    >
                      {length.name}
                    </Text>
                    <Text
                      style={[
                        styles.lengthButtonSubtext,
                        { color: theme.colors.textSecondary },
                        threadLength === length.id && { color: 'rgba(255,255,255,0.8)' }
                      ]}
                    >
                      {length.tweets}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
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
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                    Key Points (optional)
                  </Text>
                  <TextInput
                    style={[styles.input, styles.textArea, {
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                      color: theme.colors.textPrimary,
                    }]}
                    placeholder="Key points to include (comma-separated)"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={keyPoints}
                    onChangeText={setKeyPoints}
                    multiline
                    numberOfLines={3}
                  />
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
                {isGenerating ? 'Generating...' : 'Generate Thread'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Generated Thread */}
          {generatedThread.length > 0 && (
            <View style={[styles.threadContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <View style={styles.threadHeader}>
                <View>
                  <Text style={[styles.threadTitle, { color: theme.colors.textPrimary }]}>
                    Generated Thread
                  </Text>
                  <Text style={[styles.threadMeta, { color: theme.colors.textSecondary }]}>
                    {generatedThread.length} tweets • ~{Math.ceil(generatedThread.join(' ').length / 5)} words
                  </Text>
                </View>
                <TouchableOpacity
                  style={[styles.copyAllButton, { backgroundColor: theme.colors.aiPrimary }]}
                  onPress={handleCopyThread}
                >
                  <Copy size={16} color="#FFFFFF" />
                  <Text style={styles.copyAllButtonText}>Copy All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tweetsList}>
                {generatedThread.map((tweet, index) => (
                  <View
                    key={index}
                    style={[styles.tweetCard, {
                      backgroundColor: theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                    }]}
                  >
                    <View style={styles.tweetHeader}>
                      <View style={[styles.tweetNumber, { backgroundColor: theme.colors.aiPrimary }]}>
                        <Text style={styles.tweetNumberText}>
                          {index + 1}/{generatedThread.length}
                        </Text>
                      </View>
                      {index === 0 && (
                        <View style={[styles.hookBadge, { backgroundColor: theme.colors.warning }]}>
                          <Text style={styles.hookBadgeText}>Hook</Text>
                        </View>
                      )}
                      {index === generatedThread.length - 1 && (
                        <View style={[styles.ctaBadge, { backgroundColor: theme.colors.success }]}>
                          <Text style={styles.ctaBadgeText}>CTA</Text>
                        </View>
                      )}
                    </View>

                    <Text style={[styles.tweetText, { color: theme.colors.textPrimary }]}>
                      {tweet}
                    </Text>

                    <View style={styles.tweetFooter}>
                      <Text style={[styles.tweetLength, { color: theme.colors.textTertiary }]}>
                        {tweet.length} chars
                      </Text>
                      <TouchableOpacity onPress={() => handleCopyTweet(tweet, index)}>
                        <Copy size={16} color={theme.colors.aiPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Templates */}
          <View style={styles.templatesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
              Thread Templates
            </Text>

            {templates.map((template) => (
              <View
                key={template.id}
                style={[
                  styles.templateCard,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                  selectedTemplate === template.id && {
                    borderColor: theme.colors.aiPrimary,
                    borderWidth: 2,
                  }
                ]}
              >
                <View style={styles.templateHeader}>
                  <View>
                    <Text style={[styles.templateTitle, { color: theme.colors.textPrimary }]}>
                      {template.title}
                    </Text>
                    <Text style={[styles.templateFormat, { color: theme.colors.textSecondary }]}>
                      {template.format}
                    </Text>
                  </View>
                </View>

                <View style={styles.structureContainer}>
                  <Text style={[styles.structureTitle, { color: theme.colors.textPrimary }]}>
                    Structure:
                  </Text>
                  {template.structure.map((step, index) => (
                    <Text key={index} style={[styles.structureStep, { color: theme.colors.textSecondary }]}>
                      {step}
                    </Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.useButton, { backgroundColor: theme.colors.aiBackground }]}
                  onPress={() => handleUseTemplate(template)}
                >
                  <Copy size={16} color={theme.colors.aiPrimary} />
                  <Text style={[styles.useButtonText, { color: theme.colors.aiPrimary }]}>
                    Use This Template
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
        message="Generate complete Twitter/X threads with proven engagement structures. Perfect for building your audience!"
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
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
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
  },
  lengthButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  lengthButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  lengthButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  lengthButtonSubtext: {
    fontSize: 11,
  },
  advancedToggle: {
    alignSelf: 'flex-start',
  },
  advancedToggleText: {
    fontSize: 14,
    fontWeight: '600',
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
  threadContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  threadMeta: {
    fontSize: 12,
  },
  copyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  copyAllButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tweetsList: {
    padding: 16,
    gap: 12,
  },
  tweetCard: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    gap: 12,
  },
  tweetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tweetNumber: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tweetNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  hookBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  hookBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ctaBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ctaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tweetText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tweetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tweetLength: {
    fontSize: 11,
  },
  templatesSection: {
    marginTop: 8,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  templateCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  templateHeader: {
    marginBottom: 16,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateFormat: {
    fontSize: 13,
  },
  structureContainer: {
    marginBottom: 16,
  },
  structureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  structureStep: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  useButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
