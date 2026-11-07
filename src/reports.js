// Pure helpers for turning the transaction log into weekly / monthly summaries.
// No UI here — just dates and numbers, so it's easy to reason about and test.

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Week starts on Monday.
export function startOfWeek(d) {
  const x = startOfDay(d);
  const dayFromMonday = (x.getDay() + 6) % 7; // Mon=0 ... Sun=6
  x.setDate(x.getDate() - dayFromMonday);
  return x;
}

export function startOfMonth(d) {
  const x = startOfDay(d);
  x.setDate(1);
  return x;
}

function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

// Sum income / expense / net / count for transactions within [start, end).
export function aggregate(transactions, start, end) {
  let income = 0;
  let expense = 0;
  let count = 0;
  for (const t of transactions) {
    const dt = new Date(t.date);
    if (dt >= start && dt < end) {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
      count += 1;
    }
  }
  return { income, expense, net: income - expense, count };
}

// 7 daily buckets (Mon..Sun) of the given week, each with income & expense.
export function weekBuckets(transactions, weekStart) {
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const buckets = labels.map((label, i) => {
    const dayStart = addDays(weekStart, i);
    const dayEnd = addDays(dayStart, 1);
    const { income, expense } = aggregate(transactions, dayStart, dayEnd);
    return { label, income, expense };
  });
  return buckets;
}

// Up-to-5 weekly buckets of the given month, grouped by day-of-month.
export function monthBuckets(transactions, monthStart) {
  const ranges = [
    { label: "1–7", from: 1, to: 8 },
    { label: "8–14", from: 8, to: 15 },
    { label: "15–21", from: 15, to: 22 },
    { label: "22–28", from: 22, to: 29 },
    { label: "29+", from: 29, to: 32 },
  ];
  const y = monthStart.getFullYear();
  const m = monthStart.getMonth();
  return ranges.map(({ label, from, to }) => {
    const start = new Date(y, m, from);
    const end = new Date(y, m, to);
    const { income, expense } = aggregate(transactions, start, end);
    return { label, income, expense };
  });
}

// A readable label for the period currently being shown.
export function periodLabel(period, ref = new Date()) {
  if (period === "week") {
    const start = startOfWeek(ref);
    const end = addDays(start, 6);
    const fmt = (d) =>
      d.toLocaleDateString(undefined, { day: "numeric", month: "short" });
    return `${fmt(start)} – ${fmt(end)}`;
  }
  return ref.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}
