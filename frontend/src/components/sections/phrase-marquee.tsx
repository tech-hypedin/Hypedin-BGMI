import React from 'react';
import { GAME_PHRASES } from '../../../public/data/program';

/**
 * CSS-only marquee of the official BGMI community phrases
 * (brand book "Iconic Game Phrases"). Server component — zero JS.
 */
export function PhraseMarquee() {
  const row = [...GAME_PHRASES, ...GAME_PHRASES];
  return (
    <div className="relative border-y border-border bg-card overflow-hidden py-4" aria-hidden="true">
      <div className="marquee-track">
        {row.map((phrase, i) => (
          <span
            key={`${phrase}-${i}`}
            className="font-heading text-base sm:text-lg md:text-2xl uppercase tracking-[0.12em] sm:tracking-[0.2em] whitespace-nowrap px-4 sm:px-6 flex items-center gap-4 sm:gap-6"
          >
            <span className={i % 2 === 0 ? 'text-white/85' : 'text-primary'}>{phrase}</span>
            <span className="text-border text-sm">▰</span>
          </span>
        ))}
      </div>
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-linear-to-l from-black to-transparent" />
    </div>
  );
}