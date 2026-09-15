"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentType } from "react";
import Contact from "@/components/contact/Contact";

const Operations = dynamic(() => import("@/components/operations/Operations"), { ssr: false });
const Approach = dynamic(() => import("@/components/approach/Approach"), { ssr: false });
const Projects = dynamic(() => import("@/components/projects/Projects"), { ssr: false });
const OpenSource = dynamic(() => import("@/components/open-source/OpenSourceRuntime"), { ssr: false });
const About = dynamic(() => import("@/components/about/About"), { ssr: false });

function DeferredSection({
  id,
  label,
  minHeight,
  component: Component,
}: {
  id: string;
  label: string;
  minHeight: string;
  component: ComponentType;
}) {
  const marker = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const activateForNavigation = (event: Event) => {
      const destination = (event as CustomEvent<string>).detail;
      if (destination === id) setActive(true);
    };
    window.addEventListener("portfolio:section-request", activateForNavigation);
    return () => {
      window.removeEventListener("portfolio:section-request", activateForNavigation);
    };
  }, [id]);

  useEffect(() => {
    const node = marker.current;
    if (!node || active) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [active]);

  return (
    <div ref={marker} data-deferred-section={id} style={{ overflowAnchor: "none" }}>
      {active ? (
        <Component />
      ) : (
        <section
          id={id}
          data-deferred-placeholder="true"
          aria-label={`${label} section`}
          className="relative mx-auto max-w-6xl px-6 md:px-10"
          style={{ minHeight }}
        >
          <span className="sr-only">{label} loads when it approaches the viewport.</span>
        </section>
      )}
    </div>
  );
}

export default function DeferredSections() {
  return (
    <>
      <DeferredSection id="operations" label="Operations" minHeight="66rem" component={Operations} />
      <DeferredSection id="principles" label="Principles" minHeight="58rem" component={Approach} />
      <DeferredSection id="systems" label="Projects" minHeight="190rem" component={Projects} />
      <DeferredSection id="signals" label="Open-source signals" minHeight="72rem" component={OpenSource} />
      <DeferredSection id="profile" label="Profile" minHeight="76rem" component={About} />
      <Contact />
    </>
  );
}
