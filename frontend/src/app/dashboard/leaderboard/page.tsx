'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import Gold_Trophy_Icon_Leaderboard from "../../../../public/icons/Gold_Trophy_Icon_Leaderboard.png";
import Silver_Trophy_Icon_Leaderboard from "../../../../public/icons/Silver_Trophy_Icon_Leaderboard.png";
import Bronze_Trophy_Icon_Leaderboard from "../../../../public/icons/Bronze_Trophy_Icon_Leaderboard.png";

import colleges from "../../../lib/colleges.js";

const COLLEGE_ALIASES: Record<string, string> = {
    'nitk': 'NIT Karnataka',
    'nit surathkal': 'NIT Karnataka',
    'nitk surathkal': 'NIT Karnataka',
    'nitt': 'NIT Trichy',
    'nit tiruchirappalli': 'NIT Trichy',
    'nitw': 'NIT Warangal',
    'nitc': 'NIT Calicut',
    'mnit': 'NIT Jaipur',
    'mnit jaipur': 'NIT Jaipur',
    'manit': 'NIT Bhopal',
    'manit bhopal': 'NIT Bhopal',
    'svnit': 'NIT Surat',
    'svnit surat': 'NIT Surat',
    'vnit': 'VNIT Nagpur',
    'nit nagpur': 'VNIT Nagpur',
    'nit allahabad': 'MNNIT Allahabad',
    'mnnit': 'MNNIT Allahabad',
    'nit prayagraj': 'MNNIT Allahabad',
    'iit ism': 'IIT Dhanbad (ISM)',
    'iit ism dhanbad': 'IIT Dhanbad (ISM)',
    'iit dhanbad': 'IIT Dhanbad (ISM)',
    'ism dhanbad': 'IIT Dhanbad (ISM)',
    'iit bhu': 'IIT BHU (Varanasi)',
    'iit varanasi': 'IIT BHU (Varanasi)',
    'iit bhu varanasi': 'IIT BHU (Varanasi)',
    'iiitd': 'IIIT Delhi',
    'lpu': 'Lovely Professional University',
    'kiit': 'KIIT University',
    'pes': 'PES University',
    'soil': 'School of Inspired Leadership (SOIL)',
    'sri eshwar college of engineering': 'Sri Eshwar College',
    'kpr college': 'KPR College of Arts, Science & Research, Coimbatore',
};

// Lowercase, strip punctuation, collapse full institute names to acronyms,
// squeeze whitespace.
function cleanCollegeString(value: string): string {
    return String(value || '')
        .toLowerCase()
        .replace(/[.,()&\-/]/g, ' ')
        .replace(/\bnational institute of technology\b/g, 'nit')
        .replace(/\bindian institute of technology\b/g, 'iit')
        .replace(/\bindian institute of information technology\b/g, 'iiit')
        .replace(/\s+/g, ' ')
        .trim();
}

// Pre-clean every canonical name once.
const CLEANED_CANONICAL: { cleaned: string; canonical: string }[] = (colleges as string[]).map(
    (c) => ({ cleaned: cleanCollegeString(c), canonical: c })
);

// Cache so each distinct raw value is resolved only once per session.
const collegeMatchCache = new Map<string, string>();

function normalizeCollegeName(raw: string): string {
    if (!raw) return '';
    const cached = collegeMatchCache.get(raw);
    if (cached) return cached;

    const cleaned = cleanCollegeString(raw);
    let result: string | null = null;

    // 1. Direct alias hit
    if (COLLEGE_ALIASES[cleaned]) {
        result = COLLEGE_ALIASES[cleaned];
    }

    // 2. Exact match against cleaned canonical names
    if (!result) {
        const exact = CLEANED_CANONICAL.find((c) => c.cleaned === cleaned);
        if (exact) result = exact.canonical;
    }

    // 3. Containment match (canonical inside input, or input inside canonical).
    //    Prefer the longest canonical string that matches, so "iit bhu varanasi"
    //    resolves to "IIT BHU (Varanasi)" rather than a shorter partial.
    if (!result) {
        let best: { canonical: string; len: number } | null = null;
        for (const c of CLEANED_CANONICAL) {
            const contains =
                (` ${cleaned} `).includes(` ${c.cleaned} `) ||
                (` ${c.cleaned} `).includes(` ${cleaned} `);
            if (contains && cleaned.length >= 4 && (!best || c.cleaned.length > best.len)) {
                best = { canonical: c.canonical, len: c.cleaned.length };
            }
        }
        if (best) result = best.canonical;
    }

    // 4. Token match: every token of the canonical name appears in the input
    //    (handles reordered / extra words like "nit srinagar j&k campus").
    if (!result) {
        const inputTokens = new Set(cleaned.split(' '));
        let best: { canonical: string; len: number } | null = null;
        for (const c of CLEANED_CANONICAL) {
            const tokens = c.cleaned.split(' ');
            if (tokens.length >= 2 && tokens.every((t) => inputTokens.has(t))) {
                if (!best || c.cleaned.length > best.len) {
                    best = { canonical: c.canonical, len: c.cleaned.length };
                }
            }
        }
        if (best) result = best.canonical;
    }

    // 5. No confident match -> show the raw value as-is
    const finalValue = result || String(raw).trim();
    collegeMatchCache.set(raw, finalValue);
    return finalValue;
}

