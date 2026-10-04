'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Info, Shield, Star, Check } from 'lucide-react';

import api from '@/lib/api';
import PasswordSetupModal from '@/components/dashboard/passwordSetupModal';
import { getRankIcon } from '../../lib/rankIcon.js';

// Static assets
import badgeSectionIcon from '../../../public/icons/Badge_Icon.png';

export interface Mission {
    id: string;
    name: string;
    rpReward: number;
    completed: number;
    total: number;
}

export interface SeasonInfo {
    number: number;
    startDate: string;
    endDate: string;
    nextRank: string;
    nextRankThreshold: number;
    seasonHighestRank?: string;
    missions: Mission[];
}

export interface DashboardData {
    UID: string,
    IGN: string,
    ambassadorId: string,
    rank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Conqueror',
    RP: number,
    XP: number,
    collegeName: string,
    rpLeaderBoardRank?: number,
    xpLeaderBoardRank?: number,
    stats: { missionsCompleted: number, totalRewards: number, totalMissions: number },
    social: { platform: 'Youtube' | 'Rooter' | 'Instagram' | 'Discord', platformUrl: string },
    avator?: string,
    maxRank: string,
    maxRP: number,
    maxXP: number,
    season1RP: number,
    season2RP: number,
    season3RP: number,
    season1XP: number,
    season2XP: number,
    season3XP: number
}

interface APIMission {
    _id: string;
    title: string;
    description?: string;
    rpReward: number;
    completed?: number;
    total?: number;
    phase?: number;
}

const MAX_XP_THRESHOLD = 10000;

interface SeasonConfig {
    number: number;
    startDate: string;
    endDate: string;
    maxRpThreshold: number;
}

const SEASONS_CONFIG: SeasonConfig[] = [
    {
        number: 1,
        startDate: '2026-08-03T00:00:00',
        endDate: '2026-09-03T23:59:59.999+05:30',
        maxRpThreshold: 2500,
    },
    {
        number: 2,
        startDate: '2026-09-05T00:00:00+05:30',
        endDate: '2026-10-15T23:59:00+05:30',
        maxRpThreshold: 6000,
    },
    {
        number: 3,
        startDate: '2026-10-17T00:00:00',
        endDate: '2026-11-06T23:59:00',
        maxRpThreshold: 10000,
    },
];

function getSeasonStatuses(now: number) {
    return SEASONS_CONFIG.map((s) => {
        const start = new Date(s.startDate).getTime();
        const end = new Date(s.endDate).getTime();
        
        let status: 'completed' | 'active' | 'upcoming' | 'locked' = 'locked';
        let isUnlocked = false;

        if (now >= start) {
            isUnlocked = true;
            if (now > end) {
                status = 'completed';
            } else {
                status = 'active';
            }
        } else {
            status = 'locked';
            isUnlocked = false;
        }

        return { ...s, status, isUnlocked };
    });
}

function getDefaultSelectedSeason(statuses: ReturnType<typeof getSeasonStatuses>): number {
    // Prefer the currently active season.
    const activeSeason = statuses.find((s) => s.status === 'active');
    if (activeSeason) return activeSeason.number;

    // No season is currently active — default to the latest ended season.
    const completedSeasons = statuses.filter((s) => s.status === 'completed');
    if (completedSeasons.length > 0) {
        return completedSeasons[completedSeasons.length - 1].number;
    }

    return statuses[0]?.number ?? 1;
}

function SeasonBackdrop() {
    return (
        <div className='absolute inset-0 -z-10 overflow-hidden bg-transparent '>
            <div 
                className='absolute inset-0 opacity-[0.05] pointer-events-none'
                style={{
                    backgroundImage: `radial-gradient(ellipse at 50% 30%, #f4c430 0%, transparent 70%)`
                }}
            />
        </div>
    );
}

