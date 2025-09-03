import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrendStore } from '@/store/trendStore';
import Colors from '@/constants/colors';
import TrendCard from '@/components/TrendCard';
import SearchBar from '@/components/SearchBar';
import CategoryFilter from '@/components/CategoryFilter';
import { useRouter } from 'expo-router';
import { Trend } from '@/types';
import EmptyState from '@/components/EmptyState';

export default function SearchScreen() {
  const router = useRouter();
  const { 
    trends, 
    fetchTrends, 
    selectedCategory, 
    searchQuery, 
    isLoading 
  } = useTrendStore();

  useEffect(() => {
    if (trends.length === 0) {
      fetchTrends();
    }
  }, []);

  const filteredTrends = trends.filter(trend => {
    const matchesCategory = selectedCategory === 'All' || trend.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      trend.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trend.relatedTopics.some(topic => 
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesCategory && matchesSearch;
  });

  const navigateToTrendDetails = (trend: Trend) => {
    router.push({
      pathname: '/trend/[id]',
      params: { id: trend.id }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <SearchBar />
      <CategoryFilter />
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : filteredTrends.length > 0 ? (
        <FlatList
          data={filteredTrends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrendCard 
              trend={item} 
              onPress={() => navigateToTrendDetails(item)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState 
          type="search" 
          message={
            searchQuery 
              ? `No results found for "${searchQuery}"`
              : "No trends match your current filters"
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
