'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Users, UserPlus, Terminal, ShieldAlert, ChevronRight, Activity, ChevronLeft, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface IApplication {
    _id: string;
    name: string;
    email: string;
    platform: 'Youtube' | 'Rooter' | 'Instagram' | 'Discord';
    accountRank: string;
    platformUrl: string;
    reasoning: string;
    status: 'Pending Review' | 'Rejected' | 'Accepted';
}

export default function AdminDashboard() {
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data, isLoading, isError } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const response = await api.get('/api/applications');
            return (response.data.applications || response.data) as IApplication[];
        }
    });

    const pendingRecruits = data?.filter(app => app.status === 'Pending Review') || [];
    const totalAccepted = data?.filter(app => app.status === 'Accepted').length || 0;

    // PAGINATION CALCULATIONS
    const totalPages = Math.ceil(pendingRecruits.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = pendingRecruits.slice(indexOfFirstItem, indexOfLastItem);

    if (isError) return (
        <div className='flex flex-col items-center justify-center h-screen bg-black text-[#ffb60e] font-black p-4 text-center font-["Teko","Oswald",sans-serif]'>
            <ShieldAlert size={48} />
            <p className='mt-4 tracking-widest uppercase text-sm md:text-base font-["Teko","Oswald",sans-serif]'>CONNECTION INTERRUPTED // DATA LINK SEVERED</p>
        </div>
    );

    return (
        <div className='p-4 md:p-8 bg-transparent min-h-screen text-white font-["Teko","Oswald",sans-serif]'>
            <div className='mb-8 md:mb-12 border-b border-[#1f1f1f] pb-6 md:pb-8 font-["Teko","Oswald",sans-serif]'>
                <h1 className='text-3xl md:text-5xl font-black tracking-tighter flex items-center gap-3 md:gap-4 uppercase font-["Teko","Oswald",sans-serif]'>
                    Admin <span className='text-[#ffb60e] animate-pulse'>Override</span>
                </h1>
                <div className='flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[#444] text-[12px] md:text-[14px] font-black uppercase tracking-[0.2em] font-["Teko","Oswald",sans-serif]'>
                    <span className='flex items-center gap-1'><Terminal size={12} /> Root Access</span>
                    <span className='hidden sm:inline'>//</span>
                    <span className='flex items-center gap-1'><Activity size={12} /> Sync: Active</span>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12 font-["Teko","Oswald",sans-serif]'>
                <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-6 md:p-8 flex items-center gap-4 md:gap-6 group hover:border-primary transition-all font-["Teko","Oswald",sans-serif]'>
                    <div className='bg-primary/10 p-3 md:p-4 border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all'>
                        <Users size={24} className='md:w-8 md:h-8' />
                    </div>
                    <div>
                        <p className='text-[13px] md:text-[15px] font-black uppercase text-[#444] tracking-widest mb-1 font-["Teko","Oswald",sans-serif]'>Active Ambassadors</p>
                        <p className='text-3xl md:text-4xl font-black font-["Teko","Oswald",sans-serif]'>{totalAccepted}</p>
                    </div>
                </div>

                <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-6 md:p-8 flex items-center gap-4 md:gap-6 group hover:border-[#ffb60e] transition-all font-["Teko","Oswald",sans-serif]'>
                    <div className='bg-[#ffb60e]/10 p-3 md:p-4 border border-[#ffb60e]/20 group-hover:bg-[#ffb60e] group-hover:text-white transition-all'>
                        <UserPlus size={24} className='md:w-8 md:h-8' />
                    </div>
                    <div>
                        <p className='text-[13px] md:text-[15px] font-black uppercase text-[#444] tracking-widest mb-1 font-["Teko","Oswald",sans-serif]'>Incoming Requests</p>
                        <p className='text-3xl md:text-4xl font-black font-["Teko","Oswald",sans-serif]'>{pendingRecruits.length}</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6'>
                <h2 className='text-xl md:text-2xl font-black uppercase tracking-tighter flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                    <div className='w-1.5 h-5 md:w-2 md:h-6 bg-[#ffb60e]' />
                    Pending Recruits
                </h2>
                
                {!isLoading && pendingRecruits.length > 0 && (
                    <span className='text-sm font-bold uppercase tracking-wider text-[#444]'>
                        Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, pendingRecruits.length)} of {pendingRecruits.length} Sector Records
                    </span>
                )}
            </div>

            <div className='space-y-4 font-["Teko","Oswald",sans-serif]'>
                {isLoading ? (
                    [1, 2, 3].map((n) => (
                        <div key={n} className='h-24 w-full bg-[#0c0c0c] border border-[#1f1f1f] animate-pulse' />
                    ))
                ) : currentItems.length === 0 ? (
                    <div className='text-[#333] font-black uppercase py-16 md:py-20 text-center border-2 border-dashed border-[#111] text-sm md:text-lg px-4 font-["Teko","Oswald",sans-serif]'>
                        Clear Skies // No Pending Missions
                    </div>
                ) : (
                    <>
                        {currentItems.map((app, index) => {
                            const templateIndex = indexOfFirstItem + index + 1;
                            
                            return (
                                <div key={app._id} className='bg-[#0c0c0c] border border-[#1f1f1f] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#111] transition-all font-["Teko","Oswald",sans-serif]'>
                                    <div className='flex items-center gap-4 md:gap-8 font-["Teko","Oswald",sans-serif]'>
                                        <span className='hidden sm:block text-2xl md:text-3xl font-black text-[#1f1f1f] group-hover:text-[#ffb60e] transition-colors font-["Teko","Oswald",sans-serif]'>
                                            {templateIndex.toString().padStart(2, '0')}
                                        </span>
                                        <div className='flex-1 font-["Teko","Oswald",sans-serif]'>
                                            <h3 className='text-lg md:text-xl font-black uppercase tracking-tight truncate max-w-50 sm:max-w-none font-["Teko","Oswald",sans-serif]'>
                                                {app.name}
                                            </h3>
                                            <div className='flex flex-wrap items-center gap-2 md:gap-3 mt-1 font-["Teko","Oswald",sans-serif]'>
                                                <span className='text-[13px] md:text-[15px] font-bold text-[#444] uppercase tracking-widest font-["Teko","Oswald",sans-serif]'>
                                                    Rank: <span className='text-white font-["Teko","Oswald",sans-serif]'>{app.accountRank}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                      
                                    <div className='flex items-center gap-2 md:gap-3 w-full md:w-auto font-["Teko","Oswald",sans-serif]'>
                                        <button onClick={() => window.location.href = `/admin/applications`} className='hover:cursor-pointer flex-3 md:flex-none flex items-center justify-center gap-2 bg-[#161616] border border-[#1f1f1f] px-5 md:px-7 py-2.5 text-[13px] md:text-[15px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all font-["Teko","Oswald",sans-serif]'>
                                            View Info <ChevronRight size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* EXPANDED TERMINAL PAGINATION CONTROLS */}
                        {totalPages > 1 && (
                            <div className='pt-6 border-t border-[#111] flex flex-col sm:flex-row items-center justify-between gap-4 font-["Teko","Oswald",sans-serif]'>
                                <div className='text-xs md:text-sm font-bold uppercase tracking-widest text-[#444]'>
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className='flex flex-wrap items-center gap-2 w-full sm:w-auto'>
                                    {/* FIRST PAGE BUTTON */}
                                    <button 
                                        onClick={() => setCurrentPage(1)}
                                        disabled={currentPage === 1}
                                        className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-[#0c0c0c] border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-[#0c0c0c] disabled:hover:text-[#444] px-3 py-2 text-[13px] font-black uppercase tracking-wider hover:bg-[#ffb60e] hover:text-white transition-all disabled:cursor-not-allowed'
                                        title='First Page'
                                    >
                                        <ChevronsLeft size={16} /> First
                                    </button>

                                    {/* PREVIOUS PAGE BUTTON */}
                                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-[#0c0c0c] border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-[#0c0c0c] disabled:hover:text-[#444] px-4 py-2 text-[13px] font-black uppercase tracking-wider hover:bg-[#ffb60e] hover:text-white transition-all disabled:cursor-not-allowed'>
                                        <ChevronLeft size={16} /> Back
                                    </button>

                                    {/* NEXT PAGE BUTTON */}
                                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-[#0c0c0c] border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-[#0c0c0c] disabled:hover:text-[#444] px-4 py-2 text-[13px] font-black uppercase tracking-wider hover:bg-[#ffb60e] hover:text-white transition-all disabled:cursor-not-allowed'>
                                        Next <ChevronRight size={16} />
                                    </button>

                                    {/* LAST PAGE BUTTON */}
                                    <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-[#0c0c0c] border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-[#0c0c0c] disabled:hover:text-[#444] px-3 py-2 text-[13px] font-black uppercase tracking-wider hover:bg-[#ffb60e] hover:text-white transition-all disabled:cursor-not-allowed' title='Last Page'>
                                        Last <ChevronsRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}