"use client";

import { useCallback, useEffect, useSyncExternalStore, useState } from "react";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function getReducedMotionSnapshot() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function getServerReducedMotionSnapshot() {
  return false;
}

export default function Typewriter({
  words,
  className = "",
  typeSpeed = 55,
  deleteSpeed = 28,
  hold = 1800,
}: {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  hold?: number;
}) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const subscribeToReducedMotion = useCallback((onChange: () => void) => {
    const media = window.matchMedia(reducedMotionQuery);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  const reduce = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );

  useEffect(() => {
    if (reduce || words.length === 0) return;

    const current = words[wordIdx % words.length];
    let delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && text === current) {
      delay = hold;
    } else if (deleting && text === "") {
      delay = 350;
    }

    const id = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setWordIdx((i) => (i + 1) % words.length);
      } else {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
        );
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, wordIdx, words, typeSpeed, deleteSpeed, hold, reduce]);

  return (
    <span className={className}>
      {reduce ? (words[0] ?? "") : text}
      <span className="cursor-blink text-cyan">▮</span>
    </span>
  );
}
