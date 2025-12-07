import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Activity, Phone, Mail } from 'lucide-react';

export function PlayerCard({ player, onEdit, onDelete }) {
    const getPositionColor = (pos) => {
        switch (pos) {
            case 'Gardien': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'Défenseur': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case 'Milieu': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'Attaquant': return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all group relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => onEdit(player)} className="text-slate-400 hover:text-emerald-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
                <button onClick={() => onDelete(player._id)} className="text-slate-400 hover:text-red-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                </button>
            </div>

            <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-slate-400 border-2 border-slate-600">
                    {player.photo ? (
                        <img src={player.photo} alt={player.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                        player.jerseyNumber || '#'
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-white text-lg">{player.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getPositionColor(player.position)}`}>
                        {player.position}
                    </span>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-400 bg-slate-900/50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>Matchs</span>
                    </div>
                    <span className="font-bold text-white">{player.stats?.matchesPlayed || 0}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <div className="bg-slate-900/30 p-1.5 rounded text-center">
                        <span className="block text-emerald-400 font-bold text-sm">{player.stats?.goals || 0}</span>
                        Buts
                    </div>
                    <div className="bg-slate-900/30 p-1.5 rounded text-center">
                        <span className="block text-blue-400 font-bold text-sm">{player.stats?.assists || 0}</span>
                        Passes
                    </div>
                </div>
            </div>

            {player.parentContact && (
                <div className="mt-4 pt-3 border-t border-slate-700/30 flex gap-3 justify-center">
                    {player.parentContact.phone && (
                        <a href={`tel:${player.parentContact.phone}`} className="p-2 bg-slate-800 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-400 rounded-lg transition-colors">
                            <Phone className="w-4 h-4" />
                        </a>
                    )}
                    {player.parentContact.email && (
                        <a href={`mailto:${player.parentContact.email}`} className="p-2 bg-slate-800 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 rounded-lg transition-colors">
                            <Mail className="w-4 h-4" />
                        </a>
                    )}
                </div>
            )}
        </motion.div>
    );
}
