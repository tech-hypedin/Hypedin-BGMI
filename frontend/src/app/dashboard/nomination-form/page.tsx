// // 'use client';

// // import React from 'react';
// // import Link from 'next/link';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import toast from 'react-hot-toast';
// // import { Button } from '@/components/ui/button';
// // import { useSubmitApplication } from '@/hooks/useApplications';
// // import { useRouter } from 'next/navigation';
// // import { UploadCloud, X } from 'lucide-react';
// // import api from '@/lib/api';

// // type ApplicationFormData = {
// //     playerUid: string;
// //     playerName: string;
// //     playerNumber: string;
// //     playerImages: File[];
// //     reasoning: string;
// //     playerEmail: string;
// // };

// // const FIELD_LABELS: Record<string, string> = {
// //     playerUid: 'Nominated Player UID',
// //     playerImages: 'Screenshot of Player Career Results and Season Statistics',
// // };

// // export default function ApplicationPage() {
// //     const [formData, setFormData] = React.useState<ApplicationFormData>({
// //         playerUid: '',
// //         playerName: '',
// //         playerNumber: '',
// //         playerImages: [],
// //         reasoning: '',
// //         playerEmail: ''
// //     });

// //     const [errorField, setErrorField] = React.useState<string | null>(null);
// //     const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
// //     const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
// //     const [isSubmittingForm, setIsSubmittingForm] = React.useState<boolean>(false);
// //     const [submitted, setSubmitted] = React.useState<boolean>(false);

// //     const router = useRouter();
// //     const { mutate, isPending } = useSubmitApplication();

// //     React.useEffect(() => {
// //         if (errorField) setErrorField(null);
// //     }, [formData]);

// //     React.useEffect(() => {
// //         return () => {
// //             imagePreviews.forEach((url) => URL.revokeObjectURL(url));
// //         };
// //     }, [imagePreviews]);

// //     const handleRemoveImage = (index: number) => {
// //         URL.revokeObjectURL(imagePreviews[index]);

// //         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
// //         setFormData((prev) => ({
// //             ...prev,
// //             playerImages: prev.playerImages.filter((_, i) => i !== index),
// //         }));
// //     };

// //     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //         if (!e.target.files) return;

// //         const filesArray = Array.from(e.target.files);
// //         const totalCount = formData.playerImages.length + filesArray.length;

// //         if (totalCount > 2) {
// //             toast.error('MAX PROTOCOL REACHED: 2 Images allowed maximum.');
// //             return;
// //         }

// //         const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

// //         setImagePreviews((prev) => [...prev, ...newPreviews]);
// //         setFormData((prev) => ({
// //             ...prev,
// //             playerImages: [...prev.playerImages, ...filesArray],
// //         }));

// //         e.target.value = '';
// //     };

// //     const firstInvalidField = (): string | null => {
// //         if (!formData.playerUid.trim()) return 'playerUid';
// //         if (!formData.playerImages || formData.playerImages.length === 0) return 'playerImages';
// //         return null;
// //     };

// //     const handleSubmit = async (e: React.FormEvent) => {
// //         e.preventDefault();

// //         setIsSubmittingForm(true);

// //         const invalid = firstInvalidField();
// //         if (invalid) {
// //             setErrorField(invalid);
// //             const labelName = FIELD_LABELS[invalid] || invalid;
// //             toast.error(`Please provide: ${labelName}`);

// //             document.getElementById(`field-${invalid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

// //             return;
// //         }

// //         const submissionData = new FormData();
// //         submissionData.append('playerUID', formData.playerUid);
// //         submissionData.append('playerName', formData.playerName);
// //         submissionData.append('playerNumber', formData.playerNumber);
// //         formData.playerImages.forEach((file) => {
// //             submissionData.append('playerImages', file);
// //         });
// //         submissionData.append('reasoning', formData.reasoning);
// //         submissionData.append('playerEmail', formData.playerEmail);

// //         try {
// //             const { data } = await api.post('/api/nomination/nominatePlayer?season=2', submissionData);
// //             setIsSubmittingForm(false);

// //             if (data?.success) {
// //                 toast.success(data.message);

// //                 window.location.replace("/dashboard");

// //                 return;
// //             }
// //         } catch (err: any) {
// //             console.error(err);
            
// //             const errMessage = err?.response?.data?.message || 'An error occured';

// //             toast.error(errMessage);
// //         } finally {
// //             setIsSubmittingForm(false);
// //         }
// //     }

