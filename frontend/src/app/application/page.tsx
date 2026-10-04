'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { BackButton } from '../../components/application/backButton';
import { useSubmitApplication } from '@/hooks/useApplications';
import { useRouter } from 'next/navigation';

import { INDIA_STATES, CITIES_BY_STATE } from '../../lib/indianStateAndCities'; 

type ApplicationFormData = {
    playedBefore: boolean | undefined,
    experienceDetails: string,
    name: string,
    course: string,
    college: string,
    state: string,
    city: string,
    instagramUrl: string,
    convert: string,
    tournamentExp: boolean | undefined,
    reasoning: string,
    phoneNo: number | undefined,
    email: string,
    hasTime: boolean | undefined,
    hasExperience: boolean | undefined,
    currentYear: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | '',
    accountRank: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Crown' | 'Ace' | 'Ace Master' | 'Ace Dominator' | 'Conqueror' | 'NA' | ''
}

// Human-readable question names — used for the "please complete this field" prompt
// so applicants never see a raw backend field name.
const FIELD_LABELS: Record<string, string> = {
    name: 'Full Name',
    email: 'Your Email',
    phoneNo: 'Phone Number',
    instagramUrl: 'Instagram Profile URL',
    state: 'State / Union Territory',
    city: 'City',
    college: 'College / University',
    course: 'Course / Degree',
    currentYear: 'Current Year',
    playedBefore: 'Have you played BGMI before?',
    accountRank: 'Competitive Rank',
    hasTime: 'Would you be able to dedicate 5–6 hours/week across July to October?',
    tournamentExp: 'Have you participated in any esports tournaments before?',
    hasExperience: 'Do you have any prior experience organizing events?',
    convert: 'How would you get 50 BGMI players from your college to participate in a BGMI event?',
    reasoning: 'Why would you be the best fit for BGMI Campus MVP?',
};

