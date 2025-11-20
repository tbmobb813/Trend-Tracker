import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Film, Settings, Wand2, Sparkles } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';

const PLATFORMS = ['YouTube', 'TikTok', 'Instagram', 'YouTube Shorts'];
const LENGTHS = ['15-30 sec', '30-60 sec', '1-3 min', '3-5 min', '5-10 min'];
const TONES = ['Conversational', 'Professional', 'Funny', 'Inspiring', 'Educational'];

export default function ScriptWriterScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('YouTube');
  const [length, setLength] = useState('1-3 min');
  const [tone, setTone] = useState('Conversational');

  const handleGenerate = async () => {
    if (!topic.trim()) return Alert.alert('Missing Topic', 'Enter your video topic');
    if (!config?.openaiApiKey && !config?.anthropicApiKey) return Alert.alert('API Key Required', 'Add API key in Settings');

    setIsGenerating(true);
    try {
      const template = PROMPT_TEMPLATES.SCRIPT_WRITER;
      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        platform,
        topic: topic.trim(),
        length,
        audience: 'content creators and entrepreneurs',
        contentType: 'educational',
        keyPoints: ['hook', 'main value', 'call to action'],
        tone: tone.toLowerCase(),
        includeHook: 'yes',
        visualStyle: 'dynamic',
      });
      const result = await generateContent('script_writer', template.systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 1200 });

      setGeneratedScript(result);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Alert.alert('Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}><ArrowLeft size={24} color={theme.colors.textPrimary} /></TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Script Writer</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}><Settings size={20} color={theme.colors.textSecondary} /></TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <Film size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>AI-powered video scripts optimized for engagement</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="Enter video topic (e.g., How to grow on Instagram)"
              placeholderTextColor={theme.colors.textTertiary}
              value={topic}
              onChangeText={setTopic}
              multiline
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Platform</Text>
                <View style={styles.chips}>
                  {PLATFORMS.map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[styles.chip, { backgroundColor: platform === p ? theme.colors.aiPrimary : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}
                      onPress={() => setPlatform(p)}
                    >
                      <Text style={[styles.chipText, { color: platform === p ? '#FFF' : theme.colors.textSecondary }]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Length</Text>
                <View style={styles.chips}>
                  {LENGTHS.map((l) => (
                    <TouchableOpacity
                      key={l}
                      style={[styles.chip, { backgroundColor: length === l ? theme.colors.aiPrimary : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}
                      onPress={() => setLength(l)}
                    >
                      <Text style={[styles.chipText, { color: length === l ? '#FFF' : theme.colors.textSecondary }]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Tone</Text>
                <View style={styles.chips}>
                  {TONES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[styles.chip, { backgroundColor: tone === t ? theme.colors.aiPrimary : theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}
                      onPress={() => setTone(t)}
                    >
                      <Text style={[styles.chipText, { color: tone === t ? '#FFF' : theme.colors.textSecondary }]}>{t}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {topic.trim() && <CostEstimate estimatedCost={0.035} showDetails={false} />}
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.aiPrimary }, isGenerating && { opacity: 0.6 }]} onPress={handleGenerate} disabled={isGenerating}>
              <Wand2 size={20} color="#FFF" />
              <Text style={styles.btnText}>{isGenerating ? 'Writing Script...' : 'Generate Script'}</Text>
            </TouchableOpacity>
          </View>

          {generatedScript && (
            <View style={[styles.scriptCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderLeftWidth: 4, borderLeftColor: theme.colors.aiPrimary }]}>
              <View style={styles.scriptHeader}>
                <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                  <Sparkles size={10} color={theme.colors.aiPrimary} />
                  <Text style={[styles.aiBadgeText, { color: theme.colors.aiPrimary }]}>AI Generated</Text>
                </View>
                <Text style={[styles.scriptMeta, { color: theme.colors.textTertiary }]}>{platform} • {length} • {tone}</Text>
              </View>
              <Text style={[styles.scriptText, { color: theme.colors.textPrimary }]}>{generatedScript}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontSize: 18, fontWeight: '600' },
  content: { padding: 16, gap: 16 },
  intro: { flexDirection: 'row', padding: 16, borderRadius: 12, alignItems: 'center', gap: 12, borderWidth: 1 },
  introText: { flex: 1, fontSize: 14 },
  form: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 16 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 60 },
  row: { gap: 8 },
  col: { flex: 1, gap: 8 },
  label: { fontSize: 13, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 13, fontWeight: '500' },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  scriptCard: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 12 },
  scriptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  aiBadgeText: { fontSize: 11, fontWeight: '600' },
  scriptMeta: { fontSize: 12 },
  scriptText: { fontSize: 14, lineHeight: 22, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
});
