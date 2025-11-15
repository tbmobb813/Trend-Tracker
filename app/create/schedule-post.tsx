import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCalendarStore } from '@/store/calendarStore';
import Colors from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ArrowLeft, Calendar, Clock, Check } from 'lucide-react-native';

export default function SchedulePostScreen() {
  const router = useRouter();
  const { addScheduledPost } = useCalendarStore();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram']);

  const platforms = ['Instagram', 'Twitter', 'Facebook', 'LinkedIn', 'TikTok'];

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleSchedule = () => {
    const scheduledDateTime = new Date(selectedDate);
    scheduledDateTime.setHours(selectedTime.getHours());
    scheduledDateTime.setMinutes(selectedTime.getMinutes());

    const post = {
      id: Date.now().toString(),
      caption: 'Your post content here',
      mediaFiles: [],
      platforms: selectedPlatforms,
      scheduledDate: selectedDate.toISOString().split('T')[0],
      scheduledTime: scheduledDateTime.toISOString(),
      status: 'scheduled',
      contentType: 'text',
    };

    addScheduledPost(post);
    router.push('/create/post-success');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Schedule Post</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <TouchableOpacity
              style={styles.dateTimeCard}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={24} color={Colors.primary} />
              <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (date) setSelectedDate(date);
                }}
                minimumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <TouchableOpacity
              style={styles.dateTimeCard}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={24} color={Colors.primary} />
              <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowTimePicker(Platform.OS === 'ios');
                  if (date) setSelectedTime(date);
                }}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Publishing To</Text>
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
                  {selectedPlatforms.includes(platform) && (
                    <Check size={16} color="#FFFFFF" />
                  )}
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

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{formatTime(selectedTime)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platforms:</Text>
              <Text style={styles.summaryValue}>
                {selectedPlatforms.join(', ')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleSchedule}
          disabled={selectedPlatforms.length === 0}
        >
          <Text style={styles.scheduleButtonText}>Schedule Post</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  dateTimeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateTimeText: {
    fontSize: 15,
    color: Colors.text,
    fontWeight: '500',
  },
  platformsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  platformChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  scheduleButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
