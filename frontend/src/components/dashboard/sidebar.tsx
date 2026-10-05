'use client'

import { useState, useEffect } from 'react';
import bgmiWhiteLogo from '../../../public/bgmi-logo-white.webp';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, Trophy, Target, Gift, Award, Users, User, LogOut, ChevronLeft, ChevronRight, X, ArrowBigUpDashIcon } from 'lucide-react';

import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { useSocket } from '@/context/socketContext';
// import ChangePasswordModal from '@/components/dashboard/passwordChangeModal'; 

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, section: 'PRIMARY' },
  { label: 'Missions', href: '/dashboard/missions', icon: Target, section: 'PRIMARY' },
  { label: 'Rewards', href: '/dashboard/rewards', icon: Gift, section: 'PRIMARY' },
  { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy, section: 'PRIMARY' },
  { label: 'Community', href: '/dashboard/community', icon: Users, section: 'SECONDARY' },
  { label: 'Your Cohort', href: '/dashboard/cohort', icon: Users, section: 'SECONDARY' },
  { label: 'Nominate a Player', href: '/dashboard/nomination-form', icon: ArrowBigUpDashIcon, section: 'SECONDARY' },
  { label: 'Profile', href: '/dashboard/profile', icon: User, section: 'SECONDARY' },
  { label: 'Missions', href: '/dashboard/specificMissions', icon: Target, section: 'BONUS WOW CHALLENGE' },
  { label: 'Leaderboard', href: '/dashboard/leaderboardForSpecificTask', icon: Trophy, section: 'BONUS WOW CHALLENGE' }
]

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { socket } = useSocket();
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);

  // Auto-close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const handleLogout = async () => {
    localStorage.removeItem('userId');

    await api.post('/api/auth/logout');

    socket?.disconnect();

    toast.success('LOGOUT SUCCESSFUL - DISCONNECTING TERMINAL...');
    
    window.location.href = '/';
  }

  return (
    <>
      {/* MOBILE OVERLAY BACKDROP */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className='fixed inset-0 bg-black/85 backdrop-blur-md z-45 lg:hidden font-["Teko",_"Oswald",_sans-serif]'
          />
        )}
      </AnimatePresence>

      <aside 
        className={cn(
          'fixed left-0 top-0 bottom-0 z-48 bg-[#070705] border-r border-zinc-900 transition-all duration-300 shadow-[5px_0_25px_rgba(0,0,0,0.5)] font-["Teko","Oswald",sans-serif]',
          'before:absolute before:inset-0 before:bg-[linear-gradient(rgba(242,169,0,0.01)_1px,transparent_1px)] before:bg-[size:100%_4px] before:pointer-events-none',
          // Desktop sizing
          isCollapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile sizing and visibility
          isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className='flex flex-col h-full p-4 relative font-["Teko","Oswald",sans-serif]'>
          {/* Top Decorative Tech Bar */}
          <div className='absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-primary/40 via-transparent to-transparent font-["Teko","Oswald",sans-serif]' />
          
          <div className={cn(
            'mb-8 flex items-center pt-2 font-["Teko","Oswald",sans-serif]',
            isCollapsed && !isMobileOpen ? 'flex-col gap-4 justify-center' : 'justify-between'
          )}>
            <Link href='/' className='flex flex-1 items-center justify-center overflow-hidden group/logo'>
              {(!isCollapsed || isMobileOpen) ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className='flex items-center justify-center w-full'
                >
                  <img 
                    src={bgmiWhiteLogo.src} 
                    alt="BGMI Logo" 
                    className="h-12 w-auto object-contain transition-transform group-hover/logo:scale-105"
                  />
                  <span className="hidden sm:block border-l border-border pl-3">
                    <span className="block font-heading text-sm leading-none text-accent tracking-[0.15em]">CAMPUS MVP</span>
                  </span>
                </motion.div>
              ) : (
                <img 
                  src={bgmiWhiteLogo.src} 
                  alt="BGMI Logo" 
                  className="h-6 w-auto object-contain transition-transform group-hover/logo:scale-110"
                />
              )}
            </Link>
            
            {/* Desktop Toggle */}
            <button 
              onClick={onToggle}
              className='hidden lg:flex shrink-0 w-8 h-8 border border-zinc-900 bg-zinc-950/40 hover:bg-primary/5 items-center justify-center text-zinc-500 hover:text-primary transition-all hover:border-primary/30 font-["Teko","Oswald",sans-serif]'
            >
              {isCollapsed ? <ChevronRight size={14} className='drop-shadow-[0_0_3px_rgba(242,169,0,0.3)]' /> : <ChevronLeft size={14} />}
            </button>

            {/* Mobile Close */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className='lg:hidden p-2 text-zinc-600 hover:text-amber-500 transition-colors border border-transparent hover:border-zinc-900 bg-transparent font-["Teko",_"Oswald",_sans-serif]'
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Section */}
          <div className='flex-1 space-y-6 overflow-y-auto no-scrollbar py-2 border-t border-zinc-900/40 mt-2 font-["Teko",_"Oswald",_sans-serif]'>
            {/* Primary Sector */}
            <div className='space-y-1.5 font-["Teko",_"Oswald",_sans-serif]'>
              {(!isCollapsed || isMobileOpen) && (
                <div className='flex items-center gap-2 px-4 mb-3 font-["Teko",_"Oswald",_sans-serif]'>
                  <span className='w-1 h-2.5 bg-primary block' />
                  <p className='text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.35em] leading-none font-["Teko",_"Oswald",_sans-serif]'>SECTOR // PRIMARY</p>
                </div>
              )}
              {navItems.filter(i => i.section === 'PRIMARY').map((item) => (
                <SidebarItem key={`primary-${item.href}`} {...item} isCollapsed={isCollapsed && !isMobileOpen} active={pathname === item.href} />
              ))}
            </div>

            {/* Auxiliary Sector */}
            <div className='space-y-1.5 pt-2 font-["Teko",_"Oswald",_sans-serif]'>
              {(!isCollapsed || isMobileOpen) && (
                <div className='flex items-center gap-2 px-4 mb-3 font-["Teko",_"Oswald",_sans-serif]'>
                  <span className='w-1 h-2.5 bg-zinc-700 block' />
                  <p className='text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.35em] leading-none font-["Teko",_"Oswald",_sans-serif]'>SECTOR // AUXILIARY</p>
                </div>
              )}
              {navItems.filter(i => i.section === 'SECONDARY').map((item) => (
                <SidebarItem key={`secondary-${item.href}`} {...item} isCollapsed={isCollapsed && !isMobileOpen} active={pathname === item.href} />
              ))}
            </div>

            {/* Bonus WOW Challenge Sector */}
            <div className='space-y-1.5 pt-2 font-["Teko",_"Oswald",_sans-serif]'>
              {(!isCollapsed || isMobileOpen) && (
                <div className='flex items-center gap-2 px-4 mb-3 font-["Teko",_"Oswald",_sans-serif]'>
                  <span className='w-1 h-2.5 bg-amber-500 block' />
                  <p className='text-[11px] font-semibold text-zinc-500 uppercase tracking-[0.35em] leading-none font-["Teko",_"Oswald",_sans-serif]'>// BONUS WOW CHALLENGE</p>
                </div>
              )}
              {navItems.filter(i => i.section === 'BONUS WOW CHALLENGE').map((item) => (
                <SidebarItem key={`bonus-${item.href}`} {...item} isCollapsed={isCollapsed && !isMobileOpen} active={pathname === item.href} />
              ))}
            </div>
          </div>

          {/* Bottom Controls */}
          <div className='mt-auto pt-4 border-t border-zinc-900 space-y-1.5 bg-gradient-to-t from-black/20 to-transparent font-["Teko",_"Oswald",_sans-serif]'>
            <button onClick={handleLogout} className={cn(
              'flex items-center gap-4 w-full cursor-pointer px-4 py-3 transition-all duration-200 group hover:bg-amber-600/10 border border-transparent hover:border-amber-600/20 rounded-none font-["Teko",_"Oswald",_sans-serif]',
              (isCollapsed && !isMobileOpen) ? 'justify-center' : 'justify-start'
            )}>
              <LogOut className='w-5 h-5 text-zinc-500 group-hover:text-amber-500 transition-colors shrink-0' />
              {(!isCollapsed || isMobileOpen) && <span className='text-sm font-medium text-zinc-400 group-hover:text-white uppercase tracking-[0.2em] whitespace-nowrap transition-colors font-["Teko",_"Oswald",_sans-serif]'>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ label, href, icon: Icon, isCollapsed, active }: any) {
  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center gap-4 px-4 py-2.5 transition-all duration-150 group relative border-l-2 font-["Teko",_"Oswald",_sans-serif]',
        active 
          ? 'border-primary bg-gradient-to-r from-primary/10 to-transparent text-primary' 
          : 'border-transparent text-zinc-400 hover:bg-zinc-950 hover:text-zinc-200 hover:border-zinc-800',
        isCollapsed ? 'justify-center' : 'justify-start'
      )}
    >
      <Icon className={cn('w-[18px] h-[18px] transition-transform group-hover:scale-105 shrink-0', active ? 'text-primary drop-shadow-[0_0_8px_rgba(242,169,0,0.4)]' : 'text-inherit')} />
      {!isCollapsed && (
        <span className={cn(
          'text-[15px] tracking-[0.18em] whitespace-nowrap uppercase transition-colors font-["Teko",_"Oswald",_sans-serif]',
          active ? 'font-bold' : 'font-medium'
        )}>
          {label}
        </span>
      )}
      
      {/* Mini Pointer Crosshair Dot for active items */}
      {active && !isCollapsed && (
        <div className='absolute right-4 w-1 h-1 bg-primary rounded-full animate-pulse shadow-[0_0_4px_rgba(242,169,0,0.8)] font-["Teko",_"Oswald",_sans-serif]' />
      )}

      {isCollapsed && (
        <div className='absolute left-full ml-4 px-3 py-1.5 bg-zinc-950 border border-primary/30 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none uppercase tracking-[0.2em] z-50 whitespace-nowrap shadow-xl before:absolute before:top-1/2 before:-left-[5px] before:-translate-y-1/2 before:w-2 before:h-2 before:bg-zinc-950 before:border-l before:border-b before:border-primary/30 before:rotate-45 font-["Teko",_"Oswald",_sans-serif]'>
          {label}
        </div>
      )}
    </Link>
  );
}