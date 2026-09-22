"use client";

import type { RefObject } from "react";
import {
  useEffect,
  useId,
  useRef,
} from "react";
import { gsap } from "gsap";

const VIEWBOX_WIDTH = 1024;
const VIEWBOX_HEIGHT = 1536;
const TEXT_REPEAT_COUNT = 10;

type Direction = 1 | -1;

type Point = {
  x: number;
  y: number;
};

type CubicSegment = {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
};

type RibbonConfig = {
  id: string;
  phrase: string;
  segments: CubicSegment[];
  direction: Direction;
  flowSpeed: number;
  fontSize: number;
  fill: string;
  textOpacity: number;
  rail: string;
  railOpacity: number;
  ambientAmplitude: number;
  ambientFrequency: number;
  ambientSpeed: number;
  influenceRadius: number;
  pointerPull: number;
  velocityInfluence: number;
  stiffness: number;
  damping: number;
  maxDisplacement: number;
  ambientPhase: number;
  flowPhase: number;
  tension: number;
};

type WavePoint = {
  baseX: number;
  baseY: number;
  normalX: number;
  normalY: number;
  offset: number;
  velocity: number;
};

type RibbonRuntime = {
  config: RibbonConfig;
  path: SVGPathElement;
  band: SVGPathElement;
  rails: Array<{
    path: SVGPathElement;
    offset: number;
  }>;
  textPaths: SVGTextPathElement[];
  measure: SVGTextElement;
  points: WavePoint[];
  phraseLength: number;
  flowDistance: number;
};

type RailSpec = {
  offset: number;
  width: number;
  opacity: number;
};

type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  targetVx: number;
  targetVy: number;
  presence: number;
  targetPresence: number;
  energy: number;
  targetEnergy: number;
  lastX: number;
  lastY: number;
  lastTime: number;
};

type FlowingBackgroundTextProps = {
  interactionRef: RefObject<HTMLElement | null>;
};

const RIBBONS: RibbonConfig[] = [
  {
    id: "signal",
    phrase:
      "SIGNAL · SYSTEMS · ENGINEERING · BUILD · SOLVE · GROW · ",
    segments: [
      {
        p0: { x: -180, y: 235 },
        p1: { x: 80, y: 92 },
        p2: { x: 385, y: 105 },
        p3: { x: 650, y: 230 },
      },
      {
        p0: { x: 650, y: 230 },
        p1: { x: 870, y: 330 },
        p2: { x: 1080, y: 275 },
        p3: { x: 1220, y: 135 },
      },
    ],
    direction: 1,
    flowSpeed: 14,
    fontSize: 27,
    fill: "#f2ae42",
    textOpacity: 0.82,
    rail: "#f2ae42",
    railOpacity: 0.24,
    ambientAmplitude: 4.5,
    ambientFrequency: 0.011,
    ambientSpeed: 0.36,
    influenceRadius: 310,
    pointerPull: 0.28,
    velocityInfluence: 0.03,
    stiffness: 35,
    damping: 0.86,
    maxDisplacement: 65,
    ambientPhase: 0,
    flowPhase: 0.08,
    tension: 30,
  },
  {
    id: "stack",
    phrase:
      "FRONTEND · BACKEND · LOGIC · PYTHON · FASTAPI · FULL-STACK · ",
    segments: [
      {
        p0: { x: -180, y: 550 },
        p1: { x: 100, y: 365 },
        p2: { x: 390, y: 420 },
        p3: { x: 670, y: 535 },
      },
      {
        p0: { x: 670, y: 535 },
        p1: { x: 900, y: 620 },
        p2: { x: 1080, y: 485 },
        p3: { x: 1230, y: 335 },
      },
    ],
    direction: -1,
    flowSpeed: 11,
    fontSize: 21,
    fill: "#72d8ff",
    textOpacity: 0.58,
    rail: "#43c9ff",
    railOpacity: 0.21,
    ambientAmplitude: 5,
    ambientFrequency: 0.009,
    ambientSpeed: 0.29,
    influenceRadius: 235,
    pointerPull: 0.19,
    velocityInfluence: 0.032,
    stiffness: 34,
    damping: 0.86,
    maxDisplacement: 65,
    ambientPhase: Math.PI * 0.65,
    flowPhase: 0.42,
    tension: 26,
  },
  {
    id: "depth",
    phrase:
      "IDEAS · CODE · IMPACT · PROBLEM SOLVING · DEPTH · ",
    segments: [
      {
        p0: { x: -190, y: 930 },
        p1: { x: 95, y: 750 },
        p2: { x: 380, y: 795 },
        p3: { x: 665, y: 910 },
      },
      {
        p0: { x: 665, y: 910 },
        p1: { x: 890, y: 995 },
        p2: { x: 1080, y: 850 },
        p3: { x: 1230, y: 710 },
      },
    ],
    direction: 1,
    flowSpeed: 8,
    fontSize: 18,
    fill: "#43c9ff",
    textOpacity: 0.36,
    rail: "#43c9ff",
    railOpacity: 0.14,
    ambientAmplitude: 4,
    ambientFrequency: 0.008,
    ambientSpeed: 0.22,
    influenceRadius: 255,
    pointerPull: 0.15,
    velocityInfluence: 0.024,
    stiffness: 29,
    damping: 0.88,
    maxDisplacement: 52,
    ambientPhase: Math.PI * 1.2,
    flowPhase: 0.7,
    tension: 22,
  },
];

