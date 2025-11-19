import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/constants/theme';
import { useAIStore } from '@/store/aiStore';

/**
 * Cost Transparency Components
 *
 * Research finding: Users need real-time cost visibility
 * - Show cost BEFORE generating
 * - Update DURING generation
 * - Confirm AFTER completion
 * - Budget tracking and alerts
 * - No billing surprises
 */

interface CostEstimateProps {
  tokens?: number;
  estimatedCost: number;
  showDetails?: boolean;
}

/**
 * Cost Estimate (Before Generation)
 * Shows users what they'll pay before they commit
 */
export function CostEstimate({
  tokens,
  estimatedCost,
  showDetails = false,
}: CostEstimateProps) {
  const theme = useTheme();
  const { totalCostIncurred, totalTokensUsed } = useAIStore();

  // Mock monthly budget (would come from settings)
  const monthlyBudget = 50.00;
  const budgetUsed = (totalCostIncurred / monthlyBudget) * 100;
  const remainingBudget = monthlyBudget - totalCostIncurred;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
      {/* Main cost display */}
      <View style={styles.mainCost}>
        <Text style={[styles.costLabel, { color: theme.colors.textSecondary }]}>
          💰 Est. cost:
        </Text>
        <Text style={[styles.costValue, { color: theme.colors.aiPrimary }]}>
          ${estimatedCost.toFixed(3)}
        </Text>
      </View>

      {/* Details */}
      {showDetails && tokens && (
        <View style={styles.details}>
          <Text style={[styles.detailText, { color: theme.colors.textTertiary }]}>
            ~{tokens} tokens
          </Text>
        </View>
      )}

      {/* Budget status */}
      {showDetails && (
        <View style={styles.budgetStatus}>
          <View style={styles.budgetRow}>
            <Text style={[styles.budgetLabel, { color: theme.colors.textSecondary }]}>
              Monthly budget:
            </Text>
            <Text style={[styles.budgetValue, { color: theme.colors.textPrimary }]}>
              ${totalCostIncurred.toFixed(2)} of ${monthlyBudget.toFixed(2)}
            </Text>
          </View>

          {/* Budget bar */}
          <View style={[styles.budgetBar, { backgroundColor: theme.colors.backgroundTertiary }]}>
            <View
              style={[
                styles.budgetFill,
                {
                  width: `${Math.min(budgetUsed, 100)}%`,
                  backgroundColor:
                    budgetUsed > 80
                      ? theme.colors.error
                      : budgetUsed > 50
                      ? theme.colors.warning
                      : theme.colors.success,
                },
              ]}
            />
          </View>

          <Text style={[styles.remainingText, { color: theme.colors.textTertiary }]}>
            ${remainingBudget.toFixed(2)} remaining
            {budgetUsed > 80 && ' ⚠️'}
          </Text>
        </View>
      )}
    </View>
  );
}

interface LiveCostTrackerProps {
  currentCost: number;
  estimatedTotal: number;
  progress: number; // 0-100
}

/**
 * Live Cost Tracker (During Generation)
 * Real-time cost updates as content generates
 */
export function LiveCostTracker({
  currentCost,
  estimatedTotal,
  progress,
}: LiveCostTrackerProps) {
  const theme = useTheme();

  return (
    <View style={[styles.liveContainer, { backgroundColor: theme.colors.aiBackground, borderColor: theme.colors.aiPrimary }]}>
      <View style={styles.liveHeader}>
        <Text style={[styles.liveLabel, { color: theme.colors.textSecondary }]}>
          💰 Cost so far:
        </Text>
        <Text style={[styles.liveValue, { color: theme.colors.aiPrimary }]}>
          ${currentCost.toFixed(3)}
        </Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.liveProgress}>
        <View style={[styles.liveProgressBar, { backgroundColor: theme.colors.backgroundTertiary }]}>
          <View
            style={[
              styles.liveProgressFill,
              {
                width: `${progress}%`,
                backgroundColor: theme.colors.aiPrimary,
              },
            ]}
          />
        </View>
        <Text style={[styles.liveProgressText, { color: theme.colors.textTertiary }]}>
          {progress}% • ~${estimatedTotal.toFixed(2)} total
        </Text>
      </View>
    </View>
  );
}

interface CostConfirmationProps {
  finalCost: number;
  tokens: number;
  estimated: number;
  breakdown?: {
    inputTokens: number;
    outputTokens: number;
    cacheTokens?: number;
  };
}

/**
 * Cost Confirmation (After Generation)
 * Confirm final cost and show accuracy
 */
