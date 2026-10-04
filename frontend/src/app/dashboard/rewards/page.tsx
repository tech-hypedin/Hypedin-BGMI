// 'use client';

// import { Star, CheckCircle2 } from 'lucide-react';
// import { GlassCard } from '@/components/ui/glass-card';
// import { useQuery } from '@tanstack/react-query';
// import { cn } from '@/lib/utils';
// import api from '@/lib/api';
// import Image from 'next/image';
// import Lock_Icon from "../../../../public/icons/Lock_Icon.png";
// import Gift_Icon from "../../../../public/icons/Gift_Icon.png";

// export default function RewardsPage() {
//     const { data, isLoading } = useQuery({
//         queryKey: ['ambassador-rewards'],
//         queryFn: async () => {
//             const res = await api.get('/api/ambassador/rewards');
//             return res.data;
//         },
//         staleTime: 5 * 60 * 1000,
//         refetchOnWindowFocus: false
//     });

//     if (isLoading) return (
//         <div className='min-h-[60vh] flex flex-col items-center justify-center p-4 text-center font-["Teko",_"Oswald",_sans-serif]'>
//             <div className='w-10 h-10 border-4 border-primary/20 border-t-primary animate-spin mb-4' />
//             <div className='text-primary font-black tracking-[0.4em] text-sm uppercase font-["Teko",_"Oswald",_sans-serif]'>Syncing Supply Drop...</div>
//         </div>
//     );

//     const rewards = data?.rewards || [];
//     const unlockedCount = rewards.filter((r: any) => r.unlocked).length;

//     const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Ace Master', 'Ace Dominator', 'Conqueror'];

//     return (
//         /* Transparent Wrapper */
//         <div className="relative min-h-screen w-full bg-transparent py-6 sm:py-10 font-['Teko',_'Oswald',_sans-serif]">
//             {/* Highly Visible Grid Overlay */}
//             <div 
//                 className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
//                 style={{
//                     backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
//                     backgroundSize: '24px 24px'
//                 }}
//             />

//             {/* Inner Layout Content Container — Handles Responsive Breathing Padding */}
//             <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 overflow-x-hidden font-["Teko",_"Oswald",_sans-serif] antialiased relative z-10'>
//                 <header className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2d2417] font-["Teko",_"Oswald",_sans-serif]'>
//                     <div className='space-y-2 font-["Teko",_"Oswald",_sans-serif]'>
//                         <p className='text-primary font-black uppercase tracking-[0.4em] text-xs font-["Teko",_"Oswald",_sans-serif]'>
//                             QUARTERLY LOGISTICS SUPPLY
//                         </p>
//                         <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-widest uppercase leading-none font-["Teko","Oswald",sans-serif]'>
//                             SECTOR <span className='text-primary font-["Teko","Oswald",sans-serif]'>REWARDS</span>
//                         </h1>
//                     </div>
            
//                     <div className='flex items-center gap-4 sm:gap-6 bg-[#0f0b06] p-4 sm:px-8 sm:py-4 border border-[#2d2417] w-full lg:w-auto font-["Teko",_"Oswald",_sans-serif]'>
//                         <Star className='text-primary shrink-0 w-5 h-5 sm:w-6 sm:h-6' />
//                         <div className='text-left font-["Teko",_"Oswald",_sans-serif]'>
//                             <p className='text-xs font-black text-[#a69785] uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-tight mb-1 font-["Teko",_"Oswald",_sans-serif]'>UNLOCKED INVENTORY</p>
//                             <p className='text-xl sm:text-3xl font-bold text-white leading-tight tracking-widest uppercase font-["Teko",_"Oswald",_sans-serif]'>
//                                 {unlockedCount} Assets Secured
//                             </p>
//                         </div>
//                     </div>
//                 </header>

//                 <div className='grid grid-cols-1 gap-12 font-["Teko",_"Oswald",_sans-serif]'>
//                     <div className='space-y-12 sm:space-y-16 font-["Teko",_"Oswald",_sans-serif]'>
//                         {tiers.map((tierName) => {
//                             const tierRewards = rewards.filter((r: any) => r.requiredRank === tierName);
                
