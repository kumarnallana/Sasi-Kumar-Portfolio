"use client";

import { useEffect } from "react";
import {
  Analytics,
  type BeforeSendEvent,
} from "@vercel/analytics/next";

const OWNER_OPT_OUT_KEY = "nsk.analytics.ownerOptOut";
const OWNER_COMMAND_PARAM = "nsk-analytics";

function applyOwnerAnalyticsCommand() {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  const command = url.searchParams.get(OWNER_COMMAND_PARAM);
  if (command !== "off" && command !== "on") return;

  try {
    if (command === "off") {
      window.localStorage.setItem(OWNER_OPT_OUT_KEY, "true");
    } else {
      window.localStorage.removeItem(OWNER_OPT_OUT_KEY);
    }
  } catch {
    // If browser storage is unavailable, preserve normal visitor analytics.
  }

  url.searchParams.delete(OWNER_COMMAND_PARAM);
  const query = url.searchParams.toString();
  window.history.replaceState(
    window.history.state,
    "",
    `${url.pathname}${query ? `?${query}` : ""}${url.hash}`,
  );
}

function filterOwnerTraffic(event: BeforeSendEvent) {
  if (typeof window === "undefined") return event;

  applyOwnerAnalyticsCommand();

  try {
    return window.localStorage.getItem(OWNER_OPT_OUT_KEY) === "true"
      ? null
      : event;
  } catch {
    return event;
  }
}

export default function PortfolioWebAnalytics() {
  useEffect(() => {
    applyOwnerAnalyticsCommand();
  }, []);

  return <Analytics beforeSend={filterOwnerTraffic} />;
}
