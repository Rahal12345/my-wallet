import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CURRENCY } from '../config';
import { colors, spacing } from '../theme';

// Shown on first launch (no starting balance yet) and reused for the
// "adjust starting balance" flow later, via the optional props.
export default function Onboarding({
  onSubmit,
  onCancel,
  initialValue = '',
  title = 'Set up your wallet',
  subtitle = "Count the cash in your wallet right now and enter the total. We'll track every change from here.",
  buttonText = 'Start tracking',
}) {
  const [value, setValue] = useState(initialValue);

  const parsed = parseFloat(value);
  const valid = value.trim() !== '' && !Number.isNaN(parsed) && parsed >= 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <Text style={styles.emoji}>👛</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.inputRow}>
          <Text style={styles.currency}>{CURRENCY}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>

        <Pressable
          style={[styles.button, !valid && styles.buttonDisabled]}
          disabled={!valid}
          onPress={() => onSubmit(parsed)}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>

        {onCancel && (
          <Pressable onPress={onCancel} style={styles.cancel} hitSlop={8}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: spacing.md },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
    lineHeight: 21,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  currency: { color: colors.textMuted, fontSize: 28, fontWeight: '600' },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    paddingVertical: spacing.md,
    marginLeft: spacing.sm,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  cancel: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.sm },
  cancelText: { color: colors.textMuted, fontSize: 15 },
});
