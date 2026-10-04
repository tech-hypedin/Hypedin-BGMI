'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, Globe, User, ShieldCheck, Loader2, Menu, ChevronLeft } from 'lucide-react';
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
    const [showSidebar, setShowSidebar] = useState(true);
    const [selectedTarget, setSelectedTarget] = useState<any>(null);

    const { data: contactData, isLoading: loadingContacts } = useQuery({
        queryKey: ['admin-contacts'],
        queryFn: async () => {
            const { data } = await api.get('/api/message');
            return data.contacts;
        }
    });

    const { data: history, isLoading: loadingMessages } = useQuery({
        queryKey: ['messages', selectedTarget?._id],
        queryFn: async () => {
            if (!selectedTarget) return [];
            const activeChat = selectedTarget.ambassadorId?._id || selectedTarget._id
            const { data } = await api.get(`/api/message/${activeChat}`);
            return data.messages;
        },
        enabled: !!selectedTarget,
    });

    const handleSelectTarget = (target: any) => {
        setSelectedTarget(target);
        if (window.innerWidth < 1024) {
            setShowSidebar(false);
        }
    }

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
        sendMutation.mutate({ receiverId: selectedTarget.ambassadorId?._id || selectedTarget?._id, message: text });
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
        <div className='flex h-[85vh] border border-[#1f1f1f] bg-black/40 backdrop-blur-md overflow-hidden rounded-lg relative'>   
            <div className={cn( 'absolute inset-y-0 left-0 z-20 w-full md:w-80 border-r border-[#1f1f1f] flex flex-col bg-[#090907] transition-transform duration-300 lg:relative lg:translate-x-0', showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' )}>
                <div className='p-4 border-b border-[#1f1f1f] bg-primary/10 flex justify-between items-center'>
                    <h2 className='text-sm font-black tracking-widest uppercase text-primary'>Comms Channels</h2>
                    <button className='lg:hidden' onClick={() => setShowSidebar(false)}>
                        <ChevronLeft className='text-white' />
                    </button>
                </div>
        
                <div className='flex-1 overflow-y-auto no-scrollbar'>
                    {contactData?.group?.map((g: any) => (
                        <button key={g._id} onClick={() => handleSelectTarget(g)} className={cn('hover:cursor-pointer w-full p-4 flex items-center gap-3 transition-all border-b border-white/5', selectedTarget?._id === g._id ? 'bg-primary text-black' : 'hover:bg-white/5 text-white' )}>
                            <Globe size={20} />
                            <div className='text-left'>
                                <span className='font-bold uppercase tracking-tighter block text-xs'>Global Broadcast</span>
                                <span className='text-[9px] opacity-70 uppercase font-black'>{g.name}</span>
                            </div>
                        </button>
                    ))}

                    <div className='p-4 border-b border-[#1f1f1f] bg-white/5'>
                        <h3 className='text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground'>Direct Access: Ambassadors</h3>
                    </div>

                    {loadingContacts ? (
                        <div className='p-10 text-center animate-pulse text-[10px] font-black uppercase text-[#444]'>Syncing Operatives...</div>
                    ) : contactData?.individuals?.map((amb: any) => (
                        <button key={amb._id} onClick={() => handleSelectTarget(amb)} className={cn('hover:cursor-pointer w-full p-4 flex items-center justify-between transition-all border-b border-white/5', selectedTarget?._id === amb._id ? 'bg-white text-black' : 'hover:bg-white/5 text-white' )}>
                            <div className='flex items-center gap-3'>
                                <div className='relative'>
                                    <User size={18} className={selectedTarget?._id === amb._id ? 'text-black' : 'text-primary'} />
                                    {/* <div className='absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-black' /> */}
                                </div>
                                <div className='text-left'>
                                    <p className='text-xs font-black leading-none uppercase italic'>{amb.IGN}</p>
                                    <p className='text-[9px] opacity-50 uppercase font-bold'>{amb.name}</p>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex-1 flex flex-col relative bg-black/40 w-full'>
                {!selectedTarget ? (
                    <div className='flex-1 flex flex-col items-center justify-center text-[#222] p-6 text-center'>
                        <button onClick={() => setShowSidebar(true)} className='lg:hidden mb-4 p-2 border border-[#1f1f1f] rounded text-primary'>
                            <Menu size={24} />
                        </button>
                        <ShieldCheck size={80} strokeWidth={0.5} />
                        <p className='font-black uppercase tracking-[0.5em] mt-4 text-xs md:text-base'>Select Target for Comms</p>
                    </div>
                ) : (
                    <>
                        <div className='p-4 border-b border-[#1f1f1f] flex items-center justify-between bg-black/40'>
                            <div className='flex items-center gap-3'>
                                <button onClick={() => setShowSidebar(true)} className='lg:hidden p-1 mr-1 text-primary'>
                                    <Menu size={20} />
                                </button>
                                <ShieldCheck className='text-primary hidden sm:block' size={20} />
                                <h1 className='font-black italic uppercase text-sm md:text-lg tracking-tighter truncate'>
                                    {selectedTarget.groupType === 'Global' ? 'BROADCAST' : `LINE: ${selectedTarget.IGN || selectedTarget.name || 'OPPERATIVE'}` }
                                </h1>
                            </div>
                        </div>

                        <div className='flex-1 p-4 md:p-6 overflow-y-auto space-y-4 font-mono no-scrollbar'>
                            {loadingMessages ? (
                                <div className='h-full flex items-center justify-center animate-pulse text-[10px] font-black text-primary uppercase'>Decrypting History...</div>
                            ) : (
                                currentMessages.map((msg: any, i: number) => {
                                    const isMe = msg.senderId?._id === myId;
                                    return (
                                        <div key={i} className={cn('flex flex-col', isMe ? 'items-end' : 'items-start')}>
                                            <div className={cn( 'max-w-[85%] md:max-w-[70%] p-3 border', isMe ? 'border-primary bg-primary/10' : 'border-[#1f1f1f] bg-white/5' )}>
                                                <p className='text-[8px] md:text-[9px] mb-1 text-primary uppercase font-black'>
                                                    {msg.senderId?.IGN || (isMe ? 'YOU' : 'OPERATIVE')} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                                <p className='text-xs md:text-sm leading-relaxed wrap-break-words'>{msg.message}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={scrollRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className='p-3 md:p-4 bg-black border-t border-[#1f1f1f] flex flex-col sm:flex-row gap-3'>
                            <input value={text} onChange={(e) => setText(e.target.value)} placeholder='INPUT SECURE DATA...' className='flex-1 bg-black border border-[#1f1f1f] p-3 md:p-4 outline-none focus:border-primary transition-all text-[10px] md:text-xs font-bold text-white uppercase'/>
                            <Button type='submit' disabled={sendMutation.isPending} className='h-12 sm:h-auto px-6 md:px-10 bg-primary text-black font-black italic hover:bg-white transition-all shrink-0'>
                                <span className='flex items-center justify-center gap-2'>
                                    {sendMutation.isPending ? <Loader2 className='animate-spin' /> : <Send size={16} />}
                                    SEND
                                </span>
                            </Button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}