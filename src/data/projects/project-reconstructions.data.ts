import type { Reconstruction } from "@/types/projects/reconstruction.types";

export const zylxyReconstruction: Reconstruction = {
  graph: {
    nodes: [
      { id: "ui", label: "Lead Form", sub: "Next.js UI", x: 20, y: 50, kind: "client" },
      { id: "network", label: "Network Layer", sub: "Browser DevTools", x: 50, y: 50, kind: "edge" },
      { id: "crm", label: "HubSpot CRM", sub: "External", x: 80, y: 50, kind: "external" }
    ],
    edges: [
      { from: "ui", to: "network", label: "submit" },
      { from: "network", to: "crm", label: "payload" }
    ]
  },
  phases: [
    {
      at: "REPORT",
      title: "Submission Failure",
      note: "The website appeared to submit lead-generation forms successfully, but submitted information was not reaching the CRM.",
      add: ["ui", "network"],
      commit: "fix: initiate investigation into silent form failures",
      stress: "ui",
      stressMsg: "Silent Failure - UI success but no data"
    },
    {
      at: "INVESTIGATION",
      title: "Network Inspection",
      note: "Used browser DevTools to inspect Network requests and traced the failed integration behavior.",
      add: ["crm"],
      commit: "test: trace payload lifecycle via DevTools",
      stress: "network",
      stressMsg: "Request Dropped"
    },
    {
      at: "IDENTIFICATION",
      title: "Validation Issue",
      note: "Identified a HubSpot reCAPTCHA validation issue silently blocking the request at the integration layer.",
      add: [],
      commit: "debug: isolated reCAPTCHA token mismatch",
      stress: "crm",
      stressMsg: "reCAPTCHA Validation Error"
    },
    {
      at: "RESOLUTION",
      title: "Integration Corrected",
      note: "Applied required integration changes, retested across multiple services, and validated that submissions reached the CRM.",
      add: [],
      commit: "fix: correct token payload and revalidate flow",
      resolve: "crm",
      fix: "Integration Verified"
    }
  ]
};

export const miniSocialReconstruction: Reconstruction = {
  graph: {
    nodes: [
      { id: "auth", label: "Auth Boundary", sub: "Client/Server", x: 20, y: 20, kind: "client" },
      { id: "api", label: "API Routing", sub: "Express", x: 50, y: 20, kind: "service" },
      { id: "model", label: "Data Model", sub: "MongoDB", x: 80, y: 20, kind: "data" },
      { id: "social", label: "Social Interactions", sub: "Controller", x: 50, y: 50, kind: "service" },
      { id: "storage", label: "Image Storage", sub: "Persistence", x: 80, y: 50, kind: "external" },
      { id: "client", label: "Client Update", sub: "React UI", x: 20, y: 50, kind: "client" }
    ],
    edges: [
      { from: "auth", to: "api", label: "verify" },
      { from: "api", to: "model", label: "schema" },
      { from: "api", to: "social", label: "route" },
      { from: "social", to: "storage", label: "upload" },
      { from: "social", to: "client", label: "response" }
    ]
  },
  phases: [
    {
      at: "01",
      title: "Auth Boundary",
      note: "Constructed the end-to-end signup and login flows utilizing bcrypt for secure password hashing and JWT via HTTP-only cookie sessions.",
      add: ["auth", "api"],
      commit: "feat: implement credential-based auth and JWT sessions"
    },
    {
      at: "02",
      title: "API Routing",
      note: "Developed the core Express API router logic enforcing strict real/demo execution boundaries to prevent false authentication states.",
      add: ["model"],
      commit: "feat: build secure api routing architecture"
    },
    {
      at: "03",
      title: "Data Model",
      note: "Enforced a two-collection MongoDB architecture strictly separating User models from Post models with embedded interaction data.",
      add: [],
      commit: "feat: define mongodb schemas and models",
      stress: "model",
      stressMsg: "Schema validation enforced"
    },
    {
      at: "04",
      title: "Social Interactions",
      note: "Designed protected social interaction capabilities including posts, persistent likes, comments, nested replies, and server-resolved @mentions.",
      add: ["social"],
      commit: "feat: add social endpoints and mention resolution"
    },
    {
      at: "05",
      title: "Image Storage",
      note: "Implemented flexible image persistence supporting both local environment storage and optional Cloudinary-backed production storage.",
      add: ["storage"],
      commit: "feat: integrate multipart upload and cloudinary"
    },
    {
      at: "06",
      title: "Client Update",
      note: "Wired up the React frontend to seamlessly reflect state changes, handle validations, and update optimistic UI components.",
      add: ["client"],
      commit: "feat: finalize client interactions and feed state",
      resolve: "client",
      fix: "End-to-End Flow Complete"
    }
  ]
};

