import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Key, DollarSign, Settings as SettingsIcon, Zap, Info } from 'lucide-react-native';

import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { config, statistics, updateConfig } = useAIStore();

  const [openaiKey, setOpenaiKey] = useState(config?.openaiApiKey || '');
  const [anthropicKey, setAnthropicKey] = useState(config?.anthropicApiKey || '');
  const [monthlyBudget, setMonthlyBudget] = useState(config?.monthlyBudgetLimit?.toString() || '50');
  const [defaultProvider, setDefaultProvider] = useState<'openai' | 'anthropic'>(config?.defaultProvider || 'openai');
  const [showKeys, setShowKeys] = useState(false);

  const handleSave = async () => {
    if (!openaiKey.trim() && !anthropicKey.trim()) {
      return Alert.alert('API Key Required', 'Please enter at least one API key to use AI features');
    }

    const updates = {
      openaiApiKey: openaiKey.trim(),
      anthropicApiKey: anthropicKey.trim(),
      monthlyBudgetLimit: parseFloat(monthlyBudget) || 50,
      defaultProvider,
    };

    await updateConfig(updates);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Settings Saved', 'Your AI configuration has been updated');
  };

  const monthlySpend = statistics?.totalCost || 0;
  const budgetLimit = parseFloat(monthlyBudget) || 50;
  const budgetPercentage = Math.min((monthlySpend / budgetLimit) * 100, 100);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.backgroundPrimary }]} edges={['top']}>
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]}>AI Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView>
        <View style={styles.content}>
          {/* Cost Tracking Section */}
          <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <DollarSign size={20} color={theme.colors.aiPrimary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Cost Tracking</Text>
            </View>

            <View style={[styles.budgetCard, { backgroundColor: theme.colors.backgroundSecondary }]}>
              <View style={styles.budgetRow}>
                <Text style={[styles.budgetLabel, { color: theme.colors.textSecondary }]}>Monthly Spend</Text>
                <Text style={[styles.budgetValue, { color: budgetPercentage > 80 ? theme.colors.error : theme.colors.success }]}>
                  ${monthlySpend.toFixed(2)}
                </Text>
              </View>
              <View style={[styles.progressBar, { backgroundColor: theme.colors.backgroundTertiary }]}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${budgetPercentage}%`,
                      backgroundColor: budgetPercentage > 80 ? theme.colors.error : theme.colors.aiPrimary
                    }
                  ]}
                />
              </View>
              <Text style={[styles.budgetSubtext, { color: theme.colors.textTertiary }]}>
                {budgetPercentage.toFixed(0)}% of ${budgetLimit} monthly budget
              </Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={[styles.statBox, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{statistics?.totalGenerations || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Generations</Text>
              </View>
              <View style={[styles.statBox, { backgroundColor: theme.colors.backgroundSecondary }]}>
                <Text style={[styles.statValue, { color: theme.colors.textPrimary }]}>{statistics?.totalTokens?.toLocaleString() || 0}</Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Tokens Used</Text>
              </View>
            </View>
          </View>

          {/* API Keys Section */}
          <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <Key size={20} color={theme.colors.aiPrimary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>API Keys</Text>
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.border }]}>
              <Info size={16} color={theme.colors.aiPrimary} />
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Your API keys are stored securely on your device and never shared
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>OpenAI API Key</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                placeholder="sk-..."
                placeholderTextColor={theme.colors.textTertiary}
                value={openaiKey}
                onChangeText={setOpenaiKey}
                secureTextEntry={!showKeys}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Anthropic API Key</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                placeholder="sk-ant-..."
                placeholderTextColor={theme.colors.textTertiary}
                value={anthropicKey}
                onChangeText={setAnthropicKey}
                secureTextEntry={!showKeys}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: theme.colors.textSecondary }]}>Show API Keys</Text>
              <Switch
                value={showKeys}
                onValueChange={setShowKeys}
                trackColor={{ false: theme.colors.backgroundTertiary, true: theme.colors.aiPrimary }}
                thumbColor="#FFF"
              />
            </View>
          </View>

          {/* Configuration Section */}
          <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <View style={styles.sectionHeader}>
              <SettingsIcon size={20} color={theme.colors.aiPrimary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>Configuration</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Monthly Budget Limit ($)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border, color: theme.colors.textPrimary }]}
                placeholder="50"
                placeholderTextColor={theme.colors.textTertiary}
                value={monthlyBudget}
                onChangeText={setMonthlyBudget}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.textSecondary }]}>Default AI Provider</Text>
              <View style={styles.providerButtons}>
                <TouchableOpacity
                  style={[
                    styles.providerBtn,
                    {
                      backgroundColor: defaultProvider === 'openai' ? theme.colors.aiPrimary : theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border
                    }
                  ]}
                  onPress={() => setDefaultProvider('openai')}
                >
                  <Text style={[styles.providerText, { color: defaultProvider === 'openai' ? '#FFF' : theme.colors.textSecondary }]}>
                    OpenAI GPT-4
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.providerBtn,
                    {
                      backgroundColor: defaultProvider === 'anthropic' ? theme.colors.aiPrimary : theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border
                    }
                  ]}
                  onPress={() => setDefaultProvider('anthropic')}
                >
                  <Text style={[styles.providerText, { color: defaultProvider === 'anthropic' ? '#FFF' : theme.colors.textSecondary }]}>
                    Claude 3.5
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.colors.aiPrimary }]}
            onPress={handleSave}
          >
            <Zap size={20} color="#FFF" />
            <Text style={styles.saveBtnText}>Save Settings</Text>
          </TouchableOpacity>

          {/* Help Text */}
          <View style={[styles.helpBox, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
            <Text style={[styles.helpTitle, { color: theme.colors.textPrimary }]}>Getting API Keys:</Text>
            <Text style={[styles.helpText, { color: theme.colors.textSecondary }]}>
              • OpenAI: Visit platform.openai.com/api-keys{'\n'}
              • Anthropic: Visit console.anthropic.com/settings/keys{'\n\n'}
              Your keys are encrypted and stored locally on your device.
            </Text>
          </View>
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
  section: { borderRadius: 12, padding: 16, borderWidth: 1, gap: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: '600' },
  budgetCard: { borderRadius: 8, padding: 12, gap: 8 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  budgetLabel: { fontSize: 14 },
  budgetValue: { fontSize: 20, fontWeight: '700' },
  progressBar: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  budgetSubtext: { fontSize: 12 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, borderRadius: 8, padding: 12, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700' },
  statLabel: { fontSize: 12, marginTop: 4 },
  infoBox: { flexDirection: 'row', padding: 12, borderRadius: 8, gap: 8, borderWidth: 1 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 18 },
  inputGroup: { gap: 8 },
  inputLabel: { fontSize: 13, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  toggleLabel: { fontSize: 14 },
  providerButtons: { flexDirection: 'row', gap: 12 },
  providerBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center', borderWidth: 1 },
  providerText: { fontSize: 14, fontWeight: '600' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 8 },
  saveBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  helpBox: { borderRadius: 8, padding: 16, borderWidth: 1 },
  helpTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  helpText: { fontSize: 13, lineHeight: 20 },
});
