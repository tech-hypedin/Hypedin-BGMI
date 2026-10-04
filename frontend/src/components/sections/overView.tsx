'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionHeading } from '../motion/primitives';

export function Overview() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeading
          kicker="Program Objective"
          title="Campus Leadership, Made Official."
          sub="The Campus MVP program cultivates localized gaming-community leadership by integrating an official ambassador into your university or college."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="relative border border-border bg-card p-3 clip-corner">
            <Image
              src="/art/squad-lineup.webp"
              alt="Official BGMI character lineup"
              width={980}
              height={398}
              sizes="(min-width: 1024px) 56rem, 90vw"
              className="w-full h-auto"
            />
            <div className="flex items-center justify-between px-2 pt-3 pb-1">
              <p className="font-heading text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-muted-foreground">
                OFFICIAL CAMPUS LIAISON · SCRIMS · TOURNAMENTS · COMMUNITY
              </p>
              <span className="font-heading text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-primary shrink-0">BGMI PARTNER</span>
            </div>
          </div>

          <div className="absolute -bottom-3 -right-3 w-full h-full border border-primary/25 -z-10" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}