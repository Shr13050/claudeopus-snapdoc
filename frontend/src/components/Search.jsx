import { useState } from 'react';
import { FiSearch, FiZap, FiBox, FiCpu, FiGlobe, FiExternalLink, FiTarget, FiTerminal, FiCopy, FiCheck } from 'react-icons/fi';
import { PiArrowRightBold } from 'react-icons/pi';
import ReactMarkdown from 'react-markdown';

// High-Fidelity Code Frame Component
const CodeFrame = ({ children, className }) => {
    const [copied, setCopied] = useState(false);
    const content = String(children).replace(/\n$/, '');

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-10 overflow-hidden rounded-[24px] border border-white/10 bg-[#030305] shadow-2xl transition-all hover:border-white/20">
            {/* Terminal Header Bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 bg-white/[0.03]">
                <div className="flex items-center gap-1.5 focus-within:opacity-100 transition-opacity">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40 border border-amber-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40 border border-emerald-500/30" />
                    <span className="ml-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 truncate">Development // Frame</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/5 active:scale-95 group/copy"
                >
                    {copied ? (
                        <>
                            <FiCheck size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Copied</span>
                        </>
                    ) : (
                        <>
                            <FiCopy size={12} className="text-white/40 group-hover/copy:text-white/70 transition-colors" />
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider group-hover/copy:text-white/70">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-cyan/5 to-brand-purple/5 blur-2xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>
                <pre className="relative p-6 overflow-x-auto selection:bg-brand-cyan/30 scrollbar-thin scrollbar-thumb-white/10 bg-transparent">
                    <code className={`${className} block font-mono text-[13px] text-emerald-400/90 leading-relaxed`}>
                        {content}
                    </code>
                </pre>
            </div>

            {/* Subtle Footer ID */}
            <div className="absolute bottom-2 right-4 opacity-10 pointer-events-none group-hover:opacity-30 transition-opacity">
                <span className="text-[8px] font-bold italic tracking-[0.2em] text-brand-cyan">ENGINE_BLOCK_0xFA1</span>
            </div>
        </div>
    );
};