export const redrootReconstruction: Reconstruction = {
  graph: {
    nodes: [
      { id: "app", label: "App Router", sub: "Next.js", x: 20, y: 35, kind: "client" },
      { id: "canvas", label: "Visual / Canvas", sub: "Motion", x: 50, y: 20, kind: "service" },
      { id: "motion", label: "Motion System", sub: "Scroll", x: 80, y: 20, kind: "service" },
      { id: "story", label: "Product Story", sub: "Experience", x: 80, y: 50, kind: "service" },
      { id: "state", label: "Interaction State", sub: "Context", x: 50, y: 50, kind: "data" },
      { id: "e2e", label: "E2E Verification", sub: "Playwright", x: 20, y: 65, kind: "external" },
      { id: "responsive", label: "Responsive", sub: "Layout", x: 50, y: 80, kind: "client" }
    ],
    edges: [
      { from: "app", to: "canvas", label: "init" },
      { from: "canvas", to: "motion", label: "animate" },
      { from: "motion", to: "story", label: "reveal" },
      { from: "story", to: "state", label: "interact" },
      { from: "app", to: "responsive", label: "render" },
      { from: "state", to: "e2e", label: "test" }
    ]
  },
  phases: [
    {
      at: "01",
      title: "App Router Initialization",
      note: "Established the Next.js App Router architecture, setting up modular components, reusable UI primitives, and the overall page structure.",
      add: ["app"],
      commit: "feat: scaffold App Router architecture"
    },
    {
      at: "02",
      title: "Visual & Canvas Layer",
      note: "Integrated custom HTML5 canvas capabilities and initial visual storytelling elements to serve as the foundation of the experience.",
      add: ["canvas"],
      commit: "feat: implement custom canvas and visual primitives"
    },
    {
      at: "03",
      title: "3D + Motion System",
      note: "Developed the core motion sequences utilizing Motion for scroll-driven reveals, smooth transitions, gestures, and micro-interactions.",
      add: ["motion"],
      commit: "feat: orchestrate scroll-driven motion layer"
    },
    {
      at: "04",
      title: "Product Story",
      note: "Assembled the interactive product showcase, dynamic ingredient breakdowns, and pricing sections directly tied to scroll positioning.",
      add: ["story"],
      commit: "feat: construct interactive product experience sections",
      stress: "story",
      stressMsg: "Scroll thresholds met"
    },
    {
      at: "05",
      title: "Interaction State",
      note: "Implemented lightweight session management using React Context to seamlessly manage demo authentication and modal UI flows.",
      add: ["state"],
      commit: "feat: integrate context for demo session flows"
    },
    {
      at: "06",
      title: "Responsive Experience",
      note: "Refined layouts and interaction boundaries across all breakpoints to guarantee a unified experience from mobile up to large desktop viewports.",
      add: ["responsive"],
      commit: "feat: optimize responsive journeys and breakpoints"
    },
    {
      at: "07",
      title: "E2E Verification",
      note: "Added comprehensive Playwright testing suites covering navigation matrices, ingredient interactions, modal behaviors, and overall user flow.",
      add: ["e2e"],
      commit: "test: verify critical paths via Playwright E2E",
      resolve: "e2e",
      fix: "Experience Flow Validated"
    }
  ]
};