// //     React.useEffect(() => {
// //         const fetchNominations = async () => {
// //             try {
// //                 const { data } = await api.get('/api/nomination/checkNomination?season=2');
    
// //                 if(data?.isNominationExists) {
// //                     setSubmitted(true);

// //                     return;
// //                 }
// //             } catch (err: unknown) {
// //                 console.error('FAILED TO FETCH NOMINATIONS', err);
// //             }
// //         }

// //         fetchNominations();
// //     }, []);

// //     const fc = (key: string, base: string) => `${base}${errorField === key ? ' field-invalid border-red-500' : ''}`;

// //     return (
// //         <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 relative'>

// //             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='mb-8 md:mb-10 border-l-4 border-primary pl-4 md:pl-6'>
// //                 <h1 className='text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-none sm:leading-[0.9]'>
// //                     NOMINATE THE <span className='text-primary'>BEST PLAYER</span> FROM YOUR COHORT
// //                 </h1>
// //             </motion.div>

// //             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='tactical-panel p-5 sm:p-8 md:p-12 relative overflow-hidden'>
// //                 <div className='absolute top-0 right-0 p-4 opacity-10 pointer-events-none hidden sm:block'>
// //                     <span className='text-4xl md:text-6xl font-black italic'>INFO</span>
// //                 </div>

// //                 <form onSubmit={handleSubmit} noValidate className='space-y-6 md:space-y-8 relative z-10'>
// //                     <div className='flex flex-col gap-5 md:gap-6'>

// //                         <div id='field-mvpUid' className={fc('mvpUid', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Nomiated Player's Name
// //                             </label>
// //                             <input type='text' placeholder='YOUR NAME' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerName} onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}/>
// //                         </div>

// //                         <div id='field-mvpUid' className={fc('mvpUid', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Nomiated Player's college Email
// //                             </label>
// //                             <input type='text' placeholder='JOHNDOE@GMAIL.COM' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerEmail} onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}/>
// //                         </div>

// //                         <div id='field-mvpUid' className={fc('mvpUid', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Nomiated Player's Phone NUmber
// //                             </label>
// //                             <input type='text' placeholder='1234567890' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerNumber} onChange={(e) => setFormData({ ...formData, playerNumber: e.target.value })}/>
// //                         </div>

// //                         <div id='field-playerUid' className={fc('playerUid', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Nominated Player UID
// //                             </label>
// //                             <input type='text' placeholder='E.G. 56783928' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerUid} onChange={(e) => setFormData({ ...formData, playerUid: e.target.value })}/>
// //                         </div>

// //                         <div id='field-mvpUid' className={fc('mvpUid', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Why this player over other's
// //                             </label>
// //                             <textarea rows={4} onChange={(e) => setFormData({...formData, reasoning: e.target.value})} placeholder='ELABORATE ON WHY YOU ARE NOMINATING THIS PLAYER...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.reasoning}/>
// //                         </div>

// //                         <div id='field-playerImages' className={fc('playerImages', 'space-y-2 transition-all')}>
// //                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
// //                                 Photo of the Nominated player's College Id card and account statistics or career results (Max 2)
// //                             </label>
// //                             <div className='p-4 border border-zinc-900 bg-black/40 flex flex-col items-center justify-center gap-3 rounded-sm'>
// //                                 <UploadCloud size={28} className='text-zinc-500 animate-pulse' />
// //                                 <label className='bg-zinc-900 text-zinc-200 px-4 py-2 text-xs font-bold tracking-widest border border-zinc-800 hover:border-primary hover:text-primary transition-all cursor-pointer rounded-sm uppercase'>
// //                                     Select Operational Images
// //                                     <input type='file' accept='image/*' multiple onChange={handleImageChange} className='hidden'/>
// //                                 </label>
// //                                 <span className='text-[10px] text-zinc-600 uppercase tracking-wider'>
// //                                     JPG, PNG OR WEBP UP TO 2 TILES
// //                                 </span>
// //                             </div>
// //                         </div>

// //                         {imagePreviews.length > 0 && (
// //                             <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2'>
// //                                 {imagePreviews.map((preview, index) => (
// //                                     <div key={index} className='aspect-square relative bg-black border border-zinc-900 group overflow-hidden'>
// //                                         <img src={preview} alt={`preview-${index}`} className='object-cover w-full h-full' />
// //                                         <button type='button' onClick={() => handleRemoveImage(index)} className='absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer'>
// //                                             <X size={16} />
// //                                         </button>
// //                                     </div>
// //                                 ))}
// //                             </div>
// //                         )}
// //                     </div>

