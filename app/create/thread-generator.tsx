import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, MessageSquare, Copy } from 'lucide-react-native';

export default function ThreadGeneratorScreen() {
  const router = useRouter();

  const templates = [
    {
      id: '1',
      title: 'How-To Thread',
      format: '7-10 tweets',
      structure: [
        '1. Hook: Start with a bold claim or question',
        '2. Context: Why this matters',
        '3-7. Steps: Break down the process',
        '8. Recap: Summarize key points',
        '9. Call to action'
      ]
    },
    {
      id: '2',
      title: 'Storytelling Thread',
      format: '8-12 tweets',
      structure: [
        '1. Hook: Compelling opening',
        '2. Set the scene',
        '3-8. The journey with key moments',
        '9. Turning point',
        '10. Resolution',
        '11. Lesson learned'
      ]
    },
    {
      id: '3',
      title: 'Listicle Thread',
      format: '11+ tweets',
      structure: [
        '1. Hook with number (10 ways to...)',
        '2-11. Each point with explanation',
        '12. Bonus tip',
        '13. Summary & CTA'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Thread Generator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.intro}>
            <MessageSquare size={24} color={Colors.primary} />
            <Text style={styles.introText}>
              Proven thread structures to create engaging Twitter and Threads content
            </Text>
          </View>

          {templates.map((template) => (
            <View key={template.id} style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <View>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateFormat}>{template.format}</Text>
                </View>
              </View>

              <View style={styles.structureContainer}>
                <Text style={styles.structureTitle}>Structure:</Text>
                {template.structure.map((step, index) => (
                  <Text key={index} style={styles.structureStep}>
                    {step}
                  </Text>
                ))}
              </View>

              <TouchableOpacity style={styles.useButton}>
                <Copy size={16} color={Colors.primary} />
                <Text style={styles.useButtonText}>Use This Template</Text>
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
  templateCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  templateHeader: {
    marginBottom: 16,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  templateFormat: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  structureContainer: {
    marginBottom: 16,
  },
  structureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  structureStep: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Colors.primary + Colors.opacity10,
  },
  useButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
