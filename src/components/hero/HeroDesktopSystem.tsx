"use client";

import React from "react";
import { useIsDesktop } from "@/hooks/useIsMobile";

const HeroDesktopSystemInner = React.lazy(
  () => import("@/components/hero/HeroDesktopSystemInner")
);

export default function HeroDesktopSystem() {
  const isDesktop = useIsDesktop();
  return (
    <div className="hidden h-[42vh] min-h-[320px] w-full md:block lg:h-[78vh]">
      {isDesktop ? (
        <React.Suspense fallback={null}>
          <HeroDesktopSystemInner />
        </React.Suspense>
      ) : null}
    </div>
  );
}
