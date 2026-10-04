// 'use client';

// import { useState, useEffect } from 'react';
// import { createPortal } from 'react-dom';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import {
//     Info, Send, Clock, CheckCircle2, AlertCircle, Loader2, Gift, X, Plus, Trash2,
//     FileText, Image as ImageIcon, Link
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// import api from '@/lib/api';

// type FeedbackState = { type: 'success' | 'error'; message: string } | null;

// /* ─── Converts literal "\n" sequences into real line breaks (pair with whitespace-pre-line / pre-wrap) ─── */
// const formatText = (text: any): string => String(text ?? '').replace(/\\n/g, '\n');

// export default function SpecificTasksPage() {
//     const queryClient = useQueryClient();

//     const [selectedTask, setSelectedTask] = useState<any>(null);
//     const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
//     const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
//     const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
//     const [submitError, setSubmitError] = useState('');
//     const [feedback, setFeedback] = useState<FeedbackState>(null);

//     /* ─── Specific tasks data ─── */
//     const { data: tasks, isLoading, isError, error } = useQuery({
//         queryKey: ['specific-tasks'],
//         queryFn: async () => {
//             const { data } = await api.get('/api/ambassador/getSpecificTasks');
//             if (data?.success === false) {
//                 throw new Error(data?.message || 'FAILED TO LOAD TASKS.');
//             }
//             return Array.isArray(data?.tasks) ? data.tasks : [];
//         },
//         staleTime: 5 * 60 * 1000,
//     });

//     /* Auto-dismiss feedback banner */
//     useEffect(() => {
//         if (!feedback) return;
//         const t = setTimeout(() => setFeedback(null), 4000);
//         return () => clearTimeout(t);
//     }, [feedback]);

//     /* ─── Handlers ─── */
//     const handleDeploy = (task: any) => {
//         if (!task?._id) return;
//         if (submittingTaskId === task._id || submittedTaskIds.has(task._id)) return;
//         setSubmitError('');
//         setSelectedTask(task);
//         setIsSubmitModalOpen(true);
//     };

//     const handleSubmit = async (task: any, proofLinks: string[]) => {
//         if (!task?._id) return;
//         if (submittingTaskId === task._id || submittedTaskIds.has(task._id)) return;

//         setSubmittingTaskId(task._id);
//         setSubmitError('');
//         setFeedback(null);

//         try {
//             const { data } = await api.post('/api/ambassador/submitSpecificTask', {
//                 taskId: task._id,
//                 proofLinks,
//             });

//             if (data?.success !== false) {
//                 setSubmittedTaskIds(prev => {
//                     const next = new Set(prev);
//                     next.add(task._id);
//                     return next;
//                 });
//                 setFeedback({ type: 'success', message: data?.message || 'TASK SUBMITTED SUCCESSFULLY.' });
//                 queryClient.invalidateQueries({ queryKey: ['specific-tasks'] });
//                 setIsSubmitModalOpen(false);
//                 setSelectedTask(null);
//             } else {
//                 setSubmitError(data?.message || 'SUBMISSION FAILED. TRY AGAIN.');
//             }
//         } catch (err: any) {
//             setSubmitError(err?.response?.data?.message || 'SUBMISSION FAILED. CHECK CONNECTION AND TRY AGAIN.');
//         } finally {
//             setSubmittingTaskId(null);
//         }
//     };

//     const tekoFont = { fontFamily: '"Teko", "Oswald", sans-serif' };

//     /* ─── Render ─── */
//     return (
//         <div style={tekoFont} className='p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-white uppercase overflow-x-hidden antialiased'>
//             {/* Header */}
//             <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[3px] border-primary pl-4 sm:pl-6 py-0.5 relative z-10'>
//                 <div>
//                     <p className='text-primary text-xs sm:text-sm font-medium tracking-[0.15em] mb-1 opacity-90'>Special Operations Active</p>
//                     <h1 className='text-4xl sm:text-5xl lg:text-6xl font-["Teko","Oswald",sans-serif] font-bold tracking-[0.06em] uppercase leading-none text-zinc-100'>
//                         SPECIFIC <span className='text-primary'>MISSIONS</span>
//                     </h1>
//                 </div>
//             </header>

//             {/* Feedback banner */}
//             <AnimatePresence>
//                 {feedback && (
//                     <motion.div
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className={`relative z-10 p-3 border text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-between gap-2 ${
//                             feedback.type === 'success'
//                                 ? 'bg-green-500/10 border-green-500/20 text-green-500'
//                                 : 'bg-red-500/10 border-red-500/20 text-red-500'
//                         }`}
//                     >
//                         <span className='flex items-center gap-2'>
//                             {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
//                             {feedback.message}
//                         </span>
//                         <button type='button' onClick={() => setFeedback(null)} className='hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity'>
//                             <X size={14} />
//                         </button>
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {/* Body */}
//             <div className='space-y-4 relative z-10'>
//                 {isLoading ? (
//                     <div className='py-20 flex flex-col items-center justify-center text-center'>
//                         <Loader2 className='w-8 h-8 text-primary animate-spin mb-4' />
//                         <p className='text-xs sm:text-sm font-medium tracking-[0.25em] text-primary/50'>Syncing Encrypted Data...</p>
//                     </div>
//                 ) : isError ? (
//                     <div className='border border-red-500/20 bg-red-500/5 p-10 text-center'>
//                         <p className='text-red-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
//                             {(error as any)?.response?.data?.message || (error as any)?.message || 'FAILED TO LOAD TASKS.'}
//                         </p>
//                     </div>
//                 ) : tasks && tasks.length > 0 ? (
//                     tasks.map((task: any) => (
//                         <SpecificTaskCard
//                             key={task._id}
//                             task={task}
//                             isSubmitting={submittingTaskId === task._id}
//                             isSubmitted={submittedTaskIds.has(task._id)}
//                             onViewDetails={() => {
//                                 setSelectedTask(task);
//                                 setIsSubmitModalOpen(false);
//                             }}
//                             onDeploy={() => handleDeploy(task)}
//                         />
//                     ))
//                 ) : (
//                     <div className='border border-zinc-900 bg-zinc-950/40 p-10 text-center'>
//                         <p className='text-zinc-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
//                             No Data Recovered in this sector.
//                         </p>
//                     </div>
//                 )}
//             </div>

