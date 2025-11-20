import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Layers, Settings, Wand2, Sparkles } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/ai.service';
import { CostEstimate } from '@/components/ai/CostTransparency';

export default function DigitalProductsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [topic, setTopic] = useState('');

  const handleGenerate = async () => {
    if (!topic.trim()) return Alert.alert('Missing Topic', 'Enter your expertise area');
    if (!config?.openaiApiKey && !config?.anthropicApiKey) return Alert.alert('API Key Required', 'Add API key in Settings');

    setIsGenerating(true);
    try {
      const template = PROMPT_TEMPLATES.DIGITAL_PRODUCTS;
      const userPrompt = interpolatePrompt(template.userPromptTemplate, { expertise: topic.trim(), productCount: '5' });
      const result = await generateContent('digital_products', template.systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 600 });

      const parsed = result.split(/\n\n+/).filter(s => s.length > 30).slice(0, 5).map((idea, i) => ({
        id: `gen-${i}`,
        name: `Digital Product ${i + 1}`,
        description: idea,
        category: ['Template', 'Course', 'Guide', 'Ebook'][Math.floor(Math.random() * 4)],
        isGenerated: true
      }));

      setGenerated(parsed);
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
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Digital Products</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}><Settings size={20} color={theme.colors.textSecondary} /></TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <Layers size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>AI-powered digital product ideas for your expertise</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="Enter your expertise (e.g., content marketing, productivity)"
              placeholderTextColor={theme.colors.textTertiary}
              value={topic}
              onChangeText={setTopic}
              multiline
            />
            {topic.trim() && <CostEstimate estimatedCost={0.023} showDetails={false} />}
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.aiPrimary }, isGenerating && { opacity: 0.6 }]} onPress={handleGenerate} disabled={isGenerating}>
              <Wand2 size={20} color="#FFF" />
              <Text style={styles.btnText}>{isGenerating ? 'Generating...' : 'Generate Ideas'}</Text>
            </TouchableOpacity>
          </View>

          {generated.map(item => (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderLeftWidth: 4, borderLeftColor: theme.colors.aiPrimary }]}>
              <View style={styles.row}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                <View style={styles.badges}>
                  <View style={[styles.catBadge, { backgroundColor: theme.colors.backgroundTertiary }]}>
                    <Text style={[styles.catText, { color: theme.colors.textSecondary }]}>{item.category}</Text>
                  </View>
                  <View style={[styles.aiBadge, { backgroundColor: theme.colors.aiBackground }]}>
                    <Sparkles size={10} color={theme.colors.aiPrimary} />
                  </View>
                </View>
              </View>
              <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>{item.description}</Text>
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
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15, minHeight: 44 },
  btn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 8 },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  card: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', flex: 1 },
  badges: { flexDirection: 'row', gap: 6 },
  catBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  catText: { fontSize: 11, fontWeight: '600' },
  aiBadge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  desc: { fontSize: 14, lineHeight: 20 },
});
