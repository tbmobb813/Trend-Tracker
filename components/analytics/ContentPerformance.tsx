import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Colors from '@/constants/colors';
import { Heart, MessageCircle, Eye } from 'lucide-react-native';

interface ContentPerformanceProps {
  data: Array<{
    id: string;
    title: string;
    thumbnail: string;
    platform: string;
    date: string;
    metrics: {
      likes: number;
      comments: number;
      views: number;
    };
  }>;
}

export default function ContentPerformance({ data }: ContentPerformanceProps) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No content data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={item.id} style={styles.contentItem}>
          <View style={styles.thumbnail}>
            <View style={styles.thumbnailPlaceholder}>
              <Text style={styles.thumbnailText}>#{index + 1}</Text>
            </View>
          </View>

          <View style={styles.contentInfo}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.meta}>
              <Text style={styles.platform}>{item.platform}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            <View style={styles.metrics}>
              <View style={styles.metric}>
                <Heart size={14} color={Colors.error} fill={Colors.error} />
                <Text style={styles.metricValue}>{item.metrics.likes}</Text>
              </View>
              <View style={styles.metric}>
                <MessageCircle size={14} color={Colors.primary} />
                <Text style={styles.metricValue}>{item.metrics.comments}</Text>
              </View>
              <View style={styles.metric}>
                <Eye size={14} color={Colors.textSecondary} />
                <Text style={styles.metricValue}>{item.metrics.views}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  contentItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary + Colors.opacity10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailText: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
  },
  contentInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  platform: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dot: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginHorizontal: 6,
  },
  date: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
