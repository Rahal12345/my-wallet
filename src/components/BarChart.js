import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

const CHART_HEIGHT = 150;

// A dependency-free grouped bar chart drawn with plain Views, so it works in
// Expo Go and adds nothing to the bundle. Each datum is { label, income, expense }.
export default function BarChart({ data }) {
  const max = Math.max(
    1, // avoid divide-by-zero; keeps flat charts from exploding
    ...data.map((d) => Math.max(d.income, d.expense)),
  );
  const hasAny = data.some((d) => d.income > 0 || d.expense > 0);

  return (
    <View>
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.income }]} />
          <Text style={styles.legendText}>Income</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.swatch, { backgroundColor: colors.expense }]} />
          <Text style={styles.legendText}>Expense</Text>
        </View>
      </View>

      <View style={styles.plot}>
        {data.map((d) => (
          <View key={d.label} style={styles.col}>
            <View style={styles.bars}>
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.round((d.income / max) * CHART_HEIGHT),
                    backgroundColor: colors.income,
                  },
                ]}
              />
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.round((d.expense / max) * CHART_HEIGHT),
                    backgroundColor: colors.expense,
                  },
                ]}
              />
            </View>
            <Text style={styles.axisLabel}>{d.label}</Text>
          </View>
        ))}
      </View>

      {!hasAny && <Text style={styles.empty}>No activity in this period.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 12, height: 12, borderRadius: 3 },
  legendText: { color: colors.textMuted, fontSize: 12 },
  plot: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: CHART_HEIGHT + 24,
  },
  col: { flex: 1, alignItems: "center" },
  bars: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: CHART_HEIGHT,
  },
  bar: { width: 9, borderTopLeftRadius: 3, borderTopRightRadius: 3, minHeight: 2 },
  axisLabel: { color: colors.textMuted, fontSize: 11, marginTop: 6 },
  empty: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.md,
  },
});
