import { DiagramNode, DiagramEdge } from "./diagram.types";

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