//             {/* ── Detail modal ── */}
//             <AnimatePresence mode='wait'>
//                 {selectedTask && !isSubmitModalOpen && (
//                     <SpecificTaskDetailModal
//                         task={selectedTask}
//                         isSubmitting={submittingTaskId === selectedTask._id}
//                         isSubmitted={submittedTaskIds.has(selectedTask._id)}
//                         onClose={() => setSelectedTask(null)}
//                         onDeploy={() => handleDeploy(selectedTask)}
//                     />
//                 )}
//             </AnimatePresence>

//             {/* ── Submission modal ── */}
//             <AnimatePresence mode='wait'>
//                 {isSubmitModalOpen && selectedTask && (
//                     <SpecificSubmissionModal
//                         task={selectedTask}
//                         isSubmitting={submittingTaskId === selectedTask._id}
//                         errorMsg={submitError}
//                         onClose={() => {
//                             setIsSubmitModalOpen(false);
//                             setSelectedTask(null);
//                             setSubmitError('');
//                         }}
//                         onSubmit={(links: string[]) => handleSubmit(selectedTask, links)}
//                     />
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }

// /* ═══════════════════════════════════════════════════════════════════
//    Specific task card
//    ═══════════════════════════════════════════════════════════════════ */

// function SpecificTaskCard({ task, isSubmitting, isSubmitted, onViewDetails, onDeploy }: any) {
//     const statusColors: any = {
//         'Upcoming':    'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
//         'In Progress': 'border-blue-500/40   text-blue-500   bg-blue-500/5',
//         'In Review':   'border-primary/40    text-primary    bg-primary/5',
//         'Completed':   'border-green-500/40  text-green-500  bg-green-500/5'
//     };

//     const isDisabled = isSubmitting || isSubmitted;

//     const buttonStyle = isSubmitted
//         ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
//         : isDisabled
//             ? 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40'
//             : 'bg-primary text-black hover:bg-white';

//     return (
//         <div
//             onClick={onViewDetails}
//             className='bg-zinc-950/40 border border-zinc-900 p-5 sm:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6 group hover:border-primary/30 hover:bg-zinc-900/10 cursor-pointer transition-all relative overflow-hidden'
//         >
//             <div className='space-y-3 flex-1'>
//                 <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
//                     {task.status && (
//                         <span className={`px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border leading-none ${statusColors[task.status] || 'border-zinc-800'}`}>
//                             {task.status === 'In Progress' ? 'Live' : task.status}
//                         </span>
//                     )}
//                     {task.rpReward !== undefined && (
//                         <span className='bg-primary/5 text-primary px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border border-primary/20 leading-none'>
//                             + {task.rpReward} XP
//                         </span>
//                     )}
//                     {task.taskType && (
//                         <span className='text-zinc-500 text-xs sm:text-sm font-light tracking-wide flex items-center gap-1 leading-none'>
//                             <Clock size={11} /> {task.taskType}
//                         </span>
//                     )}
//                 </div>
//                 <div>
//                     <h2 className='text-2xl sm:text-3xl font-["Teko","Oswald",sans-serif] font-bold tracking-wide text-white mb-1.5 uppercase leading-none whitespace-pre-line group-hover:text-primary transition-colors'>
//                         {formatText(task.title)}
//                     </h2>
//                     <p className='text-zinc-300 text-sm sm:text-base font-semibold tracking-wide max-w-2xl uppercase whitespace-pre-line line-clamp-2 sm:line-clamp-none leading-tight'>
//                         {formatText(task.description)}
//                     </p>
//                 </div>
//             </div>

//             <div className='flex items-center gap-3 sm:gap-4 w-full lg:w-auto leading-none'>
//                 <button
//                     type='button'
//                     onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
//                     className='flex-none flex items-center justify-center bg-black border border-zinc-900 p-3.5 hover:border-white transition-all text-zinc-500 hover:text-white'
//                 >
//                     <Info size={18} />
//                     <span className='lg:hidden ml-2 text-xs font-medium tracking-wider'>INTEL</span>
//                 </button>
//                 <button
//                     type='button'
//                     disabled={isDisabled}
//                     onClick={(e) => { e.stopPropagation(); onDeploy(); }}
//                     className={`flex-1 lg:flex-none px-6 sm:px-10 py-3.5 font-bold tracking-wide flex items-center justify-center gap-2 transition-all skew-x-[-10deg] active:scale-95 disabled:cursor-not-allowed disabled:active:scale-100 ${buttonStyle} ${isDisabled ? 'opacity-60' : ''}`}
//                 >
//                     <span className='hover:cursor-pointer skew-x-10 text-xs sm:text-sm uppercase'>
//                         {isSubmitting ? 'SUBMITTING...' : isSubmitted ? 'SUBMITTED' : 'Submit Task'}
//                     </span>
//                     {isSubmitting ? (
//                         <Loader2 size={15} className='skew-x-10 animate-spin' />
//                     ) : isSubmitted ? (
//                         <CheckCircle2 size={15} className='skew-x-10' />
//                     ) : (
//                         <Send size={15} className='skew-x-10' />
//                     )}
//                 </button>
//             </div>
//         </div>
//     );
// }

