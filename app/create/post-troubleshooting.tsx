import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react-native';

export default function PostTroubleshootingScreen() {
  const router = useRouter();

  const problems = [
    {
      id: '1',
      problem: 'Low Engagement Rate',
      solutions: [
        'Post during peak hours (9-11 AM, 7-9 PM)',
        'Ask questions to encourage comments',
        'Use trending hashtags relevant to your niche',
        'Create carousel posts for higher engagement',
        'Respond to all comments within first hour'
      ]
    },
    {
      id: '2',
      problem: 'Content Not Reaching New Audience',
      solutions: [
        'Collaborate with creators in your niche',
        'Use location tags to reach local audience',
        'Create shareable content (infographics, tips)',
        'Engage with other accounts before posting',
        'Use 3-5 niche-specific hashtags'
      ]
    },
    {
      id: '3',
      problem: 'Low Video Views',
      solutions: [
        'Hook viewers in first 3 seconds',
        'Add captions for sound-off viewing',
        'Keep videos under 60 seconds',
        'Use trending audio when relevant',
        'Post when your audience is most active'
      ]
    },
    {
      id: '4',
      problem: 'Losing Followers',
      solutions: [
        'Maintain consistent posting schedule',
        'Share valuable, educational content',
        'Avoid excessive promotional posts',
        'Engage authentically with your community',
        'Stay true to your niche'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Post Troubleshooting</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <AlertCircle size={24} color={Colors.warning} />
            <Text style={styles.introText}>
              Diagnose and fix common content performance issues
            </Text>
          </View>

          {problems.map((item) => (
            <View key={item.id} style={styles.problemCard}>
              <View style={styles.problemHeader}>
                <AlertCircle size={20} color={Colors.error} />
                <Text style={styles.problemText}>{item.problem}</Text>
              </View>

              <Text style={styles.solutionsTitle}>Solutions:</Text>
              {item.solutions.map((solution, index) => (
                <View key={index} style={styles.solutionItem}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={styles.solutionText}>{solution}</Text>
                </View>
              ))}
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
    backgroundColor: Colors.warning + Colors.opacity10,
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
  problemCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  problemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  problemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  solutionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  solutionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  solutionText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
