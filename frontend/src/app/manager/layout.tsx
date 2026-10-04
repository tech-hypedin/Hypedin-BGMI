'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { motion, AnimatePresence } from 'framer-motion';

import MapBackground from '../../../public/Dashboard_Background.jpg';  
import { Sidebar } from '@/components/manager/sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const emberSeeds = [
        { top: '15%', left: '22%', delay: 0.5, duration: 11 },
        { top: '45%', left: '78%', delay: 1.2, duration: 9 },
        { top: '72%', left: '12%', delay: 2.8, duration: 14 },
        { top: '33%', left: '60%', delay: 0.2, duration: 8 },
        { top: '88%', left: '42%', delay: 3.5, duration: 12 },
        { top: '61%', left: '85%', delay: 1.9, duration: 10 },
    ];

    return (
        <div className='flex min-h-screen bg-[#050604] text-white selection:bg-primary/30 selection:text-primary relative overflow-hidden font-["Teko","Oswald","sans-serif"]'>
            <div className='absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.38] transition-opacity duration-300'>
                <Image src={MapBackground} alt='BGMI Tactical Map Backdrop' fill priority placeholder='blur' className='object-cover object-center scale-100'/>
            </div>

            <div className='absolute inset-0 z-0 bg-radial-[at_center] from-transparent via-[#070705]/20 to-[#070705]/90 pointer-events-none' />

            <div className='absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]'/>

            <motion.div 
                initial={{ translateY: '-10%' }}
                animate={{ translateY: '110vh' }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                className='absolute left-0 right-0 h-[220px] bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent pointer-events-none z-0 border-b border-primary/[0.12]'
            />

            <motion.div
                initial={{ translateX: '-100%' }}
                animate={{ translateX: '100%' }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: 2
                }}
                className='absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500/20 to-transparent pointer-events-none z-0'
            />

            {isMounted && (
                <>
                    {/* Tracer Bullet 1 */}
                    <motion.div
                        initial={{ x: '-10vw', y: '20vh', opacity: 0 }}
                        animate={{ x: '110vw', y: '45vh', opacity: [0, 0.8, 0.8, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1 }}
                        className='absolute w-24 h-[1.5px] bg-gradient-to-r from-transparent via-primary to-white pointer-events-none z-0 blur-[0.5px]'
                    />
                    {/* Tracer Bullet 2 */}
                    <motion.div
                        initial={{ x: '30vw', y: '-10vh', opacity: 0 }}
                        animate={{ x: '110vw', y: '60vh', opacity: [0, 0.6, 0.6, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay: 4 }}
                        className='absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-white/80 pointer-events-none z-0 blur-[0.5px]'
                    />
                </>
            )}

            {/* 4. CENTER RETICLE LOCK-ON BRACKETS PULSE */}
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none z-0 hidden md:block opacity-40'>
                <motion.div 
                    animate={{ scale: [0.97, 1.03, 0.97], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className='w-full h-full relative'
                >
                    <div className='absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/40' />
                    <div className='absolute top-0 right-0 w-6 h-6 border-t border-r border-primary/40' />
                    <div className='absolute bottom-0 left-0 w-6 h-6 border-b border-l border-primary/40' />
                    <div className='absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/40' />
                </motion.div>
            </div>

            <div className='hidden xl:block absolute bottom-24 left-8 pointer-events-none z-0 text-[11px] text-zinc-600/80 space-y-1 select-none uppercase font-["Teko","Oswald",sans-serif]'>
                <div className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                    <span className='w-1.5 h-1.5 bg-primary/40 animate-pulse rounded-full'/>
                    <span>ADMIN_OVERRIDE: LIVE_STREAM</span>
                </div>
                <motion.div
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='font-["Teko","Oswald",sans-serif]'
                >
                    SECURE_PANEL // SYS_STATUS // OVERRIDE_ACTIVE
                </motion.div>
            </div>

            <div className='absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-50'>
                {isMounted && emberSeeds.map((seed, i) => (
                    <motion.div
                        key={i}
                        className='absolute w-1 h-1 bg-primary/60 rounded-full shadow-[0_0_8px_rgba(242,169,0,1)]'
                        style={{
                            top: seed.top,
                            left: seed.left,
                        }}
                        animate={{
                            y: [0, -160, 0],
                            x: [0, (i % 2 === 0 ? 35 : -35), 0],
                            opacity: [0, 0.9, 0],
                            scale: [1, 1.5, 0.5]
                        }}
                        transition={{
                            duration: seed.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: seed.delay,
                        }}
                    />
                ))}
            </div>

            <div className='hidden lg:block absolute bottom-6 right-6 w-16 h-16 pointer-events-none border-b-2 border-r-2 border-zinc-800/60 z-0'>
                <div className='absolute bottom-0 right-0 w-2 h-2 bg-primary/40' />
                <div className='absolute bottom-2 right-2 w-1 h-1 bg-zinc-600/50' />
            </div>
                
            <div className='hidden lg:block absolute top-6 right-6 w-16 h-16 pointer-events-none border-t-2 border-r-2 border-zinc-800/60 z-0'>
                <span className='absolute top-2 right-2 text-[11px] font-mono font-bold tracking-widest text-zinc-500/60 select-none font-["Teko","Oswald",sans-serif]'>ADMIN_SYS.99</span>
            </div>

            <div className='hidden lg:block absolute top-1/3 left-4 w-[1px] h-32 bg-linear-to-b from-transparent via-primary/30 to-transparent pointer-events-none z-0'>
                <div className='w-1 h-1 bg-primary/50 -ml-[1.5px] mt-8 animate-ping' />
            </div>

            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>

            <div className='lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#090907]/95 backdrop-blur-md border-b border-zinc-900 flex items-center px-6 z-30 font-["Teko","Oswald",sans-serif]'>
                <button onClick={() => setIsMobileOpen(true)} className='text-primary font-black uppercase tracking-widest text-sm border border-primary/20 px-3 py-1 bg-black/20 hover:bg-primary/5 active:bg-primary/10 transition-colors font-["Teko","Oswald",sans-serif]'>
                    Menu // Open
                </button>
                <span className='ml-auto font-black italic text-base tracking-tight font-["Teko","Oswald",sans-serif]'>BGMI ADMIN</span>
            </div>

            <main className={cn( 'flex-1 transition-all duration-500 ease-[0.21,0.47,0.32,0.98] w-full relative z-10 font-["Teko","Oswald",sans-serif]', 'pt-16 lg:pt-0', isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64' )}>
                <div className='p-4 md:p-8 lg:p-12 max-w-7xl mx-auto'>
                    <AnimatePresence mode='wait'>
                        <motion.div key='dashboard-content' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}