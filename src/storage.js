import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from './config';

// The whole app state is a single object:
//   { startingBalance: number | null, transactions: Transaction[] }
//
// Transaction: {
//   id: string,
//   type: 'income' | 'expense',
//   amount: number,            // always a positive number
//   description: string,
//   date: string,              // ISO timestamp
// }

const emptyState = { startingBalance: null, transactions: [] };

export async function loadState() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyState };
    const parsed = JSON.parse(raw);
    return {
      startingBalance:
        typeof parsed.startingBalance === 'number' ? parsed.startingBalance : null,
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
    };
  } catch (e) {
    // If storage is somehow corrupt, start clean rather than crash.
    return { ...emptyState };
  }
}

export async function saveState(state) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Balance is always derived from the starting balance + the transaction log,
// so the number on screen can never drift away from the records.
export function computeBalance(state) {
  const start = state.startingBalance ?? 0;
  return state.transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, start);
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
