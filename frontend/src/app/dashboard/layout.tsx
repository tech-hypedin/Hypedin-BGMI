'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { SocketProvider } from '@/context/socketContext';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Loader2, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const bg_video = '/videos/dashboard-bg-video/dashboard bg-video.mp4';
const bg_video_mobile = '/videos/dashboard-bg-video/dashboard_mobile_Bg_Video.mp4';
const popupImg = '/art/Booster_Task_Image.jpeg';

function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const bgVideoRef = useRef<HTMLVideoElement>(null);

    const [showNotif, setShowNotif] = useState(true);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [verifyIGN, setVerifyIGN] = useState('');
    const [verifyUID, setVerifyUID] = useState('');
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const runOneTimeLoginCheck = async () => {
            const isFreshLogin = sessionStorage.getItem('is_fresh_login_session');
            if (!isFreshLogin) return; 

            try {
                const response = await api.get('/api/ambassador');
                const data = response.data;

                if (data.success) {
                    const profile = data.dossier;
                    const lacksCredentials = !profile.IGN || !profile.UID || profile.IGN === '' || profile.UID === '';
                    
                    if (lacksCredentials) {
                        setVerifyIGN('');
                        setVerifyUID('');
                        setShowVerifyModal(true);
                    }
                }
            } catch (err) {
                console.error('Failed to run background credential synchronization:', err);
            } finally {
                sessionStorage.removeItem('is_fresh_login_session');
            }
        };

        runOneTimeLoginCheck();
    }, []);

    // Freeze the bg video on its last frame once it finishes playing,
    // instead of letting it loop or restart.
    const handleBgVideoEnded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
        const videoEl = e.currentTarget;
        if (!videoEl) return;
        videoEl.pause();
        if (Number.isFinite(videoEl.duration)) {
            videoEl.currentTime = videoEl.duration;
        }
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!verifyIGN.trim() || !verifyUID.trim()) {
            alert('PLEASE PROVIDE BOTH VALID IGN AND UID.');
            return;
        }

        setVerifying(true);
        try {
            const response = await api.patch('/api/ambassador/verifyAmbassador', {
                IGN: verifyIGN.trim(),
                UID: verifyUID.trim()
            });

            const data = response.data;
            setSuccessMessage(data.message || 'VERIFICATION REQUEST PROCESSED.');
            
            if (data.success) {
                setShowVerifyModal(false);
                setVerifyIGN('');
                setVerifyUID('');
                setShowSuccessModal(true);
            } else {
                alert(data.message || 'VERIFICATION FAILED.');
            }
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.message || 'ERROR CONNECTING TO INTEL NETWORK. TRY AGAIN.');
        } finally {
            setVerifying(false);
        }
    };

    const handleSuccessDone = () => {
        setShowSuccessModal(false);
        window.location.reload();
    };

    const emberSeeds = [
        { top: '15%', left: '22%', delay: 0.5, duration: 11 },
        { top: '45%', left: '78%', delay: 1.2, duration: 9 },
        { top: '72%', left: '12%', delay: 2.8, duration: 14 },
        { top: '33%', left: '60%', delay: 0.2, duration: 8 },
        { top: '88%', left: '42%', delay: 3.5, duration: 12 },
        { top: '61%', left: '85%', delay: 1.9, duration: 10 },
    ];

    return (
        <SocketProvider>
            {/* BASE BACKGROUND: Forced Absolute Pitch Black */}
            <div className='flex min-h-screen bg-[#000000] text-white selection:bg-primary/30 selection:text-primary relative overflow-hidden'>

                {/* BACKGROUND VIDEO (DESKTOP): plays once, then freezes on the last frame */}
                <video
                    ref={bgVideoRef}
                    src={bg_video}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleBgVideoEnded}
                    className='hidden md:block absolute inset-0 z-0 w-full h-full object-cover pointer-events-none'
                />

                {/* BACKGROUND VIDEO (MOBILE): plays once, then freezes on the last frame */}
                <video
                    src={bg_video_mobile}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleBgVideoEnded}
                    className='block md:hidden absolute inset-0 z-0 w-full h-full object-cover pointer-events-none'
                />

                {/* RADIAL VIGNETTE OVERLAY */}
                <div className='absolute inset-0 z-0 bg-radial-[at_center] from-transparent via-[#000000]/40 to-[#000000]/95 pointer-events-none' />

                {/* HIGH-PRECISION CRUNCHY WIREFRAME TACTICAL GRID (Muted & Faded) */}
                <div 
                    className='absolute inset-0 z-0 pointer-events-none opacity-[0.10]' 
                    // style={{
                    //     backgroundImage: `
                    //         linear-gradient(to right, #ffffff 0.5px, transparent 0.5px),
                    //         linear-gradient(to bottom, #ffffff 0.5px, transparent 0.5px)
                    //     `,
                    //     backgroundSize: '48px 48px'
                    // }}
                />

                {/* SCANNER GRID LINE ANIMATION */}
                <motion.div initial={{ translateY: '-10%' }} animate={{ translateY: '110vh' }} transition={{ duration: 7, repeat: Infinity, ease: 'linear' }} className='absolute left-0 right-0 h-[180px] bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none z-0 border-b border-primary/[0.08]'/>

                {/* HORIZONTAL AXIS DEPTH GUIDELINE */}
                <motion.div initial={{ translateX: '-100%' }} animate={{ translateX: '100%' }} transition={{ duration: 14, repeat: Infinity, ease: 'linear', delay: 1 }} className='absolute top-1/4 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-700/20 to-transparent pointer-events-none z-0'/>

                {isMounted && (
                    <>
                        {/* PROJECTILE EFFECT ONE */}
                        <motion.div initial={{ x: '-10vw', y: '20vh', opacity: 0 }} animate={{ x: '110vw', y: '45vh', opacity: [0, 0.6, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 1 }} className='absolute w-24 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-white/60 pointer-events-none z-0 blur-[0.5px]'/>

                        {/* PROJECTILE EFFECT TWO */}
                        <motion.div initial={{ x: '30vw', y: '-10vh', opacity: 0 }} animate={{ x: '110vw', y: '60vh', opacity: [0, 0.4, 0.4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', delay: 3 }} className='absolute w-32 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-white/40 pointer-events-none z-0 blur-[0.5px]'/>
                    </>
                )}

                {/* HUD BOUNDING CORNER BRACKETS */}
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none z-0 hidden md:block opacity-25'>
                    <motion.div animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className='w-full h-full relative'>
                        <div className='absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50' />
                        <div className='absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50' />
                        <div className='absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50' />
                        <div className='absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50' />
                    </motion.div>
                </div>

                {/* HUD TELEMETRY DATA PANEL */}
                <div className='hidden xl:block absolute bottom-24 left-8 pointer-events-none z-0 font-mono text-[9px] text-zinc-600 space-y-1 select-none uppercase'>
                    <div className='flex items-center gap-2'>
                        <span className='w-1.5 h-1.5 bg-primary/40 animate-pulse rounded-full'/>
                        <span>SUPPLY_DROP: IN_BOUND</span>
                    </div>
                    <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>
                        WEAPON_LOADOUT // AWM.7.62 // LEVEL_3
                    </motion.div>
                </div>

                {/* FLOATING AMBIENT PARTICLES */}
                <div className='absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40'>
                    {isMounted && emberSeeds.map((seed, i) => (
                        <motion.div
                            key={i}
                            className='absolute w-1 h-1 bg-primary/50 rounded-full shadow-[0_0_6px_rgba(242,169,0,0.8)]'
                            style={{ top: seed.top, left: seed.left }}
                            animate={{
                                y: [0, -160, 0],
                                x: [0, (i % 2 === 0 ? 30 : -30), 0],
                                opacity: [0, 0.8, 0],
                                scale: [1, 1.4, 0.6]
                            }}
                            transition={{ duration: seed.duration, repeat: Infinity, ease: 'easeInOut', delay: seed.delay }}
                        />
                    ))}
                </div>

                {/* CORNER TECH DESIGN MARKS */}
                <div className='hidden lg:block absolute bottom-6 right-6 w-16 h-16 pointer-events-none border-b border-r border-zinc-900 z-0'>
                    <div className='absolute bottom-0 right-0 w-1.5 h-1.5 bg-primary/30' />
                </div>
                <div className='hidden lg:block absolute top-6 right-6 w-16 h-16 pointer-events-none border-t border-r border-zinc-900 z-0'>
                    <span className='absolute top-2 right-2 text-[8px] font-mono font-bold tracking-widest text-zinc-700 select-none'>SYS_SYS.77</span>
                </div>

                {/* SIDEBAR NAVIGATION PANEL */}
                <Sidebar isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen}/>

                {/* MOBILE VIEW NAVIGATION HEADER BAR */}
                <div className='lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#000000]/95 backdrop-blur-md border-b border-zinc-900 flex items-center px-6 z-30'>
                    <button onClick={() => setIsMobileOpen(true)} className='text-primary font-medium uppercase tracking-widest text-[10px] border border-primary/20 px-3 py-1 bg-black/40 hover:bg-primary/5 active:bg-primary/10 transition-colors'>
                        Menu // Open
                    </button>
                    <span className='ml-auto font-black italic text-sm tracking-tight'>BGMI CAMPUS_MVP</span>
                </div>

                {/* LAYOUT CONTAINER INTERIOR PANEL CONTENT */}
                <main className={cn('flex-1 transition-all duration-500 ease-[0.21,0.47,0.32,0.98] w-full relative z-10', 'pt-16 lg:pt-0', isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64')}>
                    <div className='p-4 md:p-8 lg:p-12 max-w-7xl mx-auto'>
                        <AnimatePresence mode='wait'>
                            <motion.div key='dashboard-content' initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>

                {/* SUBMISSION VERIFICATION CONTAINER DIALOG WINDOW */}
                <AnimatePresence>
                    {showVerifyModal && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs'>
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className='w-full max-w-[500px] bg-[#000000] border border-zinc-900 p-8 pt-10 relative font-["Teko","Oswald",sans-serif] text-white shadow-2xl'>
                                <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
                                <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
                                <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
                                <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>
                                <button type='button' onClick={() => setShowVerifyModal(false)} className='absolute top-5 right-5 p-1 text-zinc-500 hover:text-[#ffb60e] transition-colors cursor-pointer'><X size={20} strokeWidth={2.5} /></button>
                                <div className='border-l-[3px] border-[#ffb60e] pl-3 mb-6 mt-2'>
                                    <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-white leading-none'>IDENTITY AUTHENTICATION</h2>
                                    <p className='text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mt-1'>SECURE TERMINAL // COMMS_SYS</p>
                                </div>
                                <form onSubmit={handleVerifySubmit} className='space-y-6'>
                                    <div>
                                        <label className='block text-[11px] font-black tracking-[0.15em] text-[#ffb60e] uppercase mb-1.5'>CODENAME (IGN)</label>
                                        <input type='text' required value={verifyIGN} onChange={(e) => setVerifyIGN(e.target.value)} placeholder='e.g. m0rTaL_oP' className='w-full bg-transparent border border-[#ffb60e]/20 focus:border-[#ffb60e] focus:bg-zinc-950 px-4 py-3 text-[#ffb60e] placeholder-zinc-700 outline-none tracking-widest text-sm font-medium transition-all uppercase' />
                                    </div>
                                    <div>
                                        <label className='block text-[11px] font-black tracking-[0.15em] text-[#ffb60e] uppercase mb-1.5'>GAME CHARACTER UID</label>
                                        <input type='text' required value={verifyUID} onChange={(e) => { const numericValue = e.target.value.replace(/\D/g, ''); setVerifyUID(numericValue); }} placeholder='e.g. 5123456789' className='w-full bg-transparent border border-[#ffb60e]/20 focus:border-[#ffb60e] focus:bg-zinc-950 px-4 py-3 text-[#ffb60e] placeholder-zinc-700 outline-none tracking-widest text-sm font-medium transition-all uppercase' />
                                    </div>
                                    <div className='pt-2 flex gap-3'>
                                        <button type='button' onClick={() => setShowVerifyModal(false)} className='w-1/2 bg-transparent border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-800 font-black tracking-[0.2em] py-3 text-xs transition-all uppercase'>ABORT</button>
                                        <button type='submit' disabled={verifying} className='w-1/2 bg-white hover:bg-zinc-200 text-black font-black tracking-[0.2em] py-3 text-xs transition-all flex items-center justify-center gap-2 uppercase'>
                                            {verifying ? <><Loader2 size={12} className='animate-spin' /> VERIFYING...</> : 'VERIFY ACCOUNT'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* SUBMISSION VERIFICATION TRANSITION ACTION DISMISSAL CONTAINER OVERLAY */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xs'>
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className='w-full max-w-sm bg-[#000000] border border-zinc-900 p-8 text-center relative font-["Teko","Oswald",sans-serif] text-white shadow-3xl'>
                                <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
                                <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
                                <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
                                <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>
                                <div className='flex flex-col items-center justify-center pt-2'>
                                    <div className='p-3 bg-[#ffb60e]/10 border border-[#ffb60e]/20 mb-4 animate-bounce'>
                                        <CheckCircle className='text-[#ffb60e] w-10 h-10' />
                                    </div>
                                    <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-white mb-2'>OPERATION SUCCESSFUL</h2>
                                    <p className='text-xs font-bold text-zinc-600 uppercase tracking-widest max-w-[280px] mx-auto mb-6 leading-relaxed'>{successMessage}</p>
                                    <button onClick={handleSuccessDone} className='w-full max-w-[160px] bg-[#ffb60e] hover:bg-[#ffdb4d] text-black font-black tracking-[0.2em] py-2 text-xs transition-all uppercase'>DONE</button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* <AnimatePresence>
                    {showNotif && (
                        <div className='top-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs'>
                            <motion.div 
                                initial={{ scale: 0.95, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                exit={{ scale: 0.95, opacity: 0 }}
                                className='w-full max-w-125 bg-[#000000] border border-zinc-900 p-6 sm:p-8 pt-10 relative font-["Teko","Oswald",sans-serif] text-white shadow-2xl'
                            >
                                <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
                                <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
                                <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
                                <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>

                                <button type='button' onClick={() => setShowNotif(false)} className='absolute top-4 right-4 sm:top-5 sm:right-5 p-1 text-zinc-500 hover:text-[#ffb60e] transition-colors cursor-pointer'>
                                    <X size={20} strokeWidth={2.5} />
                                </button>

                                <div className='border-l-[3px] border-[#ffb60e] pl-3 mb-6 mt-2'>
                                    <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-white leading-none'>BONUS TASK ALERT!</h2>
                                </div>
                                
                                <Link href="dashboard/missions" referrerPolicy='no-referrer' onClick={ () => setShowNotif(false) }>
                                <div className='space-y-4 sm:space-y-6 flex flex-col items-center justify-center'>
                                    <Image src={popupImg} alt='BGMI Hot Drop Poster' width={1600} height={900} className='w-full h-auto object-contain'/>

                                    <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
                                        <p className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase'>Time:</p>
                                        <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>11 AM – 8 PM</p>
                                    </span>

                                    <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
                                        <p className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase'>Date:</p>
                                        <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>23rd August 2026</p>
                                    </span>

                                    <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
                                        <p className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase'>Location:</p>
                                        <a href='https://share.google/uJ6c8Z4v4wlD5DZ6r' target='_blank' className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase hover:text-[#ffb60e] hover:underline text-center'>📍 C21 Mall, 263, AB Marg, Indore, Madhya Pradesh 452010</a>
                                    </span>

                                    <a href='https://drive.google.com/file/d/1bP-AUlttN3lWdp6iMAgvHcPry4LIvEbx/view?usp=sharing' target='_blank' className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase underline hover:text-[#ffff] text-center pt-2'>Offical Event Guide</a>
                                </div>
                                </Link>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence> */}
            </div>
        </SocketProvider>
    );
}

export default DashboardLayout;