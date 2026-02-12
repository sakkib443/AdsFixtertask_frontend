import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { FiSend, FiX, FiRefreshCcw, FiUser, FiMessageSquare } from 'react-icons/fi';
import useFlowStore from '@/store/useFlowStore';

const ChatPreview = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState<any>(null);
    const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { nodes, edges } = useFlowStore();

    useEffect(() => {
        if (isOpen) {
            const s = io('http://localhost:5000'); // TODO: Use config
            setSocket(s);

            s.on('bot_message', (data) => {
                if (data.node) {
                    setMessages(prev => [...prev, { role: 'bot', text: data.node.data.message || '...' }]);
                    setCurrentNodeId(data.node.id);
                } else {
                    setMessages(prev => [...prev, { role: 'bot', text: 'End of conversation.' }]);
                }
            });

            // Simulation: We send the current flow to backend or use local logic if server not ready
            // But requirement says backend handles execution.
            return () => { s.disconnect(); };
        }
    }, [isOpen]);

    useEffect(() => {
        scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, [messages]);

    const handleSend = () => {
        if (!input.trim() || !socket) return;

        setMessages(prev => [...prev, { role: 'user', text: input }]);

        // In a real app, we'd save/activate flow first. 
        // For demo, we send the message and current flow ID
        socket.emit('user_message', {
            flowId: 'temp_id', // Would be real ID
            currentNodeId,
            message: input,
            // For demo purposes, we might need to send the flow nodes/edges 
            // if backend doesn't have it saved yet
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
        <div className="fixed bottom-8 right-8 w-96 h-[550px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col z-[100] animate-in slide-in-from-bottom duration-300">
            <div className="p-5 bg-gray-900 rounded-t-3xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                        <FiUser size={20} />
                    </div>
                    <div>
                        <h4 className="text-white font-black text-sm uppercase tracking-tighter">Preview Chatbot</h4>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Online & Ready</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={startChat} className="p-2 text-gray-400 hover:text-white transition-colors" title="Restart">
                        <FiRefreshCcw size={18} />
                    </button>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors">
                        <FiX size={18} />
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50/50 dark:bg-gray-950/50">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                            <FiMessageSquare size={32} />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">No messages yet. Click restart to begin the flow.</p>
                        <button
                            onClick={startChat}
                            className="px-6 py-2 bg-blue-600 text-white text-xs font-black rounded-xl hover:opacity-90 transition-opacity"
                        >
                            START PREVIEW
                        </button>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${m.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-bl-none'
                            }`}>
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-950 rounded-b-3xl">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-transparent focus-within:border-blue-600/20 transition-all">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your reply..."
                        className="flex-1 bg-transparent border-0 outline-none p-2 text-sm text-gray-800 dark:text-gray-200"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="p-2 bg-blue-600 text-white rounded-xl disabled:opacity-50 transition-all active:scale-95"
                    >
                        <FiSend size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPreview;
