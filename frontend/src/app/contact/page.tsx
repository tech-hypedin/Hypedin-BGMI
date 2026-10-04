'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { BackButton } from '@/components/application/backButton';
import { Navbar } from '@/components/layout/navbar';
import api from '@/lib/api';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    issueCategory: '',
    description: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.description || !formData.issueCategory) {
      toast.error('PLEASE FILL NAME, EMAIL AND ISSUE CATEGORY.');
      return;
    }
    setSending(true);
    try {
      const response = await api.post('/api/contact/submitQuery', formData);
      toast.success('TICKET TRANSMITTED. OUR TEAM WILL RESPOND BY EMAIL.');
      setFormData({ fullName: '', email: '', issueCategory: '', description: '' });
    } catch {
      toast.error('TRANSMISSION FAILED. PLEASE TRY AGAIN OR EMAIL US.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className='min-h-screen text-white flex flex-col items-center justify-start pt-28 md:pt-32 pb-12 px-4 selection:bg-primary selection:text-black'>
      <div className='w-full max-w-3xl'>

        <BackButton/>

        <div className='border-l-4 border-primary pl-4 mb-12 mt-8'>
          <h1 className='text-4xl md:text-5xl font-black uppercase tracking-tight italic'>
            COMMS <span className='text-primary'>CENTER</span>
          </h1>
          <p className='text-[10px] md:text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2'>
            SUBMIT A SUPPORT BRIEFING TICKET PHASE 1.0
          </p>
        </div>

        <form onSubmit={handleSubmit} className='bg-black/50 border border-border p-8 space-y-8 relative overflow-hidden'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                Full Name
              </label>
              <input type='text' name='fullName' placeholder='E.G. Your Name' value={formData.fullName} onChange={handleChange} required className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black tracking-widest text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700'/>
            </div>

            <div className='space-y-2'>
              <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                Your Email
              </label>
              <input type='email' name='email' placeholder='youremail@gmail.com' value={formData.email} onChange={handleChange} required className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black tracking-widest text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700'/>
            </div>
          </div>

          {/* <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                Phone No.
              </label>
              <input
                type='text'
                name='ign'
                placeholder='+91 1234567890'
                value={formData.ign}
                onChange={handleChange}
                required
                className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
                In-Game Account ID (UID)
              </label>
              <input
                type='text'
                name='uid'
                placeholder='E.G. 593193849'
                value={formData.uid}
                onChange={handleChange}
                required
                className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700'
              />
            </div>
          </div> */}

          <div className='space-y-2'>
            <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
              Issue Category
            </label>
            <div className='relative'>
              <select name='issueCategory' value={formData.issueCategory} onChange={handleChange} required className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-white appearance-none focus:outline-none focus:border-primary'>
                <option value='' className='bg-black text-zinc-600'>-- SELECT CATEGORY --</option>
                <option value='TOURNAMENT' className='bg-black'>Esports Tournament Discrepancy</option>
                <option value='CAMPUS_MVP' className='bg-black'>Campus MVP Program Issue</option>
                <option value='TECHNICAL' className='bg-black'>Platform Bug / Tech Support</option>
                <option value='OTHER' className='bg-black'>Other</option>
              </select>
              <div className='absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground text-xs'>
                ▼
              </div>
            </div>
          </div>

          {/* Priority Toggles */}
          {/* <div className='space-y-2'>
            <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
              Priority Level
            </label>
            <div className='grid grid-cols-3 gap-2 sm:gap-4'>
              {['LOW', 'MEDIUM', 'CRITICAL'].map((level) => (
                <label key={level} className='relative flex-1 cursor-pointer'>
                  <input
                    type='radio'
                    name='priority'
                    value={level}
                    checked={formData.priority === level}
                    onChange={() => setFormData((p) => ({ ...p, priority: level }))}
                    className='peer sr-only'
                  />
                  <div className='flex items-center justify-center h-12 px-1 bg-black/50 border border-border text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary'>
                    [ {level} ]
                  </div>
                </label>
              ))}
            </div>
          </div> */}

          <div className='space-y-2'>
            <label className='block text-[10px] md:text-xs font-black uppercase tracking-widest text-primary'>
              Elaborate on your issue details
            </label>
            <textarea name='description' rows={4} placeholder='ELABORATE ON YOUR ISSUE LOGS OR QUESTIONS...' value={formData.description} onChange={handleChange} required className='w-full bg-black/50 border border-border p-4 text-[10px] md:text-xs font-black tracking-widest text-white focus:outline-none focus:border-primary transition-colors placeholder-zinc-700 resize-none'/>
          </div>

          <div className='pt-4'>
            <button type='submit' disabled={sending} style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 95% 100%, 0 100%)' }} className='bg-primary hover:bg-[#ffb24d] text-black text-[10px] md:text-xs font-black uppercase tracking-widest py-4 px-10 transition-all duration-200 hover:shadow-[0_10px_26px_-8px_rgba(255,153,50,0.65)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none'>
              {sending ? 'TRANSMITTING…' : 'TRANSMIT TICKET'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}