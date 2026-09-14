"use client";

import { useMemo, useState } from "react";
import type { GitHubContributionDay, GitHubContributionYear } from "@/integrations/github/github.types";
import { useGitHubContributionYear } from "@/integrations/github/use-github-contribution-year";

const levelClass = {
  NONE: "bg-ink-700/70", FIRST_QUARTILE: "bg-cyan/25", SECOND_QUARTILE: "bg-cyan/45",
  THIRD_QUARTILE: "bg-cyan/70", FOURTH_QUARTILE: "bg-cyan shadow-[0_0_7px_rgba(67,201,255,0.45)]",
} as const;

function CalendarYear({ calendar, isCurrent }: { calendar: GitHubContributionYear; isCurrent: boolean }) {
  const days = useMemo(() => {
    const reported = calendar.weeks.flatMap((week) => week.contributionDays);
    const byDate = new Map(reported.map((day) => [day.date, day]));
    const lastReportedDate = reported.at(-1)?.date ?? "";
    const result: Array<{ day: GitHubContributionDay; future: boolean }> = [];
    for (let date = new Date(Date.UTC(calendar.year, 0, 1)); date.getUTCFullYear() === calendar.year; date.setUTCDate(date.getUTCDate() + 1)) {
      const iso = date.toISOString().slice(0, 10);
      result.push({
        day: byDate.get(iso) ?? { contributionCount: 0, contributionLevel: "NONE", date: iso, weekday: date.getUTCDay() },
        future: Boolean(isCurrent && lastReportedDate && iso > lastReportedDate),
      });
    }
    return result;
  }, [calendar.weeks, calendar.year, isCurrent]);
  const [active, setActive] = useState<GitHubContributionDay | null>(null);
  const describe = (day: GitHubContributionDay) => `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00Z`).toLocaleDateString(undefined, { dateStyle: "long", timeZone: "UTC" })}`;
  return <div className="min-w-0">
    <h4 className="font-display text-base font-semibold text-paper">{calendar.totalContributions.toLocaleString()} contributions in {calendar.year}</h4>
    <div className="mt-3 max-w-full overflow-x-auto pb-2" aria-label={`GitHub contributions in ${calendar.year}`}>
      <div className="grid min-w-max grid-flow-col grid-rows-7 gap-[0.2rem]">
        {days.map(({ day, future }, index) => <button key={day.date} type="button" aria-label={future ? `Future date ${day.date}` : describe(day)} title={future ? undefined : describe(day)} disabled={future}
          style={index === 0 ? { gridRow: day.weekday + 1 } : undefined}
          onFocus={() => !future && setActive(day)} onMouseEnter={() => !future && setActive(day)} onClick={() => !future && setActive(day)}
          className={`h-[0.7rem] w-[0.7rem] border border-line-faint/70 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-cyan disabled:cursor-default disabled:bg-transparent disabled:opacity-35 ${levelClass[day.contributionLevel]}`} />)}
      </div>
    </div>
    <div className="mt-1 min-h-4 font-mono text-[0.62rem] text-paper-dim" aria-live="polite">{active ? describe(active) : "Focus or tap a cell for its daily count."}</div>
  </div>;
}

export default function ContributionCalendar({ history, availableYears }: { history: GitHubContributionYear[]; availableYears: number[] }) {
  const sortedYears = [...availableYears].sort((a, b) => b - a);
  const [selectedYear, setSelectedYear] = useState(sortedYears[0] ?? 0);
  const initial = history.find((item) => item.year === selectedYear);
  const historical = useGitHubContributionYear(selectedYear, !initial);
  const selected = initial ?? historical.data;
  if (history.length === 0) return null;
  return <section className="os-card mb-10 border border-line-faint bg-ink-900 p-4 sm:p-5" aria-labelledby="contribution-heading">
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div><div className="tech-label text-cyan">CONTRIBUTION HISTORY</div><h3 id="contribution-heading" className="mt-1 font-display text-xl font-semibold text-paper">GitHub contribution calendar</h3></div>
      <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-paper-dim" aria-hidden="true"><span>LESS</span>{Object.values(levelClass).map((value) => <span key={value} className={`h-2.5 w-2.5 border border-line-faint ${value}`} />)}<span>MORE</span></div>
    </div>
    <div className="mb-5 flex max-w-full gap-2 overflow-x-auto pb-1" aria-label="Contribution year">
      {sortedYears.map((year) => <button key={year} type="button" onClick={() => setSelectedYear(year)} aria-pressed={year === selectedYear}
        className={`shrink-0 border px-3 py-1 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan ${year === selectedYear ? "border-cyan bg-cyan/10 text-cyan" : "border-line-faint text-paper-dim hover:text-paper"}`}>{year}</button>)}
    </div>
    {historical.isPending && !initial ? <div className="h-28 animate-pulse bg-line-faint/40" role="status"><span className="sr-only">Loading {selectedYear} contributions</span></div>
      : historical.isError && !initial ? <p className="font-mono text-sm text-paper-dim" role="status">Contribution history is temporarily unavailable.</p>
      : selected ? <CalendarYear key={selected.year} calendar={selected} isCurrent={selected.year === sortedYears[0]} /> : null}
  </section>;
}