export default function AmbassadorDashboard() {
    const router = useRouter();
    const [ambassador, setAmbassador] = useState<DashboardData | null>(null);
    const [dbMissions, setDbMissions] = useState<APIMission[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [rankIcon, setRankIcon] = useState<any>(null);

    const [nowTime, setNowTime] = useState<number>(() => new Date().getTime());

    useEffect(() => {
        const timer = setInterval(() => {
            setNowTime(new Date().getTime());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const seasonStatuses = getSeasonStatuses(nowTime);

    const [selectedSeason, setSelectedSeason] = useState<number>(() => {
        return getDefaultSelectedSeason(seasonStatuses);
    });

    const activeSeasonData = SEASONS_CONFIG.find((s) => s.number === selectedSeason) || SEASONS_CONFIG[0];
    const maxRpThreshold = activeSeasonData.maxRpThreshold;

    const startDate = new Date(activeSeasonData.startDate).getTime();
    const endDate = new Date(activeSeasonData.endDate).getTime();

    // A season is only shown as "completed" once the next season has actually
    // started (or there is no next season at all). This avoids labeling an
    // ended season as completed while sitting in the gap before the next
    // season begins.
    const nextSeasonConfig = SEASONS_CONFIG.find((s) => s.number === activeSeasonData.number + 1);
    const nextSeasonStarted = nextSeasonConfig
        ? nowTime >= new Date(nextSeasonConfig.startDate).getTime()
        : true;

    const isCompleted = nowTime > endDate && nextSeasonStarted;
    const isSeasonStarted = nowTime >= startDate;

    // Season has ended but the next season hasn't started yet — the countdown
    // should point to the next season's start instead of showing a zeroed-out
    // "time remaining" for the season that already ended.
    const isInGapBeforeNextSeason = nowTime > endDate && !nextSeasonStarted && Boolean(nextSeasonConfig);

    const targetDate = isInGapBeforeNextSeason
        ? new Date(nextSeasonConfig!.startDate).getTime()
        : (isSeasonStarted ? endDate : startDate);
    const difference = targetDate - nowTime;

    const timeLeft = {
        days: difference > 0 ? Math.floor(difference / (1000 * 60 * 60 * 24)) : 0,
        hours: difference > 0 ? Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : 0,
        minutes: difference > 0 ? Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)) : 0,
        seconds: difference > 0 ? Math.floor((difference % (1000 * 60)) / 1000) : 0,
    };

    const formattedCountdown = `${String(timeLeft.days).padStart(2, '0')}D : ${String(timeLeft.hours).padStart(2, '0')}H : ${String(timeLeft.minutes).padStart(2, '0')}M : ${String(timeLeft.seconds).padStart(2, '0')}S`;

    const getPhaseTasks = async (phase: number) => {
        try {
            const { data } = await api.get(`/api/ambassador/dash/missions?phase=${phase}`);

            if (data?.success) {
                setDbMissions(data.tasks);
            }
        } catch (err: unknown) {
            console.error('Error fetching missions for phase:', phase, err);
        }
    };

    useEffect(() => {
        const fetchDashboardAndMissions = async () => {
            try {
                const [dashRes] = await Promise.all([
                    api.get('/api/ambassador'),
                ]);

                if (dashRes.data?.success) {
                    setAmbassador(dashRes.data.dossier);
                    if (dashRes.data.mustChangePassword) {
                        setShowSetup(true);
                    }
                }
            } catch (err: any) {
                console.error('Error fetching dashboard info:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardAndMissions();
    }, []);

    useEffect(() => {
        if (!ambassador) return;
        getPhaseTasks(selectedSeason);
    }, [ambassador, selectedSeason]);

    useEffect(() => {
        if (ambassador?.rank) {
            const iconPromise = getRankIcon(ambassador.rank);
            if (iconPromise instanceof Promise) {
                iconPromise.then((module) => setRankIcon(module?.default || module));
            } else {
                setRankIcon(iconPromise);
            }
        }
    }, [ambassador?.rank]);

    const handleSeasonClick = (s: typeof seasonStatuses[number]) => {
        if (!s.isUnlocked) return;
        setSelectedSeason(s.number);
        getPhaseTasks(s.number);
    };

    if (loading) return (
        <div className='relative flex min-h-[60vh] w-full items-center justify-center font-["Teko",sans-serif] text-white px-4'>
            <SeasonBackdrop />
            <div className='flex flex-col items-center text-center'>
                <Loader2 className='animate-spin mb-4 text-[#f4c430]' size={40} />
                <p className='text-xs sm:text-sm tracking-[0.25em] text-zinc-500 uppercase'>SYNCING SYSTEM INTEL...</p>
            </div>
        </div>
    );

    if (!ambassador) return (
        <div className='relative flex min-h-[60vh] w-full items-center justify-center font-["Teko",sans-serif] text-white px-4 text-center'>
            <SeasonBackdrop />
            <p className='text-red-500 text-xl sm:text-2xl font-bold uppercase tracking-[0.2em]'>
                OPERATIVE DATA CORRUPTED. RE-AUTHENTICATE.
            </p>
        </div>
    );

    const isVerified = Boolean(ambassador.IGN && ambassador.UID);
    const finalImgSrc = typeof rankIcon === 'string' ? rankIcon : rankIcon?.src || '';

    let currentRP = ambassador.RP || 0;

    const selectedSeasonStatus = seasonStatuses.find((s) => s.number === selectedSeason)?.status;

    if (selectedSeasonStatus === 'completed') {
        if (selectedSeason === 1) currentRP = ambassador.season1RP || 0;
        if (selectedSeason === 2) currentRP = ambassador.season2RP || 0;
        if (selectedSeason === 3) currentRP = ambassador.season3RP || 0;
    }

    let currentXP = ambassador.XP || 0;

    if (selectedSeasonStatus === 'completed') {
        if (selectedSeason === 1) currentXP = ambassador.season1XP || 0;
        if (selectedSeason === 2) currentXP = ambassador.season2XP || 0;
        if (selectedSeason === 3) currentXP = ambassador.season3XP || 0;
    }

    const isXPUnlocked = currentRP >= maxRpThreshold;
    
    const rpProgress = Math.min(100, (currentRP / maxRpThreshold) * 100);
    const xpProgress = Math.min(100, (currentXP / MAX_XP_THRESHOLD) * 100);
    const rpLeftToUnlockXP = Math.max(0, maxRpThreshold - currentRP);

    return (
        <div className='relative min-h-screen w-full overflow-x-hidden font-["Teko",sans-serif] text-white backdrop-blur-xs'>
            <link href='https://fonts.googleapis.com/css2?family=Teko:wght@400;500;600;700&display=swap' rel='stylesheet' />

            <PasswordSetupModal isOpen={showSetup} onComplete={() => setShowSetup(false)}/>
            <SeasonBackdrop/>

            <div className='relative z-10 mx-auto max-w-6xl space-y-5 px-3 sm:px-6 lg:px-8 py-4 sm:py-6'>
                
                {/* Header Info Bar */}
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/80 pb-3'>
                    <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[15px] uppercase tracking-wider text-zinc-400'>
                        <span className='font-semibold text-zinc-300'>{ambassador.collegeName}</span>
                        {isVerified && (
                            <>
                                <span className='opacity-40'>//</span>
                                <span>IGN {ambassador.IGN}</span>
                                <span className='opacity-40'>//</span>
                                <span>UID {ambassador.UID}</span>
                            </>
                        )}
                    </div>

                    <div className='flex items-center gap-2 self-start sm:self-auto'>
                        <button 
                            onClick={() => router.push('/dashboard/profile')}
                            className='flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-[#f4c430] px-2.5 py-1 rounded-sm transition-colors group'
                        >
                            <img src={badgeSectionIcon.src} alt='Badges' className='h-3.5 w-3.5 object-contain' />
                            <span className='text-sm sm:text-md font-bold uppercase tracking-widest text-white group-hover:text-[#f4c430]'>Badges</span>
                        </button>
                        { selectedSeason === 2 &&
                        <a
                            href='/SOP_BGMI_CAMPUS_MVP_Program.pdf'
                            download
                            className='flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-[#f4c430] px-2.5 py-1 rounded-sm transition-colors group'
                        >
                            <span className='text-sm sm:text-md font-bold uppercase tracking-widest text-white group-hover:text-[#f4c430]'>Download SOP</span>
                        </a>
                        }
                    </div>
                </div>

                {/* Season Title & Countdown Header */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className='flex flex-col items-center pt-2 text-center'>
                    <p className='text-xs sm:text-md font-medium uppercase tracking-[0.25em] sm:tracking-[0.3em] text-zinc-400'>
                        BGMI CAMPUS MVP
                    </p>
                    <h1 className='text-5xl sm:text-8xl font-bold uppercase leading-none tracking-tight my-1'>
                        <span className='text-[#f4c430]'>SEASON</span>{' '}
                        <span className='text-white'>{String(selectedSeason).padStart(2, '0')}</span>
                    </h1>
                    
                    {isCompleted ? (
                        <div className='mt-1 flex items-center justify-center gap-2 text-xl sm:text-2xl font-black tracking-[0.2em] sm:tracking-[0.25em] uppercase bg-linear-to-r from-[#ffe066] via-[#f4c430] to-[#b8860b] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(244,196,48,0.3)]'>
                            <span>THAT'S A WRAP</span>
                        </div>
                    ) : isInGapBeforeNextSeason ? (
                        <p className='text-[#f4c430] text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase mt-1'>
                            {`SEASON ${String(nextSeasonConfig!.number).padStart(2, '0')} STARTS IN: ${formattedCountdown}`}
                        </p>
                    ) : (
                        <p className='text-[#f4c430] text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.18em] uppercase mt-1'>
                            {isSeasonStarted ? `TIME REMAINING: ${formattedCountdown}` : `SEASON STARTS IN: ${formattedCountdown}`}
                        </p>
                    )}

                    {/* Rank Badge Circle */}
                    <div className='relative my-4 sm:my-5 h-24 w-24 sm:h-32 sm:w-32'>
                        <div className='flex h-full w-full items-center justify-center rounded-full border-2 border-[#f4c430]/80 bg-black/80 shadow-[0_0_30px_rgba(244,196,48,0.2)] p-3 sm:p-4'>
                            {finalImgSrc ? (
                                <img src={finalImgSrc} alt={`${ambassador.rank} badge`} className='h-full w-full object-contain'/>
                            ) : (
                                <span className='text-[10px] sm:text-xs text-zinc-500 uppercase'>No Rank</span>
                            )}
                        </div>
                        <div className='absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap border border-[#f4c430]/60 bg-black px-2 py-0.2 text-[10px] sm:text-xs font-bold tracking-widest text-[#f4c430]'>
                            S{selectedSeason}
                        </div>
                    </div>

                    <h2 className='text-3xl sm:text-5xl font-bold uppercase tracking-wider text-white'>
                        {ambassador.rank}
                    </h2>
                </motion.div>

                {/* Main Progress Block Header */}
                <div className='flex items-center justify-between font-bold text-base sm:text-lg uppercase tracking-wider px-1'>
                    <span className='text-zinc-400'>Total RP Earned</span>
                    <span className='text-[#f4c430]'>{currentRP} / {maxRpThreshold} RP</span>
                </div>

                {/* Split RP & XP Track Cards */}
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                    
                    {/* LEFT: RP TRACK */}
                    <div className={`relative border p-4 sm:p-5 bg-zinc-950/80 transition-all ${
                        isXPUnlocked ? 'border-[#f4c430]/40' : 'border-[#f4c430] shadow-[0_0_20px_rgba(244,196,48,0.15)]'
                    }`}>
                        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                            <div className='flex items-center gap-3 w-full sm:w-auto'>
                                <div className='flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center border border-[#f4c430] bg-[#f4c430]/10 text-[#f4c430] font-bold text-base sm:text-lg'>
                                    RP
                                </div>
                                <div className='w-full sm:w-64'>
                                    <h4 className='text-sm sm:text-md font-bold uppercase tracking-wider text-zinc-300'>Total RP Earned</h4>
                                    <div className='h-2.5 w-full bg-zinc-900 border border-zinc-800 relative mt-1 overflow-hidden'>
                                        <div 
                                            className='h-full bg-linear-to-r from-[#d9a716] to-[#f4c430] transition-all duration-500'
                                            style={{ width: `${rpProgress}%` }}
                                        />
                                    </div>
                                    <div className='flex justify-between text-[10px] sm:text-[11px] text-zinc-500 mt-1 font-sans font-bold'>
                                        <span>0</span>
                                        <span>{maxRpThreshold / 2}</span>
                                        <span>{maxRpThreshold}</span>
                                    </div>
                                </div>
                            </div>
                            <div className='text-right text-base sm:text-lg font-bold text-[#f4c430] sm:text-white self-end sm:self-auto'>
                                {currentRP} / {maxRpThreshold} RP
                            </div>
                        </div>

                        <div className='flex items-center gap-2.5 pt-3 border-t border-zinc-900/80'>
                            <Shield className='h-4 w-4 sm:h-5 sm:w-5 text-[#f4c430] shrink-0' />
                            <div>
                                <p className='text-xs sm:text-sm font-bold uppercase text-white tracking-wider'>MANDATORY RP TRACK</p>
                                <p className='text-[11px] sm:text-xs text-zinc-400'>Complete matches and missions to earn RP and rank up.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: XP TRACK */}
                    <div className={`relative border p-4 sm:p-5 bg-zinc-950/80 flex flex-col justify-between transition-all ${
                        isXPUnlocked ? 'border-[#f4c430] shadow-[0_0_20px_rgba(244,196,48,0.15)]' : 'border-zinc-800/80 opacity-60'
                    }`}>
                        <div>
                            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4'>
                                <div className='flex items-center gap-3 w-full sm:w-auto'>
                                    <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center border font-bold text-base sm:text-lg rounded-full ${
                                        isXPUnlocked ? 'border-[#f4c430] text-[#f4c430] bg-[#f4c430]/10' : 'border-zinc-700 text-zinc-500 bg-zinc-900'
                                    }`}>
                                        XP
                                    </div>
                                    <div className='w-full sm:w-64'>
                                        <h4 className='text-sm sm:text-md font-bold uppercase tracking-wider text-zinc-300'>Total XP Earned</h4>
                                        <div className='h-2.5 w-full bg-zinc-900 border border-zinc-800 relative mt-1 overflow-hidden'>
                                            <div 
                                                className='h-full bg-linear-to-r from-[#d9a716] to-[#f4c430] transition-all duration-500'
                                                style={{ width: `${xpProgress}%` }}
                                            />
                                        </div>
                                        <div className='flex justify-between text-[10px] sm:text-[11px] text-zinc-500 mt-1 font-sans font-bold'>
                                            <span>0</span>
                                            <span>{MAX_XP_THRESHOLD / 2}</span>
                                            <span>{MAX_XP_THRESHOLD.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='text-right text-base sm:text-lg font-bold text-[#f4c430] sm:text-white self-end sm:self-auto'>
                                    {currentXP} XP
                                </div>
                            </div>

                            <div className='flex items-center justify-between pt-3 border-t border-zinc-900/80 gap-2'>
                                <div className='flex items-center gap-2.5'>
                                    <Star className={`h-4 w-4 sm:h-5 sm:w-5 shrink-0 ${isXPUnlocked ? 'text-[#f4c430]' : 'text-zinc-600'}`} />
                                    <div>
                                        <p className='text-xs sm:text-sm font-bold uppercase text-white tracking-wider'>BONUS XP TRACK</p>
                                        <p className='text-[11px] sm:text-xs text-zinc-400'>
                                            {isXPUnlocked ? 'Max RP reached. Bonus XP is now enabled.' : 'Unlocks after max RP is reached.'}
                                        </p>
                                        <p className='text-[11px] sm:text-xs text-zinc-400'>
                                            Current Rank: 200/200
                                        </p>
                                    </div>
                                </div>

                                <div className={`flex items-center gap-1 border px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest shrink-0 ${
                                    isXPUnlocked 
                                        ? 'border-green-500/50 text-green-400 bg-green-500/10' 
                                        : 'border-zinc-700 text-zinc-400 bg-zinc-900'
                                }`}>
                                    {isXPUnlocked ? (
                                        <>
                                            <Check size={11} />
                                            <span>UNLOCKED</span>
                                        </>
                                    ) : (
                                        <>
                                            <Lock size={11} />
                                            <span>LOCKED</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {!isXPUnlocked && (
                            <div className='mt-3 sm:mt-4 flex items-center justify-center gap-1.5 border border-zinc-800 bg-zinc-900/60 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-400'>
                                <Lock size={11} />
                                <span>{rpLeftToUnlockXP} RP LEFT TO UNLOCK XP</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Active Status Info Banner */}
                <div className='flex items-start sm:items-center gap-3 border border-zinc-800 bg-zinc-950/60 p-3 text-xs sm:text-sm'>
                    <div className='flex h-6 w-6 sm:h-7 sm:w-7 shrink-0 items-center justify-center rounded-full border border-[#f4c430]/60 text-[#f4c430] mt-0.5 sm:mt-0'>
                        <Info size={15} />
                    </div>
                    <div>
                        {isXPUnlocked ? (
                            <p className='font-bold uppercase tracking-wider text-[#f4c430]'>
                                RP TRACK COMPLETE. XP TRACK IS NOW ACTIVE
                                <span className='block text-[11px] sm:text-xs font-normal text-zinc-400 lowercase'>
                                    Earn bonus XP to progress toward bonus rewards.
                                </span>
                            </p>
                        ) : (
                            <p className='font-bold uppercase tracking-wider text-[#f4c430]'>
                                RP TRACK IS MANDATORY. XP TRACK IS LOCKED
                                <span className='block text-[11px] sm:text-xs font-normal text-zinc-400 lowercase'>
                                    Reach {maxRpThreshold} RP to unlock bonus XP rewards.
                                </span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Missions Block */}
                <div className='w-full space-y-3 sm:space-y-4 pt-3'>
                    <div className='flex items-center gap-2.5'>
                        <h3 className='text-xl sm:text-3xl font-bold uppercase tracking-wide text-white'>
                            Missions
                        </h3>
                        <span className='text-[#f4c430] bg-[#f4c430]/10 border border-[#f4c430]/30 px-2 py-0.5 text-xs sm:text-[13px] font-bold uppercase tracking-wider'>
                            {dbMissions.length} {selectedSeason === 2 ? "Active" : "Completed"}
                        </span>
                    </div>

                    <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4'>
                        {dbMissions.map((m, i) => (
                            <motion.div 
                                key={m._id} 
                                initial={{ opacity: 0, y: 14 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ delay: i * 0.08 }} 
                                onClick={() => selectedSeason === 2 && router.push('/dashboard/missions')}
                                className='bg-zinc-950/60 border-zinc-800/80 space-y-2.5 sm:space-y-3 border p-3.5 sm:p-4 cursor-pointer hover:border-[#f4c430]/70 transition-colors duration-200'
                            >
                                <div className='flex items-start justify-between gap-2'>
                                    <p className='text-sm sm:text-md font-semibold uppercase leading-tight tracking-wide text-white'>
                                        {m.title}
                                    </p>
                                </div>
                                <p className='text-[#f4c430] text-lg sm:text-xl font-bold'>+{m.rpReward} RP</p>
                            </motion.div>
                        ))}

                        {dbMissions.length === 0 && (
                            <div className='col-span-1 sm:col-span-2 lg:col-span-3 border border-dashed border-zinc-800 p-6 sm:p-8 text-center bg-zinc-900/10'>
                                <p className='text-zinc-500 text-xs sm:text-md uppercase tracking-wider'>No operations compiled for this phase yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Lower Season Selector */}
                <div className='pt-3 sm:pt-4 border-t border-zinc-900/60'>
                    <div className='flex flex-wrap gap-2 sm:gap-3 items-center justify-center sm:justify-start'>
                        {seasonStatuses.map((s) => {
                            const isActive = selectedSeason === s.number;
                            const isLocked = !s.isUnlocked;

                            return (
                                <div
                                    key={s.number}
                                    className={`flex items-center gap-1.5 sm:gap-2 border px-3 sm:px-4 py-1.5 transition-all ${
                                        isLocked ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                                    } ${
                                        isActive
                                            ? 'bg-zinc-900/40 border-[#f4c430]/60 text-[#f4c430]'
                                            : 'bg-zinc-950/20 border-zinc-800/80 text-zinc-500'
                                    }`}
                                    onClick={() => handleSeasonClick(s)}
                                >
                                    <span className='text-xs sm:text-sm font-semibold uppercase tracking-wide'>
                                        Season {String(s.number).padStart(2, '0')}
                                    </span>
                                    {isActive && !isLocked && <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-red-500' />}
                                    {isLocked && <Lock size={11} className='shrink-0 text-zinc-600' />}
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}