import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useDraftStore } from '@/store/draftStore';
import Colors from '@/constants/colors';
import {
  ArrowLeft,
  Send,
  Save,
  Image as ImageIcon,
  Video,
  Calendar,
  Hash
} from 'lucide-react-native';

export default function ComposePostScreen() {
  const router = useRouter();
  const { draftId } = useLocalSearchParams();
  const { getDraft, addDraft, updateDraft } = useDraftStore();

  const [caption, setCaption] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);

  const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok'];

  useEffect(() => {
    if (draftId && typeof draftId === 'string') {
      const draft = getDraft(draftId);
      if (draft) {
        setCaption(draft.caption || '');
        setSelectedPlatforms(draft.platforms);
        setHashtags(draft.hashtags);
      }
    }
  }, [draftId]);

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSaveDraft = () => {
    const draftData = {
      caption,
      hashtags,
      mediaFiles: [],
      platforms: selectedPlatforms,
    };

    if (draftId && typeof draftId === 'string') {
      updateDraft(draftId, draftData);
    } else {
      addDraft(draftData);
    }

    router.back();
  };

  const handleSchedule = () => {
    handleSaveDraft();
    router.push('/create/schedule-post');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Compose Post</Text>
        <TouchableOpacity onPress={handleSaveDraft}>
          <Save size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Caption</Text>
            <TextInput
              style={styles.captionInput}
              placeholder="What's on your mind?"
              placeholderTextColor={Colors.textTertiary}
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>{caption.length} / 2200</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Add Media</Text>
            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton}>
                <ImageIcon size={24} color={Colors.primary} />
                <Text style={styles.mediaButtonText}>Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <Video size={24} color={Colors.primary} />
                <Text style={styles.mediaButtonText}>Video</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Platforms</Text>
            <View style={styles.platformsGrid}>
              {platforms.map((platform) => (
                <TouchableOpacity
                  key={platform}
                  style={[
                    styles.platformChip,
                    selectedPlatforms.includes(platform) && styles.platformChipActive
                  ]}
                  onPress={() => togglePlatform(platform)}
                >
                  <Text
                    style={[
                      styles.platformChipText,
                      selectedPlatforms.includes(platform) && styles.platformChipTextActive
                    ]}
                  >
                    {platform}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hashtags</Text>
              <TouchableOpacity>
                <Hash size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.hashtagsContainer}>
              {hashtags.length > 0 ? (
                hashtags.map((tag, index) => (
                  <View key={index} style={styles.hashtagChip}>
                    <Text style={styles.hashtagText}>{tag}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No hashtags added yet</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.scheduleButton]}
          onPress={handleSchedule}
        >
          <Calendar size={18} color={Colors.text} />
          <Text style={styles.scheduleButtonText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.publishButton]}>
          <Send size={18} color="#FFFFFF" />
          <Text style={styles.publishButtonText}>Publish Now</Text>
        </TouchableOpacity>
      </View>
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  captionInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text,
    minHeight: 150,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  characterCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mediaButtonText: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 8,
    fontWeight: '500',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  platformChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  platformChipText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  platformChipTextActive: {
    color: '#FFFFFF',
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    minHeight: 40,
    alignItems: 'center',
  },
  hashtagChip: {
    backgroundColor: Colors.primary + Colors.opacity10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  hashtagText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textTertiary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
  },
  scheduleButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scheduleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  publishButton: {
    backgroundColor: Colors.primary,
  },
  publishButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
