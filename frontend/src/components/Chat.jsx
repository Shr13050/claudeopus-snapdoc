import { useState, useRef, useEffect } from 'react';
import { FiSend, FiCpu, FiUser, FiZap, FiPlusCircle } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

export default function Chat({ messages, onSendMessage, isTyping }) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent relative">
            {/* Message Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-32 space-y-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-scale-up py-20">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 bg-brand-cyan/20 blur-[100px] rounded-full animate-pulse" />
                            <div className="relative z-10 w-20 h-20 rounded-[24px] bg-gradient-to-br from-brand-cyan to-brand-purple p-[1px] shadow-2xl">
                                <div className="w-full h-full rounded-[23px] bg-bg-base flex items-center justify-center">
                                    <FiCpu size={36} className="text-brand-cyan" />
                                </div>
                            </div>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tighter mb-4 leading-tight">
                            Intelligence Cloud <br /><span className="text-brand-cyan">Active</span>
                        </h2>
                        <p className="text-text-dim text-[14px] leading-relaxed max-w-[280px] font-medium opacity-80 mb-8">
                            A strategic intelligence partner capable of complex reasoning and technical analysis.
                        </p>

                        <div className="grid grid-cols-1 gap-3 w-full max-w-[280px]">
                            {["Tell me about Claude Opus 4.6", "System architecture help", "Technical breakdown"].map((hint, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onSendMessage(hint)}
                                    className="p-3.5 glass rounded-2xl text-[12px] font-bold text-white/50 hover:text-brand-cyan hover:border-brand-cyan/30 transition-all text-left flex items-center justify-between group"
                                >
                                    {hint}
                                    <FiZap size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-scale-up`}
                        >
                            <div className="flex items-center gap-2 mb-1.5 px-2">
                                {msg.role === 'assistant' ? (
                                    <>
                                        <div className="w-5 h-5 rounded-md bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
                                            <FiCpu size={10} className="text-brand-cyan" />
                                        </div>
                                        <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Architect</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-[10px] font-black text-text-low uppercase tracking-widest">You</span>
                                        <FiUser size={10} className="text-text-low" />
                                    </>
                                )}
                            </div>

                            <div
                                className={`
                                    max-w-[90%] p-4 rounded-[24px] shadow-xl text-[15px] leading-relaxed font-medium
                                    ${msg.role === 'user'
                                        ? 'bg-brand-blue/10 border border-brand-blue/20 text-blue-50 rounded-tr-none'
                                        : 'glass border-white/5 text-text-main rounded-tl-none'}
                                `}
                            >
                                <div className="prose prose-sm prose-invert max-w-none prose-premium">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    ))
                )}
                {isTyping && (
                    <div className="flex flex-col items-start animate-fade-slide">
                        <div className="flex items-center gap-2 mb-1.5 px-2">
                            <div className="w-5 h-5 rounded-md bg-brand-cyan/20 border border-brand-cyan/30 flex items-center justify-center">
                                <FiCpu size={10} className="text-brand-cyan animate-pulse" />
                            </div>
                            <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">Synthesizing...</span>
                        </div>
                        <div className="glass px-4 py-3 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce [animation-delay:-0.3s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce [animation-delay:-0.15s]" />
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-bounce" />
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Module */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-bg-base via-bg-base/90 to-transparent">
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center glass rounded-[26px] pr-2.5 transition-all duration-500 shadow-2xl ring-1 ring-white/10 group focus-within:ring-brand-cyan/40"
                >
                    <button type="button" className="w-11 h-11 flex items-center justify-center text-text-low hover:text-white transition-colors">
                        <FiPlusCircle size={22} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 bg-transparent border-none outline-none py-3.5 px-2 text-[15px] text-white placeholder:text-text-low font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className={`
                            w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300
                            ${input.trim()
                                ? 'bg-brand-cyan text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-105 active:scale-95'
                                : 'bg-white/5 text-white/20'}
                        `}
                    >
                        <FiSend size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