export function CostConfirmation({
  finalCost,
  tokens,
  estimated,
  breakdown,
}: CostConfirmationProps) {
  const theme = useTheme();
  const { totalCostIncurred } = useAIStore();

  const wasAccurate = Math.abs(finalCost - estimated) < 0.01;
  const difference = finalCost - estimated;

  return (
    <View style={[styles.confirmContainer, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
      {/* Final cost */}
      <View style={styles.confirmRow}>
        <Text style={[styles.confirmLabel, { color: theme.colors.textSecondary }]}>
          💰 Final cost:
        </Text>
        <Text style={[styles.confirmValue, { color: theme.colors.aiPrimary }]}>
          ${finalCost.toFixed(3)}
        </Text>
      </View>

      {/* Accuracy indicator */}
      {wasAccurate ? (
        <View style={styles.accuracyBadge}>
          <Text style={[styles.accuracyText, { color: theme.colors.success }]}>
            ✓ As estimated
          </Text>
        </View>
      ) : (
        <View style={styles.accuracyBadge}>
          <Text style={[styles.accuracyText, { color: theme.colors.textTertiary }]}>
            {difference > 0 ? '+' : ''}${difference.toFixed(3)} vs. estimate
          </Text>
        </View>
      )}

      {/* Breakdown */}
      {breakdown && (
        <View style={styles.breakdownContainer}>
          <Text style={[styles.breakdownTitle, { color: theme.colors.textSecondary }]}>
            Token breakdown:
          </Text>
          <View style={styles.breakdownRows}>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownText, { color: theme.colors.textTertiary }]}>
                Input tokens:
              </Text>
              <Text style={[styles.breakdownValue, { color: theme.colors.textPrimary }]}>
                {breakdown.inputTokens.toLocaleString()}
              </Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={[styles.breakdownText, { color: theme.colors.textTertiary }]}>
                Output tokens:
              </Text>
              <Text style={[styles.breakdownValue, { color: theme.colors.textPrimary }]}>
                {breakdown.outputTokens.toLocaleString()}
              </Text>
            </View>
            {breakdown.cacheTokens !== undefined && breakdown.cacheTokens > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownText, { color: theme.colors.textTertiary }]}>
                  Cache tokens (saved):
                </Text>
                <Text style={[styles.breakdownValue, { color: theme.colors.success }]}>
                  {breakdown.cacheTokens.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Total spent */}
      <View style={[styles.totalSpent, { borderTopColor: theme.colors.border }]}>
        <Text style={[styles.totalSpentLabel, { color: theme.colors.textTertiary }]}>
          Total spent this month:
        </Text>
        <Text style={[styles.totalSpentValue, { color: theme.colors.textPrimary }]}>
          ${totalCostIncurred.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

interface BudgetAlertProps {
  currentSpend: number;
  budgetLimit: number;
  onAdjustBudget: () => void;
  onDismiss: () => void;
}

/**
 * Budget Alert
 * Warn users when approaching budget limit
 */
export function BudgetAlert({
  currentSpend,
  budgetLimit,
  onAdjustBudget,
  onDismiss,
}: BudgetAlertProps) {
  const theme = useTheme();
  const percentUsed = (currentSpend / budgetLimit) * 100;

  if (percentUsed < 80) {
    return null; // Only show when at 80%+
  }

  const isOverBudget = percentUsed >= 100;

  return (
    <View
      style={[
        styles.alertContainer,
        {
          backgroundColor: isOverBudget
            ? theme.colors.error + '15'
            : theme.colors.warning + '15',
          borderColor: isOverBudget ? theme.colors.error : theme.colors.warning,
        },
      ]}
    >
      <View style={styles.alertContent}>
        <Text style={styles.alertIcon}>{isOverBudget ? '🚨' : '⚠️'}</Text>
        <View style={styles.alertText}>
          <Text style={[styles.alertTitle, { color: theme.colors.textPrimary }]}>
            {isOverBudget ? 'Budget Exceeded' : 'Budget Alert'}
          </Text>
          <Text style={[styles.alertMessage, { color: theme.colors.textSecondary }]}>
            You've used ${currentSpend.toFixed(2)} of your ${budgetLimit.toFixed(2)} monthly budget
            ({Math.round(percentUsed)}%)
          </Text>
        </View>
      </View>

      <View style={styles.alertActions}>
        <TouchableOpacity onPress={onDismiss} style={styles.alertButton}>
          <Text style={[styles.alertButtonText, { color: theme.colors.textSecondary }]}>
            Dismiss
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAdjustBudget}
          style={[styles.alertButton, styles.alertButtonPrimary, { backgroundColor: theme.colors.aiPrimary }]}
        >
          <Text style={[styles.alertButtonText, { color: '#FFFFFF' }]}>
            Adjust Budget
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Cost Estimate
  container: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  mainCost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  costLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  costValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  detailText: {
    fontSize: 13,
  },
  budgetStatus: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetLabel: {
    fontSize: 13,
  },
  budgetValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  budgetBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  budgetFill: {
    height: '100%',
    borderRadius: 3,
  },
  remainingText: {
    fontSize: 12,
    textAlign: 'right',
  },

  // Live Cost Tracker
  liveContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  liveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  liveValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  liveProgress: {
    gap: 6,
  },
  liveProgressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  liveProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  liveProgressText: {
    fontSize: 12,
    textAlign: 'center',
  },

  // Cost Confirmation
  confirmContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  confirmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  accuracyBadge: {
    alignSelf: 'flex-start',
  },
  accuracyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownContainer: {
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownRows: {
    gap: 6,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownText: {
    fontSize: 12,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  totalSpent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  totalSpentLabel: {
    fontSize: 12,
  },
  totalSpentValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Budget Alert
  alertContainer: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  alertContent: {
    flexDirection: 'row',
    gap: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertText: {
    flex: 1,
    gap: 4,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  alertMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 8,
  },
  alertButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  alertButtonPrimary: {
    flex: 1,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
