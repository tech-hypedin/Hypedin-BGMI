// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { X, AlertCircle, Loader2, Image as ImageIcon, Plus, Trash2, Link, UploadCloud } from 'lucide-react';

// import api from '@/lib/api';

// interface SubmissionModalProps {
//     task: any;
//     actionState?: string;
//     reSubmissionRequestId?: string;
//     onClose: () => void;
//     onSuccess?: () => void;
// }

// function SubmissionModal({ task, actionState, reSubmissionRequestId, onClose, onSuccess }: SubmissionModalProps) {
//     if (!task) return null;

//     const [urls, setUrls] = useState<string[]>(['']);
//     const [selectedImages, setSelectedImages] = useState<File[]>([]);
//     const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [errorMsg, setErrorMsg] = useState('');

//     const isResubmit = actionState === 'resubmit';

//     const handleAddUrlField = () => {
//         if (urls.length < 4) {
//             setUrls([...urls, '']);
//         }
//     };

//     const handleRemoveUrlField = (index: number) => {
//         if (urls.length > 1) {
//             const updated = urls.filter((_, i) => i !== index);
//             setUrls(updated);
//         }
//     };

//     const handleUrlChange = (index: number, val: string) => {
//         const updated = [...urls];
//         updated[index] = val;
//         setUrls(updated);
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return;

//         const filesArray = Array.from(e.target.files);
//         const totalCount = selectedImages.length + filesArray.length;

//         if (totalCount > 4) {
//             setErrorMsg('MAX PROTOCOL REACHED: 4 Images allowed maximum.');
//             return;
//         }

//         setErrorMsg('');
//         const newPreviews = filesArray.map(file => URL.createObjectURL(file));

//         setSelectedImages(prev => [...prev, ...filesArray]);
//         setImagePreviews(prev => [...prev, ...newPreviews]);

//         e.target.value = '';
//     };

//     const handleRemoveImage = (index: number) => {
//         URL.revokeObjectURL(imagePreviews[index]);
//         setSelectedImages(prev => prev.filter((_, i) => i !== index));
//         setImagePreviews(prev => prev.filter((_, i) => i !== index));
//     };

//     const handleSubmitMission = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsSubmitting(true);
//         setErrorMsg('');

//         const proofUrls = urls.map(u => u.trim()).filter(u => u.length > 0);

//         try {
//             const formData = new FormData();
//             formData.append('taskId', task._id);
//             formData.append('proofUrls', JSON.stringify(proofUrls));

//             if (task.isImageAllowed && selectedImages.length > 0) {
//                 selectedImages.forEach((img) => {
//                     formData.append('images', img);
//                 });
//             }

//             if (isResubmit) {
//                 formData.append('reSubmissionRequestId', reSubmissionRequestId || '');
//                 await api.put('/api/reSubmissionRequest/reSubmitTask', formData, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             } else {
//                 await api.post('/api/ambassador/mission', formData, {
//                     headers: { 'Content-Type': 'multipart/form-data' }
//                 });
//             }

//             setIsSuccess(true);
//         } catch (error: any) {
//             setErrorMsg(error?.response?.data?.message || 'SUBMISSION FAILURE: Check interface status.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handleDoneClick = () => {
//         if (onSuccess) {
//             onSuccess();
//         } else {
//             onClose();
//         }
//     };

//     return (
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'>

//             {isSuccess ? (
//                 <motion.div
//                     initial={{ scale: 0.9, y: 15 }}
//                     animate={{ scale: 1, y: 0 }}
//                     className="relative bg-[#0d0d0d] border-2 border-[#ffb60e]/30 w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(255,182,14,0.15)] rounded-none p-6 text-center space-y-6 font-['Teko','Oswald',sans-serif]"
//                 >
//                     <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffb60e]"></div>
//                     <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffb60e]"></div>
//                     <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ffb60e]"></div>
//                     <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ffb60e]"></div>

