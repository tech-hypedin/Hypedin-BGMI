'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth'; 

export default function LoginPage() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
  
    const { mutate, isPending } = useLogin();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(credentials, {
            onSuccess: (response: any) => {
                const userRole = response?.data?.user?.role || response?.user?.role;

                if (userRole !== 'admin') {
                    sessionStorage.setItem('is_fresh_login_session', 'true');
                }
            }
        });
    }

    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-background px-4 relative overflow-hidden'>
            <div className='absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-size-[4rem_4rem]' />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='w-full max-w-md'>
                <div className='mb-6 flex items-center justify-between border-b border-primary/30 pb-2'>
                    <div className='flex items-center gap-2'>
                        <div className='w-2 h-2 bg-primary animate-pulse' />
                        <span className='text-[10px] font-black text-primary tracking-[0.3em] uppercase'>
                            Authentication Terminal v2.0
                        </span>
                    </div>
                    <Link href='/' className='text-[10px] text-muted-foreground hover:text-white uppercase tracking-widest'>
                        [ Cancel ]
                    </Link>
                </div>

                <div className='tactical-panel p-8 relative'>
                    <div className='mb-8 text-center'>
                        <h1 className='text-4xl font-black italic text-white tracking-tighter uppercase leading-none'>
                            Identity <span className='text-primary text-glow'>Verification</span>
                        </h1>
                        <p className='text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold'>
                            Enter Credentials to Proceed to Intel
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className='space-y-6'>
                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-primary/80'>
                                Personnel ID / Email
                            </label>
                            <input type='email' placeholder='example@gmail.com' value={credentials.email} onChange={(e) => setCredentials({...credentials, email: e.target.value})} className='w-full bg-black/40 border border-border p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all font-mono' required/>
                        </div>

                        <div className='space-y-2'>
                            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-primary/80'>
                                Security Cipher
                            </label>
                            <input type='password' placeholder='••••••••' value={credentials.password} onChange={(e) => setCredentials({...credentials, password: e.target.value})} className='w-full bg-black/40 border border-border p-4 text-white focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all' required/>
                        </div>

                        <Button type='submit' disabled={isPending} className='pubg-btn w-full h-14 bg-primary hover:bg-accent text-black font-black text-lg tracking-widest uppercase transition-all'>
                            {isPending ? 'VERIFYING...' : 'INITIALIZE LOGIN'}
                        </Button>
                    </form>

                    <div className='mt-8 pt-6 border-t border-border/50 flex flex-col gap-3 text-center'>
                        <div className='flex items-center gap-2 justify-center'>
                            <span className='text-[10px] text-muted-foreground uppercase tracking-widest'>New Recruit?</span>
                            <Link href='/application' className='text-[10px] text-primary hover:text-white uppercase tracking-widest font-bold underline underline-offset-4'>
                                Apply for Access
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='mt-4 flex justify-end px-2 opacity-40'>
                    <span className='text-[8px] font-mono text-white'>LOC: {new Date().getFullYear()}.REDACTED</span>
                </div>
            </motion.div>
        </div>
    );
}