import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { useAIStore } from '@/store/aiStore';
import { PROMPT_TEMPLATES } from '@/services/promptTemplates';
import { interpolatePrompt } from '@/services/promptTemplates';

interface AIQuickGenerateProps {
  onGenerate?: (result: string) => void;
}

/**
 * AIQuickGenerate - Instant demo AI generation
 *
 * Research-validated UX:
 * - Pre-filled example (not empty form)
 * - One-tap generation (no configuration)
 * - Smart defaults (works immediately)
 * - Value first, customize later
 */
export function AIQuickGenerate({ onGenerate }: AIQuickGenerateProps) {
  const { isConfigured, generateContent } = useAIStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('productivity tips for entrepreneurs');
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Quick prompt suggestions (personalized later)
  const quickPrompts = [
    'productivity tips for entrepreneurs',
    'Instagram carousel about AI tools',
    'viral TikTok hook about fitness',
    'Twitter thread about content creation',
  ];

  // Animation for expansion
  const [expandAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.spring(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isExpanded]);

  const handleInstantDemo = async () => {
    // FIRST-TIME USERS: Instant demo with no configuration
    // This is the key UX improvement from research

    setIsGenerating(true);
    setShowResult(false);

    try {
      // Use TikTok Hooks template for demo (most impressive)
      const template = PROMPT_TEMPLATES.TIKTOK_HOOKS;

      // Generate with smart defaults (no user input required)
      const userPrompt = interpolatePrompt(template.userPromptTemplate, {
        topic: prompt,
        audience: 'entrepreneurs and creators',
        contentType: 'tutorial',
        keyPoints: ['save time', 'boost productivity', 'work smarter'],
        emotion: 'curiosity',
      });

      const generatedText = await generateContent(
        'tiktok_hooks_demo',
        template.systemPrompt,
        userPrompt,
        { saveToHistory: true }
      );

      setResult(generatedText);
      setShowResult(true);
      onGenerate?.(generatedText);

    } catch (error) {
      console.error('Demo generation failed:', error);
      // Handle error gracefully
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomize = () => {
    setIsExpanded(true);
  };

  if (!isConfigured) {
    // Not configured: Show setup prompt
    return (
      <View style={styles.container}>
        <View style={styles.notConfigured}>
          <Text style={styles.title}>✨ Unlock AI-Powered Content</Text>
          <Text style={styles.subtitle}>
            Generate unlimited content in seconds
          </Text>
          <TouchableOpacity
            style={styles.setupButton}
            onPress={() => {
              // Navigate to AI setup
              // In real app: navigation.navigate('AIConfig')
            }}
          >
            <Text style={styles.setupButtonText}>Set Up AI (2 min)</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            💡 Free to try • No credit card needed
          </Text>
        </View>
      </View>
    );
  }

  if (showResult && result) {
    // Show generated result
    return (
      <View style={styles.container}>
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>✨ Generated for you!</Text>

          {/* Preview of generated content */}
          <View style={styles.resultPreview}>
            <Text style={styles.resultText} numberOfLines={3}>
              {result.substring(0, 150)}...
            </Text>
          </View>

          <View style={styles.resultActions}>
            <TouchableOpacity
              style={styles.resultButton}
              onPress={() => {
                // Show full result
                // In real app: navigate to full view
              }}
            >
              <Text style={styles.resultButtonText}>View All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.resultButton, styles.resultButtonPrimary]}
              onPress={() => {
                setShowResult(false);
                setIsExpanded(true);
              }}
            >
              <Text style={[styles.resultButtonText, styles.resultButtonTextPrimary]}>
                Create More
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setShowResult(false)}>
            <Text style={styles.hint}>💡 Want these for YOUR topic? Tap "Create More"</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (isExpanded) {
    // Expanded: Show customization options
    return (
      <View style={styles.container}>
        <View style={styles.expanded}>
          <View style={styles.header}>
            <Text style={styles.title}>✨ AI Quick Generate</Text>
            <TouchableOpacity onPress={() => setIsExpanded(false)}>
              <Text style={styles.closeButton}>×</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>What do you want to create?</Text>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="e.g., productivity tips for entrepreneurs"
            placeholderTextColor="#9CA3AF"
            multiline
          />

          {/* Quick prompt suggestions */}
          <Text style={styles.quickPromptsLabel}>💡 Quick ideas:</Text>
          <View style={styles.quickPrompts}>
            {quickPrompts.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickPrompt}
                onPress={() => setPrompt(suggestion)}
              >
                <Text style={styles.quickPromptText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={handleInstantDemo}
            disabled={isGenerating || !prompt.trim()}
          >
            {isGenerating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.generateButtonText}>
                ✨ Generate Now • ~$0.03
              </Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            💡 Uses "Casual & Friendly" voice by default
          </Text>
        </View>
      </View>
    );
  }

  // Collapsed: Show prominent widget with pre-filled example
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.collapsed}
        onPress={handleInstantDemo}
        activeOpacity={0.8}
      >
        <View style={styles.collapsedContent}>
          <Text style={styles.collapsedTitle}>✨ AI Quick Generate</Text>

          {/* Pre-filled example (key UX improvement) */}
          <View style={styles.examplePrompt}>
            <Text style={styles.exampleText}>"{prompt}"</Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                handleCustomize();
              }}
            >
              <Text style={styles.editButton}>✎</Text>
            </TouchableOpacity>
          </View>

          {isGenerating ? (
            <View style={styles.generatingState}>
              <ActivityIndicator color="#9333EA" size="small" />
              <Text style={styles.generatingText}>Generating...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.cta}>Tap to generate • Free trial</Text>
              <Text style={styles.benefit}>
                💡 No setup needed • Get 7 viral hooks in 10 seconds
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>

      {/* Popular suggestions carousel */}
      <View style={styles.suggestions}>
        <Text style={styles.suggestionsLabel}>Popular:</Text>
        <View style={styles.suggestionsList}>
          {quickPrompts.slice(1, 3).map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestion}
              onPress={() => {
                setPrompt(suggestion);
                handleInstantDemo();
              }}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
  },

  // Collapsed state (default)
  collapsed: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  collapsedContent: {
    gap: 12,
  },
  collapsedTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  examplePrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  exampleText: {
    flex: 1,
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  editButton: {
    fontSize: 20,
    color: '#9333EA',
    paddingLeft: 8,
  },
  cta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9333EA',
    textAlign: 'center',
  },
  benefit: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  generatingState: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  generatingText: {
    fontSize: 16,
    color: '#9333EA',
    fontWeight: '600',
  },

  // Suggestions
  suggestions: {
    marginTop: 12,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  suggestionsList: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  suggestion: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  suggestionText: {
    fontSize: 13,
    color: '#4B5563',
  },

  // Expanded state
  expanded: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    fontSize: 32,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 60,
  },
  quickPromptsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  quickPrompts: {
    gap: 8,
  },
  quickPrompt: {
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickPromptText: {
    fontSize: 14,
    color: '#4B5563',
  },
  generateButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  generateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Result state
  resultContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#9333EA',
    gap: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#9333EA',
    textAlign: 'center',
  },
  resultPreview: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#9333EA',
  },
  resultText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 12,
  },
  resultButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  resultButtonPrimary: {
    backgroundColor: '#9333EA',
    borderColor: '#9333EA',
  },
  resultButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  resultButtonTextPrimary: {
    color: '#FFFFFF',
  },

  // Not configured state
  notConfigured: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  setupButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  setupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