//                     <div className="flex justify-center pt-4">
//                         <div className="w-16 h-16 rounded-full border border-[#ffb60e] flex items-center justify-center bg-[#ffb60e]/5 relative">
//                             <div className="absolute inset-1 rounded-full border border-dashed border-[#ffb60e]/40 animate-[spin_20s_linear_infinite]"></div>
//                             <svg className="w-8 h-8 text-[#ffb60e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                             </svg>
//                         </div>
//                     </div>

//                     <div className="space-y-1">
//                         <h2 className="text-[#ffb60e] text-3xl sm:text-4xl font-black tracking-wider uppercase font-['Teko','Oswald',sans-serif]">
//                             MISSION ACCOMPLISHED
//                         </h2>
//                         <p className="text-zinc-400 text-sm font-bold tracking-[0.2em] uppercase font-['Teko','Oswald',sans-serif]">
//                             YOUR APPLICATION HAS BEEN SUBMITTED
//                         </p>
//                     </div>

//                     <div className="pt-4 flex justify-center">
//                         <button
//                             type="button"
//                             onClick={handleDoneClick}
//                             className="relative w-full max-w-[240px] bg-[#ffb60e] hover:bg-[#ffe169] text-black font-black text-xl py-2 px-6 tracking-[0.3em] uppercase transition-all rounded-none border-none clip-path-button active:translate-y-[2px]"
//                             style={{
//                                 clipPath: 'polygon(0 0, 100% 0, 100% 75%, 94% 100%, 0 100%)'
//                             }}
//                         >
//                             DONE
//                         </button>
//                     </div>
//                 </motion.div>
//             ) : (
//                 <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'>
//                     <button type='button' onClick={onClose} className='absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors'><X size={20} /></button>

//                     <h2 className='text-2xl sm:text-3xl font-bold mb-1 tracking-wide text-primary uppercase font-["Teko","Oswald",sans-serif]'>{isResubmit ? 'RESUBMIT LOG REPORT' : 'SUBMIT LOG REPORT'}</h2>
//                     <p className='text-zinc-500 text-xs mb-6 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>{task.title}</p>

//                     {errorMsg && (
//                         <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
//                             <AlertCircle size={14} /> {errorMsg}
//                         </div>
//                     )}

//                     <form onSubmit={handleSubmitMission} className='space-y-6'>

//                         <div className='space-y-3 font-["Teko","Oswald",sans-serif]'>
//                             <div className='flex justify-between items-center font-["Teko","Oswald",sans-serif]'>
//                                 <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
//                                     <Link size={12} /> PROOF LINKS / URLS
//                                 </label>
//                                 {(task.title !== "TDM BATTLEGROUND (WEEK 1 & 2)" && task.title !== "TDM BATTLEGROUND (WEEK 3 & 4)" ) && urls.length < 4 && (
//                                     <button type='button' onClick={handleAddUrlField} className='text-[11px] font-black tracking-widest text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 hover:bg-primary hover:text-black transition-all flex items-center gap-1 font-["Teko","Oswald",sans-serif]'>
//                                         <Plus size={10} /> ADD LINK
//                                     </button>
//                                 )}
//                             </div>
//                             <div className='space-y-2 font-["Teko","Oswald",sans-serif]'>
//                                 {urls.map((url, index) => (
//                                     <div key={index} className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
//                                         <input
//                                             type='url'
//                                             required
//                                             placeholder={`HTTPS://E.G., PROOF-LINK-0${index + 1}.COM`}
//                                             value={url}
//                                             onChange={(e) => handleUrlChange(index, e.target.value)}
//                                             className='flex-1 bg-black border border-zinc-900 p-3 text-xs focus:border-primary outline-none text-zinc-200 normal-case font-medium placeholder:text-zinc-800 font-["Teko","Oswald",sans-serif]'
//                                         />
//                                         {urls.length > 1 && (
//                                             <button type='button' onClick={() => handleRemoveUrlField(index)} className='p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 border border-zinc-900/60 hover:border-red-500/20 transition-all'>
//                                                 <Trash2 size={14} />
//                                             </button>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>

