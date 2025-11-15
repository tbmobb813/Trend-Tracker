import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface PlatformMetricsProps {
  platform: string;
  data: {
    followers: number;
    engagement: number;
    change: number;
  };
  icon: React.ReactNode;
  color: string;
}

export default function PlatformMetrics({ platform, data, icon, color }: PlatformMetricsProps) {
  const isPositive = data.change >= 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: color + Colors.opacity10 }]}>
          {icon}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.platform}>{platform}</Text>
          <View style={styles.changeContainer}>
            {isPositive ? (
              <TrendingUp size={12} color={Colors.success} />
            ) : (
              <TrendingDown size={12} color={Colors.error} />
            )}
            <Text style={[
              styles.changeText,
              { color: isPositive ? Colors.success : Colors.error }
            ]}>
              {isPositive ? '+' : ''}{data.change}%
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Followers</Text>
          <Text style={styles.statValue}>{data.followers.toLocaleString()}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Engagement</Text>
          <Text style={styles.statValue}>{data.engagement}%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(data.engagement * 10, 100)}%`,
                backgroundColor: color
              }
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  platform: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
});
