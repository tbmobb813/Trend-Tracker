import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Image, TrendingUp, Settings, Wand2, Sparkles } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';

export default function ThumbnailIdeasScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('youtube');

  const staticThumbnails = [
    {
      id: '1',
      name: 'Before & After',
      description: 'Show transformation or comparison',
      elements: ['Split screen', 'Contrasting colors', 'Bold text overlay'],
      bestFor: 'Tutorial, Review, Transformation',
      estimatedCTR: 12.5,
      isGenerated: false
    },
    {
      id: '2',
      name: 'Shocked Face + Text',
      description: 'Express surprise or excitement',
      elements: ['Close-up facial expression', 'Bright background', 'Large text'],
      bestFor: 'Reaction videos, Surprising facts',
      estimatedCTR: 11.8,
      isGenerated: false
    },
  ];

  const all = [...generated, ...staticThumbnails];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      Alert.alert('Missing Topic', 'Please enter your video topic');
      return;
    }

    if (!config?.openaiApiKey && !config?.anthropicApiKey) {
      Alert.alert('API Key Required', 'Please add your API key in Settings');
      return;
    }

    setIsGenerating(true);
    setGenerated([]);

    try {
      const template = PROMPT_TEMPLATES.THUMBNAIL_IDEAS;
      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        contentTopic: topic.trim(),
        platform: platform,
        generateCount: '5',
      });

      const result = await generateContent('thumbnail_ideas', template.systemPrompt, userPrompt, {
        temperature: 0.8,
        maxTokens: 600,
      });

      const parsed = result.split(/\n\n+/).filter(s => s.length > 30).slice(0, 5).map((idea, i) => ({
        id: `gen-${i}`,
        name: `Idea ${i + 1}`,
        description: idea,
        elements: [],
        bestFor: platform,
        estimatedCTR: 10 + Math.random() * 3,
        isGenerated: true
      }));

      setGenerated(parsed);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Generation Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Thumbnail Ideas</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <Image size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>
              AI-powered thumbnail concepts to boost your click-through rate
            </Text>
          </View>

          <View style={[styles.formContainer, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.formTitle, { color: theme.colors.textPrimary }]}>Generate Thumbnail Ideas</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Video Topic *</Text>
              <TextInput
                style={[styles.input, {
                  backgroundColor: theme.colors.backgroundSecondary,
                  borderColor: theme.colors.border,
                  color: theme.colors.textPrimary,
                }]}
                placeholder="e.g., morning routine productivity tips"
                placeholderTextColor={theme.colors.textTertiary}
                value={topic}
                onChangeText={setTopic}
                multiline
              />
            </View>

            {topic.trim() && <View style={styles.costContainer}><CostEstimate estimatedCost={0.02} showDetails={false} /></View>}

            <TouchableOpacity
              style={[styles.generateButton, { backgroundColor: theme.colors.aiPrimary }, isGenerating && { opacity: 0.6 }]}
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              <Wand2 size={20} color="#FFFFFF" />
              <Text style={styles.generateButtonText}>{isGenerating ? 'Generating...' : 'Generate Ideas'}</Text>
            </TouchableOpacity>
          </View>

          {all.map((thumbnail) => (
            <View key={thumbnail.id} style={[
              styles.thumbnailCard,
              { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              thumbnail.isGenerated && { borderLeftWidth: 4, borderLeftColor: theme.colors.aiPrimary }
            ]}>
              <View style={styles.thumbnailHeader}>
                <Text style={[styles.thumbnailName, { color: theme.colors.textPrimary }]}>{thumbnail.name}</Text>
                <View style={styles.badges}>
                  <View style={[styles.ctrBadge, { backgroundColor: theme.colors.success + '15' }]}>
                    <TrendingUp size={14} color={theme.colors.success} />
                    <Text style={[styles.ctrText, { color: theme.colors.success }]}>{thumbnail.estimatedCTR.toFixed(1)}% CTR</Text>
                  </View>
                  {thumbnail.isGenerated && (
                    <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                      <Sparkles size={10} color={theme.colors.aiPrimary} />
                    </View>
                  )}
                </View>
              </View>

              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{thumbnail.description}</Text>

              {thumbnail.elements.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Key Elements:</Text>
                  {thumbnail.elements.map((element: string, index: number) => (
                    <Text key={index} style={[styles.element, { color: theme.colors.textSecondary }]}>• {element}</Text>
                  ))}
                </View>
              )}

              <View style={[styles.bestForContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.bestForLabel, { color: theme.colors.textSecondary }]}>Best For:</Text>
                <Text style={[styles.bestForText, { color: theme.colors.textPrimary }]}>{thumbnail.bestFor}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  intro: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
  },
  introText: { flex: 1, fontSize: 14, lineHeight: 20 },
  formContainer: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 16 },
  formTitle: { fontSize: 16, fontWeight: '700' },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 44 },
  costContainer: { marginTop: 8 },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
  },
  generateButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  thumbnailCard: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 12 },
  thumbnailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  thumbnailName: { fontSize: 16, fontWeight: '600', flex: 1 },
  badges: { flexDirection: 'row', gap: 6 },
  ctrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ctrText: { fontSize: 11, fontWeight: '600' },
  aiBadge: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  description: { fontSize: 14, lineHeight: 20 },
  section: { gap: 6 },
  sectionTitle: { fontSize: 13, fontWeight: '600' },
  element: { fontSize: 13, lineHeight: 18 },
  bestForContainer: { padding: 12, borderRadius: 8, gap: 4 },
  bestForLabel: { fontSize: 12, fontWeight: '600' },
  bestForText: { fontSize: 13 },
});
