'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Download, Gift, Info, Send, Clock, X, CheckCircle2, AlertCircle,
    Loader2, Lock, FileText, Image as ImageIcon, RefreshCw, MessageSquare, Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import api from '@/lib/api';
import SubmissionModal from '@/components/dashboard/submissionModal';

type TabType = 'available' | 'submissions';

type TaskActionState =
    | 'submit'
    | 'pending'
    | 'approved'
    | 'requestResubmit'
    | 'requested'
    | 'resubmit'
    | 'resubmitted'
    | 'alreadySubmitted'
    | 'rejected'
    | 'proofLimitReached'

/* ─── Bulletproof ID Normalization ─── */
const normalizeId = (id: any): string => {
    if (!id) return '';
    let strId = '';
    if (typeof id === 'string') {
        strId = id;
    } else if (typeof id === 'object') {
        strId = String(id.$oid || id._id || id.id || id.toString());
    } else {
        strId = String(id);
    }
    
    // Aggressively extract the 24-character hex string to avoid wrapper/whitespace issues
    const match = strId.match(/[a-f0-9]{24}/i);
    return match ? match[0].toLowerCase() : strId.trim().toLowerCase();
};

/* ─── Exact Backend Match for Submission Period ─── */
const getCurrentPeriod = (taskType: string) => {
    const now = new Date();
    if (taskType === 'Daily') {
        return now.toISOString().split('T')[0];
    }
    if (taskType === 'Weekly') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now.getTime() - startOfYear.getTime()) / 86400000;
        const weekNum = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNum}`;
    }
    if (taskType === 'Monthly') {
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    return 'once';
};

/* ─── Legacy Date Math Fallbacks ─── */
const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
const isSameWeek = (d1: Date, d2: Date) => {
    const oneJan = new Date(d1.getFullYear(), 0, 1);
    const d1Days = Math.floor((d1.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
    const d1Week = Math.ceil((d1.getDay() + 1 + d1Days) / 7);
    const twoJan = new Date(d2.getFullYear(), 0, 1);
    const d2Days = Math.floor((d2.getTime() - twoJan.getTime()) / (24 * 60 * 60 * 1000));
    const d2Week = Math.ceil((d2.getDay() + 1 + d2Days) / 7);
    return d1.getFullYear() === d2.getFullYear() && d1Week === d2Week;
};
const isSameMonth = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

interface PhaseConfig { id: number; name: string; start: Date; end: Date; }

const PHASES: PhaseConfig[] = [
    { id: 1, name: 'SEASON 01', start: new Date('2026-08-02T00:00:00.000Z'), end: new Date('2026-09-03T23:59:59.999+05:30') },
    { id: 2, name: 'SEASON 02', start: new Date('2026-09-05T00:00:00+05:30'), end: new Date('2026-10-15T18:29:59.999Z') },
    { id: 3, name: 'SEASON 03', start: new Date('2026-10-16T00:00:00.000Z'), end: new Date('2026-11-04T23:59:59.999Z') },
];

export default function MissionsPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<TabType>('available');
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
    const [expandedReportPhase, setExpandedReportPhase] = useState<number | null>(null);

    const [requestedTaskIds, setRequestedTaskIds] = useState<Set<string>>(new Set());
    const [requestingTaskId, setRequestingTaskId] = useState<string | null>(null);
    const [reasonModalTask, setReasonModalTask] = useState<any>(null);
    const [reasonError, setReasonError] = useState('');

    const initialConfigDone = useRef(false);

    /* ─── Missions data (fires on mount) ─── */
    const { data: missionsData, isLoading: isTasksLoading } = useQuery({
        queryKey: ['active-missions'],
        queryFn: async () => {
            const { data } = await api.get('/api/ambassador/getMissions');
            return {
                tasks: data.tasks || [],
                submittedTasks: data.submittedTasks || [] 
            };
        },
        staleTime: 5 * 60 * 1000,
    });

    const tasks = missionsData?.tasks;
    const submittedTasks = missionsData?.submittedTasks || [];

    /* ─── Re-submission requests ─── */
    const { data: myReSubmissionRequests, isLoading: isReSubLoading } = useQuery({
        queryKey: ['re-submission-requests'],
        queryFn: async () => {
            const { data } = await api.get('/api/reSubmissionRequest/getMyReSubmissionRequests');
            const list =
                data?.myReSubmissionRequests ??
                data?.data?.myReSubmissionRequests ??
                data?.reSubmissionRequests ??
                data?.requests ??
                (Array.isArray(data) ? data : []);
            return Array.isArray(list) ? list : [];
        },
        retry: 1,
        refetchOnMount: 'always'
    });

    /* ─── Submissions data (fires on mount) ─── */
    const { data: mySubmissions, isLoading: isSubmissionsLoading } = useQuery({
        queryKey: ['my-submissions'],
        queryFn: async () => {
            const { data } = await api.get('/api/ambassador/submissions');
            return data.submissions;
        },
    });

    const now = useMemo(() => new Date(), []);

    const currentPhaseId = useMemo(() => {
        const active = PHASES.find(p => now >= p.start && now <= p.end);
        if (!active) {
            if (now < PHASES[0].start) return 1;
            return 3;
        }
        return active.id;
    }, [now]);

    useEffect(() => {
        if (tasks && !initialConfigDone.current) {
            setExpandedPhase(currentPhaseId);
            initialConfigDone.current = true;
        }
    }, [tasks, currentPhaseId]);

    /* ─── Logic Helpers ─── */

    const getSubmissionForTask = (task: any): any => {
        const taskId = normalizeId(task._id);
        if (!taskId) return undefined;

        // Deduplicate submissions using a Map based on the Submission _id
        const allSubsMap = new Map();
        
        if (Array.isArray(submittedTasks)) {
            submittedTasks.forEach(sub => {
                if (sub && sub._id) allSubsMap.set(normalizeId(sub._id), sub);
            });
        }
        if (Array.isArray(mySubmissions)) {
            mySubmissions.forEach(sub => {
                if (sub && sub._id) allSubsMap.set(normalizeId(sub._id), sub);
            });
        }

        const allSubs = Array.from(allSubsMap.values());

        // Find submissions matching this specific task ID
        const taskSubs = allSubs.filter((sub: any) => {
            if (!sub || !sub.taskId) return false;
            const subId = sub.taskId?._id || sub.taskId?.id || sub.taskId;
            return normalizeId(subId) === taskId;
        });

        if (taskSubs.length === 0) return undefined;

        // Sort to get newest first
        taskSubs.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        const latestSub = taskSubs[0];
        
        const subStatus = latestSub.status?.trim().toLowerCase();

        // 1. One-time tasks NEVER reset based on time. 
        // 2. If it is Rejected or Pending, ALWAYS return it so the user can Request Resubmit or wait, even if the week changed!
        if (task.taskType === 'One-Time' || subStatus === 'rejected' || subStatus === 'pending') {
            return latestSub; 
        }

        const currentPeriod = getCurrentPeriod(task.taskType);

        // 3. If it is Approved, verify if it was approved in the CURRENT period. 
        if (latestSub.submissionPeriod && latestSub.submissionPeriod !== 'once') {
            return latestSub.submissionPeriod === currentPeriod ? latestSub : undefined;
        } 
        
        // 4. Fallback for legacy submissions missing the period string
        const subDate = new Date(latestSub.createdAt || 0);
        const currentTime = new Date();
        if (task.taskType === 'Daily' && isSameDay(currentTime, subDate)) return latestSub;
        if (task.taskType === 'Weekly' && isSameWeek(currentTime, subDate)) return latestSub;
        if (task.taskType === 'Monthly' && isSameMonth(currentTime, subDate)) return latestSub;
        
        return undefined;
    };

    const reSubmissionMap = useMemo(() => {
        const map = new Map<string, any>();
        if (Array.isArray(myReSubmissionRequests)) {
            // Sort ascending so map overwrites with the newest requests
            const sortedReqs = [...myReSubmissionRequests].sort(
                (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
            );
            sortedReqs.forEach((req: any) => {
                const tId = normalizeId(req?.taskId ?? req?.task ?? req?.taskID);
                if (tId) map.set(tId, req);
            });
        }
        return map;
    }, [myReSubmissionRequests]);

    const getTaskActionState = (task: any): TaskActionState => {
        // Daily tasks always allow a fresh submission, regardless of any prior submission.
        if (task.taskType === 'Daily') return 'submit';

        const taskId = normalizeId(task._id);

        const matchingSubmission = getSubmissionForTask(task);
        if (!matchingSubmission) return 'submit';

        const submissionStatus = matchingSubmission.status?.trim().toLowerCase();

        if (submissionStatus === 'approved') return 'approved';
        if (submissionStatus === 'pending') return 'pending';

        if (submissionStatus === 'rejected') {
            const request = reSubmissionMap.get(taskId);
            
            if (request) {
                const reqTime = new Date(request.createdAt || 0).getTime();
                const subTime = new Date(matchingSubmission.createdAt || 0).getTime();
                
                // Validate that the request was made AFTER this specific rejection
                if (reqTime > subTime) {
                    if (!request.isRevertBack) return 'requested';
                    if (!request.isAccepted) return 'rejected';
                    return request.isReSubmitted ? 'resubmitted' : 'resubmit';
                }
            }

            if (requestedTaskIds.has(taskId)) return 'requested';

            return 'requestResubmit'; 
        }

        return 'submit';
    };

    const getReSubmissionRequestId = (task: any): string | undefined => {
        const taskId = normalizeId(task._id);
        const request = reSubmissionMap.get(taskId);
        if (!request) return undefined;

        const matchingSubmission = getSubmissionForTask(task);
        if (!matchingSubmission) return undefined;

        const reqTime = new Date(request.createdAt || 0).getTime();
        const subTime = new Date(matchingSubmission.createdAt || 0).getTime();

        if (reqTime > subTime) {
            return request._id;
        }
        return undefined;
    };

    const phasedTasks = useMemo<Record<number, any[]>>(() => {
        if (!tasks || !Array.isArray(tasks)) return { 1: [], 2: [], 3: [] };
        return tasks.reduce<Record<number, any[]>>((acc, task: any) => {
            const pId = task.phase || 1;
            if (!acc[pId]) acc[pId] = [];
            acc[pId].push(task);
            return acc;
        }, { 1: [], 2: [], 3: [] });
    }, [tasks]);

    /* ─── Reports grouped by Season (taskId.phase) ─── */
    const phasedSubmissions = useMemo<Record<number, any[]>>(() => {
        if (!mySubmissions || !Array.isArray(mySubmissions)) return { 1: [], 2: [], 3: [] };
        return mySubmissions.reduce<Record<number, any[]>>((acc, sub: any) => {
            const pId = sub?.taskId?.phase || 1;
            if (!acc[pId]) acc[pId] = [];
            acc[pId].push(sub);
            return acc;
        }, { 1: [], 2: [], 3: [] });
    }, [mySubmissions]);

    const isLoading = isTasksLoading || isReSubLoading || isSubmissionsLoading;

    /* ─── Handlers ─── */

    const handleSubmissionSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['active-missions'] });
        queryClient.invalidateQueries({ queryKey: ['my-submissions'] });
        queryClient.invalidateQueries({ queryKey: ['re-submission-requests'] });
        setIsSubmitModalOpen(false);
        setSelectedTask(null);
    };

    const handleReSubmissionRequest = async (task: any, reason: string) => {
        if (!task?._id) return;
        if (requestedTaskIds.has(task._id) || requestingTaskId === task._id) return;

        setRequestingTaskId(task._id);
        setReasonError('');
        try {
            const { data } = await api.post('/api/reSubmissionRequest/createReSubmissionRequest', {
                taskId: task._id,
                reason
            });

            if (data?.success !== false) {
                setRequestedTaskIds(prev => {
                    const next = new Set(prev);
                    next.add(normalizeId(task._id));
                    return next;
                });
                setReasonModalTask(null);
                queryClient.invalidateQueries({ queryKey: ['re-submission-requests'] });
            } else {
                setReasonError(data?.message || 'REQUEST FAILED. TRY AGAIN.');
            }
        } catch (error: any) {
            setReasonError(error?.response?.data?.message || 'REQUEST FAILED. CHECK CONNECTION AND TRY AGAIN.');
        } finally {
            setRequestingTaskId(null);
        }
    };

    const handleDeploy = (task: any) => {
        const actionState = getTaskActionState(task);

        switch (actionState) {
            case 'submit':
            case 'resubmit':
                setSelectedTask(task);
                setIsSubmitModalOpen(true);
                break;
            case 'requestResubmit':
                setReasonError('');
                setReasonModalTask(task);
                break;
            case 'pending':
            case 'approved':
            case 'requested':
            case 'resubmitted':
            case 'alreadySubmitted':
            case 'proofLimitReached':
            default:
                break;
        }
    };

    const tekoFont = { fontFamily: '"Teko", "Oswald", sans-serif' };

    /* ─── Render ─── */

    return (
        <div style={tekoFont} className='p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-white uppercase overflow-x-hidden antialiased'>
            {/* Header */}
            <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[3px] border-primary pl-4 sm:pl-6 py-0.5 relative z-10'>
                <div>
                    <p className='text-primary text-xs sm:text-sm font-medium tracking-[0.15em] mb-1 opacity-90'>Field Operations Active</p>
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-["Teko","Oswald",sans-serif] font-bold tracking-[0.06em] uppercase leading-none text-zinc-100'>
                        MISSION <span className='text-primary'>CONTROL</span>
                    </h1>
                </div>
                <div className='flex bg-black border border-zinc-900 p-1 skew-x-[-10deg] shrink-0'>
                    {(['available', 'submissions'] as TabType[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-1.5 text-xs sm:text-sm font-medium tracking-widest transition-all skew-x-10 ${activeTab === tab ? 'bg-primary text-black' : 'text-zinc-500 hover:text-white'}`}
                        >
                            {tab === 'available' ? 'INFO' : 'REPORTS'}
                        </button>
                    ))}
                </div>
            </header>

            {/* Body */}
            <div className='space-y-4 relative z-10'>
                {isLoading ? (
                    <div className='py-20 flex flex-col items-center justify-center text-center'>
                        <Loader2 className='w-8 h-8 text-primary animate-spin mb-4' />
                        <p className='text-xs sm:text-sm font-medium tracking-[0.25em] text-primary/50'>Syncing Encrypted Data...</p>
                    </div>
                ) : (
                    <>
                        {/* ── Available tab ── */}
                        {activeTab === 'available' && PHASES.map((phase) => {
                            const isLocked = phase.id !== 1 && now < phase.start;
                            const isEnded = now > phase.end;
                            const isExpanded = expandedPhase === phase.id;
                            const currentPhaseTasks = phasedTasks[phase.id] || [];

                            return (
                                <div key={phase.id} className='border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm p-4 space-y-4 transition-all'>
                                    <div
                                        onClick={() => !isLocked && !isEnded && setExpandedPhase(isExpanded ? null : phase.id)}
                                        className={`flex justify-between items-center p-3 border ${isLocked ? 'border-zinc-900 bg-zinc-950/60 cursor-not-allowed opacity-50' : 'border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10'} transition-all`}
                                    >
                                        <div className='flex items-center gap-4'>
                                            <h3 className={`text-xl sm:text-2xl font-bold tracking-wider ${isLocked ? 'text-zinc-500' : 'text-primary'} font-['Teko','Oswald',sans-serif]`}>
                                                {phase.name}
                                            </h3>
                                            <span className='text-xs sm:text-sm text-zinc-400 tracking-widest font-light'>
                                                [{phase.id === 1 ? '03 AUG - 03 SEPT' : phase.id === 2 ? '05 SEPT - 15 OCT' : 'TO BE DECLARED'}]
                                            </span>
                                        </div>
                                        <div>
                                            {isLocked ? (
                                                <div className='flex items-center gap-2 text-zinc-500 text-xs sm:text-sm font-medium tracking-widest'>
                                                    <span>LOCKED</span>
                                                    <Lock size={14} />
                                                </div>
                                            ) : isEnded ? (
                                                <div className='flex items-center gap-2 text-green-500 text-xs sm:text-sm font-medium tracking-widest'>
                                                    <span>COMPLETED</span>
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            ) : (
                                                <span className='text-xs text-primary font-bold tracking-widest'>
                                                    {isExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {isExpanded && !isLocked && (
                                        <div className='space-y-4 pt-2'>
                                            {currentPhaseTasks.length > 0 ? (
                                                currentPhaseTasks.map((task: any) => (
                                                    <MissionCard
                                                        key={task._id}
                                                        task={task}
                                                        actionState={getTaskActionState(task)}
                                                        isRequesting={requestingTaskId === task._id}
                                                        onViewDetails={() => {
                                                            setSelectedTask(task);
                                                            setIsSubmitModalOpen(false);
                                                        }}
                                                        onDeploy={() => handleDeploy(task)}
                                                    />
                                                ))
                                            ) : (
                                                <p className='text-xs text-zinc-500 tracking-wide pl-2'>NO MISSIONS DEPLOYED IN THIS SYSTEM YET.</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* ── Submissions tab (grouped by Season / taskId.phase) ── */}
                        {activeTab === 'submissions' && (
                            <>
                                {mySubmissions && mySubmissions.length > 0 ? (
                                    PHASES.map((phase) => {
                                        const isReportLocked = phase.id !== 1 && now < phase.start;
                                        const isReportExpanded = expandedReportPhase === phase.id;
                                        const currentPhaseSubmissions = phasedSubmissions[phase.id] || [];

                                        return (
                                            <div key={phase.id} className='border border-zinc-900 bg-zinc-950/20 backdrop-blur-sm p-4 space-y-4 transition-all'>
                                                <div
                                                    onClick={() => !isReportLocked && setExpandedReportPhase(isReportExpanded ? null : phase.id)}
                                                    className={`flex justify-between items-center p-3 border ${isReportLocked ? 'border-zinc-900 bg-zinc-950/60 cursor-not-allowed opacity-50' : 'border-primary/20 bg-primary/5 cursor-pointer hover:bg-primary/10'} transition-all`}
                                                >
                                                    <div className='flex items-center gap-4'>
                                                        <h3 className={`text-xl sm:text-2xl font-bold tracking-wider ${isReportLocked ? 'text-zinc-500' : 'text-primary'} font-['Teko','Oswald',sans-serif]`}>
                                                            {phase.name}
                                                        </h3>
                                                        <span className='text-xs sm:text-sm text-zinc-400 tracking-widest font-light'>
                                                            [{phase.id === 1 ? '03 AUG - 03 SEPT' : phase.id === 2 ? '05 SEPT - 15 OCT' : 'TO BE DECLARED '}]
                                                        </span>
                                                    </div>
                                                    <div>
                                                        {isReportLocked ? (
                                                            <div className='flex items-center gap-2 text-zinc-500 text-xs sm:text-sm font-medium tracking-widest'>
                                                                <span>LOCKED</span>
                                                                <Lock size={14} />
                                                            </div>
                                                        ) : (
                                                            <span className='text-xs text-primary font-bold tracking-widest'>
                                                                {isReportExpanded ? '[-] COLLAPSE' : '[+] EXPAND'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {isReportExpanded && !isReportLocked && (
                                                    <div className='space-y-4 pt-2'>
                                                        {currentPhaseSubmissions.length > 0 ? (
                                                            currentPhaseSubmissions.map((sub: any) => (
                                                                <SubmissionCard key={sub._id} submission={sub} />
                                                            ))
                                                        ) : (
                                                            <p className='text-xs text-zinc-500 tracking-wide pl-2'>NO REPORTS RECOVERED IN THIS SEASON.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className='border border-zinc-900 bg-zinc-950/40 p-10 text-center'>
                                        <p className='text-zinc-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
                                            No Data Recovered in this sector.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'available' && !tasks?.length && (
                            <div className='border border-zinc-900 bg-zinc-950/40 p-10 text-center'>
                                <p className='text-zinc-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
                                    No Data Recovered in this sector.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* ── Detail modal ── */}
            <AnimatePresence mode='wait'>
                {selectedTask && !isSubmitModalOpen && (
                    <MissionDetailModal
                        task={selectedTask}
                        actionState={getTaskActionState(selectedTask)}
                        isRequesting={requestingTaskId === selectedTask._id}
                        onClose={() => setSelectedTask(null)}
                        onDeploy={() => handleDeploy(selectedTask)}
                    />
                )}
            </AnimatePresence>

            {/* ── Re-submit reason modal ── */}
            <AnimatePresence mode='wait'>
                {reasonModalTask && (
                    <ReSubmitReasonModal
                        task={reasonModalTask}
                        isRequesting={requestingTaskId === reasonModalTask._id}
                        errorMsg={reasonError}
                        onClose={() => { setReasonModalTask(null); setReasonError(''); }}
                        onSubmit={(reason: string) => handleReSubmissionRequest(reasonModalTask, reason)}
                    />
                )}
            </AnimatePresence>

            {/* ── Submission modal ── */}
            <AnimatePresence mode='wait'>
                {isSubmitModalOpen && selectedTask && (
                    <SubmissionModal
                        task={selectedTask}
                        actionState={getTaskActionState(selectedTask)}
                        reSubmissionRequestId={getReSubmissionRequestId(selectedTask)}
                        onClose={() => {
                            setIsSubmitModalOpen(false);
                            setSelectedTask(null);
                        }}
                        onSuccess={handleSubmissionSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Shared config
   ═══════════════════════════════════════════════════════════════════ */

const ACTION_CONFIG: Record<TaskActionState, { label: string; disabled: boolean }> = {
    submit:           { label: 'Submit Task',       disabled: false },
    pending:          { label: 'Submitted',         disabled: true  },
    approved:         { label: 'APPROVED',          disabled: true  },
    requestResubmit:  { label: 'REQUEST RE-SUBMIT', disabled: false },
    requested:        { label: 'REQUESTED',         disabled: true  },
    resubmit:         { label: 'RESUBMIT',          disabled: false },
    resubmitted:      { label: 'RESUBMITTED',       disabled: true  },
    alreadySubmitted: { label: 'ALREADY SUBMITTED', disabled: true  },
    rejected:         { label: 'REJECTED',          disabled: true  },
    proofLimitReached:{ label: 'SUBMITTED',         disabled: true  },
};

/* ═══════════════════════════════════════════════════════════════════
   Action icon per state
   ═══════════════════════════════════════════════════════════════════ */

function ActionIcon({ actionState, isRequesting, className }: { actionState: TaskActionState; isRequesting: boolean; className?: string }) {
    if (isRequesting) return <Loader2 size={15} className={`${className || ''} animate-spin`} />;
    switch (actionState) {
        case 'pending':          return <Clock size={15} className={className} />;
        case 'approved':         return <CheckCircle2 size={15} className={className} />;
        case 'requested':        return <CheckCircle2 size={15} className={className} />;
        case 'requestResubmit':  return <RefreshCw size={15} className={className} />;
        case 'resubmit':         return <RefreshCw size={15} className={className} />;
        case 'resubmitted':      return <CheckCircle2 size={15} className={className} />;
        case 'alreadySubmitted': return <CheckCircle2 size={15} className={className} />;
        case 'rejected':         return <AlertCircle size={15} className={className} />;
        case 'proofLimitReached':return <CheckCircle2 size={15} className={className} />;
        case 'submit':
        default:                 return <Send size={15} className={className} />;
    }
}

/* ═══════════════════════════════════════════════════════════════════
   Re-submit reason modal (portal)
   ═══════════════════════════════════════════════════════════════════ */

function ReSubmitReasonModal({ task, isRequesting, errorMsg, onClose, onSubmit }: any) {
    const [reason, setReason] = useState('');
    const [mounted, setMounted] = useState(false);
    const isReasonValid = reason.trim().length > 0;

    useEffect(() => { setMounted(true); }, []);

    const handleSubmitClick = () => {
        if (!isReasonValid || isRequesting) return;
        onSubmit(reason.trim());
    };

    if (!mounted) return null;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
        >
            <motion.div
                initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }}
                className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl font-["Teko","Oswald",sans-serif]'
            >
                <button type='button' onClick={onClose} disabled={isRequesting} className='hover:cursor-pointer absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors disabled:opacity-40'>
                    <X size={20} />
                </button>

                <h2 className='text-2xl sm:text-3xl font-bold mb-1 tracking-wide text-primary uppercase font-["Teko","Oswald",sans-serif]'>RE-SUBMISSION REQUEST</h2>
                <p className='text-zinc-500 text-xs mb-6 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>{task.title}</p>

                {errorMsg && (
                    <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                        <AlertCircle size={14} /> {errorMsg}
                    </div>
                )}

                <div className='space-y-3 mb-6 font-["Teko","Oswald",sans-serif]'>
                    <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                        <MessageSquare size={12} /> REASON FOR RE-SUBMISSION <span className='text-red-500'>*</span>
                    </label>
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        placeholder='EXPLAIN WHY YOU NEED TO RE-SUBMIT THIS TASK...'
                        className='w-full bg-black border border-zinc-900 p-3 text-sm focus:border-primary outline-none text-zinc-200 normal-case font-medium placeholder:text-zinc-800 resize-none font-["Teko","Oswald",sans-serif]'
                    />
                    {!isReasonValid && (
                        <p className='text-[10px] text-zinc-600 tracking-widest uppercase font-["Teko","Oswald",sans-serif]'>
                            REASON IS MANDATORY — THE REQUEST CANNOT BE SENT WITHOUT IT.
                        </p>
                    )}
                </div>

                <button
                    type='button'
                    onClick={handleSubmitClick}
                    disabled={!isReasonValid || isRequesting}
                    className='w-full bg-primary text-black py-4 font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'
                >
                    {isRequesting ? (
                        <><Loader2 size={16} className='animate-spin' /> SENDING REQUEST...</>
                    ) : 'SUBMIT REQUEST'}
                </button>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Submission card (Reports tab)
   ═══════════════════════════════════════════════════════════════════ */

function SubmissionCard({ submission }: any) {
    const statusStyles: any = {
        'Pending':  'text-yellow-500 border-yellow-500/20 bg-yellow-500/5',
        'Approved': 'text-green-500  border-green-500/20  bg-green-500/5',
        'Rejected': 'text-red-500    border-red-500/20    bg-red-500/5'
    };

    const StatusIcon = () => {
        const subStatus = submission.status?.trim().toLowerCase();
        switch (subStatus) {
            case 'approved': return <CheckCircle2 className='text-green-500' size={18} />;
            case 'rejected': return <AlertCircle  className='text-red-500'   size={18} />;
            default:         return <Clock        className='text-yellow-500' size={18} />;
        }
    };

    return (
        <div className='bg-zinc-950/40 border border-zinc-900 p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative group'>
            <div className='flex-1 space-y-2'>
                <div className='flex items-center gap-3'>
                    <span className={`px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border leading-none ${statusStyles[submission.status] || 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5'}`}>
                        {submission.status || 'Unknown'}
                    </span>
                    <span className='text-zinc-500 text-xs sm:text-sm font-light tracking-wide leading-none'>
                        SUBMITTED: {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <h3 className='text-xl sm:text-2xl font-bold tracking-wide uppercase text-white leading-none'>
                    {submission.taskId?.title || 'Unknown Mission'}
                </h3>
                {submission.adminFeedback && (
                    <p className='text-xs sm:text-sm text-red-400/80 font-light border-l border-red-500/50 pl-2 lowercase leading-none'>
                        Feedback: {submission.adminFeedback}
                    </p>
                )}
            </div>

            <div className='flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-zinc-900 pt-4 md:pt-0 leading-none'>
                <StatusIcon />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Mission card (Available / INFO tab)
   ═══════════════════════════════════════════════════════════════════ */

function MissionCard({ task, actionState, isRequesting, onViewDetails, onDeploy }: any) {
    const statusColors: any = {
        'Upcoming':    'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
        'In Progress': 'border-blue-500/40   text-blue-500   bg-blue-500/5',
        'In Review':   'border-primary/40    text-primary    bg-primary/5',
        'Completed':   'border-green-500/40  text-green-500  bg-green-500/5'
    };

    const action = ACTION_CONFIG[actionState as TaskActionState] || ACTION_CONFIG.submit;
    const isDisabled = action.disabled || isRequesting;

    const buttonStyle = (() => {
        if (isDisabled) {
            if (actionState === 'approved')  return 'bg-green-600/20 text-green-400 border border-green-600/30';
            if (actionState === 'pending')   return 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30';
            if (actionState === 'rejected')  return 'bg-red-600/20 text-red-400 border border-red-600/30';
            if (actionState === 'requested' || actionState === 'resubmitted' || actionState === 'alreadySubmitted' || actionState === 'proofLimitReached')
            return 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40';
        }
        return 'bg-primary text-black hover:bg-white';
    })();

    return (
        <div
            onClick={onViewDetails}
            className='bg-zinc-950/40 border border-zinc-900 p-5 sm:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6 group hover:border-primary/30 hover:bg-zinc-900/10 cursor-pointer transition-all relative overflow-hidden'
        >
            <div className='space-y-3 flex-1'>
                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                    <span className={`px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border leading-none ${statusColors[task.status] || 'border-zinc-800'}`}>
                        {task.status === 'In Progress' ? 'Live' : task.status}
                    </span>
                    <span className='bg-primary/5 text-primary px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border border-primary/20 leading-none'>
                        + {task.rpReward} RP
                    </span>
                    <span className='text-zinc-500 text-xs sm:text-sm font-light tracking-wide flex items-center gap-1 leading-none'>
                        <Clock size={11} /> {task.taskType}
                    </span>
                </div>
                <div>
                    <h2 className='text-2xl sm:text-3xl font-["Teko","Oswald",sans-serif] font-bold tracking-wide text-white mb-1.5 uppercase leading-none group-hover:text-primary transition-colors'>
                        {task.title}
                    </h2>
                    <p className='text-zinc-300 text-sm sm:text-base font-semibold tracking-wide max-w-2xl uppercase line-clamp-2 sm:line-clamp-none leading-tight'>
                        {task.description}
                    </p>
                </div>
            </div>

            <div className='flex items-center gap-3 sm:gap-4 w-full lg:w-auto leading-none'>
                <button
                    type='button'
                    onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                    className='flex-none flex items-center justify-center bg-black border border-zinc-900 p-3.5 hover:border-white transition-all text-zinc-500 hover:text-white'
                >
                    <Info size={18} />
                    <span className='lg:hidden ml-2 text-xs font-medium tracking-wider'>INTEL</span>
                </button>
                <button
                    type='button'
                    disabled={isDisabled}
                    onClick={(e) => { e.stopPropagation(); onDeploy(); }}
                    className={`flex-1 lg:flex-none px-6 sm:px-10 py-3.5 font-bold tracking-wide flex items-center justify-center gap-2 transition-all skew-x-[-10deg] active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 ${buttonStyle} ${isDisabled ? 'opacity-60' : ''}`}
                >
                    <span className='hover:cursor-pointer skew-x-10 text-xs sm:text-sm uppercase'>
                        {isRequesting ? 'REQUESTING...' : action.label}
                    </span>
                    <ActionIcon actionState={actionState} isRequesting={isRequesting} className='skew-x-10' />
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Mission detail modal
   ═══════════════════════════════════════════════════════════════════ */

function MissionDetailModal({ task, actionState, isRequesting, onClose, onDeploy }: any) {
    const action = ACTION_CONFIG[actionState as TaskActionState] || ACTION_CONFIG.submit;
    const isDisabled = action.disabled || isRequesting;

    const buttonStyle = (() => {
        if (isDisabled) {
            if (actionState === 'approved') return 'bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/20';
            if (actionState === 'pending') return 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/20';
            if (actionState === 'rejected')  return 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/20';
            return 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:bg-zinc-800/60';
        }
        return 'bg-white text-black hover:bg-primary';
    })();

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar'
            >
                <button onClick={onClose} className='hover:cursor-pointer absolute top-4 right-4 sm:top-5 sm:right-5 text-zinc-500 hover:text-white transition-colors z-10'>
                    <X size={20} />
                </button>

                <h2 className='text-3xl sm:text-4xl font-bold mb-5 tracking-wide text-white uppercase leading-none font-["Teko","Oswald",sans-serif]'>
                    {task.title}
                </h2>

                <div className='space-y-5 mb-6 sm:mb-8 font-["Teko","Oswald",sans-serif]'>
                    <div className='border-l-2 border-zinc-900 pl-4'>
                        <h4 className='text-xs sm:text-sm font-medium text-zinc-500 mb-1.5 uppercase tracking-wider leading-none font-["Teko","Oswald",sans-serif]'>Task Description</h4>
                        <p className='text-sm sm:text-base leading-relaxed text-zinc-300 font-semibold normal-case font-["Teko","Oswald",sans-serif]'>{task.description}</p>
                    </div>

                    {(task.subGuide || task.rpSummary) && (
                        <div className='border-l-2 border-primary/40 bg-primary/2 p-3 pl-4 flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-4'>
                                <h4 className='text-xs sm:text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
                                    <FileText size={12} /> How to Complete
                                </h4>
                                { task.title !== "Booster Task - Welcome Kit Unboxing Reel" &&
                                    <a
                                        href={task.title.includes('TDM / WOW BATTLEGROUND') ? '/Task_1_Submission_Guidelines.pdf' : task.title.includes('CAPTURE THE CLUTCH') ? '/Task_2_Submission_Guidelines.pdf' : task.title.includes('OFFLINE ACTIVATION') ? '/Task_3_Submission_Guidelines.pdf' : task.title.includes('FLEX') ? '/FLEX_Booster.pdf' : '/Squad_Signup_Booster.pdf' }
                                        download
                                        className='flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-800 hover:border-[#f4c430] px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer whitespace-nowrap font-["Teko","Oswald",sans-serif]'
                                    >
                                        <Download size={14} className='text-primary' /> Guidelines
                                    </a>
                                }
                            </div>
                            <p className='text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-zinc-200 font-semibold uppercase font-["Teko","Oswald",sans-serif]'>
                                {task.subGuide || task.rpSummary}
                            </p>
                        </div>
                    )}

                    {task.rewards && (
                        <div className='border-l-2 border-[#f4c430]/40 bg-[#f4c430]/2 p-3 pl-4'>
                            <h4 className='text-xs sm:text-sm font-medium text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
                                <Gift size={12} /> Rewards Breakdown
                            </h4>
                            <p className='text-sm sm:text-base leading-relaxed text-zinc-200 font-semibold normal-case whitespace-pre-wrap font-["Teko","Oswald",sans-serif]'>
                                {task.rewards}
                            </p>
                        </div>
                    )}

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
                        <div className='bg-black border border-zinc-900 p-4 leading-none'>
                            <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>RP Reward</span>
                            <span className='text-xl sm:text-2xl text-primary font-bold font-["Teko","Oswald",sans-serif]'>+{task.rpReward} RP</span>
                        </div>
                        <div className='bg-black border border-zinc-900 p-4 leading-none'>
                            <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>TASK TYPE</span>
                            <span className='text-xl sm:text-2xl font-bold text-white font-["Teko","Oswald",sans-serif]'>{task.taskType}</span>
                        </div>
                        <div className='bg-black border border-zinc-900 p-4 leading-none'>
                            <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>VALIDATION METHOD</span>
                            <span className='text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                                { task.isImageAllowed ?
                                <ImageIcon size={14} className='text-primary' /> : <Link size={14} className='text-primary'/>
                                } {task.isImageAllowed ? 'VISUAL PROOF (MAX 4)' : 'URL VALIDATION ONLY'}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type='button'
                    onClick={onDeploy}
                    disabled={isDisabled}
                    className={`hover:cursor-pointer w-full py-3.5 font-bold tracking-widest transition-all uppercase text-xs sm:text-sm active:bg-primary leading-none font-["Teko","Oswald",sans-serif] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:active:scale-100 ${buttonStyle} ${isDisabled ? 'opacity-60' : ''}`}
                >
                    {isRequesting && <Loader2 size={15} className='animate-spin' />}
                    <span>
                        {isRequesting ? 'REQUESTING...' : actionState === 'submit' ? 'Submit Task //' : action.label}
                    </span>
                </button>
            </motion.div>
        </motion.div>
    );
}