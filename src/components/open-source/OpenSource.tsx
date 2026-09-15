"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { github } from "@/data/github/github-display.data";
import SectionHeader from "@/components/shared/SectionHeader";
import { sound } from "@/lib/sound";
import { useGithubPortfolio } from "@/integrations/github/use-github-portfolio";
import AnimatedMetric from "@/components/shared/AnimatedMetric";
import { revealContent } from "@/lib/contentReveal";
import ContributionCalendar from "./ContributionCalendar";
import { usePortfolioAnalytics } from "@/integrations/analytics/use-portfolio-analytics";
import { usePortfolioAppreciation } from "@/integrations/appreciation/use-portfolio-appreciation";
import {
  Activity,
  Eye,
  FolderGit2,
  Heart,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

function SignalMetric({
  label,
  value,
  suffix = "",
  pending = false,
  unavailable = false,
  unavailableLabel = "Temporarily unavailable",
  accent = "cyan",
  icon: Icon,
}: {
  label: string;
  value?: number;
  suffix?: string;
  pending?: boolean;
  unavailable?: boolean;
  unavailableLabel?: string;
  accent?: "cyan" | "amber";
  icon: LucideIcon;
}) {
  const hasValue = typeof value === "number" && Number.isFinite(value);
  const displayUnavailable = unavailable || (!pending && !hasValue);

  return (
    <div className="os-card min-h-28 bg-ink-900 px-4 py-4 sm:min-h-32 sm:px-5 sm:py-5">
      <div className={`font-display text-2xl font-semibold sm:text-3xl ${accent === "amber" ? "text-amber glow-amber" : "text-cyan glow-cyan"}`}>
        {pending ? (
          <span className="animate-pulse" aria-label={`Loading ${label.toLowerCase()}`}>—</span>
        ) : displayUnavailable ? (
          <span aria-label={`${label.toLowerCase()} unavailable`}>—</span>
        ) : (
          <AnimatedMetric value={`${value!.toLocaleString()}${suffix}`} />
        )}
      </div>
      <div className="tech-label mt-2 flex items-center gap-2 leading-relaxed">
        <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-70" strokeWidth={1.6} />
        <span>{label}</span>
      </div>
      {displayUnavailable && <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-paper-dim">{unavailableLabel}</div>}
    </div>
  );
}

function AppreciationMetric() {
  const { data, isPending, toggle, isUpdating } = usePortfolioAppreciation();
  const unavailable = !isPending && !data;

  return (
    <button
      type="button"
      className="os-card min-h-28 bg-ink-900 px-4 py-4 text-left transition-colors hover:bg-ink-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan disabled:cursor-not-allowed disabled:hover:bg-ink-900 sm:min-h-32 sm:px-5 sm:py-5"
      disabled={isPending || unavailable || isUpdating}
      aria-pressed={data?.appreciated ?? false}
      aria-label={data?.appreciated ? "Undo appreciation for this portfolio" : "Appreciate this portfolio"}
      onClick={() => {
        sound.play("blip");
        toggle(!data!.appreciated);
      }}
    >
      <div className="font-display text-2xl font-semibold text-amber glow-amber sm:text-3xl">
        {isPending || unavailable ? "—" : <AnimatedMetric value={data!.count.toLocaleString()} />}
      </div>
      <div className="tech-label mt-2 flex items-center gap-2 leading-relaxed">
        <Heart
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 ${data?.appreciated ? "fill-current text-amber" : "opacity-70"}`}
          strokeWidth={1.6}
        />
        <span>APPRECIATION</span>
      </div>
      <div className="mt-1 font-mono text-[0.58rem] uppercase tracking-wider text-paper-dim">
        {isPending
          ? "Loading stored count"
          : unavailable
            ? "Storage unavailable"
            : data?.appreciated
              ? "Appreciated · tap to undo"
              : "Appreciate this portfolio"}
      </div>
    </button>
  );
}

function ProfileSignal({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className="os-card min-w-0 bg-ink-900 px-4 py-3 sm:px-5">
      <div className="tech-label text-[0.6rem]">{label}</div>
      <div className={`mt-1 truncate font-display text-sm font-semibold sm:text-base ${active ? "text-cyan" : "text-paper"}`} title={value}>
        {value}
      </div>
    </div>
  );
}

export default function OpenSource() {
  const ref = useRef<HTMLDivElement>(null);

  // Single typed query via integration hook
  const { data, isPending, isError } = useGithubPortfolio();
  const { data: analytics, isPending: isAnalyticsPending } = usePortfolioAnalytics();

  const hasRepositories = Boolean(
    data && (data.pinnedRepositories.length > 0 || data.recentRepositories.length > 0),
  );
  const currentContributions = data?.contributionHistory[0];
  const contributionYear = currentContributions?.year ?? "CURRENT-YEAR";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      revealContent(".os-card", {
        scrollTrigger: { trigger: el, start: "top 80%" },
        y: 28,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="signals"
      ref={ref}
      className="relative mx-auto max-w-6xl px-6 pt-8 pb-16 md:px-10 md:pt-12 md:pb-24"
    >
      <SectionHeader
        index="03"
        title="OPEN-SOURCE SIGNALS"
        caption="Public repositories and activity sourced directly from GitHub."
      />

      <div className="mb-10" aria-busy={isPending || isAnalyticsPending} aria-live="polite">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="tech-label text-cyan">PUBLIC ENGINEERING TELEMETRY</div>
            <h3 className="mt-1 font-display text-xl font-semibold text-paper">GitHub & portfolio stats</h3>
          </div>
          <a
            href={github.url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sound.play("hover")}
            className="group font-mono text-sm text-paper-dim transition-colors hover:text-cyan"
          >
            @{github.handle} <span className="inline-block transition-transform group-hover:translate-x-0.5">↗</span>
          </a>
        </div>

        <div data-testid="signal-grid" className="grid grid-cols-2 gap-px border border-line-faint bg-line-faint sm:grid-cols-3 lg:grid-cols-6">
          <SignalMetric
            label="PORTFOLIO VIEWS"
            value={analytics?.pageviews}
            pending={isAnalyticsPending}
            unavailableLabel="Analytics unavailable"
            accent="amber"
            icon={Eye}
          />
          <AppreciationMetric />
          <SignalMetric label={`${contributionYear} CONTRIBUTIONS`} value={currentContributions?.totalContributions} pending={isPending} unavailable={isError} icon={Activity} />
          <SignalMetric label="GITHUB STARS" value={data?.totalStars} pending={isPending} unavailable={isError} accent="amber" icon={Star} />
          <SignalMetric label="PUBLIC REPOS" value={data?.publicReposCount} pending={isPending} unavailable={isError} icon={FolderGit2} />
          <SignalMetric label="FOLLOWERS" value={data?.followersCount} pending={isPending} unavailable={isError} icon={Users} />
        </div>

        {!isPending && (
          <div className="grid gap-px border-x border-b border-line-faint bg-line-faint sm:grid-cols-2 lg:grid-cols-4">
            <ProfileSignal label="AVAILABLE FOR WORK" value={data ? (data.isHireable ? "I AM AVAILABLE TO WORK" : "NOT MARKED AVAILABLE") : "—"} active={Boolean(data?.isHireable)} />
            <ProfileSignal label="FOLLOWING" value={data ? data.followingCount.toLocaleString() : "—"} />
            <ProfileSignal label="GITHUB LOCATION" value={data?.location ?? (isError ? "—" : "NOT LISTED")} />
            <ProfileSignal label="GITHUB COMPANY" value={data?.company ?? (isError ? "—" : "NOT LISTED")} />
          </div>
        )}
      </div>

      {!isPending && !isError && data && (
        <ContributionCalendar history={data.contributionHistory} availableYears={data.contributionYears} />
      )}

      {isPending ? (
        <div className="os-card grid min-h-64 gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading GitHub repositories">
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex min-h-48 flex-col justify-between bg-ink-900 p-5">
              <span className="h-3 w-24 animate-pulse bg-line-faint" />
              <span className="h-5 w-3/4 animate-pulse bg-line-faint" />
              <span className="h-3 w-full animate-pulse bg-line-faint" />
            </div>
          ))}
          <span className="sr-only">Syncing GitHub signals</span>
        </div>
      ) : isError ? (
        <div className="os-card flex min-h-64 flex-col items-center justify-center border border-line-faint bg-ink-900 p-5 text-center" role="status">
           <span className="tech-label text-amber">LIVE GITHUB SIGNAL TEMPORARILY UNAVAILABLE</span>
           <span className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">The portfolio remains available while this section reconnects automatically.</span>
        </div>
      ) : (
        <>
          {/* Repositories Display Logic */}
          {data?.pinnedRepositories && data.pinnedRepositories.length > 0 ? (
            <div className="mb-12">
              <h3 className="mb-4 font-display text-xl font-semibold text-paper">Featured Repositories</h3>
              <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3">
                {data.pinnedRepositories.map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.play("hover")}
                    className="os-card group flex flex-col bg-ink-900 p-5 transition-colors hover:bg-ink-800 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                      <div className="absolute top-2 -right-6 w-24 transform rotate-45 bg-amber bg-opacity-20 text-center text-[0.5rem] font-bold tracking-widest text-amber py-0.5 border-y border-amber border-opacity-30">
                        PINNED
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="tech-label flex items-center gap-2 text-cyan">
                        {r.primaryLanguage?.color && (
                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: r.primaryLanguage.color }}></span>
                        )}
                        {r.primaryLanguage?.name ?? "LANGUAGE NOT REPORTED"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-sm text-paper-dim transition-colors group-hover:text-amber">
                        {r.stargazerCount} ★
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-lg font-semibold text-paper group-hover:underline">
                      {r.name}
                    </h4>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-paper-dim">
                      {r.description || "No description provided."}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ) : data?.recentRepositories && data.recentRepositories.length > 0 ? (
            <div>
              <h3 className="mb-4 font-display text-lg font-medium text-paper-dim">Recent Activity</h3>
              <div className="grid gap-px border border-line-faint bg-line-faint md:grid-cols-2 lg:grid-cols-3 opacity-90">
                {data.recentRepositories.slice(0, 6).map((r) => (
                  <a
                    key={r.name}
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    onMouseEnter={() => sound.play("hover")}
                    className="os-card group flex flex-col bg-ink-900 p-5 transition-colors hover:bg-ink-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="tech-label flex items-center gap-2 text-paper-dim group-hover:text-cyan transition-colors">
                        {r.primaryLanguage?.color && (
                          <span className="w-1.5 h-1.5 rounded-full inline-block opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: r.primaryLanguage.color }}></span>
                        )}
                        {r.primaryLanguage?.name ?? "LANGUAGE NOT REPORTED"}
                      </span>
                      <span className="flex items-center gap-1 font-mono text-sm text-paper-dim transition-colors group-hover:text-amber">
                        {r.stargazerCount} ★
                      </span>
                    </div>
                    <h4 className="mt-4 font-display text-md font-semibold text-paper-dim group-hover:text-paper group-hover:underline transition-colors">
                      {r.name}
                    </h4>
                    <div className="mt-4 tech-label text-[0.6rem] text-line-dim">
                      UPDATED: {new Date(r.updatedAt).toLocaleDateString()}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ) : !hasRepositories ? (
            <div className="os-card flex min-h-64 flex-col items-center justify-center border border-line-faint bg-ink-900 p-5 text-center" role="status">
               <span className="tech-label text-paper-dim">NO PUBLIC REPOSITORY ACTIVITY</span>
               <span className="mt-2 max-w-md text-sm leading-relaxed text-paper-dim">GitHub responded successfully, but no public repositories are available for this account.</span>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}
