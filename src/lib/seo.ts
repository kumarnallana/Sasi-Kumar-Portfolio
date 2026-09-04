import { identity } from "@/data/profile/profile.data";

// Canonical origin. Set NEXT_PUBLIC_SITE_URL in the deploy env (Vercel etc.).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

export const SITE_NAME = `${identity.name} — ${identity.role}`;

// kept tight (~150 chars) for SERP snippet; the full bio lives in JSON-LD
export const SEO_DESCRIPTION =
  "Full-Stack Developer building scalable, intuitive web applications with React, Next.js, Node.js and modern API technologies.";

export const SEO_KEYWORDS = [
  "Nallana Sasi Kumar",
  "Sasi Kumar",
  "Full-Stack Developer",
  "React Developer",
  "Next.js Developer",
  "Node.js",
  "Python",
  "FastAPI",
  "Pydantic",
  "SQLAlchemy",
  "Software Engineer",
  "Kakinada",
  "Andhra Pradesh",
  "India",
  "Portfolio",
];

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: identity.name,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    jobTitle: identity.role,
    email: `mailto:${identity.email}`,
    description: identity.summary,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kakinada",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    sameAs: [identity.links.github, identity.links.linkedin].filter(Boolean),
    knowsAbout: [
      "Full-Stack Development",
      "React",
      "Next.js",
      "Node.js",
      "Python",
      "FastAPI",
      "REST APIs",
      "SQL",
      "SQLAlchemy",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    author: { "@type": "Person", name: identity.name },
  };
}
