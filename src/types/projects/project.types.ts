

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
  architectureVariant?: "linear" | "branch" | "split-converge";
  architectureFlow?: { label: string; stack: string }[];

  expandedStack?: Record<string, string[]>;
  links?: {
    live?: string;
    github?: string;
  };
};
