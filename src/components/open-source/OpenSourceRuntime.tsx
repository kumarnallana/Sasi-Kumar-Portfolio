"use client";

import QueryProvider from "@/providers/query-provider";
import OpenSource from "@/components/open-source/OpenSource";

export default function OpenSourceRuntime() {
  return (
    <QueryProvider>
      <OpenSource />
    </QueryProvider>
  );
}
