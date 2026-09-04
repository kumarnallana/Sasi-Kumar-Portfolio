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
