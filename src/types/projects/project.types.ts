export type ProjectProduct = {
  image: string;
  alt: string;
  caption?: string;
};

export type ArchitectureStep = {
  label: string;
  title: string;
  details: string[];
};

export type ProofItem = {
  value: string;
  label: string;
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
  product?: ProjectProduct;
  architecture?: ArchitectureStep[];
  proof?: ProofItem[];
  expandedStack?: Record<string, string[]>;
  links?: {
    live?: string;
    github?: string;
  };
};
