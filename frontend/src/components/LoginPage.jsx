import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, User, Lock, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
    const { login, register } = useAuth();
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Coach');
    const [team, setTeam] = useState('U11');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !password.trim()) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        if (isRegistering) {
            const result = await register({ name, password, role, team });
            if (!result.success) setError(result.error);
        } else {
            const result = await login(name, password);
            if (!result.success) setError(result.error);
        }
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
                            className="w-24 h-24 flex items-center justify-center mb-6"
                        >
                            <img
                                src="/logo_coachplay.png"
                                alt="CoachPlay"
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-emerald-600 mb-2">
                            CoachPlay
                        </h1>
                        <p className="text-slate-400 text-sm font-medium">Plateforme Coaching Premium</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-5">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Identifiant</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nom d'utilisateur"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Mot de passe</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {isRegistering && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="grid grid-cols-2 gap-4 overflow-hidden"
                            >
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
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4"
                        >
                            <span>{isRegistering ? "Créer mon compte" : "Se connecter"}</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <div className="text-center pt-2">
                            <button
                                type="button"
                                onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                                className="text-slate-400 text-sm hover:text-white transition-colors"
                            >
                                {isRegistering ? "Déjà un compte ? Se connecter" : "Pas encore de compte ? S'inscrire"}
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-4 bg-slate-900/50 border-t border-slate-800 text-center">
                        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" />
                            Espace sécurisé • CoachPlay © 2025
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
