"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LazyMount({
  children,
  fallback,
  rootMargin = "200px",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, rootMargin]);

  return <div ref={ref} className="contents">{inView ? children : fallback}</div>;
}
