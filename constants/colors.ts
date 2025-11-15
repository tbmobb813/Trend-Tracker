const Colors = {
  // Primary brand colors
  primary: '#6366F1',        // Indigo - main brand color
  primaryDark: '#4F46E5',    // Darker indigo for pressed states
  primaryLight: '#818CF8',   // Lighter indigo for hover states

  // Background colors
  background: '#F8F9FA',     // Light gray background
  card: '#FFFFFF',           // White card background
  cardHover: '#F1F3F5',      // Slightly darker for hover

  // Text colors
  text: '#1F2937',           // Dark gray for primary text
  textSecondary: '#6B7280',  // Medium gray for secondary text
  textTertiary: '#9CA3AF',   // Light gray for tertiary text

  // Border colors
  border: '#E5E7EB',         // Light gray border
  borderDark: '#D1D5DB',     // Darker border

  // Status colors
  success: '#10B981',        // Green for success
  successLight: '#D1FAE5',   // Light green background
  error: '#EF4444',          // Red for errors
  errorLight: '#FEE2E2',     // Light red background
  warning: '#F59E0B',        // Orange for warnings
  warningLight: '#FEF3C7',   // Light orange background
  info: '#3B82F6',           // Blue for info
  infoLight: '#DBEAFE',      // Light blue background

  // Trend indicators
  trendUp: '#10B981',        // Green for upward trends
  trendDown: '#EF4444',      // Red for downward trends
  trendNeutral: '#6B7280',   // Gray for neutral trends

  // Category colors
  technology: '#6366F1',     // Indigo
  marketing: '#EC4899',      // Pink
  lifestyle: '#14B8A6',      // Teal
  food: '#F97316',           // Orange
  health: '#10B981',         // Green
  ecommerce: '#8B5CF6',      // Purple
  education: '#3B82F6',      // Blue

  // Social platform colors
  tiktok: '#000000',
  instagram: '#E4405F',
  youtube: '#FF0000',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  pinterest: '#E60023',

  // UI elements
  overlay: 'rgba(0, 0, 0, 0.5)',      // Dark overlay
  overlayLight: 'rgba(0, 0, 0, 0.3)', // Light overlay
  shadow: 'rgba(0, 0, 0, 0.1)',       // Shadow color

  // Opacity variants
  opacity10: '1A',           // 10% opacity hex
  opacity20: '33',           // 20% opacity hex
  opacity30: '4D',           // 30% opacity hex
  opacity40: '66',           // 40% opacity hex
  opacity50: '80',           // 50% opacity hex
  opacity60: '99',           // 60% opacity hex
  opacity70: 'B3',           // 70% opacity hex
  opacity80: 'CC',           // 80% opacity hex
  opacity90: 'E6',           // 90% opacity hex

  // Gradients (for LinearGradient)
  gradientPrimary: ['#6366F1', '#8B5CF6'],
  gradientSuccess: ['#10B981', '#14B8A6'],
  gradientWarning: ['#F59E0B', '#F97316'],
  gradientDanger: ['#EF4444', '#DC2626'],

  // Chart colors
  chart: {
    primary: '#6366F1',
    purple: '#8B5CF6',
    green: '#10B981',
    red: '#EF4444',
    blue: '#3B82F6',
    orange: '#F97316',
    teal: '#14B8A6',
    pink: '#EC4899',
  },
};

export default Colors;
