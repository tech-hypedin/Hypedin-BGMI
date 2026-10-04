'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { CalendarCheck, Tv, MessagesSquare } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { SectionHeading } from '../motion/primitives';
import { RESPONSIBILITIES, ROADMAP } from '../../../public/data/program';

const RESP_ICONS = [CalendarCheck, Tv, MessagesSquare];

/** §IV — Core responsibilities and the execution roadmap. */
export function Role() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 80, damping: 24 });

  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Your Role"
          title="Run the Campus. Own the Scene."
          sub="The Campus MVP manages the organizational, promotional, and competitive life of BGMI on campus — and climbs by executing a clear roadmap."
        />

        {/* §IV.A — community management & activation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
          {RESPONSIBILITIES.map((item, i) => {
            const Icon = RESP_ICONS[i];
            return (
              <GlassCard key={item.title} index={i} className="p-6 h-full">
                <div className="w-11 h-11 border border-primary/40 bg-primary/5 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:[&_svg]:text-black transition-colors">
                  <Icon className="w-5 h-5 text-primary transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* §IV.B — execution roadmap: alternating cards on a center spine */}
        <div className="max-w-5xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-xl sm:text-2xl md:text-3xl text-white text-center mb-12"
          >
            The Execution <span className="text-primary">Roadmap</span>
          </motion.h3>

          <div ref={ref} className="relative">
            {/* spine */}
            <div className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-border" aria-hidden="true" />
            <motion.div
              style={{ scaleY }}
              className="absolute left-5 lg:left-1/2 top-0 bottom-0 w-px bg-primary origin-top"
              aria-hidden="true"
            />

            <ol className="space-y-12 lg:space-y-16">
              {ROADMAP.map((step, i) => {
                const fromLeft = i % 2 === 0;
                return (
                  <li key={step.title} className="relative grid lg:grid-cols-2 gap-8 items-start">
                    {/* numbered node on the spine */}
                    <motion.span
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                      className="absolute left-5 lg:left-1/2 -translate-x-1/2 top-1 z-10 w-9 h-9 bg-black border-2 border-primary flex items-center justify-center"
                      aria-hidden="true"
                    >
                      {/* one-shot radar ring when the node locks in */}
                      <motion.span
                        initial={{ scale: 1, opacity: 0.7 }}
                        whileInView={{ scale: 2.2, opacity: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.9, delay: 0.35, ease: 'easeOut' }}
                        className="absolute inset-0 border border-primary"
                      />
                      <span className="font-heading text-base text-primary leading-none">{i + 1}</span>
                    </motion.span>

                    {/* card — alternates sides of the spine on desktop */}
                    <motion.div
                      initial={{ opacity: 0, x: fromLeft ? -44 : 44 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '-80px' }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className={`ml-14 lg:ml-0 ${
                        fromLeft
                          ? 'lg:col-start-1 lg:pr-14 lg:text-right'
                          : 'lg:col-start-2 lg:pl-14'
                      }`}
                    >
                      <div className="bg-card border border-border p-6 clip-corner group hover:border-primary/50 transition-colors">
                        <span className="font-heading text-xs sm:text-sm tracking-[0.12em] sm:tracking-[0.25em] text-primary uppercase">
                          {String(i + 1).padStart(2, '0')} · {step.step}
                        </span>
                        <h4 className="mt-1 text-lg sm:text-xl md:text-2xl font-heading uppercase tracking-wide text-white">
                          {step.title}
                        </h4>
                        <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                          {step.detail}
                        </p>
                      </div>
                    </motion.div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}