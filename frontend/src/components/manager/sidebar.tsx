'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, Trophy, Gift, Users, LogOut, ChevronLeft, ChevronRight, NotebookPen, MousePointerSquareDashedIcon, MailPlusIcon, PlusSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import bgmiWhiteLogo from '../../../public/bgmi-logo-white.webp';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (val: boolean) => void;
}

const navItems = [
    { label: 'Dash', href: '/manager', icon: LayoutDashboard, section: 'PRIMARY' }
]

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const pathname = usePathname();

    useEffect(() => {
        if (isMobileOpen && setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    }, [pathname]);

    const handleLogout = async () => {
        localStorage.removeItem('userId');

        await api.post('/api/auth/logout');

        toast.success('LOGOUT SUCCESSFUL - DISCONNECTING...');
        
        window.location.href = '/';
    }

    return (
        <>
            {isMobileOpen && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden font-["Teko",_"Oswald",_sans-serif]' onClick={() => setIsMobileOpen?.(false)}/>
            )}

            <aside className={cn( 'fixed left-0 top-0 bottom-0 z-50 bg-[#090907] border-r border-[#1f1f1f] transition-all duration-300 ease-in-out font-["Teko",_"Oswald",_sans-serif]', isCollapsed ? 'lg:w-20' : 'lg:w-64', isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0' )}>
                <div className='flex flex-col h-full p-4 font-["Teko",_"Oswald",_sans-serif]'>
                    <div className={cn(
                        'mb-8 flex items-center pt-2 font-["Teko",_"Oswald",_sans-serif]',
                        isCollapsed && !isMobileOpen ? 'flex-col gap-4 justify-center' : 'justify-between'
                    )}>
                        {/* <Link href='/' className='flex items-center gap-3.5 overflow-hidden group/logo font-["Teko",_"Oswald",_sans-serif]'>
                            {(!isCollapsed || isMobileOpen) && (
                                <motion.div initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className='flex flex-col -space-y-1 font-["Teko",_"Oswald",_sans-serif]'>
                                    <span className='text-xl font-bold text-white uppercase tracking-tighter font-["Teko",_"Oswald",_sans-serif]'>BGMI</span>
                                    <span className='text-[10px] font-black text-primary uppercase tracking-[0.3em] font-["Teko",_"Oswald",_sans-serif]'>CAMPUS MVP</span>
                                </motion.div>
                            )}
                        </Link> */}

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

                        <button 
                            onClick={() => {
                                if (isMobileOpen) {
                                    setIsMobileOpen?.(false);
                                } else {
                                    onToggle();
                                }
                            }}
                            className='flex shrink-0 w-8 h-8 border border-[#1f1f1f] bg-transparent hover:bg-white/5 items-center justify-center text-[#8C8C8C] hover:text-white transition-all font-["Teko",_"Oswald",_sans-serif]'
                        >
                            {(isCollapsed && !isMobileOpen) ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    </div>

                    <div className='flex-1 space-y-6 overflow-y-auto no-scrollbar py-2 font-["Teko",_"Oswald",_sans-serif]'>
                        <div className='space-y-1 font-["Teko",_"Oswald",_sans-serif]'>
                            {(!isCollapsed || isMobileOpen) && (
                                <p className='text-[10px] font-black text-[#8C8C8C] uppercase tracking-[0.4em] px-4 mb-4 font-["Teko",_"Oswald",_sans-serif]'>SECTOR: PRIMARY</p>
                            )}
                            {navItems.filter(i => i.section === 'PRIMARY').map((item) => (
                                <SidebarItem key={item.href} {...item} isCollapsed={isCollapsed && !isMobileOpen} active={pathname === item.href}/>
                            ))}
                        </div>
                    </div>

                    <div className='mt-auto pt-6 border-t border-[#1f1f1f] space-y-1 font-["Teko",_"Oswald",_sans-serif]'>
                        <button onClick={() => handleLogout()} className={cn( 'flex items-center gap-4 w-full px-4 py-3 transition-all cursor-pointer duration-300 group hover:bg-[#ffb60e]/10 font-["Teko",_"Oswald",_sans-serif]', (isCollapsed && !isMobileOpen) ? 'justify-center' : 'justify-start' )}>
                            <LogOut className='w-5 h-5 text-[#8C8C8C] group-hover:text-[#ffb60e]' />
                            {(!isCollapsed || isMobileOpen) && (
                                <span className='text-sm font-medium text-[#8C8C8C] group-hover:text-[#ffb60e] uppercase tracking-widest transition-colors font-["Teko",_"Oswald",_sans-serif]'>Logout</span>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

function SidebarItem({ label, href, icon: Icon, isCollapsed, active }: any) {
    return (
        <Link href={href} className={cn( 'flex items-center gap-4 px-4 py-2.5 transition-all duration-150 group relative border-l-2 font-["Teko",_"Oswald",_sans-serif]', active ? 'border-primary bg-primary/5 text-primary' : 'border-transparent text-[#8C8C8C] hover:bg-zinc-950 hover:text-zinc-200', isCollapsed ? 'justify-center' : 'justify-start' )}>
            <Icon className={cn('w-[18px] h-[18px] transition-transform group-hover:scale-105 shrink-0', active ? 'text-primary drop-shadow-[0_0_8px_rgba(242,169,0,0.4)]' : 'text-inherit')} />
            {!isCollapsed && (
                <span className={cn(
                  'text-[15px] tracking-[0.18em] whitespace-nowrap uppercase transition-colors font-["Teko",_"Oswald",_sans-serif]',
                  active ? 'font-bold' : 'font-medium'
                )}>
                  {label}
                </span>
            )}

            {isCollapsed && (
                <div className='absolute left-full ml-4 px-3 py-1.5 bg-zinc-950 border border-primary/30 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none uppercase tracking-[0.2em] z-50 whitespace-nowrap shadow-xl before:absolute before:top-1/2 before:-left-[5px] before:-translate-y-1/2 before:w-2 before:h-2 before:bg-zinc-950 before:border-l before:border-b before:border-primary/30 before:rotate-45 font-["Teko",_"Oswald",_sans-serif]'>
                    {label}
                </div>
            )}
        </Link>
    );
}