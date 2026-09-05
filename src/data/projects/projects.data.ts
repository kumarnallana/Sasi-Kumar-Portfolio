import type { Project } from "@/types/projects/project.types";
export const projects: Project[] = [
  {
    id: "zylxy",
    index: "SYS-01",
    name: "Zylxy Technologies — Corporate Website & CRM Consulting Platform",
    client: "Zylxy Technology Pvt. Ltd.",
    year: "2026",
    classification: "WEB DEVELOPMENT · CORPORATE PLATFORM · CRM WORKFLOWS",
    summary:
      "A production-focused corporate website and CRM consulting platform built using Next.js and React. I worked on translating business requirements into responsive web interfaces, reusable components, lead-generation forms and API-driven workflows while improving the maintainability and structure of the application.",
    stack: [
      "Next.js",
      "React.js",
      "JavaScript",
      "Tailwind CSS",
      "Server Actions",
      "REST APIs",
      "Lucide React",
      "Framer Motion"
    ],
    metrics: [
      { value: "3", label: "Months Internship" },
      { value: "14+", label: "Service Flows" }
    ],
    highlights: [
      "Reusable responsive components and centralized styling/configuration",
      "Lead-generation workflows and consultation forms via Server Actions",
      "Modular, domain-oriented form architecture",
      "End-to-end integration and production debugging via DevTools",
    ],
    links: {
      live: "https://zylxytech.com/"
    },
    image: "/projects/zylxy-preview.png",
    architectureFlow: [
      { label: "CLIENT", stack: "Next.js / React" },
      { label: "APPLICATION", stack: "Server Actions" },
      { label: "INTEGRATIONS", stack: "REST / CRM" },
      { label: "OUTCOME", stack: "Lead Capture" }
    ]
  },
  {
    id: "mini-social",
    index: "SYS-02",
    name: "Mini Social — Full-Stack Social Platform",
    client: "3W Full-Stack Assessment",
    year: "2026",
    classification: "FULL-STACK ASSESSMENT · AUTHENTICATION · SOCIAL INTERACTIONS · API ARCHITECTURE",
    summary:
      "A full-stack social application developed for the 3W Full-Stack Internship Assessment using React, Express and MongoDB.\n\nThe system implements credential-based authentication, protected social feeds, image-enabled posts, persistent likes, comments, one-level replies and server-resolved @mentions while maintaining a strict separation between real API behavior and the explicitly labelled local demo environment.",
    stack: [
      "React",
      "Express.js",
      "Node.js",
      "MongoDB",
      "Mongoose",
      "JavaScript",
      "JWT",
      "bcrypt",
      "REST APIs",
      "Cloudinary",
      "CSS",
      "pnpm"
    ],
    metrics: [
      { value: "2", label: "MongoDB Collections" },
      { value: "6", label: "Verified Viewport Widths" }
    ],
    highlights: [
      "Built end-to-end signup and login flows with bcrypt password hashing, JWT authentication and HTTP-only cookie sessions.",
      "Designed protected social interactions including posts, image uploads, likes, comments, replies and ID-backed @mention autocomplete.",
      "Enforced a two-collection MongoDB architecture using User and Post models with embedded social interaction data.",
      "Implemented resilient real/demo execution boundaries so API failures never become false successful authentication states.",
      "Added local image persistence with optional Cloudinary-backed production storage.",
      "Verified authentication, validation, persistence and responsive behavior through targeted regression tests and browser testing."
    ],
    links: {
      github: "https://github.com/kumarnallana/Mini-Social"
    },
    image: "/projects/mini-social-preview.png",
    architectureFlow: [
      { label: "CLIENT", stack: "React" },
      { label: "API", stack: "Express / Node" },
      { label: "AUTH / SERVICES", stack: "JWT · bcrypt" },
      { label: "DATA", stack: "MongoDB" }
    ]
  },
  {
    id: "redroot",
    index: "SYS-03",
    name: "Redroot — Interactive Product Experience",
    client: "Grinning Co Assessment",
    year: "2026",
    classification: "FRONTEND ASSESSMENT · IMMERSIVE PRODUCT EXPERIENCE · MOTION SYSTEM · E2E TESTING",
    summary:
      "An immersive product-focused digital experience developed for the Grinning Co technical assessment using Next.js, React, and TypeScript.\n\nThe application combines responsive product storytelling, interactive product and ingredient experiences, canvas-driven visuals, scroll-based motion, pricing interactions, modal flows, lightweight session management, and automated end-to-end validation within a modular Next.js App Router architecture.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Playwright",
      "React Context",
      "Canvas",
      "Notion",
      "Lucide React",
      "Radix UI",
      "Flow"
    ],
    expandedStack: {
      "Core Framework & Language": ["Next.js 14.2.15", "React 18", "TypeScript 5"],
      "Styling & Design System": ["Tailwind CSS 3.4.1", "PostCSS 8", "clsx", "tailwind-merge"],
      "UI & Component Primitives": ["Lucide React", "Radix UI Slot"],
      "Animation & Interactive Graphics": ["Motion 13.1", "HTML5 Canvas API"],
      "State Management": ["React Context API"],
      "Testing & Code Quality": ["Playwright", "ESLint", "eslint-config-next"],
      "Workflow & Product Tools": ["Flow", "Notion"]
    },
    metrics: [
      { value: "12", label: "Modular Experience Sections" },
      { value: "3", label: "Playwright E2E Suites" }
    ],
    highlights: [
      "Built a modular Next.js App Router experience using reusable React and TypeScript components across product-focused sections.",
      "Developed interactive visual experiences using Motion, HTML5 Canvas, and supporting animation tooling for scroll-driven reveals, transitions, gestures, and micro-interactions.",
      "Created interactive product showcase, ingredient, pricing, lead-generation, video, and modal experiences with responsive behavior across device sizes.",
      "Implemented lightweight application state using React Context for demo authentication and session-related UI flows.",
      "Structured the application around reusable components, data modules, hooks, utilities, and shared UI primitives.",
      "Added Playwright end-to-end testing for navigation, interaction matrices, ingredient behavior, modal flows, contact interactions, and responsive user journeys.",
      "Used supporting product-development and workflow tools including Flow, and Notion as part of the project workflow."
    ],
    links: {
      github: "https://github.com/kumarnallana/Grinning-Co-Internshala-Assessment"
    },
    image: "/projects/redroot-preview.png",
    architectureFlow: [
      { label: "CONTENT", stack: "Next.js / React" },
      { label: "INTERACTION", stack: "Motion / Canvas" },
      { label: "STATE", stack: "React Context" },
      { label: "VERIFICATION", stack: "Playwright" }
    ]
  }
];
