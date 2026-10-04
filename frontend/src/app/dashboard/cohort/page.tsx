'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Mail, Phone, Hash, ShieldCheck, 
    Loader2, ChevronDown, ChevronUp, Image as ImageIcon,
    ExternalLink, GraduationCap, BookOpen
} from 'lucide-react';

import api from '@/lib/api';

export interface ICohortMember {
    _id: string;
    mvp_id: string;
    name: string;
    email: string;
    phoneNo: number;
    UID: string;
    MVPUID: string;
    idCardImage: string[];
    cohort: 'Cohort-1' | 'Cohort-2' | 'Cohort-3' | 'Cohort-4' | 'Cohort-5';
}

export interface IReferal {
    _id?: string;
    name: string;
    email: string;
    phoneNo: number;
    college: string;
    course: string;
    currentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year';
    instagramUrl: string;
    accountRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror';
    hasTime: boolean;
    tournamentExp: boolean;
    hasExperience: boolean;
    convert: string;
    reasoning: string;
    experienceDetails: string;
    MVPID: string;
    status?: 'Pending Review' | 'Rejected' | 'Accepted';
}

const ALL_COHORTS = [
    'Cohort-1',
    // 'Cohort-2',
    // 'Cohort-3',
    // 'Cohort-4',
    // 'Cohort-5',
] as const;

