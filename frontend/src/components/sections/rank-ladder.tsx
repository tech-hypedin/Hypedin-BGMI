'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Gift } from 'lucide-react';
import { SectionHeading } from '@/components/motion/primitives';
import { RANK_LADDER } from '../../../public/data/program';

const TIER_STYLE: Record<string, { bar: string; text: string; icon: string, threshold: number | null }> = {
  Bronze: { bar: 'bg-white/20', text: 'text-white/70', icon: 'text-white/40', threshold: 0 },
  Silver: { bar: 'bg-white/35', text: 'text-white/80', icon: 'text-white/50', threshold: 500 },
  Gold: { bar: 'bg-primary/55', text: 'text-primary/90', icon: 'text-primary/70', threshold: 1200 },
  Platinum: { bar: 'bg-primary/70', text: 'text-primary', icon: 'text-primary/80', threshold: 2500 },
  Diamond: { bar: 'bg-primary/85', text: 'text-primary', icon: 'text-primary/90', threshold: 4000 },
  Crown: { bar: 'bg-primary', text: 'text-primary', icon: 'text-primary', threshold: 6000 },
  Ace: { bar: 'bg-primary', text: 'text-primary', icon: 'text-primary', threshold: 8500 },
  Conqueror: { bar: 'bg-[#FFC24B]/20', text: 'text-[#FFC24B]', icon: 'text-[#FFC24B]', threshold: null },
}

export function RankLadder() {
  const maxThreshold = 6500;

  return (
    <section className='relative py-24 md:py-32 overflow-hidden'>
      <div className='absolute inset-0 grid-overlay opacity-60' aria-hidden='true' />
      <div className='relative max-w-7xl mx-auto px-6 lg:px-8 z-10'>
        <SectionHeading
          kicker='Rank Ladder'
          title='Bronze to Conqueror. Every Tier Reachable.'
          sub='Phase RP drives your rank and tier rewards. Cumulative RP drives the national leaderboard — and decides the Top 5 Conquerors.'
        />

        <div className='space-y-2.5 mt-12' role='list' aria-label='Rank ladder tiers and rewards'>
          {RANK_LADDER.map((tier, i) => {
            const style = TIER_STYLE[tier.name];
            const isConqueror = tier.threshold === null;
            const widthPct = isConqueror ? 100 : Math.max(8, (tier.threshold! / maxThreshold) * 100);
            return (
              <motion.div
                role='listitem'
                key={tier.name}
                initial={{ opacity: 0, x: -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                className={`group relative bg-card border transition-colors overflow-hidden ${
                  isConqueror ? 'border-[#FFC24B]/30 hover:border-[#FFC24B]/60' : 'border-border hover:border-primary/50'
                }`}
              >
                {/* Progress bar accent overlay tracking */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.07, ease: [0.21, 0.47, 0.32, 0.98] }}
                  style={{ width: `${widthPct}%` }}
                  className={`absolute inset-y-0 left-0 origin-left opacity-[0.08] ${style.bar}`}
                  aria-hidden='true'
                />

                <div className='relative grid grid-cols-[1fr_auto] sm:grid-cols-[230px_140px_1fr] gap-x-4 gap-y-1 items-center px-6 py-5'>
                  {/* Tier Main Title Label */}
                  <div className='flex items-center gap-3'>
                    <span className={`font-heading text-3xl font-black uppercase tracking-wider leading-none whitespace-nowrap ${style.text}`}>
                      {tier.name}
                    </span>
                    {isConqueror && <Crown className={`w-5 h-5 ${style.icon}`} aria-hidden='true' />}
                  </div>

                  {/* Operational Metrics */}
                  <div className={`font-body text-sm font-black tracking-[0.2em] text-right sm:text-left uppercase ${
                    isConqueror ? 'text-[#FFC24B]/70' : 'text-muted-foreground'
                  }`}>
                    {isConqueror ? 'TOP 5' : `${tier?.threshold?.toLocaleString('en-IN')} RP`}
                    <span className='hidden md:inline text-white/20 font-bold'> · {tier.stage}</span>
                  </div>

                  {/* Rewards Distribution Layout Descriptor Block */}
                  <div className='col-span-2 sm:col-span-1 flex items-center gap-3 text-sm font-body text-foreground/85 font-medium tracking-wide mt-1 sm:mt-0'>
                    <Gift className={`w-4 h-4 shrink-0 ${isConqueror ? 'text-[#FFC24B]/70' : 'text-primary/70'}`} aria-hidden='true' />
                    <span>{tier.detail}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}