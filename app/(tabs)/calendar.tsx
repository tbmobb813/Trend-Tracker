import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Image as ImageIcon,
  Video,
  FileText,
  MoreHorizontal
} from 'lucide-react-native';
import { useCalendarStore } from '@/store/calendarStore';
import CalendarDay from '@/components/calendar/CalendarDay';
import ScheduledPost from '@/components/calendar/ScheduledPost';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const router = useRouter();
  const { scheduledPosts, currentMonth, setCurrentMonth } = useCalendarStore();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
        return <ImageIcon size={16} color={Colors.text} />;
      case 'video':
        return <Video size={16} color={Colors.text} />;
      case 'text':
        return <FileText size={16} color={Colors.text} />;
      default:
        return null;
    }
  };

  const navigateToPreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    setCurrentMonth(date.toISOString());
  };

  const navigateToNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    setCurrentMonth(date.toISOString());
  };

  const generateCalendarDays = () => {
    const date = new Date(currentMonth);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();
    
    // Calculate days from previous month to show
    const daysFromPrevMonth = firstDayOfWeek;
    
    // Calculate total days to show (previous month days + current month days)
    const totalDays = daysFromPrevMonth + lastDay.getDate();
    
    // Calculate rows needed (each row has 7 days)
    const rows = Math.ceil(totalDays / 7);
    
    // Generate calendar days
    const days = [];
    let dayCounter = 1 - daysFromPrevMonth;
    
    for (let i = 0; i < rows * 7; i++) {
      const currentDate = new Date(year, month, dayCounter);
      const isCurrentMonth = currentDate.getMonth() === month;
      const dateString = currentDate.toISOString().split('T')[0];
      const isSelected = dateString === selectedDate;
      const postsForDay = scheduledPosts.filter(post => post.scheduledDate === dateString);
      
      days.push({
        date: currentDate,
        dayOfMonth: currentDate.getDate(),
        isCurrentMonth,
        isSelected,
        dateString,
        posts: postsForDay
      });
      
      dayCounter++;
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const selectedDatePosts = scheduledPosts.filter(post => post.scheduledDate === selectedDate);

  const renderCalendarHeader = () => {
    const date = new Date(currentMonth);
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return (
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={navigateToPreviousMonth}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.calendarHeaderTitle}>{monthName} {year}</Text>
        <TouchableOpacity onPress={navigateToNextMonth}>
          <ChevronRight size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekdayLabels = () => (
    <View style={styles.weekdayLabelsContainer}>
      {weekdays.map((day, index) => (
        <View key={index} style={styles.weekdayLabel}>
          <Text style={styles.weekdayLabelText}>{day}</Text>
        </View>
      ))}
    </View>
  );

  const renderCalendarGrid = () => (
    <View style={styles.calendarGrid}>
      {calendarDays.map((day, index) => (
        <CalendarDay
          key={index}
          day={day}
          onSelect={() => setSelectedDate(day.dateString)}
        />
      ))}
    </View>
  );

  const renderViewModeSelector = () => (
    <View style={styles.viewModeContainer}>
      <TouchableOpacity 
        style={[
          styles.viewModeButton,
          viewMode === 'month' && styles.viewModeButtonActive
        ]}
        onPress={() => setViewMode('month')}
      >
        <Text 
          style={[
            styles.viewModeButtonText,
            viewMode === 'month' && styles.viewModeButtonTextActive
          ]}
        >
          Month
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.viewModeButton,
          viewMode === 'week' && styles.viewModeButtonActive
        ]}
        onPress={() => setViewMode('week')}
      >
        <Text 
          style={[
            styles.viewModeButtonText,
            viewMode === 'week' && styles.viewModeButtonTextActive
          ]}
        >
          Week
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSelectedDateHeader = () => {
    const date = new Date(selectedDate);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });

    return (
      <View style={styles.selectedDateHeader}>
        <Text style={styles.selectedDateText}>{formattedDate}</Text>
        <TouchableOpacity 
          style={styles.addPostButton}
          onPress={() => router.push('/create/schedule-post')}
        >
          <Plus size={16} color="white" />
          <Text style={styles.addPostButtonText}>Schedule Post</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Content Calendar</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {renderViewModeSelector()}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarContainer}>
          {renderCalendarHeader()}
          {renderWeekdayLabels()}
          {renderCalendarGrid()}
        </View>

        <View style={styles.scheduledPostsContainer}>
          {renderSelectedDateHeader()}
          
          {selectedDatePosts.length > 0 ? (
            <FlatList
              data={selectedDatePosts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ScheduledPost post={item} />
              )}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <CalendarIcon size={40} color={Colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>No posts scheduled</Text>
              <Text style={styles.emptyStateText}>
                Tap the "Schedule Post" button to create a new scheduled post for this date.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.upcomingContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Posts</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View All</Text>
            </TouchableOpacity>
          </View>

          {scheduledPosts.length > 0 ? (
            scheduledPosts
              .filter(post => new Date(post.scheduledDate) > new Date())
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .slice(0, 3)
              .map(post => (
                <ScheduledPost key={post.id} post={post} />
              ))
          ) : (
            <Text style={styles.noUpcomingText}>No upcoming posts scheduled</Text>
          )}
        </View>

        <View style={styles.spacer} />
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
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.card,
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  viewModeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  viewModeButtonActive: {
    backgroundColor: Colors.primary,
  },
  viewModeButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  viewModeButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  calendarContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  weekdayLabelsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekdayLabel: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayLabelText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scheduledPostsContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  addPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addPostButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
    marginLeft: 6,
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  upcomingContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  sectionAction: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  noUpcomingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.card,
    borderRadius: 16,
  },
  spacer: {
    height: 40,
  },
});
