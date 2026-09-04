import { DiagramNode, DiagramEdge } from "./diagram.types";
import { Reconstruction } from "./reconstruction.types";

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
