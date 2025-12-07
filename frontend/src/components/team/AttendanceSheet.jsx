import React, { useState, useEffect } from 'react';
import { X, Save, Check, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export function AttendanceSheet({ event, onClose }) {
    const [players, setPlayers] = useState([]);
    const [attendance, setAttendance] = useState({}); // { playerId: { status, reason } }
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all players
                const playersRes = await fetch('/api/players');
                const playersData = await playersRes.json();
                setPlayers(playersData);

                // Fetch existing attendance for this event
                const attendanceRes = await fetch(`/api/attendance/${event._id}`);
                const attendanceData = await attendanceRes.json();

                // Map existing attendance to state
                const initialAttendance = {};
                attendanceData.forEach(record => {
                    initialAttendance[record.playerId._id] = {
                        status: record.status,
                        reason: record.reason || ''
                    };
                });

                // Initialize missing players as 'Présent'
                playersData.forEach(p => {
                    if (!initialAttendance[p._id]) {
                        initialAttendance[p._id] = { status: 'Présent', reason: '' };
                    }
                });

                setAttendance(initialAttendance);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, [event._id]);

    const handleStatusChange = (playerId, status) => {
        setAttendance(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], status }
        }));
    };

    const handleReasonChange = (playerId, reason) => {
        setAttendance(prev => ({
            ...prev,
            [playerId]: { ...prev[playerId], reason }
        }));
    };

    const handleSave = async () => {
        try {
            const attendanceData = Object.entries(attendance).map(([playerId, data]) => ({
                playerId,
                status: data.status,
                reason: data.reason
            }));

            await fetch('/api/attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    eventId: event._id,
                    attendanceData
                })
            });
            onClose();
        } catch (err) {
            console.error("Error saving attendance:", err);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Présent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
            case 'Absent': return 'bg-red-500/20 text-red-400 border-red-500/50';
            case 'Excusé': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'Retard': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'Blessé': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
            >
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Feuille de Présence</h2>
                        <p className="text-slate-400">{event.title} - {new Date(event.date).toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="text-center text-slate-500">Chargement...</div>
                    ) : (
                        <div className="space-y-2">
                            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <div className="col-span-4">Joueur</div>
                                <div className="col-span-4">Statut</div>
                                <div className="col-span-4">Motif / Note</div>
                            </div>
                            {players.map(player => (
                                <div key={player._id} className="grid grid-cols-12 gap-4 items-center bg-slate-800/30 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                                    <div className="col-span-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {player.jerseyNumber || '#'}
                                        </div>
                                        <span className="font-medium text-white">{player.name}</span>
                                    </div>
                                    <div className="col-span-4 flex gap-1">
                                        {['Présent', 'Absent', 'Excusé', 'Retard', 'Blessé'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusChange(player._id, status)}
                                                className={`p-1.5 rounded-lg text-xs font-medium transition-all flex-1 ${attendance[player._id]?.status === status
                                                        ? getStatusColor(status) + ' shadow-lg'
                                                        : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                                    }`}
                                                title={status}
                                            >
                                                {status.charAt(0)}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="col-span-4">
                                        <input
                                            type="text"
                                            placeholder="Raison..."
                                            value={attendance[player._id]?.reason || ''}
                                            onChange={(e) => handleReasonChange(player._id, e.target.value)}
                                            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-800 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                        Annuler
                    </button>
                    <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20">
                        <Save className="w-5 h-5" />
                        Enregistrer
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
