import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SavedTrend } from '@/types';
import Colors from '@/constants/colors';
import { TrendingUp, Trash2 } from 'lucide-react-native';
import { useTrendStore } from '@/store/trendStore';

interface SavedTrendItemProps {
  trend: SavedTrend;
  onPress: () => void;
}

export default function SavedTrendItem({ trend, onPress }: SavedTrendItemProps) {
  const { removeSavedTrend } = useTrendStore();

  const handleDelete = () => {
    removeSavedTrend(trend.id);
  };

  const getCategoryColor = (category: string) => {
    const categoryKey = category.toLowerCase() as keyof typeof Colors;
    const value = Colors[categoryKey];
    if (Array.isArray(value)) return value[0] as string;
    if (typeof value === 'object') return (value as any).primary || Colors.primary;
    return (value as string) || Colors.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={2}>
            {trend.name}
          </Text>
          <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(trend.category) + Colors.opacity10 }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(trend.category) }]}>
              {trend.category}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.stats}>
            <TrendingUp size={14} color={Colors.trendUp} />
            <Text style={[styles.growth, { color: Colors.trendUp }]}>
              +{trend.growth}%
            </Text>
          </View>
          <Text style={styles.date}>Saved {formatDate(trend.dateAdded)}</Text>
        </View>
      </View>

      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Trash2 size={18} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  growth: {
    fontSize: 13,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
});
