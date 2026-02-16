import { useState } from 'react';
import { FiLink, FiLoader, FiBookOpen, FiArrowRight, FiFileText, FiCheckCircle, FiBarChart2, FiShield, FiZap, FiTarget } from 'react-icons/fi';

export default function Read() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState(null);

    const handleRead = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        setLoading(true);

        setTimeout(() => {
            setContent({
                title: 'Predictive Neural Architectures: The 2026 Shift',
                publisher: 'Synthesis Weekly',
                author: 'Elena S. Vance',
                confidence: 99.4,
                time: '8 min study',
                summary: 'An exploration into how Claude Opus 4.6 maintains logical consistency via recursive attention blocks, effectively bridging the gap between reasoning and execution.',
                insights: [
                    'Multi-path logical verification.',
                    'Recursive synthesis for complex problem sets.',
                    'Zero-latency context switching.',
                    'Architectural focus on high-fidelity output.'
                ]
            });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-transparent p-5 no-scrollbar overflow-y-auto pb-24">
            <form onSubmit={handleRead} className="relative mb-10">
                <div className="flex items-center glass rounded-2xl p-1.5 transition-all duration-500 ring-1 ring-white/10 group focus-within:ring-brand-purple/40">
                    <div className="pl-4 opacity-40 group-focus-within:opacity-100 transition-opacity">
                        <FiLink size={16} className="text-white" />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Neural reading link..."
                        className="flex-1 bg-transparent border-none outline-none py-3.5 px-3 text-[15px] text-white placeholder:text-text-low font-medium tracking-tight"
                    />
                    <button
                        type="submit"
                        disabled={loading || !url}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] 
                        ${url ? 'bg-brand-purple text-white hover:scale-105 active:scale-95' : 'bg-white/5 text-white/20'}`}
                    >
                        {loading ? <FiLoader size={18} className="animate-spin" /> : <FiArrowRight size={20} />}
                    </button>
                </div>
            </form>

            <div className="space-y-8">
                {loading ? (
                    <AnalysisLoader />
                ) : content ? (
                    <div className="animate-scale-up space-y-10">
                        {/* Doc Meta */}
                        <div className="space-y-5 px-1">
                            <div className="flex items-center gap-3">
                                <div className="px-2.5 py-1.5 rounded-lg bg-brand-cyan/20 border border-brand-cyan/30 flex items-center gap-2">
                                    <FiBarChart2 size={12} className="text-brand-cyan" />
                                    <span className="text-[10px] font-black text-brand-cyan uppercase tracking-widest">{content.confidence}% Match</span>
                                </div>
                                <div className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-400">
                                    <FiShield size={12} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Verified Source</span>
                                </div>
                            </div>

                            <div>
                                <h1 className="text-3xl font-black text-white leading-tight tracking-tighter mb-4">
                                    {content.title}
                                </h1>
                                <div className="flex items-center gap-3 text-[11px] font-black text-text-low uppercase tracking-[0.2em] opacity-70">
                                    <span className="text-brand-purple">{content.publisher}</span>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                    <span>{content.time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Synthesis Card */}
                        <div className="p-0.5 rounded-[32px] bg-gradient-to-br from-brand-purple/30 via-transparent to-brand-cyan/20">
                            <div className="p-8 glass rounded-[30px] border-none shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                                    <FiFileText size={180} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2.5 mb-6">
                                        <div className="p-1.5 rounded-lg bg-brand-purple/20 border border-brand-purple/30 text-brand-purple">
                                            <FiZap size={14} className="animate-pulse" />
                                        </div>
                                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.15em]">Neural Executive Summary</span>
                                    </div>
                                    <p className="text-[17px] text-text-dim leading-relaxed font-bold tracking-tight italic opacity-95">
                                        "{content.summary}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Insights List */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2.5 px-1">
                                <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40">
                                    <FiTarget size={14} />
                                </div>
                                <h3 className="text-[11px] font-bold text-text-dim uppercase tracking-[0.2em]">Key Strategic Insights</h3>
                            </div>

                            <div className="grid gap-3.5">
                                {content.insights.map((point, i) => (
                                    <div key={i} className="flex items-start gap-4 p-5 glass rounded-[26px] border-none hover:bg-white/[0.04] transition-all group cursor-pointer">
                                        <div className="w-8 h-8 rounded-xl bg-brand-cyan/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-cyan/20 transition-all">
                                            <FiCheckCircle size={14} className="text-brand-cyan" />
                                        </div>
                                        <span className="text-[14px] text-text-dim font-extrabold tracking-tight leading-snug group-hover:text-white transition-colors">
                                            {point}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-40 opacity-10 text-center">
                        <FiBookOpen size={48} className="mb-6" />
                        <p className="text-[11px] font-black uppercase tracking-[0.4em]">Reader Offline</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function AnalysisLoader() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="space-y-6">
                <div className="flex gap-3">
                    <div className="h-6 bg-white/5 rounded-lg w-24" />
                    <div className="h-6 bg-white/5 rounded-lg w-24" />
                </div>
                <div className="h-12 bg-white/5 rounded-2xl w-full" />
                <div className="h-4 bg-white/5 rounded-full w-2/3" />
            </div>
            <div className="h-48 bg-white/5 rounded-[32px]" />
            <div className="space-y-3.5">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-white/5 rounded-[26px]" />
                ))}
            </div>
        </div>
    );
}
