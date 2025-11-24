import React from 'react';
import { Trophy, LayoutDashboard, Calendar, Settings, BarChart3 } from 'lucide-react';

export function Layout({ children, currentView, onViewChange }) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
                        <div className="flex flex-col">
                            <span className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Coach Wattrelos FC</span>
                            <span className="text-xs text-slate-400 font-medium">Excellence & Passion</span>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => onViewChange?.('exercises')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'exercises'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                            : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Exercices
                    </button>

                    <button
                        onClick={() => onViewChange?.('statistics')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'statistics'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                            : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Statistiques
                    </button>

                    <button
                        onClick={() => onViewChange?.('planner')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'planner'
                            ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-900/30'
                            : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-emerald-600/10 hover:to-red-600/10'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <Calendar className="w-5 h-5" />
                        Planificateur
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-900/30 to-red-900/30 rounded-xl border border-emerald-500/30">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-red-600 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
                            W
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-white">Coach Principal</p>
                            <p className="text-emerald-300 text-xs font-medium">Wattrelos FC - 2025</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 md:hidden flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Wattrelos FC</span>
                    </div>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