const RAIL_SPECS: RailSpec[] = [
  { offset: -42, width: 0.65, opacity: 0.12 },
  { offset: -27, width: 0.8, opacity: 0.3 },
  { offset: -13, width: 0.95, opacity: 0.58 },
  { offset: 0, width: 1.15, opacity: 0.82 },
  { offset: 13, width: 0.95, opacity: 0.58 },
  { offset: 27, width: 0.8, opacity: 0.3 },
  { offset: 42, width: 0.65, opacity: 0.12 },
];

function cubicAt(
  segment: CubicSegment,
  t: number,
): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  const a = mt2 * mt;
  const b = 3 * mt2 * t;
  const c = 3 * mt * t2;
  const d = t * t2;
  return {
    x:
      a * segment.p0.x +
      b * segment.p1.x +
      c * segment.p2.x +
      d * segment.p3.x,
    y:
      a * segment.p0.y +
      b * segment.p1.y +
      c * segment.p2.y +
      d * segment.p3.y,
  };
}

function sampleCurve(
  segments: CubicSegment[],
  samplesPerSegment = 18,
): WavePoint[] {
  const raw: Point[] = [];

  segments.forEach((segment, segmentIndex) => {
    for (
      let i = 0;
      i <= samplesPerSegment;
      i += 1
    ) {
      if (
        segmentIndex > 0 &&
        i === 0
      ) {
        continue;
      }
      raw.push(
        cubicAt(
          segment,
          i / samplesPerSegment,
        ),
      );
    }
  });

  return raw.map((point, index) => {
    const previous =
      raw[Math.max(0, index - 1)];

    const next =
      raw[Math.min(
        raw.length - 1,
        index + 1,
      )];

    const tangentX =
      next.x - previous.x;

    const tangentY =
      next.y - previous.y;

    const length =
      Math.hypot(
        tangentX,
        tangentY,
      ) || 1;

    const normalX =
      -tangentY / length;

    const normalY =
      tangentX / length;

    return {
      baseX: point.x,
      baseY: point.y,
      normalX,
      normalY,
      offset: 0,
      velocity: 0,
    };
  });
}

function buildDeformedGeometry(
  points: WavePoint[],
): Point[] {
  return points.map((point) => ({
    x:
      point.baseX +
      point.normalX * point.offset,
    y:
      point.baseY +
      point.normalY * point.offset,
  }));
}

function calculateDynamicNormals(
  positions: Point[],
): Point[] {
  return positions.map((_, index) => {
    const previous =
      positions[Math.max(0, index - 1)];
    const next =
      positions[
        Math.min(
          positions.length - 1,
          index + 1,
        )
      ];
    const tangentX = next.x - previous.x;
    const tangentY = next.y - previous.y;
    const length =
      Math.hypot(tangentX, tangentY) || 1;

    return {
      x: -tangentY / length,
      y: tangentX / length,
    };
  });
}

function offsetGeometry(
  centerPositions: Point[],
  dynamicNormals: Point[],
  normalOffset: number,
): Point[] {
  return centerPositions.map((point, index) => ({
    x:
      point.x +
      dynamicNormals[index].x * normalOffset,
    y:
      point.y +
      dynamicNormals[index].y * normalOffset,
  }));
}

