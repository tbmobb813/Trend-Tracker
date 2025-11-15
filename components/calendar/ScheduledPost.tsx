import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';
import {
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Image as ImageIcon,
  Video,
  FileText,
  MoreHorizontal,
  Trash2
} from 'lucide-react-native';
import { useCalendarStore } from '@/store/calendarStore';

interface ScheduledPostProps {
  post: {
    id: string;
    caption?: string;
    mediaFiles?: string[];
    platforms: string[];
    scheduledDate: string;
    scheduledTime: string;
    status: string;
    contentType: string;
  };
}

export default function ScheduledPost({ post }: ScheduledPostProps) {
  const { deleteScheduledPost } = useCalendarStore();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Instagram':
        return <Instagram size={16} color="#E1306C" />;
      case 'Twitter':
        return <Twitter size={16} color="#1DA1F2" />;
      case 'YouTube':
        return <Youtube size={16} color="#FF0000" />;
      case 'Facebook':
        return <Facebook size={16} color="#4267B2" />;
      default:
        return null;
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={16} color={Colors.primary} />;
      case 'video':
        return <Video size={16} color={Colors.primary} />;
      case 'text':
        return <FileText size={16} color={Colors.primary} />;
      default:
        return <FileText size={16} color={Colors.primary} />;
    }
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return Colors.primary;
      case 'published':
        return Colors.success;
      case 'failed':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const handleDelete = () => {
    deleteScheduledPost(post.id);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(post.status) }]} />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.contentTypeContainer}>
            {getContentTypeIcon(post.contentType)}
            <Text style={styles.contentType}>
              {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
              <Trash2 size={16} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.caption} numberOfLines={2}>
          {post.caption || 'No caption'}
        </Text>

        <View style={styles.footer}>
          <View style={styles.timeContainer}>
            <Clock size={14} color={Colors.textSecondary} />
            <Text style={styles.time}>{formatTime(post.scheduledTime)}</Text>
          </View>

          <View style={styles.platformsContainer}>
            {post.platforms.map((platform, index) => (
              <View key={index} style={styles.platformIcon}>
                {getPlatformIcon(platform)}
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(post.status) + Colors.opacity10 }]}>
          <Text style={[styles.statusText, { color: getStatusColor(post.status) }]}>
            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  contentTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contentType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  deleteButton: {
    padding: 4,
  },
  caption: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  platformsContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  platformIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
