import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';
import { Search, Bookmark, FileText, Filter } from 'lucide-react-native';

interface EmptyStateProps {
  type: 'search' | 'saved' | 'drafts' | 'filter';
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'search':
        return {
          icon: <Search size={48} color={Colors.textTertiary} />,
          title: 'No results found',
          description: message || 'Try adjusting your search terms or filters',
        };
      case 'saved':
        return {
          icon: <Bookmark size={48} color={Colors.textTertiary} />,
          title: 'No saved trends yet',
          description: 'Start exploring and save trends you want to track',
        };
      case 'drafts':
        return {
          icon: <FileText size={48} color={Colors.textTertiary} />,
          title: 'No drafts yet',
          description: 'Create your first post draft to get started',
        };
      case 'filter':
        return {
          icon: <Filter size={48} color={Colors.textTertiary} />,
          title: 'No trends match this filter',
          description: 'Try selecting a different category',
        };
      default:
        return {
          icon: <Search size={48} color={Colors.textTertiary} />,
          title: 'Nothing here yet',
          description: 'Check back later',
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {config.icon}
      </View>
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 16,
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
