import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, AlertCircle, Settings, Wand2, Sparkles, CheckCircle } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';

export default function PostTroubleshootingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [problem, setProblem] = useState('');

  const handleGenerate = async () => {
    if (!problem.trim()) return Alert.alert('Missing Problem', 'Describe your content issue');
    if (!config?.openaiApiKey && !config?.anthropicApiKey) return Alert.alert('API Key Required', 'Add API key in Settings');

    setIsGenerating(true);
    try {
      const template = PROMPT_TEMPLATES.POST_TROUBLESHOOTING;
      const userPrompt = interpolatePrompt(template.userPromptTemplate, { problem: problem.trim(), solutionCount: '5' });
      const result = await generateContent('post_troubleshooting', template.systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 600 });

      const solutions = result.split(/\n+/).filter(s => s.trim().length > 20).slice(0, 5).map((sol, i) => ({
        id: `gen-${i}`,
        solution: sol.replace(/^[\d\.\-\*\s]+/, '').trim(),
        isGenerated: true
      }));

      setGenerated(solutions);
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
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Post Troubleshooting</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}><Settings size={20} color={theme.colors.textSecondary} /></TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <AlertCircle size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>AI-powered solutions for your content challenges</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="Describe your problem (e.g., low engagement, no reach)"
              placeholderTextColor={theme.colors.textTertiary}
              value={problem}
              onChangeText={setProblem}
              multiline
            />
            {problem.trim() && <CostEstimate estimatedCost={0.02} showDetails={false} />}
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.aiPrimary }, isGenerating && { opacity: 0.6 }]} onPress={handleGenerate} disabled={isGenerating}>
              <Wand2 size={20} color="#FFF" />
              <Text style={styles.btnText}>{isGenerating ? 'Analyzing...' : 'Get Solutions'}</Text>
            </TouchableOpacity>
          </View>

          {generated.map((item, index) => (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderLeftWidth: 4, borderLeftColor: theme.colors.success }]}>
              <View style={styles.row}>
                <CheckCircle size={18} color={theme.colors.success} />
                <Text style={[styles.solution, { color: theme.colors.textPrimary }]}>{item.solution}</Text>
              </View>
              {item.isGenerated && (
                <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                  <Sparkles size={10} color={theme.colors.aiPrimary} />
                  <Text style={[styles.aiBadgeText, { color: theme.colors.aiPrimary }]}>AI Solution</Text>
                </View>
              )}
            </View>
          ))}
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
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  card: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 10 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  solution: { fontSize: 15, lineHeight: 22, flex: 1 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  aiBadgeText: { fontSize: 11, fontWeight: '600' },
});
