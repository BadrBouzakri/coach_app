import React, { useState, useEffect } from 'react';
import { Plus, Users, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerCard } from './PlayerCard';

export function TeamRoster() {
    const [players, setPlayers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const emptyPlayer = {
        name: '',
        position: 'Milieu',
        jerseyNumber: '',
        dateOfBirth: '',
        parentContact: { email: '', phone: '' },
        stats: { matchesPlayed: 0, goals: 0, assists: 0 }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/players');
            const data = await res.json();
            setPlayers(data);
        } catch (err) {
            console.error("Error fetching players:", err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = currentPlayer._id ? 'PUT' : 'POST';
            const url = currentPlayer._id ? `/api/players/${currentPlayer._id}` : '/api/players';

            const payload = {
                ...currentPlayer,
                dateOfBirth: currentPlayer.dateOfBirth === '' ? null : currentPlayer.dateOfBirth
            };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Erreur inconnue');
            }

            fetchPlayers();
            setIsEditing(false);
            setCurrentPlayer(null);
        } catch (err) {
            console.error("Error saving player:", err);
            alert("Erreur lors de la sauvegarde : " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer ce joueur ?')) {
            try {
                await fetch(`/api/players/${id}`, { method: 'DELETE' });
                fetchPlayers();
            } catch (err) {
                console.error("Error deleting player:", err);
            }
        }
    };

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-emerald-400" />
                        Effectif
                    </h2>
                    <p className="text-slate-400 mt-1">Gérez vos joueurs et leurs statistiques.</p>
                </div>
                <button
                    onClick={() => { setCurrentPlayer(emptyPlayer); setIsEditing(true); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Ajouter un Joueur
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor (Modal-like or Side Panel) */}
                <AnimatePresence>
                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 sticky top-6">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    {currentPlayer._id ? 'Modifier Joueur' : 'Nouveau Joueur'}
                                </h3>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nom</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentPlayer.name}
                                            onChange={e => setCurrentPlayer({ ...currentPlayer, name: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Poste</label>
                                            <select
                                                value={currentPlayer.position}
                                                onChange={e => setCurrentPlayer({ ...currentPlayer, position: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            >
                                                <option>Gardien</option>
                                                <option>Défenseur</option>
                                                <option>Milieu</option>
                                                <option>Attaquant</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Numéro</label>
                                            <input
                                                type="number"
                                                value={currentPlayer.jerseyNumber}
                                                onChange={e => setCurrentPlayer({ ...currentPlayer, jerseyNumber: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-700/50">
                                        <h4 className="text-sm font-bold text-emerald-400 mb-2">Contact Parents</h4>
                                        <div className="space-y-3">
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={currentPlayer.parentContact?.email || ''}
                                                onChange={e => setCurrentPlayer({
                                                    ...currentPlayer,
                                                    parentContact: { ...currentPlayer.parentContact, email: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="Téléphone"
                                                value={currentPlayer.parentContact?.phone || ''}
                                                onChange={e => setCurrentPlayer({
                                                    ...currentPlayer,
                                                    parentContact: { ...currentPlayer.parentContact, phone: e.target.value }
                                                })}
                                                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button type="submit" className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium">
                                            Enregistrer
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Players Grid */}
                <div className={`${isEditing ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 ${!isEditing ? 'lg:grid-cols-3' : ''} gap-4`}>
                    {filteredPlayers.map(player => (
                        <PlayerCard
                            key={player._id}
                            player={player}
                            onEdit={(p) => { setCurrentPlayer(p); setIsEditing(true); }}
                            onDelete={handleDelete}
                        />
                    ))}
                    {filteredPlayers.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Aucun joueur trouvé.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
