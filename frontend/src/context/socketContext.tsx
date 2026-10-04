'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { getCookie } from 'cookies-next';

interface Message {
  senderId: string;
  receiverId: string;
  message: string;
  onModel: 'User' | 'Group';
  createdAt: string;
}

interface SocketContextType {
  socket: Socket | null;
  messages: Record<string, Message[]>; 
  unreadCount: number;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
      transports: ['websocket'],
      secure: true,
      reconnectionAttempts: 5
    });

    // newSocket.on('connect', () => {
    //   console.log('📡 ENCRYPTED SIGNAL ESTABLISHED');
    // });

    newSocket.on('newMessage', (msg: Message) => {
      const channelId = msg.onModel === 'Group' ? msg.receiverId : (msg.senderId as any )._id;
      
      setMessages((prev) => ({
        ...prev,
        [channelId]: [...(prev[channelId] || []), msg],
      }));

      setUnreadCount((prev) => prev + 1);
    });

    setSocket(newSocket);

    // return () => {
    //   newSocket.disconnect();
    // };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, messages, unreadCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};