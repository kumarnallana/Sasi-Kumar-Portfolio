import type { DiagramNode, DiagramEdge } from "@/types/projects/diagram.types";

export const zylxyDiagram = {
  nodes: [
    { id: "client", label: "Client", sub: "Next.js / React", x: 8, y: 50, kind: "client" },
    { id: "ui", label: "UI Components", sub: "Forms & Views", x: 30, y: 50, kind: "service" },
    { id: "server", label: "Server Layer", sub: "Server Actions", x: 60, y: 30, kind: "service" },
    { id: "api", label: "External Integrations", sub: "REST / CRM", x: 60, y: 70, kind: "external" },
    { id: "business", label: "Business Outcome", sub: "Lead Capture", x: 92, y: 50, kind: "data" }
  ] as DiagramNode[],
  edges: [
    { from: "client", to: "ui", label: "interaction" },
    { from: "ui", to: "server", label: "submission" },
    { from: "ui", to: "api", label: "integration" },
    { from: "server", to: "business", label: "workflow" },
    { from: "api", to: "business", label: "lead sync" }
  ] as DiagramEdge[]
};

export const miniSocialDiagram = {
  nodes: [
    { id: "client", label: "React Client", sub: "Feed / Auth", x: 10, y: 50, kind: "client" },
    { id: "api", label: "Express API", sub: "Node.js", x: 40, y: 50, kind: "service" },
    { id: "auth", label: "Auth Layer", sub: "bcrypt / JWT", x: 60, y: 25, kind: "service" },
    { id: "posts", label: "Post Controller", sub: "Interactions", x: 60, y: 50, kind: "service" },
    { id: "users", label: "User Search", sub: "Resolution", x: 60, y: 75, kind: "service" },
    { id: "db", label: "MongoDB", sub: "Users / Posts", x: 85, y: 35, kind: "data" },
    { id: "storage", label: "Image Storage", sub: "Local/Cloudinary", x: 85, y: 75, kind: "external" }
  ] as DiagramNode[],
  edges: [
    { from: "client", to: "api", label: "HTTP-ONLY COOKIE" },
    { from: "api", to: "auth", label: "login/signup" },
    { from: "api", to: "posts", label: "content" },
    { from: "api", to: "users", label: "mentions" },
    { from: "auth", to: "db", label: "credentials" },
    { from: "posts", to: "db", label: "queries" },
    { from: "posts", to: "storage", label: "persistence" },
    { from: "users", to: "db", label: "queries" }
  ] as DiagramEdge[]
};

export const redrootDiagram = {
  nodes: [
    { id: "app", label: "Next.js App Router", sub: "React / TS", x: 10, y: 50, kind: "client" },
    { id: "visual", label: "Visual Layer", sub: "Motion / Canvas", x: 30, y: 50, kind: "service" },
    { id: "story", label: "Story / Hero", sub: "Experience", x: 55, y: 20, kind: "service" },
    { id: "product", label: "Product / Ingredients", sub: "Showcase", x: 55, y: 50, kind: "service" },
    { id: "pricing", label: "Pricing / Lead Gen", sub: "Interactions", x: 55, y: 80, kind: "service" },
    { id: "state", label: "Context State", sub: "Demo Session", x: 75, y: 50, kind: "data" },
    { id: "e2e", label: "Playwright E2E", sub: "Verification", x: 92, y: 50, kind: "external" }
  ] as DiagramNode[],
  edges: [
    { from: "app", to: "visual", label: "initialization" },
    { from: "visual", to: "story", label: "scroll/motion" },
    { from: "visual", to: "product", label: "scroll/motion" },
    { from: "visual", to: "pricing", label: "scroll/motion" },
    { from: "story", to: "state", label: "events" },
    { from: "product", to: "state", label: "events" },
    { from: "pricing", to: "state", label: "events" },
    { from: "state", to: "e2e", label: "signal" }
  ] as DiagramEdge[]
};
