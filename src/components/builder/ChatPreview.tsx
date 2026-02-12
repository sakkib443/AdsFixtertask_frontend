import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { FiSend, FiX, FiRefreshCcw, FiUser, FiMessageSquare } from 'react-icons/fi';
import useFlowStore from '@/store/useFlowStore';
import { API_BASE } from '@/services/api';

const ChatPreview = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { nodes, edges } = useFlowStore();

    useEffect(() => {
        if (isOpen) {
            const s = io(API_BASE);
            setSocket(s);

            s.on('bot_message', (data) => {
                if (data.node) {
                    setMessages(prev => [...prev, { role: 'bot', text: data.node.data.message || '...' }]);
                    setCurrentNodeId(data.node.id);
                } else {
                    setMessages(prev => [...prev, { role: 'bot', text: 'End of conversation.' }]);
                }
            });

            return () => { s.disconnect(); };
        }
    }, [isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !socket) return;

        setMessages(prev => [...prev, { role: 'user', text: input }]);

        socket.emit('user_message', {
            flowId: 'temp_id',
            currentNodeId,
            message: input,
            nodes,
            edges
        });

        setInput('');
    };

    const startChat = () => {
        setMessages([]);
        socket?.emit('start_flow', { flowId: 'temp_id', nodes, edges });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-8 right-8 w-96 h-[550px] bg-white dark:bg-gray-900 rounded-md shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col z-[100] animate-in slide-in-from-bottom duration-300">
            <div className="p-5 bg-gray-900 rounded-t-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-blue-600 flex items-center justify-center text-white">
                        <FiUser size={18} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-tight">Preview Chatbot</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[9px] text-gray-400 font-normal uppercase tracking-wider">Online & Ready</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={startChat} className="p-2 text-gray-400 hover:text-white transition-colors" title="Restart">
                        <FiRefreshCcw size={16} />
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <FiX size={16} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-14 h-14 rounded-md bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <FiMessageSquare size={24} />
                        </div>
                        <p className="text-sm text-gray-500 font-normal">No messages yet. Click restart to begin the flow.</p>
                        <button
                            onClick={startChat}
                            className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-bold rounded-md hover:opacity-90 transition-opacity uppercase tracking-widest"
                        >
                            START PREVIEW
                        </button>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] px-4 py-3 rounded-md text-sm font-normal shadow-sm ${m.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-950 rounded-b-md">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-100 dark:border-gray-800 focus-within:border-blue-500/30 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent border-0 outline-none p-2 text-sm text-gray-800 dark:text-gray-200 font-normal"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-2.5 bg-blue-600 text-white rounded-md disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <FiSend size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPreview;
