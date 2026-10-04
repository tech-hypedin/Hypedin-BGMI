'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function LeaderboardPage() {
	const { data, isLoading } = useQuery({
    	queryKey: ['leaderboard-national'],
    	queryFn: async () => {
      		const response = await api.get('/api/admin/leaderboard');
      		return response.data;
    	},
    	staleTime: 5 * 60 * 1000,
    	refetchOnWindowFocus: false
  	});

  	if (isLoading) return (
    	<div className='min-h-screen w-full flex flex-col items-center justify-center bg-black p-4'>
    		<div className='w-12 h-12 border-4 border-primary/20 border-t-primary animate-spin mb-4' />
    		<div className='text-primary text-xs font-black tracking-[0.5em] animate-pulse uppercase text-center'>
    	    	Reconnaissance in Progress...
    	  	</div>
    	</div>
  	);

    const leaderboard = data?.leaderboard || [];
	const topThree = leaderboard.slice(0, 3);
	const remaining = leaderboard.slice(3);

  	return (
    	<div className='p-4 sm:p-6 lg:p-8 space-y-8 sm:space-y-12 bg-transparent min-h-screen text-white font-heading uppercase overflow-x-hidden'>
      		<header className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[#1f1f1f] pb-6'>
        		<div>
          			<p className='text-primary text-[8px] sm:text-[10px] font-black tracking-[0.4em] mb-2'>
            			Competing at Elite Capacity
          			</p>
          			<h1 className='text-4xl sm:text-5xl lg:text-6xl font-black italic tracking-tighter leading-none'>
            			THE <span className='text-primary'>LEADERBOARD</span>
          			</h1>
        		</div>
        		<div className='flex items-center gap-2 bg-primary/5 border border-primary/20 px-4 py-2 text-[10px] font-black'>
          			<Search size={14} className='text-primary' />
          			<span className='tracking-widest opacity-50'>Global Ranking Active</span>
        		</div>
      		</header>

      		<div className='grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-end pt-4 sm:pt-10'>
        		<div className='order-2 md:order-1'>
          			<PodiumCard ambassador={topThree[1]} rank={2} color='text-zinc-400' />
        		</div>
        		<div className='order-1 md:order-2'>
          			<PodiumCard ambassador={topThree[0]} rank={1} color='text-primary' isGold />
        		</div>
        		<div className='order-3 md:order-3'>
          			<PodiumCard ambassador={topThree[2]} rank={3} color='text-orange-700' />
        		</div>
      		</div>

      		<div className='bg-[#0D0D0D] border border-[#1f1f1f] flex flex-col'>
        		<div className='overflow-x-auto no-scrollbar'>
          			<table className='w-full text-left border-collapse min-w-150'>
            			<thead className='bg-black/50 text-[#444] text-[10px] font-black tracking-widest border-b border-[#1f1f1f]'>
              				<tr>
                				<th className='p-4 sm:p-6'>SERIAL</th>
                				<th className='p-4 sm:p-6'>OPERATIVE</th>
                				<th className='p-4 sm:p-6'>SECTOR</th>
                				<th className='p-4 sm:p-6'>REPUTATION</th>
                				<th className='p-4 sm:p-6 text-right'>STABILITY</th>
              				</tr>
            			</thead>
            			<tbody className='divide-y divide-[#1f1f1f]'>
              				{remaining.map((amb: any) => (
              					<RankRow key={amb._id} amb={amb} />
              				))}
            			</tbody>
          			</table>
        		</div>
      		</div>
    	</div>
  	);
}

function PodiumCard({ ambassador, rank, color, isGold }: any) {
	if (!ambassador) return null;
	return (
    	<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`relative p-6 sm:p-8 bg-[#0D0D0D] border-2 ${isGold ? 'border-primary/40 h-auto md:h-112.5' : 'border-[#1f1f1f] h-auto md:h-95'} flex flex-col items-center justify-center text-center`}>
      		<div className='absolute top-4 left-4 font-black italic text-3xl sm:text-4xl opacity-10'>#{rank}</div>
      		<Trophy className={`${color} mb-4 sm:mb-6 shrink-0`} size={isGold ? 64 : 48} />
      		<h3 className='text-xl sm:text-2xl font-black tracking-tighter mb-1 italic uppercase leading-tight truncate w-full'>
        		{ambassador.IGN}
      		</h3>
      		<p className='text-[8px] sm:text-[10px] text-[#444] font-bold tracking-widest mb-6 uppercase'>
        		{ambassador.collegeName}
      		</p>
      
      		<div className='flex flex-col items-center gap-2 w-full'>
        		<div className='flex items-center justify-center gap-2 bg-primary/5 border border-primary/20 w-full py-3'>
          			<Star className='text-primary fill-primary' size={14} />
          			<span className='text-xl sm:text-2xl font-black italic'>{ambassador.RP.toLocaleString()}</span>
        		</div>
        		<div className='flex items-center gap-2 text-[8px] sm:text-[10px] font-black text-primary/60 mt-2'>
           			<Shield size={10} />
           			<span>TIER: {ambassador.rank}</span>
        		</div>
      		</div>
    	</motion.div>
  	);
}

function RankRow({ amb }: any) {
  	return (
    	<tr className='hover:bg-white/5 transition-colors group'>
      		<td className='p-4 sm:p-6 text-xl sm:text-2xl font-black italic text-primary opacity-50 group-hover:opacity-100'>
        		{amb.rpLeaderBoardRank?.toString().padStart(2, '0') || '--'}
      		</td>
      		<td className='p-4 sm:p-6 font-black tracking-tighter text-lg sm:text-xl italic uppercase whitespace-nowrap'>
        		{amb.IGN}
      		</td>
      		<td className='p-4 sm:p-6 text-[9px] sm:text-[10px] font-bold text-[#444] tracking-widest uppercase truncate max-w-37.5'>
        		{amb.collegeName}
      		</td>
      		<td className='p-4 sm:p-6'>
        		<div className='flex items-center gap-2'>
          			<Star size={12} className='text-primary fill-primary shrink-0' />
          			<span className='font-black text-base sm:text-lg'>{amb.RP.toLocaleString()}</span>
        		</div>
      		</td>
      		<td className='p-4 sm:p-6 text-right'>
        		<div className='inline-block border border-primary/30 px-2 sm:px-3 py-1 text-[8px] sm:text-[9px] font-black text-primary/70 bg-primary/5 uppercase whitespace-nowrap'>
           			{amb.rank} TIER
        		</div>
      		</td>
    	</tr>
  	);
}