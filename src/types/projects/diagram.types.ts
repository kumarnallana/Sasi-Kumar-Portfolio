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
