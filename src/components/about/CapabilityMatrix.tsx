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
          <div key={group.group} className="bg-ink-900 p-4">
            <div className={`flex items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
              <span className="mobile-signal-dot h-1.5 w-1.5 shrink-0 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
              <span className="font-display text-sm font-semibold text-paper">
                {group.group}
              </span>
            </div>
            <div className={`flex flex-wrap ${compact ? "gap-1" : "gap-1.5"}`}>
                {group.items.map((item) => (
                  <span
                    key={item}
                    className={`border border-line-faint text-paper-dim ${compact ? "px-1.5 py-0.5 text-[0.62rem] leading-4" : "px-2 py-0.5 text-xs"}`}
                  >
                    {item}
                  </span>
                ))}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
