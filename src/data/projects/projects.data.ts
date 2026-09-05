import type { Project } from "@/types/projects/project.types";
export const projects: Project[] = [
  {
    id: "zylxy",
    index: "SYS-01",
    name: "Zylxy Technologies: Corporate Website & CRM Platform",
    client: "Zylxy Technology Pvt. Ltd.",
    year: "2026",
    classification: "WEB DEVELOPMENT · CRM WORKFLOWS · PRODUCTION PLATFORM",
    summary:
      "A production corporate platform built with Next.js and React for Zylxy Technologies. I developed responsive interfaces, reusable components, lead-generation workflows, and API-connected forms while improving the application's structure and maintainability during a three-month web development internship.",
    stack: [
      "Next.js",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Server Actions",
      "REST APIs",
    ],
    metrics: [
      { value: "3", label: "Months Internship" },
      { value: "14+", label: "Service Flows" }
    ],
    highlights: [
      "Built reusable responsive components with centralized styling and configuration.",
      "Implemented lead-generation and consultation workflows using Server Actions.",
      "Structured forms into maintainable, domain-focused modules.",
      "Debugged integration and production issues using browser DevTools.",
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
    ],
  },
  {
    id: "mini-social",
    index: "SYS-02",
    name: "Mini Social: Full-Stack Social Platform",
    client: "3W Full-Stack Assessment",
    year: "2026",
    classification: "FULL-STACK ASSESSMENT · AUTHENTICATION · SOCIAL PLATFORM",
    summary:
      "A full-stack social application built for the 3W Full-Stack Internship Assessment using React, Express, and MongoDB. It includes authenticated user sessions, protected feeds, image posts, likes, comments, replies, and mention interactions backed by persistent application data.",
    stack: [
      "React",
      "Express.js",
      "Node.js",
      "MongoDB",
      "JWT",
      "Cloudinary",
    ],
    expandedStack: {
      "Authentication": ["JWT", "bcrypt", "HTTP-only cookies"],
      "Backend": ["Express.js", "Node.js", "REST APIs"],
      "Database": ["MongoDB", "Mongoose"],
      "Frontend": ["React", "JavaScript", "CSS"],
      "Storage": ["Cloudinary"],
      "Tooling": ["pnpm"],
    },
    metrics: [
      { value: "2", label: "MongoDB Collections" },
      { value: "6", label: "Verified Viewport Widths" }
    ],
    highlights: [
      "Built signup and login flows using bcrypt, JWT authentication, and HTTP-only cookie sessions.",
      "Developed protected social features including posts, images, likes, comments, replies, and @mentions.",
      "Designed MongoDB persistence around User and Post models with embedded social interaction data.",
      "Verified authentication, persistence, validation, and responsive behaviour through targeted browser and regression testing.",
    ],
    links: {
      live: "https://mini-social-sk.vercel.app/feed",
      github: "https://github.com/kumarnallana/Mini-Social-Platform",
    },
    image: "/projects/mini-social-preview.png",
    architectureFlow: [
      { label: "CLIENT", stack: "React" },
      { label: "API", stack: "Express / Node" },
      { label: "AUTH / SERVICES", stack: "JWT · bcrypt" },
      { label: "DATA", stack: "MongoDB" }
    ],
  },
  {
    id: "redroot",
    index: "SYS-03",
    name: "Redroot: Interactive Product Experience",
    client: "Grinning Co Assessment",
    year: "2026",
    classification: "FRONTEND ASSESSMENT · INTERACTIVE PRODUCT EXPERIENCE · E2E TESTING",
    summary:
      "An interactive product experience created for the Grinning Co technical assessment using Next.js, React, and TypeScript. The application combines responsive product storytelling, canvas-based visuals, motion-driven interactions, pricing and modal flows, lightweight state management, and automated end-to-end testing.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Playwright",
      "React Context",
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
      "Built a modular Next.js experience with reusable React and TypeScript components.",
      "Created responsive product, ingredient, pricing, modal, and canvas-driven interactions.",
      "Used React Context for lightweight application state and demo session flows.",
      "Added Playwright end-to-end coverage for navigation, interactions, modals, and responsive user journeys.",
    ],
    links: {
      live: "https://redroot-digital-experience.vercel.app/",
      github: "https://github.com/kumarnallana/redroot-digital-experience",
    },
    image: "/projects/redroot-preview.png",
    architectureFlow: [
      { label: "CONTENT", stack: "Next.js / React" },
      { label: "INTERACTION", stack: "Motion / Canvas" },
      { label: "STATE", stack: "React Context" },
      { label: "VERIFICATION", stack: "Playwright" }
    ],
  }
];