// //                     <div className='pt-2 md:pt-4'>
// //                         <Button type='submit' disabled={isSubmittingForm} className='pubg-btn w-full md:w-auto h-14 md:h-16 px-8 md:px-16 bg-primary text-black font-bold text-lg md:text-xl tracking-widest uppercase transition-all hover:bg-[#ffb24d] hover:shadow-[0_12px_34px_-10px_rgba(255,153,50,0.7)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
// //                             {isSubmittingForm ? 'TRANSMITTING...' : 'DEPLOY APPLICATION'}
// //                         </Button>
// //                     </div>
// //                 </form>
// //             </motion.div>

// //             <p className='mt-6 text-center text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-50 px-4'>
// //                 All data transmissions are encrypted and secure
// //             </p>

// //             <AnimatePresence>
// //                 {isSubmitted && (
// //                     <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
// //                         <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className='w-full max-w-md tactical-panel border border-primary p-6 md:p-8 text-center relative overflow-hidden bg-zinc-950'>
// //                             <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary' />
// //                             <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary' />
// //                             <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary' />
// //                             <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary' />

// //                             <div className='w-16 h-16 bg-primary/10 border border-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
// //                                 <svg className='w-8 h-8 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
// //                                     <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
// //                                 </svg>
// //                             </div>

// //                             <h3 className='text-xl md:text-2xl font-black italic text-white uppercase tracking-tight mb-2'>
// //                                 Mission Accomplished
// //                             </h3>

// //                             <p className='text-sm text-muted-foreground font-mono uppercase tracking-wide mb-6'>
// //                                 Your nomination has been submitted
// //                             </p>

// //                             <Button onClick={() => {setIsSubmitted(false); router.push('/');}} className='w-full h-12 bg-primary hover:bg-accent text-black font-black uppercase tracking-wider transition-colors'>
// //                                 DONE
// //                             </Button>
// //                         </motion.div>
// //                     </div>
// //                 )}
// //             </AnimatePresence>

// //             <AnimatePresence>
// //                     {submitted && (
// //                         <div className='top-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs'>
// //                             <motion.div 
// //                                 initial={{ scale: 0.95, opacity: 0 }} 
// //                                 animate={{ scale: 1, opacity: 1 }} 
// //                                 exit={{ scale: 0.95, opacity: 0 }}
// //                                 className='w-full max-w-125 bg-[#000000] border border-zinc-900 p-6 sm:p-8 pt-10 relative font-["Teko","Oswald",sans-serif] text-white shadow-2xl'
// //                             >
// //                                 <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
// //                                 <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
// //                                 <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
// //                                 <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>

// //                                 <div className='border-l-[3px] border-[#ffb60e] pl-3 mb-6 mt-2'>
// //                                     <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-[#ffb60e] leading-none'>NOMINATION SECURED!</h2>
// //                                 </div>

// //                                 <div className='space-y-4 sm:space-y-6 flex flex-col items-center justify-center'>
// //                                     <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
// //                                         <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>You have already submitted a nomination for this season</p>
// //                                     </span>

// //                                     <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
// //                                         <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>Please wait untill the next season to submit another nomination</p>
// //                                     </span>

// //                                     <Link href='/dashboard' className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase underline hover:text-[#ffff] text-center pt-2'>Return to HQ Dashboard</Link>
// //                                 </div>
// //                             </motion.div>
// //                         </div>
// //                     )}
// //                 </AnimatePresence>
// //         </div>
// //     );
// // }



// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { motion, AnimatePresence } from 'framer-motion';
// import toast from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { useSubmitApplication } from '@/hooks/useApplications';
// import { useRouter } from 'next/navigation';
// import { UploadCloud, X } from 'lucide-react';
// import api from '@/lib/api';

// type ApplicationFormData = {
//     playerUid: string;
//     playerName: string;
//     playerNumber: string;
//     playerImages: File[];
//     reasoning: string;
//     playerEmail: string;
// };

// const FIELD_LABELS: Record<string, string> = {
//     playerUid: 'Nominated Player UID',
//     playerImages: 'Screenshot of Player Career Results and Season Statistics',
// };

// export default function ApplicationPage() {
//     const [formData, setFormData] = React.useState<ApplicationFormData>({
//         playerUid: '',
//         playerName: '',
//         playerNumber: '',
//         playerImages: [],
//         reasoning: '',
//         playerEmail: ''
//     });