export default function ApplicationPage() {
    const [formData, setFormData] = React.useState<ApplicationFormData>({ 
        playedBefore: undefined, 
        experienceDetails: '', 
        name: '', 
        course: '', 
        convert: '', 
        tournamentExp: undefined, 
        phoneNo: undefined, 
        email: '', 
        instagramUrl: '',
        hasTime: undefined, 
        hasExperience: undefined, 
        currentYear: '', 
        accountRank: '', 
        college: '', 
        state: '',
        city: '',
        reasoning: '' 
    });

    const [hasExperience, setHasExperience] = React.useState<Boolean>(false);
    const [errorField, setErrorField] = React.useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

    const router = useRouter();

    const { mutate, isPending } = useSubmitApplication();

    React.useEffect(() => { if (errorField) setErrorField(null) }, [formData]);

    const firstInvalidField = (): string | null => {
        const f = formData;
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim());
        const instaOk = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9_\.]+([\/]?)$/.test(f.instagramUrl.trim());
        
        if (!f.name.trim()) return 'name';
        if (!emailOk) return 'email';
        if (!f.phoneNo || String(f.phoneNo).replace(/\D/g, '').length < 7) return 'phoneNo';
        if (!f.instagramUrl.trim()) return 'instagramUrl';
        if (!f.state) return 'state';
        if (!f.city) return 'city';
        if (!f.college.trim()) return 'college';
        if (!f.course.trim()) return 'course';
        if (!f.currentYear) return 'currentYear';
        if (f.playedBefore === undefined) return 'playedBefore';
        if (f.playedBefore === true && !f.accountRank) return 'accountRank';
        if (f.hasTime === undefined) return 'hasTime';
        if (f.tournamentExp === undefined) return 'tournamentExp';
        if (f.hasExperience === undefined) return 'hasExperience';
        if (!f.convert.trim()) return 'convert';
        if (!f.reasoning.trim()) return 'reasoning';
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const invalid = firstInvalidField();
        if (invalid) {
            setErrorField(invalid);
            if (invalid === 'instagramUrl' && formData.instagramUrl.trim().length > 0) {
                toast.error('Please enter a valid Instagram URL (e.g., instagram.com/username)', { id: 'submit-toast' });
            } else {
                toast.error(`Please complete: ${FIELD_LABELS[invalid]}`, { id: 'submit-toast' });
            }
            document.getElementById(`field-${invalid}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const payload = { ...formData, accountRank: formData.playedBefore === true ? formData.accountRank : 'NA' as const };
        mutate(payload, {
            onSuccess: () => {
                setIsSubmitted(true);
            }
        });
    }

    const fc = (key: string, base: string) => `${base}${errorField === key ? ' field-invalid' : ''}`;

    return (
        <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-0 relative'>
            <div className='mb-6 md:mb-8'>
                <BackButton />
            </div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className='mb-8 md:mb-10 border-l-4 border-primary pl-4 md:pl-6'>
                <h1 className='text-2xl sm:text-4xl md:text-5xl font-black italic tracking-tighter text-white leading-[1] sm:leading-[0.9]'>
                    BECOME THE <span className='text-primary'>BGMI MVP</span>
                </h1>
                <p className='text-muted-foreground mt-2 font-medium tracking-[0.2em] md:tracking-[0.4em] uppercase text-[10px] md:text-sm'>
                    Enrollment Phase 1.0
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='tactical-panel p-5 sm:p-8 md:p-12 relative overflow-hidden'>
                <div className='absolute top-0 right-0 p-4 opacity-10 pointer-events-none hidden sm:block'>
                    <span className='text-4xl md:text-6xl font-black italic'>INFO</span>
                </div>

                <form onSubmit={handleSubmit} noValidate className='space-y-6 md:space-y-8 relative z-10'>
                    <div className='flex flex-col gap-5 md:gap-6'>
                        <div id='field-name' className={fc('name', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Full Name</label>
                            <input type='text' placeholder='E.G. JOHN DOE' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}/>
                        </div>

                        <div id='field-email' className={fc('email', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Your Email</label>
                            <input type='email' placeholder='JOHNDOE@GMAIL.COM' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
                        </div>

                        <div id='field-phoneNo' className={fc('phoneNo', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Phone Number</label>
                            <input type='tel' placeholder='E.G. 9876543210' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.phoneNo?.toString() || ''} onChange={(e) => setFormData({...formData, phoneNo: e.target.value ? parseInt(e.target.value) : undefined})}/>
                        </div>

                        <div id='field-state' className={fc('state', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>State / Union Territory</label>
                            <select value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value, city: ''})} className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors appearance-none cursor-pointer uppercase font-bold'>
                                <option value=''>-- SELECT STATE --</option>
                                {INDIA_STATES?.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>

                        <div id='field-city' className={fc('city', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>City</label>
                            <select value={formData.city} disabled={!formData.state} onChange={(e) => setFormData({...formData, city: e.target.value})} className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors appearance-none cursor-pointer uppercase font-bold disabled:opacity-40 disabled:cursor-not-allowed'>
                                <option value=''>-- SELECT CITY --</option>
                                {formData.state && CITIES_BY_STATE[formData.state]?.map((city) => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        <div id='field-college' className={fc('college', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>College / University</label>
                            <input type='text' placeholder='E.G. SRCC' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})}/>
                        </div>

                        <div id='field-course' className={fc('course', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Course / Degree</label>
                            <input type='text' placeholder='E.G. B.TECH / BA' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})}/>
                        </div>

                        <div id='field-currentYear' className={fc('currentYear', 'space-y-2')}>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Current Year</label>
                            <select value={formData.currentYear} onChange={(e) => setFormData({...formData, currentYear: e.target.value as any})} className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors appearance-none cursor-pointer uppercase font-bold'>
                                <option value=''>-- SELECT YEAR --</option>
                                <option value='1st Year'>1st Year</option>
                                <option value='2nd Year'>2nd Year</option>
                                <option value='3rd Year'>3rd Year</option>
                                <option value='4th Year'>4th Year</option>
                            </select>
                        </div>
                    </div>

					<div id='field-instagramUrl' className={fc('instagramUrl', 'space-y-2')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Instagram Profile URL</label>
                        <input type='url' placeholder='E.G. HTTPS://INSTAGRAM.COM/YOURUSERNAME' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors font-mono' value={formData.instagramUrl} onChange={(e) => setFormData({...formData, instagramUrl: e.target.value})}/>
                    </div>

                    <div id='field-playedBefore' className={fc('playedBefore', 'space-y-2 flex flex-col')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Have you played BGMI before?</label>
                        <div className='flex flex-row gap-4 sm:gap-6'>
                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='playedBefore' className='peer sr-only' checked={formData.playedBefore === true} onChange={() => setFormData({...formData, playedBefore: true, accountRank: ''})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ Yes ]
                                </span>
                              </div>
                            </label>

                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='playedBefore' className='peer sr-only' checked={formData.playedBefore === false} onChange={() => setFormData({...formData, playedBefore: false, accountRank: 'NA'})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ No ]
                                </span>
                              </div>
                            </label>
                        </div>
                    </div>

                    {formData.playedBefore === true && (
                    <div id='field-accountRank' className={fc('accountRank', 'space-y-2')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Competitive Rank</label>
                        <select value={formData.accountRank} onChange={(e) => setFormData({...formData, accountRank: e.target.value as any})} className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors appearance-none cursor-pointer uppercase font-bold'>
                            <option value=''>-- SELECT RANK --</option>
                            <option value='Bronze'>Bronze</option>
                            <option value='Silver'>Silver</option>
                            <option value='Gold'>Gold</option>
                            <option value='Platinum'>Platinum</option>
                            <option value='Diamond'>Diamond</option>
                            <option value='Crown'>Crown</option>
                            <option value='Ace'>Ace</option>
                            <option value='Ace Master'>Ace Master</option>
                            <option value='Ace Dominator'>Ace Dominator</option>
                            <option value='Conqueror'>Conqueror</option>
                        </select>
                    </div>
                    )}

                    <div id='field-hasTime' className={fc('hasTime', 'space-y-2 flex flex-col')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Would you be able to dedicate 5–6 hours/week across July to October?</label>
                        <div className='flex flex-row gap-4 sm:gap-6'>
                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='hasTime' className='peer sr-only' checked={formData.hasTime === true} onChange={() => setFormData({...formData, hasTime: true})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ Yes ]
                                </span>
                              </div>
                            </label>

                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='hasTime' className='peer sr-only' checked={formData.hasTime === false} onChange={() => setFormData({...formData, hasTime: false})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ No ]
                                </span>
                              </div>
                            </label>
                        </div>
                    </div>

                    <div id='field-tournamentExp' className={fc('tournamentExp', 'space-y-2 flex flex-col')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Have you participated in any esports tournaments before?</label>
                        <div className='flex flex-row gap-4 sm:gap-6'>
                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='tournamentExp' className='peer sr-only' checked={formData.tournamentExp === true} onChange={() => setFormData({...formData, tournamentExp: true})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ Yes ]
                                </span>
                              </div>
                            </label>

                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='tournamentExp' className='peer sr-only' checked={formData.tournamentExp === false} onChange={() => setFormData({...formData, tournamentExp: false})}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ No ]
                                </span>
                              </div>
                            </label>
                        </div>
                    </div>

                    <div id='field-hasExperience' className={fc('hasExperience', 'space-y-2 flex flex-col')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Do you have any prior experience organizing events?</label>
                        <div className='flex flex-row gap-4 sm:gap-6'>
                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='hasExperience' className='peer sr-only' checked={formData.hasExperience === true} onChange={() => { setFormData({...formData, hasExperience: true}); setHasExperience(true); }}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ Yes ]
                                </span>
                              </div>
                            </label>

                            <label className='relative flex-1 sm:flex-none'>
                              <input type='radio' name='hasExperience' className='peer sr-only' checked={formData.hasExperience === false} onChange={() => { setFormData({...formData, hasExperience: false}); setHasExperience(false); }}/>
                              <div className='flex items-center justify-center h-12 px-8 bg-black/50 border border-border cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/10 group'>
                                <div className='absolute left-2 w-1.5 h-1.5 bg-primary opacity-0 peer-checked:opacity-100 animate-pulse' />
                                <span className='text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground peer-checked:text-primary'>
                                  [ No ]
                                </span>
                              </div>
                            </label>
                        </div>
                    </div>

                    {hasExperience && (
                        <div className='space-y-2'>
                            <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Event Experience Details</label>
                            <textarea rows={4} onChange={(e) => setFormData({...formData, experienceDetails: e.target.value})} placeholder='ELABORATE ON YOUR EVENT ORGANIZATION EXPERIENCE...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.experienceDetails}/>
                        </div>
                    )}

                    <div id='field-convert' className={fc('convert', 'space-y-2')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>How would you get 50 BGMI players from your college to participate in a BGMI event?</label>
                        <textarea rows={4} onChange={(e) => setFormData({...formData, convert: e.target.value})} placeholder='ELABORATE ON YOUR ABILITY TO RECRUIT AND CONVERT PLAYERS...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.convert}/>
                    </div>

                    <div id='field-reasoning' className={fc('reasoning', 'space-y-2')}>
                        <label className='text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>Why would you be the best fit for BGMI Campus MVP?</label>
                        <textarea rows={4} onChange={(e) => setFormData({...formData, reasoning: e.target.value})} placeholder='ELABORATE ON YOUR STRENGTHS AND WHY YOU ARE THE RIGHT FIT...' className='w-full bg-black/50 border border-border p-3 md:p-4 text-sm md:text-base text-white focus:border-primary outline-none transition-colors resize-none' value={formData.reasoning}/>
                    </div>

                    <div className='pt-2 md:pt-4'>
                        <Button type='submit' disabled={isPending} className='pubg-btn w-full md:w-auto h-14 md:h-16 px-8 md:px-16 bg-primary text-black font-bold text-lg md:text-xl tracking-widest uppercase transition-all hover:bg-[#ffb24d] hover:shadow-[0_12px_34px_-10px_rgba(255,153,50,0.7)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
                            {isPending ? 'TRANSMITTING...' : 'DEPLOY APPLICATION'}
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
                                Your application has been submitted
                            </p>

                            <Button onClick={() => { setIsSubmitted(false); router.push('/') }} className='w-full h-12 bg-primary hover:bg-accent text-black font-black uppercase tracking-wider transition-colors'>
                                DONE
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}