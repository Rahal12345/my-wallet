import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import BarChart from "../components/BarChart";
import { formatMoney } from "../format";
import {
  aggregate,
  monthBuckets,
  periodLabel,
  startOfMonth,
  startOfWeek,
  weekBuckets,
} from "../reports";
import { colors, spacing } from "../theme";

// Reports screen: pick Week or Month, see income/expense/net totals and a chart.
export default function Reports({ state }) {
  const [period, setPeriod] = useState("week"); // 'week' | 'month'
  const now = new Date();
  const txns = state.transactions;

  const start = period === "week" ? startOfWeek(now) : startOfMonth(now);
  // End = now so we never count into the future (transactions can't be future-dated).
  const summary = aggregate(txns, start, now);
  const buckets =
    period === "week" ? weekBuckets(txns, start) : monthBuckets(txns, start);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>Reports</Text>

      {/* Week / Month toggle */}
      <View style={styles.toggle}>
        {[
          { key: "week", label: "This Week" },
          { key: "month", label: "This Month" },
        ].map((p) => {
          const active = period === p.key;
          return (
            <Text
              key={p.key}
              onPress={() => setPeriod(p.key)}
              style={[styles.toggleItem, active && styles.toggleItemActive]}
            >
              {p.label}
            </Text>
          );
        })}
      </View>

      <Text style={styles.periodLabel}>{periodLabel(period, now)}</Text>

      {/* Summary tiles */}
      <View style={styles.tiles}>
        <StatTile label="Income" value={summary.income} color={colors.income} />
        <StatTile
          label="Expense"
          value={summary.expense}
          color={colors.expense}
        />
      </View>
      <View style={styles.netCard}>
        <Text style={styles.netLabel}>Net change</Text>
        <Text
          style={[
            styles.netValue,
            { color: summary.net < 0 ? colors.expense : colors.income },
          ]}
        >
          {summary.net >= 0 ? "+" : "-"}
          {formatMoney(Math.abs(summary.net))}
        </Text>
        <Text style={styles.netSub}>
          {summary.count} transaction{summary.count === 1 ? "" : "s"}
        </Text>
      </View>

      {/* Chart */}
      <Text style={styles.chartTitle}>
        {period === "week" ? "Daily activity" : "Weekly activity"}
      </Text>
      <View style={styles.chartCard}>
        <BarChart data={buckets} />
      </View>
    </ScrollView>
  );
}

function StatTile({ label, value, color }) {
  return (
    <View style={styles.tile}>
      <Text style={styles.tileLabel}>{label}</Text>
      <Text style={[styles.tileValue, { color }]}>{formatMoney(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: spacing.md,
  },
  toggle: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.xs,
    marginBottom: spacing.md,
  },
  toggleItem: {
    flex: 1,
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: spacing.sm + 2,
    borderRadius: 9,
    overflow: "hidden",
  },
  toggleItemActive: { backgroundColor: colors.primary, color: "#fff" },
  periodLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  tiles: { flexDirection: "row", gap: spacing.md },
  tile: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tileLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tileValue: { fontSize: 20, fontWeight: "800", marginTop: spacing.xs },
  netCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  netLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  netValue: { fontSize: 28, fontWeight: "800", marginTop: spacing.xs },
  netSub: { color: colors.textMuted, fontSize: 13, marginTop: spacing.xs },
  chartTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