//     const [errorField, setErrorField] = React.useState<string | null>(null);
//     const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
//     const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
//     const [isSubmittingForm, setIsSubmittingForm] = React.useState<boolean>(false);
//     const [submitted, setSubmitted] = React.useState<boolean>(false);

//     const router = useRouter();
//     const { mutate, isPending } = useSubmitApplication();

//     React.useEffect(() => {
//         if (errorField) setErrorField(null);
//     }, [formData]);

//     React.useEffect(() => {
//         return () => {
//             imagePreviews.forEach((url) => URL.revokeObjectURL(url));
//         };
//     }, [imagePreviews]);

//     const handleRemoveImage = (index: number) => {
//         URL.revokeObjectURL(imagePreviews[index]);

//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//         setFormData((prev) => ({
//             ...prev,
//             playerImages: prev.playerImages.filter((_, i) => i !== index),
//         }));
//     };

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (!e.target.files) return;

//         const filesArray = Array.from(e.target.files);
//         const totalCount = formData.playerImages.length + filesArray.length;

//         if (totalCount > 2) {
//             toast.error('MAX PROTOCOL REACHED: 2 Images allowed maximum.');
//             return;
//         }

//         const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

//         setImagePreviews((prev) => [...prev, ...newPreviews]);
//         setFormData((prev) => ({
//             ...prev,
//             playerImages: [...prev.playerImages, ...filesArray],
//         }));

//         e.target.value = '';
//     };

//     const firstInvalidField = (): string | null => {
//         if (!formData.playerUid.trim()) return 'playerUid';
//         if (!formData.playerImages || formData.playerImages.length === 0) return 'playerImages';
//         return null;
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         setIsSubmittingForm(true);

//         const invalid = firstInvalidField();
//         if (invalid) {
//             setErrorField(invalid);
//             const labelName = FIELD_LABELS[invalid] || invalid;
//             toast.error(`Please provide: ${labelName}`);

//             document.getElementById(`field-${invalid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

//             setIsSubmittingForm(false);
//             return;
//         }

//         const submissionData = new FormData();
//         submissionData.append('playerUID', formData.playerUid);
//         submissionData.append('playerName', formData.playerName);
//         submissionData.append('playerNumber', formData.playerNumber);
//         formData.playerImages.forEach((file) => {
//             submissionData.append('playerImages', file);
//         });
//         submissionData.append('reasoning', formData.reasoning);
//         submissionData.append('playerEmail', formData.playerEmail);

//         try {
//             const { data } = await api.post('/api/nomination/nominatePlayer?season=2', submissionData);

//             if (data?.success) {
//                 toast.success(data.message);
//                 window.location.replace("/dashboard");
//                 return;
//             }
//         } catch (err: any) {
//             console.error(err);
//             const errMessage = err?.response?.data?.message || 'An error occurred';
//             toast.error(errMessage);
//         } finally {
//             setIsSubmittingForm(false);
//         }
//     };

//     React.useEffect(() => {
//         const fetchNominations = async () => {
//             try {
//                 const { data } = await api.get('/api/nomination/checkNomination?season=2');
    
//                 if (data?.isNominationExists) {
//                     setSubmitted(true);
//                     return;
//                 }
//             } catch (err: unknown) {
//                 console.error('FAILED TO FETCH NOMINATIONS', err);
//             }
//         };

//         fetchNominations();
//     }, []);

//     const fc = (key: string, base: string) => `${base}${errorField === key ? ' field-invalid border-red-500' : ''}`;

//     return (
//         <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 relative'>

//             <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='mb-8 md:mb-10 border-l-4 border-primary pl-4 md:pl-6'>
//                 <h1 className='text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-none sm:leading-[0.9]'>
//                     NOMINATE THE <span className='text-primary'>BEST PLAYER</span> FROM YOUR COHORT
//                 </h1>
//             </motion.div>

//             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='tactical-panel p-5 sm:p-8 md:p-12 relative overflow-hidden'>
//                 <div className='absolute top-0 right-0 p-4 opacity-10 pointer-events-none hidden sm:block'>
//                     <span className='text-4xl md:text-6xl font-black italic'>INFO</span>
//                 </div>

//                 <form onSubmit={handleSubmit} noValidate className='space-y-6 md:space-y-8 relative z-10'>
//                     <div className='flex flex-col gap-5 md:gap-6'>

