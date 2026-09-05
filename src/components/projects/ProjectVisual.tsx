"use client";

import Image from "next/image";
import { sound } from "@/lib/sound";

interface ProjectVisualProps {
  name: string;
  image?: string;
  liveUrl?: string;
}

export default function ProjectVisual({
  name,
  image,
  liveUrl,
}: ProjectVisualProps) {
  return (
    <div className="relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60">
      {/* ── Viewport shell ─────────────────────────────────────────── */}
      <div className="relative flex w-full min-w-0 bg-ink-900">
        
        {/* ── PREVIEW PANEL ──────────────────────────────────────── */}
        <div className="relative aspect-video w-full h-full flex">
          {image ? (
            <div className="group/preview relative w-full h-full">
              <Image
                src={image}
                alt={`${name} preview`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-top opacity-90 transition-all duration-300 ease-out group-hover/preview:scale-[1.01] group-hover/preview:opacity-100"
              />
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => sound.play("blip")}
                  className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-300 ease-out group-hover/preview:bg-ink-900/55 group-hover/preview:opacity-100 focus-visible:opacity-100 focus-visible:bg-ink-900/55"
                >
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-paper border border-paper/30 px-4 py-2 bg-ink-900/60 transition-colors hover:text-cyan hover:border-cyan">
                    VIEW LIVE SITE ↗
                  </span>
                </a>
              )}
            </div>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
              <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
              <div className="relative flex flex-col items-center justify-center text-center px-4">
                <span className="font-display text-xl font-semibold text-paper-dim/80">
                  {name}
                </span>
                <span className="mt-2 text-xs font-mono text-paper-dim/50">
                  Preview image not yet available
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
