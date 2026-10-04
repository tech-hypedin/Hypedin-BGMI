'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../../components/ui/glass-card';
import ChangePasswordModal from '../../../components/dashboard/passwordChangeModal';
import { User, Shield, Trophy, Target, Zap, ExternalLink, Globe, Loader2, CheckCircle2, X, RefreshCw, KeyRound, Image as ImageIcon, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Character_1 from "../../../../public/icons/avator1.png";
import Character_2 from "../../../../public/icons/avator2.png";
import Character_3 from "../../../../public/icons/avator3.png";
import Character_4 from "../../../../public/icons/avator4.png";
import { getRankIcon } from '@/lib/rankIcon';
import Image, { StaticImageData } from 'next/image';
import Badge_1 from "../../../../public/icons/Badge_1.png";
import Badge_2 from "../../../../public/icons/Badge_2.png";
import Badge_3 from "../../../../public/icons/Badge_3.png";
import Badge_4 from "../../../../public/icons/Badge_4.png";
import Badge_5 from "../../../../public/icons/Badge_5.png";
import Badge_6 from "../../../../public/icons/Badge_6.png";
import Lock_Icon from "../../../../public/icons/Lock_Icon.png";

interface AmbassadorProfile {
    IGN: string,
    UID: string,
    rank: string,
    RP: number,
    collegeName: string,
    city: string,
    leaderBoardRank?: number,
    season1RP?: number,
    season1XP?: number,
    maxRP: number,
    maxXP: number,
    stats: { missionsCompleted: number, referrals: number, totalRewards: number },
    avator?: string,
    social?: { platform: 'Youtube' | 'Instagram' | 'Discord' | 'Rooter', platformUrl: string }
}

interface Badge { id: number; name: string; src: StaticImageData; requirement: number; infoText: string; }

export default function ProfilePage() {
    const [data, setData] = useState<AmbassadorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [verificationStep, setVerificationStep] = useState<'input' | 'success'>('input');
    const [ignInput, setIgnInput] = useState('');
    const [uidInput, setUidInput] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState<any>(null);
    const [tempSelectedAvatar, setTempSelectedAvatar] = useState<any>(null);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [previewBadge, setPreviewBadge] = useState<{ id: number; name: string; src: StaticImageData } | null>(null);
    const [infoBadge, setInfoBadge] = useState<Badge | null>(null);

    // State to hold the resolved rank icon image source string
    const [rankIconSrc, setRankIconSrc] = useState<string | null>(null);

    const avatars = [
        { id: 'avator_1', src: Character_1, name: 'Operative Alpha' },
        { id: 'avator_2', src: Character_2, name: 'Operative Beta' },
        { id: 'avator_3', src: Character_3, name: 'Operative Gamma' },
        { id: 'avator_4', src: Character_4, name: 'Operative Delta' },
    ] as const;

    const fetchProfile = async () => {
        try {
            const { data: response } = await api.get('/api/ambassador');
            if (response.success) {
                setData(response.dossier);
            }
        } catch (error) {
            console.error('FAILED TO RETRIEVE DOSSIER:', error);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchProfile(); }, []);

    useEffect(() => {
        const savedAvatarValue = (data as (AmbassadorProfile & { avator?: string }) | null)?.avator;
        const savedAvatar = avatars.find((avatar) => avatar.id === savedAvatarValue) || null;
        setSelectedAvatar(savedAvatar);
    }, [data]);

    useEffect(() => {
        if (data?.rank) {
            getRankIcon(data.rank)
                .then((module: any) => {
                    if (module) {
                        const resolvedPath = module.default?.src || module.default || module;
                        setRankIconSrc(resolvedPath);
                    }
                })
                .catch((error: any) => {
                    console.error('FAILED TO RESOLVE RANK ICON:', error);
                });
        }
    }, [data?.rank]);

    const openVerificationModal = () => {
        if (data && data.UID !== "" && data.IGN !== "") {
            setIgnInput(data.IGN);
            setUidInput(data.UID);
        }
        setIsModalOpen(true);
    };

    const handleVerifySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ignInput.trim() || !uidInput.trim()) {
            toast.error('COMMS ERROR: FIELDS CANNOT BE EMPTY');
            return;
        }
        setVerifying(true);
        try {
            const { data: res } = await api.patch('/api/ambassador/verifyAmbassador', {
                IGN: ignInput.trim(),
                UID: uidInput.trim()
            });
            if (res.success) {
                setResponseMessage(res.message || 'IDENTITY MATRIX CONFIGURATION UPDATED.');
                setVerificationStep('success');
                await fetchProfile();
            } else {
                toast.error(res.message || 'TRANSMISSION REJECTED.');
            }
        } catch (error: any) {
            console.error('VERIFICATION ERROR:', error);
            toast.error(error?.response?.data?.message || 'COMMS ERROR: TRANSMISSION FAILED');
        } finally {
            setVerifying(false);
        }
    };

    const closeVerificationFlow = () => {
        setIsModalOpen(false);
        setVerificationStep('input');
        setIgnInput('');
        setUidInput('');
        setResponseMessage('');
    };

    const handleOpenAvatarModal = () => {
        setTempSelectedAvatar(selectedAvatar);
        setIsAvatarModalOpen(true);
    };

    const handleConfirmAvatar = async () => {
        if (!tempSelectedAvatar) return;
        setSavingAvatar(true);
        try {
            const { data: res } = await api.patch('/api/ambassador/chooseAvator', {
                avator: tempSelectedAvatar.id,
            });
            if (res.success) {
                setSelectedAvatar(tempSelectedAvatar);
                setData((currentData) => currentData ? ({
                    ...currentData,
                    avator: tempSelectedAvatar.id,
                } as AmbassadorProfile) : currentData);
                setIsAvatarModalOpen(false);
                toast.success(res.message || 'AVATAR UPDATE COMMITTED.');
            } else {
                toast.error(res.message || 'AVATAR UPDATE REJECTED.');
            }
        } catch (error: any) {
            console.error('AVATAR UPDATE ERROR:', error);
            toast.error(error?.response?.data?.message || 'COMMS ERROR: AVATAR UPDATE FAILED');
        } finally {
            setSavingAvatar(false);
        }
    };

    if (loading) return (
        <div className='h-[60vh] w-full flex flex-col items-center justify-center bg-transparent relative font-["Teko","Oswald",sans-serif]'>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,169,0,0.05),transparent_60%)] animate-pulse' />
            <Loader2 className='text-primary animate-spin mb-4 drop-shadow-[0_0_10px_rgba(242,169,0,0.5)]' size={40} />
            <p className='text-sm font-black tracking-[0.6em] text-primary/70 uppercase italic animate-pulse font-["Teko","Oswald",sans-serif]'>Decrypting Operative Dossier...</p>
        </div>
    );

    if (!data) return (
        <div className='p-8 border-2 border-red-600/60 bg-red-950/20 text-red-500 tracking-widest relative overflow-hidden shadow-[inset_0_0_20px_rgba(220,38,38,0.15)] font-["Teko","Oswald",sans-serif]'>
            <div className='absolute top-0 left-0 bg-red-600 text-black px-2 py-0.5 text-xs font-black tracking-normal font-["Teko","Oswald",sans-serif]'>SYSTEM FAILURE</div>
            <p className='mt-2 font-bold text-lg sm:text-xl font-["Teko","Oswald",sans-serif]'>CRITICAL ERROR: OPERATIVE DATA CORRUPTED OR REJECTED BY SERVER.</p>
        </div>
    );

    const BADGES: Badge[] = [
        { id: 1, name: 'Hermes Rush', src: Badge_1, requirement: 5, infoText: 'Unlock Hermes Rush by completing Task 3 of Season 1.' },
        { id: 2, name: 'Ares Frag', src: Badge_2, requirement: 8, infoText: 'Unlock Ares Frag by completing Task 2 of season 2' },
        { id: 3, name: 'Apollo Clutch', src: Badge_3, requirement: 11, infoText: 'Unlock Apollo Clutch by completing Task 3 of season 2' },
        { id: 4, name: 'Hades Slayer', src: Badge_4, requirement: 13, infoText: 'Hades Slayer unlocking - to be notified soon' },
        { id: 5, name: 'Poseidon Dominator', src: Badge_5, requirement: 15, infoText: 'Poseidon Dominator unlocking - to be notified soon' },
        { id: 6, name: 'Zeus God mode', src: Badge_6, requirement: 17, infoText: 'Zeus God mode unlocking - to be notified soon' },
    ];

    const missionsCompleted = data.stats.missionsCompleted;
    const unlockedCount = BADGES.filter(badge => missionsCompleted >= badge.requirement).length;

    const isProfileLinked = data.UID !== "" && data.IGN !== "";

    return (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='space-y-4 sm:space-y-6 px-4 sm:px-0 relative z-10 font-["Teko","Oswald",sans-serif] antialiased'>
            {/* PROFILE TOP HEADER */}
            <div className='flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80 relative font-["Teko","Oswald",sans-serif]'>
                <div className='absolute bottom-0 right-0 w-16 h-[1px] bg-primary' />
                <div className='font-["Teko","Oswald",sans-serif]'>
                    <h1 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-wider uppercase leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-["Teko","Oswald",sans-serif]'>
                        AMBASSADOR <span className='text-primary font-black bg-linear-to-r from-primary to-amber-500 bg-clip-text text-transparent font-["Teko","Oswald",sans-serif]'>PROFILE</span>
                    </h1>
                </div>
                <div className='flex items-center font-["Teko","Oswald",sans-serif]'>
                    <button onClick={() => setIsPasswordModalOpen(true)} className='cursor-pointer text-[11px] font-black tracking-[0.15em] text-white bg-zinc-900 border border-zinc-800 hover:border-primary hover:text-primary transition-all px-4 py-2 font-["Teko","Oswald",sans-serif] uppercase flex items-center gap-2 shadow-md hover:shadow-[0_0_15px_rgba(242,169,0,0.15)] active:scale-98 group/passbtn'>
                        <KeyRound size={12} className='group-hover/passbtn:rotate-45 transition-transform duration-300' />
                        Change Password
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 font-["Teko","Oswald",sans-serif]'>
            {/* Left Column: Operative Profile Card */}
            <div className='lg:col-span-1 font-["Teko","Oswald",sans-serif]'>
                <GlassCard className='p-0 border-4 border-[#ffb60e] relative overflow-hidden group shadow-[0_15px_35px_rgba(0,0,0,0.9)] bg-[#121316] font-["Teko","Oswald",sans-serif] rounded-xs' index={0}>
                    {/* Top-Right Angular Heavy Bronze Armor Cutout Header */}
                    <div className='absolute top-0 right-0 w-24 h-24 pointer-events-none z-30 overflow-hidden'>
                        <div className='absolute top-0 right-0 w-32 h-12 bg-gradient-to-r from-[#5a421b] via-[#ffb60e] to-[#3a290e] border-b-2 border-l-2 shadow-lg transform rotate-45 translate-x-10 -translate-y-2' />
                    </div>

                    {/* Bottom-Left Angular Bronze Cutout Accent */}
                    <div className='absolute bottom-0 left-0 w-20 h-20 pointer-events-none z-30 overflow-hidden'>
                        <div className='absolute bottom-0 left-0 w-28 h-10 bg-gradient-to-r from-[#3a290e] via-[#ffb60e] to-[#5a421b] border-t-2 border-r-2 border-[#ff60e] shadow-lg transform rotate-45 -translate-x-10 translate-y-2' />
                    </div>

                    {/* Main Upper Avatar & Status Canvas */}
                    <div className='relative p-6 sm:p-7 border-b-2 border-[#ffb60e]/60 overflow-hidden bg-[#101114] font-["Teko","Oswald",sans-serif] min-h-[440px] flex flex-col justify-between'>
                        {/* Brushed Metal Background Texture + Tactical Geometric Lines */}
                        <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(181,139,65,0.08),transparent_80%)] pointer-events-none' />
                        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none' />

                        {/* Top-Left Rank Badge Box */}
                        <div className='relative z-20 self-start font-["Teko","Oswald",sans-serif]'>
                            <div className='bg-[#16171a]/95 border-2 border-[#ffb60e] text-[#ffb60e] px-3.5 py-2 flex flex-col items-center justify-center gap-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.8)] font-["Teko","Oswald",sans-serif] rounded-xs min-w-[70px]'>
                                {rankIconSrc ? (
                                    <img src={rankIconSrc} alt={`${data.rank} Icon`} className='w-8 h-8 object-contain drop-shadow-[0_0_6px_rgba(229,173,56,0.6)]' />
                                ) : (
                                    <Shield className='w-5 h-5 text-[#e5ad38] drop-shadow-[0_0_6px_rgba(229,173,56,0.6)]' />
                                )}
                                <span className='text-[13px] font-black uppercase tracking-[0.15em] font-["Teko","Oswald",sans-serif] leading-none mt-1'>{data.rank}</span>
                            </div>
                        </div>

                        {/* Center Avatar Square */}
                        <div className='relative z-20 my-6 flex flex-col items-center justify-center font-["Teko","Oswald",sans-serif]'>
                            <div onClick={handleOpenAvatarModal} className='cursor-pointer group/avatar-click flex flex-col items-center'>
                                {selectedAvatar ? (
                                    <div className='relative w-32 h-32 sm:w-36 sm:h-36 border-2 border-[#ffb60e] bg-[#16171b] shadow-[0_0_30px_rgba(0,0,0,0.95)] group-hover/avatar-click:border-[#f5be42] transition-all overflow-hidden rounded-xs p-1'>
                                        <img src={selectedAvatar.src.src || selectedAvatar.src} alt="Selected Avatar" className='w-full h-full object-cover group-hover/avatar-click:scale-105 transition-transform duration-500'/>
                                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover/avatar-click:opacity-100 flex items-center justify-center transition-all'>
                                            <ImageIcon size={22} className='text-[#ffb60e] animate-pulse' />
                                        </div>
                                    </div>
                                ) : (
                                    <div className='w-32 h-32 sm:w-36 sm:h-36 border-2 border-[#ffb60e] bg-[#16171b] flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.95)] group-hover/avatar-click:border-[#e5ad38] transition-all rounded-xs'>
                                        <User className='text-zinc-600 group-hover/avatar-click:text-[#e5ad38] transition-colors w-20 h-20' />
                                    </div>
                                )}
                                <button type='button' onClick={(e) => { e.stopPropagation(); handleOpenAvatarModal(); }} className='mt-4 cursor-pointer text-[12px] font-black tracking-widest text-black bg-[#ffb60e] hover:bg-[#ffc83b] transition-all px-4 py-1.5 font-["Teko","Oswald",sans-serif] uppercase shadow-[0_4px_12px_rgba(0,0,0,0.7)] active:scale-95 flex items-center gap-1.5 border border-[#ffb60e] rounded-xs'>
                                    <ImageIcon size={13} /> Choose Avatar
                                </button>
                            </div>
                        </div>

                        {/* Bottom Operative IGN & Rank Section */}
                        <div className='relative z-20 space-y-2 font-["Teko","Oswald",sans-serif]'>
                            <h2 className='text-2xl sm:text-3xl lg:text-3xl font-black text-white tracking-wider normal-case leading-none break-all drop-shadow-[0_3px_6px_rgba(0,0,0,1)] font-["Teko","Oswald",sans-serif]'>{isProfileLinked ? data.IGN : 'UNLINKED_OPERATIVE'}</h2>

                            <div className='flex flex-col items-start gap-2.5 font-["Teko","Oswald",sans-serif]'>
                                <div className='inline-flex items-center gap-2 bg-[#18191c]/90 border border-[#b58b41]/40 px-3 py-1 font-["Teko","Oswald",sans-serif] rounded-xs shadow-sm'>
                                    <span className='w-2 h-2 bg-[#ffb60e] rounded-full animate-ping' />
                                    {/* <p className='text-[#ffb60e] font-black uppercase tracking-[0.2em] text-[12px] font-["Teko","Oswald",sans-serif]'>SEASON RANK: #{data.leaderBoardRank || '---'}</p> */}
                                    <p className='text-[#ffb60e] font-black uppercase tracking-[0.2em] text-[12px] font-["Teko","Oswald",sans-serif]'>TOTAL RP EARNED: {data.maxRP}</p>
                                </div>

                                <div className='inline-flex items-center gap-2 bg-[#18191c]/90 border border-[#b58b41]/40 px-3 py-1 font-["Teko","Oswald",sans-serif] rounded-xs shadow-sm'>
                                    <p className='text-[#ffb60e] font-black uppercase tracking-[0.2em] text-[12px] font-["Teko","Oswald",sans-serif]'>TOTAL XP EARNED: {data.maxXP}</p>
                                </div>

                                {!isProfileLinked ? (
                                    <button onClick={openVerificationModal} className='cursor-pointer text-[12px] font-black tracking-[0.15em] text-black bg-[#ffb60e] hover:bg-[#ffc83b] transition-all px-4 py-2 font-["Teko","Oswald",sans-serif] uppercase shadow-[0_4px_15px_rgba(0,0,0,0.7)] flex items-center gap-2 border border-[#ffdb70] active:scale-98 group/vbtn rounded-xs w-full sm:w-auto justify-center'>
                                        <span className='w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse' /> VERIFIED OPERATIVE & UID
                                    </button>
                                ) : (
                                    <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full font-["Teko","Oswald",sans-serif]'>
                                        <div className='bg-black/90 border border-zinc-800 px-3 py-1.5 flex items-center gap-2 shadow-lg shrink-0 font-["Teko","Oswald",sans-serif] rounded-xs'>
                                            <span className='text-[10px] font-black text-zinc-500 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>UID:</span>
                                            <span className='text-xs font-mono font-bold text-zinc-200 tracking-wide select-all font-["Teko","Oswald",sans-serif]'>{data.UID}</span>
                                        </div>
                                        {/* <button onClick={openVerificationModal} className='cursor-pointer text-[11px] font-black tracking-wider text-zinc-400 bg-zinc-900/90 border border-zinc-800 hover:border-[#e5ad38] hover:text-[#e5ad38] transition-all px-3 py-1.5 flex items-center justify-center gap-1 uppercase italic shadow-sm active:scale-98 font-["Teko","Oswald",sans-serif] rounded-xs'><RefreshCw size={11} /> Update Info</button> */}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Dark Metallic Panel Section */}
                    <div className='p-5 space-y-5 bg-[#121316] backdrop-blur-xl relative font-["Teko","Oswald",sans-serif]'>
                        {/* College Info Header with Icon */}
                        <div className='flex items-center gap-2.5 font-["Teko","Oswald",sans-serif] border-b border-zinc-800/80 pb-3'>
                            {/* <School className='text-[#e5ad38] w-5 h-5 shrink-0' /> */}
                            <span className='text-sm sm:text-base font-black uppercase tracking-wider text-zinc-200 truncate font-["Teko","Oswald",sans-serif]'>{data.collegeName}</span>
                        </div>

                        {/* Rating Points & Total Rewards Dual Cards */}
                        <div className='flex flex-row gap-3.5 font-["Teko","Oswald",sans-serif]'>
                            <div className='flex-1 border border-zinc-800 bg-[#17181c] p-3 text-center transition-all relative font-["Teko","Oswald",sans-serif] shadow-inner rounded-xs'>
                                <p className='text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1 font-["Teko","Oswald",sans-serif]'>RANK POINTS</p>
                                <p className='text-3xl sm:text-4xl font-black text-white tracking-wider font-["Teko","Oswald",sans-serif] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]'>{data.RP.toLocaleString()}</p>
                            </div>

                            <div className='flex-1 border border-zinc-800 bg-[#17181c] p-3 text-center transition-all relative font-["Teko","Oswald",sans-serif] shadow-inner rounded-xs'>
                                <p className='text-[11px] font-black text-zinc-400 uppercase tracking-widest mb-1 font-["Teko","Oswald",sans-serif]'>TOTAL REWARDS</p>
                                <p className='text-3xl sm:text-4xl font-black text-[#e5ad38] tracking-wider drop-shadow-[0_0_10px_rgba(229,173,56,0.4)] font-["Teko","Oswald",sans-serif]'>{data.stats.totalRewards}</p>
                            </div>
                        </div>

                        {/* Social Transmission Button */}
                        <div className='flex justify-center pt-1 font-["Teko","Oswald",sans-serif]'>
                            {data.social?.platformUrl && (
                                <a href={data.social.platformUrl} target='_blank' rel='noreferrer' className='flex items-center gap-2 text-zinc-400 hover:text-[#e5ad38] transition-all font-black text-[11px] tracking-widest uppercase group/btn bg-[#18191c] hover:bg-[#b58b41]/10 px-4 py-2 border border-zinc-800 hover:border-[#b58b41]/50 font-["Teko","Oswald",sans-serif] shadow-md rounded-xs'>
                                    <Globe size={13} className='group-hover/btn:rotate-12 transition-transform text-[#e5ad38]' />
                                    <span className='font-["Teko","Oswald",sans-serif]'>LAUNCH {data.social.platform} TRANSMISSION</span>
                                    <ExternalLink size={10} className='opacity-60' />
                                </a>
                            )}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Right Column: Performance Cards & Badges Grid */}
            <div className='lg:col-span-2 space-y-6 font-["Teko","Oswald",sans-serif]'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
                    <PerformanceCard label='MISSIONS COMPLETED' value={data.stats.missionsCompleted} icon={<Target className='w-4 h-4 sm:w-5 sm:h-5' />}/>
                    <PerformanceCard label='PLATFORM STANDING' value={`#${data.leaderBoardRank || 'NA'}`} icon={<Trophy className='w-4 h-4 sm:w-5 sm:h-5' />}/>
                </div>
                <div className='space-y-3 font-["Teko","Oswald",sans-serif]'>
                    <div className='flex items-center gap-3 border-b border-zinc-900 pb-1.5 relative font-["Teko","Oswald",sans-serif]'>
                        <h3 className='text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>BADGES</h3>
                        <span className='text-[11px] font-black tracking-[0.2em] text-[#e5ad38] uppercase font-["Teko","Oswald",sans-serif]'>{unlockedCount} / {BADGES.length}</span>
                        <span className='h-[1px] flex-1 bg-linear-to-r from-zinc-900 to-transparent' />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
                        {BADGES.map((badge, index) => {
                            const isUnlocked = missionsCompleted >= badge.requirement;
                            const remaining = badge.requirement - missionsCompleted;
                            return (
                                <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={isUnlocked ? undefined : { scale: [1, 1.03, 0.97, 1.01, 0.99, 1], transition: { duration: 0.4 } }} onClick={() => { if (isUnlocked) setPreviewBadge(badge); }} transition={{ delay: index * 0.02 }} className={`relative group aspect-square rounded-sm border flex flex-col items-center justify-center p-4 transition-colors duration-300 font-["Teko","Oswald",sans-serif] ${isUnlocked ? 'cursor-pointer border-[#b58b41]/50 bg-[#1d1913]/80 shadow-[0_0_22px_rgba(242,169,0,0.12)]' : 'border-slate-400/50 bg-[#1a1c1e]/70'}`}>
                                    {/* Inner Crosshair Decal Ring */}
                                    <div className={`absolute inset-2 border rounded-sm pointer-events-none z-0 transition-colors duration-300 ${isUnlocked ? 'border-[#b58b41]/25' : 'border-slate-400/30'}`} />
                                    {/* Corner ticks — earned badges get the bracket treatment */}
                                    {isUnlocked && (
                                        <>
                                            <div className='absolute top-0 left-0 w-2 h-2 border-t border-l border-[#b58b41]/70 m-2 pointer-events-none z-20' />
                                            <div className='absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#b58b41]/70 m-2 pointer-events-none z-20' />
                                        </>
                                    )}
                                    {/* Lock overlay — locked only */}
                                    {!isUnlocked && (
                                        <div className='absolute z-20 w-10 h-10 pointer-events-none transition-transform duration-300 group-hover:scale-105'>
                                            <Image src={Lock_Icon} alt="Locked" fill className='object-contain' priority />
                                        </div>
                                    )}
                                    {/* Info button — locked only */}
                                    {!isUnlocked && (
                                        <button
                                            type='button'
                                            onClick={(e) => { e.stopPropagation(); setInfoBadge(badge); }}
                                            className='absolute top-2 right-2 z-30 w-6 h-6 flex items-center justify-center border border-zinc-700 bg-zinc-950/90 text-zinc-400 hover:text-primary hover:border-primary transition-all cursor-pointer rounded-full font-["Teko","Oswald",sans-serif]'
                                        >
                                            <Info size={13} />
                                        </button>
                                    )}
                                    {/* Badge asset — full colour once earned */}
                                    <div className={`relative w-32 h-32 sm:w-36 sm:h-36 z-10 transition-all duration-500 ${isUnlocked ? 'opacity-100 drop-shadow-[0_0_18px_rgba(242,169,0,0.35)] group-hover:scale-105' : 'opacity-35 brightness-75 contrast-125 drop-shadow-[0_0_15px_rgba(0,0,0,0.6)]'}`}>
                                        <Image src={badge.src} alt={badge.name} fill className='object-contain' priority />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
        {/* FOOTER MODALS */}
        <AnimatePresence>
            {isModalOpen && (
                <div className='fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-["Teko","Oswald",sans-serif]'>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-[#0D0D0D] border border-zinc-800/80 w-full max-w-md flex flex-col overflow-hidden shadow-[0_0_50px_rgba(242,169,0,0.15)] relative'>
                        <div className='absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary m-1' />
                        <div className='absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary m-1' />
                        <div className='absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary m-1' />
                        <div className='absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary m-1' />
                        <div className='p-4 border-b border-zinc-900 flex justify-between items-center bg-[#141411] shrink-0 font-["Teko","Oswald",sans-serif]'>
                            <div className='flex items-center gap-3 font-["Teko","Oswald",sans-serif]'>
                                <div className='h-6 w-1 bg-primary' />
                                <div>
                                    <h2 className='text-lg sm:text-xl font-black uppercase italic tracking-wider text-white font-["Teko","Oswald",sans-serif]'>
                                        {verificationStep === 'input' ? 'Identity Authentication' : 'Transmission Complete'}
                                    </h2>
                                    <p className='text-[9px] text-zinc-500 font-black tracking-widest uppercase font-["Teko","Oswald",sans-serif]'>SECURE TERMINAL // COMMS_SYS</p>
                                </div>
                            </div>
                            {verificationStep === 'input' && (
                                <button onClick={closeVerificationFlow} className='text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer'><X size={18} /></button>
                            )}
                        </div>
                        <div className='p-5 sm:p-6 bg-[#0B0B0C]/95 font-["Teko","Oswald",sans-serif]'>
                            {verificationStep === 'input' ? (
                                <form onSubmit={handleVerifySubmit} className='space-y-4 font-["Teko","Oswald",sans-serif]'>
                                    <div className='space-y-1 font-["Teko","Oswald",sans-serif]'>
                                        <label className='text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-["Teko","Oswald",sans-serif]'>CODENAME (IGN)</label>
                                        <input type='text' value={ignInput} onChange={(e) => setIgnInput(e.target.value)} placeholder='e.g. mOrTaL_oP' disabled={verifying} autoFocus className='w-full bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm font-bold text-white focus:border-primary focus:shadow-[0_0_10px_rgba(242,169,0,0.1)] outline-none transition-all font-["Teko","Oswald",sans-serif]' />
                                    </div>
                                    <div className='space-y-1 font-["Teko","Oswald",sans-serif]'>
                                        <label className='text-[10px] font-black text-zinc-400 uppercase tracking-widest block font-["Teko","Oswald",sans-serif]'>GAME CHARACTER UID</label>
                                        <input type='text' value={uidInput} onChange={(e) => setUidInput(e.target.value)} placeholder='e.g. 5123456789' disabled={verifying} className='w-full bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-sm font-mono font-bold text-primary focus:border-primary focus:shadow-[0_0_10px_rgba(242,169,0,0.1)] outline-none transition-all font-["Teko","Oswald",sans-serif]' />
                                    </div>
                                    <div className='pt-2 flex gap-3 font-["Teko","Oswald",sans-serif]'>
                                        <button type='button' onClick={closeVerificationFlow} disabled={verifying} className='flex-1 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-black py-2.5 px-4 transition-all uppercase text-xs italic tracking-widest cursor-pointer font-["Teko","Oswald",sans-serif] disabled:opacity-40'>Abort</button>
                                        <button type='submit' disabled={verifying} className='flex-1 bg-white hover:bg-primary text-black font-black py-2.5 px-4 flex items-center justify-center gap-1.5 transition-all uppercase text-xs italic tracking-widest cursor-pointer font-["Teko","Oswald",sans-serif] shadow-md disabled:opacity-50'>
                                            {verifying ? (
                                                <><Loader2 size={12} className='animate-spin' /> Processing</>
                                            ) : ( 'Verify Account' )}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div className='text-center py-2 space-y-4 font-["Teko","Oswald",sans-serif]'>
                                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-none bg-primary/10 border border-primary/30 text-primary mb-1 shadow-[0_0_15px_rgba(242,169,0,0.15)]'>
                                        <CheckCircle2 size={24} className='drop-shadow-[0_0_5px_rgba(242,169,0,0.6)]' />
                                    </div>
                                    <div className='space-y-1 font-["Teko","Oswald",sans-serif]'>
                                        <h3 className='text-lg font-black tracking-wide uppercase text-white font-["Teko","Oswald",sans-serif]'>AUTHENTICATION MATRIX RECORDED</h3>
                                        <p className='text-xs font-bold text-zinc-400 tracking-wider font-["Teko","Oswald",sans-serif] leading-relaxed px-2'>{responseMessage}</p>
                                    </div>
                                    <div className='pt-2 font-["Teko","Oswald",sans-serif]'>
                                        <button onClick={closeVerificationFlow} className='w-full bg-primary hover:bg-amber-500 text-black font-black py-3 px-4 transition-all uppercase text-xs italic tracking-[0.2em] cursor-pointer font-["Teko","Oswald",sans-serif] shadow-lg'>Done</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {isAvatarModalOpen && (
                <div className='fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-["Teko","Oswald",sans-serif]'>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-[#0D0D0D] border border-zinc-800/80 w-full max-w-md flex flex-col overflow-hidden shadow-[0_0_50px_rgba(242,169,0,0.15)] relative'>
                        <div className='absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary m-1' />
                        <div className='absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary m-1' />
                        <div className='absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary m-1' />
                        <div className='absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary m-1' />
                        <div className='p-4 border-b border-zinc-900 flex justify-between items-center bg-[#141411] shrink-0 font-["Teko","Oswald",sans-serif]'>
                            <div className='flex items-center gap-3 font-["Teko","Oswald",sans-serif]'>
                                <div className='h-6 w-1 bg-primary' />
                                <div>
                                    <h2 className='text-lg sm:text-xl font-black uppercase tracking-wider text-white font-["Teko","Oswald",sans-serif]'>SELECT AVATAR</h2>
                                </div>
                            </div>
                            <button onClick={() => setIsAvatarModalOpen(false)} className='text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer'><X size={18} /></button>
                        </div>
                        <div className='p-5 sm:p-6 bg-[#0B0B0C]/95 font-["Teko","Oswald",sans-serif] space-y-6'>
                            <div className='grid grid-cols-2 gap-4'>
                                {avatars.map((avatar) => {
                                    const isSelected = tempSelectedAvatar?.id === avatar.id;
                                    return (
                                        <div key={avatar.id} onClick={() => setTempSelectedAvatar(avatar)} className={`cursor-pointer border p-2 relative bg-zinc-950/40 hover:bg-zinc-900/40 transition-all aspect-square flex flex-col items-center justify-center group/item overflow-hidden ${isSelected ? 'border-primary shadow-[0_0_15px_rgba(242,169,0,0.25)]' : 'border-zinc-800 hover:border-zinc-700'}`}>
                                            <img src={avatar.src.src} alt={avatar.name} className={`w-4/5 h-4/5 object-cover transition-transform duration-500 ${isSelected ? 'scale-105' : 'group-hover/item:scale-105'}`}/>
                                            <div className={`absolute bottom-0 inset-x-0 py-1 text-center text-[10px] font-black tracking-wider uppercase ${isSelected ? 'bg-primary text-black' : 'bg-zinc-900/80 text-zinc-400'}`}>{avatar.name}</div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className='flex gap-3 font-["Teko","Oswald",sans-serif]'>
                                <button type='button' onClick={() => setIsAvatarModalOpen(false)} className='flex-1 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-black py-2.5 px-4 transition-all uppercase text-xs tracking-widest cursor-pointer font-["Teko","Oswald",sans-serif]'>Cancel</button>
                                <button type='button' disabled={!tempSelectedAvatar || savingAvatar} onClick={handleConfirmAvatar} className='flex-1 bg-white hover:bg-primary text-black disabled:opacity-50 font-black py-2.5 px-4 flex items-center justify-center gap-1.5 transition-all uppercase text-xs tracking-widest cursor-pointer font-["Teko","Oswald",sans-serif] shadow-md'>
                                    {savingAvatar ? (
                                        <><Loader2 size={12} className='animate-spin' /> Saving</>
                                    ) : (
                                        'Select Avatar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {previewBadge && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewBadge(null)} className='fixed inset-0 z-70 flex items-center justify-center bg-black/85 backdrop-blur-md cursor-pointer'>
                    <motion.div initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.75 }} transition={{ type: 'spring', stiffness: 260, damping: 22 }} onClick={(e) => e.stopPropagation()} className='relative w-64 h-64 sm:w-80 sm:h-80 cursor-default'>
                        <div className='absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(242,169,0,0.3),transparent_70%)] animate-pulse pointer-events-none' />
                        <Image src={previewBadge.src} alt={previewBadge.name} fill className='object-contain drop-shadow-[0_0_45px_rgba(242,169,0,0.65)]' priority />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        <AnimatePresence>
            {infoBadge && (
                <div className='fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md font-["Teko","Oswald",sans-serif]'>
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-[#0D0D0D] border border-zinc-800/80 w-full max-w-md flex flex-col overflow-hidden shadow-[0_0_50px_rgba(242,169,0,0.15)] relative'>
                        <div className='absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary m-1' />
                        <div className='absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary m-1' />
                        <div className='absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary m-1' />
                        <div className='absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary m-1' />
                        <div className='p-4 border-b border-zinc-900 flex justify-between items-center bg-[#141411] shrink-0 font-["Teko","Oswald",sans-serif]'>
                            <div className='flex items-center gap-3 font-["Teko","Oswald",sans-serif]'>
                                <div className='h-6 w-1 bg-primary' />
                                <div>
                                    <h2 className='text-lg sm:text-xl font-black uppercase italic tracking-wider text-white font-["Teko","Oswald",sans-serif]'>{infoBadge.name}</h2>
                                    <p className='text-[9px] text-zinc-500 font-black tracking-widest uppercase font-["Teko","Oswald",sans-serif]'>BADGE INTEL</p>
                                </div>
                            </div>
                            <button onClick={() => setInfoBadge(null)} className='text-zinc-500 hover:text-white transition-colors p-1 cursor-pointer'><X size={18} /></button>
                        </div>
                        <div className='p-5 sm:p-6 bg-[#0B0B0C]/95 font-["Teko","Oswald",sans-serif]'>
                            <p className='text-sm font-bold text-zinc-300 tracking-wide leading-relaxed font-["Teko","Oswald",sans-serif]'>{infoBadge.infoText}</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
        <ChangePasswordModal isOpen={isPasswordModalOpen} onComplete={() => setIsPasswordModalOpen(false)} />
    </motion.div>
    );
}

function PerformanceCard({ label, value, icon }: any) {
    return (
        <GlassCard className='p-4 sm:p-5 border-zinc-900 bg-zinc-950/80 group hover:border-primary/30 relative overflow-hidden transition-all duration-300 shadow-md font-["Teko","Oswald",sans-serif]' index={2}>
            <div className='absolute top-0 right-0 w-3 h-3 text-[10px] text-zinc-800 group-hover:text-primary/40 flex items-center justify-center p-1 select-none font-["Teko","Oswald",sans-serif]'>+</div>
            <div className='flex items-center gap-3.5 relative z-10 font-["Teko","Oswald",sans-serif]'>
                <div className='w-10 h-10 sm:w-12 sm:h-12 border border-zinc-800 bg-zinc-950 flex items-center justify-center text-primary group-hover:border-primary/60 group-hover:bg-primary/5 group-hover:scale-105 transition-all duration-500 shadow-inner relative before:absolute before:top-0 before:left-0 before:w-1 before:h-1 before:bg-primary/40'>{icon}</div>
                <div className='font-["Teko","Oswald",sans-serif]'>
                    <p className='text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-0.5 leading-none group-hover:text-zinc-400 transition-colors font-["Teko","Oswald",sans-serif]'>{label}</p>
                    <p className='text-2xl sm:text-3xl font-black text-white leading-none tracking-wider bg-linear-to-b from-white to-zinc-300 bg-clip-text font-["Teko","Oswald",sans-serif]'>{value}</p>
                </div>
            </div>
        </GlassCard>
    );
}

function MedalBadge({ label, icon, color }: any) {
    return (
        <div className='flex items-center gap-2.5 px-3 py-2 border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-950 group hover:border-primary/40 transition-all cursor-default relative overflow-hidden before:absolute before:top-0 before:left-0 before:h-full before:w-[2px] before:bg-zinc-800 hover:before:bg-primary before:transition-colors font-["Teko","Oswald",sans-serif]'>
            <div className={`${color} group-hover:scale-115 transition-all duration-500 bg-zinc-900/80 p-1.5 border border-zinc-800/80 group-hover:border-primary/20 group-hover:bg-primary/5 shadow-xs`}>{icon}</div>
            <span className='text-xs sm:text-sm font-black text-zinc-300 group-hover:text-white uppercase tracking-wider transition-colors font-["Teko","Oswald",sans-serif]'>{label}</span>
        </div>
    );
}
