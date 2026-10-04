'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Sidebar } from '@/components/admin/sidebar';
import { SocketProvider } from '@/context/socketContext';
import { cn } from '@/lib/utils';

const bg_video = '/videos/dashboard-bg-video/dashboard bg-video.mp4';
const bg_video_mobile = '/videos/dashboard-bg-video/dashboard_mobile_Bg_Video.mp4';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <SocketProvider>
            <div className='flex min-h-screen bg-[#050604] text-white selection:bg-primary/30 selection:text-primary relative overflow-hidden font-["Teko","Oswald","sans-serif"]'>
                <div className='absolute inset-0 z-0 pointer-events-none select-none overflow-hidden opacity-[0.38] transition-opacity duration-300'>
                    <video
                        src={bg_video}
                        autoPlay
                        muted
                        playsInline
                        className='hidden sm:block w-full h-full object-cover object-center'
                    />
                    <video
                        src={bg_video_mobile}
                        autoPlay
                        muted
                        playsInline
                        className='sm:hidden w-full h-full object-cover object-center'
                    />
                </div>

                <div className='absolute inset-0 z-0 bg-radial-[at_center] from-transparent via-[#070705]/20 to-[#070705]/90 pointer-events-none' />

                <div className='absolute inset-0 z-0 pointer-events-none
                  bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] 
                  bg-[size:40px_40px]' 
                />

                {/* 4. CENTER RETICLE LOCK-ON BRACKETS */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] pointer-events-none z-0 hidden md:block opacity-40'>
                    <div className='w-full h-full relative'>
                        <div className='absolute top-0 left-0 w-6 h-6 border-t border-l border-primary/40' />
                        <div className='absolute top-0 right-0 w-6 h-6 border-t border-r border-primary/40' />
                        <div className='absolute bottom-0 left-0 w-6 h-6 border-b border-l border-primary/40' />
                        <div className='absolute bottom-0 right-0 w-6 h-6 border-b border-r border-primary/40' />
                    </div>
                </div>

                <div className='hidden xl:block absolute bottom-24 left-8 pointer-events-none z-0 text-[11px] text-zinc-600/80 space-y-1 select-none uppercase font-["Teko","Oswald",sans-serif]'>
                    <div className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                        <span className='w-1.5 h-1.5 bg-primary/40 rounded-full'/>
                        <span>ADMIN_OVERRIDE: LIVE_STREAM</span>
                    </div>
                    <div className='font-["Teko","Oswald",sans-serif]'>
                        SECURE_PANEL // SYS_STATUS // OVERRIDE_ACTIVE
                    </div>
                </div>

                <div className='hidden lg:block absolute bottom-6 right-6 w-16 h-16 pointer-events-none border-b-2 border-r-2 border-zinc-800/60 z-0'>
                    <div className='absolute bottom-0 right-0 w-2 h-2 bg-primary/40' />
                    <div className='absolute bottom-2 right-2 w-1 h-1 bg-zinc-600/50' />
                </div>
                
                <div className='hidden lg:block absolute top-6 right-6 w-16 h-16 pointer-events-none border-t-2 border-r-2 border-zinc-800/60 z-0'>
                    <span className='absolute top-2 right-2 text-[11px] font-mono font-bold tracking-widest text-zinc-500/60 select-none font-["Teko","Oswald",sans-serif]'>ADMIN_SYS.99</span>
                </div>

                <div className='hidden lg:block absolute top-1/3 left-4 w-[1px] h-32 bg-linear-to-b from-transparent via-primary/30 to-transparent pointer-events-none z-0'>
                    <div className='w-1 h-1 bg-primary/50 -ml-[1.5px] mt-8' />
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
        </SocketProvider>
    );
}