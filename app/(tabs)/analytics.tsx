import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  BarChart, 
  PieChart,
  ChevronDown,
  Instagram,
  Twitter,
  Youtube,
  Facebook
} from 'lucide-react-native';
import { useAnalyticsStore } from '@/store/analyticsStore';
import AnalyticsCard from '@/components/analytics/AnalyticsCard';
import PerformanceChart from '@/components/analytics/PerformanceChart';
import PlatformMetrics from '@/components/analytics/PlatformMetrics';
import ContentPerformance from '@/components/analytics/ContentPerformance';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { metrics, contentPerformance, platformData } = useAnalyticsStore();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  const metrics_data = [
    { 
      id: 'followers', 
      title: 'Followers', 
      value: metrics.followers.total, 
      change: metrics.followers.change,
      icon: <Users size={20} color={Colors.primary} />
    },
    { 
      id: 'engagement', 
      title: 'Engagement', 
      value: `${metrics.engagement.rate}%`, 
      change: metrics.engagement.change,
      icon: <MessageSquare size={20} color={Colors.chart.purple} />
    },
    { 
      id: 'impressions', 
      title: 'Impressions', 
      value: metrics.impressions.total, 
      change: metrics.impressions.change,
      icon: <Eye size={20} color={Colors.chart.green} />
    },
    { 
      id: 'growth', 
      title: 'Growth Rate', 
      value: `${metrics.growth.rate}%`, 
      change: metrics.growth.change,
      icon: <TrendingUp size={20} color={Colors.chart.red} />
    }
  ];

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      <Text style={styles.timeRangeLabel}>Time Range:</Text>
      <View style={styles.timeRangeButtons}>
        {timeRanges.map(range => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.timeRangeButton,
              timeRange === range.value && styles.timeRangeButtonActive
            ]}
            onPress={() => setTimeRange(range.value)}
          >
            <Text 
              style={[
                styles.timeRangeButtonText,
                timeRange === range.value && styles.timeRangeButtonTextActive
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics Dashboard</Text>
          <TouchableOpacity style={styles.periodSelector}>
            <Text style={styles.periodText}>Last 30 Days</Text>
            <ChevronDown size={16} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {renderTimeRangeSelector()}

        <View style={styles.metricsContainer}>
          {metrics_data.map((metric) => (
            <TouchableOpacity 
              key={metric.id} 
              style={[
                styles.metricCard,
                selectedMetric === metric.id && styles.metricCardSelected
              ]}
              onPress={() => setSelectedMetric(metric.id)}
            >
              <View style={styles.metricIconContainer}>
                {metric.icon}
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
              <Text style={styles.metricTitle}>{metric.title}</Text>
              <View style={[
                styles.metricChangeContainer,
                metric.change >= 0 ? styles.metricPositive : styles.metricNegative
              ]}>
                <TrendingUp size={12} color={metric.change >= 0 ? Colors.success : Colors.error} />
                <Text style={[
                  styles.metricChangeText,
                  metric.change >= 0 ? styles.metricPositiveText : styles.metricNegativeText
                ]}>
                  {metric.change >= 0 ? '+' : ''}{metric.change}%
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Trends</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>View Details</Text>
            </TouchableOpacity>
          </View>
          <PerformanceChart 
            data={metrics.performanceData} 
            selectedMetric={selectedMetric}
            timeRange={timeRange}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Platform Breakdown</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.platformsContainer}>
            <PlatformMetrics 
              platform="Instagram" 
              data={platformData.instagram}
              icon={<Instagram size={20} color="#E1306C" />}
              color="#E1306C"
            />
            <PlatformMetrics 
              platform="Twitter" 
              data={platformData.twitter}
              icon={<Twitter size={20} color="#1DA1F2" />}
              color="#1DA1F2"
            />
            <PlatformMetrics 
              platform="YouTube" 
              data={platformData.youtube}
              icon={<Youtube size={20} color="#FF0000" />}
              color="#FF0000"
            />
            <PlatformMetrics 
              platform="Facebook" 
              data={platformData.facebook}
              icon={<Facebook size={20} color="#4267B2" />}
              color="#4267B2"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Performing Content</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ContentPerformance data={contentPerformance} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Audience Demographics</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>View Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.demographicsContainer}>
            <View style={styles.demographicCard}>
              <Text style={styles.demographicTitle}>Age Distribution</Text>
              <View style={styles.chartPlaceholder}>
                <BarChart size={24} color={Colors.textSecondary} />
              </View>
            </View>
            <View style={styles.demographicCard}>
              <Text style={styles.demographicTitle}>Gender</Text>
              <View style={styles.chartPlaceholder}>
                <PieChart size={24} color={Colors.textSecondary} />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.reportButton}>
            <Text style={styles.reportButtonText}>Generate Detailed Report</Text>
          </TouchableOpacity>
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
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  periodText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 4,
  },
  timeRangeContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  timeRangeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeRangeButtonActive: {
    backgroundColor: Colors.primary,
  },
  timeRangeButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  timeRangeButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  metricCard: {
    width: (width - 40) / 2,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    margin: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  metricCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  metricIconContainer: {
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  metricChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  metricPositive: {
    backgroundColor: Colors.success + '15',
  },
  metricNegative: {
    backgroundColor: Colors.error + '15',
  },
  metricChangeText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  metricPositiveText: {
    color: Colors.success,
  },
  metricNegativeText: {
    color: Colors.error,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
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
    padding: 4,
  },
  sectionActionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  platformsContainer: {
    marginBottom: 8,
  },
  demographicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  demographicCard: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  demographicTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 8,
  },
  reportButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  spacer: {
    height: 40,
  },
});
