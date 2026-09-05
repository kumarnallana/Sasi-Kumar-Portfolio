import { skillGroups } from "@/data/profile/skills.data";

export default function CapabilityMatrix({ className = "" }: { className?: string }) {
  return (
    <div className={`capability-matrix ${className}`}>
      <div className="tech-label mb-5">SUBSYSTEMS · CAPABILITY MATRIX</div>
      <div className="grid gap-px border border-line-faint bg-line-faint sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g) => (
          <div key={g.group} className="bg-ink-900 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_var(--cyan)]" />
              <span className="font-display text-sm font-semibold text-paper">
                {g.group}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((it) => (
                <span
                  key={it}
                  className="border border-line-faint px-2 py-0.5 text-xs text-paper-dim"
                >
                  {it}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
