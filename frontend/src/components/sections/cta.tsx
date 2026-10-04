'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

/** Closing CTA band — the single conversion moment at the end of the page flow. */
export function Cta() {
  const router = useRouter();

  return (
    <section className="relative py-24 md:py-28 overflow-hidden">
      <div className="absolute inset-0 scanlines" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative border border-primary/30 bg-primary/[0.04] px-8 py-12 md:py-16 text-center clip-corner"
        >
          {/* corner accents */}
          {[
            'top-0 left-0 border-t-2 border-l-2',
            'top-0 right-0 border-t-2 border-r-2',
            'bottom-0 left-0 border-b-2 border-l-2',
          ].map((pos) => (
            <div key={pos} className={`absolute w-8 h-8 border-primary/50 ${pos}`} aria-hidden="true" />
          ))}

          <p className="font-heading text-sm tracking-[0.3em] text-primary uppercase mb-3">Rank Push Ho Jaye?</p>
          <h2 className="text-4xl md:text-6xl text-white mb-4">Your Campus Is Waiting.</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Step into recognized campus leadership — official recognition, organizational
            influence, industry exposure, and a route to national-level status.
          </p>
          <span className="relative inline-block">
            {/* breathing glow behind the conversion button */}
            <motion.span
              aria-hidden="true"
              animate={{ opacity: [0.25, 0.6, 0.25], scale: [0.92, 1.06, 0.92] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-primary/40 blur-2xl"
            />
            <Button size="lg" onClick={() => router.push('/application')} aria-label="Apply now for the BGMI Campus Champion Program" className="relative font-extrabold">
              APPLY NOW
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