function positionsToSmoothPath(
  positions: Point[],
): string {
  if (!positions.length) return "";

  const pos0 = positions[0];
  
  if (positions.length === 1) {
    return `M ${pos0.x} ${pos0.y}`;
  }

  let d = `M ${pos0.x.toFixed(2)} ${pos0.y.toFixed(2)}`;

  for (
    let i = 0;
    i < positions.length - 1;
    i += 1
  ) {
    const p0 = positions[i - 1] ?? positions[i];
    const p1 = positions[i];
    const p2 = positions[i + 1];
    const p3 = positions[i + 2] ?? p2;

    const cp1x =
      p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    
    const cp2x =
      p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d +=
      ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}` +
      ` ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}` +
      ` ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }

  return d;
}

function staticPath(
  config: RibbonConfig,
  normalOffset = 0,
): string {
  const centerPositions = buildDeformedGeometry(
    sampleCurve(config.segments),
  );

  if (normalOffset === 0) {
    return positionsToSmoothPath(centerPositions);
  }

  return positionsToSmoothPath(
    offsetGeometry(
      centerPositions,
      calculateDynamicNormals(centerPositions),
      normalOffset,
    ),
  );
}

function clientToViewBox(
  clientX: number,
  clientY: number,
  rect: DOMRect,
): Point {
  const scale = Math.max(
    rect.width / VIEWBOX_WIDTH,
    rect.height / VIEWBOX_HEIGHT,
  );
  const renderedWidth = VIEWBOX_WIDTH * scale;
  const renderedHeight = VIEWBOX_HEIGHT * scale;
  const cropX = (rect.width - renderedWidth) / 2;
  const cropY = (rect.height - renderedHeight) / 2;
  return {
    x: (clientX - rect.left - cropX) / scale,
    y: (clientY - rect.top - cropY) / scale,
  };
}

function clamp(
  value: number,
  min: number,
  max: number,
): number {
  return Math.min(
    max,
    Math.max(min, value),
  );
}

