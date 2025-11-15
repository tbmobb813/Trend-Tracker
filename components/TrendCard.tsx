import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trend } from '@/types';
import Colors from '@/constants/colors';
import { TrendingUp, TrendingDown, Bookmark } from 'lucide-react-native';
import { useTrendStore } from '@/store/trendStore';

interface TrendCardProps {
  trend: Trend;
  onPress: () => void;
}

export default function TrendCard({ trend, onPress }: TrendCardProps) {
  const { saveTrend, removeSavedTrend, isTrendSaved } = useTrendStore();
  const isSaved = isTrendSaved(trend.id);

  const handleSaveToggle = () => {
    if (isSaved) {
      removeSavedTrend(trend.id);
    } else {
      saveTrend(trend);
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryKey = category.toLowerCase() as keyof typeof Colors;
    return Colors[categoryKey] || Colors.primary;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name} numberOfLines={2}>{trend.name}</Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(trend.category) + Colors.opacity10 }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(trend.category) }]}>
              {trend.category}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleSaveToggle} style={styles.bookmarkButton}>
          <Bookmark
            size={20}
            color={isSaved ? Colors.primary : Colors.textSecondary}
            fill={isSaved ? Colors.primary : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {trend.description}
      </Text>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          {trend.growth > 0 ? (
            <TrendingUp size={16} color={Colors.trendUp} />
          ) : (
            <TrendingDown size={16} color={Colors.trendDown} />
          )}
          <Text style={[styles.growth, { color: trend.growth > 0 ? Colors.trendUp : Colors.trendDown }]}>
            {trend.growth > 0 ? '+' : ''}{trend.growth}%
          </Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.mentions}>
            {trend.mentions.toLocaleString()} mentions
          </Text>
        </View>
      </View>

      <View style={styles.platformsContainer}>
        {trend.platforms.slice(0, 3).map((platform, index) => (
          <View key={index} style={styles.platformBadge}>
            <Text style={styles.platformText}>{platform}</Text>
          </View>
        ))}
        {trend.platforms.length > 3 && (
          <View style={styles.platformBadge}>
            <Text style={styles.platformText}>+{trend.platforms.length - 3}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookmarkButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  growth: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  mentions: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  platformsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  platformBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  platformText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
