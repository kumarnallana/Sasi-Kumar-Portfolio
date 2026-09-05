"use client";

import Image from "next/image";
import { sound } from "@/lib/sound";

interface ProjectPreviewProps {
  name: string;
  image?: string;
  stackPreview: string; // E.g., "React · Express · MongoDB · JWT"
}

export default function ProjectPreview({ name, image, stackPreview }: ProjectPreviewProps) {
  return (
    <div
      className="group relative flex w-full flex-col overflow-hidden border border-line-faint bg-ink-900/60"
      onMouseEnter={() => sound.play("hover")}
    >
      {/* Top Bar */}
      <div className="flex h-8 items-center border-b border-line-faint bg-ink-900/80 px-3">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 rounded-full bg-line-faint group-hover:bg-amber transition-colors duration-300" />
          <div className="h-2 w-2 rounded-full bg-line-faint group-hover:bg-cyan transition-colors duration-300" />
          <div className="h-2 w-2 rounded-full bg-line-faint transition-colors duration-300" />
        </div>
        <div className="ml-3 flex-1 text-center font-mono text-[0.55rem] uppercase tracking-[0.2em] text-paper-dim/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          SYS.PREVIEW
        </div>
      </div>

      {/* Main Visual Area */}
      <div className="relative flex aspect-video w-full items-center justify-center bg-ink-900 overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={`${name} preview`}
            fill
            className="object-cover object-top opacity-90 transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:opacity-100"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-ink-900 overflow-hidden">
            <div className="pointer-events-none absolute inset-0 blueprint-grid opacity-20" />
            <div className="relative flex flex-col items-center justify-center text-center px-4">
              <span className="font-display text-xl font-semibold text-paper-dim/80 group-hover:text-cyan transition-colors duration-300">
                {name}
              </span>
              <span className="mt-2 text-xs font-mono text-paper-dim/50">
                AWAITING VISUAL CAPTURE
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Stack */}
      <div className="border-t border-line-faint bg-ink-900/80 px-4 py-2.5">
        <div className="truncate text-center font-mono text-[0.6rem] uppercase tracking-wider text-paper-dim/70">
          {stackPreview}
        </div>
      </div>
    </div>
  );
}
