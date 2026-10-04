'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { cn } from '../../lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  index?: number;
  gradient?: boolean;
  tilt?: boolean;
}

export function GlassCard({ children, className, index = 0, gradient = false }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.05,
        ease: 'easeOut' 
      }}
      className={cn(
        'relative group overflow-hidden transition-all duration-300',
        'bg-[#0e0e0e] border border-[#1f1f1f] shadow-none',
        'hover:border-[#F2A900]/50 hover:bg-[#121212]',
        className
      )}
    >
      {/* Tactical Corner Detail */}
      <div className='absolute top-0 right-0 w-2 h-2 border-t border-r border-[#F2A900]/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity' />
      <div className='absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#F2A900]/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity' />
      
      {/* Background Accent if enabled */}
      {gradient && (
        <div className='absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none' />
      )}

      <div className='relative z-20 h-full w-full'>
        {children}
      </div>

      {/* Industrial Accent Line */}
      <div className='absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500' />
    </motion.div>
  );
}
