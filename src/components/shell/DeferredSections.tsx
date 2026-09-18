"use client";

import Operations from "@/components/operations/Operations";
import Approach from "@/components/approach/Approach";
import Projects from "@/components/projects/Projects";
import OpenSource from "@/components/open-source/OpenSource";
import About from "@/components/about/About";
import Contact from "@/components/contact/Contact";

/**
 * The historical file name is preserved to avoid unrelated import churn.
 *
 * Core recruiter-facing sections are intentionally rendered in normal
 * document flow. Heavy visuals should lazy-load inside their owning section,
 * not by swapping the entire section in/out of the page.
 */
export default function DeferredSections() {
  return (
    <>
      <Operations />
      <Approach />
      <Projects />
      <OpenSource />
      <About />
      <Contact />
    </>
  );
}