// /* ═══════════════════════════════════════════════════════════════════
//    Specific task detail modal
//    ═══════════════════════════════════════════════════════════════════ */

// function SpecificTaskDetailModal({ task, isSubmitting, isSubmitted, onClose, onDeploy }: any) {
//     const isDisabled = isSubmitting || isSubmitted;

//     const buttonStyle = isSubmitted
//         ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/20'
//         : isDisabled
//             ? 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:bg-zinc-800/60'
//             : 'bg-white text-black hover:bg-primary';

//     return (
//         <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className='fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
//         >
//             <motion.div
//                 initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
//                 className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar'
//             >
//                 <button onClick={onClose} className='hover:cursor-pointer absolute top-4 right-4 sm:top-5 sm:right-5 text-zinc-500 hover:text-white transition-colors z-10'>
//                     <X size={20} />
//                 </button>

//                 <h2 className='text-3xl sm:text-4xl font-bold mb-5 tracking-wide text-white uppercase leading-none whitespace-pre-line font-["Teko","Oswald",sans-serif]'>
//                     {formatText(task.title)}
//                 </h2>

//                 <div className='space-y-5 mb-6 sm:mb-8 font-["Teko","Oswald",sans-serif]'>
//                     <div className='border-l-2 border-zinc-900 pl-4'>
//                         <h4 className='text-xs sm:text-sm font-medium text-zinc-500 mb-1.5 uppercase tracking-wider leading-none font-["Teko","Oswald",sans-serif]'>Task Description</h4>
//                         <p className='text-sm sm:text-base leading-relaxed text-zinc-300 font-semibold normal-case whitespace-pre-wrap font-["Teko","Oswald",sans-serif]'>{formatText(task.description)}</p>
//                     </div>

//                     {(task.subGuide || task.rpSummary) && (
//                         <div className='border-l-2 border-primary/40 bg-primary/2 p-3 pl-4 flex flex-col gap-2'>
//                             <div className='flex items-center justify-between gap-4'>
//                                 <h4 className='text-xs sm:text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
//                                     <FileText size={12} /> How to Complete
//                                 </h4>
//                             </div>
//                             <p className='text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-zinc-200 font-semibold uppercase font-["Teko","Oswald",sans-serif]'>
//                                 {formatText(task.subGuide || task.rpSummary)}
//                             </p>
//                         </div>
//                     )}

//                     {task.rewards && (
//                         <div className='border-l-2 border-[#f4c430]/40 bg-[#f4c430]/2 p-3 pl-4'>
//                             <h4 className='text-xs sm:text-sm font-medium text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
//                                 <Gift size={12} /> Rewards Breakdown
//                             </h4>
//                             <p className='text-sm sm:text-base leading-relaxed text-zinc-200 font-semibold normal-case whitespace-pre-wrap font-["Teko","Oswald",sans-serif]'>
//                                 {formatText(task.rewards)}
//                             </p>
//                         </div>
//                     )}

//                     <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
//                         {task.rpReward !== undefined && (
//                             <div className='bg-black border border-zinc-900 p-4 leading-none'>
//                                 <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>XP Reward</span>
//                                 <span className='text-xl sm:text-2xl text-primary font-bold font-["Teko","Oswald",sans-serif]'>+{task.rpReward} XP</span>
//                             </div>
//                         )}
//                         {task.taskType && (
//                             <div className='bg-black border border-zinc-900 p-4 leading-none'>
//                                 <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>TASK TYPE</span>
//                                 <span className='text-xl sm:text-2xl font-bold text-white font-["Teko","Oswald",sans-serif]'>{task.taskType}</span>
//                             </div>
//                         )}
//                         {task.isImageAllowed !== undefined && (
//                             <div className='bg-black border border-zinc-900 p-4 leading-none'>
//                                 <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>VALIDATION METHOD</span>
//                                 <span className='text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
//                                     {task.isImageAllowed
//                                         ? <ImageIcon size={14} className='text-primary' />
//                                         : <Link size={14} className='text-primary' />
//                                     } {task.isImageAllowed ? 'VISUAL PROOF (MAX 4)' : 'URL VALIDATION ONLY'}
//                                 </span>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 <button
//                     type='button'
//                     onClick={onDeploy}
//                     disabled={isDisabled}
//                     className={`hover:cursor-pointer w-full py-3.5 font-bold tracking-widest transition-all uppercase text-xs sm:text-sm active:bg-primary leading-none font-["Teko","Oswald",sans-serif] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:active:scale-100 ${buttonStyle} ${isDisabled ? 'opacity-60' : ''}`}
//                 >
//                     {isSubmitting && <Loader2 size={15} className='animate-spin' />}
//                     <span>
//                         {isSubmitting ? 'SUBMITTING...' : isSubmitted ? 'SUBMITTED' : 'Submit Task //'}
//                     </span>
//                 </button>
//             </motion.div>
//         </motion.div>
//     );
// }

// /* ═══════════════════════════════════════════════════════════════════
//    Specific task submission modal (portal) — "Submit Log Report"
//    ═══════════════════════════════════════════════════════════════════ */

// // function SpecificSubmissionModal({ task, isSubmitting, errorMsg, onClose, onSubmit }: any) {
// //     const [mounted, setMounted] = useState(false);
// //     const [links, setLinks] = useState<string[]>(['']);
// //     const [localError, setLocalError] = useState('');

// //     useEffect(() => { setMounted(true); }, []);

// //     const handleLinkChange = (index: number, value: string) => {
// //         setLinks(prev => prev.map((l, i) => (i === index ? value : l)));
// //         if (localError) setLocalError('');
// //     };