//                             if (tierRewards.length === 0) return null;
                
//                             return (
//                                 <div key={tierName} className='space-y-6 sm:space-y-10 font-["Teko",_"Oswald",_sans-serif]'>
//                                     <div className='flex items-center gap-4 sm:gap-6 font-["Teko",_"Oswald",_sans-serif]'>
//                                         <h3 className='text-2xl sm:text-4xl font-bold uppercase tracking-widest text-white whitespace-nowrap font-["Teko",_"Oswald",_sans-serif]'>
//                                             {tierName}+
//                                         </h3>
//                                         <div className='flex-1 h-px bg-[#2d2417]' />
//                                     </div>

//                                     <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 font-["Teko",_"Oswald",_sans-serif]'>
//                                         {tierRewards.map((reward: any, idx: number) => (
//                                             <RewardCard key={reward._id} name={reward.title} unlocked={!reward.isLocked} type={reward.rewardType} index={idx}/>
//                                         ))}
//                                     </div>
//                                 </div>
//                             );
//                         })}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// function RewardCard({ name, unlocked, type, index }: any) {
//     return (
//         <GlassCard className={cn( 'p-6 sm:p-10 group h-full transition-all border-[#2d2417] flex flex-col justify-between bg-black/40 backdrop-blur-sm font-["Teko",_"Oswald",_sans-serif]', unlocked ? 'hover:border-primary/50' : 'opacity-30 grayscale' )} index={index}>
//             <div className='flex items-start justify-between mb-8 sm:mb-10 font-["Teko",_"Oswald",_sans-serif]'>
//                 <div className={cn( 'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border transition-all duration-500 font-["Teko",_"Oswald",_sans-serif] p-2 overflow-hidden', unlocked ? 'border-primary/30 group-hover:bg-primary' : 'border-[#2d2417]' )}>
//                     <div className='relative w-full h-full'>
//                         {/* Custom Gift Icon Asset with applied opacity-40 fade filter */}
//                         <Image
//                             src={Gift_Icon}
//                             alt="Reward"
//                             fill
//                             className={cn('object-contain transition-all duration-500 opacity-40', unlocked ? 'group-hover:invert group-hover:brightness-0' : '')}
//                             priority
//                         />
//                     </div>
//                 </div>
//                 {unlocked ? (
//                     <CheckCircle2 className='text-green-500 w-4.5 h-4.5 sm:w-5 sm:h-5' />
//                 ) : (
//                     <div className='relative w-4.5 h-4.5 sm:w-5 sm:h-5 opacity-50'>
//                         <Image
//                             src={Lock_Icon}
//                             alt="Locked"
//                             fill
//                             className='object-contain'
//                             priority
//                         />
//                     </div>
//                 )}
//             </div>

//             <div className='mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 font-["Teko",_"Oswald",_sans-serif]'>
//                 <div className='space-y-3 sm:space-y-4 font-["Teko",_"Oswald",_sans-serif]'>
//                     <p className='text-xs font-black text-primary uppercase tracking-[0.3em] font-["Teko",_"Oswald",_sans-serif]'>{type}</p>
//                     <h4 className='text-2xl sm:text-3xl font-bold text-white leading-tight transition-colors group-hover:text-primary uppercase tracking-wider font-["Teko",_"Oswald",_sans-serif]'>
//                         {name}
//                     </h4>
//                 </div>

//                 {/* <button
//                     disabled
//                     className='shrink-0 w-full sm:w-auto px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] border border-[#2d2417] text-[#a69785] bg-black/30 opacity-50 cursor-not-allowed font-["Teko",_"Oswald",_sans-serif]'
//                 >
//                     Claim Now
//                 </button> */}
//             </div>
//         </GlassCard>
//     );
// }



'use client';

