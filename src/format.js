import { CURRENCY } from './config';

// Format a number as money, e.g. 1234.5 -> "$1,234.50".
export function formatMoney(value) {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  const str = abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${CURRENCY}${str}`;
}

// e.g. "2 Nov 2026, 2:45 PM"
export function formatDateTime(iso) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${date}, ${time}`;
}
