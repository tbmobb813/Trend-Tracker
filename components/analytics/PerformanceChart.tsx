import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/colors';
import { TrendingUp } from 'lucide-react-native';

interface PerformanceChartProps {
  data: any;
  selectedMetric: string;
  timeRange: string;
}

const { width } = Dimensions.get('window');
const chartWidth = width - 32;
const chartHeight = 200;

export default function PerformanceChart({ data, selectedMetric, timeRange }: PerformanceChartProps) {
  const metricData = data[selectedMetric]?.[timeRange] || [];

  if (!metricData || metricData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <TrendingUp size={32} color={Colors.textTertiary} />
        <Text style={styles.emptyText}>No data available</Text>
      </View>
    );
  }

  // Calculate min and max values for scaling
  const values = metricData.map((item: any) => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1; // Prevent division by zero

  // Calculate positions for points
  const pointWidth = chartWidth / (metricData.length - 1 || 1);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>{Math.round(maxValue).toLocaleString()}</Text>
          <Text style={styles.yAxisLabel}>{Math.round((maxValue + minValue) / 2).toLocaleString()}</Text>
          <Text style={styles.yAxisLabel}>{Math.round(minValue).toLocaleString()}</Text>
        </View>

        <View style={styles.chart}>
          {/* Grid lines */}
          <View style={styles.gridLines}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>

          {/* Line chart visualization */}
          <View style={styles.lineContainer}>
            {metricData.map((item: any, index: number) => {
              const normalizedValue = (item.value - minValue) / valueRange;
              const yPosition = chartHeight - (normalizedValue * (chartHeight - 40));
              const xPosition = index * pointWidth;

              return (
                <View
                  key={index}
                  style={[
                    styles.dataPoint,
                    {
                      left: xPosition,
                      top: yPosition,
                    }
                  ]}
                >
                  <View style={styles.dot} />
                </View>
              );
            })}
          </View>

          {/* Gradient area (simplified) */}
          <View style={styles.gradientArea}>
            {metricData.map((item: any, index: number) => {
              const normalizedValue = (item.value - minValue) / valueRange;
              const barHeight = normalizedValue * (chartHeight - 40);

              return (
                <View
                  key={index}
                  style={[
                    styles.gradientBar,
                    {
                      width: pointWidth,
                      height: barHeight,
                    }
                  ]}
                />
              );
            })}
          </View>
        </View>
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxis}>
        <Text style={styles.xAxisLabel}>
          {metricData[0]?.date?.substring(5) || ''}
        </Text>
        <Text style={styles.xAxisLabel}>
          {metricData[Math.floor(metricData.length / 2)]?.date?.substring(5) || ''}
        </Text>
        <Text style={styles.xAxisLabel}>
          {metricData[metricData.length - 1]?.date?.substring(5) || ''}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    height: chartHeight,
  },
  yAxis: {
    width: 50,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'right',
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: Colors.border,
  },
  lineContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    marginLeft: -4,
    marginTop: -4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  gradientArea: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
    opacity: 0.2,
  },
  gradientBar: {
    backgroundColor: Colors.primary,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginLeft: 50,
  },
  xAxisLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
  },
});
