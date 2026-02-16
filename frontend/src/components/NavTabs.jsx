import { PiChatsCircleBold } from 'react-icons/pi';
import { FiSearch, FiBookOpen, FiEdit3 } from 'react-icons/fi';

const TABS = [
    { id: 'chat', label: 'Chat', icon: <PiChatsCircleBold size={16} /> },
    { id: 'search', label: 'Search', icon: <FiSearch size={16} /> },
    // { id: 'read', label: 'Read', icon: <FiBookOpen size={16} /> },
];

export default function NavTabs({ activeTab, onTabChange }) {
    return (
        <nav className="h-[74px] px-4 pb-2 pt-1 shrink-0 relative z-50">
            <div className="flex glass rounded-[28px] p-1.5 w-full border border-white/[0.08] relative shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                relative flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-[22px] transition-all duration-500
                ${isActive ? 'text-white' : 'text-text-low'}
              `}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-white/[0.06] backdrop-blur-md rounded-[22px] shadow-inner border border-white/[0.05] animate-scale-in" />
                            )}
                            <div className={`relative z-10 transition-all duration-500 ${isActive ? 'scale-110 text-brand-cyan' : 'scale-100'}`}>
                                {tab.icon}
                            </div>
                            <span className={`relative z-10 text-[11px] font-bold uppercase tracking-wider transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                {tab.label}
                            </span>

                            {isActive && (
                                <div className="absolute bottom-1 w-1 h-1 bg-brand-cyan rounded-full shadow-[0_0_8px_#00f2fe]" />
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
