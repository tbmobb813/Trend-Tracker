import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, ShoppingBag, Settings, Wand2, Sparkles } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';
import { CostEstimate } from '@/components/ai/CostTransparency';

export default function ProductIdeasScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { generateContent, config } = useAIStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<any[]>([]);
  const [niche, setNiche] = useState('');

  const handleGenerate = async () => {
    if (!niche.trim()) return Alert.alert('Missing Niche', 'Please enter your niche');
    if (!config?.openaiApiKey && !config?.anthropicApiKey) return Alert.alert('API Key Required', 'Add API key in Settings');

    setIsGenerating(true);
    try {
      const template = PROMPT_TEMPLATES.PRODUCT_IDEAS;
      const userPrompt = interpolatePrompt(template.userPromptTemplate, { niche: niche.trim(), productCount: '5' });
      const result = await generateContent('product_ideas', template.systemPrompt, userPrompt, { temperature: 0.8, maxTokens: 600 });

      const parsed = result.split(/\n\n+/).filter(s => s.length > 30).slice(0, 5).map((idea, i) => ({
        id: `gen-${i}`,
        name: `Product Idea ${i + 1}`,
        description: idea,
        difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)],
        potential: ['Medium', 'High'][Math.floor(Math.random() * 2)],
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
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Product Ideas</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}><Settings size={20} color={theme.colors.textSecondary} /></TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.content}>
          <View style={[styles.intro, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
            <ShoppingBag size={24} color={theme.colors.aiPrimary} />
            <Text style={[styles.introText, { color: theme.colors.textPrimary }]}>AI-powered product ideas for your niche</Text>
          </View>

          <View style={[styles.form, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TextInput
              style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
              placeholder="Enter your niche (e.g., fitness, productivity)"
              placeholderTextColor={theme.colors.textTertiary}
              value={niche}
              onChangeText={setNiche}
              multiline
            />
            {niche.trim() && <CostEstimate estimatedCost={0.025} showDetails={false} />}
            <TouchableOpacity style={[styles.btn, { backgroundColor: theme.colors.aiPrimary }, isGenerating && { opacity: 0.6 }]} onPress={handleGenerate} disabled={isGenerating}>
              <Wand2 size={20} color="#FFF" />
              <Text style={styles.btnText}>{isGenerating ? 'Generating...' : 'Generate Ideas'}</Text>
            </TouchableOpacity>
          </View>

          {generated.map(item => (
            <View key={item.id} style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border, borderLeftWidth: 4, borderLeftColor: theme.colors.aiPrimary }]}>
              <View style={styles.row}>
                <Text style={[styles.name, { color: theme.colors.textPrimary }]}>{item.name}</Text>
                <View style={[styles.badge, { backgroundColor: theme.colors.aiBackground }]}>
                  <Sparkles size={10} color={theme.colors.aiPrimary} />
                </View>
              </View>
              <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>{item.description}</Text>
              <View style={styles.row}>
                <Text style={[styles.meta, { color: theme.colors.textTertiary }]}>Difficulty: {item.difficulty}</Text>
                <Text style={[styles.meta, { color: theme.colors.success }]}>Potential: {item.potential}</Text>
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
  badge: { paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4 },
  desc: { fontSize: 14, lineHeight: 20 },
  meta: { fontSize: 12 },
});
