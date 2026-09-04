export type ArchitectureStep = {
  id: string;
  title: string;
  subtitle: string;
  details?: string[];
};

export type ProofItem = {
  id: string;
  metric: string;
  label: string;
  title: string;
  description: string;
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
  image?: string;
  architecture?: ArchitectureStep[];
  proof?: ProofItem[];
  expandedStack?: Record<string, string[]>;
  links?: {
    live?: string;
    github?: string;
  };
};
