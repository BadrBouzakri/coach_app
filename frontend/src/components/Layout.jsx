import React from 'react';
import { Trophy, LayoutDashboard, Calendar, Settings, BarChart3 } from 'lucide-react';

export function Layout({ children, currentView, onViewChange }) {
    return (
        <div className="min-h-screen flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 text-white hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Coach U12</span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <button
                        onClick={() => onViewChange?.('exercises')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'exercises'
                            ? 'bg-blue-600/90 shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Exercices
                    </button>

                    <button
                        onClick={() => onViewChange?.('statistics')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'statistics'
                            ? 'bg-blue-600/90 shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Statistiques
                    </button>

                    <button
                        onClick={() => onViewChange?.('planner')}
                        className={`w-full flex items-center gap-3 px-4 py-3 ${currentView === 'planner'
                            ? 'bg-blue-600/90 shadow-lg shadow-blue-900/20'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            } rounded-xl font-medium backdrop-blur-sm transition-all`}
                    >
                        <Calendar className="w-5 h-5" />
                        Planificateur
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-xl border border-slate-700/50">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold shadow-lg">
                            C
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-slate-200">Coach Principal</p>
                            <p className="text-slate-500 text-xs">U12 - Saison 2025</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 md:hidden flex items-center justify-between sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-6 h-6 text-yellow-400" />
                        <span className="font-bold text-white">Coach U12</span>
                    </div>
                </header>
                <div className="p-6 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
