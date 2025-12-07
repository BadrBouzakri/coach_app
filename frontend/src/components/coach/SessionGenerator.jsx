import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Clock, Users, Cloud, MapPin, Save, RefreshCw, Check, AlertCircle } from 'lucide-react';

export function SessionGenerator() {
    const [loading, setLoading] = useState(false);
    const [generatedSession, setGeneratedSession] = useState(null);
    const [formData, setFormData] = useState({
        duration: 90,
        playersCount: 14,
        weather: 'Ensoleillé',
        fieldType: 'Herbe naturelle',
        objectives: []
    });

    const objectivesList = [
        'Contrôle orienté', 'Dribbles', 'Passes', 'Occupation espace',
        'Triangle', 'Défense', 'Coordination', 'Vitesse', 'Finition', 'Jeu de tête'
    ];

    const handleObjectiveToggle = (obj) => {
        setFormData(prev => {
            if (prev.objectives.includes(obj)) {
                return { ...prev, objectives: prev.objectives.filter(o => o !== obj) };
            }
            if (prev.objectives.length >= 3) return prev;
            return { ...prev, objectives: [...prev.objectives, obj] };
        });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/sessions/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setGeneratedSession(data.data);
            }
        } catch (err) {
            console.error('Error generating session:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedSession) return;
        try {
            const res = await fetch('/api/sessions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(generatedSession)
            });
            const data = await res.json();
            if (data.success) {
                alert('Séance sauvegardée avec succès !');
            }
        } catch (err) {
            console.error('Error saving session:', err);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left: Configuration */}
            <div className="w-full lg:w-1/3 bg-slate-900 rounded-2xl p-6 border border-slate-700 overflow-y-auto">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                        <Wand2 className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Générateur IA</h2>
                        <p className="text-sm text-slate-400">Créez une séance sur mesure</p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Duration */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Clock className="w-4 h-4 text-blue-400" /> Durée ({formData.duration} min)
                        </label>
                        <input
                            type="range"
                            min="45"
                            max="120"
                            step="15"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                            <span>45m</span>
                            <span>120m</span>
                        </div>
                    </div>

                    {/* Players */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Users className="w-4 h-4 text-green-400" /> Joueurs ({formData.playersCount})
                        </label>
                        <input
                            type="range"
                            min="5"
                            max="25"
                            value={formData.playersCount}
                            onChange={(e) => setFormData({ ...formData, playersCount: parseInt(e.target.value) })}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                        />
                    </div>

                    {/* Weather */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Cloud className="w-4 h-4 text-sky-400" /> Météo
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Ensoleillé', 'Nuageux', 'Pluvieux', 'Très chaud', 'Froid'].map(w => (
                                <button
                                    key={w}
                                    onClick={() => setFormData({ ...formData, weather: w })}
                                    className={`px-2 py-2 rounded-lg text-xs font-medium transition-colors border ${formData.weather === w
                                            ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Field Type */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <MapPin className="w-4 h-4 text-emerald-400" /> Terrain
                        </label>
                        <select
                            value={formData.fieldType}
                            onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
                            className="w-full bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-emerald-500 outline-none"
                        >
                            <option>Herbe naturelle</option>
                            <option>Synthétique</option>
                            <option>Salle/Gymnase</option>
                            <option>Stabilisé</option>
                        </select>
                    </div>

                    {/* Objectives */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                            <Check className="w-4 h-4 text-orange-400" /> Objectifs (max 3)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {objectivesList.map(obj => (
                                <button
                                    key={obj}
                                    onClick={() => handleObjectiveToggle(obj)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${formData.objectives.includes(obj)
                                            ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                                        }`}
                                >
                                    {obj}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Wand2 className="w-5 h-5" /> Générer la séance
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Right: Result */}
            <div className="flex-1 bg-slate-900 rounded-2xl p-6 border border-slate-700 overflow-y-auto relative">
                {!generatedSession ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                        <Wand2 className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Configurez et générez votre séance</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{generatedSession.title}</h2>
                                <div className="flex gap-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {generatedSession.duration} min</span>
                                    <span className="flex items-center gap-1"><Cloud className="w-4 h-4" /> {generatedSession.weather}</span>
                                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {generatedSession.fieldType}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold flex items-center gap-2 transition-colors"
                            >
                                <Save className="w-4 h-4" /> Sauvegarder
                            </button>
                        </div>

                        {generatedSession.notes && (
                            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                                <p className="text-sm text-yellow-200">{generatedSession.notes}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {generatedSession.exercises.map((ex, index) => (
                                <div key={index} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex gap-4 items-center">
                                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-300">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white">{ex.title}</h3>
                                        <p className="text-sm text-slate-400">{ex.notes}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block font-bold text-emerald-400">{ex.duration} min</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
