'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { X, Check, Trash2, ShieldCheck, Trophy, CheckSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplicationModalProps {
    application: {
        _id: string,
        name: string,
        email: string,
        phoneNo: number | undefined,
        college: string,
        course: string,
        currentYear: '1st Year' | '2nd Year' | '3rd Year' | '',
        groups?: string,
        hasAccessTo?: string[],
        accountRank: string,
        hasTime: boolean | undefined,
        tournamentExp: boolean | undefined,
        hasExperience: boolean,
        experienceDetails: string,
        convert: string,
        newPlayers: string,
        campusPopularity?: string,
        reasoning: string,
        status: 'Pending Review' | 'Rejected' | 'Accepted',
    },
    onClose: () => void
}

export function ReferalModal({ application, onClose }: ApplicationModalProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (payload: { status: 'Accepted' | 'Rejected' }) => {
            const { data } = await api.patch(`/api/applications/referals/${application._id}`, payload);
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['referals'] });
            const newStatus = data.application?.status || 'UPDATED';
            toast.success(`SECTOR UPDATED: ${newStatus.toUpperCase()}`);
            onClose();
        },
        onError: (err: any) => toast.error(err?.response?.data?.message || 'COMMS ERROR: UPDATE FAILED')
    });

    return (
        <AnimatePresence>
            <div className='fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md'>
                <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className='bg-[#0D0D0D] border border-[#1f1f1f] w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]'>
                    {/* Header */}
                    <div className='p-3 sm:p-4 border-b border-[#1f1f1f] flex justify-between items-center bg-[#141411] shrink-0'>
                        <div className='flex items-center gap-3'>
                            <div className='h-6 sm:h-8 w-0.5 bg-primary' />
                            <div>
                                <h2 className='text-lg sm:text-xl font-black uppercase italic tracking-tighter'>Operative Dossier</h2>
                                <p className='text-[9px] text-[#444] font-black tracking-widest uppercase truncate max-w-37.5 sm:max-w-none'>
                                    ID // {application._id}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className='text-[#444] hover:text-white transition-colors p-1'>
                            <X size={20} />
                        </button>
                    </div>

                    {/* Main Content - Tightened Grid & Reduced Typography */}
                    <div className='p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto custom-scrollbar flex-1'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4'>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Real Name</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-200 truncate'>{application.name}</p>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Combat Rank</p>
                                <div className='flex items-center gap-1.5 text-yellow-500'>
                                    <Trophy size={14} />
                                    <p className='text-xs sm:text-sm font-black uppercase italic'>{application.accountRank}</p>
                                </div>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Contact Email</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-300 truncate'>{application.email}</p>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Phone Number</p>
                                <p className='text-xs sm:text-sm font-mono font-bold text-gray-300'>{application.phoneNo || 'N/A'}</p>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>College / University</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-200 truncate'>{application.college}</p>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Course / Degree</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-200 truncate'>{application.course}</p>
                            </div>
                            <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Current Year</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-300'>{application.currentYear || 'N/A'}</p>
                            </div>
                            {/* <div className='space-y-0.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>3 Listed Groups</p>
                                <p className='text-xs sm:text-sm font-bold text-gray-300'>{application.groups || 'N/A'}</p>
                            </div> */}
                        </div>

                        {/* Access Blocks & Experience with Smaller Inner Boxes */}
                        {/* <div className='flex flex-col gap-3'>
                            <div className='p-3 bg-black border border-[#1f1f1f] space-y-1.5'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-widest'>Access Groups</p>
                                <div className='space-y-0.5'>
                                    {application.hasAccessTo?.length ? (
                                        application.hasAccessTo.map((access) => (
                                            <p key={access} className='text-xs font-bold text-gray-300'>• {access}</p>
                                        ))
                                    ) : (
                                        <p className='text-xs font-bold text-gray-400'>No access selected</p>
                                    )}
                                </div>
                            </div>
                        </div> */}

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='p-3 bg-black border border-[#1f1f1f] space-y-1'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-widest'>Active Participation</p>
                                <p className='text-xs font-bold text-gray-300'>{application.hasTime ? 'Yes' : 'No'}</p>
                            </div>
                            <div className='p-3 bg-black border border-[#1f1f1f] space-y-1'>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-widest'>Tournament Experience</p>
                                <p className='text-xs font-bold text-gray-300'>{application.tournamentExp ? 'Yes' : 'No'}</p>
                            </div>
                        </div>

                        {/* Answers text size dropped to text-xs */}
                        <div className='space-y-2'>
                            <div className='flex items-center gap-1.5'>
                                <CheckSquare size={12} className='text-primary'/>
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Previous Experience</p>
                            </div>
                            <div className='relative pl-3'>
                                <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-[#1f1f1f]' />
                                <p className='text-xs leading-relaxed text-gray-400 italic'>
                                    "{application.hasExperience ? 'Has Previous Experience' : 'Does Not Have Previous Experience'}"
                                </p>
                                {application.hasExperience && (
                                    <p className='text-xs leading-relaxed text-gray-400 italic mt-1'>
                                        "{application.experienceDetails}"
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center gap-1.5'>
                                <ShieldCheck size={12} className='text-primary' />
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Player Conversion Ability</p>
                            </div>
                            <div className='relative pl-3'>
                                <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-[#1f1f1f]' />
                                <p className='text-xs leading-relaxed text-gray-400 italic'>
                                    "{application.convert}"
                                </p>
                            </div>
                        </div>

                        {/* <div className='space-y-2'>
                            <div className='flex items-center gap-1.5'>
                                <ShieldCheck size={12} className='text-primary' />
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>New Players Onboarding Plan</p>
                            </div>
                            <div className='relative pl-3'>
                                <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-[#1f1f1f]' />
                                <p className='text-xs leading-relaxed text-gray-400 italic'>
                                    "{application.newPlayers}"
                                </p>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <div className='flex items-center gap-1.5'>
                                <ShieldCheck size={12} className='text-primary' />
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Campus Popularity & Influence</p>
                            </div>
                            <div className='relative pl-3'>
                                <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-[#1f1f1f]' />
                                <p className='text-xs leading-relaxed text-gray-400 italic'>
                                    "{application.campusPopularity}"
                                </p>
                            </div>
                        </div> */}

                        <div className='space-y-2'>
                            <div className='flex items-center gap-1.5'>
                                <ShieldCheck size={12} className='text-primary' />
                                <p className='text-[9px] font-black text-[#444] uppercase tracking-[0.2em]'>Mission Statement</p>
                            </div>
                            <div className='relative pl-3'>
                                <div className='absolute left-0 top-0 bottom-0 w-0.5 bg-[#1f1f1f]' />
                                <p className='text-xs leading-relaxed text-gray-400 italic'>
                                    "{application.reasoning}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer Controls - Streamlined instant submissions */}
                    <div className='p-3 sm:p-4 border-t border-[#1f1f1f] bg-[#141411] shrink-0'>
                        {application.status === 'Pending Review' ? (
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <button onClick={() => mutation.mutate({ status: 'Accepted' })} disabled={mutation.isPending} className='flex-1 bg-white hover:bg-primary text-black font-black py-3 px-4 flex items-center justify-center gap-2 transition-all uppercase text-xs disabled:opacity-50 order-1 sm:order-2 shadow-xs'>
                                    {mutation.isPending ? 'PROCESSING...' : <><Check size={16} /> Authorize Enlistment</>}
                                </button>
                                <button onClick={() => mutation.mutate({ status: 'Rejected' })} disabled={mutation.isPending} className='flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black py-3 px-4 flex items-center justify-center gap-2 transition-all uppercase text-xs disabled:opacity-50 order-2 sm:order-1'>
                                    <Trash2 size={16} /> Deny Entry
                                </button>
                            </div>
                        ) : (
                            <div className='w-full py-3 text-center border border-[#1f1f1f] bg-black/40'>
                                <p className='text-[9px] font-black uppercase tracking-[0.4em] text-[#444]'>
                                    Record Finalized // Status: 
                                    <span className={application.status === 'Accepted' ? 'text-green-500' : 'text-red-500'}>
                                        {' '}{application.status.toUpperCase()}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}