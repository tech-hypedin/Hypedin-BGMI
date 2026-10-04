'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function PasswordSetupModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: () => void }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('PASSWORDS DO NOT MATCH');
    if (password.length < 8) return toast.error('PASSWORD MUST BE AT LEAST 8 CHARACTERS');

    setLoading(true);
    try {
      await api.post('/api/auth/setup', { password });
      toast.success('SECURITY CLEARANCE UPDATED');
      onComplete();
    } catch (err) {
      toast.error('ENCRYPTION FAILED: RETRY');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 h-full w-full'>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className='w-full max-w-md bg-[#0D0D0D] border-2 border-red-600/20 shadow-[0_0_50px_rgba(220,38,38,0.1)] relative overflow-hidden flex flex-col max-h-[90vh]'
          >
            {/* Top accent line */}
            <div className='absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-red-600 to-transparent opacity-50' />

            {/* Scrollable Container for small screens */}
            <div className='overflow-y-auto no-scrollbar p-6 sm:p-8'>
              <div className='flex flex-col items-center text-center space-y-6'>
                <div className='p-3 sm:p-4 bg-red-600/10 border border-red-600/20 rounded-full'>
                  <ShieldAlert className='text-red-600 animate-pulse' size={32} />
                </div>
                
                <div>
                  <h2 className='text-xl sm:text-2xl font-black uppercase italic tracking-tighter text-white leading-tight'>
                    Security <span className='text-red-600'>Override</span> Required
                  </h2>
                  <p className='text-[#444] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-2'>
                    Temporary Credentials Detected // Update Encryption Key
                  </p>
                </div>

                <form onSubmit={handleSubmit} className='w-full space-y-4'>
                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input 
                      type='password' 
                      required
                      placeholder='NEW ACCESS KEY'
                      className='w-full bg-black border border-[#1f1f1f] pl-10 pr-4 py-3 text-sm focus:border-red-600 outline-none text-white transition-all font-mono placeholder:text-[#333]'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className='relative'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input 
                      type='password' 
                      required
                      placeholder='CONFIRM ACCESS KEY'
                      className='w-full bg-black border border-[#1f1f1f] pl-10 pr-4 py-3 text-sm focus:border-red-600 outline-none text-white transition-all font-mono placeholder:text-[#333]'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className='pt-2 flex flex-col gap-3'>
                    <button 
                      type='submit'
                      disabled={loading}
                      className='w-full bg-red-600 hover:bg-red-500 text-white font-black py-4 flex items-center justify-center gap-2 transition-all uppercase text-[10px] sm:text-xs tracking-widest disabled:opacity-50 group'
                    >
                      {loading ? (
                        <Loader2 className='animate-spin' />
                      ) : (
                        <>
                          Initialize Security Update 
                          <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}