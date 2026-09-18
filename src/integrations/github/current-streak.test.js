/**
 * Focused unit tests for calculateCurrentStreak.
 * Self-contained: inlines the implementation so no transpiler is needed.
 * Run: node src/integrations/github/current-streak.test.js
 */

const assert = require("node:assert/strict");

// ── Inline the implementation (mirrors current-streak.ts exactly) ──────────

function previousIsoDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

function calculateCurrentStreak(contributionDays) {
  if (contributionDays.length === 0) return 0;

  const counts = new Map(
    contributionDays.map((day) => [day.date, day.contributionCount])
  );

  const sortedDates = contributionDays
    .map((day) => day.date)
    .sort((a, b) => a.localeCompare(b));

  let cursor = sortedDates[sortedDates.length - 1];

  if ((counts.get(cursor) ?? 0) === 0) {
    cursor = previousIsoDate(cursor);
  }

  let streak = 0;
  while ((counts.get(cursor) ?? 0) > 0) {
    streak += 1;
    cursor = previousIsoDate(cursor);
  }

  return streak;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function makeDay(date, count) {
  return { date, contributionCount: count };
}

function consecutiveDays(endDate, n) {
  const days = [];
  const [y, m, d] = endDate.split("-").map(Number);
  let cursor = new Date(Date.UTC(y, m - 1, d));
  for (let i = 0; i < n; i++) {
    days.unshift(makeDay(cursor.toISOString().slice(0, 10), 1));
    cursor = new Date(cursor.getTime() - 86_400_000);
  }
  return days;
}

// ── Tests ──────────────────────────────────────────────────────────────────

let passed = 0, failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name} — ${err.message}`);
    failed++;
  }
}

console.log("\n[calculateCurrentStreak — unit tests]");

test("empty array → 0", () =>
  assert.equal(calculateCurrentStreak([]), 0));

test("all zeros → 0", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-09-15", 0),
    makeDay("2026-09-16", 0),
    makeDay("2026-09-17", 0),
  ]), 0));

test("single active day → 1", () =>
  assert.equal(calculateCurrentStreak([makeDay("2026-09-18", 5)]), 1));

test("single zero day → 0", () =>
  assert.equal(calculateCurrentStreak([makeDay("2026-09-18", 0)]), 0));

test("5 consecutive days, today active → 5", () =>
  assert.equal(calculateCurrentStreak(consecutiveDays("2026-09-18", 5)), 5));

test("30 consecutive days → 30", () =>
  assert.equal(calculateCurrentStreak(consecutiveDays("2026-09-18", 30)), 30));

test("gap in middle — streak 3 from newest", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-09-12", 2),
    makeDay("2026-09-13", 1),
    makeDay("2026-09-14", 0), // gap
    makeDay("2026-09-15", 3),
    makeDay("2026-09-16", 1),
    makeDay("2026-09-17", 4),
  ]), 3));

test("today=0, yesterday active → grace: count from yesterday", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-09-14", 2),
    makeDay("2026-09-15", 3),
    makeDay("2026-09-16", 1),
    makeDay("2026-09-17", 0), // today, no contributions yet
  ]), 3));

test("today=0, yesterday=0 → 0", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-09-14", 5),
    makeDay("2026-09-15", 0),
    makeDay("2026-09-16", 0),
  ]), 0));

test("month boundary streak", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-08-30", 1),
    makeDay("2026-08-31", 2),
    makeDay("2026-09-01", 3),
    makeDay("2026-09-02", 1),
  ]), 4));

test("year boundary streak", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2025-12-30", 1),
    makeDay("2025-12-31", 2),
    makeDay("2026-01-01", 5),
    makeDay("2026-01-02", 1),
  ]), 4));

test("unsorted input → correctly sorted before calculation", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2026-09-18", 3),
    makeDay("2026-09-16", 1),
    makeDay("2026-09-17", 2),
  ]), 3));

test("leap year Feb 29 boundary", () =>
  assert.equal(calculateCurrentStreak([
    makeDay("2024-02-28", 1),
    makeDay("2024-02-29", 2),
    makeDay("2024-03-01", 1),
  ]), 3));

console.log(`\n  Result: ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
