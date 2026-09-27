"use client";

import { useIsDesktop } from "@/hooks/useIsMobile";
import dynamic from "next/dynamic";

const HeroDesktopSystemInner = dynamic(
  () => import("@/components/hero/HeroDesktopSystemInner"),
  { ssr: false },
);

export default function HeroDesktopSystem() {
  const isDesktop = useIsDesktop();
  return (
    <div className="hidden h-[42vh] min-h-[320px] w-full md:block lg:h-[78vh]">
      {isDesktop ? <HeroDesktopSystemInner /> : null}
    </div>
  );
}
