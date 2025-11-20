import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/constants/theme';

/**
 * Progressive Onboarding System
 *
 * Research-validated approach:
 * - NO upfront wizard (users hate this)
 * - Contextual tooltips when features are encountered
 * - Just-in-time education
 * - Get to "aha moment" in <60 seconds
 * - Persistent checklist (43% of users find helpful)
 */

type OnboardingStep =
  | 'first_launch'
  | 'first_tool_view'
  | 'discover_ai'
  | 'first_generation'
  | 'voice_customization'
  | 'workflow_intro';

interface OnboardingState {
  completed: OnboardingStep[];
  dismissed: OnboardingStep[];
  currentStreak: number;
  lastActiveDate: string;
}

const STORAGE_KEY = '@onboarding_state';

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>({
    completed: [],
    dismissed: [],
    currentStreak: 0,
    lastActiveDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
  };

  const saveOnboardingState = async (newState: OnboardingState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      setState(newState);
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  };

  const completeStep = (step: OnboardingStep) => {
    if (!state.completed.includes(step)) {
      const newState = {
        ...state,
        completed: [...state.completed, step],
      };
      saveOnboardingState(newState);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const dismissStep = (step: OnboardingStep) => {
    const newState = {
      ...state,
      dismissed: [...state.dismissed, step],
    };
    saveOnboardingState(newState);
  };

  const shouldShowStep = (step: OnboardingStep): boolean => {
    return !state.completed.includes(step) && !state.dismissed.includes(step);
  };

  const getProgress = (): number => {
    const totalSteps = 6; // Total onboarding steps
    return (state.completed.length / totalSteps) * 100;
  };

  return {
    state,
    completeStep,
    dismissStep,
    shouldShowStep,
    getProgress,
  };
}

interface TooltipProps {
  visible: boolean;
  message: string;
  position: 'top' | 'bottom';
  onDismiss: () => void;
  onComplete?: () => void;
  highlight?: boolean;
}

export function ContextualTooltip({
  visible,
  message,
  position,
  onDismiss,
  onComplete,
  highlight = false,
}: TooltipProps) {
  const theme = useTheme();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.9));

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.tooltipContainer,
        position === 'top' ? styles.tooltipTop : styles.tooltipBottom,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          backgroundColor: theme.colors.card,
          borderColor: highlight ? theme.colors.aiPrimary : theme.colors.border,
          ...theme.shadows.md,
        },
      ]}
    >
      {/* Pointer arrow */}
      <View
        style={[
          styles.arrow,
          position === 'top' ? styles.arrowBottom : styles.arrowTop,
          {
            borderTopColor: position === 'bottom' ? theme.colors.card : 'transparent',
            borderBottomColor: position === 'top' ? theme.colors.card : 'transparent',
          },
        ]}
      />

      <View style={styles.tooltipContent}>
        <Text style={[styles.tooltipText, { color: theme.colors.textPrimary }]}>
          💡 {message}
        </Text>

        <View style={styles.tooltipActions}>
          <TouchableOpacity
            onPress={onDismiss}
            style={styles.tooltipButton}
          >
            <Text style={[styles.tooltipButtonText, { color: theme.colors.textSecondary }]}>
              Got it
            </Text>
          </TouchableOpacity>

          {onComplete && (
            <TouchableOpacity
              onPress={() => {
                onComplete();
                onDismiss();
              }}
              style={[styles.tooltipButton, { backgroundColor: theme.colors.aiPrimary }]}
            >
              <Text style={[styles.tooltipButtonText, { color: '#FFFFFF' }]}>
                Try it
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

interface OnboardingChecklistProps {
  visible: boolean;
  onClose: () => void;
}

export function OnboardingChecklist({ visible, onClose }: OnboardingChecklistProps) {
  const theme = useTheme();
  const { state, getProgress } = useOnboarding();

  const checklist = [
    {
      step: 'first_generation' as OnboardingStep,
      title: 'Generate your first content',
      description: 'Try the AI Quick Generate',
      icon: '✨',
    },
    {
      step: 'first_tool_view' as OnboardingStep,
      title: 'Explore a content tool',
      description: 'Browse TikTok Hooks or Captions',
      icon: '🎯',
    },
    {
      step: 'discover_ai' as OnboardingStep,
      title: 'Discover AI features',
      description: 'See how AI can help you create',
      icon: '🤖',
    },
    {
      step: 'voice_customization' as OnboardingStep,
      title: 'Customize your voice',
      description: 'Set your brand tone (optional)',
      icon: '🎨',
    },
    {
      step: 'workflow_intro' as OnboardingStep,
      title: 'Try a workflow',
      description: 'Generate multiple pieces at once',
      icon: '🔗',
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.checklistContainer, { backgroundColor: theme.colors.card }]}>
          {/* Header */}
          <View style={styles.checklistHeader}>
            <View>
              <Text style={[styles.checklistTitle, { color: theme.colors.textPrimary }]}>
                Getting Started
              </Text>
              <Text style={[styles.checklistSubtitle, { color: theme.colors.textSecondary }]}>
                {Math.round(getProgress())}% complete
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.closeButton, { color: theme.colors.textTertiary }]}>
                ×
              </Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={[styles.progressBar, { backgroundColor: theme.colors.backgroundTertiary }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${getProgress()}%`,
                  backgroundColor: theme.colors.aiPrimary,
                },
              ]}
            />
          </View>

          {/* Checklist items */}
          <View style={styles.checklistItems}>
            {checklist.map((item) => {
              const isCompleted = state.completed.includes(item.step);
              return (
                <View
                  key={item.step}
                  style={[
                    styles.checklistItem,
                    {
                      backgroundColor: isCompleted
                        ? theme.colors.aiBackground
                        : theme.colors.backgroundSecondary,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View style={styles.checklistItemContent}>
                    <Text style={styles.checklistItemIcon}>{item.icon}</Text>
                    <View style={styles.checklistItemText}>
                      <Text
                        style={[
                          styles.checklistItemTitle,
                          {
                            color: theme.colors.textPrimary,
                            textDecorationLine: isCompleted ? 'line-through' : 'none',
                          },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={[styles.checklistItemDesc, { color: theme.colors.textSecondary }]}>
                        {item.description}
                      </Text>
                    </View>
                  </View>
                  {isCompleted && (
                    <View
                      style={[
                        styles.checklistItemCheck,
                        { backgroundColor: theme.colors.success },
                      ]}
                    >
                      <Text style={styles.checkmark}>✓</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Tooltip
  tooltipContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    zIndex: 1000,
  },
  tooltipTop: {
    top: 80,
  },
  tooltipBottom: {
    bottom: 100,
  },
  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
  arrowTop: {
    top: -15,
  },
  arrowBottom: {
    bottom: -15,
  },
  tooltipContent: {
    gap: 12,
  },
  tooltipText: {
    fontSize: 15,
    lineHeight: 22,
  },
  tooltipActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  tooltipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tooltipButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Checklist Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  checklistContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  checklistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  checklistTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  checklistSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    fontSize: 36,
    fontWeight: '300',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  checklistItems: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  checklistItemIcon: {
    fontSize: 24,
  },
  checklistItemText: {
    flex: 1,
  },
  checklistItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  checklistItemDesc: {
    fontSize: 13,
  },
  checklistItemCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
