export type Operation = {
  name: string;
  detail: string;
  status: "ACTIVE" | "COMPLETED" | "EXPLORING" | "RESEARCH" | "EXPERIMENTING";
};