export default function CohortsPage() {
    // Keep track of expanded accordion panels
    const [expandedCohort, setExpandedCohort] = useState<string | null>('Cohort-1');
    const [isReferralsExpanded, setIsReferralsExpanded] = useState<boolean>(true);

    /* ─── Fetch Cohort Data ─── */
    const { data: members = [], isLoading } = useQuery<ICohortMember[]>({
        queryKey: ['cohort-members'],
        queryFn: async () => {
            const { data } = await api.get('/api/ambassador/cohort');
            return data?.cohorts || data?.data || (Array.isArray(data) ? data : []);
        },
        staleTime: 5 * 60 * 1000,
    });

    /* ─── Fetch Referrals Data ─── */
    const { data: referals = [], isLoading: isLoadingReferals } = useQuery<IReferal[]>({
        queryKey: ['my-referals'],
        queryFn: async () => {
            const { data } = await api.get('/api/ambassador/getMyReferals');
            return data?.referals || [];
        },
        staleTime: 5 * 60 * 1000,
    });

    /* ─── Group members into respective cohort buckets ─── */
    const groupedCohorts = useMemo(() => {
        const map: Record<string, ICohortMember[]> = {
            'Cohort-1': [],
            'Cohort-2': [],
            'Cohort-3': [],
            'Cohort-4': [],
            'Cohort-5': [],
        };

        if (Array.isArray(members)) {
            members.forEach((m) => {
                if (map[m.cohort]) {
                    map[m.cohort].push(m);
                }
            });
        }

        return map;
    }, [members]);

    const tekoFont = { fontFamily: '"Teko", "Oswald", sans-serif' };

    return (
        <div 
            style={tekoFont} 
            className='p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-white uppercase overflow-x-hidden antialiased font-["Teko","Oswald",sans-serif]'
        >
            {/* Header */}
            <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[3px] border-primary pl-4 sm:pl-6 py-0.5 relative z-10 font-["Teko","Oswald",sans-serif]'>
                <div>
                    <p className='text-primary text-xs sm:text-sm font-medium tracking-[0.15em] mb-1 opacity-90 font-["Teko","Oswald",sans-serif]'>
                        Field Operations Battalions
                    </p>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.06em] uppercase leading-none text-zinc-100 font-["Teko","Oswald",sans-serif]'>
                        AMBASSADOR <span className='text-primary'>COHORTS</span>
                    </h1>
                </div>

                <div className='flex items-center gap-2 bg-black border border-zinc-900 px-4 py-2 skew-x-[-10deg] shrink-0 font-["Teko","Oswald",sans-serif]'>
                    <Users size={16} className='text-primary skew-x-10' />
                    <span className='text-xs sm:text-sm font-bold tracking-widest text-zinc-300 skew-x-10 font-["Teko","Oswald",sans-serif]'>
                        TOTAL OPERATIVES: {members.length}
                    </span>
                </div>
            </header>

            <div className='bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold tracking-widest font-["Teko","Oswald",sans-serif] items-center px-4 py-2 skew-x-[-10deg] shrink-0 hover:cursor-pointer ease-in-out duration-300 transition transform-3d'>
                <Link href='/dashboard/refer-mvp' className='flex gap-2 text-xs sm:text-sm font-bold tracking-widest text-primary skew-x-10 w-full animate-color-pulse'>
                    <Users size={16} className='skew-x-10'/>
                    Refer a Player
                </Link>
            </div>

            {/* Accordion List */}
            <div className='space-y-4 relative z-10 font-["Teko","Oswald",sans-serif]'>
                {isLoading ? (
                    <div className='py-20 flex flex-col items-center justify-center text-center font-["Teko","Oswald",sans-serif]'>
                        <Loader2 className='w-8 h-8 text-primary animate-spin mb-4' />
                        <p className='text-xs sm:text-sm font-medium tracking-[0.25em] text-primary/50 font-["Teko","Oswald",sans-serif]'>
                            Decrypting Referal Intel...
                        </p>
                    </div>
                ) : (
                    <div className='border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm p-4 space-y-4 transition-all font-["Teko","Oswald",sans-serif]'>
                        <div onClick={() => setIsReferralsExpanded(!isReferralsExpanded)} className='flex justify-between items-center p-3 border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all font-["Teko","Oswald",sans-serif]'>
                            <div className='flex items-center gap-4 font-["Teko","Oswald",sans-serif]'>
                                <h3 className='text-xl sm:text-2xl font-bold tracking-wider text-primary font-["Teko","Oswald",sans-serif]'>
                                    Your Referals
                                </h3>
                                <span className='bg-primary/10 border border-primary/30 text-primary px-2.5 py-0.5 text-xs sm:text-sm font-semibold tracking-widest font-["Teko","Oswald",sans-serif]'>
                                    {referals.length} {referals.length === 1 ? 'OPERATIVE' : 'OPERATIVES'}
                                </span>
                            </div>

                            <div className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                                <span className='text-xs text-primary font-bold tracking-widest hidden sm:inline font-["Teko","Oswald",sans-serif]'>
                                    {isReferralsExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                                </span>
                                {isReferralsExpanded ? (
                                    <ChevronUp size={18} className='text-primary' />
                                ) : (
                                    <ChevronDown size={18} className='text-primary' />
                                )}
                            </div>
                        </div>

                        <AnimatePresence initial={false}>
                            {isReferralsExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className='overflow-hidden font-["Teko","Oswald",sans-serif]'
                                >
                                    <div className='pt-2 space-y-3 font-["Teko","Oswald",sans-serif]'>
                                        {isLoadingReferals ? (
                                            <div className='py-12 flex flex-col items-center justify-center text-center font-["Teko","Oswald",sans-serif]'>
                                                <Loader2 className='w-6 h-6 text-primary animate-spin mb-2' />
                                                <p className='text-xs font-medium tracking-[0.25em] text-primary/50 font-["Teko","Oswald",sans-serif]'>
                                                    Decrypting Referral Intel...
                                                </p>
                                            </div>
                                        ) : referals.length > 0 ? (
                                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-["Teko","Oswald",sans-serif]'>
                                                {referals.map((referal, idx) => (
                                                    <ReferalCard key={referal._id || idx} referal={referal} />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className='border border-dashed border-zinc-900 bg-zinc-950/40 p-8 text-center font-["Teko","Oswald",sans-serif]'>
                                                <p className='text-zinc-600 text-xs sm:text-sm font-medium tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>
                                                    NO OPERATIVES ASSIGNED TO THIS SECTOR YET.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                <div className='bg-primary/10 border border-primary/30 text-primary text-xs sm:text-sm font-semibold tracking-widest font-["Teko","Oswald",sans-serif] items-center px-4 py-2 skew-x-[-10deg] shrink-0 hover:cursor-pointer ease-in-out duration-300 transition transform-3d'>
                    <Link href='/playerRecruitment' className='flex gap-2 text-xs sm:text-sm font-bold tracking-widest text-primary skew-x-10 w-full animate-color-pulse'>
                        <Users size={16} className='skew-x-10'/>
                        Add Players to your Cohort
                    </Link>
                </div>

                {isLoading ? (
                    <div className='py-20 flex flex-col items-center justify-center text-center font-["Teko","Oswald",sans-serif]'>
                        <Loader2 className='w-8 h-8 text-primary animate-spin mb-4' />
                        <p className='text-xs sm:text-sm font-medium tracking-[0.25em] text-primary/50 font-["Teko","Oswald",sans-serif]'>
                            Decrypting Cohort Intel...
                        </p>
                    </div>
                ) : (
                    ALL_COHORTS.map((cohortName) => {
                        const cohortMembers = groupedCohorts[cohortName] || [];
                        const isExpanded = expandedCohort === cohortName;
                        const count = cohortMembers.length;

                        return (
                            <div key={cohortName} className='border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm p-4 space-y-4 transition-all font-["Teko","Oswald",sans-serif]'>
                                <div onClick={() => setExpandedCohort(isExpanded ? null : cohortName)} className='flex justify-between items-center p-3 border border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10 transition-all font-["Teko","Oswald",sans-serif]'>
                                    <div className='flex items-center gap-4 font-["Teko","Oswald",sans-serif]'>
                                        <h3 className='text-xl sm:text-2xl font-bold tracking-wider text-primary font-["Teko","Oswald",sans-serif]'>
                                            Your Cohort
                                        </h3>
                                        <span className='bg-primary/10 border border-primary/30 text-primary px-2.5 py-0.5 text-xs sm:text-sm font-semibold tracking-widest font-["Teko","Oswald",sans-serif]'>
                                            {count} {count === 1 ? 'OPERATIVE' : 'OPERATIVES'}
                                        </span>
                                    </div>

                                    <div className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                                        <span className='text-xs text-primary font-bold tracking-widest hidden sm:inline font-["Teko","Oswald",sans-serif]'>
                                            {isExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                                        </span>
                                        {isExpanded ? (
                                            <ChevronUp size={18} className='text-primary' />
                                        ) : (
                                            <ChevronDown size={18} className='text-primary' />
                                        )}
                                    </div>
                                </div>

                                {/* Accordion Content Body */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className='overflow-hidden font-["Teko","Oswald",sans-serif]'
                                        >
                                            <div className='pt-2 space-y-3 font-["Teko","Oswald",sans-serif]'>
                                                {count > 0 ? (
                                                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-["Teko","Oswald",sans-serif]'>
                                                        {cohortMembers.map((member) => (
                                                            <AmbassadorCard key={member._id} member={member} />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className='border border-dashed border-zinc-900 bg-zinc-950/40 p-8 text-center font-["Teko","Oswald",sans-serif]'>
                                                        <p className='text-zinc-600 text-xs sm:text-sm font-medium tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>
                                                            NO OPERATIVES ASSIGNED TO THIS SECTOR YET.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Ambassador Member Card
   ═══════════════════════════════════════════════════════════════════ */

function AmbassadorCard({ member }: { member: ICohortMember }) {
    const primaryIdImage = member.idCardImage && member.idCardImage.length > 0 ? member.idCardImage[0] : null;

    return (
        <div className='bg-zinc-950/60 border border-zinc-900 p-4 sm:p-5 flex flex-col justify-between gap-4 group hover:border-primary/40 hover:bg-zinc-900/20 transition-all relative overflow-hidden font-["Teko","Oswald",sans-serif]'>
            <div className='space-y-3 font-["Teko","Oswald",sans-serif]'>
                {/* Title / Name Block */}
                <div className='flex justify-between items-start gap-2 border-b border-zinc-900 pb-2.5 font-["Teko","Oswald",sans-serif]'>
                    <div className='font-["Teko","Oswald",sans-serif]'>
                        <span className='text-zinc-500 text-[11px] tracking-widest block mb-0.5 font-["Teko","Oswald",sans-serif]'>NAME</span>
                        <h4 className='text-xl sm:text-2xl font-bold tracking-wide text-white uppercase leading-none group-hover:text-primary transition-colors font-["Teko","Oswald",sans-serif]'>
                            {member.name}
                        </h4>
                    </div>
                    <span className='bg-zinc-900 text-primary border border-zinc-800 px-2 py-0.5 text-xs font-bold tracking-wider font-["Teko","Oswald",sans-serif]'>
                        {member._id}
                    </span>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-2 text-xs text-zinc-300 font-["Teko","Oswald",sans-serif] uppercase'>
                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <Mail size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]' title={member.email}>
                            {member.email}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <Phone size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]'>
                            {member.phoneNo}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <Hash size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-400 font-["Teko","Oswald",sans-serif]'>
                            UID: <strong className='text-white font-["Teko","Oswald",sans-serif]'>{member.UID}</strong>
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <ShieldCheck size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-400 font-["Teko","Oswald",sans-serif]'>
                            MVPUID: <strong className='text-white font-["Teko","Oswald",sans-serif]'>{member.MVPUID}</strong>
                        </span>
                    </div>
                </div>
            </div>

            {/* ID Card Attachment Section */}
            {primaryIdImage && (
                <div className='pt-2 border-t border-zinc-900/80 flex items-center justify-between font-["Teko","Oswald",sans-serif]'>
                    <span className='text-xs text-zinc-500 tracking-wider flex items-center gap-1.5 uppercase font-["Teko","Oswald",sans-serif]'>
                        <ImageIcon size={13} className='text-primary' /> ID VERIFICATION ATTACHED
                    </span>

                    <a
                        href={primaryIdImage}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center gap-1 text-xs text-primary hover:text-white transition-colors uppercase font-bold tracking-wider font-["Teko","Oswald",sans-serif]'
                    >
                        VIEW <ExternalLink size={12} />
                    </a>
                </div>
            )}
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Referral Member Card
   ═══════════════════════════════════════════════════════════════════ */

function ReferalCard({ referal }: { referal: IReferal }) {
    const rawStatus = referal.status || 'Pending Review';
    const displayStatus = rawStatus === 'Pending Review' ? 'PENDING' : rawStatus.toUpperCase();

    let statusStyles = 'bg-[#ffb60e]/20 text-[#ffb60e] border-[#ffb60e] shadow-[0_0_8px_rgba(255,182,14,0.3)]';
    if (rawStatus === 'Accepted') {
        statusStyles = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
    } else if (rawStatus === 'Rejected') {
        statusStyles = 'bg-rose-950/40 text-rose-400 border-rose-800/50';
    }

    return (
        <div className='bg-zinc-950/60 border border-zinc-900 p-4 sm:p-5 flex flex-col justify-between gap-4 group hover:border-primary/40 hover:bg-zinc-900/20 transition-all relative overflow-hidden font-["Teko","Oswald",sans-serif]'>
            <div className='space-y-3 font-["Teko","Oswald",sans-serif]'>
                {/* Title / Name Block & Status */}
                <div className='flex justify-between items-start gap-2 border-b border-zinc-900 pb-2.5 font-["Teko","Oswald",sans-serif]'>
                    <div className='font-["Teko","Oswald",sans-serif]'>
                        <span className='text-zinc-500 text-[11px] tracking-widest block mb-0.5 font-["Teko","Oswald",sans-serif]'>NAME</span>
                        <h4 className='text-xl sm:text-2xl font-bold tracking-wide text-white uppercase leading-none group-hover:text-primary transition-colors font-["Teko","Oswald",sans-serif]'>
                            {referal.name}
                        </h4>
                    </div>
                    <span 
                        className={`border px-2.5 py-0.5 text-xs sm:text-sm font-bold tracking-widest font-["Teko","Oswald",sans-serif] ${statusStyles}`}
                    >
                        STATUS: <span style={{ color: '#ffb60e' }}>{displayStatus}</span>
                    </span>
                </div>

                {/* Details Grid */}
                <div className='grid grid-cols-2 gap-2 text-xs text-zinc-300 font-["Teko","Oswald",sans-serif] uppercase'>
                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <Mail size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]' title={referal.email}>
                            {referal.email}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <Phone size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]'>
                            {referal.phoneNo}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <GraduationCap size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]' title={referal.college}>
                            {referal.college}
                        </span>
                    </div>

                    <div className='flex items-center gap-2 truncate bg-black/40 border border-zinc-900/80 p-2 font-["Teko","Oswald",sans-serif]'>
                        <BookOpen size={13} className='text-primary shrink-0' />
                        <span className='truncate text-zinc-300 font-["Teko","Oswald",sans-serif]' title={referal.course}>
                            {referal.course}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}