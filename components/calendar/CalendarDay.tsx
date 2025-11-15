import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '@/constants/colors';

interface CalendarDayProps {
  day: {
    date: Date;
    dayOfMonth: number;
    isCurrentMonth: boolean;
    isSelected: boolean;
    dateString: string;
    posts: any[];
  };
  onSelect: () => void;
}

export default function CalendarDay({ day, onSelect }: CalendarDayProps) {
  const isToday = () => {
    const today = new Date();
    return (
      day.date.getDate() === today.getDate() &&
      day.date.getMonth() === today.getMonth() &&
      day.date.getFullYear() === today.getFullYear()
    );
  };

  const hasPosts = day.posts.length > 0;

  return (
    <TouchableOpacity
      style={[
        styles.dayContainer,
        day.isSelected && styles.daySelected,
        isToday() && !day.isSelected && styles.dayToday
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.dayText,
          !day.isCurrentMonth && styles.dayTextInactive,
          day.isSelected && styles.dayTextSelected,
          isToday() && !day.isSelected && styles.dayTextToday
        ]}
      >
        {day.dayOfMonth}
      </Text>

      {hasPosts && (
        <View style={styles.postsIndicator}>
          {day.posts.slice(0, 3).map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                day.isSelected && styles.dotSelected
              ]}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  dayContainer: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
    position: 'relative',
  },
  daySelected: {
    backgroundColor: Colors.primary,
  },
  dayToday: {
    backgroundColor: Colors.primary + Colors.opacity10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  dayTextInactive: {
    color: Colors.textTertiary,
    opacity: 0.5,
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  dayTextToday: {
    color: Colors.primary,
    fontWeight: '600',
  },
  postsIndicator: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 2,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  dotSelected: {
    backgroundColor: '#FFFFFF',
  },
});
