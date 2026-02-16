import { FiPlus } from 'react-icons/fi';
import { FiClock } from 'react-icons/fi';


export default function Header({ onNewChat, onToggleHistory }) {
    return (
        <header className="flex flex-col bg-transparent relative z-20 shrink-0">
            {/* Simulated Mobile Status Bar */}
            <div className="flex justify-between items-center px-6 py-1.5 opacity-40">
                <span className="text-[10px] font-bold tracking-tighter">9:41</span>
                <div className="flex gap-1.5 items-center">
                    <div className="w-3 h-2.5 border-[1px] border-white/60 rounded-[2px] relative flex items-center px-[1px]">
                        <div className="w-1.5 h-full bg-white/80 rounded-[1px]" />
                    </div>
                </div>
            </div>

            <div className="h-[52px] flex items-center justify-between px-5">
                <div className="flex items-center gap-2.5 group cursor-default">
                    <div className="relative">
                        <img src="/icon16.png" alt="SnapDoc" className="w-9 h-9 object-contain" />
                        <div className="absolute -inset-1.5 bg-brand-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold tracking-tight text-white leading-none">SnapDoc</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <div className="w-1 h-1 rounded-full bg-brand-cyan animate-pulse" />
                            <span className="text-[9px] font-bold text-text-dim uppercase tracking-widest opacity-80">Claude 4.6</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center p-1 bg-white/[0.04] border border-white/5 rounded-2xl backdrop-blur-md">
                    <HeaderIcon icon={<FiPlus size={18} />} onClick={onNewChat} />
                    <div className="w-px h-4 bg-white/10 mx-1" />
                    <HeaderIcon icon={<FiClock size={18} />} onClick={onToggleHistory} />
                </div>
            </div>
        </header>
    );
}

function HeaderIcon({ icon, onClick }) {
    return (
        <button
            className="w-8 h-8 flex items-center justify-center rounded-xl text-text-dim hover:text-white hover:bg-white/[0.08] transition-all duration-300"
            onClick={onClick}
        >
            {icon}
        </button>
    );
}
