import { FiX, FiMessageSquare, FiClock, FiTrash2, FiShield, FiSearch } from 'react-icons/fi';

export default function Sidebar({ isOpen, onClose, history, onSelectChat, onDeleteChat }) {
    if (!isOpen) return null;

    // Detect history type based on first item (if it has 'query' field, it's search history)
    const isSearchHistory = history.length > 0 && history[0].query !== undefined;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Sidebar Panel */}
            <aside className="fixed top-0 left-0 bottom-0 w-[300px] bg-bg-deep border-r border-white/10 z-[101] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] animate-slide-right no-scrollbar">
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.05] bg-white/[0.01]">
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold text-white tracking-tighter">
                            {isSearchHistory ? 'Search History' : 'Chat History'}
                        </h2>
                        <span className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">
                            {isSearchHistory ? 'Tech Searches' : 'Previous Conversations'}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.05] text-text-tertiary hover:text-white hover:bg-white/[0.1] transition-all"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 no-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-text-tertiary opacity-30 text-center px-6">
                            <div className="w-16 h-16 rounded-full bg-white/[0.02] flex items-center justify-center mb-6">
                                <FiClock size={32} className="stroke-[1.5px]" />
                            </div>
                            <p className="text-sm font-medium">Memory is empty.<br />Start a new session.</p>
                        </div>
                    ) : (
                        history.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id)}
                                className="group flex flex-col gap-1 p-4 rounded-2xl bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/10 cursor-pointer transition-all duration-300 animate-slide-up relative overflow-hidden"
                            >
                                <div className="flex items-center justify-between relative z-10">
                                    <span className="text-[14px] font-bold text-text-secondary group-hover:text-white transition-colors truncate pr-8">
                                        {chat.title}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                                        className="opacity-0 group-hover:opacity-100 p-2 text-text-tertiary hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        title="Delete"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest leading-none mt-1">
                                    {isSearchHistory ? (
                                        <FiSearch size={10} className="text-accent-indigo opacity-70" />
                                    ) : (
                                        <FiMessageSquare size={10} className="text-accent-indigo opacity-70" />
                                    )}
                                    {chat.date}
                                </div>
                                {/* Active indicator bar */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-indigo rounded-r-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                            </div>
                        ))
                    )}
                </div>

                {/* Footer info */}
                <div className="p-6 border-t border-white/[0.05] bg-white/[0.01]">
                    <div className="flex items-center gap-3 p-4 bg-white/[0.03] rounded-2xl border border-white/5">
                        <FiShield size={18} className="text-accent-teal" />
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-white leading-none">Security Active</span>
                            <span className="text-[10px] text-text-tertiary font-bold uppercase mt-1">Encrypted locally</span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
