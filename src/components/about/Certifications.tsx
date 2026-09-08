"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { certifications } from "@/data/profile/certifications.data";
import styles from "./Certifications.module.css";

export default function Certifications() {
  const [selected, setSelected] = useState(0);
  const [entered, setEntered] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const selectors = useRef<(HTMLButtonElement | null)[]>([]);
  const active = certifications[selected];

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setEntered(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = certifications.length - 1;
    let next: number;
    switch (event.key) {
      case "ArrowRight": next = (index + 1) % certifications.length; break;
      case "ArrowLeft": next = (index + last) % certifications.length; break;
      case "Home": next = 0; break;
      case "End": next = last; break;
      default: return;
    }
    event.preventDefault();
    selectors.current[next]?.focus({ preventScroll: true });
    selectors.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
  }

  return (
    <div ref={root} className={styles.root} data-entered={entered}>
      <h3 id="credentials-heading" className={`tech-label text-paper ${styles.heading}`}>
        VERIFIED CERTIFICATIONS
      </h3>
      <div role="group" aria-labelledby="credentials-heading" className={styles.rail} data-lenis-prevent>
        {certifications.map((credential, index) => (
          <button
            key={credential.id}
            ref={(element) => { selectors.current[index] = element; }}
            type="button"
            aria-pressed={selected === index}
            aria-controls="credential-details"
            aria-label={`${credential.title}, ${credential.issuer}`}
            className={styles.selector}
            onClick={() => setSelected(index)}
            onFocus={() => setSelected(index)}
            onKeyDown={(event) => navigate(event, index)}
          >
            <span className={`tech-label ${styles.selectorLabel}`}>
              <span>{String(index + 1).padStart(2, "0")} / {credential.issuer === "freeCodeCamp" ? "FCC" : "GFG"}</span>
              <span aria-hidden="true" className={styles.dot} />
            </span>
            <span className={styles.thumbnail}>
              <Image src={credential.image} alt={`${credential.issuer} ${credential.title} certificate for Sasi Kumar Nallana`} fill sizes="(max-width: 767px) 180px, (max-width: 1023px) 220px, 180px" className="object-contain" />
            </span>
            <span className={`font-display ${styles.selectorTitle}`}>{credential.title}</span>
          </button>
        ))}
      </div>
      <div className={styles.details} id="credential-details">
        <a href={active.image} target="_blank" rel="noopener noreferrer" className={styles.preview} aria-label={`Open ${active.title} certificate image (new tab)`}>
          <Image key={active.id} src={active.image} alt={`${active.issuer} ${active.title} certificate for Sasi Kumar Nallana`} fill sizes="(max-width: 767px) 280px, 320px" className={`object-contain ${styles.image}`} loading="eager" />
        </a>
        <div className={styles.metadata} aria-live="polite" aria-atomic="true">
          <div key={active.id} className={styles.metadataContent}>
            <p className="tech-label text-cyan">{active.category}</p>
            <h4 className="mt-3 font-display text-xl font-semibold leading-snug text-paper">{active.title}</h4>
            <p className="mt-2 text-sm text-paper-dim">{active.issuer}</p>
            <p className="mt-4 text-xs text-paper-dim">{active.date}{active.hours ? ` · ~${active.hours} hours of coursework` : ""}</p>
          </div>
          <a href={active.credentialUrl} target="_blank" rel="noopener noreferrer" className={styles.verify} aria-label={`Verify ${active.title} from ${active.issuer} (new tab)`}>
            VERIFY CREDENTIAL <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
