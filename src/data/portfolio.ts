// ============================================================
// CONTENT DATA LAYER - single source of truth
// Sourced from Nallana Sasi Kumar's CV and verified projects
// ============================================================

export const identity = {
  name: "Nallana Sasi Kumar",
  callsign: "NSK-CORE",
  role: "Full-Stack Developer",
  roleFramings: [
    "Full-Stack Developer",
    "React / Next.js Developer",
    "Backend & API Developer",
    "JavaScript · TypeScript · Python",
    "React · Next.js · Node.js",
    "FastAPI · Pydantic · SQLAlchemy — Expanding Stack",
  ],
  location: "Kakinada, Andhra Pradesh, India",
  email: "sasikumarnallana956@gmail.com",
  phone: "+91 9553886216",
  tagline: "Building scalable, intuitive and user-focused web applications across modern frontend, backend and API systems.",
  summary:
    "Full-Stack Developer focused on scalable, intuitive and user-focused web applications, with experience delivering production-ready solutions, collaborating in agile environments and mentoring 60+ aspiring developers through a corporate CSR initiative. Currently expanding into Python backend engineering and pursuing a B.Tech in Artificial Intelligence and Data Science.",
  links: {
    github: "https://github.com/kumarnallana",
    linkedin: "https://linkedin.com/in/sasi-kumar-nallana",
    resume: "/resume/Nallana_SasiKumar_FullStack_Resume.pdf",
  },
};

// ------------------------------------------------------------
// Architecture node graph type - drives the self-drawing diagrams
// ------------------------------------------------------------
export type DiagramNode = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  kind: "client" | "edge" | "service" | "data" | "external" | "ai";
};

export type DiagramEdge = {
  from: string;
  to: string;
  label?: string;
};

export type ReconPhase = {
  at: string;
  title: string;
  note: string;
  add: string[];
  commit: string;
  stress?: string;
  stressMsg?: string;
  resolve?: string;
  fix?: string;
};

export type Reconstruction = {
  graph: { nodes: DiagramNode[]; edges: DiagramEdge[] };
  phases: ReconPhase[];
};

export type Project = {
  id: string;
  index: string;
  name: string;
  client?: string;
  year: string;
  classification: string;
  summary: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  highlights: string[];
  diagram?: { nodes: DiagramNode[]; edges: DiagramEdge[] };
  detail?: { nodes: DiagramNode[]; edges: DiagramEdge[] };
  reconstruction?: Reconstruction;
  links?: {
    live?: string;
    github?: string;
  };
};

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
    diagram: {
      nodes: [
        { id: "client", label: "Client", sub: "Next.js / React", x: 8, y: 50, kind: "client" },
        { id: "ui", label: "UI Components", sub: "Forms & Views", x: 30, y: 50, kind: "service" },
        { id: "server", label: "Server Layer", sub: "Server Actions", x: 60, y: 30, kind: "service" },
        { id: "api", label: "External Integrations", sub: "REST / CRM", x: 60, y: 70, kind: "external" },
        { id: "business", label: "Business Outcome", sub: "Lead Capture", x: 92, y: 50, kind: "data" }
      ],
      edges: [
        { from: "client", to: "ui", label: "interaction" },
        { from: "ui", to: "server", label: "submission" },
        { from: "ui", to: "api", label: "integration" },
        { from: "server", to: "business", label: "workflow" },
        { from: "api", to: "business", label: "lead sync" }
      ]
    },
    reconstruction: {
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
    }
  },
  {
    id: "learnersguru",
    index: "SYS-02",
    name: "LearnersGuru — Online Learning Platform",
    year: "2023",
    classification: "ONLINE LEARNING PLATFORM",
    summary:
      "A frontend learning platform interface enabling course navigation and user authentication.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    metrics: [],
    highlights: [
      "Designed core layouts and dynamic UI components",
      "Enabled course navigation",
      "Implemented login authentication and form validation"
    ]
  },
  {
    id: "student-faculty",
    index: "SYS-03",
    name: "Student-Faculty Login Portal",
    year: "2024",
    classification: "AUTHENTICATION PORTAL",
    summary:
      "A role-based portal managing student and faculty authentication flows.",
    stack: ["HTML5", "CSS3", "JavaScript"],
    metrics: [],
    highlights: [
      "Role-based authentication portal",
      "Real-time form validation",
      "Faculty record management",
      "Browser localStorage used for session persistence"
    ]
  }
];

// ------------------------------------------------------------
// THE STACK - layered 3D representation
// ------------------------------------------------------------
export type StackLayer = {
  code: string;
  role: string;
  title: string;
  narrative: string;
  items: string[];
  accent: "cyan" | "amber";
  status?: "LIVE" | "EXPLORING";
};

