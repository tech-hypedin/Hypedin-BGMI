'use client';

import React, { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * BGMI Air Drop — scroll-driven descent.
 *
 * Phases:
 *  1. DESCENT  — scrubbed to scroll progress: the crate falls from above the
 *     section while swaying and tilting like it's hanging off a parachute.
 *  2. LANDING  — fires once when the descent completes: squash-and-stretch
 *     impact, a dust burst at the base, and a short shake localized to the
 *     crate column. The scroll trigger is killed so the drop never "un-lands".
 *  3. IDLE     — gentle hover, glow and ground-shadow breathing, forever.
 *
 * All animation is transform/opacity only. Reduced-motion users get the
 * crate statically in place. The column is hidden below lg, and the GSAP
 * setup is also gated to ≥1024px so phones pay zero cost.
 */
export function AirDropCrate() {
  const columnRef = useRef<HTMLDivElement>(null); // shake target + trigger
  const dropRef = useRef<HTMLDivElement>(null); // scrubbed vertical travel
  const swayRef = useRef<HTMLDivElement>(null); // pendulum sway + idle float
  const crateRef = useRef<HTMLDivElement>(null); // impact squash/stretch
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const smokeRef = useRef<HTMLDivElement>(null);
  const flareRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!columnRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      let landed = false;

      /** One red smoke particle drifting up from the crate's signal flare. */
      const emitSmoke = (burst = false) => {
        const host = smokeRef.current;
        if (!host) return;
        const p = document.createElement('div');
        const size = gsap.utils.random(burst ? 34 : 26, burst ? 68 : 54);
        Object.assign(p.style, {
          position: 'absolute',
          top: '0px',
          left: '50%',
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '9999px',
          pointerEvents: 'none',
          filter: 'blur(7px)',
          background:
            'radial-gradient(circle, rgba(230,48,30,0.85) 0%, rgba(205,40,32,0.55) 40%, rgba(185,35,30,0) 72%)',
        } as Partial<CSSStyleDeclaration>);
        host.appendChild(p);
        const drift = gsap.utils.random(-44, 44);
        gsap.fromTo(
          p,
          { x: gsap.utils.random(-20, 20), y: 10, opacity: 0, scale: 0.5 },
          {
            x: drift,
            y: gsap.utils.random(-190, -270),
            opacity: 1,
            scale: gsap.utils.random(2.2, 3.4),
            duration: burst ? gsap.utils.random(0.9, 1.4) : gsap.utils.random(2.4, 3.4),
            ease: 'power1.out',
            onUpdate() {
              // fade out over the back half of the rise
              if (this.progress() > 0.5) {
                gsap.set(p, { opacity: (1 - this.progress()) * 1.9 });
              }
            },
            onComplete: () => p.remove(),
          }
        );
      };

      // Continuous signal-smoke emitter — only spawns while the crate is
      // actually on screen and the tab is visible, so it costs nothing idle.
      let smokeActive = false;
      let smokeTimer: gsap.core.Tween | null = null;
      const smokeLoop = () => {
        if (!smokeActive) return;
        if (
          !document.hidden &&
          columnRef.current &&
          ScrollTrigger.isInViewport(columnRef.current, 0.05) &&
          // hard cap so the plume can never run away on slow machines
          (smokeRef.current?.children.length ?? 0) < 70
        ) {
          // three staggered particles per tick = a heavy, continuous column
          emitSmoke();
          gsap.delayedCall(0.05, emitSmoke);
          gsap.delayedCall(0.1, emitSmoke);
        }
        smokeTimer = gsap.delayedCall(gsap.utils.random(0.1, 0.16), smokeLoop);
      };
      const startSmoke = () => {
        if (smokeActive) return;
        smokeActive = true;
        // flare core ignites and keeps burning
        if (flareRef.current) {
          gsap.fromTo(
            flareRef.current,
            { opacity: 0, scale: 0.4 },
            { opacity: 0.95, scale: 1, duration: 0.3, ease: 'power2.out' }
          );
          gsap.to(flareRef.current, {
            opacity: 0.55,
            scale: 0.82,
            duration: 0.5,
            yoyo: true,
            repeat: -1,
            ease: 'sine.inOut',
            delay: 0.3,
          });
        }
        smokeLoop();
      };
      const stopSmoke = () => {
        smokeActive = false;
        smokeTimer?.kill();
        smokeTimer = null;
        smokeRef.current?.replaceChildren();
        if (flareRef.current) {
          gsap.killTweensOf(flareRef.current);
          gsap.set(flareRef.current, { opacity: 0 });
        }
      };

      const burstDust = () => {
        const host = dustRef.current;
        if (!host) return;
        for (let i = 0; i < 16; i++) {
          const p = document.createElement('div');
          const size = gsap.utils.random(3, 9);
          Object.assign(p.style, {
            position: 'absolute',
            bottom: '0px',
            left: '50%',
            width: `${size}px`,
            height: `${size}px`,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle, rgba(214,196,158,0.85) 0%, rgba(214,196,158,0) 70%)',
          } as Partial<CSSStyleDeclaration>);
          host.appendChild(p);
          gsap.fromTo(
            p,
            { x: gsap.utils.random(-14, 14), y: 0, opacity: 0.9, scale: 1 },
            {
              x: gsap.utils.random(-110, 110),
              y: gsap.utils.random(-60, -14),
              opacity: 0,
              scale: gsap.utils.random(1.6, 3),
              duration: gsap.utils.random(0.5, 0.95),
              ease: 'power2.out',
              onComplete: () => p.remove(),
            }
          );
        }
      };

      const startIdle = () => {
        startSmoke();
        gsap.to(swayRef.current, {
          y: -9,
          duration: 2.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
        gsap.to(swayRef.current, {
          rotation: 1.2,
          duration: 3.4,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
        gsap.to(glowRef.current, {
          opacity: 0.6,
          scale: 1.08,
          duration: 2.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
        gsap.to(shadowRef.current, {
          scaleX: 0.9,
          opacity: 0.35,
          duration: 2.6,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        });
      };

      mm.add(
        {
          full: '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
          still: '(prefers-reduced-motion: reduce)',
        },
        (mctx) => {
          const { full } = mctx.conditions as { full: boolean };

          if (!full) {
            // Reduced motion (or first paint on small screens): land instantly.
            gsap.set([dropRef.current, swayRef.current, crateRef.current], {
              clearProps: 'all',
            });
            gsap.set(cardRef.current, { opacity: 1, y: 0 });
            gsap.set(glowRef.current, { opacity: 0.45 });
            gsap.set(shadowRef.current, { opacity: 0.45, scaleX: 1 });
            return;
          }

          // Pre-landing state.
          gsap.set(cardRef.current, { opacity: 0, y: 18 });
          gsap.set(shadowRef.current, { opacity: 0.12, scaleX: 0.55 });
          gsap.set(glowRef.current, { opacity: 0.15, scale: 0.85 });

          const land = (drop: gsap.core.Timeline) => {
            if (landed) return;
            landed = true;
            columnRef.current?.setAttribute('data-landed', 'true');

            // Freeze the descent exactly at touchdown, then drop the trigger
            // so scrolling back up never re-lifts the crate.
            drop.scrollTrigger?.kill();
            drop.kill();
            gsap.set(dropRef.current, { yPercent: 0, opacity: 1 });
            gsap.set(swayRef.current, { x: 0, rotation: 0 });

            burstDust();
            // signal flare pops on touchdown — thick red burst before the steady plume
            for (let i = 0; i < 20; i++) {
              gsap.delayedCall(i * 0.035, () => emitSmoke(true));
            }

            const impact = gsap.timeline({ onComplete: startIdle });
            impact
              // squash…
              .to(crateRef.current, {
                scaleY: 0.92,
                scaleX: 1.06,
                y: 7,
                duration: 0.12,
                ease: 'power2.in',
                transformOrigin: '50% 100%',
              })
              // …stretch…
              .to(crateRef.current, {
                scaleY: 1.03,
                scaleX: 0.98,
                y: -9,
                duration: 0.16,
                ease: 'power1.out',
              })
              // …settle.
              .to(crateRef.current, {
                scale: 1,
                y: 0,
                duration: 0.45,
                ease: 'bounce.out',
              })
              // localized shake on the column, not the page
              .to(
                columnRef.current,
                {
                  keyframes: [
                    { x: -5, y: 3 },
                    { x: 4, y: -2 },
                    { x: -3, y: 2 },
                    { x: 2, y: -1 },
                    { x: 0, y: 0 },
                  ],
                  duration: 0.42,
                  ease: 'power2.out',
                },
                0
              )
              // impact glow flash
              .fromTo(
                glowRef.current,
                { opacity: 0.2, scale: 0.9 },
                { opacity: 0.85, scale: 1.25, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' },
                0
              )
              // ground shadow snaps under the crate
              .to(shadowRef.current, { opacity: 0.55, scaleX: 1, duration: 0.3, ease: 'power2.out' }, 0)
              // info card slides up once the drop is secured
              .to(cardRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.3);
          };

          const drop = gsap.timeline({
            scrollTrigger: {
              trigger: columnRef.current,
              start: 'top 95%',
              end: 'top 40%',
              scrub: 0.8,
              onUpdate(self) {
                if (self.progress > 0.985) land(drop);
              },
              onLeave() {
                land(drop); // fast-scroll / deep-link past the section
              },
            },
          });

          // Vertical travel — eased so the last stretch slows like a flare-out.
          drop.fromTo(
            dropRef.current,
            { yPercent: -135, opacity: 0.3 },
            { yPercent: 0, opacity: 1, ease: 'power1.inOut', duration: 1 },
            0
          );

          // Parachute pendulum: sway + tilt, decaying as it nears the ground.
          drop.fromTo(
            swayRef.current,
            { x: -26, rotation: -6 },
            {
              keyframes: [
                { x: 20, rotation: 5, ease: 'sine.inOut' },
                { x: -14, rotation: -3.5, ease: 'sine.inOut' },
                { x: 9, rotation: 2, ease: 'sine.inOut' },
                { x: 0, rotation: 0, ease: 'sine.out' },
              ],
              duration: 1,
            },
            0
          );

          return () => {
            // matchMedia cleanup: dust nodes vanish with their tweens
            dustRef.current?.replaceChildren();
            stopSmoke();
          };
        }
      );
    }, columnRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={columnRef} className="relative hidden lg:flex flex-col items-center">
      {/* travel wrapper — scrubbed by scroll */}
      <div ref={dropRef} className="relative will-change-transform">
        {/* pendulum wrapper — sway during descent, hover after landing */}
        <div ref={swayRef} className="relative will-change-transform">
          <div
            ref={glowRef}
            className="absolute inset-x-6 bottom-0 h-16 bg-primary/15 blur-3xl"
            aria-hidden="true"
          />
          {/* red signal smoke — rises from the flare on top of the crate */}
          <div ref={smokeRef} className="absolute top-2 inset-x-0 h-0 z-0" aria-hidden="true" />
          {/* burning flare core at the smoke origin */}
          <div
            ref={flareRef}
            className="absolute top-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full opacity-0 z-0"
            style={{
              background: 'radial-gradient(circle, rgba(255,90,60,0.95) 0%, rgba(220,45,30,0.6) 45%, rgba(220,45,30,0) 75%)',
              filter: 'blur(2px)',
              boxShadow: '0 0 24px 10px rgba(220,45,30,0.35)',
            }}
            aria-hidden="true"
          />
          <div ref={crateRef} className="relative z-10">
            <Image
              src="/art/care-package.webp"
              alt="BGMI Air Drop care package"
              width={400}
              height={287}
              sizes="(min-width: 1024px) 380px, 0px"
            />
          </div>
        </div>
      </div>

      {/* ground shadow — stays on the ground while the crate travels */}
      <div
        ref={shadowRef}
        className="h-4 w-56 -mt-3 rounded-[50%] bg-black/80 blur-md"
        aria-hidden="true"
      />

      {/* dust burst host, anchored at the landing point */}
      <div ref={dustRef} className="absolute bottom-24 inset-x-0 h-0 z-20" aria-hidden="true" />

      <div ref={cardRef} className="mt-8 text-center border border-border bg-card px-6 py-4 w-full">
        <p className="font-heading text-sm tracking-[0.25em] text-primary uppercase">Air Drop Incoming</p>
        <p className="text-sm text-muted-foreground mt-1.5">
          Exclusive merch, gaming hardware, and VIP access — recognition reserved for accredited
          ambassadors.
        </p>
      </div>
    </div>
  );
}