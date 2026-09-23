"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

export default function SoundToggle() {
  const [on, setOn] = useState(sound.enabled);

  useEffect(() => {
    const unsub = sound.subscribe(setOn);
    return unsub;
  }, []);

  return (
    <button
      suppressHydrationWarning
      onClick={() => sound.toggle()}
      onMouseEnter={() => sound.play("hover")}
      aria-label={on ? "Mute audio" : "Enable audio"}
      className="pointer-events-auto group flex items-center gap-2 border border-line-faint bg-ink-900/70 px-3 py-1.5 backdrop-blur transition-colors hover:border-cyan"
    >
      <span className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-3 w-[2px] origin-bottom transition-[transform,background-color] duration-300 ${
              on ? "bg-cyan" : "bg-line-dim"
            }`}
            style={{
              transform: on
                ? `scaleY(${(4 + ((i * 3 + 5) % 9)) / 12})`
                : "scaleY(0.25)",
              animation: on
                ? `eq 0.9s ease-in-out ${i * 0.12}s infinite alternate`
                : "none",
            }}
          />
        ))}
      </span>
      <span className="telemetry-text">
        {on ? "AUDIO ON" : "AUDIO OFF"}
      </span>
      <style jsx>{`
        @keyframes eq {
          from {
            transform: scaleY(0.25);
          }
          to {
            transform: scaleY(1);
          }
        }
      `}</style>
    </button>
  );
}
