import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, TrendingUp, Copy, Sparkles } from 'lucide-react-native';

export default function TikTokHooksScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Story', 'Question', 'Bold Statement', 'Tutorial'];

  const hooks = [
    {
      id: '1',
      text: 'Wait for it...',
      category: 'Story',
      engagement: 95,
      description: 'Creates anticipation and keeps viewers watching'
    },
    {
      id: '2',
      text: 'Nobody talks about this...',
      category: 'Bold Statement',
      engagement: 92,
      description: 'Positions you as someone sharing exclusive insights'
    },
    {
      id: '3',
      text: 'Here\'s what they don\'t want you to know...',
      category: 'Bold Statement',
      engagement: 88,
      description: 'Triggers curiosity with a hint of controversy'
    },
    {
      id: '4',
      text: 'You\'re doing it wrong. Here\'s why...',
      category: 'Tutorial',
      engagement: 90,
      description: 'Challenges assumptions and offers solutions'
    },
    {
      id: '5',
      text: 'This changed everything for me...',
      category: 'Story',
      engagement: 87,
      description: 'Personal transformation stories resonate deeply'
    },
    {
      id: '6',
      text: 'Watch till the end for the secret...',
      category: 'Story',
      engagement: 85,
      description: 'Encourages full video watch time'
    },
    {
      id: '7',
      text: 'If you struggle with [problem], watch this...',
      category: 'Tutorial',
      engagement: 89,
      description: 'Directly addresses a pain point'
    },
    {
      id: '8',
      text: 'POV: You just discovered...',
      category: 'Story',
      engagement: 86,
      description: 'Trending POV format hooks viewers instantly'
    }
  ];

  const filteredHooks = selectedCategory === 'All'
    ? hooks
    : hooks.filter(hook => hook.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>TikTok Hooks</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <Sparkles size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              Proven hooks to capture attention in the first 3 seconds and boost your engagement
            </Text>
          </View>

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.hooksList}>
            {filteredHooks.map((hook) => (
              <View key={hook.id} style={styles.hookCard}>
                <View style={styles.hookHeader}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>{hook.category}</Text>
                  </View>
                  <View style={styles.engagementBadge}>
                    <TrendingUp size={14} color={Colors.success} />
                    <Text style={styles.engagementText}>{hook.engagement}%</Text>
                  </View>
                </View>

                <Text style={styles.hookText}>{hook.text}</Text>
                <Text style={styles.hookDescription}>{hook.description}</Text>

                <TouchableOpacity style={styles.copyButton}>
                  <Copy size={16} color={Colors.primary} />
                  <Text style={styles.copyButtonText}>Copy Hook</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
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
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  introText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryButtonText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  hooksList: {
    gap: 16,
  },
  hookCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  engagementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  hookText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  hookDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
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
