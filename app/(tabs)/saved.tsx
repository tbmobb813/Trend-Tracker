import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTrendStore } from '@/store/trendStore';
import { useDraftStore } from '@/store/draftStore';
import Colors from '@/constants/colors';
import SavedTrendItem from '@/components/SavedTrendItem';
import DraftItem from '@/components/DraftItem';
import { useRouter } from 'expo-router';
import EmptyState from '@/components/EmptyState';
import { Bookmark, FileText } from 'lucide-react-native';

type Tab = 'trends' | 'drafts';

export default function SavedScreen() {
  const router = useRouter();
  const { savedTrends } = useTrendStore();
  const { drafts } = useDraftStore();
  const [activeTab, setActiveTab] = useState<Tab>('trends');

  const navigateToTrendDetails = (trendId: string) => {
    router.push({
      pathname: '/trend/[id]',
      params: { id: trendId }
    });
  };

  const navigateToDraft = (draftId: string) => {
    router.push({
      pathname: '/create/compose-post',
      params: { draftId }
    });
  };

  const renderContent = () => {
    if (activeTab === 'trends') {
      return savedTrends.length > 0 ? (
        <FlatList
          data={savedTrends}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <SavedTrendItem 
              trend={item} 
              onPress={() => navigateToTrendDetails(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState type="saved" />
      );
    } else {
      return drafts.length > 0 ? (
        <FlatList
          data={drafts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DraftItem 
              draft={item}
              onPress={() => navigateToDraft(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState type="drafts" />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'trends' && styles.activeTab
          ]}
          onPress={() => setActiveTab('trends')}
        >
          <Bookmark 
            size={18} 
            color={activeTab === 'trends' ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'trends' && styles.activeTabText
          ]}>
            Saved Trends
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab,
            activeTab === 'drafts' && styles.activeTab
          ]}
          onPress={() => setActiveTab('drafts')}
        >
          <FileText 
            size={18} 
            color={activeTab === 'drafts' ? Colors.primary : Colors.textSecondary} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'drafts' && styles.activeTabText
          ]}>
            Drafts
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: Colors.primary + '10',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
  },
  listContainer: {
    padding: 16,
  },
});
