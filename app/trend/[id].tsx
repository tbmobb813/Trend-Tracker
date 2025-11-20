import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTrendStore } from '@/store/trendStore';
import Colors from '@/constants/colors';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Bookmark,
  Share2,
  BarChart3,
  Sparkles
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function TrendDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { trends, saveTrend, removeSavedTrend, isTrendSaved } = useTrendStore();

  const trend = trends.find(t => t.id === id);
  const isSaved = trend ? isTrendSaved(trend.id) : false;

  useEffect(() => {
    if (!trend) {
      // If trend not found, go back
      router.back();
    }
  }, [trend]);

  if (!trend) {
    return null;
  }

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedTrend(trend.id);
    } else {
      saveTrend(trend);
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryKey = category.toLowerCase() as keyof typeof Colors;
    const value = Colors[categoryKey];
    if (Array.isArray(value)) return value[0] as string;
    if (typeof value === 'object') return (value as any).primary || Colors.primary;
    return (value as string) || Colors.primary;
  };

  const categoryColor = getCategoryColor(trend.category);

  // Calculate max value for history chart
  const maxHistory = Math.max(...trend.history);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleSaveToggle} style={styles.iconButton}>
            <Bookmark
              size={22}
              color={isSaved ? Colors.primary : Colors.text}
              fill={isSaved ? Colors.primary : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Share2 size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{trend.name}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + Colors.opacity10 }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {trend.category}
              </Text>
            </View>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                {trend.growth > 0 ? (
                  <TrendingUp size={24} color={Colors.trendUp} />
                ) : (
                  <TrendingDown size={24} color={Colors.trendDown} />
                )}
              </View>
              <Text style={styles.statValue}>
                {trend.growth > 0 ? '+' : ''}{trend.growth}%
              </Text>
              <Text style={styles.statLabel}>Growth Rate</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Sparkles size={24} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>
                {(trend.mentions / 1000).toFixed(1)}K
              </Text>
              <Text style={styles.statLabel}>Mentions</Text>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <BarChart3 size={24} color={Colors.chart.blue} />
              </View>
              <Text style={styles.statValue}>
                {trend.platforms.length}
              </Text>
              <Text style={styles.statLabel}>Platforms</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About This Trend</Text>
            <Text style={styles.description}>{trend.description}</Text>
          </View>

          {/* Growth History Chart */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Growth History</Text>
            <View style={styles.chartContainer}>
              <View style={styles.chart}>
                {trend.history.map((value, index) => {
                  const barHeight = (value / maxHistory) * 120;
                  return (
                    <View key={index} style={styles.chartBarContainer}>
                      <View
                        style={[
                          styles.chartBar,
                          {
                            height: barHeight,
                            backgroundColor: categoryColor
                          }
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
              <View style={styles.chartLabels}>
                <Text style={styles.chartLabel}>7d ago</Text>
                <Text style={styles.chartLabel}>Today</Text>
              </View>
            </View>
          </View>

          {/* Platforms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Platforms</Text>
            <View style={styles.platformsContainer}>
              {trend.platforms.map((platform, index) => (
                <View key={index} style={styles.platformBadge}>
                  <Text style={styles.platformText}>{platform}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Related Topics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Related Topics</Text>
            <View style={styles.topicsContainer}>
              {trend.relatedTopics.map((topic, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.topicBadge, { borderColor: categoryColor }]}
                >
                  <Text style={[styles.topicText, { color: categoryColor }]}>
                    {topic}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Insights Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: categoryColor + Colors.opacity10 }]}>
                <Sparkles size={20} color={categoryColor} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Peak Engagement Time</Text>
                <Text style={styles.insightDescription}>
                  This trend sees highest engagement during weekday mornings (9-11 AM)
                </Text>
              </View>
            </View>

            <View style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: Colors.chart.blue + Colors.opacity10 }]}>
                <TrendingUp size={20} color={Colors.chart.blue} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Audience Demographics</Text>
                <Text style={styles.insightDescription}>
                  Most popular among 25-34 age group, with 60% engagement from mobile users
                </Text>
              </View>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Create Content About This Trend</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />
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
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 38,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  chartContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 12,
  },
  chartBarContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '80%',
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chartLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  platformText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  topicText: {
    fontSize: 13,
    fontWeight: '600',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    height: 40,
  },
});
