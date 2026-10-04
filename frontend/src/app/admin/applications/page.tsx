'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Search, Eye, Loader2, ArrowLeft, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApplicationModal } from '@/components/admin/ApplicationModal';

export default function ApplicationsPage() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const router = useRouter();

    // PAGINATION STATES
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data: applications, isLoading } = useQuery({
        queryKey: ['applications'],
        queryFn: async () => {
            const { data } = await api.get('/api/applications');
            return data.applications;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const filteredApps = applications?.filter((app: any) => {
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || (app.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    // Reset pagination window when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter]);

    // PAGINATION WINDOW LOGIC
    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) return (
        <div className='flex h-screen items-center justify-center bg-[#090907]'>
            <Loader2 className='animate-spin text-primary' size={40} />
        </div>
    );

    return (
        <div className='p-4 md:p-8 bg-transparent min-h-screen text-white font-["Teko","Oswald",sans-serif]'>
            <button onClick={() => router.replace('/admin')} className='flex items-center gap-2 text-[#444] hover:text-primary transition-colors mb-6 group'>
                <ArrowLeft size={18} className='group-hover:-translate-x-1 transition-transform' />
                <span className='text-[10px] font-black uppercase tracking-widest'>Abort / Back to Briefing</span>
            </button>

            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6'>
                <div>
                    {/* Removed 'italic' class here */}
                    <h1 className='text-2xl md:text-3xl font-["Teko","Oswald",sans-serif] font-black tracking-tighter uppercase'>Operative Applications</h1>
                    <p className='text-[#8C8C8C] text-xs md:text-sm mt-1'>Review and manage incoming partner requests.</p>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                    <div className='relative flex-1 sm:w-64'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                        <input type='text' placeholder='SEARCH NAME/EMAIL...' className='bg-black border border-[#1f1f1f] pl-10 pr-4 py-2.5 text-xs focus:border-primary outline-none w-full transition-all uppercase font-medium' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                    </div>
                    <div className='relative flex-1 sm:w-48'>
                        <Filter className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={14} />
                        <select className='bg-black border border-[#1f1f1f] pl-9 pr-4 py-2.5 text-xs focus:border-primary outline-none w-full appearance-none transition-all cursor-pointer font-black uppercase tracking-wider' value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value='All'>ALL STATUS</option>
                            <option value='Pending Review'>PENDING</option>
                            <option value='Accepted'>ACCEPTED</option>
                            <option value='Rejected'>REJECTED</option>
                            <option value='Back Out'>BACK OUT</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* MAIN COMPONENT FRAME */}
            <div className='border border-[#1f1f1f] bg-black overflow-hidden shadow-2xl'>
                {/* DESKTOP MATRIX */}
                <div className='hidden md:block overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-[#141411] text-[#444] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#1f1f1f]'>
                            <tr>
                                <th className='p-5'>Applicant</th>
                                <th className='p-5'>Platform</th>
                                <th className='p-5'>Rank</th>
                                <th className='p-5'>Status</th>
                                <th className='p-5 text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#1f1f1f]'>
                            {currentItems.map((app: any) => (
                                <tr key={app._id} className='hover:bg-white/2 transition-colors group'>
                                    <td className='p-5'>
                                        <div className='flex flex-col'>
                                            <span className='font-bold uppercase text-sm tracking-tight'>{app.name}</span>
                                            <span className='text-[10px] text-[#444] font-mono'>{app.email}</span>
                                        </div>
                                    </td>
                                    <td className='p-5 font-mono text-xs text-primary'>{app.platform}</td>
                                    <td className='p-5 text-xs font-bold text-gray-400'>{app.accountRank}</td>
                                    <td className='p-5'>
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className='p-5 text-right'>
                                        <button onClick={() => setSelectedApp(app)} className='p-2 hover:bg-primary hover:text-black transition-all border border-[#1f1f1f] group-hover:border-primary/50 cursor-pointer'>
                                            <Eye size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE LIST RESPONSIVE */}
                <div className='md:hidden divide-y divide-[#1f1f1f]'>
                    {currentItems.map((app: any) => (
                        <div key={app._id} className='p-5 space-y-4 hover:bg-white/2'>
                            <div className='flex justify-between items-start'>
                                <div className='flex flex-col'>
                                    <span className='font-bold uppercase text-sm'>{app.name}</span>
                                    <span className='text-[10px] text-[#444] font-mono'>{app.email}</span>
                                </div>
                                <StatusBadge status={app.status} />
                            </div>

                            <div className='grid grid-cols-2 gap-4 border-t border-[#1f1f1f] pt-4'>
                                <div>
                                    <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>Platform</p>
                                    <p className='text-xs text-primary font-mono uppercase'>{app.platform}</p>
                                </div>
                                <div>
                                    <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>Rank</p>
                                    <p className='text-xs font-bold text-gray-400'>{app.accountRank}</p>
                                </div>
                            </div>

                            <button onClick={() => setSelectedApp(app)} className='w-full flex items-center justify-center gap-2 bg-[#111] border border-[#1f1f1f] py-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all cursor-pointer'>
                                <Eye size={14} /> Open Dossier
                            </button>
                        </div>
                    ))}
                </div>

                {/* EMPTY RECORD BANNER */}
                {filteredApps.length === 0 && (
                    <div className='py-20 text-center'>
                        {/* Removed 'italic' class here */}
                        <p className='text-[#444] font-black uppercase tracking-widest text-sm'>
                            No Operatives Found // Mission Empty
                        </p>
                    </div>
                )}
            </div>

            {/* SYSTEM PAGINATION CONTROLLER MATRIX */}
            {totalPages > 1 && (
                <div className='mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1f1f1f]'>
                    <div className='text-xs md:text-sm font-bold uppercase tracking-widest text-[#444]'>
                        Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredApps.length)} of {filteredApps.length} Records // Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className='flex flex-wrap items-center gap-2 w-full sm:w-auto font-["Teko",_"Oswald",_sans-serif]'>
                        {/* FIRST PAGE */}
                        <button 
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-black border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-[#444] px-3 py-2 text-[12px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronsLeft size={14} /> First
                        </button>

                        {/* PREVIOUS PAGE */}
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-black border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-[#444] px-4 py-2 text-[12px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:cursor-not-allowed cursor-pointer'
                        >
                            <ChevronLeft size={14} /> Back
                        </button>

                        {/* NEXT PAGE */}
                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-black border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-[#444] px-4 py-2 text-[12px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:cursor-not-allowed cursor-pointer'
                        >
                            Next <ChevronRight size={14} />
                        </button>

                        {/* LAST PAGE */}
                        <button 
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-black border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-[#444] px-3 py-2 text-[12px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:cursor-not-allowed cursor-pointer'
                        >
                            Last <ChevronsRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {selectedApp && (
                <ApplicationModal application={selectedApp} onClose={() => setSelectedApp(null)}/>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    return (
        <span className={cn( 'px-2 py-1 text-[9px] font-black uppercase border inline-block',
            status === 'Accepted' ? 'border-green-500/50 text-green-500 bg-green-500/5' :
            status === 'Rejected' ? 'border-red-500/50 text-red-500 bg-red-500/5' :
            'border-yellow-500/50 text-yellow-500 bg-yellow-500/5'
        )}>
            {status}
        </span>
    );
}