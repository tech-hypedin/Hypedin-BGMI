'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { SectionHeading } from '../motion/primitives';
import { AirDropCrate } from '../motion/air-drop-crate';
import { SEASONAL_CYCLE } from '../../../public/data/program';

/** §III.B — Seasonal gameplay cycle. */
export function Missions() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">
          <div>
            <SectionHeading
              align="left"
              kicker="Seasonal Cycle"
              title="Grind Smart. Rank Faster."
              sub="Competition runs on monthly cycles that reset the leaderboard — a level playing field, every season. Success is strategic execution across three measurable fronts."
            />

            <div className="space-y-3">
              {SEASONAL_CYCLE.map((item, i) => (
                <GlassCard key={item.title} index={i} tilt={false} className="p-5">
                  <div className="flex items-center gap-4">
                    <span className="font-heading text-3xl text-primary/40 w-8 flex-shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-lg sm:text-xl md:text-2xl text-white">{item.title}</h3>
                        <TrendingUp className="w-4 h-4 text-primary" aria-hidden="true" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{item.detail}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Air Drop — official BGMI icon (used as-is per icon usage rules),
              scroll-driven parachute descent + landing via GSAP ScrollTrigger */}
          <AirDropCrate />
        </div>
      </div>
    </section>
  );
}