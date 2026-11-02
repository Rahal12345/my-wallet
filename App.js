import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import AddTransaction from './src/screens/AddTransaction';
import { loadState, saveState } from './src/storage';
import { colors } from './src/theme';

function AppInner() {
  const [state, setState] = useState(null); // null while loading
  const [view, setView] = useState('home'); // 'home' | 'add' | 'editBalance'

  // Load persisted state once on startup.
  useEffect(() => {
    loadState().then(setState);
  }, []);

  // Persist and update in-memory state together, so storage and UI never drift.
  function update(next) {
    setState(next);
    saveState(next).catch(() => {});
  }

  // Still loading from storage.
  if (state === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  // No starting balance yet -> first-run setup.
  if (state.startingBalance === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar style="light" />
        <Onboarding onSubmit={(balance) => update({ ...state, startingBalance: balance })} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      <Home
        state={state}
        onAdd={() => setView('add')}
        onEditBalance={() => setView('editBalance')}
        onDelete={(id) =>
          update({
            ...state,
            transactions: state.transactions.filter((t) => t.id !== id),
          })
        }
      />

      {view === 'add' && (
        <View style={StyleSheet.absoluteFill}>
          <SafeAreaView style={styles.safe}>
            <AddTransaction
              onCancel={() => setView('home')}
              onSave={(txn) => {
                update({ ...state, transactions: [...state.transactions, txn] });
                setView('home');
              }}
            />
          </SafeAreaView>
        </View>
      )}

      {view === 'editBalance' && (
        <View style={StyleSheet.absoluteFill}>
          <SafeAreaView style={styles.safe}>
            <Onboarding
              initialValue={String(state.startingBalance)}
              title="Adjust starting balance"
              subtitle="This resets the baseline your balance is calculated from. Your logged transactions are kept."
              buttonText="Save balance"
              onCancel={() => setView('home')}
              onSubmit={(balance) => {
                update({ ...state, startingBalance: balance });
                setView('home');
              }}
            />
          </SafeAreaView>
        </View>
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppInner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
