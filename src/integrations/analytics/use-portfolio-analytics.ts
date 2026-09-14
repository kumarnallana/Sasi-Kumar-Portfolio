"use client";

import { useQuery } from "@tanstack/react-query";
import type { PortfolioAnalytics } from "./portfolio-analytics.types";

type AnalyticsResponse = PortfolioAnalytics | { available: false };

export function usePortfolioAnalytics() {
  return useQuery({
    queryKey: ["portfolio-analytics"],
    queryFn: async (): Promise<PortfolioAnalytics | null> => {
      const response = await fetch("/api/portfolio-analytics", { cache: "no-store" });
      if (!response.ok) return null;

      const payload = (await response.json()) as AnalyticsResponse;
      return "available" in payload ? null : payload;
    },
    staleTime: 60 * 60 * 1000,
    retry: false,
  });
}