//                         <div id='field-playerName' className={fc('playerName', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Nominated Player's Name
//                             </label>
//                             <input type='text' placeholder='YOUR NAME' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerName} onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}/>
//                         </div>

//                         <div id='field-playerEmail' className={fc('playerEmail', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Nominated Player's College Email
//                             </label>
//                             <input type='text' placeholder='JOHNDOE@GMAIL.COM' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerEmail} onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}/>
//                         </div>

//                         <div id='field-playerNumber' className={fc('playerNumber', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Nominated Player's Phone Number
//                             </label>
//                             <input 
//                                 type='text' 
//                                 inputMode='numeric'
//                                 maxLength={10}
//                                 placeholder='1234567890' 
//                                 className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' 
//                                 value={formData.playerNumber} 
//                                 onKeyDown={(e) => {
//                                     if (
//                                         !/[0-9]/.test(e.key) && 
//                                         !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
//                                         !(e.ctrlKey || e.metaKey)
//                                     ) {
//                                         e.preventDefault();
//                                     }
//                                 }}
//                                 onChange={(e) => {
//                                     const value = e.target.value.replace(/\D/g, '').slice(0, 10);
//                                     setFormData({ ...formData, playerNumber: value });
//                                 }}
//                             />
//                         </div>

//                         <div id='field-playerUid' className={fc('playerUid', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Nominated Player UID
//                             </label>
//                             <input type='text' placeholder='E.G. 56783928' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerUid} onChange={(e) => setFormData({ ...formData, playerUid: e.target.value })}/>
//                         </div>

//                         <div id='field-reasoning' className={fc('reasoning', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Why this player over others
//                             </label>
//                             <textarea rows={4} onChange={(e) => setFormData({...formData, reasoning: e.target.value})} placeholder='ELABORATE ON WHY YOU ARE NOMINATING THIS PLAYER...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.reasoning}/>
//                         </div>

//                         <div id='field-playerImages' className={fc('playerImages', 'space-y-2 transition-all')}>
//                             <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
//                                 Photo of the Nominated player's College Id card and account statistics or career results (Max 2)
//                             </label>
//                             <div className='p-4 border border-zinc-900 bg-black/40 flex flex-col items-center justify-center gap-3 rounded-sm'>
//                                 <UploadCloud size={28} className='text-zinc-500 animate-pulse' />
//                                 <label className='bg-zinc-900 text-zinc-200 px-4 py-2 text-xs font-bold tracking-widest border border-zinc-800 hover:border-primary hover:text-primary transition-all cursor-pointer rounded-sm uppercase'>
//                                     Select Operational Images
//                                     <input type='file' accept='image/*' multiple onChange={handleImageChange} className='hidden'/>
//                                 </label>
//                                 <span className='text-[10px] text-zinc-600 uppercase tracking-wider'>
//                                     JPG, PNG OR WEBP UP TO 2 TILES
//                                 </span>
//                             </div>
//                         </div>

//                         {imagePreviews.length > 0 && (
//                             <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2'>
//                                 {imagePreviews.map((preview, index) => (
//                                     <div key={index} className='aspect-square relative bg-black border border-zinc-900 group overflow-hidden'>
//                                         <img src={preview} alt={`preview-${index}`} className='object-cover w-full h-full' />
//                                         <button type='button' onClick={() => handleRemoveImage(index)} className='absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer'>
//                                             <X size={16} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>

//                     <div className='pt-2 md:pt-4'>
//                         <Button type='submit' disabled={isSubmittingForm} className='pubg-btn w-full md:w-auto h-14 md:h-16 px-8 md:px-16 bg-primary text-black font-bold text-lg md:text-xl tracking-widest uppercase transition-all hover:bg-[#ffb24d] hover:shadow-[0_12px_34px_-10px_rgba(255,153,50,0.7)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
//                             {isSubmittingForm ? 'TRANSMITTING...' : 'DEPLOY APPLICATION'}
//                         </Button>
//                     </div>
//                 </form>
//             </motion.div>

//             <p className='mt-6 text-center text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-50 px-4'>
//                 All data transmissions are encrypted and secure
//             </p>

//             <AnimatePresence>
//                 {isSubmitted && (
//                     <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
//                         <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className='w-full max-w-md tactical-panel border border-primary p-6 md:p-8 text-center relative overflow-hidden bg-zinc-950'>
//                             <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary' />
//                             <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary' />
//                             <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary' />
//                             <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary' />

