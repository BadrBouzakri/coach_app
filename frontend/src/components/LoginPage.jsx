import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [role, setRole] = useState('Coach');
    const [team, setTeam] = useState('U11');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        login({ name, role, team });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-1/2 -right-1/2 w-[1000px] h-[1000px] bg-red-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10 p-6"
            >
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header / Logo Section */}
                    <div className="p-8 pb-0 flex flex-col items-center text-center">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/50 mb-6 relative group p-4 backdrop-blur-sm border border-white/10"
                        >
                            <img
                                src="/logo_wattrelos.png"
                                alt="Logo Wattrelos FC"
                                className="w-full h-full object-contain drop-shadow-md"
                            />
                            <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>

                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500 mb-2">
                            Wattrelos FC
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">Plateforme Coaching Premium</p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Identifiant</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Votre nom (ex: Coach Thomas)"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Rôle</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option>Coach</option>
                                    <option>Adjoint</option>
                                    <option>Joueur</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Équipe</label>
                                <select
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all appearance-none cursor-pointer"
                                >
                                    <option>U10-U11</option>
                                    <option>U12-U13</option>
                                    <option>U14-U15</option>
                                    <option>Seniors</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!name.trim()}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            <span>Accéder au Dashboard</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" />
                            Espace sécurisé • Wattrelos FC © 2025
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