/* ------------------------------------------------------------------ */

export default function LeaderboardPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['leaderboard-national'],
        queryFn: async () => {
            const response = await api.get('/api/ambassador/leaderboard');
            return response.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const leaderboard = data?.leaderboard || [];
    const topThree = leaderboard.slice(0, 3);
    const remaining = leaderboard.slice(3);

    const filteredRemaining = useMemo(() => {
        if (!searchQuery.trim()) return remaining;
        return remaining.filter((amb: any) =>
            amb.IGN?.toLowerCase().includes(searchQuery.toLowerCase().trim())
        );
    }, [remaining, searchQuery]);

    if (isLoading) return (
        <div className='min-h-screen w-full flex flex-col items-center justify-center bg-black p-4 font-["Teko","Oswald",sans-serif]'>
            <div className='w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin mb-4' />
            <div className='text-primary text-sm font-medium tracking-[0.25em] animate-pulse uppercase text-center font-["Teko","Oswald",sans-serif]'>
                Reconnaissance in Progress...
            </div>
        </div>
    );

    return (
        <div className='p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-white uppercase overflow-x-hidden font-["Teko","Oswald",sans-serif] antialiased'>
            
            {/* HEADER */}
            <header className='flex flex-col sm:flex-row justify-between items-start gap-4 border-l-[3px] border-primary pl-4 sm:pl-6 py-0.5 relative z-10 font-["Teko","Oswald",sans-serif]'>
                <div>
                    <p className='text-primary text-xs sm:text-sm font-medium tracking-[0.15em] mb-1 font-["Teko","Oswald",sans-serif] opacity-90'>
                        Competing at Elite Capacity
                    </p>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold tracking-[0.06em] uppercase leading-none text-zinc-100 font-["Teko","Oswald",sans-serif]'>
                        THE <span className='text-primary'>LEADERBOARD</span>
                    </h1>
                </div>
                <div className='flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-1.5 text-xs sm:text-sm font-medium font-["Teko","Oswald",sans-serif] shrink-0'>
                    <Search size={13} className='text-primary' />
                    <input
                        type='text'
                        placeholder='SEARCH BY IGN...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className='bg-transparent text-white outline-none placeholder:text-zinc-500 tracking-widest font-["Teko","Oswald",sans-serif] uppercase w-36 sm:w-48'
                    />
                </div>
            </header>

            {/* PODIUM */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-end pt-4 sm:pt-6 relative z-10 font-["Teko","Oswald",sans-serif]'>
                <div className='order-2 md:order-1 font-["Teko","Oswald",sans-serif]'>
                    <PodiumCard ambassador={topThree[1]} rank={2} color='text-zinc-400' />
                </div>
                <div className='order-1 md:order-2 font-["Teko","Oswald",sans-serif]'>
                    <PodiumCard ambassador={topThree[0]} rank={1} color='text-primary' isGold />
                </div>
                <div className='order-3 md:order-3 font-["Teko","Oswald",sans-serif]'>
                    <PodiumCard ambassador={topThree[2]} rank={3} color='text-orange-700' />
                </div>
            </div>

            {/* GRID STRUCTURE */}
            <div className='bg-zinc-950/40 border border-zinc-900 flex flex-col font-["Teko","Oswald",sans-serif] relative z-10'>
                <div className='overflow-x-auto no-scrollbar font-["Teko","Oswald",sans-serif]'>
                    <table className='w-full text-left border-collapse min-w-150 font-["Teko","Oswald",sans-serif]'>
                        <thead className='bg-black/50 text-zinc-500 text-xs sm:text-sm font-medium tracking-wider border-b border-zinc-900/60 font-["Teko","Oswald",sans-serif]'>
                            <tr className='font-["Teko","Oswald",sans-serif]'>
                                <th className='p-4 sm:p-5 font-["Teko","Oswald",sans-serif]'>SERIAL</th>
                                <th className='p-4 sm:p-5 font-["Teko","Oswald",sans-serif]'>IN GAME NAME</th>
                                <th className='p-4 sm:p-5 font-["Teko","Oswald",sans-serif]'>COLLEGE NAME</th>
                                <th className='p-4 sm:p-5 font-["Teko","Oswald",sans-serif]'>RP</th>
                                <th className='p-4 sm:p-5 text-right font-["Teko","Oswald",sans-serif]'>RANK</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-zinc-900/40 font-["Teko","Oswald",sans-serif]'>
                            {filteredRemaining.map((amb: any, index: number) => (
                                <RankRow key={amb._id} amb={amb} rank={index} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* USER POSITION FOUL BLOCK */}
                <div className='bg-primary/10 border-t border-primary/40 p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-center gap-4 font-["Teko","Oswald",sans-serif]'>
                    <div className='flex items-center gap-4 sm:gap-6 font-["Teko","Oswald",sans-serif]'>
                        <span className='text-2xl sm:text-3xl font-bold text-primary loop-none font-["Teko","Oswald",sans-serif]'>#{data?.currentUserRank}</span>
                        <span className='text-xl sm:text-2xl font-bold tracking-wide uppercase leading-none font-["Teko","Oswald",sans-serif]'>YOU (AMBASSADOR)</span>
                    </div>
                    <div className='flex items-center gap-3 bg-black/40 px-4 py-1.5 border border-primary/20 shrink-0 font-["Teko","Oswald",sans-serif]'>
                        <Star className='text-primary fill-primary' size={14} />
                        <span className='text-xl sm:text-2xl font-bold leading-none font-["Teko","Oswald",sans-serif]'>{data?.currentUserRP?.toLocaleString() || '0'} RP</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PodiumCard({ ambassador, rank, color, isGold }: any) {
    if (!ambassador) return null;
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative p-5 sm:p-6 bg-zinc-950/40 border ${isGold ? 'border-primary/30 h-auto md:h-100' : 'border-zinc-900 h-auto md:h-85'} flex flex-col items-center justify-center text-center font-["Teko","Oswald",sans-serif]`}>
            <div className='absolute top-3 left-4 font-bold text-4xl opacity-10 font-["Teko","Oswald",sans-serif]'>#{rank}</div>
            { rank === 1 ? (<Image width={50} height={50} alt='Gold Trophy' src={Gold_Trophy_Icon_Leaderboard} />) : rank === 2 ? (<Image src={Silver_Trophy_Icon_Leaderboard} alt='Silver Trophy' width={45} height={45} />) : (<Image alt='Bronze Trophy' width={40} height={40} src={Bronze_Trophy_Icon_Leaderboard} />) }
            <h3 className='text-2xl sm:text-2xl font-bold tracking-wide mb-1 normal-case leading-none truncate w-full text-white font-["Teko","Oswald",sans-serif]'>
                {ambassador.IGN ? ambassador.IGN : `OPERATIVE ${rank}`}
            </h3>
            <p className='text-xs sm:text-sm text-zinc-500 font-light tracking-wide mb-5 uppercase max-w-full truncate font-["Teko","Oswald",sans-serif]'>
                {normalizeCollegeName(ambassador.collegeName)}
            </p>
      
            <div className='flex flex-col items-center gap-2 w-full font-["Teko","Oswald",sans-serif]'>
                <div className='flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 w-full py-2 font-["Teko","Oswald",sans-serif]'>
                    <Star className='text-primary fill-primary' size={13} />
                    <span className='text-2xl sm:text-3xl font-bold leading-none text-white font-["Teko","Oswald",sans-serif]'>{ambassador.RP}</span>
                </div>
                <div className='flex items-center gap-1.5 text-xs sm:text-sm font-light text-primary/60 mt-1 font-["Teko","Oswald",sans-serif]'>
                    <span className='tracking-wider font-["Teko","Oswald",sans-serif]'>RANK: {ambassador.rank}</span>
                </div>
            </div>
        </motion.div>
    );
}

function RankRow({ amb, rank }: any) {
    return (
        <tr className='hover:bg-white/5 transition-colors group font-["Teko","Oswald",sans-serif]'>
            <td className='p-4 sm:p-5 text-2xl sm:text-3xl font-bold text-primary opacity-50 group-hover:opacity-100 leading-none font-["Teko","Oswald",sans-serif]'>
                {rank + 4}
            </td>
            <td className='p-4 sm:p-5 tracking-wide text-xl sm:text-2xl normal-case whitespace-nowrap leading-none text-white font-["Teko","Oswald",sans-serif]'>
                {amb.IGN ? amb.IGN : `OPERATIVE ${amb.rpLeaderBoardRank}`}
            </td>
            <td className='p-4 sm:p-5 text-xs sm:text-sm font-light text-zinc-500 group-hover:text-zinc-400 transition-colors tracking-wide uppercase truncate max-w-37.5 leading-none font-["Teko","Oswald",sans-serif]'>
                {normalizeCollegeName(amb.collegeName)}
            </td>
            <td className='p-4 sm:p-5 leading-none font-["Teko","Oswald",sans-serif]'>
                <div className='flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                    <Star size={13} className='text-primary fill-primary shrink-0' />
                    <span className='font-bold text-lg sm:text-xl text-white font-["Teko","Oswald",sans-serif]'>{amb.RP}</span>
                </div>
            </td>
            <td className='p-4 sm:p-5 text-right leading-none font-["Teko","Oswald",sans-serif]'>
                <div className='inline-block border border-primary/20 px-2.5 py-0.5 text-xs sm:text-sm font-light text-primary/70 bg-primary/5 uppercase whitespace-nowrap tracking-wide font-["Teko","Oswald",sans-serif]'>
                    {amb.rank} TIER
                </div>
            </td>
        </tr>
    );
}