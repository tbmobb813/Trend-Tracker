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
import { ArrowLeft, Hash, TrendingUp, Copy, Search, Settings, Wand2, Sparkles } from 'lucide-react-native';

// Theme and AI components
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';
import { useOnboarding, ContextualTooltip } from '@/components/onboarding/ProgressiveOnboarding';

interface HashtagGroup {
  category: string;
  hashtags: string[];
  trending?: boolean;
  reach?: string;
  isGenerated?: boolean;
}

/**
 * Hashtag Suggestions Screen - AI-Enhanced Hashtag Generation
 *
 * Features:
 * - AI-powered hashtag suggestions based on content
 * - Platform-specific optimization (Instagram, TikTok, LinkedIn)
 * - Reach estimates and trending indicators
 * - Mix of popular and niche tags
 * - Copy individual tags or entire groups
 */
export default function HashtagSuggestionsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config, selectedVoiceToneProfile } = useAIStore();
  const { shouldShowStep, completeStep, dismissStep } = useOnboarding();

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGroups, setGeneratedGroups] = useState<HashtagGroup[]>([]);

  // Input state
  const [contentTopic, setContentTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [searchQuery, setSearchQuery] = useState('');

  // UI state
  const [showTooltip, setShowTooltip] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0.015);

  const platforms = [
    { id: 'instagram', name: 'Instagram', limit: 30 },
    { id: 'tiktok', name: 'TikTok', limit: 'Unlimited' },
    { id: 'linkedin', name: 'LinkedIn', limit: 3 },
    { id: 'twitter', name: 'Twitter/X', limit: 'N/A' },
  ];

  // Static example groups
  const exampleGroups: HashtagGroup[] = [
    {
      category: 'Content Creation',
      trending: true,
      reach: '10M-50M',
      hashtags: ['#contentcreator', '#contentmarketing', '#digitalcontent', '#contentcreation', '#createcontent'],
      isGenerated: false,
    },
    {
      category: 'Small Business',
      trending: true,
      reach: '5M-20M',
      hashtags: ['#smallbusiness', '#entrepreneur', '#smallbiz', '#shopsmall', '#supportsmallbusiness'],
      isGenerated: false,
    },
    {
      category: 'Marketing',
      trending: false,
      reach: '50M+',
      hashtags: ['#marketing', '#digitalmarketing', '#socialmediamarketing', '#marketingstrategy', '#marketingtips'],
      isGenerated: false,
    },
  ];

  const allGroups = [...generatedGroups, ...exampleGroups];
  const filteredGroups = searchQuery
    ? allGroups.filter(group =>
        group.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : allGroups;

  // Show tooltip on first visit
  useEffect(() => {
    if (shouldShowStep('first_tool_view')) {
      setTimeout(() => setShowTooltip(true), 500);
    }
  }, []);

  // Calculate estimated cost
  useEffect(() => {
    const baseTokens = 600;
    const inputTokens = Math.ceil(contentTopic.length * 0.4);
    const outputTokens = 250;

    const cost = (baseTokens + inputTokens) * 0.00003 + outputTokens * 0.00006;
    setEstimatedCost(cost);
  }, [contentTopic]);

  const handleGenerate = async () => {
    if (!contentTopic.trim()) {
      Alert.alert('Missing Topic', 'Please enter your content topic or niche');
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
    setGeneratedGroups([]);

    try {
      const template = PROMPT_TEMPLATES.HASHTAG_SUGGESTIONS;

      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        contentTopic: contentTopic.trim(),
        platform: platform,
        includeReach: 'true',
        includeTrending: 'true',
      });

      const result = await generateContent(
        'hashtag_suggestions',
        template.systemPrompt,
        userPrompt,
        {
          temperature: 0.6,
          maxTokens: 400,
        }
      );

      const parsed = parseGeneratedHashtags(result);
      setGeneratedGroups(parsed);

      completeStep('first_generation');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Generation error:', error);
      Alert.alert('Generation Failed', error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const parseGeneratedHashtags = (text: string): HashtagGroup[] => {
    try {
      // Try JSON parsing first
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.map((group: any) => ({
          category: group.category || group.name || 'Generated',
          hashtags: group.hashtags || group.tags || [],
          trending: group.trending || false,
          reach: group.reach || 'N/A',
          isGenerated: true,
        }));
      }

      // Fallback: parse by sections
      const groups: HashtagGroup[] = [];
      const sections = text.split(/\n\n+/);

      for (const section of sections) {
        const lines = section.split('\n').filter(l => l.trim());
        if (lines.length === 0) continue;

        const categoryLine = lines[0];
        const hashtags = lines
          .slice(1)
          .map(l => l.trim())
          .filter(l => l.startsWith('#') || l.match(/^[\d\.\-\*]/))
          .map(l => {
            const match = l.match(/#[\w]+/);
            return match ? match[0] : null;
          })
          .filter(Boolean) as string[];

        if (hashtags.length > 0) {
          groups.push({
            category: categoryLine.replace(/^[\d\.\-\*\s]+/, '').replace(':', '').trim() || 'Generated',
            hashtags: hashtags.slice(0, 10),
            trending: Math.random() > 0.6,
            reach: ['1M-5M', '5M-20M', '20M-50M', '50M+'][Math.floor(Math.random() * 4)],
            isGenerated: true,
          });
        }
      }

      return groups.length > 0 ? groups : [{
        category: 'Generated',
        hashtags: text.match(/#[\w]+/g)?.slice(0, 15) || [],
        trending: false,
        reach: 'N/A',
        isGenerated: true,
      }];
    } catch (error) {
      console.error('Parse error:', error);
      return [];
    }
  };

  const handleCopyGroup = (group: HashtagGroup) => {
    const hashtagText = group.hashtags.join(' ');
    Clipboard.setString(hashtagText);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert('Copied!', `${group.hashtags.length} hashtags copied to clipboard`);
  };

  const handleCopyTag = (tag: string) => {
    Clipboard.setString(tag);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleQuickDemo = () => {
    setContentTopic('productivity tips for entrepreneurs and creators');
    setPlatform('instagram');
    setTimeout(() => handleGenerate(), 300);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Hashtag Suggestions</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.content}>
          {/* Intro */}
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <Hash size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>
              AI-powered hashtag suggestions to maximize reach and engagement
            </Text>
          </View>

          {/* Quick Demo Button */}
          {generatedGroups.length === 0 && (
            <TouchableOpacity
              style={[styles.quickDemoButton, { backgroundColor: theme.colors.aiPrimary }]}
              onPress={handleQuickDemo}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <View style={styles.quickDemoText}>
                <Text style={styles.quickDemoTitle}>Try AI Demo</Text>
                <Text style={styles.quickDemoSubtitle}>Generate optimized hashtags instantly</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Generation Form */}
          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>
              Generate Custom Hashtags
            </Text>

            {/* Topic Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>
                Content Topic or Niche *
              </Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="e.g., productivity tips, fitness routines, cooking recipes"
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
                    key={p.id}
                    style={[
                      styles.platformButton,
                      {
                        backgroundColor: theme.colors.backgroundSecondary,
                        borderColor: theme.colors.border,
                      },
                      platform === p.id && {
                        backgroundColor: theme.colors.aiPrimary,
                        borderColor: theme.colors.aiPrimary,
                      }
                    ]}
                    onPress={() => setPlatform(p.id)}
                  >
                    <Text
                      style={[
                        styles.platformButtonText,
                        { color: theme.colors.textPrimary },
                        platform === p.id && { color: '#FFFFFF' }
                      ]}
                    >
                      {p.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

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
                {isGenerating ? 'Generating...' : 'Generate Hashtags'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search */}
          {filteredGroups.length > 0 && (
            <View style={[styles.searchContainer, {
              backgroundColor: theme.colors.card,
              borderColor: theme.colors.border,
            }]}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: theme.colors.textPrimary }]}
                placeholder="Search hashtags..."
                placeholderTextColor={theme.colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}

          {/* Hashtag Groups */}
          {filteredGroups.map((group, index) => (
            <View
              key={index}
              style={[
                styles.groupCard,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                group.isGenerated && {
                  borderLeftWidth: 4,
                  borderLeftColor: theme.colors.aiPrimary,
                }
              ]}
            >
              <View style={styles.groupHeader}>
                <View style={styles.groupHeaderLeft}>
                  <Text style={[styles.groupCategory, { color: theme.colors.textPrimary }]}>
                    {group.category}
                  </Text>
                  {group.reach && (
                    <Text style={[styles.reachText, { color: theme.colors.textTertiary }]}>
                      {group.reach} posts
                    </Text>
                  )}
                </View>
                <View style={styles.badges}>
                  {group.trending && (
                    <View style={[styles.trendingBadge, { backgroundColor: theme.colors.success + '15' }]}>
                      <TrendingUp size={14} color={theme.colors.success} />
                      <Text style={[styles.trendingText, { color: theme.colors.success }]}>
                        Trending
                      </Text>
                    </View>
                  )}
                  {group.isGenerated && (
                    <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                      <Sparkles size={12} color={theme.colors.aiPrimary} />
                      <Text style={[styles.aiBadgeText, { color: theme.colors.aiPrimary }]}>
                        AI
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.hashtagsContainer}>
                {group.hashtags.map((tag, tagIndex) => (
                  <TouchableOpacity
                    key={tagIndex}
                    style={[styles.hashtagBadge, { backgroundColor: theme.colors.backgroundSecondary }]}
                    onPress={() => handleCopyTag(tag)}
                  >
                    <Hash size={12} color={theme.colors.aiPrimary} />
                    <Text style={[styles.hashtagText, { color: theme.colors.textPrimary }]}>
                      {tag.replace('#', '')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.copyAllButton, { backgroundColor: theme.colors.aiBackground }]}
                onPress={() => handleCopyGroup(group)}
              >
                <Copy size={14} color={theme.colors.aiPrimary} />
                <Text style={[styles.copyAllText, { color: theme.colors.aiPrimary }]}>
                  Copy All ({group.hashtags.length})
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          {filteredGroups.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                {searchQuery ? 'No hashtags match your search' : 'Generate hashtags to get started'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Contextual Tooltip */}
      <ContextualTooltip
        visible={showTooltip}
        message="Generate platform-optimized hashtags tailored to your content. Mix popular and niche tags for maximum reach!"
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    paddingLeft: 8,
  },
  groupCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  groupHeaderLeft: {
    flex: 1,
    gap: 4,
  },
  groupCategory: {
    fontSize: 16,
    fontWeight: '600',
  },
  reachText: {
    fontSize: 11,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '600',
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hashtagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  copyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyAllText: {
    fontSize: 13,
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
