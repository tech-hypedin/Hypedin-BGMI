'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { Search, Loader2, ArrowLeft, Coins, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

type Ambassador = {
    _id: string;
    IGN: string;
    UID: string;
    RP: number;
    XP: number;
};

type GetAmbassadorsResponse = {
    success: boolean;
    message: string;
    ambassadors: Ambassador[];
};

type CustomRPResponse = {
    success: boolean;
    message: string;
};

export default function AmbassadorsPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAmbassador, setSelectedAmbassador] = useState<Ambassador | null>(null);

    // PAGINATION STATES
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    const { data: ambassadors, isLoading, isError, error } = useQuery({
        queryKey: ['ambassadors'],
        queryFn: async () => {
            const { data } = await api.get<GetAmbassadorsResponse>('/getAmbassadors');
            if (!data.success) throw new Error(data.message || 'Failed to fetch ambassadors');
            return data.ambassadors;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const filteredAmbassadors = ambassadors?.filter((amb) => {
        const term = searchTerm.toLowerCase();
        return (amb.IGN || '').toLowerCase().includes(term) || (amb.UID || '').toLowerCase().includes(term);
    }) || [];

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // PAGINATION WINDOW LOGIC
    const totalPages = Math.ceil(filteredAmbassadors.length / ITEMS_PER_PAGE);
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = filteredAmbassadors.slice(indexOfFirstItem, indexOfLastItem);

    if (isLoading) return (
        <div className='flex h-screen items-center justify-center bg-[#090907]'>
            <Loader2 className='animate-spin text-primary' size={40} />
        </div>
    );

    if (isError) return (
        <div className='flex h-screen items-center justify-center bg-[#090907]'>
            <p className='text-red-500 font-black uppercase tracking-widest text-sm'>
                {(error as Error)?.message || 'Failed to load ambassadors'}
            </p>
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
                    <h1 className='text-2xl md:text-3xl font-["Teko","Oswald",sans-serif] font-black tracking-tighter uppercase'>Ambassadors</h1>
                    <p className='text-[#8C8C8C] text-xs md:text-sm mt-1'>View ambassador stats and donate custom RP.</p>
                </div>

                <div className='relative w-full sm:w-64'>
                    <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input
                        type='text'
                        placeholder='SEARCH IGN/UID...'
                        className='bg-black border border-[#1f1f1f] pl-10 pr-4 py-2.5 text-xs focus:border-primary outline-none w-full transition-all uppercase font-medium'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* MAIN COMPONENT FRAME */}
            <div className='border border-[#1f1f1f] bg-black overflow-hidden shadow-2xl'>
                {/* DESKTOP MATRIX */}
                <div className='hidden md:block overflow-x-auto'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-[#141411] text-[#444] text-[10px] font-black uppercase tracking-[0.2em] border-b border-[#1f1f1f]'>
                            <tr>
                                <th className='p-5'>IGN</th>
                                <th className='p-5'>UID</th>
                                <th className='p-5'>RP</th>
                                <th className='p-5'>XP</th>
                                <th className='p-5 text-right'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-[#1f1f1f]'>
                            {currentItems.map((amb) => (
                                <tr key={amb._id} className='hover:bg-white/2 transition-colors group'>
                                    <td className='p-5 font-bold uppercase text-sm tracking-tight'>{amb.IGN}</td>
                                    <td className='p-5 font-mono text-xs text-primary'>{amb.UID}</td>
                                    <td className='p-5 text-xs font-bold text-gray-400'>{amb.RP ?? 0}</td>
                                    <td className='p-5 text-xs font-bold text-gray-400'>{amb.XP ?? 0}</td>
                                    <td className='p-5 text-right'>
                                        <button
                                            onClick={() => setSelectedAmbassador(amb)}
                                            className='inline-flex items-center gap-2 px-3 py-2 border border-[#1f1f1f] group-hover:border-primary/50 hover:bg-primary hover:text-black transition-all text-[10px] font-black uppercase tracking-widest cursor-pointer'
                                        >
                                            <Coins size={14} /> Custom RP
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* MOBILE LIST RESPONSIVE */}
                <div className='md:hidden divide-y divide-[#1f1f1f]'>
                    {currentItems.map((amb) => (
                        <div key={amb._id} className='p-5 space-y-4 hover:bg-white/2'>
                            <div className='flex flex-col'>
                                <span className='font-bold uppercase text-sm'>{amb.IGN}</span>
                                <span className='text-[10px] text-primary font-mono'>{amb.UID}</span>
                            </div>

                            <div className='grid grid-cols-2 gap-4 border-t border-[#1f1f1f] pt-4'>
                                <div>
                                    <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>RP</p>
                                    <p className='text-xs font-bold text-gray-400'>{amb.RP ?? 0}</p>
                                </div>
                                <div>
                                    <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>XP</p>
                                    <p className='text-xs font-bold text-gray-400'>{amb.XP ?? 0}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedAmbassador(amb)}
                                className='w-full flex items-center justify-center gap-2 bg-[#111] border border-[#1f1f1f] py-3 text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all cursor-pointer'
                            >
                                <Coins size={14} /> Custom RP
                            </button>
                        </div>
                    ))}
                </div>

                {/* EMPTY RECORD BANNER */}
                {filteredAmbassadors.length === 0 && (
                    <div className='py-20 text-center'>
                        <p className='text-[#444] font-black uppercase tracking-widest text-sm'>
                            No Ambassadors Found // Mission Empty
                        </p>
                    </div>
                )}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className='mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1f1f1f]'>
                    <div className='text-xs md:text-sm font-bold uppercase tracking-widest text-[#444]'>
                        Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredAmbassadors.length)} of {filteredAmbassadors.length} Records // Page {currentPage} of {totalPages}
                    </div>

                    <div className='flex flex-wrap items-center gap-2 w-full sm:w-auto'>
                        <PageButton onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                            <ChevronsLeft size={14} /> First
                        </PageButton>
                        <PageButton onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                            <ChevronLeft size={14} /> Back
                        </PageButton>
                        <PageButton onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next <ChevronRight size={14} />
                        </PageButton>
                        <PageButton onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                            Last <ChevronsRight size={14} />
                        </PageButton>
                    </div>
                </div>
            )}

            {selectedAmbassador && (
                <CustomRPModal ambassador={selectedAmbassador} onClose={() => setSelectedAmbassador(null)} />
            )}
        </div>
    );
}

