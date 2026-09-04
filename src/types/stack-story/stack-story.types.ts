export type StackLayer = {
  code: string;
  role: string;
  title: string;
  narrative: string;
  items: string[];
  accent: "cyan" | "amber";
  status?: "LIVE" | "EXPLORING";
};