// //     const handleAddLink = () => setLinks(prev => [...prev, '']);

// //     const handleRemoveLink = (index: number) => {
// //         setLinks(prev => prev.filter((_, i) => i !== index));
// //     };

// //     const handleSubmitClick = () => {
// //         if (isSubmitting) return;
// //         const cleaned = links.map(l => l.trim()).filter(Boolean);
// //         if (cleaned.length === 0) {
// //             setLocalError('ADD AT LEAST ONE PROOF LINK.');
// //             return;
// //         }
// //         onSubmit(cleaned);
// //     };

// //     if (!mounted) return null;

// //     const displayError = errorMsg || localError;

// //     return createPortal(
// //         <motion.div
// //             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
// //             className='fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
// //         >
// //             <motion.div
// //                 initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }}
// //                 className='bg-zinc-950 border border-zinc-900 p-6 sm:p-10 max-w-[640px] w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'
// //             >
// //                 <button type='button' onClick={onClose} disabled={isSubmitting} className='hover:cursor-pointer absolute top-4 right-4 sm:top-6 sm:right-6 text-zinc-500 hover:text-white transition-colors disabled:opacity-40'>
// //                     <X size={20} />
// //                 </button>

// //                 <h2 className='text-3xl sm:text-4xl font-bold mb-2 tracking-wide text-primary uppercase leading-none font-["Teko","Oswald",sans-serif]'>SUBMIT LOG REPORT</h2>
// //                 <p className='text-zinc-500 text-xs mb-10 tracking-wider uppercase whitespace-pre-line font-["Teko","Oswald",sans-serif]'>{formatText(task.title)}</p>

// //                 {displayError && (
// //                     <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
// //                         <AlertCircle size={14} /> {displayError}
// //                     </div>
// //                 )}

// //                 <div className='mb-8 font-["Teko","Oswald",sans-serif]'>
// //                     <div className='flex items-center justify-between gap-4 mb-4'>
// //                         <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
// //                             <Link size={12} /> PROOF LINKS / URLS
// //                         </label>
// //                         <button
// //                             type='button'
// //                             onClick={handleAddLink}
// //                             disabled={isSubmitting}
// //                             className='hover:cursor-pointer flex items-center gap-1 h-7 border border-primary/40 bg-primary/5 text-primary px-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed font-["Teko","Oswald",sans-serif]'
// //                         >
// //                             <Plus size={11} /> ADD LINK
// //                         </button>
// //                     </div>

// //                     <div className='space-y-2.5'>
// //                         {links.map((link, index) => (
// //                             <div key={index} className='flex items-center gap-3'>
// //                                 <input
// //                                     type='text'
// //                                     value={link}
// //                                     onChange={(e) => handleLinkChange(index, e.target.value)}
// //                                     disabled={isSubmitting}
// //                                     placeholder={`HTTPS://E.G., PROOF-LINK-0${index + 1}.COM`}
// //                                     className='flex-1 min-w-0 h-[52px] bg-black border border-zinc-900 px-4 text-xs focus:border-primary outline-none text-zinc-200 normal-case font-medium tracking-wide placeholder:text-zinc-800 placeholder:uppercase font-["Teko","Oswald",sans-serif]'
// //                                 />
// //                                 {links.length > 1 && (
// //                                     <button
// //                                         type='button'
// //                                         onClick={() => handleRemoveLink(index)}
// //                                         disabled={isSubmitting}
// //                                         className='hover:cursor-pointer flex-none flex items-center justify-center w-12 h-[52px] bg-black border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-40'
// //                                     >
// //                                         <Trash2 size={16} />
// //                                     </button>
// //                                 )}
// //                             </div>
// //                         ))}
// //                     </div>
// //                 </div>

// //                 <button
// //                     type='button'
// //                     onClick={handleSubmitClick}
// //                     disabled={isSubmitting}
// //                     className='hover:cursor-pointer w-full h-[65px] bg-primary text-black font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'
// //                 >
// //                     {isSubmitting ? (
// //                         <><Loader2 size={16} className='animate-spin' /> SUBMITTING...</>
// //                     ) : 'SUBMIT TASK //'}
// //                 </button>
// //             </motion.div>
// //         </motion.div>,
// //         document.body
// //     );
// // }



// function SpecificSubmissionModal({ task, isSubmitting, errorMsg, onClose, onSubmit }: any) {
//     const [mounted, setMounted] = useState(false);
//     const [links, setLinks] = useState<string[]>(['']);
//     const [localError, setLocalError] = useState('');

//     useEffect(() => { setMounted(true); }, []);

//     const handleLinkChange = (index: number, value: string) => {
//         setLinks(prev => prev.map((l, i) => (i === index ? value : l)));
//         if (localError) setLocalError('');
//     };

//     const handleAddLink = () => setLinks(prev => [...prev, '']);

//     const handleRemoveLink = (index: number) => {
//         setLinks(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSubmitClick = () => {
//         if (isSubmitting) return;
//         const proofUrls = links.map(l => l.trim()).filter(Boolean);
//         if (proofUrls.length === 0) {
//             setLocalError('INCLUDE THE SUBMISSION LINK');
//             return;
//         }
//         onSubmit(proofUrls);
//     };

//     if (!mounted) return null;

//     const displayError = errorMsg || localError;

//     return createPortal(
//         <motion.div
//             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//             className='fixed inset-0 z-9999 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
//         >
//             <motion.div
//                 initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }}
//                 className='bg-zinc-950 border border-zinc-900 p-6 sm:p-10 max-w-[640px] w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'
//             >
//                 <button type='button' onClick={onClose} disabled={isSubmitting} className='hover:cursor-pointer absolute top-4 right-4 sm:top-6 sm:right-6 text-zinc-500 hover:text-white transition-colors disabled:opacity-40'>
//                     <X size={20} />
//                 </button>

