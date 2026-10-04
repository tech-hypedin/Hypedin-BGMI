// 'use client';

// import { useForm, useFieldArray, Controller } from 'react-hook-form';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';
// import api from '@/lib/api';
// import { Rocket, ArrowLeft, Calendar, Trophy, Layers, Type, ChevronRight, Clock, Zap, Target, Plus, Trash2, FileText, Image } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// type DynamicPair = {
//     key: string;
//     value: string;
// };

// type TaskFormData = {
//     title: string;
//     description: string;
//     subGuide: string; 
//     rpReward: number;
//     category: 'Social Media' | 'Campus' | 'Content' | 'Referral';
//     status: 'Upcoming' | 'In Progress';
//     taskType: 'Daily' | 'Weekly' | 'Monthly' | 'One-Time';
//     startDate: string;
//     deadline: string;
//     phase: string;
//     dynamicPairs: DynamicPair[];
//     isImageAllowed: boolean;
// }

// export default function CreateTaskPage() {
//     const router = useRouter();
//     const queryClient = useQueryClient();

//     const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<TaskFormData>({
//         defaultValues: {
//             status: 'In Progress',
//             category: 'Social Media',
//             taskType: 'One-Time',
//             phase: '1',
//             subGuide: '', 
//             startDate: new Date().toISOString().split('T')[0],
//             dynamicPairs: [{ key: '', value: '' }],
//             isImageAllowed: false,
//         }
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: 'dynamicPairs'
//     });

//     const currentStatus = watch('status');

//     const mutation = useMutation({
//         mutationFn: async (newTask: any) => {
//             return api.post('/api/admin/task', newTask);
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
//             toast.success('MISSION DEPLOYED SUCCESSFULLY');
//             router.push('/admin/tasks');
//         },
//         onError: () => {
//             toast.error('DEPLOYMENT FAILED: Check Server Comms');
//         }
//     });

//     const onSubmit = (formData: TaskFormData) => {
//         const payloadData: Record<string, string> = {};
//         formData.dynamicPairs.forEach((pair) => {
//             if (pair.key.trim()) {
//                 payloadData[pair.key.trim()] = pair.value;
//             }
//         });

//         const finalPayload = {
//             title: formData.title,
//             description: formData.description,
//             subGuide: formData.subGuide, 
//             rpReward: Number(formData.rpReward),
//             category: formData.category,
//             status: formData.status,
//             taskType: formData.taskType,
//             startDate: formData.startDate,
//             deadline: formData.deadline,
//             phase: Number(formData.phase),
//             isImageAllowed: formData.isImageAllowed,
//             data: payloadData
//         };

//         mutation.mutate(finalPayload);
//     };

//     return (
//         <div className='p-4 md:p-8 bg-[#090907] min-h-screen text-white font-["Teko","Oswald",sans-serif] uppercase tracking-wide antialiased'>
//             <button onClick={() => router.replace('/admin')} className='flex items-center gap-2 text-[#444] hover:text-primary transition-colors mb-6 group'>
//                 <ArrowLeft size={18} className='group-hover:-translate-x-1 transition-transform' />
//                 <span className='text-[10px] font-black uppercase tracking-widest text-left'>Abort / Back to Briefing</span>
//             </button>

//             <div className='mb-8 md:mb-10'>
//                 <h1 className='text-2xl md:text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3 leading-none'>
//                     <Rocket className='text-primary shrink-0' size={28} />
//                     Deploy New Objective
//                 </h1>
//                 <p className='text-[#8C8C8C] text-xs md:text-sm mt-3 max-w-2xl leading-relaxed normal-case font-sans'>
//                     Broadcast a new mission to the ambassador network. Use 'Daily' for high-frequency engagement or 'One-Time' for major events.
//                 </p>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className='max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        
//                 <div className='lg:col-span-2 space-y-6'>
//                     <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-8 space-y-6'>
//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Type size={14} /> Task Title
//                             </label>
//                             <input 
//                                 {...register('title', { required: 'Title is mandatory' })} 
//                                 placeholder='E.G., SHARE RECAP VIDEO ON LINKEDIN' 
//                                 className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all font-bold placeholder:text-[#222]'
//                             />
//                             {errors.title && <p className='text-red-500 text-[10px] font-bold'>{errors.title.message}</p>}
//                         </div>