//                             <div className='w-16 h-16 bg-primary/10 border border-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
//                                 <svg className='w-8 h-8 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
//                                     <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
//                                 </svg>
//                             </div>

//                             <h3 className='text-xl md:text-2xl font-black italic text-white uppercase tracking-tight mb-2'>
//                                 Mission Accomplished
//                             </h3>

//                             <p className='text-sm text-muted-foreground font-mono uppercase tracking-wide mb-6'>
//                                 Your nomination has been submitted
//                             </p>

//                             <Button onClick={() => { setIsSubmitted(false); router.push('/'); }} className='w-full h-12 bg-primary hover:bg-accent text-black font-black uppercase tracking-wider transition-colors'>
//                                 DONE
//                             </Button>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>

//             <AnimatePresence>
//                 {submitted && (
//                     <div className='top-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs'>
//                         <motion.div 
//                             initial={{ scale: 0.95, opacity: 0 }} 
//                             animate={{ scale: 1, opacity: 1 }} 
//                             exit={{ scale: 0.95, opacity: 0 }}
//                             className='w-full max-w-125 bg-[#000000] border border-zinc-900 p-6 sm:p-8 pt-10 relative font-["Teko","Oswald",sans-serif] text-white shadow-2xl'
//                         >
//                             <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
//                             <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
//                             <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
//                             <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>

//                             <div className='border-l-[3px] border-[#ffb60e] pl-3 mb-6 mt-2'>
//                                 <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-[#ffb60e] leading-none'>NOMINATION SECURED!</h2>
//                             </div>

//                             <div className='space-y-4 sm:space-y-6 flex flex-col items-center justify-center'>
//                                 <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
//                                     <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>You have already submitted a nomination for this season</p>
//                                 </span>

//                                 <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
//                                     <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>Please wait until the next season to submit another nomination</p>
//                                 </span>

//                                 <Link href='/dashboard' className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase underline hover:text-[#ffff] text-center pt-2'>Return to HQ Dashboard</Link>
//                             </div>
//                         </motion.div>
//                     </div>
//                 )}
//             </AnimatePresence>
//         </div>
//     );
// }




'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { useSubmitApplication } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';
import { UploadCloud, X } from 'lucide-react';
import api from '@/lib/api';

type ApplicationFormData = {
    playerUid: string;
    playerName: string;
    playerNumber: string;
    playerImages: File[];
    reasoning: string;
    playerEmail: string;
};

const FIELD_LABELS: Record<string, string> = {
    playerUid: 'Nominated Player UID',
    playerImages: 'Screenshot of Player Career Results and Season Statistics',
};