//                         {task.isImageAllowed && (
//                             <div className='space-y-3 border-t border-zinc-900 pt-4 font-["Teko","Oswald",sans-serif]'>
//                                 <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
//                                     <ImageIcon size={12} /> VISUAL PROOF SNAPSHOTS (MAX IMAGES 4, MAX SIZE 35MB)
//                                 </label>

//                                 <div className="p-4 border border-zinc-900 bg-black/40 flex flex-col items-center justify-center gap-3 rounded-sm font-['Teko','Oswald',sans-serif]">
//                                     <UploadCloud size={28} className="text-zinc-500 animate-pulse" />
//                                     <label className="bg-zinc-900 text-zinc-200 px-4 py-2 text-xs font-bold tracking-widest border border-zinc-800 hover:border-primary hover:text-primary transition-all cursor-pointer rounded-sm uppercase font-['Teko','Oswald',sans-serif]">
//                                         Select Operational Images
//                                         <input key={task._id} type='file' accept={task.title.includes('LIVIK') ? 'application/pdf' : 'image/*, video/mp4'} multiple onChange={handleImageChange} className='hidden' />
//                                     </label>
//                                     <span className="text-[10px] text-zinc-600 font-['Teko','Oswald',sans-serif]">JPG, PNG OR WEBP UP TO 4 TILES</span>
//                                 </div>

//                                 {imagePreviews.length > 0 && (
//                                     <div className='grid grid-cols-4 gap-2 pt-2'>
//                                         {imagePreviews.map((preview, index) => (
//                                             <div key={index} className='aspect-square relative bg-black border border-zinc-900 group overflow-hidden'>
//                                                 <img src={preview} alt='preview' className='object-cover w-full h-full' />
//                                                 <button type='button' onClick={() => handleRemoveImage(index)} className='absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
//                                                     <X size={16} />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         )}

//                         <button type='submit' disabled={isSubmitting} className='w-full bg-primary text-black py-4 font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'>
//                             {isSubmitting ? (
//                                 <><Loader2 size={16} className='animate-spin' />{isResubmit ? 'RESUBMITTING TASK...' : 'SUBMITTING TASK...'}</>
//                             ) : (isResubmit ? 'RESUBMIT TASK //' : 'SUBMIT TASK //')}
//                         </button>
//                     </form>
//                 </motion.div>
//             )}
//         </motion.div>
//     );
// }

// export default SubmissionModal;




'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, Loader2, Image as ImageIcon, Plus, Trash2, Link, UploadCloud } from 'lucide-react';

import api from '@/lib/api';

interface SubmissionModalProps {
    task: any;
    actionState?: string;
    reSubmissionRequestId?: string;
    onClose: () => void;
    onSuccess?: () => void;
}

/* ─── Tasks limited to 2 proof link fields ─── */
const TWO_LINK_TASK_IDS = [
    '6a9c16f3093c4e366e2e623f',
    '6a9c17bcf4853e9901eeee21',
];

