export type Operation = {
  name: string;
  detail: string;
  status: "ACTIVE" | "RESEARCH" | "EXPERIMENTING";
};

export const operations: Operation[] = [
  {
    name: "Corporate Web Platform",
    detail: "Zylxy Technologies corporate site and CRM consulting workflow.",
    status: "ACTIVE",
  },
  {
    name: "CSR Mentorship",
    detail: "Mentoring 60+ aspiring developers through CoroVidya.",
    status: "ACTIVE",
  },
  {
    name: "Python API Expansion",
    detail: "Researching FastAPI, Pydantic, and SQLAlchemy ecosystems.",
    status: "RESEARCH",
  },
];
