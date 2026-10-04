'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { GlassCard } from '../ui/glass-card';

const data = [
  { day: 'Mon', missions: 4 },
  { day: 'Tue', missions: 3 },
  { day: 'Wed', missions: 6 },
  { day: 'Thu', missions: 5 },
  { day: 'Fri', missions: 8 },
  { day: 'Sat', missions: 7 },
  { day: 'Sun', missions: 4 },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className='bg-[#0e0e0e] border border-primary/50 p-3 shadow-2xl'>
        <p className='text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1 font-heading'>{payload[0].payload.day}</p>
        <p className='text-sm font-bold text-white uppercase'>{payload[0].value} MISSIONS SECURED</p>
      </div>
    );
  }
  return null;
};

export function StreakAnalytics() {
  return (
    <GlassCard className='p-8 h-full flex flex-col border-[#1f1f1f]' index={2}>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h3 className='text-2xl font-bold text-white tracking-widest uppercase font-heading'>OPERATIONAL CONSISTENCY</h3>
          <p className='text-[10px] font-black text-[#8C8C8C] mt-1 uppercase tracking-[0.3em]'>RELIABILITY INDEX: 7 DAY WINDOW</p>
        </div>
        <div className='text-right'>
           <span className='text-4xl font-bold text-primary italic font-heading tracking-widest'>94%</span>
           <p className='text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.3em] mt-1'>DISCIPLINE</p>
        </div>
      </div>

      <div className='flex-1 min-h-60 w-full mt-2'>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='rgba(31,31,31,1)' />
            <XAxis 
               dataKey='day' 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#8C8C8C', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-heading)' }}
               dy={10}
            />
            <YAxis 
               axisLine={false} 
               tickLine={false} 
               tick={{ fill: '#8C8C8C', fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-heading)' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(242,169,0,0.05)' }} />
            <Bar dataKey='missions'>
              {data.map((entry, index) => (
                <Cell 
                   key={`cell-${index}`} 
                   fill={index === 4 ? '#F2A900' : 'rgba(31,31,31,1)'} 
                   stroke={index === 4 ? 'transparent' : '#F2A900'}
                   strokeWidth={index === 4 ? 0 : 1}
                   className='hover:fill-primary transition-colors duration-300'
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className='mt-8 pt-6 border-t border-[#1f1f1f]'>
         <div className='flex items-center justify-between mb-4'>
            <h4 className='text-lg font-bold text-white uppercase tracking-[0.2em] font-heading'>STREAK LOGS</h4>
            <span className='text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.4em]'>DEPLOYMENT CYCLE: 30D</span>
         </div>
         <div className='grid grid-cols-10 gap-2'>
            {/* Mocking a heatmap grid */}
            {Array.from({ length: 30 }).map((_, i) => (
               <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.01 }}
                  className={cn(
                     'aspect-square border border-[#1f1f1f]',
                     i % 7 === 0 ? 'bg-primary' : 
                     i % 3 === 0 ? 'bg-primary/40' : 
                     i % 5 === 0 ? 'bg-primary/10' : 'bg-black'
                  )}
               />
            ))}
         </div>
         <div className='flex justify-between mt-4 text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.4em]'>
            <span>STAGNANT</span>
            <span>OPERATIONAL</span>
            <span>ELITE CONQUEROR</span>
         </div>
      </div>
    </GlassCard>
  );
}

function cn(...classes: any[]) {
   return classes.filter(Boolean).join(' ');
}
