export type StackLayer = {
  code: string;
  role: string;
  title: string;
  narrative: string;
  items: string[];
  accent: "cyan" | "amber";
  status?: "LIVE" | "EXPLORING";
};

export const stackLayers: StackLayer[] = [
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
];
