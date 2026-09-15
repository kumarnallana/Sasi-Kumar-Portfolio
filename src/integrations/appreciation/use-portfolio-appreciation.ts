"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PortfolioAppreciation,
  PortfolioAppreciationResponse,
} from "./portfolio-appreciation.types";

const queryKey = ["portfolio-appreciation"] as const;

export function usePortfolioAppreciation() {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<PortfolioAppreciation | null> => {
      const response = await fetch("/api/appreciation", { cache: "no-store" });
      if (!response.ok) return null;
      const payload = (await response.json()) as PortfolioAppreciationResponse;
      return payload.available ? payload : null;
    },
    staleTime: 60_000,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: async (appreciated: boolean): Promise<PortfolioAppreciation> => {
      const response = await fetch("/api/appreciation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appreciated }),
      });
      const payload = (await response.json()) as PortfolioAppreciationResponse;
      if (!response.ok || !payload.available) throw new Error("Appreciation unavailable");
      return payload;
    },
    onMutate: async (appreciated) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PortfolioAppreciation | null>(queryKey);
      if (previous) {
        queryClient.setQueryData<PortfolioAppreciation>(queryKey, {
          available: true,
          appreciated,
          count: Math.max(0, previous.count + (appreciated ? 1 : -1)),
        });
      }
      return { previous };
    },
    onError: (_error, _appreciated, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSuccess: (result) => queryClient.setQueryData(queryKey, result),
  });

  return { ...query, toggle: mutation.mutate, isUpdating: mutation.isPending };
}