export default function Search({ detectedGuide, isAnalyzing }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);

        setTimeout(() => {
            setResults([
                {
                    id: 1,
                    title: `${query} Technical Overview`,
                    url: `https://google.com/search?q=${encodeURIComponent(query)}`,
                    snippet: `Comprehensive architectural breakdown of ${query}, covering integration strategies, scalability benchmarks, and modern implementation patterns.`,
                    source: 'AI Scout',
                    time: 'Just now'
                }
            ]);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-transparent p-5 no-scrollbar overflow-y-auto pb-24">
            {/* Search Input Module - Restored */}
            <form onSubmit={handleSearch} className="relative mb-10">
                <div className="flex items-center glass rounded-[24px] p-1 transition-all duration-500 ring-1 ring-white/10 group focus-within:ring-brand-cyan/50 focus-within:bg-white/[0.04] shadow-2xl">
                    <div className="pl-5 opacity-40 group-focus-within:opacity-100 group-focus-within:text-brand-cyan transition-all">
                        <FiSearch size={22} className="transition-transform group-focus-within:scale-110" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Neural search engines & docs..."
                        className="flex-1 bg-transparent border-none outline-none py-3 px-3 text-[13px] text-white placeholder:text-text-low font-medium tracking-tight"
                    />
                    <button type="submit" className="w-12 h-12 text-brand-cyan flex items-center justify-center">
                        <PiArrowRightBold size={28} />
                    </button>
                </div>
            </form>

            {/* AI Insights Engine */}
            {(isAnalyzing || detectedGuide) && (
                <div className="mb-10 animate-scale-up">
                    <div className="flex items-center justify-between mb-5 px-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan">
                                <FiCpu size={16} className="animate-pulse" />
                            </div>
                            <span className="text-[10px] font-bold text-white uppercase tracking-[0.15em]">Intelligence Feed</span>
                        </div>
                    </div>

                    {isAnalyzing && !detectedGuide?.setupDocs ? (
                        <div className="flex flex-col items-center py-12 gap-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-cyan/40 blur-3xl rounded-full animate-pulse" />
                                <div className="relative z-10 p-5 rounded-[24px] bg-black/40 border border-white/10">
                                    <FiZap size={40} className="text-brand-cyan animate-bounce" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <p className="text-[15px] font-bold text-white tracking-[0.2em] uppercase mb-2">Scanning Neural Links</p>
                                <p className="text-[13px] text-text-dim font-medium tracking-wide">Synthesizing real-time documentation & strategy...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Tech Hero & Summary */}
                            <div className="relative overflow-hidden p-6 rounded-[32px] bg-white/[0.02] border border-white/5">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] rotate-12">
                                    <FiBox size={140} />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="flex flex-col min-w-0">
                                            <h2 className="text-2xl font-black text-white leading-tight tracking-tight break-all">{detectedGuide.techName}</h2>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
                                        <div className="flex items-center gap-2">
                                            <FiGlobe size={13} className="text-brand-purple shrink-0" />
                                            <span className="text-[11px] font-bold text-text-dim truncate">Global Tech Layer</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiZap size={13} className="text-amber-400 shrink-0" />
                                            <span className="text-[11px] font-bold text-text-dim truncate">AI Analysis</span>
                                        </div>
                                    </div>

                                    <p className="text-[14px] text-white/70 leading-relaxed font-medium">
                                        Comprehensive architectural overview and implementation strategy for <span className="text-brand-cyan break-all">{detectedGuide.techName}</span>. Scaled for production-grade environments.
                                    </p>
                                </div>
                            </div>

                            {/* Main Content Sections */}
                            <div className="px-2">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                    <span className="text-[11px] font-bold text-text-low uppercase tracking-[0.3em]">Technical Guide</span>
                                    <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                </div>

                                <div className="prose prose-base prose-invert max-w-none prose-premium">
                                    <ReactMarkdown
                                        components={{
                                            h2: ({ ...props }) => <h2 className="text-xl font-black text-white mt-10 mb-5 flex items-center gap-3 border-b border-white/5 pb-2 break-all" {...props} />,
                                            h3: ({ ...props }) => <h3 className="text-base font-bold text-brand-cyan mt-8 mb-4 capitalize break-all" {...props} />,
                                            p: ({ ...props }) => <p className="text-[15px] text-text-dim leading-relaxed mb-6 font-medium break-words" {...props} />,
                                            ul: ({ ...props }) => <ul className="space-y-3 mb-8 ml-2" {...props} />,
                                            li: ({ ...props }) => <li className="text-[14px] text-text-dim flex items-start gap-2 before:content-['→'] before:text-brand-cyan/60 before:font-bold before:opacity-50 break-words" {...props} />,
                                            code: ({ inline, className, children, ...props }) => {
                                                return !inline ? (
                                                    <CodeFrame className={className}>{children}</CodeFrame>
                                                ) : (
                                                    <code className="bg-brand-cyan/10 px-1.5 py-0.5 rounded text-brand-cyan text-[13px] font-semibold border border-brand-cyan/20" {...props}>{children}</code>
                                                )
                                            }
                                        }}
                                    >
                                        {detectedGuide.setupDocs}
                                    </ReactMarkdown>
                                </div>
                            </div>

                            {/* Footer Recommendations */}
                            {detectedGuide.recommendations?.length > 0 && (
                                <div className="pt-10 mt-10 border-t border-white/5">
                                    <div className="flex items-center gap-3 mb-8 px-2">
                                        <div className="p-2 rounded-xl bg-brand-purple/20 border border-brand-purple/30 text-brand-purple">
                                            <FiTarget size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-brand-purple opacity-80">Strategic Insights</span>
                                            <h3 className="text-xl font-bold text-white tracking-tight">Strategy Blocks</h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {detectedGuide.recommendations.map((rec, i) => (
                                            <div key={i} className="rec-card flex items-start gap-5 animate-fade-slide" style={{ animationDelay: `${i * 0.15}s` }}>
                                                <div className="rec-card-icon mt-0.5 shrink-0 bg-white/[0.03] shadow-inner">
                                                    <FiTerminal size={14} className="text-brand-cyan" />
                                                </div>
                                                <span className="text-[15px] font-semibold text-text-dim leading-relaxed">{rec}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* General Results */}
            <div className="space-y-4">
                {loading ? (
                    Array(2).fill(0).map((_, i) => (
                        <div key={i} className="h-28 glass rounded-[24px] animate-pulse opacity-50" />
                    ))
                ) : results.length > 0 ? (
                    results.map((result) => (
                        <div key={result.id} className="p-7 glass rounded-[32px] hover:bg-white/[0.04] transition-all group cursor-pointer border-transparent hover:border-white/10 hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-[12px] font-black text-brand-purple uppercase tracking-[0.15em]">{result.source}</span>
                                <FiExternalLink size={16} className="text-text-low group-hover:text-brand-cyan transition-colors" />
                            </div>
                            <h3 className="text-[18px] font-extrabold text-white leading-snug mb-3 group-hover:text-brand-cyan transition-colors">{result.title}</h3>
                            <p className="text-[14px] text-text-dim leading-relaxed mb-5 opacity-80 line-clamp-2">{result.snippet}</p>
                            <div className="flex items-center gap-2.5 text-[12px] font-bold text-text-low opacity-60">
                                <FiGlobe size={14} />
                                <span className="tracking-wide">{new URL(result.url).hostname}</span>
                            </div>
                        </div>
                    ))
                ) : !detectedGuide && (
                    <div className="flex flex-col items-center justify-center py-48 opacity-10">
                        <FiCpu size={56} className="mb-8" />
                        <p className="text-[13px] font-black uppercase tracking-[0.5em]">Engine Standby</p>
                    </div>
                )}
            </div>
        </div>
    );
}
