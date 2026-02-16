import { FiX, FiSettings, FiShield, FiDatabase, FiCommand } from 'react-icons/fi';
import { PiPaletteBold } from 'react-icons/pi';

const SETTINGS_SECTIONS = [
    { id: 'general', label: 'General', icon: FiSettings },
    { id: 'api', label: 'API Keys', icon: FiDatabase },
    { id: 'appearance', label: 'Appearance', icon: PiPaletteBold },
    { id: 'shortcuts', label: 'Shortcuts', icon: FiCommand },
];

export default function Settings({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl bg-bg-secondary rounded-2xl shadow-2xl border border-border-light flex flex-col max-h-[80vh] overflow-hidden animate-scale-in">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-elevated/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <FiSettings size={20} className="text-accent" />
                        Settings
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-bg-hover text-text-secondary transition-colors"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-48 border-r border-border-subtle py-4 bg-bg-tertiary">
                        <nav className="space-y-1 px-2">
                            {SETTINGS_SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${section.id === 'general' ? 'bg-accent/10 text-accent' : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'}`}
                                >
                                    <section.icon size={16} />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Settings Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-bg-primary">
                        {/* General Section */}
                        <section>
                            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <FiShield size={18} className="text-accent" />
                                Privacy & Data
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl border border-border-subtle">
                                    <div>
                                        <p className="text-sm font-medium text-text-primary">Data Collection</p>
                                        <p className="text-xs text-text-tertiary mt-1">Allow anonymous usage statistics.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" defaultChecked />
                                        <div className="w-11 h-6 bg-bg-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                                    </label>
                                </div>
                            </div>
                        </section>

                        {/* API Section */}
                        <section>
                            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
                                <FiDatabase size={18} className="text-accent" />
                                API Configuration
                            </h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-text-secondary block">
                                        Anthropic API Key
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="sk-ant-..."
                                        className="w-full bg-bg-tertiary border border-border-light rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all duration-200"
                                    />
                                    <p className="text-xs text-text-tertiary ml-1">
                                        Required for GPT-4 models. <a href="#" className="text-accent hover:underline">Get key here</a>
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-bg-secondary sticky bottom-0 z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-hover transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
