export type ContributionDay = {
  date: string;
  contributionCount: number;
};

/**
 * GitHub-style current streak.
 *
 * The latest calendar day receives "today grace":
 * if it has zero contributions, we start from the previous day.
 *
 * GitHub contribution-calendar YYYY-MM-DD strings are treated as the
 * canonical day keys. We do not convert them through the browser timezone.
 */
export function calculateCurrentStreak(
  contributionDays: ContributionDay[],
) {
  if (contributionDays.length === 0) {
    return 0;
  }

  const counts = new Map(
    contributionDays.map((day) => [
      day.date,
      day.contributionCount,
    ]),
  );

  const sortedDates = contributionDays
    .map((day) => day.date)
    .sort((a, b) => a.localeCompare(b));

  let cursor =
    sortedDates[sortedDates.length - 1];

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

function previousIsoDate(
  isoDate: string,
) {
  const [year, month, day] =
    isoDate.split("-").map(Number);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
    ),
  );

  date.setUTCDate(
    date.getUTCDate() - 1,
  );

  return date
    .toISOString()
    .slice(0, 10);
}
