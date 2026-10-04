'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

/** Count-up number that animates when scrolled into view. */
export function CountUp({
  value,
  suffix = '',
  className,
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduceMotion = useReducedMotion();
  // deterministic initial state — reduced-motion users snap to the value in the effect
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
}

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/';

/** HUD-style decode/scramble headline. Resolves left-to-right on mount/in-view. */
export function DecodeText({
  text,
  className,
  charDelay = 38,
}: {
  text: string;
  className?: string;
  charDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduceMotion = useReducedMotion();
  // Server-render the real text (SEO + no-JS); the scramble takes over on view.
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let frame = 0;
    let raf: number;
    let last = performance.now();
    const tick = (now: number) => {
      if (now - last >= charDelay) {
        frame += 1;
        last = now;
      }
      const resolved = text.slice(0, frame);
      const scrambled = text
        .slice(frame, Math.min(frame + 3, text.length))
        .split('')
        .map((c) => (c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
        .join('');
      setOutput(resolved + scrambled);
      if (frame <= text.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, text, charDelay, reduceMotion]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {output || ' '}
    </span>
  );
}

/** Standard section header: kicker badge + headline + optional sub copy. */
export function SectionHeading({
  kicker,
  title,
  sub,
  align = 'center',
  className,
}: {
  kicker: string;
  title: string;
  sub?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  return (
    <div className={cn('mb-12 md:mb-16', align === 'center' ? 'text-center' : 'text-left', className)}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className={cn(
          'inline-flex items-center gap-2 border border-border bg-card px-3 py-1.5 mb-5',
          align === 'center' ? 'mx-auto' : ''
        )}
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full bg-primary opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 bg-primary" />
        </span>
        <span className="font-heading text-xs md:text-sm tracking-[0.12em] sm:tracking-[0.25em] text-primary uppercase">{kicker}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-white leading-[1.02] sm:leading-[0.95]"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className={cn(
            'mt-4 text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed',
            align === 'center' ? 'mx-auto' : ''
          )}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}