function PageButton({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className='flex-1 sm:flex-none flex items-center justify-center gap-1 bg-black border border-[#1f1f1f] disabled:opacity-20 disabled:hover:bg-black disabled:hover:text-[#444] px-4 py-2 text-[12px] font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:cursor-not-allowed cursor-pointer'
        >
            {children}
        </button>
    );
}

/* ============================================================
   CUSTOM RP POPUP
   ============================================================ */
function CustomRPModal({ ambassador, onClose }: { ambassador: Ambassador; onClose: () => void }) {
    const queryClient = useQueryClient();
    const [customRP, setCustomRP] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Ref guard blocks double clicks that land before React re-renders the disabled state
    const submittingRef = useRef(false);

    // Close on Escape (but not while a request is in flight)
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !submittingRef.current) onClose();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    // Digits only: rejects letters, spaces, '-', '+', '.', 'e' and pasted text containing them
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setCustomRP(value);
            setErrorMessage('');
        }
    };

    const handleDonate = async () => {
        if (submittingRef.current || !customRP || Number(customRP) <= 0) return;

        submittingRef.current = true;
        setIsSubmitting(true);
        setErrorMessage('');

        try {
            const { data } = await api.put<CustomRPResponse>('/customRP', {
                customRP: Number(customRP),
                ambassadorId: ambassador._id,
            });

            if (data.success) {
                // Refresh the list so the new RP value shows up
                queryClient.invalidateQueries({ queryKey: ['ambassadors'] });
                onClose();
            } else {
                setErrorMessage(data.message || 'Failed to donate RP');
            }
        } catch (err: any) {
            setErrorMessage(err?.response?.data?.message || err?.message || 'Something went wrong');
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const isDisabled = isSubmitting || !customRP || Number(customRP) <= 0;

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4'
            onClick={() => !isSubmitting && onClose()}
        >
            <div
                className='w-full max-w-md border border-[#1f1f1f] bg-[#090907] shadow-2xl font-["Teko","Oswald",sans-serif] text-white'
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className='flex items-center justify-between p-5 border-b border-[#1f1f1f] bg-[#141411]'>
                    <div>
                        <p className='text-[10px] font-black uppercase tracking-[0.2em] text-[#444]'>Custom RP</p>
                        <h2 className='text-xl font-black uppercase tracking-tight'>{ambassador.IGN}</h2>
                        <p className='text-[10px] font-mono text-primary'>UID: {ambassador.UID}</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className='p-2 border border-[#1f1f1f] hover:border-primary hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* BODY */}
                <div className='p-5 space-y-4'>
                    <div className='flex gap-6 text-xs'>
                        <div>
                            <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>Current RP</p>
                            <p className='font-bold text-gray-400'>{ambassador.RP ?? 0}</p>
                        </div>
                        <div>
                            <p className='text-[9px] font-black text-[#444] uppercase tracking-widest mb-1'>Current XP</p>
                            <p className='font-bold text-gray-400'>{ambassador.XP ?? 0}</p>
                        </div>
                    </div>

                    <div>
                        <label htmlFor='customRP' className='block text-[10px] font-black uppercase tracking-widest text-[#8C8C8C] mb-2'>
                            RP Amount
                        </label>
                        <input
                            id='customRP'
                            type='text'
                            inputMode='numeric'
                            pattern='[0-9]*'
                            autoComplete='off'
                            autoFocus
                            placeholder='ENTER RP'
                            value={customRP}
                            onChange={handleChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleDonate()}
                            disabled={isSubmitting}
                            className='bg-black border border-[#1f1f1f] px-4 py-3 text-sm focus:border-primary outline-none w-full transition-all font-mono disabled:opacity-50'
                        />
                    </div>

                    {errorMessage && (
                        <p className='text-[11px] font-bold uppercase tracking-wider text-red-500'>{errorMessage}</p>
                    )}

                    <button
                        onClick={handleDonate}
                        disabled={isDisabled}
                        className='w-full flex items-center justify-center gap-2 bg-primary text-black py-3 text-sm font-black uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer'
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className='animate-spin' /> Donating...
                            </>
                        ) : (
                            'Donate RP'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