//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Image size={14} /> Allow Image Uploads for Proof?
//                             </label>
//                             <div className='flex gap-3'>
//                                 <Controller
//                                     name='isImageAllowed'
//                                     control={control}
//                                     render={({ field }) => (
//                                         <>
//                                             <label className='relative flex-1 cursor-pointer'>
//                                                 <input
//                                                     type='radio'
//                                                     name='isImageAllowed'
//                                                     checked={field.value === true}
//                                                     onChange={() => field.onChange(true)}
//                                                     className='peer sr-only'
//                                                 />
//                                                 <div className='flex items-center justify-center h-12 bg-black/50 border border-[#1f1f1f] transition-all peer-checked:border-primary peer-checked:bg-primary/10 select-none'>
//                                                     <span className={`text-[10px] md:text-xs font-black tracking-widest ${field.value === true ? 'text-primary' : 'text-[#444]'}`}>
//                                                         [ YES - IMAGES ONLY ]
//                                                     </span>
//                                                 </div>
//                                             </label>
                                            
//                                             <label className='relative flex-1 cursor-pointer'>
//                                                 <input
//                                                     type='radio'
//                                                     name='isImageAllowed'
//                                                     checked={field.value === false}
//                                                     onChange={() => field.onChange(false)}
//                                                     className='peer sr-only'
//                                                 />
//                                                 <div className='flex items-center justify-center h-12 bg-black/50 border border-[#1f1f1f] transition-all peer-checked:border-primary peer-checked:bg-primary/10 select-none'>
//                                                     <span className={`text-[10px] md:text-xs font-black tracking-widest ${field.value === false ? 'text-primary' : 'text-[#444]'}`}>
//                                                         [ NO - TEXT ONLY ]
//                                                     </span>
//                                                 </div>
//                                             </label>
//                                         </>
//                                     )}
//                                 />
//                             </div>
//                         </div>

//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest'>Task Description</label>
//                             <textarea 
//                                 {...register('description', { required: 'Briefing is required' })} 
//                                 placeholder='DESCRIBE THE TASK STEPS, TAGS TO USE, AND EXPECTED RESULTS...' 
//                                 className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all h-40 md:h-52 font-medium leading-relaxed placeholder:text-[#222]'
//                             />
//                             {errors.description && <p className='text-red-500 text-[10px] font-bold'>{errors.description.message}</p>}
//                         </div>

//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <FileText size={14} /> Submission Guidelines for Ambassadors
//                             </label>
//                             <textarea
//                                 {...register('subGuide', { required: 'RP summary description is mandatory' })} 
//                                 placeholder='DESCRIBE HOW THE AMBASSADORS SHOULD SUBMIT THEIR TASKS IN DETAIL' 
//                                 className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all h-40 md:h-52 font-medium leading-relaxed placeholder:text-[#222]'
//                             />
//                             {errors.subGuide && <p className='text-red-500 text-[10px] font-bold'>{errors.subGuide.message}</p>}
//                         </div>
//                     </div>

//                     <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-8 space-y-4'>
//                         <div className='flex items-center justify-between border-b border-[#1f1f1f] pb-3'>
//                             <label className='text-[11px] font-black uppercase text-primary tracking-widest flex items-center gap-2'>
//                                 <Target size={14} /> Task Details
//                             </label>
//                             <button type='button' onClick={() => append({ key: '', value: '' })} className='hover:cursor-pointer flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase px-2.5 py-1 hover:bg-primary hover:text-black transition-all'>
//                                 <Plus size={12} /> Add Task Details
//                             </button>
//                         </div>

//                         <div className='space-y-3 max-h-72 overflow-y-auto pr-1'>
//                             {fields.map((field, index) => (
//                                 <div key={field.id} className='flex items-center gap-2 bg-black/40 p-2 border border-[#141414]'>
//                                     <input 
//                                         {...register(`dynamicPairs.${index}.key` as const)} 
//                                         placeholder='Detail (E.G., TWEET_URL)' 
//                                         className='flex-1 bg-black border border-[#1f1f1f] p-2.5 text-xs focus:border-primary outline-none transition-all font-bold placeholder:text-[#222]'
//                                     />
//                                     <span className='text-zinc-700 font-bold text-xs'>:</span>
//                                     <input 
//                                         {...register(`dynamicPairs.${index}.value` as const)} 
//                                         placeholder='Elaborate task detail' 
//                                         className='flex-1 bg-black border border-[#1f1f1f] p-2.5 text-xs focus:border-primary outline-none transition-all font-medium placeholder:text-[#222]'
//                                     />
//                                     {fields.length > 1 && (
//                                         <button type='button' onClick={() => remove(index)} className='p-2.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all shrink-0'>
//                                             <Trash2 size={14} />
//                                         </button>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
        