export default function ApplicationPage() {
    const [formData, setFormData] = React.useState<ApplicationFormData>({
        playerUid: '',
        playerName: '',
        playerNumber: '',
        playerImages: [],
        reasoning: '',
        playerEmail: ''
    });

    const [errorField, setErrorField] = React.useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
    const [imagePreviews, setImagePreviews] = React.useState<string[]>([]);
    const [isSubmittingForm, setIsSubmittingForm] = React.useState<boolean>(false);
    const [submitted, setSubmitted] = React.useState<boolean>(false);

    const router = useRouter();
    const { mutate, isPending } = useSubmitApplication();

    React.useEffect(() => {
        if (errorField) setErrorField(null);
    }, [formData]);

    React.useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    const handleRemoveImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);

        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setFormData((prev) => ({
            ...prev,
            playerImages: prev.playerImages.filter((_, i) => i !== index),
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        const totalCount = formData.playerImages.length + filesArray.length;

        if (totalCount > 2) {
            toast.error('MAX PROTOCOL REACHED: 2 Images allowed maximum.');
            return;
        }

        const newPreviews = filesArray.map((file) => URL.createObjectURL(file));

        setImagePreviews((prev) => [...prev, ...newPreviews]);
        setFormData((prev) => ({
            ...prev,
            playerImages: [...prev.playerImages, ...filesArray],
        }));

        e.target.value = '';
    };

    const firstInvalidField = (): string | null => {
        if (!formData.playerUid.trim()) return 'playerUid';
        if (!formData.playerImages || formData.playerImages.length === 0) return 'playerImages';
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmittingForm(true);

        const invalid = firstInvalidField();
        if (invalid) {
            setErrorField(invalid);
            const labelName = FIELD_LABELS[invalid] || invalid;
            toast.error(`Please provide: ${labelName}`);

            document.getElementById(`field-${invalid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setIsSubmittingForm(false);
            return;
        }

        const submissionData = new FormData();
        submissionData.append('playerUID', formData.playerUid);
        submissionData.append('playerName', formData.playerName);
        submissionData.append('playerNumber', formData.playerNumber);
        formData.playerImages.forEach((file) => {
            submissionData.append('playerImages', file);
        });
        submissionData.append('reasoning', formData.reasoning);
        submissionData.append('playerEmail', formData.playerEmail);

        try {
            const { data } = await api.post('/api/nomination/nominatePlayer?season=2', submissionData);

            if (data?.success) {
                toast.success(data.message);
                window.location.replace("/dashboard");
                return;
            }
        } catch (err: any) {
            console.error(err);
            const errMessage = err?.response?.data?.message || 'An error occurred';
            toast.error(errMessage);
        } finally {
            setIsSubmittingForm(false);
        }
    };

    React.useEffect(() => {
        const fetchNominations = async () => {
            try {
                const { data } = await api.get('/api/nomination/checkNomination?season=2');
    
                if (data?.isNominationExists) {
                    setSubmitted(true);
                    return;
                }
            } catch (err: unknown) {
                console.error('FAILED TO FETCH NOMINATIONS', err);
            }
        };

        fetchNominations();
    }, []);

    const fc = (key: string, base: string) => `${base}${errorField === key ? ' field-invalid border-red-500' : ''}`;

    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 relative'>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='mb-8 md:mb-10 border-l-4 border-primary pl-4 md:pl-6'>
                <h1 className='text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-none sm:leading-[0.9]'>
                    NOMINATE THE <span className='text-primary'>BEST PLAYER</span> FROM YOUR COHORT
                </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='tactical-panel p-5 sm:p-8 md:p-12 relative overflow-hidden'>
                <div className='absolute top-0 right-0 p-4 opacity-10 pointer-events-none hidden sm:block'>
                    <span className='text-4xl md:text-6xl font-black italic'>INFO</span>
                </div>

                <form onSubmit={handleSubmit} noValidate className='space-y-6 md:space-y-8 relative z-10'>
                    <div className='flex flex-col gap-5 md:gap-6'>

                        <div id='field-playerName' className={fc('playerName', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Nominated Player's Name
                            </label>
                            <input type='text' placeholder='YOUR NAME' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerName} onChange={(e) => setFormData({ ...formData, playerName: e.target.value })}/>
                        </div>

                        <div id='field-playerEmail' className={fc('playerEmail', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Nominated Player's College Email
                            </label>
                            <input type='text' placeholder='JOHNDOE@GMAIL.COM' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.playerEmail} onChange={(e) => setFormData({ ...formData, playerEmail: e.target.value })}/>
                        </div>

                        <div id='field-playerNumber' className={fc('playerNumber', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Nominated Player's Phone Number
                            </label>
                            <input 
                                type='text' 
                                inputMode='numeric'
                                maxLength={10}
                                placeholder='1234567890' 
                                className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' 
                                value={formData.playerNumber} 
                                onKeyDown={(e) => {
                                    if (
                                        !/[0-9]/.test(e.key) && 
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                                        !(e.ctrlKey || e.metaKey)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setFormData({ ...formData, playerNumber: value });
                                }}
                            />
                        </div>

                        <div id='field-playerUid' className={fc('playerUid', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Nominated Player UID
                            </label>
                            <input 
                                type='text' 
                                inputMode='numeric'
                                maxLength={20}
                                placeholder='E.G. 56783928' 
                                className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' 
                                value={formData.playerUid} 
                                onKeyDown={(e) => {
                                    if (
                                        !/[0-9]/.test(e.key) && 
                                        !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key) &&
                                        !(e.ctrlKey || e.metaKey)
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 20);
                                    setFormData({ ...formData, playerUid: value });
                                }}
                            />
                        </div>

                        <div id='field-reasoning' className={fc('reasoning', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Why this player over others
                            </label>
                            <textarea rows={4} onChange={(e) => setFormData({...formData, reasoning: e.target.value})} placeholder='ELABORATE ON WHY YOU ARE NOMINATING THIS PLAYER...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.reasoning}/>
                        </div>

                        <div id='field-playerImages' className={fc('playerImages', 'space-y-2 transition-all')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                                Photo of the Nominated player's College Id card and account statistics or career results (Max 2)
                            </label>
                            <div className='p-4 border border-zinc-900 bg-black/40 flex flex-col items-center justify-center gap-3 rounded-sm'>
                                <UploadCloud size={28} className='text-zinc-500 animate-pulse' />
                                <label className='bg-zinc-900 text-zinc-200 px-4 py-2 text-xs font-bold tracking-widest border border-zinc-800 hover:border-primary hover:text-primary transition-all cursor-pointer rounded-sm uppercase'>
                                    Select Operational Images
                                    <input type='file' accept='image/*' multiple onChange={handleImageChange} className='hidden'/>
                                </label>
                                <span className='text-[10px] text-zinc-600 uppercase tracking-wider'>
                                    JPG, PNG OR WEBP UP TO 2 TILES
                                </span>
                            </div>
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className='grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2'>
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className='aspect-square relative bg-black border border-zinc-900 group overflow-hidden'>
                                        <img src={preview} alt={`preview-${index}`} className='object-cover w-full h-full' />
                                        <button type='button' onClick={() => handleRemoveImage(index)} className='absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:cursor-pointer'>
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='pt-2 md:pt-4'>
                        <Button type='submit' disabled={isSubmittingForm} className='pubg-btn w-full md:w-auto h-14 md:h-16 px-8 md:px-16 bg-primary text-black font-bold text-lg md:text-xl tracking-widest uppercase transition-all hover:bg-[#ffb24d] hover:shadow-[0_12px_34px_-10px_rgba(255,153,50,0.7)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
                            {isSubmittingForm ? 'TRANSMITTING...' : 'DEPLOY APPLICATION'}
                        </Button>
                    </div>
                </form>
            </motion.div>

            <p className='mt-6 text-center text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.4em] opacity-50 px-4'>
                All data transmissions are encrypted and secure
            </p>

            <AnimatePresence>
                {isSubmitted && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm'>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className='w-full max-w-md tactical-panel border border-primary p-6 md:p-8 text-center relative overflow-hidden bg-zinc-950'>
                            <div className='absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary' />
                            <div className='absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary' />
                            <div className='absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary' />
                            <div className='absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary' />

                            <div className='w-16 h-16 bg-primary/10 border border-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse'>
                                <svg className='w-8 h-8 text-primary' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}>
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                                </svg>
                            </div>

                            <h3 className='text-xl md:text-2xl font-black italic text-white uppercase tracking-tight mb-2'>
                                Mission Accomplished
                            </h3>

                            <p className='text-sm text-muted-foreground font-mono uppercase tracking-wide mb-6'>
                                Your nomination has been submitted
                            </p>

                            <Button onClick={() => { setIsSubmitted(false); router.push('/'); }} className='w-full h-12 bg-primary hover:bg-accent text-black font-black uppercase tracking-wider transition-colors'>
                                DONE
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {submitted && (
                    <div className='top-0 fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs'>
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }} 
                            animate={{ scale: 1, opacity: 1 }} 
                            exit={{ scale: 0.95, opacity: 0 }}
                            className='w-full max-w-125 bg-[#000000] border border-zinc-900 p-6 sm:p-8 pt-10 relative font-["Teko","Oswald",sans-serif] text-white shadow-2xl'
                        >
                            <span className='absolute top-3 left-3 text-[#ffb60e] font-light text-xs select-none'>┌</span>
                            <span className='absolute top-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┐</span>
                            <span className='absolute bottom-3 left-3 text-[#ffb60e] font-light text-xs select-none'>└</span>
                            <span className='absolute bottom-3 right-3 text-[#ffb60e] font-light text-xs select-none'>┘</span>

                            <div className='border-l-[3px] border-[#ffb60e] pl-3 mb-6 mt-2'>
                                <h2 className='text-xl sm:text-2xl font-black tracking-widest uppercase text-[#ffb60e] leading-none'>NOMINATION SECURED!</h2>
                            </div>

                            <div className='space-y-4 sm:space-y-6 flex flex-col items-center justify-center'>
                                <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
                                    <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>You have already submitted a nomination for this season</p>
                                </span>

                                <span className='flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-center'>
                                    <p className='block text-xs font-black tracking-[0.15em] text-[#ffffff] uppercase'>Please wait until the next season to submit another nomination</p>
                                </span>

                                <Link href='/dashboard' className='block text-xs font-black tracking-[0.15em] text-[#ffb60e] uppercase underline hover:text-[#ffff] text-center pt-2'>Return to HQ Dashboard</Link>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}