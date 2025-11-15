import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, FileText, Copy } from 'lucide-react-native';

export default function CaptionTemplatesScreen() {
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState('All');

  const platforms = ['All', 'Instagram', 'TikTok', 'Twitter', 'LinkedIn'];

  const templates = [
    {
      id: '1',
      template: '[Problem Statement]\n\nHere\'s what I learned:\n\n[Solution 1]\n[Solution 2]\n[Solution 3]\n\nWhich one resonates with you?',
      platform: 'Instagram',
      category: 'Educational'
    },
    {
      id: '2',
      template: 'POV: You just discovered [topic]\n\nIt changed everything.\n\nHere\'s why 👇',
      platform: 'TikTok',
      category: 'Story'
    },
    {
      id: '3',
      template: 'Unpopular opinion:\n\n[Your take]\n\nHere\'s why this matters...',
      platform: 'Twitter',
      category: 'Thought Leadership'
    },
    {
      id: '4',
      template: '3 years ago, I [past situation]\n\nToday, I [current situation]\n\nHere\'s what changed:',
      platform: 'LinkedIn',
      category: 'Inspirational'
    },
    {
      id: '5',
      template: 'Things nobody tells you about [topic]:\n\n1. [Point 1]\n2. [Point 2]\n3. [Point 3]\n\nSave this for later!',
      platform: 'Instagram',
      category: 'Tips'
    }
  ];

  const filteredTemplates = selectedPlatform === 'All'
    ? templates
    : templates.filter(t => t.platform === selectedPlatform);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Caption Templates</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <FileText size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              Ready-to-use caption templates to maximize your engagement
            </Text>
          </View>

          <View style={styles.platformsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformButton,
                    selectedPlatform === platform && styles.platformButtonActive
                  ]}
                  onPress={() => setSelectedPlatform(platform)}
                >
                  <Text
                    style={[
                      styles.platformButtonText,
                      selectedPlatform === platform && styles.platformButtonTextActive
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {filteredTemplates.map((template) => (
            <View key={template.id} style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <Text style={styles.categoryText}>{template.category}</Text>
                <Text style={styles.platformTag}>{template.platform}</Text>
              </View>

              <View style={styles.templateContent}>
                <Text style={styles.templateText}>{template.template}</Text>
              </View>

              <TouchableOpacity style={styles.copyButton}>
                <Copy size={16} color={Colors.primary} />
                <Text style={styles.copyButtonText}>Copy Template</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    padding: 16,
  },
  intro: {
    flexDirection: 'row',
    backgroundColor: Colors.primary + Colors.opacity10,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    gap: 12,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  platformsContainer: {
    marginBottom: 20,
  },
  platformButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  platformButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  platformButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  platformButtonTextActive: {
    color: '#FFFFFF',
  },
  templateCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  platformTag: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  templateContent: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  templateText: {
    fontSize: 14,
    color: Colors.text,
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
    backgroundColor: Colors.primary + Colors.opacity10,
  },
  copyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
