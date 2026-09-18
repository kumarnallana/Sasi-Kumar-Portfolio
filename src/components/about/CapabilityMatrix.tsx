"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";
import { skillGroups } from "@/data/profile/skills.data";

export default function CapabilityMatrix({ compact = false }: { compact?: boolean }) {
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const handleSkillClick = (item: string) => {
    sound.play("stack-select");
    setActiveSkill(item);
    setTimeout(() => {
      setActiveSkill(null);
      setReviewed((prev) => {
        const next = new Set(prev);
        next.add(item);
        return next;
      });
    }, 450); // 450ms activation sequence
  };

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
              {group.items.map((item) => {
                const isActive = activeSkill === item;
                const isReviewed = reviewed.has(item);
                
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSkillClick(item)}
                    onPointerEnter={(e) => {
                      if (e.pointerType === "mouse") sound.play("skill-confirm");
                    }}
                    className={`group relative flex items-center border text-left transition-colors duration-300 ${
                      compact ? "px-1.5 py-0.5 text-[0.62rem] leading-4" : "px-2 py-0.5 text-xs"
                    } ${
                      isActive
                        ? "border-cyan bg-cyan/20 text-cyan glow-cyan"
                        : isReviewed
                        ? "border-cyan/30 text-cyan bg-ink-900"
                        : "border-line-faint text-paper-dim hover:border-cyan/50 hover:text-cyan hover:bg-cyan/5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan focus-visible:border-cyan"
                    }`}
                  >
                    {/* Hover signal line */}
                    {!isActive && !isReviewed && (
                      <span className="absolute -left-px top-1/2 -translate-y-1/2 h-1/2 w-0.5 bg-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                    {/* Persistent reviewed dot */}
                    {isReviewed && !isActive && (
                      <span className="absolute -right-0.5 -top-0.5 h-1 w-1 rounded-full bg-cyan shadow-[0_0_4px_var(--cyan)]" />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
