import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Insight } from '@/types';
import Colors from '@/constants/colors';
import { Lightbulb } from 'lucide-react-native';

interface InsightCardProps {
  insight: Insight;
}

export default function InsightCard({ insight }: InsightCardProps) {
  const getCategoryColor = (category: string) => {
    const categoryKey = category.toLowerCase() as keyof typeof Colors;
    return Colors[categoryKey] || Colors.primary;
  };

  const categoryColor = getCategoryColor(insight.category);

  return (
    <View style={[styles.card, { borderLeftColor: categoryColor }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: categoryColor + Colors.opacity10 }]}>
          <Lightbulb size={18} color={categoryColor} />
        </View>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor + Colors.opacity10 }]}>
          <Text style={[styles.categoryText, { color: categoryColor }]}>
            {insight.category}
          </Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {insight.title}
      </Text>
      <Text style={styles.description} numberOfLines={3}>
        {insight.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