import { Star, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import Image from 'next/image';
import Lock_Icon from "../../../../public/icons/Lock_Icon.png";
import Gift_Icon from "../../../../public/icons/Gift_Icon.png";

export default function RewardsPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['ambassador-rewards'],
        queryFn: async () => {
            const res = await api.get('/api/ambassador/rewards');
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    if (isLoading) return (
        <div className='min-h-[60vh] flex flex-col items-center justify-center p-4 text-center font-["Teko",_"Oswald",_sans-serif]'>
            <div className='w-10 h-10 border-4 border-primary/20 border-t-primary animate-spin mb-4' />
            <div className='text-primary font-black tracking-[0.4em] text-sm uppercase font-["Teko",_"Oswald",_sans-serif]'>Syncing Supply Drop...</div>
        </div>
    );

    const rewards = data?.rewards || [];
    const rewardsSeason1 = data?.rewardsSeason1 || [];

    // Helper to check if a specific reward was UNLOCKED in Season 1
    const isClaimedInSeason1 = (reward: any) => {
        if (!rewardsSeason1 || !rewardsSeason1.length) return false;

        const s1Match = rewardsSeason1.find((s1: any) => {
            if (typeof s1 === 'string') {
                return s1 === reward._id || s1 === reward.title || s1 === reward.id;
            }
            return (
                (s1._id && s1._id === reward._id) ||
                (s1.title && s1.title === reward.title) ||
                (s1.id && s1.id === reward._id)
            );
        });

        if (!s1Match) return false;

        // Check if the matching Season 1 item was unlocked
        if (typeof s1Match === 'object') {
            return s1Match.unlocked === true || s1Match.isLocked === false;
        }

        return true;
    };

    const unlockedCount = rewards.filter((r: any) => (r.unlocked || !r.isLocked)).length;

    const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Ace Master', 'Ace Dominator', 'Conqueror'];

    return (
        /* Transparent Wrapper */
        <div className="relative min-h-screen w-full bg-transparent py-6 sm:py-10 font-['Teko',_'Oswald',_sans-serif]">
            {/* Highly Visible Grid Overlay */}
            <div 
                className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                }}
            />

            {/* Inner Layout Content Container — Handles Responsive Breathing Padding */}
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 overflow-x-hidden font-["Teko",_"Oswald",_sans-serif] antialiased relative z-10'>
                <header className='flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#2d2417] font-["Teko",_"Oswald",_sans-serif]'>
                    <div className='space-y-2 font-["Teko",_"Oswald",_sans-serif]'>
                        <p className='text-primary font-black uppercase tracking-[0.4em] text-xs font-["Teko",_"Oswald",_sans-serif]'>
                            QUARTERLY LOGISTICS SUPPLY
                        </p>
                        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-widest uppercase leading-none font-["Teko","Oswald",sans-serif]'>
                            SECTOR <span className='text-primary font-["Teko","Oswald",sans-serif]'>REWARDS</span>
                        </h1>
                    </div>
            
                    <div className='flex items-center gap-4 sm:gap-6 bg-[#0f0b06] p-4 sm:px-8 sm:py-4 border border-[#2d2417] w-full lg:w-auto font-["Teko",_"Oswald",_sans-serif]'>
                        <Star className='text-primary shrink-0 w-5 h-5 sm:w-6 sm:h-6' />
                        <div className='text-left font-["Teko",_"Oswald",_sans-serif]'>
                            <p className='text-xs font-black text-[#a69785] uppercase tracking-[0.2em] sm:tracking-[0.3em] leading-tight mb-1 font-["Teko",_"Oswald",_sans-serif]'>UNLOCKED INVENTORY</p>
                            <p className='text-xl sm:text-3xl font-bold text-white leading-tight tracking-widest uppercase font-["Teko",_"Oswald",_sans-serif]'>
                                {unlockedCount} Assets Secured
                            </p>
                        </div>
                    </div>
                </header>

                <div className='grid grid-cols-1 gap-12 font-["Teko",_"Oswald",_sans-serif]'>
                    <div className='space-y-12 sm:space-y-16 font-["Teko",_"Oswald",_sans-serif]'>
                        {tiers.map((tierName) => {
                            const tierRewards = rewards.filter((r: any) => r.requiredRank === tierName);
                
                            if (tierRewards.length === 0) return null;
                
                            return (
                                <div key={tierName} className='space-y-6 sm:space-y-10 font-["Teko",_"Oswald",_sans-serif]'>
                                    <div className='flex items-center gap-4 sm:gap-6 font-["Teko",_"Oswald",_sans-serif]'>
                                        <h3 className='text-2xl sm:text-4xl font-bold uppercase tracking-widest text-white whitespace-nowrap font-["Teko",_"Oswald",_sans-serif]'>
                                            {tierName}+
                                        </h3>
                                        <div className='flex-1 h-px bg-[#2d2417]' />
                                    </div>

                                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 font-["Teko",_"Oswald",_sans-serif]'>
                                        {tierRewards.map((reward: any, idx: number) => {
                                            const isUnlocked = reward.unlocked ?? !reward.isLocked;
                                            const isClaimed = isClaimedInSeason1(reward);

                                            return (
                                                <RewardCard 
                                                    key={reward._id || idx} 
                                                    name={reward.title} 
                                                    unlocked={isUnlocked} 
                                                    claimed={isClaimed} 
                                                    type={reward.rewardType} 
                                                    index={idx}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function RewardCard({ name, unlocked, claimed, type, index }: any) {
    return (
        <GlassCard className={cn( 'p-6 sm:p-10 group h-full transition-all border-[#2d2417] flex flex-col justify-between bg-black/40 backdrop-blur-sm font-["Teko",_"Oswald",_sans-serif]', unlocked ? 'hover:border-primary/50' : 'opacity-30 grayscale' )} index={index}>
            <div className='flex items-start justify-between mb-8 sm:mb-10 font-["Teko",_"Oswald",_sans-serif]'>
                <div className={cn( 'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border transition-all duration-500 font-["Teko",_"Oswald",_sans-serif] p-2 overflow-hidden', unlocked ? 'border-primary/30 group-hover:bg-primary' : 'border-[#2d2417]' )}>
                    <div className='relative w-full h-full'>
                        {/* Custom Gift Icon Asset with applied opacity-40 fade filter */}
                        <Image
                            src={Gift_Icon}
                            alt="Reward"
                            fill
                            className={cn('object-contain transition-all duration-500 opacity-40', unlocked ? 'group-hover:invert group-hover:brightness-0' : '')}
                            priority
                        />
                    </div>
                </div>
                {unlocked ? (
                    <CheckCircle2 className='text-green-500 w-4.5 h-4.5 sm:w-5 sm:h-5' />
                ) : (
                    <div className='relative w-4.5 h-4.5 sm:w-5 sm:h-5 opacity-50'>
                        <Image
                            src={Lock_Icon}
                            alt="Locked"
                            fill
                            className='object-contain'
                            priority
                        />
                    </div>
                )}
            </div>

            <div className='mt-auto flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 font-["Teko",_"Oswald",_sans-serif]'>
                <div className='space-y-3 sm:space-y-4 font-["Teko",_"Oswald",_sans-serif]'>
                    <p className='text-xs font-black text-primary uppercase tracking-[0.3em] font-["Teko",_"Oswald",_sans-serif]'>{type}</p>
                    <h4 className='text-2xl sm:text-3xl font-bold text-white leading-tight transition-colors group-hover:text-primary uppercase tracking-wider font-["Teko",_"Oswald",_sans-serif]'>
                        {name}
                    </h4>
                    {claimed && (
                        <p className='text-xs font-black text-amber-500 uppercase tracking-[0.2em] font-["Teko",_"Oswald",_sans-serif]'>
                            You have already claimed this reward
                        </p>
                    )}
                </div>

                {/* <button
                    disabled
                    className='shrink-0 w-full sm:w-auto px-5 py-2.5 text-xs font-black uppercase tracking-[0.3em] border border-[#2d2417] text-[#a69785] bg-black/30 opacity-50 cursor-not-allowed font-["Teko",_"Oswald",_sans-serif]'
                >
                    Claim Now
                </button> */}
            </div>
        </GlassCard>
    );
}