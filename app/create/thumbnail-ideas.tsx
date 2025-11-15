import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, Image, TrendingUp } from 'lucide-react-native';

export default function ThumbnailIdeasScreen() {
  const router = useRouter();

  const thumbnails = [
    {
      id: '1',
      name: 'Before & After',
      description: 'Show transformation or comparison',
      elements: ['Split screen', 'Contrasting colors', 'Bold text overlay', 'Arrow pointing to result'],
      bestFor: 'Tutorial, Review, Transformation content',
      estimatedCTR: 12.5
    },
    {
      id: '2',
      name: 'Shocked Face + Text',
      description: 'Express surprise or excitement',
      elements: ['Close-up facial expression', 'Bright background', 'Large, readable text', 'High contrast'],
      bestFor: 'Reaction videos, Surprising facts',
      estimatedCTR: 11.8
    },
    {
      id: '3',
      name: 'Number + Benefit',
      description: 'List-based value proposition',
      elements: ['Large number', 'Clear benefit statement', 'Clean background', 'Visual icons'],
      bestFor: 'List videos, Tips & tricks',
      estimatedCTR: 10.2
    },
    {
      id: '4',
      name: 'Question Format',
      description: 'Pose an intriguing question',
      elements: ['Question mark', 'Thought-provoking text', 'Curious expression', 'Bright colors'],
      bestFor: 'Explanatory content, Q&A videos',
      estimatedCTR: 9.8
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Thumbnail Ideas</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <Image size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              High-converting thumbnail designs to boost your click-through rate
            </Text>
          </View>

          {thumbnails.map((thumbnail) => (
            <View key={thumbnail.id} style={styles.thumbnailCard}>
              <View style={styles.thumbnailHeader}>
                <Text style={styles.thumbnailName}>{thumbnail.name}</Text>
                <View style={styles.ctrBadge}>
                  <TrendingUp size={14} color={Colors.success} />
                  <Text style={styles.ctrText}>{thumbnail.estimatedCTR}% CTR</Text>
                </View>
              </View>

              <Text style={styles.description}>{thumbnail.description}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Elements:</Text>
                {thumbnail.elements.map((element, index) => (
                  <Text key={index} style={styles.element}>• {element}</Text>
                ))}
              </View>

              <View style={styles.bestForContainer}>
                <Text style={styles.bestForLabel}>Best For:</Text>
                <Text style={styles.bestForText}>{thumbnail.bestFor}</Text>
              </View>
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
  thumbnailCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thumbnailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  thumbnailName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  ctrBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + Colors.opacity10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ctrText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  element: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bestForContainer: {
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 8,
  },
  bestForLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  bestForText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
