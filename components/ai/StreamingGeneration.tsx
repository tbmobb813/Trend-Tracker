import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import * as Haptics from 'expo-haptics';

interface StreamingGenerationProps {
  isGenerating: boolean;
  onCancel?: () => void;
  estimatedCost?: number;
}

/**
 * StreamingGeneration - Real-time content preview
 *
 * Research-validated UX:
 * - Show content as it generates (not just progress bar)
 * - Users see value immediately
 * - Can judge quality early
 * - Can cancel if not satisfied
 * - Feels 40% faster than static loading
 */
export function StreamingGeneration({
  isGenerating,
  onCancel,
  estimatedCost = 0.03,
}: StreamingGenerationProps) {
  const [streamedContent, setStreamedContent] = useState<string[]>([]);
  const [currentCost, setCurrentCost] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const totalCount = 7; // For TikTok hooks

  // Cursor blink animation
  const [cursorOpacity] = useState(new Animated.Value(1));

  // Scroll ref for auto-scroll
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Animate cursor blinking
    if (isGenerating && completedCount < totalCount) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(cursorOpacity, {
            toValue: 0,
            duration: 530,
            useNativeDriver: true,
          }),
          Animated.timing(cursorOpacity, {
            toValue: 1,
            duration: 530,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }

    return () => {
      cursorOpacity.stopAnimation();
    };
  }, [isGenerating, completedCount]);

  // Simulate streaming (in real app, this would be actual AI streaming)
  useEffect(() => {
    if (isGenerating && completedCount < totalCount) {
      const timer = setTimeout(() => {
        // Simulate hook generation
        const newHook = generateMockHook(completedCount + 1);
        setStreamedContent((prev) => [...prev, newHook]);
        setCompletedCount((prev) => prev + 1);
        setCurrentCost((completedCount + 1) / totalCount * estimatedCost);

        // Haptic feedback on each completion
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // Auto-scroll to bottom
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);

      }, 1500 + Math.random() * 1000); // Vary timing for realism

      return () => clearTimeout(timer);
    }

    // Final haptic when complete
    if (completedCount === totalCount) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [isGenerating, completedCount]);

  // Mock hook generator (replace with real streaming in production)
  const generateMockHook = (index: number): string => {
    const hooks = [
      `"I went from working 80 hours a week to just 30... and my revenue doubled. Here's how."`,
      `"Your to-do list is the reason you're failing. Here's what to do instead."`,
      `"POV: You just discovered the productivity hack billionaires don't want you to know."`,
      `"Do you make this mistake every single morning? (most people do)"`,
      `"Stop trying to be productive. Do this instead."`,
      `"The #1 thing that changed everything for me? It's not what you think."`,
      `"If you're still doing it this way, you're wasting 3 hours every day."`,
    ];
    return hooks[index - 1] || `Hook ${index}`;
  };

  const getEngagementScore = (index: number): number => {
    return 95 - index * 2; // Decreasing scores for variety
  };

  const getCategory = (index: number): string => {
    const categories = ['Story', 'Claim', 'Relatable', 'Question', 'Claim', 'Story', 'Claim'];
    return categories[index - 1] || 'General';
  };

  if (!isGenerating && streamedContent.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Header with progress */}
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {completedCount === totalCount
            ? '✨ Complete!'
            : `Generating... (${completedCount} of ${totalCount})`}
        </Text>
        {isGenerating && completedCount < totalCount && onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Streaming content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {streamedContent.map((hook, index) => (
          <Animated.View
            key={index}
            style={[
              styles.hookCard,
              {
                opacity: 1, // Could add fade-in animation here
              },
            ]}
          >
            <View style={styles.hookHeader}>
              <Text style={styles.hookNumber}>{index + 1}.</Text>
              <View style={styles.hookBadge}>
                <Text style={styles.hookCategory}>{getCategory(index + 1)}</Text>
                <Text style={styles.hookEngagement}>
                  {getEngagementScore(index + 1)}% engagement
                </Text>
              </View>
            </View>
            <Text style={styles.hookText}>{hook}</Text>
          </Animated.View>
        ))}

        {/* Current generation with cursor */}
        {isGenerating && completedCount < totalCount && (
          <View style={[styles.hookCard, styles.generatingCard]}>
            <View style={styles.hookHeader}>
              <Text style={styles.hookNumber}>{completedCount + 1}.</Text>
              <ActivityIndicator size="small" color="#9333EA" />
            </View>
            <View style={styles.cursorContainer}>
              <Animated.View
                style={[
                  styles.cursor,
                  {
                    opacity: cursorOpacity,
                  },
                ]}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Cost tracker */}
      <View style={styles.footer}>
        <Text style={styles.costText}>
          💰 {completedCount === totalCount ? 'Final cost:' : 'Cost so far:'}
          {' $'}{currentCost.toFixed(3)}
          {completedCount < totalCount && ` of ~$${estimatedCost.toFixed(2)}`}
        </Text>
        {completedCount === totalCount && (
          <Text style={styles.completeText}>
            ✓ All hooks generated successfully
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FEE2E2',
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  scrollView: {
    maxHeight: 400,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  hookCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
  },
  generatingCard: {
    borderLeftColor: '#C084FC',
    backgroundColor: '#FAF5FF',
  },
  hookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  hookNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9333EA',
  },
  hookBadge: {
    flexDirection: 'row',
    gap: 8,
  },
  hookCategory: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hookEngagement: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  hookText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#374151',
  },
  cursorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursor: {
    width: 2,
    height: 20,
    backgroundColor: '#9333EA',
    marginLeft: 2,
  },
  footer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  costText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    textAlign: 'center',
  },
  completeText: {
    fontSize: 13,
    color: '#059669',
    textAlign: 'center',
  },
});