//                 <div className='space-y-6'>
//                     <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-6 space-y-6'>
//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Layers size={14} /> Target System Phase
//                             </label>
//                             <select {...register('phase')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none text-primary'>
//                                 <option value='1'>PHASE 01 (15 JULY - 14 AUG)</option>
//                                 <option value='2'>PHASE 02 (15 AUG - 14 SEPT)</option>
//                                 <option value='3'>PHASE 03 (15 SEPT - 14 OCT)</option>
//                             </select>
//                         </div>

//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Zap size={14} /> Task Frequency
//                             </label>
//                             <select {...register('taskType')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none'>
//                                 <option value='One-Time'>One-Time</option>
//                                 <option value='Daily'>Daily</option>
//                                 <option value='Weekly'>Weekly</option>
//                                 <option value='Monthly'>Monthly</option>
//                             </select>
//                         </div>
        
//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Trophy size={14} /> Reward (RP)
//                             </label>
//                             <div className='relative'>
//                                 <input type='number' {...register('rpReward', { required: true, min: 0 })} className='w-full bg-black border border-[#1f1f1f] p-3 text-xl font-black text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
//                                 <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#444]'>PTS</span>
//                             </div>
//                         </div>
        
//                         <div className='space-y-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                 <Layers size={14} /> Category
//                             </label>
//                             <select {...register('category')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none'>
//                                 <option value='Social Media'>Social Media</option>
//                                 <option value='Campus'>Campus</option>
//                                 <option value='Content'>Content</option>
//                                 <option value='Referral'>Referral</option>
//                             </select>
//                         </div>

//                         <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
//                             <div className='space-y-2'>
//                                 <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                     <Clock size={14} /> Start
//                                 </label>
//                                 <input type='date' {...register('startDate')} className='w-full bg-black border border-[#1f1f1f] p-3 text-[10px] font-black uppercase outline-none invert'/>
//                             </div>
//                             <div className='space-y-2'>
//                                 <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
//                                     <Calendar size={14} /> Expiry
//                                 </label>
//                                 <input type='date' {...register('deadline')} className='w-full bg-black border border-[#1f1f1f] p-3 text-[10px] font-black uppercase outline-none invert'/>
//                             </div>
//                         </div>

//                         <div className='space-y-2 pt-2'>
//                             <label className='text-[10px] font-black uppercase text-[#444] tracking-widest'>Initial Deployment Status</label>
//                             <div className='flex gap-2'>
//                                 {(['Upcoming', 'In Progress'] as const).map((s) => (
//                                     <button key={s} type='button' onClick={() => setValue('status', s)} className={`hover:cursor-pointer flex-1 py-3 text-[10px] font-black border transition-all ${currentStatus === s ? 'border-primary text-primary bg-primary/10' : 'border-[#1f1f1f] text-[#444] hover:border-[#333]'}`}>
//                                         {s.toUpperCase()}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>       
//                     <button type='submit' disabled={mutation.isPending} className='hover:cursor-pointer w-full bg-primary text-black py-5 font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 disabled:opacity-50'>
//                         {mutation.isPending ? 'Syncing...' : 'Broadcast Mission'}
//                         <ChevronRight size={18} />
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }




'use client';

import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Rocket, ArrowLeft, Calendar, Trophy, Layers, Type, ChevronRight, Clock, Zap, FileText, Image, Gift } from 'lucide-react';
import { toast } from 'react-hot-toast';

type TaskFormData = {
    title: string;
    description: string;
    subGuide: string; 
    rpReward: number;
    rewards: string; // Added rewards string field
    category: 'Social Media' | 'Campus' | 'Content' | 'Referral';
    status: 'Upcoming' | 'In Progress';
    taskType: 'Daily' | 'Weekly' | 'Monthly' | 'One-Time';
    startDate: string;
    deadline: string;
    phase: string;
    isImageAllowed: boolean;
}

