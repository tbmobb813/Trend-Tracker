import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrendStore } from '@/store/trendStore';
import Colors from '@/constants/colors';
import TrendCard from '@/components/TrendCard';
import CategoryFilter from '@/components/CategoryFilter';
import InsightCard from '@/components/InsightCard';
import { insightsMock } from '@/constants/mockData';
import { useRouter } from 'expo-router';
import { Trend } from '@/types';
import EmptyState from '@/components/EmptyState';

export default function DiscoverScreen() {
  const router = useRouter();
  const { trends, fetchTrends, selectedCategory, isLoading } = useTrendStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchTrends();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTrends();
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const filteredTrends = trends.filter(trend => 
    selectedCategory === 'All' || trend.category === selectedCategory
  );

  const navigateToTrendDetails = (trend: Trend) => {
    router.push({
      pathname: '/trend/[id]',
      params: { id: trend.id }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Discover Trends</Text>
          <Text style={styles.subtitle}>
            Explore what's trending across different industries
          </Text>
        </View>

        <CategoryFilter />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Insights</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.insightsContainer}
          >
            {insightsMock.map(insight => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' 
              ? 'Trending Topics' 
              : `Trending in ${selectedCategory}`}
          </Text>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : filteredTrends.length > 0 ? (
            <View style={styles.trendsContainer}>
              {filteredTrends.map(trend => (
                <TrendCard 
                  key={trend.id} 
                  trend={trend} 
                  onPress={() => navigateToTrendDetails(trend)}
                />
              ))}
            </View>
          ) : (
            <EmptyState type="filter" />
          )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  insightsContainer: {
    paddingLeft: 0,
    paddingRight: 16,
    paddingBottom: 8,
  },
  trendsContainer: {
    marginBottom: 24,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});