//                 <h2 className='text-3xl sm:text-4xl font-bold mb-2 tracking-wide text-primary uppercase leading-none font-["Teko","Oswald",sans-serif]'>SUBMIT LOG REPORT</h2>
//                 <p className='text-zinc-500 text-xs mb-10 tracking-wider uppercase whitespace-pre-line font-["Teko","Oswald",sans-serif]'>{formatText(task.title)}</p>

//                 {displayError && (
//                     <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
//                         <AlertCircle size={14} /> {displayError}
//                     </div>
//                 )}

//                 <div className='mb-8 font-["Teko","Oswald",sans-serif]'>
//                     <div className='flex items-center justify-between gap-4 mb-4'>
//                         <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
//                             <Link size={12} /> PROOF LINKS / URLS
//                         </label>
//                         <button
//                             type='button'
//                             onClick={handleAddLink}
//                             disabled={isSubmitting}
//                             className='hover:cursor-pointer flex items-center gap-1 h-7 border border-primary/40 bg-primary/5 text-primary px-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed font-["Teko","Oswald",sans-serif]'
//                         >
//                             <Plus size={11} /> ADD LINK
//                         </button>
//                     </div>

//                     <div className='space-y-2.5'>
//                         {links.map((link, index) => (
//                             <div key={index} className='flex items-center gap-3'>
//                                 <input
//                                     type='text'
//                                     value={link}
//                                     onChange={(e) => handleLinkChange(index, e.target.value)}
//                                     disabled={isSubmitting}
//                                     placeholder={`HTTPS://E.G., PROOF-LINK-0${index + 1}.COM`}
//                                     className='flex-1 min-w-0 h-[52px] bg-black border border-zinc-900 px-4 text-xs focus:border-primary outline-none text-zinc-200 normal-case font-medium tracking-wide placeholder:text-zinc-800 placeholder:uppercase font-["Teko","Oswald",sans-serif]'
//                                 />
//                                 {links.length > 1 && (
//                                     <button
//                                         type='button'
//                                         onClick={() => handleRemoveLink(index)}
//                                         disabled={isSubmitting}
//                                         className='hover:cursor-pointer flex-none flex items-center justify-center w-12 h-[52px] bg-black border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-40'
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <button
//                     type='button'
//                     onClick={handleSubmitClick}
//                     disabled={isSubmitting}
//                     className='hover:cursor-pointer w-full h-[65px] bg-primary text-black font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'
//                 >
//                     {isSubmitting ? (
//                         <><Loader2 size={16} className='animate-spin' /> SUBMITTING...</>
//                     ) : 'SUBMIT TASK //'}
//                 </button>
//             </motion.div>
//         </motion.div>,
//         document.body
//     );
// }
// To connect this with your main component's state/API call, update handleSubmit in SpecificTasksPage:

// TypeScript
// const handleSubmit = async (task: any, proofUrls: string[]) => {
//     if (!task?._id) return;
//     if (submittingTaskId === task._id || submittedTaskIds.has(task._id)) return;

//     setSubmittingTaskId(task._id);
//     setSubmitError('');
//     setFeedback(null);

//     try {
//         const { data } = await api.post('/api/ambassador/submitSpecificTask', {
//             taskId: task._id,
//             proofUrls,
//         });

//         if (data?.success !== false) {
//             setSubmittedTaskIds(prev => {
//                 const next = new Set(prev);
//                 next.add(task._id);
//                 return next;
//             });
//             setFeedback({ type: 'success', message: data?.message || 'TASK SUBMITTED SUCCESSFULLY.' });
//             queryClient.invalidateQueries({ queryKey: ['specific-tasks'] });
//             setIsSubmitModalOpen(false);
//             setSelectedTask(null);
//         } else {
//             setSubmitError(data?.message || 'SUBMISSION FAILED. TRY AGAIN.');
//         }
//     } catch (err: any) {
//         setSubmitError(err?.response?.data?.message || 'SUBMISSION FAILED. CHECK CONNECTION AND TRY AGAIN.');
//     } finally {
//         setSubmittingTaskId(null);
//     }
// };



'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Info, Send, Clock, CheckCircle2, AlertCircle, Loader2, Gift, X, Plus, Trash2,
    FileText, Image as ImageIcon, Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import api from '@/lib/api';

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

/* ─── Converts literal "\n" sequences into real line breaks ─── */
const formatText = (text: any): string => String(text ?? '').replace(/\\n/g, '\n');

