"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedMetricProps {
  value: string | number;
  className?: string;
}

export default function AnimatedMetric({ value, className = "" }: AnimatedMetricProps) {
  const [animation, setAnimation] = useState<{
    source: string;
    display: string | number;
  } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animatedRef = useRef(false);

  const stringValue = String(value);
  const displayValue = animation?.source === stringValue ? animation.display : value;

  useEffect(() => {
    // If reduced motion is preferred, just show the final value.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    if (animatedRef.current) return;

    // Match numbers with possible prefixes/suffixes (e.g., 14+, ~60%, 1,000+)
    const match = stringValue.match(/^(\D*)([\d,.]+)(\D*)$/);
    if (!match) return; // Not a standard numeric format, keep static

    const prefix = match[1];
    const numStr = match[2];
    const suffix = match[3];

    // Remove commas for parsing
    const targetNum = parseFloat(numStr.replace(/,/g, ""));
    if (isNaN(targetNum)) return;

    const el = ref.current;
    if (!el) return;

    let frame = 0;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          observerRef.current?.disconnect();

          let startTime: number | null = null;
          const duration = 800; // 800ms duration for count-up

          const formatNumber = (num: number) => {
            const rounded = Math.round(num);
            const formatted = numStr.includes(",")
              ? rounded.toLocaleString()
              : rounded.toString();
            return `${prefix}${formatted}${suffix}`;
          };

          // Set to 0 at the start of intersection
          setAnimation({ source: stringValue, display: formatNumber(0) });

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // easeOutExpo for smooth deceleration
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentNum = easeProgress * targetNum;

            setAnimation({ source: stringValue, display: formatNumber(currentNum) });

            if (progress < 1) {
              frame = requestAnimationFrame(animate);
            } else {
              setAnimation(null);
            }
          };

          frame = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 } // Trigger when 25% visible
    );

    observerRef.current.observe(el);

    return () => {
      observerRef.current?.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [stringValue]);

  return (
    <span ref={ref} className={className}>
      {displayValue}
    </span>
  );
}
