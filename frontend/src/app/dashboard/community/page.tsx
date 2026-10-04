'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Globe, User, ShieldCheck, Loader2, ChevronLeft, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { useSocket } from '@/context/socketContext';
import { cn } from '@/lib/utils';

export default function AdminCommunityPage() {
    const { socket, messages: socketMessages } = useSocket();
    const queryClient = useQueryClient();
    const scrollRef = useRef<HTMLDivElement>(null);
  
    const [text, setText] = useState('');
    const [myId, setMyId] = useState<string | null>('');
    const [selectedTarget, setSelectedTarget] = useState<any>(null);

    const { data: contactData, isLoading: loadingContacts } = useQuery({
        queryKey: ['admin-contacts'],
        queryFn: async () => {
            const { data } = await api.get('/api/message/ambassador');
            return data.contacts;
        }
    });

    const { data: history, isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', selectedTarget?._id],
        queryFn: async () => {
            if (!selectedTarget) return [];
            const { data } = await api.get(`/api/message/${selectedTarget._id}`);
            return data.messages;
        },
        enabled: !!selectedTarget,
    });

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history, socketMessages, selectedTarget]);

    const sendMutation = useMutation({
        mutationFn: async (payload: { receiverId: string, message: string }) => {
            return api.post('/api/message', payload);
        },
        onSuccess: (res) => {
            queryClient.setQueryData(['messages', selectedTarget?._id], (old: any) => [...(old || []), res.data.newMessage]);
            setText('');
        }
    });

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || !selectedTarget) return;
        sendMutation.mutate({ receiverId: selectedTarget._id, message: text });
    }

    const currentMessages = React.useMemo(() => {
        const activeChatId = selectedTarget?.ambassadorId?._id || selectedTarget?._id;
        const combined = [
            ...(history || []),
            ...(socketMessages[activeChatId] || [])
        ]
    
        return Array.from(new Map(combined.map(msg => [msg._id, msg])).values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }, [history, socketMessages, selectedTarget]);

    React.useEffect(() => {
        const userid = localStorage.getItem('userId');
        setMyId(userid);
    }, []);

    return (
        <div className='flex h-[85vh] md:h-[80vh] border border-[#1f1f1f] bg-black/40 backdrop-blur-md overflow-hidden rounded-lg relative font-["Teko","Oswald",sans-serif] antialiased'>
            <div className={cn( 'w-full md:w-80 border-r border-[#1f1f1f] flex flex-col bg-black/20 transition-all font-["Teko","Oswald",sans-serif]', selectedTarget ? 'hidden md:flex' : 'flex' )}>
                <div className='p-4 border-b border-[#1f1f1f] bg-primary/10 flex justify-between items-center font-["Teko","Oswald",sans-serif]'>
                    <h2 className='text-base font-black tracking-widest uppercase text-primary font-["Teko","Oswald",sans-serif]'>Comms Channels</h2>
                    <Menu className='md:hidden text-primary' size={18} />
                </div>
        
                <div className='flex-1 overflow-y-auto no-scrollbar font-["Teko","Oswald",sans-serif]'>
                    {contactData?.group?.map((g: any) => (
                        <button key={g._id} onClick={() => setSelectedTarget(g)} className={cn('hover:cursor-pointer w-full p-4 flex items-center gap-3 transition-all border-b border-white/5 font-["Teko","Oswald",sans-serif]', selectedTarget?._id === g._id ? 'bg-primary text-black' : 'hover:bg-white/5 text-white' )}>
                            <Globe size={20} />
                            <div className='text-left font-["Teko","Oswald",sans-serif]'>
                                <span className='font-bold uppercase tracking-wider block text-sm font-["Teko","Oswald",sans-serif]'>Global Broadcast</span>
                                <span className='text-xs opacity-70 uppercase font-black font-["Teko","Oswald",sans-serif]'>{g.name}</span>
                            </div>
                        </button>
                    ))}

                    <div className='p-4 border-b border-[#1f1f1f] bg-white/5 font-["Teko","Oswald",sans-serif]'>
                        <h3 className='text-xs font-black uppercase tracking-[0.2em] text-muted-foreground font-["Teko","Oswald",sans-serif]'>Direct Access</h3>
                    </div>

                    {loadingContacts ? (
                        <div className='p-10 text-center animate-pulse text-sm font-black uppercase text-[#444] font-["Teko","Oswald",sans-serif]'>Syncing Operatives...</div>
                    ) : contactData?.individuals?.map((amb: any) => (
                        <button key={amb._id} onClick={() => setSelectedTarget(amb)} className={cn('hover:cursor-pointer w-full p-4 flex items-center justify-between transition-all border-b border-white/5 font-["Teko","Oswald",sans-serif]', selectedTarget?._id === amb._id ? 'bg-white text-black' : 'hover:bg-white/5 text-white' )}>
                            <div className='flex items-center gap-3 font-["Teko","Oswald",sans-serif]'>
                                <div className='relative'>
                                    <User size={18} className={selectedTarget?._id === amb._id ? 'text-black' : 'text-primary'} />
                                </div>
                                <div className='text-left font-["Teko","Oswald",sans-serif]'>
                                    <p className='text-sm font-black leading-none uppercase italic font-["Teko","Oswald",sans-serif]'>{amb.email.split('@')[0]}</p>
                                    <p className='text-[11px] opacity-50 uppercase font-bold font-["Teko","Oswald",sans-serif]'>{amb.role}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className={cn( 'flex-1 flex flex-col relative bg-black/40 transition-all font-["Teko","Oswald",sans-serif]', !selectedTarget ? 'hidden md:flex' : 'flex' )}>
                {!selectedTarget ? (
                    <div className='flex-1 flex flex-col items-center justify-center text-[#222] p-6 text-center font-["Teko","Oswald",sans-serif]'>
                        <ShieldCheck size={80} strokeWidth={0.5} />
                        <p className='font-black uppercase tracking-[0.5em] mt-4 text-sm font-["Teko","Oswald",sans-serif]'>Select Target for Comms</p>
                    </div>
                ) : (
                    <>
                        <div className='p-4 border-b border-[#1f1f1f] flex items-center gap-3 bg-black/40 font-["Teko","Oswald",sans-serif]'>
                            <button onClick={() => setSelectedTarget(null)} className='md:hidden p-2 -ml-2 text-primary hover:bg-primary/10 rounded-full'>
                                <ChevronLeft size={24} />
                            </button>

                            <div className='flex items-center gap-3 truncate font-["Teko","Oswald",sans-serif]'>
                                <ShieldCheck className='text-primary shrink-0' size={18} />
                                <h1 className='font-black italic uppercase text-base sm:text-xl tracking-wider truncate font-["Teko","Oswald",sans-serif]'>
                                    {selectedTarget.groupType === 'Global' ? 'BROADCAST ENCRYPTED' : `LINE: ${selectedTarget.email?.split('@')[0] || selectedTarget.name}` }
                                </h1>
                            </div>
                        </div>

                        <div className='flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar bg-[url("/grid.svg")] bg-repeat font-["Teko","Oswald",sans-serif]'>
                            {loadingMessages ? (
                                <div className='h-full flex items-center justify-center animate-pulse text-sm font-black text-primary uppercase font-["Teko","Oswald",sans-serif]'>Decrypting History...</div>
                            ) : (
                                currentMessages.map((msg: any, i: number) => {
                                    const isMe = msg.senderId?._id === myId || msg.senderId === myId;
                                    return (
                                        <div key={i} className={cn('flex flex-col font-["Teko","Oswald",sans-serif]', isMe ? 'items-end' : 'items-start')}>
                                            <div className={cn( 'max-w-[85%] md:max-w-[70%] p-3 border font-["Teko","Oswald",sans-serif]', isMe ? 'border-primary bg-primary/10' : 'border-[#1f1f1f] bg-white/5' )}>
                                                <div className='flex justify-between items-center gap-4 mb-1 font-["Teko","Oswald",sans-serif]'>
                                                    <p className='text-[11px] sm:text-xs text-primary uppercase font-black truncate font-["Teko","Oswald",sans-serif]'>
                                                        {msg.senderId?.IGN || (isMe ? 'YOU' : 'COMMAND')}
                                                    </p>
                                                    <p className='text-[10px] text-muted-foreground font-black font-["Teko","Oswald",sans-serif]'>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                                <p className='text-sm sm:text-base leading-relaxed wrap-break-words font-["Teko","Oswald",sans-serif]'>{msg.message}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className='p-3 sm:p-4 bg-black border-t border-[#1f1f1f] flex gap-2 sm:gap-4 font-["Teko","Oswald",sans-serif]'>
                            <input value={text} onChange={(e) => setText(e.target.value)} placeholder='INPUT DATA...' className='flex-1 bg-black border border-[#1f1f1f] px-3 py-3 sm:p-4 outline-none focus:border-primary transition-all text-xs sm:text-sm font-bold text-white uppercase font-["Teko","Oswald",sans-serif]'/>
                            <Button type='submit' disabled={sendMutation.isPending || !text.trim()} className='h-auto px-4 sm:px-10 bg-primary text-black font-black italic skew-x-[-10deg] hover:bg-white transition-all disabled:opacity-50 disabled:skew-x-0 font-["Teko","Oswald",sans-serif]'>
                                <span className='skew-x-10 flex items-center gap-2 font-["Teko","Oswald",sans-serif]'>
                                    {sendMutation.isPending ? <Loader2 className='animate-spin' size={16} /> : <Send size={16} />}
                                    <span className='hidden sm:inline font-["Teko","Oswald",sans-serif]'>SEND</span>
                                </span>
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}