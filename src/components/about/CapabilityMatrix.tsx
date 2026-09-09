import { skillGroups } from "@/data/profile/skills.data";

export default function CapabilityMatrix({ compact = false }: { compact?: boolean }) {
  return (
    <div data-capability-matrix={compact ? "compact" : "full"}>
      <div className={`tech-label ${compact ? "mb-3 text-[0.55rem]" : "mb-5"}`}>
        SUBSYSTEMS · CAPABILITY MATRIX
      </div>
      <div
        className={`grid gap-px border border-line-faint bg-line-faint ${
          compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {skillGroups.map((group) => (
          <div key={group.group} className={`bg-ink-900 ${compact ? "p-3" : "p-4"}`}>
            <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
              <span className={`font-display font-semibold text-paper ${compact ? "text-xs" : "text-sm"}`}>
                {group.group}
              </span>
            </div>
            {compact ? (
              <p className="text-[0.65rem] leading-relaxed text-paper-dim">
                {group.items.join(" · ")}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="border border-line-faint px-2 py-0.5 text-xs text-paper-dim"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
