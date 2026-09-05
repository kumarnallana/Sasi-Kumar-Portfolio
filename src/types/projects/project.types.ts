

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
  image?: string;
  diagram?: any; // Deprecated: { nodes: any[]; edges: any[] }
  detail?: any; // Deprecated: { nodes: any[]; edges: any[] }
  reconstruction?: any; // Deprecated: Reconstruction
  expandedStack?: Record<string, string[]>;
  links?: {
    live?: string;
    github?: string;
  };
};
