import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

export function Layout({ children, currentView, onViewChange, sidebarContent }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-slate-800/50 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <Trophy className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                    <div className="flex flex-col">
                        <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Coach Wattrelos FC</span>
                        <span className="text-xs text-slate-400 font-medium">Excellence & Passion</span>
                    </div>
                </div>
            </div>

            <nav className="p-4 space-y-2 flex-shrink-0">
                <button
                    onClick={() => { onViewChange?.('exercises'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'exercises'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                        : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                        } rounded-xl font-medium backdrop-blur-sm transition-all`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Exercices
                </button>

                <button
                    onClick={() => { onViewChange?.('statistics'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'statistics'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                        : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                        } rounded-xl font-medium backdrop-blur-sm transition-all`}
                >
                    <BarChart3 className="w-5 h-5" />
                    Statistiques
                </button>

                <button
                    onClick={() => { onViewChange?.('planner'); setIsMobileMenuOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'planner'
                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                        : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                        } rounded-xl font-medium backdrop-blur-sm transition-all`}
                >
                    <Calendar className="w-5 h-5" />
                    Planificateur
                </button>
            </nav>

            {/* Custom Sidebar Content (Filters) */}
            {sidebarContent && (
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4 border-t border-slate-800/50">
                    {sidebarContent}
                </div>
            )}

            <div className="p-4 border-t border-slate-800/50 mt-auto">
                <div className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-emerald-900/30 to-red-900/30 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/20">
                            {user?.name?.charAt(0) || 'W'}
                        </div>
                        <div className="text-sm overflow-hidden">
                            <p className="font-medium text-white truncate max-w-[100px]">{user?.name || 'Coach'}</p>
                            <p className="text-emerald-300 text-xs font-medium truncate">{user?.team || 'Wattrelos FC'}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Se déconnecter"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="min-h-screen flex relative">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 text-white hidden md:flex flex-col h-screen sticky top-0">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="absolute left-0 top-0 bottom-0 w-3/4 max-w-xs bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl animate-slide-in">
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-auto w-full">
                <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 md:hidden flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 text-slate-300 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                            <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Wattrelos FC</span>
                        </div>
                    </div>
                </header>
                <div className="p-4 md:p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