export default function SpecificTasksPage() {
    const queryClient = useQueryClient();

    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
    const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
    const [submitError, setSubmitError] = useState('');
    const [feedback, setFeedback] = useState<FeedbackState>(null);

    /* ─── Specific tasks data ─── */
    const { data: tasks, isLoading, isError, error } = useQuery({
        queryKey: ['specific-tasks'],
        queryFn: async () => {
            const { data } = await api.get('/api/ambassador/getSpecificTasks');
            if (data?.success === false) {
                throw new Error(data?.message || 'FAILED TO LOAD TASKS.');
            }
            return Array.isArray(data?.tasks) ? data.tasks : [];
        },
        staleTime: 5 * 60 * 1000,
    });

    /* Auto-dismiss feedback banner */
    useEffect(() => {
        if (!feedback) return;
        const t = setTimeout(() => setFeedback(null), 4000);
        return () => clearTimeout(t);
    }, [feedback]);

    /* ─── Handlers ─── */
    const handleDeploy = (task: any) => {
        if (!task?._id) return;
        if (submittingTaskId === task._id || submittedTaskIds.has(task._id)) return;
        setSubmitError('');
        setSelectedTask(task);
        setIsSubmitModalOpen(true);
    };

    const handleSubmit = async (task: any, proofUrls: string[]) => {
        if (!task?._id) return;
        if (submittingTaskId === task._id || submittedTaskIds.has(task._id)) return;

        setSubmittingTaskId(task._id);
        setSubmitError('');
        setFeedback(null);

        try {
            const { data } = await api.post('/api/ambassador/submitSpecificTask', {
                taskId: task._id,
                proofUrls,
            });

            if (data?.success !== false) {
                setSubmittedTaskIds(prev => {
                    const next = new Set(prev);
                    next.add(task._id);
                    return next;
                });
                setFeedback({ type: 'success', message: data?.message || 'TASK SUBMITTED SUCCESSFULLY.' });
                queryClient.invalidateQueries({ queryKey: ['specific-tasks'] });
                setIsSubmitModalOpen(false);
                setSelectedTask(null);
            } else {
                setSubmitError(data?.message || 'SUBMISSION FAILED. TRY AGAIN.');
            }
        } catch (err: any) {
            setSubmitError(err?.response?.data?.message || 'SUBMISSION FAILED. CHECK CONNECTION AND TRY AGAIN.');
        } finally {
            setSubmittingTaskId(null);
        }
    };

    const tekoFont = { fontFamily: '"Teko", "Oswald", sans-serif' };

    /* ─── Render ─── */
    return (
        <div style={tekoFont} className='p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 bg-transparent min-h-screen text-white uppercase overflow-x-hidden antialiased'>
            {/* Header */}
            <header className='flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-[3px] border-primary pl-4 sm:pl-6 py-0.5 relative z-10'>
                <div>
                    {/* <p className='text-primary text-xs sm:text-sm font-medium tracking-[0.15em] mb-1 opacity-90'>Special Operations Active</p> */}
                    <h1 className='text-4xl sm:text-5xl lg:text-6xl font-["Teko","Oswald",sans-serif] font-bold tracking-[0.06em] uppercase leading-none text-zinc-100'>
                        BONUS XP <span className='text-primary'>MISSIONS</span>
                    </h1>
                </div>
            </header>

            {/* Feedback banner */}
            <AnimatePresence>
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`relative z-10 p-3 border text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-between gap-2 ${
                            feedback.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                : 'bg-red-500/10 border-red-500/20 text-red-500'
                        }`}
                    >
                        <span className='flex items-center gap-2'>
                            {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                            {feedback.message}
                        </span>
                        <button type='button' onClick={() => setFeedback(null)} className='hover:cursor-pointer opacity-70 hover:opacity-100 transition-opacity'>
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Body */}
            <div className='space-y-4 relative z-10'>
                {isLoading ? (
                    <div className='py-20 flex flex-col items-center justify-center text-center'>
                        <Loader2 className='w-8 h-8 text-primary animate-spin mb-4' />
                        <p className='text-xs sm:text-sm font-medium tracking-[0.25em] text-primary/50'>Syncing Encrypted Data...</p>
                    </div>
                ) : isError ? (
                    <div className='border border-red-500/20 bg-red-500/5 p-10 text-center'>
                        <p className='text-red-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
                            {(error as any)?.response?.data?.message || (error as any)?.message || 'FAILED TO LOAD TASKS.'}
                        </p>
                    </div>
                ) : tasks && tasks.length > 0 ? (
                    tasks.map((task: any) => (
                        <SpecificTaskCard
                            key={task._id}
                            task={task}
                            isSubmitting={submittingTaskId === task._id}
                            isSubmitted={submittedTaskIds.has(task._id)}
                            onViewDetails={() => {
                                setSelectedTask(task);
                                setIsSubmitModalOpen(false);
                            }}
                            onDeploy={() => handleDeploy(task)}
                        />
                    ))
                ) : (
                    <div className='border border-zinc-900 bg-zinc-950/40 p-10 text-center'>
                        <p className='text-zinc-500 text-xs sm:text-sm font-medium tracking-wider uppercase'>
                            No Data Recovered in this sector.
                        </p>
                    </div>
                )}
            </div>

            {/* ── Detail modal ── */}
            <AnimatePresence mode='wait'>
                {selectedTask && !isSubmitModalOpen && (
                    <SpecificTaskDetailModal
                        task={selectedTask}
                        isSubmitting={submittingTaskId === selectedTask._id}
                        isSubmitted={submittedTaskIds.has(selectedTask._id)}
                        onClose={() => setSelectedTask(null)}
                        onDeploy={() => handleDeploy(selectedTask)}
                    />
                )}
            </AnimatePresence>

            {/* ── Submission modal ── */}
            <AnimatePresence mode='wait'>
                {isSubmitModalOpen && selectedTask && (
                    <SpecificSubmissionModal
                        task={selectedTask}
                        isSubmitting={submittingTaskId === selectedTask._id}
                        errorMsg={submitError}
                        onClose={() => {
                            setIsSubmitModalOpen(false);
                            setSelectedTask(null);
                            setSubmitError('');
                        }}
                        onSubmit={(proofUrls: string[]) => handleSubmit(selectedTask, proofUrls)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Specific task card
   ═══════════════════════════════════════════════════════════════════ */

function SpecificTaskCard({ task, isSubmitting, isSubmitted, onViewDetails, onDeploy }: any) {
    const statusColors: any = {
        'Upcoming':    'border-yellow-500/40 text-yellow-500 bg-yellow-500/5',
        'In Progress': 'border-blue-500/40   text-blue-500   bg-blue-500/5',
        'In Review':   'border-primary/40    text-primary    bg-primary/5',
        'Completed':   'border-green-500/40  text-green-500  bg-green-500/5'
    };

    const isDisabled = isSubmitting || isSubmitted;

    const buttonStyle = isSubmitted
        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
        : isDisabled
            ? 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40'
            : 'bg-primary text-black hover:bg-white';

    return (
        <div
            onClick={onViewDetails}
            className='bg-zinc-950/40 border border-zinc-900 p-5 sm:p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6 group hover:border-primary/30 hover:bg-zinc-900/10 cursor-pointer transition-all relative overflow-hidden'
        >
            <div className='space-y-3 flex-1'>
                <div className='flex flex-wrap items-center gap-2 sm:gap-3'>
                    {task.status && (
                        <span className={`px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border leading-none ${statusColors[task.status] || 'border-zinc-800'}`}>
                            {task.status === 'In Progress' ? 'Live' : task.status}
                        </span>
                    )}
                    {task.rpReward !== undefined && (
                        <span className='bg-primary/5 text-primary px-2.5 py-0.5 text-xs sm:text-sm font-medium tracking-wide border border-primary/20 leading-none'>
                            + {task.rpReward} XP
                        </span>
                    )}
                    {task.taskType && (
                        <span className='text-zinc-500 text-xs sm:text-sm font-light tracking-wide flex items-center gap-1 leading-none'>
                            <Clock size={11} /> {task.taskType}
                        </span>
                    )}
                </div>
                <div>
                    <h2 className='text-2xl sm:text-3xl font-["Teko","Oswald",sans-serif] font-bold tracking-wide text-white mb-1.5 uppercase leading-none whitespace-pre-line group-hover:text-primary transition-colors'>
                        {formatText(task.title)}
                    </h2>
                    <p className='text-zinc-300 text-sm sm:text-base font-semibold tracking-wide max-w-2xl uppercase whitespace-pre-line line-clamp-2 sm:line-clamp-none leading-tight'>
                        {formatText(task.description)}
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
                        {isSubmitting ? 'SUBMITTING...' : isSubmitted ? 'SUBMITTED' : 'Submit Task'}
                    </span>
                    {isSubmitting ? (
                        <Loader2 size={15} className='skew-x-10 animate-spin' />
                    ) : isSubmitted ? (
                        <CheckCircle2 size={15} className='skew-x-10' />
                    ) : (
                        <Send size={15} className='skew-x-10' />
                    )}
                </button>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Specific task detail modal
   ═══════════════════════════════════════════════════════════════════ */

function SpecificTaskDetailModal({ task, isSubmitting, isSubmitted, onClose, onDeploy }: any) {
    const isDisabled = isSubmitting || isSubmitted;

    const buttonStyle = isSubmitted
        ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/20'
        : isDisabled
            ? 'bg-zinc-800/60 text-zinc-400 border border-zinc-700/40 hover:bg-zinc-800/60'
            : 'bg-white text-black hover:bg-primary';

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-2xl w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar'
            >
                <button onClick={onClose} className='hover:cursor-pointer absolute top-4 right-4 sm:top-5 sm:right-5 text-zinc-500 hover:text-white transition-colors z-10'>
                    <X size={20} />
                </button>

                <h2 className='text-3xl sm:text-4xl font-bold mb-5 tracking-wide text-white uppercase leading-none whitespace-pre-line font-["Teko","Oswald",sans-serif]'>
                    {formatText(task.title)}
                </h2>

                <div className='space-y-5 mb-6 sm:mb-8 font-["Teko","Oswald",sans-serif]'>
                    <div className='border-l-2 border-zinc-900 pl-4'>
                        <h4 className='text-xs sm:text-sm font-medium text-zinc-500 mb-1.5 uppercase tracking-wider leading-none font-["Teko","Oswald",sans-serif]'>Task Description</h4>
                        <p className='text-sm sm:text-base leading-relaxed text-zinc-300 font-semibold normal-case whitespace-pre-wrap font-["Teko","Oswald",sans-serif]'>{formatText(task.description)}</p>
                    </div>

                    {(task.subGuide || task.rpSummary) && (
                        <div className='border-l-2 border-primary/40 bg-primary/2 p-3 pl-4 flex flex-col gap-2'>
                            <div className='flex items-center justify-between gap-4'>
                                <h4 className='text-xs sm:text-sm font-medium text-primary uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
                                    <FileText size={12} /> How to Complete
                                </h4>
                            </div>
                            <p className='text-sm sm:text-base leading-relaxed whitespace-pre-wrap text-zinc-200 font-semibold uppercase font-["Teko","Oswald",sans-serif]'>
                                {formatText(task.subGuide || task.rpSummary)}
                            </p>
                        </div>
                    )}

                    {task.rewards && (
                        <div className='border-l-2 border-[#f4c430]/40 bg-[#f4c430]/2 p-3 pl-4'>
                            <h4 className='text-xs sm:text-sm font-medium text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5 leading-none font-["Teko","Oswald",sans-serif]'>
                                <Gift size={12} /> Rewards Breakdown
                            </h4>
                            <p className='text-sm sm:text-base leading-relaxed text-zinc-200 font-semibold normal-case whitespace-pre-wrap font-["Teko","Oswald",sans-serif]'>
                                {formatText(task.rewards)}
                            </p>
                        </div>
                    )}

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
                        {task.rpReward !== undefined && (
                            <div className='bg-black border border-zinc-900 p-4 leading-none'>
                                <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>XP Reward</span>
                                <span className='text-xl sm:text-2xl text-primary font-bold font-["Teko","Oswald",sans-serif]'>+{task.rpReward} XP</span>
                            </div>
                        )}
                        {task.taskType && (
                            <div className='bg-black border border-zinc-900 p-4 leading-none'>
                                <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>TASK TYPE</span>
                                <span className='text-xl sm:text-2xl font-bold text-white font-["Teko","Oswald",sans-serif]'>{task.taskType}</span>
                            </div>
                        )}
                        {task.isImageAllowed !== undefined && (
                            <div className='bg-black border border-zinc-900 p-4 leading-none'>
                                <span className='text-xs sm:text-sm text-zinc-500 block mb-1 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>VALIDATION METHOD</span>
                                <span className='text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                                    {task.isImageAllowed
                                        ? <ImageIcon size={14} className='text-primary' />
                                        : <Link size={14} className='text-primary' />
                                    } {task.isImageAllowed ? 'VISUAL PROOF (MAX 4)' : 'URL VALIDATION ONLY'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type='button'
                    onClick={onDeploy}
                    disabled={isDisabled}
                    className={`hover:cursor-pointer w-full py-3.5 font-bold tracking-widest transition-all uppercase text-xs sm:text-sm active:bg-primary leading-none font-["Teko","Oswald",sans-serif] flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:active:scale-100 ${buttonStyle} ${isDisabled ? 'opacity-60' : ''}`}
                >
                    {isSubmitting && <Loader2 size={15} className='animate-spin' />}
                    <span>
                        {isSubmitting ? 'SUBMITTING...' : isSubmitted ? 'SUBMITTED' : 'Submit Task //'}
                    </span>
                </button>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════════════
   Specific task submission modal (portal) — "Submit Log Report"
   ═══════════════════════════════════════════════════════════════════ */

function SpecificSubmissionModal({ task, isSubmitting, errorMsg, onClose, onSubmit }: any) {
    const [mounted, setMounted] = useState(false);
    const [links, setLinks] = useState<string[]>(['']);
    const [localError, setLocalError] = useState('');

    useEffect(() => { setMounted(true); }, []);

    const handleLinkChange = (index: number, value: string) => {
        setLinks(prev => prev.map((l, i) => (i === index ? value : l)));
        if (localError) setLocalError('');
    };

    const handleAddLink = () => setLinks(prev => [...prev, '']);

    const handleRemoveLink = (index: number) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitClick = () => {
        if (isSubmitting) return;
        const proofUrls = links.map(l => l.trim()).filter(Boolean);
        if (proofUrls.length === 0) {
            setLocalError('INCLUDE THE SUBMISSION LINK');
            return;
        }
        onSubmit(proofUrls);
    };

    if (!mounted) return null;

    const displayError = errorMsg || localError;

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'
        >
            <motion.div
                initial={{ scale: 0.95, y: 15 }} animate={{ scale: 1, y: 0 }}
                className='bg-zinc-950 border border-zinc-900 p-6 sm:p-10 max-w-[640px] w-full relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'
            >
                <button type='button' onClick={onClose} disabled={isSubmitting} className='hover:cursor-pointer absolute top-4 right-4 sm:top-6 sm:right-6 text-zinc-500 hover:text-white transition-colors disabled:opacity-40'>
                    <X size={20} />
                </button>

                <h2 className='text-3xl sm:text-4xl font-bold mb-2 tracking-wide text-primary uppercase leading-none font-["Teko","Oswald",sans-serif]'>SUBMIT LOG REPORT</h2>
                <p className='text-zinc-500 text-xs mb-10 tracking-wider uppercase whitespace-pre-line font-["Teko","Oswald",sans-serif]'>{formatText(task.title)}</p>

                {displayError && (
                    <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                        <AlertCircle size={14} /> {displayError}
                    </div>
                )}

                <div className='mb-8 font-["Teko","Oswald",sans-serif]'>
                    <div className='flex items-center justify-between gap-4 mb-4'>
                        <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                            <Link size={12} /> PROOF LINKS / URLS
                        </label>
                        <button
                            type='button'
                            onClick={handleAddLink}
                            disabled={isSubmitting}
                            className='hover:cursor-pointer flex items-center gap-1 h-7 border border-primary/40 bg-primary/5 text-primary px-3 text-[10px] font-bold tracking-widest uppercase hover:bg-primary hover:text-black transition-all disabled:opacity-40 disabled:cursor-not-allowed font-["Teko","Oswald",sans-serif]'
                        >
                            <Plus size={11} /> ADD LINK
                        </button>
                    </div>

                    <div className='space-y-2.5'>
                        {links.map((link, index) => (
                            <div key={index} className='flex items-center gap-3'>
                                <input
                                    type='text'
                                    value={link}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    disabled={isSubmitting}
                                    placeholder={`HTTPS://E.G., PROOF-LINK-0${index + 1}.COM`}
                                    className='flex-1 min-w-0 h-[52px] bg-black border border-zinc-900 px-4 text-xs focus:border-primary outline-none text-zinc-200 normal-case font-medium tracking-wide placeholder:text-zinc-800 placeholder:uppercase font-["Teko","Oswald",sans-serif]'
                                />
                                {links.length > 1 && (
                                    <button
                                        type='button'
                                        onClick={() => handleRemoveLink(index)}
                                        disabled={isSubmitting}
                                        className='hover:cursor-pointer flex-none flex items-center justify-center w-12 h-[52px] bg-black border border-zinc-900 text-zinc-600 hover:text-white hover:border-zinc-700 transition-all disabled:opacity-40'
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type='button'
                    onClick={handleSubmitClick}
                    disabled={isSubmitting}
                    className='hover:cursor-pointer w-full h-[65px] bg-primary text-black font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'
                >
                    {isSubmitting ? (
                        <><Loader2 size={16} className='animate-spin' /> SUBMITTING...</>
                    ) : 'SUBMIT TASK //'}
                </button>
            </motion.div>
        </motion.div>,
        document.body
    );
}