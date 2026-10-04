'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../ui/glass-card';
import { cn } from '@/lib/utils';

export function RankProgress() {
  const currentRP = 12450;
  const nextRankRP = 15000;
  const progressPercent = (currentRP / nextRankRP) * 100;

  return (
    <GlassCard className='p-4 sm:p-6 lg:p-8 h-full flex flex-col border-[#1f1f1f]' index={1}>
      {/* Header Section */}
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8'>
        <h3 className='text-xl sm:text-2xl font-bold text-white tracking-widest uppercase font-heading'>
          SECTOR RANKING
        </h3>
        <div className='flex items-center gap-2 px-3 py-1 border border-green-500/30 bg-green-500/10 shrink-0'>
          <ChevronUp className='w-3 h-3 sm:w-4 sm:h-4 text-green-500' />
          <span className='text-[9px] sm:text-[10px] font-black text-green-500 uppercase tracking-[0.2em]'>
            SAFE ZONE
          </span>
        </div>
      </div>

      {/* Rank Visualization */}
      <div className='relative flex flex-col items-center justify-center mb-6 sm:mb-8 py-2 sm:py-4'>
        <div className='z-10 w-24 h-24 sm:w-32 sm:h-32 border-2 border-primary/30 flex items-center justify-center bg-black relative group'>
          <Shield className='w-12 h-12 sm:w-16 sm:h-16 text-primary drop-shadow-[0_0_15px_rgba(242,169,0,0.5)] transition-transform group-hover:scale-110' />
          
          {/* HUD Accents */}
          <div className='absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-primary' />
          <div className='absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-primary' />
        </div>
        
        <div className='mt-4 sm:mt-6 text-center'>
          <p className='text-2xl sm:text-4xl font-bold text-white uppercase tracking-wider font-heading leading-none'>
            PLATINUM II
          </p>
          <div className='h-0.5 w-16 sm:w-20 bg-primary mx-auto mt-2' />
          <p className='text-[8px] sm:text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.3em] sm:tracking-[0.4em] mt-2'>
            OPERATIONAL STANDING
          </p>
        </div>
      </div>

      {/* RP Meter & Info */}
      <div className='space-y-6 sm:space-y-8 mt-auto'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4'>
          <div className='w-full sm:w-auto'>
            <p className='text-[9px] sm:text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.3em] mb-1 sm:mb-2'>
              REPUTATION LEVEL
            </p>
            <div className='flex items-baseline gap-2'>
               <span className='text-3xl sm:text-4xl font-bold text-white font-heading tracking-widest'>
                 {currentRP.toLocaleString()}
               </span>
               <span className='text-sm sm:text-lg font-bold text-[#8C8C8C] font-heading'>
                 / {nextRankRP.toLocaleString()} RP
               </span>
            </div>
          </div>
          <div className='w-full sm:w-auto text-left sm:text-right border-t border-white/5 pt-3 sm:border-0 sm:pt-0'>
             <p className='text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 sm:mb-2'>
               XP MULTIPLIER
             </p>
             <span className='text-lg sm:text-xl font-bold text-white font-heading tracking-widest'>
               1.2X
             </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='w-full h-3 sm:h-4 bg-black border border-[#1f1f1f] p-0.5 sm:p-1'>
           <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className='h-full bg-primary shadow-[0_0_15px_rgba(242,169,0,0.4)]'
           />
        </div>

        {/* Status Cards */}
        <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4'>
           <div className='p-3 sm:p-4 border border-[#1f1f1f] bg-white/5 hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                 <CheckCircle2 size={12} className='text-green-500 sm:w-3.5 sm:h-3.5' />
                 <span className='text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.2em]'>
                   PROMOTION
                 </span>
              </div>
              <p className='text-sm sm:text-base font-bold text-white font-heading tracking-wider'>
                SECURE AT 15K RP
              </p>
           </div>
           <div className='p-3 sm:p-4 border border-[#1f1f1f] bg-white/5 hover:bg-white/10 transition-colors'>
              <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                 <AlertCircle size={12} className='text-yellow-500 sm:w-3.5 sm:h-3.5' />
                 <span className='text-[8px] sm:text-[9px] font-black text-white uppercase tracking-[0.2em]'>
                   PROTECTION
                 </span>
              </div>
              <p className='text-sm sm:text-base font-bold text-white font-heading tracking-wider'>
                2 MISSIONS LEFT
              </p>
           </div>
        </div>
      </div>
    </GlassCard>
  );
}