export default function CreateTaskPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<TaskFormData>({
        defaultValues: {
            status: 'In Progress',
            category: 'Social Media',
            taskType: 'One-Time',
            phase: '1',
            subGuide: '', 
            rewards: '', // Default value for rewards string
            startDate: new Date().toISOString().split('T')[0],
            isImageAllowed: false,
        }
    });

    const currentStatus = watch('status');

    const mutation = useMutation({
        mutationFn: async (newTask: any) => {
            return api.post('/api/admin/task', newTask);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-tasks'] });
            toast.success('MISSION DEPLOYED SUCCESSFULLY');
            router.push('/admin/tasks');
        },
        onError: () => {
            toast.error('DEPLOYMENT FAILED: Check Server Comms');
        }
    });

    const onSubmit = (formData: TaskFormData) => {
        const finalPayload = {
            title: formData.title,
            description: formData.description,
            subGuide: formData.subGuide, 
            rpReward: Number(formData.rpReward),
            rewards: formData.rewards, // Sent as string to backend
            category: formData.category,
            status: formData.status,
            taskType: formData.taskType,
            startDate: formData.startDate,
            deadline: formData.deadline,
            phase: Number(formData.phase),
            isImageAllowed: formData.isImageAllowed,
        };

        mutation.mutate(finalPayload);
    };

    return (
        <div className='p-4 md:p-8 bg-[#090907] min-h-screen text-white font-["Teko","Oswald",sans-serif] uppercase tracking-wide antialiased'>
            <button onClick={() => router.replace('/admin')} className='flex items-center gap-2 text-[#444] hover:text-primary transition-colors mb-6 group'>
                <ArrowLeft size={18} className='group-hover:-translate-x-1 transition-transform' />
                <span className='text-[10px] font-black uppercase tracking-widest text-left'>Abort / Back to Briefing</span>
            </button>

            <div className='mb-8 md:mb-10'>
                <h1 className='text-2xl md:text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3 leading-none'>
                    <Rocket className='text-primary shrink-0' size={28} />
                    Deploy New Objective
                </h1>
                <p className='text-[#8C8C8C] text-xs md:text-sm mt-3 max-w-2xl leading-relaxed normal-case font-sans'>
                    Broadcast a new mission to the ambassador network. Use 'Daily' for high-frequency engagement or 'One-Time' for major events.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className='max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8'>
        
                <div className='lg:col-span-2 space-y-6'>
                    <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-8 space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Type size={14} /> Task Title
                            </label>
                            <input 
                                {...register('title', { required: 'Title is mandatory' })} 
                                placeholder='E.G., SHARE RECAP VIDEO ON LINKEDIN' 
                                className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all font-bold placeholder:text-[#222]'
                            />
                            {errors.title && <p className='text-red-500 text-[10px] font-bold'>{errors.title.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Image size={14} /> Allow Image Uploads for Proof?
                            </label>
                            <div className='flex gap-3'>
                                <Controller
                                    name='isImageAllowed'
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <label className='relative flex-1 cursor-pointer'>
                                                <input
                                                    type='radio'
                                                    name='isImageAllowed'
                                                    checked={field.value === true}
                                                    onChange={() => field.onChange(true)}
                                                    className='peer sr-only'
                                                />
                                                <div className='flex items-center justify-center h-12 bg-black/50 border border-[#1f1f1f] transition-all peer-checked:border-primary peer-checked:bg-primary/10 select-none'>
                                                    <span className={`text-[10px] md:text-xs font-black tracking-widest ${field.value === true ? 'text-primary' : 'text-[#444]'}`}>
                                                        [ YES - IMAGES ARE ALLOWED ]
                                                    </span>
                                                </div>
                                            </label>
                                            
                                            <label className='relative flex-1 cursor-pointer'>
                                                <input
                                                    type='radio'
                                                    name='isImageAllowed'
                                                    checked={field.value === false}
                                                    onChange={() => field.onChange(false)}
                                                    className='peer sr-only'
                                                />
                                                <div className='flex items-center justify-center h-12 bg-black/50 border border-[#1f1f1f] transition-all peer-checked:border-primary peer-checked:bg-primary/10 select-none'>
                                                    <span className={`text-[10px] md:text-xs font-black tracking-widest ${field.value === false ? 'text-primary' : 'text-[#444]'}`}>
                                                        [ NO - TEXT ONLY ]
                                                    </span>
                                                </div>
                                            </label>
                                        </>
                                    )}
                                />
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest'>Task Description</label>
                            <textarea 
                                {...register('description', { required: 'Briefing is required' })} 
                                placeholder='DESCRIBE THE TASK STEPS, TAGS TO USE, AND EXPECTED RESULTS...' 
                                className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all h-40 md:h-52 font-medium leading-relaxed placeholder:text-[#222]'
                            />
                            {errors.description && <p className='text-red-500 text-[10px] font-bold'>{errors.description.message}</p>}
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <FileText size={14} /> Submission Guidelines for Ambassadors
                            </label>
                            <textarea
                                {...register('subGuide', { required: 'RP summary description is mandatory' })} 
                                placeholder='DESCRIBE HOW THE AMBASSADORS SHOULD SUBMIT THEIR TASKS IN DETAIL' 
                                className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all h-40 md:h-52 font-medium leading-relaxed placeholder:text-[#222]'
                            />
                            {errors.subGuide && <p className='text-red-500 text-[10px] font-bold'>{errors.subGuide.message}</p>}
                        </div>
                    </div>

                    {/* New Rewards Section Replacing Task Details */}
                    <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-8 space-y-4'>
                        <div className='flex items-center border-b border-[#1f1f1f] pb-3'>
                            <label className='text-[11px] font-black uppercase text-primary tracking-widest flex items-center gap-2'>
                                <Gift size={14} />Rewards Breakdown
                            </label>
                        </div>
                        <div className='space-y-2'>
                            <textarea 
                                {...register('rewards')} 
                                placeholder='SPECIFY OTHER PERKS (E.G., LIST EXCLUSIVE SWAG PACK DETAILS, MERCHANDISE SIZES, EVENT TICKETS, OR ADDITIONAL BONUSES LINE BY LINE)...' 
                                className='w-full bg-black border border-[#1f1f1f] p-4 text-sm focus:border-primary outline-none transition-all h-32 font-medium leading-relaxed placeholder:text-[#222]'
                            />
                        </div>
                    </div>
                </div>
        
                <div className='space-y-6'>
                    <div className='bg-[#0c0c0c] border border-[#1f1f1f] p-5 md:p-6 space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Layers size={14} /> Target System Phase
                            </label>
                            <select {...register('phase')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none text-primary'>
                                <option value='1'>PHASE 01 (15 JULY - 14 AUG)</option>
                                <option value='2'>PHASE 02 (15 AUG - 14 SEPT)</option>
                                <option value='3'>PHASE 03 (15 SEPT - 14 OCT)</option>
                            </select>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Zap size={14} /> Task Frequency
                            </label>
                            <select {...register('taskType')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none'>
                                <option value='One-Time'>One-Time</option>
                                <option value='Daily'>Daily</option>
                                <option value='Weekly'>Weekly</option>
                                <option value='Monthly'>Monthly</option>
                            </select>
                        </div>
        
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Trophy size={14} /> Reward (RP)
                            </label>
                            <div className='relative'>
                                <input type='number' {...register('rpReward', { required: true, min: 0 })} className='w-full bg-black border border-[#1f1f1f] p-3 text-xl font-black text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'/>
                                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-[#444]'>PTS</span>
                            </div>
                        </div>
        
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                <Layers size={14} /> Category
                            </label>
                            <select {...register('category')} className='w-full bg-black border border-[#1f1f1f] p-3 text-xs font-black uppercase outline-none focus:border-primary cursor-pointer appearance-none'>
                                <option value='Social Media'>Social Media</option>
                                <option value='Campus'>Campus</option>
                                <option value='Content'>Content</option>
                                <option value='Referral'>Referral</option>
                            </select>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                    <Clock size={14} /> Start
                                </label>
                                <input type='date' {...register('startDate')} className='w-full bg-black border border-[#1f1f1f] p-3 text-[10px] font-black uppercase outline-none invert'/>
                            </div>
                            <div className='space-y-2'>
                                <label className='text-[10px] font-black uppercase text-[#444] tracking-widest flex items-center gap-2'>
                                    <Calendar size={14} /> Expiry
                                </label>
                                <input type='date' {...register('deadline')} className='w-full bg-black border border-[#1f1f1f] p-3 text-[10px] font-black uppercase outline-none invert'/>
                            </div>
                        </div>

                        <div className='space-y-2 pt-2'>
                            <label className='text-[10px] font-black uppercase text-[#444] tracking-widest'>Initial Deployment Status</label>
                            <div className='flex gap-2'>
                                {(['Upcoming', 'In Progress'] as const).map((s) => (
                                    <button key={s} type='button' onClick={() => setValue('status', s)} className={`hover:cursor-pointer flex-1 py-3 text-[10px] font-black border transition-all ${currentStatus === s ? 'border-primary text-primary bg-primary/10' : 'border-[#1f1f1f] text-[#444] hover:border-[#333]'}`}>
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>       
                    <button type='submit' disabled={mutation.isPending} className='hover:cursor-pointer w-full bg-primary text-black py-5 font-black uppercase text-sm flex items-center justify-center gap-2 hover:bg-yellow-400 transition-all border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 disabled:opacity-50'>
                        {mutation.isPending ? 'Syncing...' : 'Broadcast Mission'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}