export const stackStory: {
  title: string;
  line: string;
  layers: StackLayer[];
} = {
  title: "THE STACK",
  line: "Seven layers of verified capability and active technical expansion. From language core to component delivery.",
  layers: [
    {
      code: "L1",
      role: "LANGUAGE CORE",
      title: "Language Core",
      narrative: "The language foundation behind my frontend, backend, API and data work.",
      items: ["JavaScript (ES6+)", "TypeScript", "Python", "SQL"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L2",
      role: "INTERFACE / FRONTEND",
      title: "Interface / Frontend",
      narrative: "Responsive product interfaces and reusable component systems built around React and Next.js.",
      items: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "Redux"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L3",
      role: "BACKEND & APIs",
      title: "Backend & APIs",
      narrative: "Creating and consuming RESTful services and server actions. Currently expanding into Python microframeworks.",
      items: ["Node.js", "Express.js", "REST API Integration", "Next.js Server Actions", "FastAPI", "Pydantic"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L4",
      role: "DATA / PERSISTENCE",
      title: "Data / Persistence",
      narrative: "Managing application state, browser storage, and relational data architecture.",
      items: ["SQL", "SQLAlchemy ORM", "State Management", "Browser Storage"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L5",
      role: "QUALITY & DELIVERY",
      title: "Quality & Delivery",
      narrative: "Ensuring code quality, automated deployments, and structured collaboration.",
      items: ["Jest", "GitHub Actions", "Git", "GitHub", "Postman", "Agile / Scrum"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L6",
      role: "PRODUCT ENGINEERING",
      title: "Product Engineering",
      narrative: "Translating requirements into maintainable, component-based visual systems.",
      items: ["Component-Based Architecture", "Domain-Driven Design awareness", "Responsive UI Design", "Framer Motion", "D3.js", "Lucide React"],
      accent: "cyan",
      status: "LIVE",
    },
    {
      code: "L7",
      role: "CURRENT ENGINEERING DIRECTION",
      title: "Current Engineering Direction",
      narrative: "Where I am actively expanding—deepening my full-stack capability into Python-driven API development.",
      items: ["Full-Stack Engineering", "Python API Development", "FastAPI", "Pydantic", "SQLAlchemy", "AI-assisted development workflows"],
      accent: "amber",
      status: "EXPLORING",
    },
  ],
};

// ------------------------------------------------------------
// OPERATING PHILOSOPHY
// ------------------------------------------------------------
export const manifesto = [
  "Understand the requirement before coding.",
  "Break interfaces and workflows into maintainable components.",
  "Treat API and data-flow behavior as part of the product—not an afterthought.",
  "Debug root causes using browser/network evidence.",
  "Validate complete workflows before considering work finished.",
];

// ------------------------------------------------------------
// FIELD OPERATIONS
// ------------------------------------------------------------
export type Operation = {
  name: string;
  detail: string;
  status: "ACTIVE" | "RESEARCH" | "EXPERIMENTING";
};

export const operations: Operation[] = [
  {
    name: "Corporate Web Platform",
    detail: "Zylxy Technologies corporate site and CRM consulting workflow.",
    status: "ACTIVE",
  },
  {
    name: "CSR Mentorship",
    detail: "Mentoring 60+ aspiring developers through CoroVidya.",
    status: "ACTIVE",
  },
  {
    name: "Python API Expansion",
    detail: "Researching FastAPI, Pydantic, and SQLAlchemy ecosystems.",
    status: "RESEARCH",
  },
];

export const achievements: { title: string; org: string; date: string }[] = [
  { title: "B.Tech Artificial Intelligence and Data Science", org: "KIET", date: "2025–2028" },
  { title: "Diploma in Computer Engineering", org: "KIET", date: "2020–2023" },
  { title: "JavaScript & ReactJS Certifications", org: "GeeksforGeeks", date: "Verified" },
];

export const systemStats = [
  { label: "INTERNSHIP", value: "3 MO" },
  { label: "MENTORED", value: "60+" },
  // GitHub stats will be dynamically populated in components via TanStack Query
  { label: "GITHUB STARS", value: "LIVE", isDynamic: true, queryKey: "stars" },
  { label: "PUBLIC REPOS", value: "LIVE", isDynamic: true, queryKey: "repos" },
];

// ------------------------------------------------------------
// OPEN-SOURCE SIGNALS
// ------------------------------------------------------------
export const github = {
  handle: "kumarnallana",
  url: "https://github.com/kumarnallana",
  totalStars: 0, // Hydrated by query
  publicRepos: 0, // Hydrated by query
  followers: 0, // Hydrated by query
};

export type Repo = {
  name: string;
  desc: string;
  lang: string;
  stars: number;
  url: string;
  tag: string;
};

// Initial empty/fallback array - will be replaced by TanStack Query
export const repos: Repo[] = [];

export type Experience = {
  role: string;
  period: string;
  company: string;
  mode: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "Web Developer Intern",
    period: "May 2026 – July 2026",
    company: "Zylxy Technology Pvt. Ltd.",
    mode: "On-Site (Kakinada)",
    points: [
      "Translated business requirements into a corporate website and CRM platform using Next.js and React.",
      "Developed reusable UI components using Tailwind CSS and centralized styling.",
      "Built lead-generation workflows using React Hooks, Next.js Server Actions and REST API integrations.",
      "Refactored complex form functionality into modular, domain-oriented components.",
      "Debugged end-to-end integrations through browser DevTools and Network inspection.",
    ],
  },
  {
    role: "CSR Mentorship",
    period: "May 2026 – July 2026",
    company: "CoroVidya",
    mode: "Parallel Contribution",
    points: [
      "Mentored 60+ aspiring developers through technical guidance and code reviews.",
      "Led practical placement preparation, JavaScript, React, and Node.js sessions.",
    ],
  },
  {
    role: "Industrial Trainee — Web Development",
    period: "November 2022 – May 2023",
    company: "iSAN Computers Education",
    mode: "On-Site (Kakinada)",
    points: [
      "Completed six months of industrial web-development training.",
      "Built responsive static and dynamic interfaces.",
      "Worked with semantic HTML5, CSS3 and JavaScript DOM manipulation.",
    ],
  },
];

export const skillGroups = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "SQL"] },
  { group: "Frontend", items: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap", "Redux", "Framer Motion", "D3.js"] },
  { group: "Backend", items: ["Node.js", "Express.js", "FastAPI", "Pydantic", "SQLAlchemy", "REST APIs", "Server Actions"] },
  { group: "Tools & Delivery", items: ["Git", "GitHub", "GitHub Actions", "Postman", "Jest", "Lucide React"] },
];

