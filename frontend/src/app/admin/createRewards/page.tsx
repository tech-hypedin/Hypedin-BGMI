'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Package, Trash2, Layers, X, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';

export default function AdminRewardsPage() {
    const queryClient = useQueryClient();
    const [isCreating, setIsCreating] = useState(false);

    const { data: rewards, isLoading } = useQuery({
        queryKey: ['admin-rewards'],
        queryFn: async () => {
            const { data } = await api.get('/api/admin/rewards');
            return data.inventory;
        }
    });

    return (
        <div className='p-4 md:p-8 space-y-6 md:space-y-10 bg-transparent min-h-screen text-white font-heading uppercase'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-[#1f1f1f] pb-6 gap-4'>
                <div>
                    <p className='text-primary text-[8px] md:text-[10px] font-black tracking-[0.4em] mb-2'>Logistics Control</p>
                    <h1 className='text-3xl md:text-5xl font-black italic tracking-tighter leading-none'>
                        REWARD <span className='text-primary'>DATABASE</span>
                    </h1>
                </div>
                <Button onClick={() => setIsCreating(true)} className='w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 font-black text-xs md:text-sm tracking-widest bg-primary text-black hover:bg-white transition-all flex items-center justify-center'>
                    <Plus className='mr-2' size={18} /> INITIALIZE ASSET
                </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10'>
                <div className='lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6'>
                    <StatMiniCard label='TOTAL ASSETS' value={rewards?.length || 0} icon={<Package />} />
                    <StatMiniCard label='AUTO-DEPLOYED' value={rewards?.filter((r:any) => r.isAutoUnlocked).length || 0} icon={<Layers />} />
                </div>

                <div className='lg:col-span-2 space-y-4'>
                    {isLoading ? (
                        <div className='animate-pulse text-[#444] font-black tracking-[0.2em] md:tracking-[0.4em] text-xs'>ACCESSING ENCRYPTED DATA...</div>
                    ) : (
                        rewards?.length === 0 ? (
                            <div className='p-10 border border-dashed border-[#1f1f1f] text-center bg-black/40 font-black tracking-widest text-xs'>NO ASSETS DETECTED</div>
                        ) : (
                            rewards?.map((reward: any) => (
                                <RewardManagementRow key={reward._id} reward={reward} />
                            ))
                        )
                    )}
                </div>
            </div>

            {isCreating && (
                <RewardCreationModal onClose={() => setIsCreating(false)} onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['admin-rewards'] }); setIsCreating(false); }}/>
            )}
        </div>
    );
}

