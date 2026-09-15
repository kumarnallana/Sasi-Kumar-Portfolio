"use client";

import dynamic from "next/dynamic";
import { useIsDesktop } from "@/hooks/useIsMobile";

const HeroDesktopSystemInner = dynamic(
  () => import("@/components/hero/HeroDesktopSystemInner"),
  { ssr: false },
);

export default function HeroDesktopSystem() {
  const isDesktop = useIsDesktop();
  return isDesktop ? <HeroDesktopSystemInner /> : null;
}
