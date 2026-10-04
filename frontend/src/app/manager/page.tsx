'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { ClipboardList, Clock, CheckCircle2, AlertCircle, MoreVertical, X, ExternalLink, Check, Ban, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

type TaskStatus = 'Upcoming' | 'In Progress' | 'In Review' | 'Completed';

export default function AdminTasksPage() {
    const [activeTab, setActiveTab] = useState<TaskStatus>('In Progress');
    const [selectedTaskForReview, setSelectedTaskForReview] = useState<any | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [viewingTask, setViewingTask] = useState<any | null>(null);
    
    const queryClient = useQueryClient();
    const router = useRouter();

    const { data: tasks, isLoading } = useQuery({
        queryKey: ['admin-tasks', activeTab],
        queryFn: async () => {
            const { data } = await api.get(`/api/manager?tab=${activeTab}`);
            return data.tasks;
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false
    });

    const deleteMutation = useMutation({
        mutationFn: (taskId: string) => api.delete(`/api/admin/task/${taskId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
            toast.success('MISSION DECOMMISSIONED');
            setOpenMenuId(null);
        }
    });

    return (
        <div className='p-4 md:p-8 bg-[#090907] min-h-screen text-white'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-10 gap-4'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-black tracking-tighter uppercase italic'>Mission Control / Tasks</h1>
                    <p className='text-[#8C8C8C] text-xs md:text-sm'>Deploy and monitor operational objectives for ambassadors.</p>
                </div>
            </div>

            <div className='flex border-b border-[#1f1f1f] mb-8 overflow-x-auto no-scrollbar scroll-smooth'>
                {[
                    { label: 'Upcoming', icon: Clock },
                    { label: 'In Progress', icon: ClipboardList },
                    { label: 'In Review', icon: AlertCircle },
                    { label: 'Completed', icon: CheckCircle2 },
                ].map((tab) => (
                    <button key={tab.label} onClick={() => setActiveTab(tab.label as TaskStatus)} className={cn( ' hover:cursor-pointer flex items-center gap-2 px-6 md:px-8 py-4 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative shrink-0', activeTab === tab.label ? 'text-primary border-b-2 border-primary bg-white/5' : 'text-[#8C8C8C] hover:text-white' )}>
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
                {isLoading ? (
                    <div className='col-span-full py-20 text-center animate-pulse text-[#444] font-black uppercase tracking-widest'>Scanning Data Grid...</div>
                ) : tasks?.map((task: any) => (
                    <div key={task._id} className='bg-black border border-[#1f1f1f] p-5 md:p-6 hover:border-primary/50 transition-all group relative'>
                        <div className='flex justify-between items-start mb-4'>
                            <span className='text-[10px] font-black bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 uppercase'>
                                {task.category ? task.category : task.status}
                            </span>
                            <div className='relative'>
                                <button onClick={() => setOpenMenuId(openMenuId === task._id ? null : task._id)} className='hover:cursor-pointer text-[#8C8C8C] hover:text-white transition-colors p-1'>
                                    <MoreVertical size={18} />
                                </button>
                                
                                {openMenuId === task._id && (
                                    <div className='absolute right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#1f1f1f] z-30 shadow-2xl'>
                                        <button onClick={() => {
                                                    if(confirm('TERMINATE THIS OBJECTIVE?')) deleteMutation.mutate(task._id);
                                                }}
                                                className='w-full text-left px-4 py-3 text-[10px] font-black uppercase hover:bg-red-500/10 text-red-500 transition-colors flex items-center gap-2'
                                            >
                                                Delete Mission
                                            </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h3 className='text-lg md:text-xl font-black uppercase italic mb-2 tracking-tight truncate'>
                            {task.title ? task.title : task.ambassadorId?.IGN || 'UNKNOWN'}
                        </h3>
                        <p className='text-[#8C8C8C] text-xs md:text-sm line-clamp-2 mb-6 h-10'>
                            {task.description ? task.description : task.taskId?.title}
                        </p>

                        <div className='flex items-center justify-between pt-6 border-t border-[#1f1f1f]'>
                            <div className='flex flex-col'>
                                <span className='text-[10px] text-[#444] font-black uppercase tracking-tighter'>Reward</span>
                                <span className='text-primary font-bold text-sm md:text-base'>+{task.rpReward || task.taskId?.rpReward} RP</span>
                            </div>
                        </div>

                        <div className='mt-6'>
                            {activeTab === 'In Review' ? (
                                <button onClick={() => setSelectedTaskForReview(task)} className='hover:cursor-pointer w-full bg-white text-black py-3 text-[10px] font-black uppercase hover:bg-primary transition-colors'>
                                    Review Submissions
                                </button>
                            ) : (
                                activeTab === 'Completed' ? (
                                    <></>
                                ) : (
                                    <button onClick={() => setViewingTask(task)} className='hover:cursor-pointer w-full border border-[#1f1f1f] py-3 text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all'>
                                        View Details
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {selectedTaskForReview && <ReviewModal task={selectedTaskForReview} onClose={() => setSelectedTaskForReview(null)} />}
            {viewingTask && <DetailsModal task={viewingTask} onClose={() => setViewingTask(null)} />}
        </div>
    );
}

function ReviewModal({ task, onClose }: { task: any, onClose: () => void }) {
    const queryClient = useQueryClient();

    const { data: submission, isLoading } = useQuery({
        queryKey: ['submission', task._id],
        queryFn: async () => {
            const { data } = await api.get(`/api/admin/submissions/${task._id}`);
            return data.submission;
        },
    });

    const reviewMutation = useMutation({
        mutationFn: async ({ subId, status }: { subId: string, status: 'Approved' | 'Rejected' }) => {
            return api.post(`/api/admin/submissions`, { status, subId });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['submission', task._id] });
            queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
            toast.success('Sector Updated: Dossier Finalized');
        }
    });

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 md:p-4'>
            <div className='bg-[#0c0c0c] border border-primary/30 w-full max-w-4xl max-h-[95vh] md:max-h-[80vh] flex flex-col relative overflow-hidden'>
                <div className='p-4 md:p-6 border-b border-[#1f1f1f] flex justify-between items-center bg-[#111] shrink-0'>
                    <div className='max-w-[80%]'>
                        <h2 className='text-lg md:text-2xl font-black italic uppercase text-primary tracking-tighter truncate'>Review: {task.taskId.title}</h2>
                        <p className='text-[9px] md:text-xs text-[#8C8C8C] uppercase font-bold tracking-widest mt-1'>Status: {task.status}</p>
                    </div>
                    <button onClick={onClose} className='text-[#444] hover:text-white transition-colors p-1'><X size={24} /></button>
                </div>

                <div className='flex-1 overflow-y-auto p-4 md:p-6 space-y-4 no-scrollbar'>
                    {isLoading ? (
                        <div className='text-center py-10 uppercase font-black text-[#444] animate-pulse'>Syncing...</div>
                    ) : (
                        <div className='bg-black border border-[#1f1f1f] p-4 flex flex-col lg:flex-row justify-between lg:items-center gap-4 hover:border-primary/20 transition-all'>
                            <div className='flex flex-col gap-1'>
                                <span className='text-white font-black uppercase italic text-sm'>{submission?.ambassadorId?.IGN || 'Unknown Operative'}</span>
                                <span className='text-[10px] text-[#444] uppercase font-bold tracking-tighter truncate'>ID: {submission?.ambassadorId?._id || submission?.ambassadorId}</span>
                            </div>

                            <div className='flex flex-col sm:flex-row gap-3 w-full lg:w-auto'>
                                {submission?.proofUrls.map((s: string) => (
                                    <a key={s} href={s} target='_blank' rel='noreferrer' className='flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-blue-500 border border-blue-500/20 px-4 py-2 bg-blue-500/5 hover:bg-blue-500 hover:text-white transition-all'>
                                        Analyze Proof <ExternalLink size={14} />
                                    </a>
                                ))}
                                <div className='flex gap-2 flex-1 sm:flex-none'>
                                    <Button disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ subId: submission?._id, status: 'Approved' })} className='flex-1 bg-green-600/10 text-green-500 border border-green-600/20 px-4 py-2 text-[10px] font-black uppercase hover:bg-green-600 hover:text-white transition-all h-auto'>
                                        <Check size={14} className='mr-1 md:mr-2' /> Approve
                                    </Button>
                                    <Button disabled={reviewMutation.isPending} onClick={() => reviewMutation.mutate({ subId: submission?._id, status: 'Rejected' })} className='flex-1 bg-red-600/10 text-red-500 border border-red-600/20 px-4 py-2 text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all h-auto'>
                                        <Ban size={14} className='mr-1 md:mr-2' /> Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function DetailsModal({ task, onClose }: { task: any, onClose: () => void }) {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-2 md:p-4'>
            <div className='bg-[#0c0c0c] border border-[#1f1f1f] w-full max-w-2xl p-6 md:p-10 relative overflow-hidden flex flex-col max-h-[90vh]'>
                <div className='absolute top-0 right-0 p-4 md:p-6'>
                    <button onClick={onClose} className='text-[#444] hover:text-white'><X size={24} /></button>
                </div>
                
                <div className='overflow-y-auto no-scrollbar'>
                    <p className='text-primary text-[9px] md:text-[10px] font-black tracking-[0.4em] mb-4 uppercase'>Mission Briefing // {task.category}</p>
                    <h2 className='text-2xl md:text-4xl font-black italic uppercase tracking-tighter mb-6'>{task.title}</h2>
                    
                    <div className='space-y-6 md:space-y-8'>
                        <div>
                            <h4 className='text-[10px] text-[#444] font-black uppercase tracking-widest mb-2 border-b border-[#1f1f1f] pb-2'>Objective Description</h4>
                            <p className='text-[#8C8C8C] text-sm md:text-base leading-relaxed'>{task.description}</p>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8'>
                            <div>
                                <h4 className='text-[10px] text-[#444] font-black uppercase tracking-widest mb-2 border-b border-[#1f1f1f] pb-2'>Operational Reward</h4>
                                <p className='text-xl md:text-2xl font-bold text-primary'>+{task.rpReward} RP</p>
                            </div>
                            <div>
                                <h4 className='text-[10px] text-[#444] font-black uppercase tracking-widest mb-2 border-b border-[#1f1f1f] pb-2'>Submission Type</h4>
                                <p className='text-lg md:text-xl font-bold text-white uppercase italic'>{task.submissionType || 'Link/Screenshot'}</p>
                            </div>
                        </div>
                    </div>

                    <div className='mt-8 md:mt-12'>
                        <Button onClick={onClose} className='w-full bg-white text-black hover:bg-primary transition-colors font-black uppercase py-6 text-xs tracking-widest'>
                            Close Briefing
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}