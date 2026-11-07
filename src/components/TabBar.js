import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";

const TABS = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "reports", label: "Reports", icon: "📊" },
];

// Simple bottom tab bar. Sits below the content so screens don't overlap it.
export default function TabBar({ active, onChange }) {
  return (
    <View style={styles.bar}>
      {TABS.map((t) => {
        const isActive = active === t.key;
        return (
          <Pressable
            key={t.key}
            style={styles.tab}
            onPress={() => onChange(t.key)}
          >
            <Text style={[styles.icon, !isActive && styles.inactive]}>
              {t.icon}
            </Text>
            <Text
              style={[styles.label, isActive ? styles.activeLabel : styles.inactive]}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: spacing.xs },
  icon: { fontSize: 20, marginBottom: 2 },
  label: { fontSize: 12, fontWeight: "600" },
  activeLabel: { color: colors.primary },
  inactive: { opacity: 0.5, color: colors.textMuted },
});
