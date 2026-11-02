import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { CURRENCY } from '../config';
import { formatDateTime } from '../format';
import { makeId } from '../storage';
import { colors, spacing } from '../theme';

// Form for logging a single income or expense entry.
export default function AddTransaction({ onCancel, onSave }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [picker, setPicker] = useState(null); // 'date' | 'time' | null

  const parsed = parseFloat(amount);
  const valid = amount.trim() !== '' && !Number.isNaN(parsed) && parsed > 0;

  function handleSave() {
    onSave({
      id: makeId(),
      type,
      amount: Math.abs(parsed),
      description: description.trim(),
      date: date.toISOString(),
    });
  }

  // On Android the picker is a one-shot dialog; on iOS it's an inline spinner.
  function onPickerChange(event, selected) {
    if (Platform.OS === 'android') setPicker(null);
    if (event.type === 'dismissed' || !selected) return;
    setDate((prev) => {
      const next = new Date(prev);
      if (picker === 'date') {
        next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      } else {
        next.setHours(selected.getHours(), selected.getMinutes());
      }
      return next;
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Pressable onPress={onCancel} hitSlop={10}>
          <Text style={styles.cancel}>Cancel</Text>
        </Pressable>
        <Text style={styles.headerTitle}>New transaction</Text>
        <View style={{ width: 54 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        keyboardShouldPersistTaps="handled"
      >
        {/* Income / Expense toggle */}
        <View style={styles.toggle}>
          {['expense', 'income'].map((t) => {
            const active = type === t;
            const activeColor = t === 'income' ? colors.income : colors.expense;
            return (
              <Pressable
                key={t}
                style={[
                  styles.toggleItem,
                  active && { backgroundColor: activeColor },
                ]}
                onPress={() => setType(t)}
              >
                <Text
                  style={[styles.toggleText, active && styles.toggleTextActive]}
                >
                  {t === 'income' ? 'Income' : 'Expense'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>Amount</Text>
        <View style={styles.inputRow}>
          <Text style={styles.currency}>{CURRENCY}</Text>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Lunch, Salary, Taxi"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Date & time</Text>
        <View style={styles.dateRow}>
          <Pressable style={styles.dateChip} onPress={() => setPicker('date')}>
            <Text style={styles.dateChipText}>
              {date.toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </Pressable>
          <Pressable style={styles.dateChip} onPress={() => setPicker('time')}>
            <Text style={styles.dateChipText}>
              {date.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.hint}>Defaults to now — tap to change.</Text>

        {picker && (
          <DateTimePicker
            value={date}
            mode={picker}
            is24Hour={false}
            maximumDate={new Date()}
            onChange={onPickerChange}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.saveButton, !valid && styles.buttonDisabled]}
          disabled={!valid}
          onPress={handleSave}
        >
          <Text style={styles.saveText}>
            Save {type === 'income' ? 'income' : 'expense'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  cancel: { color: colors.primary, fontSize: 16, width: 54 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '700' },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  toggleItem: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: 9,
    alignItems: 'center',
  },
  toggleText: { color: colors.textMuted, fontSize: 15, fontWeight: '600' },
  toggleTextActive: { color: '#fff' },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  currency: { color: colors.textMuted, fontSize: 24, fontWeight: '600' },
  amountInput: {
    flex: 1,
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
    fontSize: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
  },
  dateRow: { flexDirection: 'row', gap: spacing.sm },
  dateChip: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dateChipText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  hint: { color: colors.textMuted, fontSize: 12, marginTop: spacing.sm },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  saveText: { color: '#fff', fontSize: 17, fontWeight: '700' },
});