function RewardCreationModal({ onClose, onSuccess }: any) {
    const [formData, setFormData] = useState({ title: '', description: '', requiredRank: 'Bronze', requiredRP: 0, rewardType: 'Digital', stock: -1, isAutoUnlocked: true });

    const mutation = useMutation({
        mutationFn: (newReward: any) => api.post('/api/admin/rewards', newReward),
        onSuccess: onSuccess
    });

    return (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4'>
            <GlassCard className='max-w-2xl w-full p-6 md:p-10 border-primary bg-black relative max-h-[90vh] overflow-y-auto no-scrollbar' index={1}>
                <div className='flex justify-between items-start mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-3xl font-black italic tracking-tighter'>CONFIGURING <span className='text-primary'>NEW REWARD</span></h2>
                    <button onClick={onClose} className='text-[#444] hover:text-white transition-colors'>
                        <X size={24} />
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
                    <div className='md:col-span-2'>
                        <label className='text-[8px] md:text-[10px] font-black text-[#444] tracking-widest block mb-2'>ASSET TITLE</label>
                        <input className='w-full bg-black border border-[#1f1f1f] p-3 md:p-4 text-white text-sm focus:border-primary outline-none transition-all' placeholder='e.g., QUANTUM OVERRIDE' onChange={(e) => setFormData({...formData, title: e.target.value})}/>
                    </div>

                    <div className='col-span-1'>
                        <label className='text-[8px] md:text-[10px] font-black text-[#444] tracking-widest block mb-2'>REQUIRED RANK</label>
                        <select className='hover:cursor-pointer w-full bg-black border border-[#1f1f1f] p-3 md:p-4 text-white text-sm focus:border-primary outline-none' onChange={(e) => setFormData({...formData, requiredRank: e.target.value})}>
                            {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crown', 'Ace', 'Conqueror'].map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>

                    <div className='col-span-1'>
                        <label className='text-[8px] md:text-[10px] font-black text-[#444] tracking-widest block mb-2'>RP REQUIREMENT</label>
                        <input type='number' className='w-full bg-black border border-[#1f1f1f] p-3 md:p-4 text-white text-sm focus:border-primary outline-none' onChange={(e) => setFormData({...formData, requiredRP: Number(e.target.value)})}/>
                    </div>

                    <div className='col-span-1'>
                        <label className='text-[8px] md:text-[10px] font-black text-[#444] tracking-widest block mb-2'>CATEGORY</label>
                        <select className='hover:cursor-pointer w-full bg-black border border-[#1f1f1f] p-3 md:p-4 text-white text-sm focus:border-primary outline-none' onChange={(e) => setFormData({...formData, rewardType: e.target.value})}>
                            {['Digital', 'Merch', 'Access', 'Identity', 'Hardware'].map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className='col-span-1 flex items-center gap-3 md:gap-4 py-2'>
                        <input type='checkbox' checked={formData.isAutoUnlocked} onChange={(e) => setFormData({...formData, isAutoUnlocked: e.target.checked})} className='hover:cursor-pointer w-5 h-5 md:w-6 md:h-6 accent-primary'/>
                        <label className='hover:cursor-pointer text-[8px] md:text-[10px] font-black text-[#8C8C8C] tracking-widest'>AUTO-DEPLOY ON ACHIEVE</label>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 mt-8 md:mt-10'>
                    <Button onClick={onClose} variant='outline' className='flex-1 order-2 sm:order-1 border-[#1f1f1f] text-[#444] hover:bg-white/5'>ABORT</Button>
                    <Button disabled={mutation.isPending} onClick={() => mutation.mutate(formData)} className='flex-1 order-1 sm:order-2 bg-primary text-black font-black'>
                        {mutation.isPending ? <Loader2 className='animate-spin mr-2' /> : 'SAVE ASSET'}
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}

function RewardManagementRow({ reward }: any) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (id: string) => api.delete(`/api/admin/rewards/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-rewards'] });
        }
    });

    return (
        <div className='bg-[#0D0D0D] border border-[#1f1f1f] p-4 md:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:border-primary/20 transition-all gap-4'>
            <div className='flex items-center gap-4 md:gap-6'>
                <div className='w-10 h-10 md:w-12 md:h-12 shrink-0 border border-[#1f1f1f] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all'>
                    <Package size={18} />
                </div>
                <div>
                    <h4 className='text-base md:text-xl font-black tracking-tighter italic uppercase truncate max-w-50 sm:max-w-none'>
                        {reward.title}
                    </h4>
                    <p className='text-[8px] md:text-[9px] font-bold text-[#444] tracking-widest md:tracking-[0.2em]'>
                        {reward.rewardType} // RANK: {reward.requiredRank}
                    </p>
                </div>
            </div>
            <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 md:gap-8 border-t sm:border-t-0 border-[#1f1f1f] pt-4 sm:pt-0'>
                <div className='text-left sm:text-right'>
                    <p className='text-[8px] md:text-[9px] font-black text-primary tracking-widest mb-1'>{reward.requiredRP} RP</p>
                    <p className='text-[8px] md:text-[9px] font-bold text-[#444]'>{reward.isAutoUnlocked ? 'AUTO' : 'MANUAL'}</p>
                </div>
                <button onClick={() => {
                        if(window.confirm('ARE YOU SURE YOU WANT TO DECOMMISSION THIS ASSET?')) {
                            deleteMutation.mutate(reward._id);
                        }
                    }}
                    className='hover:cursor-pointer p-2 text-[#444] hover:text-red-500 transition-colors disabled:opacity-50'
                    disabled={deleteMutation.isPending}
                >
                    {deleteMutation.isPending ? <Loader2 size={18} className='animate-spin' /> : <Trash2 size={18} />}
                </button>
            </div>
        </div>
    );
}

function StatMiniCard({ label, value, icon }: any) {
    return (
        <div className='bg-[#0D0D0D] border border-[#1f1f1f] p-6 md:p-8 flex items-center gap-4 md:gap-6'>
            <div className='text-primary opacity-50 shrink-0'>{icon}</div>
            <div>
                <p className='text-[8px] md:text-[10px] font-black text-[#444] tracking-widest'>{label}</p>
                <p className='text-2xl md:text-3xl font-black italic leading-none mt-1'>{value}</p>
            </div>
        </div>
    );
}