function SubmissionModal({ task, actionState, reSubmissionRequestId, onClose, onSuccess }: SubmissionModalProps) {
    if (!task) return null;

    const [urls, setUrls] = useState<string[]>(['']);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const isResubmit = actionState === 'resubmit';

    const maxUrlFields = TWO_LINK_TASK_IDS.includes(String(task._id)) ? 2 : 4;

    const handleAddUrlField = () => {
        if (urls.length < maxUrlFields) {
            setUrls([...urls, '']);
        }
    };

    const handleRemoveUrlField = (index: number) => {
        if (urls.length > 1) {
            const updated = urls.filter((_, i) => i !== index);
            setUrls(updated);
        }
    };

    const handleUrlChange = (index: number, val: string) => {
        const updated = [...urls];
        updated[index] = val;
        setUrls(updated);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        const totalCount = selectedImages.length + filesArray.length;

        if (totalCount > 4) {
            setErrorMsg('MAX PROTOCOL REACHED: 4 Images allowed maximum.');
            return;
        }

        setErrorMsg('');
        const newPreviews = filesArray.map(file => URL.createObjectURL(file));

        setSelectedImages(prev => [...prev, ...filesArray]);
        setImagePreviews(prev => [...prev, ...newPreviews]);

        e.target.value = '';
    };

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitMission = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMsg('');

        const proofUrls = urls.map(u => u.trim()).filter(u => u.length > 0);

        try {
            const formData = new FormData();
            formData.append('taskId', task._id);
            formData.append('proofUrls', JSON.stringify(proofUrls));

            if (task.isImageAllowed && selectedImages.length > 0) {
                selectedImages.forEach((img) => {
                    formData.append('images', img);
                });
            }

            if (isResubmit) {
                formData.append('reSubmissionRequestId', reSubmissionRequestId || '');
                await api.put('/api/reSubmissionRequest/reSubmitTask', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/api/ambassador/mission', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsSuccess(true);
        } catch (error: any) {
            setErrorMsg(error?.response?.data?.message || 'SUBMISSION FAILURE: Check interface status.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDoneClick = () => {
        if (onSuccess) {
            onSuccess();
        } else {
            onClose();
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[110] flex items-center justify-center bg-black/98 backdrop-blur-md p-4 font-["Teko","Oswald",sans-serif]'>

            {isSuccess ? (
                <motion.div
                    initial={{ scale: 0.9, y: 15 }}
                    animate={{ scale: 1, y: 0 }}
                    className="relative bg-[#0d0d0d] border-2 border-[#ffb60e]/30 w-full max-w-md overflow-hidden shadow-[0_0_50px_rgba(255,182,14,0.15)] rounded-none p-6 text-center space-y-6 font-['Teko','Oswald',sans-serif]"
                >
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ffb60e]"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ffb60e]"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ffb60e]"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ffb60e]"></div>

                    <div className="flex justify-center pt-4">
                        <div className="w-16 h-16 rounded-full border border-[#ffb60e] flex items-center justify-center bg-[#ffb60e]/5 relative">
                            <div className="absolute inset-1 rounded-full border border-dashed border-[#ffb60e]/40 animate-[spin_20s_linear_infinite]"></div>
                            <svg className="w-8 h-8 text-[#ffb60e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h2 className="text-[#ffb60e] text-3xl sm:text-4xl font-black tracking-wider uppercase font-['Teko','Oswald',sans-serif]">
                            MISSION ACCOMPLISHED
                        </h2>
                        <p className="text-zinc-400 text-sm font-bold tracking-[0.2em] uppercase font-['Teko','Oswald',sans-serif]">
                            YOUR APPLICATION HAS BEEN SUBMITTED
                        </p>
                    </div>

                    <div className="pt-4 flex justify-center">
                        <button
                            type="button"
                            onClick={handleDoneClick}
                            className="relative w-full max-w-[240px] bg-[#ffb60e] hover:bg-[#ffe169] text-black font-black text-xl py-2 px-6 tracking-[0.3em] uppercase transition-all rounded-none border-none clip-path-button active:translate-y-[2px]"
                            style={{
                                clipPath: 'polygon(0 0, 100% 0, 100% 75%, 94% 100%, 0 100%)'
                            }}
                        >
                            DONE
                        </button>
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className='bg-zinc-950 border border-zinc-900 p-6 sm:p-8 max-w-lg w-full relative shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'>
                    <button type='button' onClick={onClose} className='absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors'><X size={20} /></button>

                    <h2 className='text-2xl sm:text-3xl font-bold mb-1 tracking-wide text-primary uppercase font-["Teko","Oswald",sans-serif]'>{isResubmit ? 'RESUBMIT LOG REPORT' : 'SUBMIT LOG REPORT'}</h2>
                    <p className='text-zinc-500 text-xs mb-6 tracking-wider uppercase font-["Teko","Oswald",sans-serif]'>{task.title}</p>

                    {errorMsg && (
                        <div className='p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                            <AlertCircle size={14} /> {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmitMission} className='space-y-6'>

                        <div className='space-y-3 font-["Teko","Oswald",sans-serif]'>
                            <div className='flex justify-between items-center font-["Teko","Oswald",sans-serif]'>
                                <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                                    <Link size={12} /> PROOF LINKS / URLS
                                </label>
                                {(task.title !== "TDM BATTLEGROUND (WEEK 1 & 2)" && task.title !== "TDM BATTLEGROUND (WEEK 3 & 4)" ) && urls.length < maxUrlFields && (
                                    <button type='button' onClick={handleAddUrlField} className='text-[11px] font-black tracking-widest text-primary border border-primary/20 bg-primary/5 px-2 py-0.5 hover:bg-primary hover:text-black transition-all flex items-center gap-1 font-["Teko","Oswald",sans-serif]'>
                                        <Plus size={10} /> ADD LINK
                                    </button>
                                )}
                            </div>
                            <div className='space-y-2 font-["Teko","Oswald",sans-serif]'>
                                {urls.map((url, index) => (
                                    <div key={index} className='flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                                        <input
                                            type='url'
                                            required
                                            placeholder={`HTTPS://E.G., PROOF-LINK-0${index + 1}.COM`}
                                            value={url}
                                            onChange={(e) => handleUrlChange(index, e.target.value)}
                                            className='flex-1 bg-black border border-zinc-900 p-3 text-xs focus:border-primary outline-none text-zinc-200 normal-case font-medium placeholder:text-zinc-800 font-["Teko","Oswald",sans-serif]'
                                        />
                                        {urls.length > 1 && (
                                            <button type='button' onClick={() => handleRemoveUrlField(index)} className='p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 border border-zinc-900/60 hover:border-red-500/20 transition-all'>
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {task.isImageAllowed && (
                            <div className='space-y-3 border-t border-zinc-900 pt-4 font-["Teko","Oswald",sans-serif]'>
                                <label className='text-xs font-bold text-zinc-400 tracking-widest flex items-center gap-1.5 font-["Teko","Oswald",sans-serif]'>
                                    <ImageIcon size={12} /> VISUAL PROOF SNAPSHOTS (MAX IMAGES 4, MAX SIZE 35MB)
                                </label>

                                <div className="p-4 border border-zinc-900 bg-black/40 flex flex-col items-center justify-center gap-3 rounded-sm font-['Teko','Oswald',sans-serif]">
                                    <UploadCloud size={28} className="text-zinc-500 animate-pulse" />
                                    <label className="bg-zinc-900 text-zinc-200 px-4 py-2 text-xs font-bold tracking-widest border border-zinc-800 hover:border-primary hover:text-primary transition-all cursor-pointer rounded-sm uppercase font-['Teko','Oswald',sans-serif]">
                                        Select Operational Images
                                        <input key={task._id} type='file' accept={task.title.includes('LIVIK') ? 'application/pdf' : 'image/*, video/mp4'} multiple onChange={handleImageChange} className='hidden' />
                                    </label>
                                    <span className="text-[10px] text-zinc-600 font-['Teko','Oswald',sans-serif]">JPG, PNG OR WEBP UP TO 4 TILES</span>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className='grid grid-cols-4 gap-2 pt-2'>
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className='aspect-square relative bg-black border border-zinc-900 group overflow-hidden'>
                                                <img src={preview} alt='preview' className='object-cover w-full h-full' />
                                                <button type='button' onClick={() => handleRemoveImage(index)} className='absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button type='submit' disabled={isSubmitting} className='w-full bg-primary text-black py-4 font-black tracking-widest text-xs sm:text-sm uppercase hover:bg-white transition-all disabled:opacity-40 flex items-center justify-center gap-2 font-["Teko","Oswald",sans-serif]'>
                            {isSubmitting ? (
                                <><Loader2 size={16} className='animate-spin' />{isResubmit ? 'RESUBMITTING TASK...' : 'SUBMITTING TASK...'}</>
                            ) : (isResubmit ? 'RESUBMIT TASK //' : 'SUBMIT TASK //')}
                        </button>
                    </form>
                </motion.div>
            )}
        </motion.div>
    );
}

export default SubmissionModal;
