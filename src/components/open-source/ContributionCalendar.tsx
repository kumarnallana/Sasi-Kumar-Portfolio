import type { GitHubContributionWeek } from "@/integrations/github/github.types";

const levelClass = {
  NONE: "bg-ink-700/70",
  FIRST_QUARTILE: "bg-cyan/25",
  SECOND_QUARTILE: "bg-cyan/45",
  THIRD_QUARTILE: "bg-cyan/70",
  FOURTH_QUARTILE: "bg-cyan shadow-[0_0_7px_rgba(67,201,255,0.45)]",
} as const;

export default function ContributionCalendar({
  weeks,
  total,
}: {
  weeks: GitHubContributionWeek[];
  total: number;
}) {
  if (weeks.length === 0) return null;

  return (
    <section className="os-card mb-10 border border-line-faint bg-ink-900 p-4 sm:p-5" aria-labelledby="contribution-heading">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="tech-label text-cyan">CONTRIBUTION ARRAY · 12 MONTHS</div>
          <h3 id="contribution-heading" className="mt-1 font-display text-xl font-semibold text-paper">
            {total.toLocaleString()} GitHub contributions
          </h3>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[0.65rem] text-paper-dim" aria-hidden="true">
          <span>LESS</span>
          {Object.values(levelClass).map((className) => (
            <span key={className} className={`h-2.5 w-2.5 border border-line-faint ${className}`} />
          ))}
          <span>MORE</span>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto pb-2" tabIndex={0} aria-label={`GitHub contribution calendar with ${total} contributions in the last 12 months`}>
        <div
          className="min-w-max"
          role="img"
          style={{
            display: "grid",
            gridAutoColumns: "0.65rem",
            gridAutoFlow: "column",
            gridTemplateRows: "repeat(7, 0.65rem)",
            gap: "0.2rem",
          }}
        >
          {weeks.flatMap((week) =>
            week.contributionDays.map((day) => (
              <span
                key={day.date}
                className={`border border-line-faint/70 ${levelClass[day.contributionLevel]}`}
                title={`${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"} on ${new Date(`${day.date}T00:00:00`).toLocaleDateString()}`}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
