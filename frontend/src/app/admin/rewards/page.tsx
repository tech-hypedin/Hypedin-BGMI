'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Package, Trash2, ShieldCheck, Cpu, Ticket, IdCard, Box, AlertTriangle } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const TypeIcon = ({ type, size = 20 }: { type: string, size?: number }) => {
    switch (type) {
        case 'Digital': return <Cpu size={size} />;
        case 'Merch': return <Package size={size} />;
        case 'Access': return <Ticket size={size} />;
        case 'Identity': return <IdCard size={size} />;
        case 'Hardware': return <Box size={size} />;
        default: return <Package size={size} />;
    }
}

export default function AdminRewardsInventory() {
    const queryClient = useQueryClient();

    const { data: rewards, isLoading } = useQuery({
        queryKey: ['admin-rewards-list'],
        queryFn: async () => {
            const { data } = await api.get('/api/admin/rewards');
            return data.inventory;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/api/admin/rewards/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rewards-list'] });
        }
    });

    if (isLoading) return <div className='p-10 md:p-20 text-primary font-black animate-pulse tracking-[0.2em] md:tracking-[0.5em] text-xs md:text-base'>RETRIEVING ARMORY DATA...</div>;

    return (
        <div className='p-4 md:p-8 space-y-6 md:space-y-10'>
            <div className='flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#1f1f1f] pb-6 md:pb-8'>
                <div>
                    <p className='text-primary text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] mb-2 uppercase'>Logistics & Supply</p>
                    <h1 className='text-3xl md:text-5xl font-bold text-white tracking-tighter uppercase font-heading leading-none'>
                        REWARD <span className='text-primary italic'>INVENTORY</span>
                    </h1>
                </div>
                <div className='flex gap-4'>
                    <div className='px-4 py-2 md:px-6 md:py-3 bg-[#0e0e0e] border border-[#1f1f1f] text-left lg:text-right w-full lg:w-auto'>
                        <p className='text-[8px] md:text-[9px] text-[#444] font-black uppercase tracking-widest'>Total Assets</p>
                        <p className='text-xl md:text-2xl font-bold text-white leading-none'>{rewards?.length || 0}</p>
                    </div>
                </div>
            </div>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6'>
                {rewards?.map((reward: any, index: number) => (
                    <GlassCard key={reward._id} index={index} className='p-0 overflow-hidden border-[#1f1f1f] group hover:border-primary/30 transition-all'>
                        <div className='flex flex-col sm:flex-row h-full'>
                            <div className={cn( 'w-full sm:w-32 flex flex-row sm:flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-[#1f1f1f] p-4 sm:p-6 transition-colors gap-4 sm:gap-0', reward.isAutoUnlocked ? 'bg-primary/5 text-primary' : 'bg-white/5 text-white' )}>
                                <div className='shrink-0'>
                                    <TypeIcon type={reward.rewardType} size={28} />
                                </div>
                                <p className='text-[8px] md:text-[9px] font-black sm:mt-4 uppercase tracking-tighter'>{reward.rewardType}</p>
                            </div>

                            <div className='flex-1 p-5 md:p-8 space-y-4'>
                                <div className='flex justify-between items-start gap-2'>
                                    <div className='space-y-1'>
                                        <h3 className='text-lg md:text-2xl font-bold text-white uppercase tracking-wider font-heading leading-tight group-hover:text-primary transition-colors line-clamp-2'>
                                            {reward.title}
                                        </h3>
                                        <p className='text-[10px] md:text-xs text-[#8C8C8C] line-clamp-2 leading-relaxed'>{reward.description}</p>
                                    </div>
                                    {reward.isAutoUnlocked && (
                                        <div className='flex items-center gap-1 text-green-500 shrink-0'>
                                            <ShieldCheck size={12} />
                                            <span className='text-[7px] md:text-[8px] font-black uppercase tracking-widest'>Auto</span>
                                        </div>
                                    )}
                                </div>

                                <div className='grid grid-cols-2 gap-4 pt-4 border-t border-[#1f1f1f]'>
                                    <div>
                                        <p className='text-[8px] md:text-[9px] font-black text-[#444] uppercase tracking-widest'>Min. Rank</p>
                                        <p className='text-xs md:text-sm font-bold text-white uppercase italic truncate'>{reward.requiredRank}</p>
                                    </div>
                                    <div>
                                        <p className='text-[8px] md:text-[9px] font-black text-[#444] uppercase tracking-widest'>RP Needed</p>
                                        <p className='text-xs md:text-sm font-bold text-primary truncate'>{reward.requiredRP?.toLocaleString()} RP</p>
                                    </div>
                                </div>
                            </div>

                            <div className='border-t sm:border-t-0 sm:border-l border-[#1f1f1f] flex sm:flex-col bg-black/40'>
                                <button onClick={() => {
                                        if(confirm('Confirm asset decommissioning?')) deleteMutation.mutate(reward._id);
                                    }}
                                    className='hover:cursor-pointer flex-1 p-4 text-[#444] hover:text-red-500 hover:bg-red-500/5 transition-all flex items-center justify-center'
                                    title='Delete Asset'
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}

                {rewards?.length === 0 && (
                    <div className='col-span-full py-12 md:py-20 border-2 border-dashed border-[#1f1f1f] flex flex-col items-center justify-center text-center px-4 bg-black/40'>
                        <AlertTriangle size={40} className='mb-4 opacity-20' />
                        <p className='font-foreground uppercase tracking-[0.2em] text-xs md:text-base'>No rewards currently deployed in sector</p>
                    </div>
                )}
            </div>
        </div>
    );
}