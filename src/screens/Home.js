import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatDateTime, formatMoney } from '../format';
import { computeBalance } from '../storage';
import { colors, spacing } from '../theme';

// Main screen: current balance on top, transaction history below.
export default function Home({ state, onAdd, onDelete, onEditBalance }) {
  const balance = computeBalance(state);
  const txns = [...state.transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  function confirmDelete(txn) {
    Alert.alert(
      'Delete transaction?',
      `${txn.description || (txn.type === 'income' ? 'Income' : 'Expense')} — ${formatMoney(
        txn.amount
      )}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(txn.id),
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Balance card */}
      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Current balance</Text>
        <Text
          style={[
            styles.balanceValue,
            balance < 0 && { color: colors.expense },
          ]}
        >
          {formatMoney(balance)}
        </Text>
        <Pressable onPress={onEditBalance} hitSlop={8}>
          <Text style={styles.editBalance}>Adjust starting balance</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>History</Text>

      <FlatList
        data={txns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={
          txns.length === 0 ? styles.emptyWrap : styles.listContent
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            No transactions yet.{'\n'}Tap + to add your first one.
          </Text>
        }
        renderItem={({ item }) => {
          const isIncome = item.type === 'income';
          return (
            <Pressable
              style={styles.row}
              onLongPress={() => confirmDelete(item)}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.rowDesc} numberOfLines={1}>
                  {item.description ||
                    (isIncome ? 'Income' : 'Expense')}
                </Text>
                <Text style={styles.rowDate}>{formatDateTime(item.date)}</Text>
              </View>
              <Text
                style={[
                  styles.rowAmount,
                  { color: isIncome ? colors.income : colors.expense },
                ]}
              >
                {isIncome ? '+' : '-'}
                {formatMoney(item.amount).replace('-', '')}
              </Text>
            </Pressable>
          );
        }}
      />

      {txns.length > 0 && (
        <Text style={styles.deleteHint}>Long-press a row to delete it.</Text>
      )}

      {/* Floating add button */}
      <Pressable style={styles.fab} onPress={onAdd}>
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  balanceCard: {
    backgroundColor: colors.card,
    margin: spacing.md,
    borderRadius: 18,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceValue: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  editBalance: {
    color: colors.primary,
    fontSize: 14,
    marginTop: spacing.md,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  listContent: { paddingHorizontal: spacing.md, paddingBottom: 120 },
  emptyWrap: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  empty: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowLeft: { flex: 1, marginRight: spacing.md },
  rowDesc: { color: colors.text, fontSize: 16, fontWeight: '600' },
  rowDate: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  rowAmount: { fontSize: 17, fontWeight: '700' },
  deleteHint: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingBottom: spacing.sm,
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.xl + 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 32, fontWeight: '600', marginTop: -2 },
});
