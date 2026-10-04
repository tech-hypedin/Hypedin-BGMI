'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Crosshair, Award, Zap, Trophy, Flame, HelpCircle, ArrowRight } from 'lucide-react';

import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
};

function AboutPage() {
    return (
        <>
            <Navbar />
            <div className='min-h-screen bg-[#090907] text-foreground font-body select-none'>
        
                <section id='about' className='relative pt-32 pb-20 max-w-7xl mx-auto px-4 lg:px-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-12 items-start'>
                
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className='lg:col-span-8 space-y-8'
                        >
                            <div className='inline-flex items-center gap-3 px-6 py-2 border-l-4 border-primary bg-primary/10'>
                                <span className='w-2 h-2 bg-primary animate-pulse' />
                                <span className='text-xs font-black uppercase tracking-[0.3em] text-primary'>PROGRAM OVERVIEW</span>
                            </div>
                
                            <h1 className='text-5xl md:text-7xl font-black leading-[0.9] text-white uppercase tracking-tight'>
                                MISSION <span className='text-primary italic'>BRIEFING.</span>
                            </h1>
                
                            <div className='space-y-6 text-xl md:text-2xl text-[#8C8C8C] font-medium uppercase tracking-tight leading-tight max-w-3xl'>
                                <p>
                                    Campus Royale is a <span className='text-white'>90-day ambassador program</span> designed to transform gaming from an individual activity into a community-led movement.
                                </p>
                                <p>
                                    Selected ambassadors become the face of BGMI on their campuses, building communities, creating content and growing participation while competing on a national leaderboard.
                                </p>
                            </div>
                        </motion.div>

                        <div className='lg:col-span-4 grid grid-cols-1 gap-4 pt-10 lg:pt-24'>
                            {[
                                { icon: Trophy, title: 'RANK PROGRESSION', desc: 'BRONZE → CONQUEROR' },
                                { icon: Flame, title: 'ELITE REWARDS', desc: 'MERCH & STATUS' },
                                { icon: Shield, title: 'OFFICIAL ROLE', desc: 'BGMI CERTIFIED' }
                            ].map((item) => (
                                <motion.div 
                                    key={item.title}
                                    variants={fadeInUp}
                                    className='flex items-center gap-4 p-4 border border-[#1f1f1f] bg-[#0e0e0e]/50 group hover:border-primary transition-all'
                                >
                                    <div className='w-12 h-12 border border-[#1f1f1f] flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary transition-all'>
                                        <item.icon className='h-6 w-6 text-primary' />
                                    </div>
                                    <div>
                                        <p className='text-sm font-black text-white uppercase tracking-wider'>{item.title}</p>
                                        <p className='text-[10px] text-[#8C8C8C] font-bold uppercase'>{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id='how-it-works' className='py-24 border-t border-[#1f1f1f] bg-[#0e0e0e]/30'>
                    <div className='max-w-7xl mx-auto px-4 lg:px-8'>
                        <div className='flex flex-col items-center text-center mb-20'>
                            <div className='bg-primary px-4 py-1 mb-4'>
                                <span className='text-xs font-black text-black uppercase tracking-widest'>SQUAD CAPABILITIES</span>
                            </div>
                            <h2 className='text-5xl md:text-7xl font-black text-white uppercase italic'>WEEKLY MISSIONS</h2>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#1f1f1f]'>
                            {[
                                { 
                                    title: 'ASSAULT MASTERY', 
                                    icon: Crosshair, 
                                    text: 'Recruit 3 new players to the campus WhatsApp group to expand your active network.' 
                                },
                                { 
                                    title: 'SQUAD UP', 
                                    icon: Users, 
                                    text: 'Play 5 classic matches with verified students from your college for tactical integration.' 
                                },
                                { 
                                    title: 'MEDIC', 
                                    icon: HelpCircle, 
                                    text: 'Help 1 other Ambassador resolve a technical query in the official Discord community.' 
                                }
                            ].map((item, idx) => (
                                <motion.div 
                                    key={idx}
                                    variants={fadeInUp}
                                    className='p-10 border-[#1f1f1f] md:border-r last:border-r-0 hover:bg-primary/5 transition-colors group'
                                >
                                    <item.icon className='w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform' />
                                    <h3 className='text-2xl font-black text-white uppercase mb-4 tracking-tighter'>
                                        {idx + 1}. {item.title}
                                    </h3>
                                    <p className='text-[#8C8C8C] font-medium uppercase text-sm leading-relaxed tracking-wide'>
                                        {item.text}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className='py-24 max-w-7xl mx-auto px-4 lg:px-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-16'>
                        <div className='lg:col-span-4'>
                            <div className='sticky top-32 space-y-6'>
                                <div className='inline-block bg-[#1a1a1a] border border-accent/30 text-accent text-[10px] font-black px-3 py-1 tracking-[0.2em] uppercase'>
                                    LOGISTICS & SUPPLY
                                </div>
                                <h2 className='text-5xl font-black text-white uppercase italic leading-none'>
                                    BOOSTER <br /> <span className='text-accent'>PILLARS</span>
                                </h2>
                                <p className='text-[#8C8C8C] font-bold uppercase text-xs tracking-widest'>
                                    Accelerate your RP accumulation through high-risk operations.
                                </p>
                            </div>
                        </div>

                        <div className='lg:col-span-8 space-y-12'>
                            <div className='space-y-6'>
                                <div className='flex items-center gap-4 border-b border-[#1f1f1f] pb-4'>
                                    <Award className='text-accent w-6 h-6' />
                                    <h4 className='text-2xl font-black text-white uppercase'>ELITE MISSIONS (DIAMOND+)</h4>
                                </div>
                    
                                <div className='grid gap-4'>
                                    <div className='p-6 bg-[#0e0e0e] border-l-4 border-accent flex justify-between items-center group hover:bg-[#1a1a1a] transition-all'>
                                        <div>
                                            <p className='text-white font-black uppercase text-lg italic'>THE CLUTCH</p>
                                            <p className='text-[#8C8C8C] text-xs font-bold uppercase'>Organize a collaborative tournament with a rival college.</p>
                                        </div>
                                        <div className='text-accent font-black text-xl'>1000 RP</div>
                                    </div>
                                    <div className='p-6 bg-[#0e0e0e] border-l-4 border-accent flex justify-between items-center group hover:bg-[#1a1a1a] transition-all'>
                                        <div>
                                            <p className='text-white font-black uppercase text-lg italic'>STREAMER</p>
                                            <p className='text-[#8C8C8C] text-xs font-bold uppercase'>Live stream a campus scrim with community commentary.</p>
                                        </div>
                                        <div className='text-accent font-black text-xl'>500 RP</div>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-6'>
                                <div className='flex items-center gap-4 border-b border-[#1f1f1f] pb-4'>
                                    <Zap className='text-primary w-6 h-6' />
                                    <h4 className='text-2xl font-black text-white uppercase'>BOUNTY MISSIONS</h4>
                                </div>
                    
                                <div className='relative p-8 bg-linear-to-br from-[#0e0e0e] to-[#1a1a1a] border border-primary/20 overflow-hidden'>
                                    <div className='absolute top-0 right-0 p-4 opacity-10'>
                                        <Zap className='w-32 h-32 text-primary' />
                                    </div>
                                    <div className='relative z-10 space-y-4'>
                                        <div className='flex items-center gap-2'>
                                            <span className='w-2 h-2 rounded-full bg-red-600 animate-ping' />
                                            <span className='text-primary font-black text-xs uppercase tracking-widest'>LIVE BROADCAST</span>
                                        </div>
                                        <p className='text-white font-black uppercase text-xl italic max-w-md'>
                                            'BOUNTY ACTIVE: Post a 'Squad Selfie' at the canteen get 200 Bonus RP.'
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer/>
        </>
    );
}

export default AboutPage;