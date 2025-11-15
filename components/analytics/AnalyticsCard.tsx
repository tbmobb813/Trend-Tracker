import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

export default function AnalyticsCard({ title, value, change, icon }: AnalyticsCardProps) {
  const isPositive = change >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {icon}
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>

      <View style={[
        styles.changeContainer,
        isPositive ? styles.changePositive : styles.changeNegative
      ]}>
        <Text style={[
          styles.changeText,
          isPositive ? styles.changeTextPositive : styles.changeTextNegative
        ]}>
          {isPositive ? '+' : ''}{change}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  changeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  changePositive: {
    backgroundColor: Colors.success + Colors.opacity10,
  },
  changeNegative: {
    backgroundColor: Colors.error + Colors.opacity10,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  changeTextPositive: {
    color: Colors.success,
  },
  changeTextNegative: {
    color: Colors.error,
  },
});
