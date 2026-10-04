'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Lock, ArrowRight, Loader2, KeyRound, X } from 'lucide-react';
import { useChangePassword } from '@/hooks/useChangePassword';
import { toast } from 'react-hot-toast';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility

export default function ChangePasswordModal({ isOpen, onComplete }: { isOpen: boolean, onComplete: () => void }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const { mutate: changePassword, isPending } = useChangePassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('ENCRYPTION KEYS DO NOT MATCH');
      return;
    }

    if (newPassword.length < 6) {
        toast.error('KEY STRENGTH INSUFFICIENT (MIN 6 CHARS)');
        return;
    }

    changePassword(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          onComplete();
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          onClick={onComplete} 
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-6 font-["Teko",_"Oswald",_sans-serif]'
        >
          {/* Close button for mobile users to quickly exit */}
          <button 
            onClick={onComplete}
            className='absolute top-6 right-6 text-[#444] hover:text-white transition-colors lg:hidden font-["Teko",_"Oswald",_sans-serif]'
          >
            <X size={24} />
          </button>

          <motion.div 
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className='w-full max-w-md max-h-[90vh] flex flex-col bg-[#0D0D0D] border-2 border-[#ffb60e]/20 shadow-[0_0_50px_rgba(255,182,14,0.1)] relative overflow-hidden font-["Teko",_"Oswald",_sans-serif]'
          >
            {/* Tactical background pattern */}
            <div className='absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#ffb60e] to-transparent opacity-50 font-["Teko",_"Oswald",_sans-serif]' />
            
            {/* Scrollable Container */}
            <div className='overflow-y-auto p-6 sm:p-8 no-scrollbar font-["Teko",_"Oswald",_sans-serif]'>
              <div className='flex flex-col items-center text-center space-y-6 font-["Teko",_"Oswald",_sans-serif]'>
                <div className='p-3 sm:p-4 bg-[#ffb60e]/10 border border-[#ffb60e]/20 rounded-full font-["Teko",_"Oswald",_sans-serif]'>
                  <ShieldAlert className='text-[#ffb60e] animate-pulse' size={32} />
                </div>
                
                <div className='font-["Teko",_"Oswald",_sans-serif]'>
                  <h2 className='text-xl sm:text-2xl font-black uppercase tracking-tighter text-white font-["Teko",_"Oswald",_sans-serif]'>
                    Security <span className='text-[#ffb60e] font-["Teko",_"Oswald",_sans-serif]'>Check</span>
                  </h2>
                  {/* <p className='text-[#444] text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mt-2 font-["Teko",_"Oswald",_sans-serif]'>
                    Temporary Credentials Detected // Update Encryption Key
                  </p> */}
                </div>

                <form onSubmit={handleSubmit} className='w-full space-y-4 font-["Teko",_"Oswald",_sans-serif]'>
                  <div className='relative font-["Teko",_"Oswald",_sans-serif]'>
                    <KeyRound className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input 
                      type='password' 
                      required
                      placeholder='CURRENT PASSWORD'
                      className='w-full bg-black border border-[#1f1f1f] pl-10 pr-4 py-3 text-sm focus:border-[#ffb60e] outline-none text-white transition-all font-mono placeholder:text-[#333]'
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>

                  <div className='h-px bg-[#1f1f1f] w-full my-2 font-["Teko",_"Oswald",_sans-serif]' />

                  <div className='relative font-["Teko",_"Oswald",_sans-serif]'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input 
                      type='password' 
                      required
                      placeholder='NEW PASSWORD'
                      className='w-full bg-black border border-[#1f1f1f] pl-10 pr-4 py-3 text-sm focus:border-[#ffb60e] outline-none text-white transition-all font-mono placeholder:text-[#333]'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className='relative font-["Teko",_"Oswald",_sans-serif]'>
                    <Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-[#444]' size={16} />
                    <input 
                      type='password' 
                      required
                      placeholder='CONFIRM NEW PASSWORD'
                      className='w-full bg-black border border-[#1f1f1f] pl-10 pr-4 py-3 text-sm focus:border-[#ffb60e] outline-none text-white transition-all font-mono placeholder:text-[#333]'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className='flex flex-col gap-3 pt-4 font-["Teko",_"Oswald",_sans-serif]'>
                    <button 
                      type='submit'
                      disabled={isPending}
                      className='w-full bg-[#ffb60e] hover:bg-[#ffdb4d] text-black font-black py-4 flex items-center justify-center gap-2 transition-all uppercase text-[10px] sm:text-xs tracking-widest disabled:opacity-50 group font-["Teko",_"Oswald",_sans-serif]'
                    >
                      {isPending ? (
                        <Loader2 className='animate-spin text-black' />
                      ) : (
                        <span className='flex items-center justify-center gap-2 font-["Teko",_"Oswald",_sans-serif]'>
                          Update Password
                          <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' />
                        </span>
                      )}
                    </button>

                    <button 
                        type='button'
                        onClick={() => onComplete()}
                        disabled={isPending}
                        className='w-full bg-transparent hover:bg-white/5 border border-[#1f1f1f] text-[#444] hover:text-white font-black py-3 flex items-center justify-center transition-all uppercase text-[10px] tracking-widest disabled:opacity-50 font-["Teko",_"Oswald",_sans-serif]'
                    >
                      Close
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