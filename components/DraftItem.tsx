import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DraftPost } from '@/store/draftStore';
import Colors from '@/constants/colors';
import { FileText, Trash2, Calendar } from 'lucide-react-native';
import { useDraftStore } from '@/store/draftStore';

interface DraftItemProps {
  draft: DraftPost;
  onPress: () => void;
}

export default function DraftItem({ draft, onPress }: DraftItemProps) {
  const { deleteDraft } = useDraftStore();

  const handleDelete = () => {
    deleteDraft(draft.id);
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
      <View style={styles.iconContainer}>
        <FileText size={20} color={Colors.primary} />
      </View>

      <View style={styles.content}>
        <Text style={styles.caption} numberOfLines={2}>
          {draft.caption || 'Untitled draft'}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Calendar size={12} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              Modified {formatDate(draft.lastModified)}
            </Text>
          </View>

          {draft.platforms.length > 0 && (
            <View style={styles.platformsContainer}>
              {draft.platforms.slice(0, 2).map((platform, index) => (
                <View key={index} style={styles.platformBadge}>
                  <Text style={styles.platformText}>{platform}</Text>
                </View>
              ))}
              {draft.platforms.length > 2 && (
                <Text style={styles.moreText}>+{draft.platforms.length - 2}</Text>
              )}
            </View>
          )}
        </View>

        {draft.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            <Text style={styles.hashtags} numberOfLines={1}>
              {draft.hashtags.slice(0, 3).join(' ')}
              {draft.hashtags.length > 3 ? ` +${draft.hashtags.length - 3}` : ''}
            </Text>
          </View>
        )}
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
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.primary + Colors.opacity10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  caption: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  platformsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  platformBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  platformText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  moreText: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  hashtagsContainer: {
    marginTop: 4,
  },
  hashtags: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 8,
  },
});
