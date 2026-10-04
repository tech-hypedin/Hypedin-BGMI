'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { ChevronRight, ChevronsDown } from 'lucide-react';
import { Button } from '../ui/button';
import { DecodeText } from '../motion/primitives';
import { PILLARS } from '../../../public/data/program';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

/* Deterministic ember field (no randomness in render — keeps hydration stable). */
const EMBERS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: ((i * 53) % 80) / 10,
  duration: 9 + ((i * 29) % 70) / 10,
  size: 2 + (i % 3),
}));

export function Hero() {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  // Defer the heavy hero video so it never blocks first paint:
  // the poster shows instantly; the clip loads + plays once the browser is idle.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduceMotion) return;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      v.preload = 'auto';
      v.play().catch(() => {});
    };
    const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    const id = ric ? ric(start, { timeout: 2500 }) : window.setTimeout(start, 1500);
    return () => {
      const cic = (window as unknown as { cancelIdleCallback?: (id: number) => void }).cancelIdleCallback;
      if (ric && cic) cic(id); else window.clearTimeout(id as number);
    };
  }, [reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const squadY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Mouse-reactive depth: squad drifts with the cursor, HUD chips counter-drift.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const squadX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 60, damping: 18 });
  const squadDriftY = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 60, damping: 18 });
  const chipX = useSpring(useTransform(mx, [-0.5, 0.5], [9, -9]), { stiffness: 60, damping: 18 });
  const chipY = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 60, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduceMotion || e.pointerType !== 'mouse' || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
      aria-label="BGMI Campus Champion Program"
    >
      {/* Layer 0 — Erangel terrain, heavily dimmed */}
      <motion.div style={reduceMotion ? undefined : { y: bgY }} className="absolute inset-0" aria-hidden="true">
        <Image
          src="/art/erangel.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.16]"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black via-black/60 to-black" />
      </motion.div>

      {/* Layer 1 — grid + scanlines */}
      <div className="absolute inset-0 grid-overlay" aria-hidden="true" />
      <div className="absolute inset-0 scanlines" aria-hidden="true" />

      {/* Layer 2 — ambient glow */}
      <div
        className="absolute top-1/3 right-[12%] w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]"
        style={{ animation: reduceMotion ? 'none' : 'glow-pulse 6s ease-in-out infinite' }}
        aria-hidden="true"
      />

      {/* Layer 3 — rising embers */}
      {!reduceMotion && (
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="ember"
              style={{
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="min-w-0">
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 border border-primary/40 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2 mb-7 max-w-full"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full bg-[var(--bgmi-green)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 bg-[var(--bgmi-green)]" />
            </span>
            <span className="font-heading text-[11px] sm:text-sm tracking-[0.15em] sm:tracking-[0.25em] text-primary">
              OFFICIAL AMBASSADOR PROGRAM
            </span>
          </motion.div>

          <h1 className="font-teko text-[3.4rem] leading-[0.9] sm:text-7xl md:text-8xl font-bold text-white mb-2">
            <DecodeText text="BECOME YOUR" />
            <br />
            <span className="text-primary text-glow">
              <DecodeText text="CAMPUS MVP." charDelay={30} />
            </span>
          </h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed"
          >
            <strong className="text-white font-semibold">BGMI® Campus MVP Program</strong>{' '}
            is your shot at running BGMI on your campus — organising matches, building a player
            community, and earning real rewards while competing against ambassadors across India.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.65 }} className="mt-8 grid grid-cols-1 md:grid-cols-2 items-stretch sm:items-center gap-3 sm:gap-4">
            <Button size="lg" className="font-teko font-bold w-full sm:w-auto px-6 sm:px-12 text-base" onClick={() => router.push('/application')} aria-label="Apply for the BGMI Campus Champion Program">
              <span className="sm:hidden">APPLY NOW</span>
              <span className="hidden sm:inline">BECOME YOUR CAMPUS MVP</span>
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
            
            <Button size="lg" className="font-teko font-bold w-full sm:w-auto px-6 sm:px-12 text-base hover:text-background bg-transparent text-foreground flex-1" onClick={() => router.push('/login')} aria-label="Apply for the BGMI Campus Champion Program">
              <span className="">Log InTo the Dashboard</span>
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </motion.div>

          {/* Strategic pillars strip
          <motion.ul
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border max-w-xl"
            aria-label="Core strategic pillars"
          >
            {PILLARS.map((p) => (
              <li key={p.title} className="bg-black px-4 py-4">
                <span className="block font-heading text-lg md:text-xl text-white leading-tight uppercase tracking-wider">
                  {p.title}
                </span>
                <span className="block text-[11px] text-muted-foreground mt-1.5 leading-snug">
                  {p.detail}
                </span>
              </li>
            ))}
          </motion.ul> */}
        </div>

        <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className='relative flex items-center justify-center min-w-0 w-full'
          >
            <div className='relative w-full aspect-square md:aspect-video border border-[#1f1f1f] group overflow-hidden'>
                <div className='absolute inset-0 bg-linear-to-t from-[#090907] via-transparent to-transparent z-10' />
                <video ref={videoRef} muted loop playsInline preload='none' poster='/art/erangel.webp' className='absolute inset-0 w-full h-full object-cover grayscale-[0.3] brightness-[0.8] contrast-[1.2]'>
                  <source src='/videos/AR.mp4' type='video/mp4' />
                </video>

              {/* Corner Accents */}
              <div className='absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary z-20' />
              <div className='absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary z-20' />
              <div className='absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary z-20' />
              <div className='absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary z-20' />

            </div>
          </motion.div>

      </div>

      {/* Scroll cue — guides into the page flow */}
      <motion.a
        href="#program"
        aria-label="Scroll to program overview"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="font-heading text-[10px] tracking-[0.35em] uppercase">The Briefing</span>
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronsDown className="w-4 h-4" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  );
}