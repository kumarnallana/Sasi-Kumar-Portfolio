import { skillGroups } from "@/data/profile/skills.data";

export default function CapabilityMatrix({ compact = false }: { compact?: boolean }) {
  return (
    <div data-capability-matrix={compact ? "compact" : "full"}>
      <div className={`tech-label ${compact ? "mb-3 text-[0.55rem]" : "mb-5"}`}>
        SUBSYSTEMS · CAPABILITY MATRIX
      </div>
      <div
        className={`grid gap-px border border-line-faint bg-line-faint ${
          compact ? "grid-cols-1 sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"
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
            {compact ? (
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-paper-dim">
                {group.items.map((item) => (
                  <li key={item} className="whitespace-nowrap">{item}</li>
                ))}
              </ul>
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
