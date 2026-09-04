import type { Project } from "@/types/projects/project.types";

export const projects: Project[] = [
  {
    id: "zylxy",
    index: "SYS-01",
    name: "Zylxy Technologies: Corporate Website and CRM Platform",
    client: "Zylxy Technology Pvt. Ltd.",
    year: "2026",
    classification: "CORPORATE WEB PLATFORM · CRM WORKFLOWS · NEXT.JS",
    summary:
      "During my internship at Zylxy Technology, I contributed to a corporate website and CRM consulting platform using Next.js and React. My work focused on reusable responsive UI, lead-generation forms, REST integrations, and end-to-end debugging.",
    stack: [
      "Next.js",
      "React",
      "JavaScript",
      "Tailwind CSS",
      "Server Actions",
      "REST APIs",
      "Lucide React"
    ],
    metrics: [
      { value: "3 MO", label: "Web Development Internship" },
      { value: "14+", label: "Service and Consultation Flows" }
    ],
    highlights: [
      "Built reusable responsive UI components with centralized Tailwind CSS styling.",
      "Implemented lead-generation and consultation workflows using Next.js Server Actions and REST APIs.",
      "Refactored complex forms into modular components organized around business requirements.",
      "Diagnosed end-to-end integration issues using browser DevTools and Network inspection."
    ],
    product: {
      alt: "Zylxy Technologies Corporate Website Preview",
      caption: "Corporate Platform · Form Workflows"
    },
    architecture: [
      {
        label: "CLIENT",
        title: "Next.js / React",
        details: ["UI Components", "Responsive Interfaces"]
      },
      {
        label: "APPLICATION",
        title: "Forms + Server Actions",
        details: ["Validation", "Submission Workflows"]
      },
      {
        label: "INTEGRATIONS",
        title: "REST / CRM",
        details: ["API Communication", "Lead Data"]
      },
      {
        label: "OUTCOME",
        title: "Lead Capture",
        details: ["Service Workflows", "Consultation Forms"]
      }
    ],
    proof: [
      {
        value: "14+",
        label: "Service Workflows",
        description: "Structured service and consultation forms to support CRM-driven lead capture."
      },
      {
        value: "Next.js",
        label: "Server Actions",
        description: "Kept form submission and integration logic on the server to isolate sensitive configuration."
      }
    ],
    links: {
      live: "https://zylxytech.com/"
    }
  },
  {
    id: "mini-social",
    index: "SYS-02",
    name: "Mini Social: Full-Stack Social Platform",
    client: "3W Assessment",
    year: "2026",
    classification: "FULL-STACK ASSESSMENT · AUTHENTICATION · SOCIAL FEATURES · MONGODB",
    summary:
      "Built for the 3W Full-Stack Assessment, Mini Social combines React, Express, and MongoDB with JWT authentication and persistent social interactions. It supports posts, image uploads, likes, comments, replies, and ID-backed mentions while keeping real API behavior completely separate from the local demo environment.",
    stack: [
      "React",
      "Express.js",
      "Node.js",
      "MongoDB",
      "Mongoose",
      "JavaScript",
      "JWT",
      "bcrypt",
      "REST APIs"
    ],
    metrics: [
      { value: "02", label: "MongoDB Collections" },
      { value: "06", label: "Verified Viewports" }
    ],
    highlights: [
      "Implemented signup and login with bcrypt password hashing, JWT authentication, and HttpOnly cookie sessions.",
      "Built posts, image uploads, likes, comments, single-level replies, and ID-backed mention autocomplete.",
      "Used two MongoDB collections for users and posts, with social interaction data stored inside post documents.",
      "Separated real API behavior from the local demo environment to prevent false-positive authentication states."
    ],
    product: {
      alt: "Mini Social Full-Stack Platform Preview",
      caption: "Authentication · Data Architecture"
    },
    architecture: [
      {
        label: "CLIENT",
        title: "React",
        details: ["Feed", "Authentication"]
      },
      {
        label: "API",
        title: "Express / Node",
        details: ["Posts", "Search", "Interactions"]
      },
      {
        label: "SECURITY",
        title: "JWT · bcrypt",
        details: ["HttpOnly Cookies", "Password Hashing"]
      },
      {
        label: "DATA",
        title: "MongoDB",
        details: ["Users", "Posts", "Media Storage"]
      }
    ],
    proof: [
      {
        value: "JWT",
        label: "Authentication",
        description: "Built signup and login flows with bcrypt password hashing, JWT authentication, and protected HttpOnly cookie sessions."
      },
      {
        value: "02",
        label: "MongoDB Collections",
        description: "Used User and Post collections, with social interaction data embedded within post documents."
      },
      {
        value: "06",
        label: "Verified Viewports",
        description: "Checked responsive behavior at 360, 390, 430, 768, 1024, and 1440 px."
      }
    ],
    links: {
      github: "https://github.com/kumarnallana/Mini-Social"
    }
  },
  {
    id: "redroot",
    index: "SYS-03",
    name: "Redroot: Interactive Product Experience",
    client: "Grinning Co Assessment",
    year: "2026",
    classification: "FRONTEND ASSESSMENT · INTERACTIVE PRODUCT EXPERIENCE · E2E TESTING",
    summary:
      "Built for the Grinning Co technical assessment, Redroot is a responsive product experience using Next.js, React, TypeScript, Motion, and Canvas. It combines modular product storytelling, interactive pricing and ingredient flows, lightweight state management, and Playwright end-to-end validation.",
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Motion",
      "Playwright",
      "React Context",
      "HTML5 Canvas API",
      "Lucide React"
    ],
    expandedStack: {
      "Core Framework & Language": ["Next.js 14.2.15", "React 18", "TypeScript 5"],
      "Styling & Design System": ["Tailwind CSS 3.4.1", "PostCSS 8", "clsx", "tailwind-merge"],
      "Animation & Interactive Graphics": ["Motion 13.1", "HTML5 Canvas API"],
      "State Management": ["React Context API"],
      "Testing & Code Quality": ["Playwright", "ESLint", "eslint-config-next"]
    },
    metrics: [
      { value: "12", label: "Modular Experience Sections" },
      { value: "03", label: "Playwright E2E Suites" }
    ],
    highlights: [
      "Built modular product sections with reusable Next.js, React, and TypeScript components.",
      "Created scroll-driven and Canvas-based interactions using Motion and the HTML5 Canvas API.",
      "Implemented product, ingredient, pricing, modal, and lead-generation interactions across responsive layouts.",
      "Added Playwright end-to-end coverage for navigation, interactions, modal flows, and responsive user journeys."
    ],
    product: {
      alt: "Redroot Interactive Product Preview",
      caption: "Frontend Architecture · Playwright E2E"
    },
    architecture: [
      {
        label: "CONTENT",
        title: "Next.js / React",
        details: ["App Router", "Product Storytelling"]
      },
      {
        label: "INTERACTIVE EXPERIENCE",
        title: "Motion / Canvas",
        details: ["Scroll Triggers", "Visual Feedback"]
      },
      {
        label: "STATE / LOGIC",
        title: "React Context",
        details: ["Demo Authentication", "Pricing Modes"]
      },
      {
        label: "VERIFICATION",
        title: "Playwright",
        details: ["Interaction Flows", "User Journeys"]
      }
    ],
    proof: [
      {
        value: "App Router",
        label: "Modular Experience",
        description: "Organized 12 product-focused sections with reusable components and shared UI patterns."
      },
      {
        value: "Motion",
        label: "Interactive Visuals",
        description: "Combined scroll-driven transitions with Canvas-based visual layers."
      },
      {
        value: "E2E",
        label: "Regression Coverage",
        description: "Validated navigation, interaction, modal, and responsive flows with Playwright."
      }
    ],
    links: {
      github: "https://github.com/kumarnallana/Grinning-Co-Internshala-Assessment"
    }
  }
];