export default function FlowingBackgroundText({
  interactionRef,
}: FlowingBackgroundTextProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  const instanceId = useId().replace(/:/g, "");

  useEffect(() => {
    const svg = svgRef.current;
    const interaction = interactionRef.current;

    if (!svg || !interaction) {
      return;
    }

    const mm = gsap.matchMedia();
    let destroyed = false;

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        finePointer: "(pointer: fine) and (min-width: 768px)",
      },
      (context) => {
        const conditions = context.conditions as
          | {
              motion?: boolean;
              finePointer?: boolean;
            }
          | undefined;

        const allowMotion = Boolean(
          conditions?.motion,
        );
        const allowPointer =
          allowMotion &&
          Boolean(
            conditions?.finePointer,
          );

        const runtimeMap = new Map<
          string,
          RibbonRuntime
        >();

        RIBBONS.forEach(
          (config) => {
            const group = svg.querySelector<SVGGElement>(
              `[data-ribbon-id="${config.id}"]`,
            );
            if (!group) return;

            const path = group.querySelector<SVGPathElement>(
              "[data-elastic-path]",
            );
            const band = group.querySelector<SVGPathElement>(
              "[data-ribbon-band]",
            );
            const rails = Array.from(
              group.querySelectorAll<SVGPathElement>(
                "[data-ribbon-rail]",
              ),
            ).map((rail) => ({
              path: rail,
              offset: Number(rail.dataset.railOffset ?? 0),
            }));
            const measure = group.querySelector<SVGTextElement>(
              "[data-flow-measure]",
            );
            const textPaths = Array.from(
              group.querySelectorAll<SVGTextPathElement>(
                "[data-flow-text]",
              ),
            );

            if (
              !path ||
              !band ||
              !rails.length ||
              !measure ||
              !textPaths.length
            ) {
              return;
            }

            runtimeMap.set(
              config.id,
              {
                config,
                path,
                band,
                rails,
                measure,
                textPaths,
                points: sampleCurve(
                  config.segments,
                  26,
                ),
                phraseLength: 1,
                flowDistance: 0,
              },
            );
          },
        );

        const measureText = () => {
          runtimeMap.forEach(
            (runtime) => {
              const styles = window.getComputedStyle(runtime.measure);
              const canvas = document.createElement("canvas");
              const context2d = canvas.getContext("2d");
              const nativeMeasure = runtime.measure.getComputedTextLength;
              let measuredLength = 0;

              if (typeof nativeMeasure === "function") {
                measuredLength = nativeMeasure.call(runtime.measure);
              } else if (context2d) {
                context2d.font = styles.font;
                const letterSpacing = Number.parseFloat(styles.letterSpacing) || 0;
                measuredLength =
                  context2d.measureText(runtime.config.phrase).width +
                  letterSpacing * Math.max(runtime.config.phrase.length - 1, 0);
              }

              runtime.phraseLength = Math.max(
                measuredLength ||
                  runtime.config.phrase.length * runtime.config.fontSize * 0.78,
                1,
              );
              runtime.flowDistance =
                runtime.phraseLength *
                runtime.config.flowPhase;
            },
          );
        };

        measureText();

        document.fonts?.ready.then(
          () => {
            if (!destroyed) {
              measureText();
            }
          },
        );

        const pointer: PointerState = {
          x: VIEWBOX_WIDTH / 2,
          y: VIEWBOX_HEIGHT / 2,
          targetX: VIEWBOX_WIDTH / 2,
          targetY: VIEWBOX_HEIGHT / 2,
          vx: 0,
          vy: 0,
          targetVx: 0,
          targetVy: 0,
          presence: 0,
          targetPresence: 0,
          energy: 0,
          targetEnergy: 0,
          lastX: VIEWBOX_WIDTH / 2,
          lastY: VIEWBOX_HEIGHT / 2,
          lastTime: performance.now(),
        };

        let isVisible = false;

        const observer =
          new IntersectionObserver(
            ([entry]) => {
              isVisible = entry?.isIntersecting ?? false;

              if (!isVisible) {
                pointer.targetPresence = 0;
                pointer.targetEnergy = 0;

                pointer.targetVx = 0;
                pointer.targetVy = 0;
              }
            },
            {
              threshold: 0.04,
              rootMargin: "10% 0px",
            },
          );

        observer.observe(svg);

        const updatePointer = (
          event: PointerEvent,
        ) => {
          if (!allowPointer) {
            return;
          }
          const svgRect = svg.getBoundingClientRect();
          if (
            !svgRect.width ||
            !svgRect.height
          ) {
            return;
          }
          const position = clientToViewBox(
            event.clientX,
            event.clientY,
            svgRect,
          );
          const now = performance.now();
          const elapsed = Math.max(
            (now - pointer.lastTime) / 1000,
            1 / 240,
          );
          const vx = (position.x - pointer.lastX) / elapsed;
          const vy = (position.y - pointer.lastY) / elapsed;
          pointer.targetX = position.x;
          pointer.targetY = position.y;
          pointer.targetVx = clamp(
            vx,
            -1600,
            1600,
          );
          pointer.targetVy = clamp(
            vy,
            -1600,
            1600,
          );
          const speed = Math.hypot(vx, vy);
          pointer.targetEnergy = clamp(
            speed / 900,
            0,
            1,
          );
          pointer.targetPresence = 1;
          pointer.lastX = position.x;
          pointer.lastY = position.y;
          pointer.lastTime = now;
        };

        const handlePointerEnter = (
          event: PointerEvent,
        ) => {
          updatePointer(event);
          pointer.targetPresence = 1;
        };

        const handlePointerLeave = () => {
          pointer.targetPresence = 0;
          pointer.targetEnergy = 0;
          pointer.targetVx = 0;
          pointer.targetVy = 0;
        };
        
        const handleVisibilityChange = () => {
          if (document.hidden) {
            pointer.targetPresence = 0;
            pointer.targetEnergy = 0;
            pointer.targetVx = 0;
            pointer.targetVy = 0;
          }
        };

        if (allowPointer) {
          interaction.addEventListener(
            "pointerenter",
            handlePointerEnter,
            {
              passive: true,
            },
          );
          interaction.addEventListener(
            "pointermove",
            updatePointer,
            {
              passive: true,
            },
          );
          interaction.addEventListener(
            "pointerleave",
            handlePointerLeave,
            {
              passive: true,
            },
          );
          document.addEventListener("visibilitychange", handleVisibilityChange);
        }

        let simulationTime = gsap.ticker.time;
        const simulate = (time: number, dt: number) => {
          const pointerBlend = 1 - Math.exp(
            -7 * dt,
          );
          const velocityBlend = 1 - Math.exp(
            -6 * dt,
          );
          const presenceBlend = 1 - Math.exp(
            -6 * dt,
          );

          pointer.x += (pointer.targetX - pointer.x) * pointerBlend;
          pointer.y += (pointer.targetY - pointer.y) * pointerBlend;
          pointer.vx += (pointer.targetVx - pointer.vx) * velocityBlend;
          pointer.vy += (pointer.targetVy - pointer.vy) * velocityBlend;
          pointer.presence += (pointer.targetPresence - pointer.presence) * presenceBlend;
          pointer.energy += (pointer.targetEnergy - pointer.energy) * presenceBlend;

          pointer.targetVx *= Math.exp(-3.2 * dt);
          pointer.targetVy *= Math.exp(-3.2 * dt);
          pointer.targetEnergy *= Math.exp(-2.6 * dt);

          runtimeMap.forEach(
            (runtime) => {
              const {
                config,
                points,
              } = runtime;

              points.forEach(
                (point, index) => {
                  const ambient =
                    Math.sin(
                      point.baseX * config.ambientFrequency + time * config.ambientSpeed + config.ambientPhase,
                    ) * config.ambientAmplitude +
                    Math.sin(
                      point.baseX * config.ambientFrequency * 0.48 - time * config.ambientSpeed * 0.62 + index * 0.075,
                    ) * config.ambientAmplitude * 0.34;

                  const dx = pointer.x - point.baseX;
                  const dy = pointer.y - point.baseY;
                  const distance = Math.hypot(
                    dx,
                    dy,
                  );

                  const normalized = distance / config.influenceRadius;
                  const influence =
                    Math.exp(
                      -normalized * normalized * 1.65,
                    ) * pointer.presence;

                  const normalDistance =
                    dx * point.normalX + dy * point.normalY;

                  const pull =
                    normalDistance * config.pointerPull * influence;

                  const normalVelocity =
                    pointer.vx * point.normalX + pointer.vy * point.normalY;

                  const velocityImpulse =
                    normalVelocity * config.velocityInfluence * influence;

                  const localRipple =
                    Math.sin(
                      index * 0.32 - time * 2.1 + config.ambientPhase,
                    ) * config.ambientAmplitude * 0.55 * influence * pointer.energy;

                  const target = clamp(
                    ambient + pull + velocityImpulse + localRipple,
                    -config.maxDisplacement,
                    config.maxDisplacement,
                  );

                  const previous = points[Math.max(0, index - 1)];
                  const next = points[Math.min(points.length - 1, index + 1)];

                  const neighborTarget = (previous.offset + next.offset) * 0.5;

                  const tensionForce = (neighborTarget - point.offset) * config.tension;

                  const springForce = (target - point.offset) * config.stiffness;

                  const acceleration = springForce + tensionForce;

                  point.velocity += acceleration * dt;
                  point.velocity *= Math.pow(
                    config.damping,
                    dt * 60,
                  );
                },
              );

              // All neighbor forces read the same state, without a left-to-right bias.
              points.forEach((point) => {
                point.offset += point.velocity * dt;
              });
            },
          );
        };

        const render = (_time: number, deltaTime: number) => {
          if (!allowMotion || !isVisible || document.hidden) return;

          // Bound integration to 120Hz-sized steps (at most eight after a stall).
          // Render once per ticker frame; do not catch up time spent offscreen.
          const dt = Math.min(Math.max(deltaTime / 1000, 0), 1 / 15);
          const steps = Math.max(1, Math.ceil(dt * 120));
          const step = dt / steps;
          for (let i = 0; i < steps; i += 1) {
            simulationTime += step;
            simulate(simulationTime, step);
          }

          runtimeMap.forEach((runtime) => {
              const { config, points } = runtime;

              const centerPositions =
                buildDeformedGeometry(points);
              const centerPath =
                positionsToSmoothPath(centerPositions);
              const dynamicNormals =
                calculateDynamicNormals(centerPositions);

              runtime.path.setAttribute(
                "d",
                centerPath,
              );

              runtime.band.setAttribute(
                "d",
                centerPath,
              );

              runtime.rails.forEach((rail) => {
                rail.path.setAttribute(
                  "d",
                  positionsToSmoothPath(
                    offsetGeometry(
                      centerPositions,
                      dynamicNormals,
                      rail.offset,
                    ),
                  ),
                );
              });

              const phraseLength = runtime.phraseLength;
              if (
                phraseLength > 1
              ) {
                runtime.flowDistance += config.flowSpeed * dt;
                runtime.flowDistance %= phraseLength;

                const anchor = -phraseLength * 4;
                const offset = anchor - config.direction * runtime.flowDistance;

                runtime.textPaths.forEach(
                  (textPath) => {
                    textPath.setAttribute(
                      "startOffset",
                      offset.toFixed(2),
                    );
                  },
                );
              }
            },
          );
        };

        if (allowMotion) {
          gsap.ticker.add(render);
        }

        return () => {
          observer.disconnect();

          if (allowMotion) {
            gsap.ticker.remove(
              render,
            );
          }

          interaction.removeEventListener(
            "pointerenter",
            handlePointerEnter,
          );
          interaction.removeEventListener(
            "pointermove",
            updatePointer,
          );
          interaction.removeEventListener(
            "pointerleave",
            handlePointerLeave,
          );
          document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
      },
    );

    return () => {
      destroyed = true;
      mm.revert();
    };
  }, [instanceId, interactionRef]);

  return (
    <svg
      ref={svgRef}
      data-elastic-signal-field
      aria-hidden="true"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      className="
        pointer-events-none
        absolute inset-0
        h-full w-full
        overflow-hidden
      "
    >
      <defs>
        <filter
          id={`${instanceId}-amber-field-glow`}
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter
          id={`${instanceId}-cyan-field-glow`}
          x="-20%"
          y="-40%"
          width="140%"
          height="180%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {RIBBONS.map((config) => {
        const pathId =
          `${instanceId}-elastic-${config.id}`;
        const hierarchy =
          config.id === "signal"
            ? 1
            : config.id === "stack"
              ? 0.82
              : 0.64;

        return (
          <g
            key={config.id}
            data-ribbon-id={config.id}
          >
            <path
              id={pathId}
              data-elastic-path
              d={staticPath(config)}
              fill="none"
              stroke="none"
            />

            <path
              data-ribbon-band
              d={staticPath(config)}
              fill="none"
              stroke={config.rail}
              strokeOpacity={config.railOpacity * 0.2 * hierarchy}
              strokeWidth={config.id === "signal" ? 72 : 58}
              filter={`url(#${instanceId}-${config.id === "signal" ? "amber" : "cyan"}-field-glow)`}
              vectorEffect="non-scaling-stroke"
            />

            {RAIL_SPECS.map((rail) => {
              const offsetScale =
                config.id === "signal"
                  ? 1
                  : config.id === "stack"
                    ? 0.88
                    : 0.76;
              const offset = rail.offset * offsetScale;

              return (
                <path
                  key={rail.offset}
                  data-ribbon-rail
                  data-rail-offset={offset}
                  d={staticPath(config, offset)}
                  fill="none"
                  stroke={config.rail}
                  strokeOpacity={config.railOpacity * rail.opacity * hierarchy}
                  strokeWidth={rail.width}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}

            <text
              data-flow-measure
              x="-10000"
              y="-10000"
              visibility="hidden"
              fontSize={
                config.fontSize
              }
              className="
                font-mono
                font-semibold
                tracking-[0.18em]
              "
            >
              {config.phrase}
            </text>

            <text
              fontSize={
                config.fontSize
              }
              className="
                font-mono
                font-semibold
                tracking-[0.18em]
              "
              style={{
                fill: config.fill,
                opacity: config.textOpacity,
                filter: config.id === "signal"
                  ? "drop-shadow(0 0 5px rgba(242,174,66,0.28))"
                  : "none",
              }}
            >
              <textPath
                data-flow-text
                href={`#${pathId}`}
                spacing="auto"
              >
                {config.id === "signal"
                  ? Array.from(
                      { length: TEXT_REPEAT_COUNT },
                      (_, index) => [
                        <tspan
                          key={`signal-${index}`}
                          fill="#f2ae42"
                        >
                          SIGNAL ·{" "}
                        </tspan>,
                        <tspan
                          key={`signal-rest-${index}`}
                          fill="#83a8c1"
                        >
                          SYSTEMS · ENGINEERING · BUILD · SOLVE · GROW ·{" "}
                        </tspan>,
                      ],
                    )
                  : config.phrase.repeat(TEXT_REPEAT_COUNT)}
              </textPath>
            </text>
          </g>
        );
      })}
    </svg>
  );
}
