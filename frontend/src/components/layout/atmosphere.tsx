'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/* Deterministic ember field — no randomness in render (keeps hydration stable). */
const EMBERS = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 37 + 7) % 100,
  delay: -((i * 53) % 90) / 10,
  duration: 8 + ((i * 29) % 100) / 10,
  size: 2 + (i % 3),
  drift: ((i * 17) % 80) - 40,
}));

/**
 * Fixed, full-viewport atmospheric stack ported from the SOP deck:
 * dimmed Erangel terrain (luminosity), dual orange + cyan zone glow,
 * hex mesh, scanlines, vignette and a rising ember field.
 * Sits behind ALL page content; subtle pointer + scroll parallax.
 * Self-contained — only relies on the .atmos-* classes appended to globals.css.
 */
export function Atmosphere() {
  const reduceMotion = useReducedMotion();
  const mapRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, sy = 0, raf = 0;

    const loop = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      if (mapRef.current)
        mapRef.current.style.transform = `translate3d(${cx * -14}px, ${sy * 0.04 - cy * 10}px, 0) scale(1.08)`;
      if (hexRef.current)
        hexRef.current.style.transform = `translate3d(${cx * 10}px, ${sy * -0.03}px, 0)`;
      if (glowRef.current)
        glowRef.current.style.backgroundPosition = `${26 + cx * 1.4}% ${14 + cy}%, ${82 - cx * 1.1}% ${86 - cy}%`;
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) raf = requestAnimationFrame(loop);
      else raf = 0;
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onScroll = () => {
      sy = window.scrollY;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div ref={mapRef} className="absolute inset-[-10%] atmos-map will-change-transform" />
      <div
        ref={glowRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(58vw 52vh at 26% 14%, rgba(255,122,26,0.20), transparent 60%), radial-gradient(48vw 44vh at 82% 86%, rgba(52,224,232,0.10), transparent 62%)',
        }}
      />
      <div ref={hexRef} className="absolute inset-[-10%] atmos-hex will-change-transform" />
      <div className="absolute inset-0 atmos-scan" />
      <div className="absolute inset-0 atmos-vignette" />

      {!reduceMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {EMBERS.map((e, i) => (
            <span
              key={i}
              className="atmos-ember"
              style={{
                left: `${e.left}%`,
                width: `${e.size}px`,
                height: `${e.size}px`,
                animationDuration: `${e.duration}s`,
                animationDelay: `${e.delay}s`,
                ['--ember-drift' as string]: `${e.drift}px`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
