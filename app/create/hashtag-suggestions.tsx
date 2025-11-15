import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { ArrowLeft, Hash, TrendingUp, Copy, Search } from 'lucide-react-native';

export default function HashtagSuggestionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const hashtagGroups = [
    {
      category: 'Content Creation',
      trending: true,
      hashtags: ['#contentcreator', '#contentmarketing', '#digitalcontent', '#contentcreation', '#createcontent']
    },
    {
      category: 'Small Business',
      trending: true,
      hashtags: ['#smallbusiness', '#entrepreneur', '#smallbiz', '#shopsmall', '#supportsmallbusiness']
    },
    {
      category: 'Marketing',
      trending: false,
      hashtags: ['#marketing', '#digitalmarketing', '#socialmediamarketing', '#marketingstrategy', '#marketingtips']
    },
    {
      category: 'Lifestyle',
      trending: true,
      hashtags: ['#lifestyle', '#lifestyleblogger', '#lifestylechange', '#healthylifestyle', '#luxurylifestyle']
    }
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Hashtag Suggestions</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.searchContainer}>
            <Search size={20} color={Colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search hashtags..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {hashtagGroups.map((group, index) => (
            <View key={index} style={styles.groupCard}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupCategory}>{group.category}</Text>
                {group.trending && (
                  <View style={styles.trendingBadge}>
                    <TrendingUp size={14} color={Colors.success} />
                    <Text style={styles.trendingText}>Trending</Text>
                  </View>
                )}
              </View>

              <View style={styles.hashtagsContainer}>
                {group.hashtags.map((tag, tagIndex) => (
                  <TouchableOpacity key={tagIndex} style={styles.hashtagBadge}>
                    <Hash size={12} color={Colors.primary} />
                    <Text style={styles.hashtagText}>{tag.replace('#', '')}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.copyAllButton}>
                <Copy size={14} color={Colors.primary} />
                <Text style={styles.copyAllText}>Copy All</Text>
              </TouchableOpacity>
            </View>
          ))}
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  content: {
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    paddingVertical: 12,
    paddingLeft: 8,
  },
  groupCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  trendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + Colors.opacity10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  trendingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.success,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  hashtagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  hashtagText: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '500',
  },
  copyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.primary + Colors.opacity10,
  },
  copyAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
});
