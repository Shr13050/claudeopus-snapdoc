import { useState } from 'react';
import { FiEdit3, FiCopy, FiRotateCcw, FiType, FiAperture, FiClock, FiTerminal, FiArrowRight, FiLoader, FiZap, FiLayers } from 'react-icons/fi';
import { PiMagicWandBold } from 'react-icons/pi';

const TONES = [
    { label: 'Professional', icon: <FiTerminal size={12} /> },
    { label: 'Creative', icon: <FiAperture size={12} /> },
    { label: 'Casual', icon: <PiMagicWandBold size={12} /> }
];

const FORMATS = [
    { label: 'Technical Report', icon: <FiType size={12} /> },
    { label: 'Business Mail', icon: <FiTerminal size={12} /> },
    { label: 'Rapid Brief', icon: <FiClock size={12} /> }
];

export default function Write() {
    const [prompt, setPrompt] = useState('');
    const [tone, setTone] = useState(TONES[0].label);
    const [format, setFormat] = useState(FORMATS[0].label);
    const [generatedText, setGeneratedText] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = () => {
        if (!prompt.trim()) return;
        setIsGenerating(true);

        setTimeout(() => {
            setGeneratedText(`DRAFT SYNTHESIS | Tone: ${tone}\n\nRE: Strategic Evolution of ${prompt}\n\nOur current analysis indicates that a recursive approach would minimize structural fragmentation. By prioritizing logical consistency in the early phases, we ensure high-fidelity synthesis.\n\nNext Steps: \n1. Optimize context blocks\n2. Execute verification cycles\n3. Finalize draft.`);
            setIsGenerating(false);
        }, 1800);
    };

    return (
        <div className="flex flex-col h-full bg-transparent p-5 no-scrollbar overflow-y-auto pb-24">
            <div className="space-y-8">
                {/* Authoring Module */}
                <div className="p-0.5 rounded-[32px] bg-gradient-to-br from-brand-purple/30 via-transparent to-brand-cyan/20">
                    <div className="p-8 glass rounded-[30px] border-none space-y-7 shadow-2xl relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="p-1.5 rounded-lg bg-brand-purple/20 border border-brand-purple/30 text-brand-purple">
                                    <FiEdit3 size={14} />
                                </div>
                                <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Authoring Core</span>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-brand-purple shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-pulse" />
                        </div>

                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Detail your objective or topic..."
                                className="w-full h-40 bg-white/[0.03] rounded-[24px] border border-white/5 p-5 text-[16px] text-white placeholder:text-text-low resize-none focus:outline-none focus:ring-2 focus:ring-brand-purple/20 transition-all font-medium tracking-tight leading-relaxed"
                            />
                        </div>

                        <div className="space-y-6">
                            <SectionGroup
                                label="Tactical Style"
                                items={TONES}
                                activeValue={tone}
                                onChange={setTone}
                            />
                            <SectionGroup
                                label="Output Format"
                                items={FORMATS}
                                activeValue={format}
                                onChange={setFormat}
                            />
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating || !prompt}
                            className="w-full py-4.5 bg-brand-purple text-white text-[15px] font-black rounded-[22px] flex items-center justify-center gap-3 shadow-[0_15px_40px_-10px_rgba(139,92,246,0.4)] transition-all disabled:opacity-30 active:scale-95 group"
                        >
                            {isGenerating ? (
                                <FiLoader size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <FiZap size={18} className="group-hover:scale-110 transition-transform" />
                                    <span className="tracking-tight">CRAFT STRATEGIC DRAFT</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Synthesis Result */}
                <div className="relative min-h-[160px]">
                    {generatedText ? (
                        <div className="animate-scale-up space-y-4 px-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <FiLayers size={12} className="text-text-low" />
                                    <span className="text-[10px] font-bold text-text-low uppercase tracking-[0.3em]">Synthesis Output</span>
                                </div>
                                <div className="flex gap-2">
                                    <OutputAction icon={<FiCopy size={13} />} onClick={() => navigator.clipboard.writeText(generatedText)} />
                                    <OutputAction icon={<FiRotateCcw size={13} />} onClick={() => setGeneratedText('')} isDanger />
                                </div>
                            </div>
                            <div className="p-8 glass rounded-[32px] text-[15px] leading-relaxed text-text-dim whitespace-pre-wrap font-bold border-brand-purple/10 italic shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-brand-purple/20" />
                                {generatedText}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-10 text-center">
                            <FiEdit3 size={40} className="mb-4" />
                            <p className="text-[11px] font-black uppercase tracking-[0.4em]">Drafting Engine Standby</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function SectionGroup({ label, items, activeValue, onChange }) {
    return (
        <div className="space-y-3">
            <span className="text-[10px] font-bold text-text-low uppercase tracking-[0.2em] pl-1 opacity-70">{label}</span>
            <div className="flex flex-wrap gap-2.5">
                {items.map(item => (
                    <button
                        key={item.label}
                        onClick={() => onChange(item.label)}
                        className={`
                   flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300
                   ${activeValue === item.label
                                ? 'bg-white/10 text-brand-purple border border-brand-purple/30 shadow-[0_0_20px_rgba(139,92,246,0.1)]'
                                : 'bg-white/[0.04] text-text-low border border-white/5 hover:bg-white/10 hover:text-text-dim'}
                `}
                    >
                        <span className={activeValue === item.label ? 'text-brand-purple' : ''}>{item.icon}</span>
                        <span className="tracking-tight uppercase">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function OutputAction({ icon, onClick, isDanger }) {
    return (
        <button
            onClick={onClick}
            className={`w-9 h-9 flex items-center justify-center glass rounded-xl transition-all ${isDanger ? 'hover:bg-red-500/10 hover:text-red-400' : 'hover:bg-brand-purple/10 hover:text-brand-purple'}`}
        >
            {icon}
        </button>
    );
}
