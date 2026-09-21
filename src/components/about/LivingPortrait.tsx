"use client";

import type { ReactNode } from "react";
import {
  useLayoutEffect,
  useRef,
} from "react";

import Image from "next/image";
import { gsap } from "gsap";

import FlowingBackgroundText from "@/components/shared/FlowingBackgroundText";

type LivingPortraitProps = {
  portraitSrc: string;
  alt: string;
  children?: ReactNode;
};

export default function LivingPortrait({
  portraitSrc,
  alt,
  children,
}: LivingPortraitProps) {
  const rootRef =
    useRef<HTMLDivElement>(null);

  const atmosphereRef =
    useRef<HTMLDivElement>(null);

  const wavesRef =
    useRef<HTMLDivElement>(null);

  /*
   * Pointer depth owns this child element.
   *
   * Separating them prevents two GSAP tweens
   * from fighting over the same x/y transform.
   */
  const portraitDepthRef =
    useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const atmosphere =
      atmosphereRef.current;
    const waves = wavesRef.current;
    const portraitDepth =
      portraitDepthRef.current;
    if (
      !root ||
      !atmosphere ||
      !waves ||
      !portraitDepth
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion:
          "(prefers-reduced-motion: no-preference)",
        desktop:
          "(min-width: 768px) and (pointer: fine)",
      },
      (context) => {
        const conditions =
          context.conditions as
            | {
                motion?: boolean;
                desktop?: boolean;
              }
            | undefined;

        const allowMotion =
          Boolean(
            conditions?.motion,
          );

        const allowPointerDepth =
          allowMotion &&
          Boolean(
            conditions?.desktop,
          );

        if (!allowMotion) {
          gsap.set(
            [
              atmosphere,
              waves,
              portraitDepth,
            ],
            {
              x: 0,
              y: 0,
              scale: 1,
            },
          );

          return;
        }

        /*
         * Breathing and parallax deliberately live
         * on different wrappers.
         */
        const atmosphereBreath =
          gsap.to(
            atmosphere,
            {
              scale: 1.008,
              duration: 9,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
              paused: true,
            },
          );

        let isVisible = false;

        const syncAmbientPlayback =
          () => {
            const active =
              isVisible &&
              !document.hidden;

            if (active) {
              atmosphereBreath.resume();
            } else {
              atmosphereBreath.pause();
            }
          };

        const observer =
          new IntersectionObserver(
            ([entry]) => {
              isVisible =
                entry?.isIntersecting ??
                false;

              syncAmbientPlayback();
            },
            {
              threshold: 0.05,
              rootMargin:
                "10% 0px",
            },
          );

        observer.observe(root);

        const handleVisibilityChange =
          () => {
            syncAmbientPlayback();
          };

        document.addEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );

        /*
         * Mobile/coarse pointers retain only the
         * slow ambient motion.
         */
        if (!allowPointerDepth) {
          return () => {
            observer.disconnect();

            document.removeEventListener(
              "visibilitychange",
              handleVisibilityChange,
            );

            atmosphereBreath.kill();
          };
        }

        const atmosphereX =
          gsap.quickTo(
            atmosphere,
            "x",
            {
              duration: 0.9,
              ease: "power3.out",
            },
          );

        const atmosphereY =
          gsap.quickTo(
            atmosphere,
            "y",
            {
              duration: 0.9,
              ease: "power3.out",
            },
          );

        const clamp =
          gsap.utils.clamp(-1, 1);

        const handlePointerMove = (
          event: PointerEvent,
        ) => {
          const bounds =
            root.getBoundingClientRect();

          if (
            !bounds.width ||
            !bounds.height
          ) {
            return;
          }

          const normalizedX =
            clamp(
              ((event.clientX -
                bounds.left) /
                bounds.width -
                0.5) *
                2,
            );

          const normalizedY =
            clamp(
              ((event.clientY -
                bounds.top) /
                bounds.height -
                0.5) *
                2,
            );

          /*
           * Background travels more.
           */
          atmosphereX(
            normalizedX * 2.5,
          );

          atmosphereY(
            normalizedY * 1.75,
          );
        };

        const resetDepth = () => {
          atmosphereX(0);
          atmosphereY(0);

        };

        root.addEventListener(
          "pointermove",
          handlePointerMove,
          {
            passive: true,
          },
        );

        root.addEventListener(
          "pointerleave",
          resetDepth,
        );

        return () => {
          observer.disconnect();

          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );

          root.removeEventListener(
            "pointermove",
            handlePointerMove,
          );

          root.removeEventListener(
            "pointerleave",
            resetDepth,
          );

          atmosphereX.tween.kill();
          atmosphereY.tween.kill();

          atmosphereBreath.kill();
        };
      },
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      data-living-portrait
      className="
        group
        relative
        isolate
        h-full
        w-full
        overflow-hidden
        bg-ink-900
      "
    >
      {/* Z-0: atmosphere */}
      <div
        ref={atmosphereRef}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-[3%]
          z-0
          will-change-transform
        "
        style={{
          backgroundColor:
            "#050a11",

          backgroundImage: `
            radial-gradient(
              circle at 66% 34%,
              rgba(67, 201, 255, 0.09),
              transparent 37%
            ),
            radial-gradient(
              circle at 76% 51%,
              rgba(242, 174, 66, 0.08),
              transparent 28%
            ),
            linear-gradient(
              rgba(77, 165, 214, 0.075) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(77, 165, 214, 0.075) 1px,
              transparent 1px
            )
          `,

          backgroundSize:
            "auto, auto, 42px 42px, 42px 42px",
        }}
      />

      {/* subtle vignette */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          z-[1]
        "
        style={{
          background:
            "radial-gradient(circle at 50% 48%, transparent 35%, rgba(0,0,0,0.28) 100%)",
        }}
      />

      {/* Z-10: living SIGNAL environment */}
      <div
        ref={wavesRef}
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -inset-[2%]
          z-10
          will-change-transform
        "
      >
        <FlowingBackgroundText interactionRef={rootRef} />
      </div>

      {/* Z-20: portrait ambient owner */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          z-20
        "
      >
        {/* pointer depth owner */}
        <div
          ref={portraitDepthRef}
          className="
            relative
            h-full
            w-full
            will-change-transform
          "
        >
          <div
            data-portrait-composition
            className="
              absolute
              inset-x-0
              top-[10%]
              -bottom-[10%]
              origin-bottom
              scale-[1.04]
            "
          >
            <Image
              src={portraitSrc}
              alt={alt}
              fill
              sizes="
                (max-width: 768px) 100vw,
                50vw
              "
              className="
                object-contain
                object-bottom
                md:grayscale
                md:opacity-90
                md:transition-[filter,opacity]
                md:duration-500
                md:ease-out
                md:group-hover:grayscale-0
                md:group-hover:opacity-100
              "
              priority={false}
            />
          </div>
        </div>
      </div>

      {/* Z-30: existing UI */}
      <div
        className="
          relative
          z-30
          h-full
          w-full
        "
      >
        {children}
      </div>
    </div>
  );
}
