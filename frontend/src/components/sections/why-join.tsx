'use client';

import React from 'react';
import { BadgeCheck, Gamepad2, Briefcase, Crown } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { SectionHeading } from '../motion/primitives';
import { VALUE_PROPS } from '../../../public/data/program';

const ICONS = [BadgeCheck, Gamepad2, Briefcase, Crown];

/** §II — Ambassador value proposition. */
export function WhyJoin() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 scanlines" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Why Join"
          title="A Pathway to Recognized Leadership."
          sub="Significant developmental and status benefits beyond standard participation — in the gaming industry and in your college community."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {VALUE_PROPS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <GlassCard key={item.title} index={i} className="p-6 h-full">
                <div className="w-11 h-11 border border-primary/40 bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:[&_svg]:text-black transition-colors">
                  <Icon className="w-5 h-5 text-primary transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-xl md:text-2xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}