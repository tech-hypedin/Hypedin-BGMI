'use client';

import React from 'react';
import { Shirt, Headphones, Ticket, Megaphone } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { SectionHeading } from '../motion/primitives';
import { PERKS } from '../../../public/data/program';

const PERK_ICONS = [Shirt, Headphones, Ticket, Megaphone];

/** §V — Recognition and resource allocation. */
export function Perks() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Recognition & Resources"
          title="Dedication Gets Rewarded."
          sub="A comprehensive package of material goods, In game assets, and career opportunities — built to support both competitive play and professional development."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PERKS.map((perk, i) => {
            const Icon = PERK_ICONS[i];
            return (
              <GlassCard key={perk.title} index={i} className="p-6 h-full">
                <div className="flex flex-col h-full">
                  <div className="w-11 h-11 border border-primary/40 bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:[&_svg]:text-black transition-colors">
                    <Icon className="w-5 h-5 text-primary transition-colors" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl md:text-2xl text-white mb-2">{perk.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{perk.detail}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}