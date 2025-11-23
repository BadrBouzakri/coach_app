import React, { useState, useEffect } from 'react';
import { Clock, Save, Trash2, Plus, X, Star, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function SessionPlanner({ exercises }) {
    const [currentSession, setCurrentSession] = useState({
        name: "Nouvelle Séance",
        date: new Date().toISOString().split('T')[0],
        exercises: [],
        notes: ""
    });

    const [savedSessions, setSavedSessions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterTheme, setFilterTheme] = useState("All");

    useEffect(() => {
        const saved = localStorage.getItem('coachSessions');
        if (saved) {
            setSavedSessions(JSON.parse(saved));
        }
    }, []);

    const addExerciseToSession = (exercise) => {
        const newEntry = {
            id: `session-${Date.now()}`,
            exercise: exercise,
            duration: exercise.duration_minutes || 10,
            notes: ""
        };

        setCurrentSession({
            ...currentSession,
            exercises: [...currentSession.exercises, newEntry]
        });
    };

    const removeExercise = (id) => {
        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.filter(ex => ex.id !== id)
        });
    };

    const moveExerciseUp = (index) => {
        if (index === 0) return;
        const newExercises = [...currentSession.exercises];
        [newExercises[index - 1], newExercises[index]] = [newExercises[index], newExercises[index - 1]];
        setCurrentSession({ ...currentSession, exercises: newExercises });
    };

    const moveExerciseDown = (index) => {
        if (index === currentSession.exercises.length - 1) return;
        const newExercises = [...currentSession.exercises];
        [newExercises[index], newExercises[index + 1]] = [newExercises[index + 1], newExercises[index]];
        setCurrentSession({ ...currentSession, exercises: newExercises });
    };

    const updateExerciseDuration = (id, duration) => {
        setCurrentSession({
            ...currentSession,
            exercises: currentSession.exercises.map(ex =>
                ex.id === id ? { ...ex, duration: parseInt(duration) || 10 } : ex
            )
        });
    };

    const saveSession = () => {
        if (currentSession.exercises.length === 0) {
            alert("Ajoutez au moins un exercice à la séance !");
            return;
        }

        const newSessions = [...savedSessions, { ...currentSession, id: Date.now() }];
        setSavedSessions(newSessions);
        localStorage.setItem('coachSessions', JSON.stringify(newSessions));

        setCurrentSession({
            name: "Nouvelle Séance",
            date: new Date().toISOString().split('T')[0],
            exercises: [],
            notes: ""
        });

        alert("✅ Séance sauvegardée avec succès !");
    };

    const loadSession = (session) => {
        setCurrentSession(session);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const deleteSession = (id) => {
        if (confirm("Supprimer cette séance ?")) {
            const newSessions = savedSessions.filter(s => s.id !== id);
            setSavedSessions(newSessions);
            localStorage.setItem('coachSessions', JSON.stringify(newSessions));
        }
    };

    const totalDuration = currentSession.exercises.reduce((sum, ex) => sum + ex.duration, 0);

    const filteredExercises = exercises.filter(ex => {
        const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTheme = filterTheme === "All" || ex.theme === filterTheme;
        return matchesSearch && matchesTheme;
    });

    const themes = ["All", ...new Set(exercises.map(ex => ex.theme))];

    return (
        <div className="space-y-6">
            {/* Session Header */}
            <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                <input
                    type="text"
                    className="text-3xl font-bold bg-transparent border-b-2 border-transparent hover:border-blue-500 focus:border-blue-500 text-white outline-none transition-all mb-4 w-full"
                    value={currentSession.name}
                    onChange={(e) => setCurrentSession({ ...currentSession, name: e.target.value })}
                    placeholder="Nom de la séance..."
                />
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="font-bold text-2xl text-blue-400">{totalDuration}</span>
                        <span className="text-slate-400"> minutes</span>
                    </div>
                    <input
                        type="date"
                        className="px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white"
                        value={currentSession.date}
                        onChange={(e) => setCurrentSession({ ...currentSession, date: e.target.value })}
                    />
                    <span className="text-slate-400">{currentSession.exercises.length} exercices</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Exercise Library */}
                <div className="lg:col-span-1 bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-4">
                    <h2 className="text-lg font-bold text-white mb-4">📚 Bibliothèque</h2>

                    <input
                        type="text"
                        placeholder="Rechercher un exercice..."
                        className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white text-sm mb-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select
                        className="w-full px-3 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white text-sm mb-4"
                        value={filterTheme}
                        onChange={(e) => setFilterTheme(e.target.value)}
                    >
                        {themes.map(theme => (
                            <option key={theme} value={theme}>{theme}</option>
                        ))}
                    </select>

                    <div className="max-h-[600px] overflow-y-auto space-y-2">
                        {filteredExercises.map(exercise => (
                            <motion.div
                                key={exercise.id}
                                whileHover={{ scale: 1.02 }}
                                className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50 hover:border-blue-500/50 transition-all cursor-pointer"
                                onClick={() => addExerciseToSession(exercise)}
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1">
                                        <div className="text-sm font-medium text-white">{exercise.title}</div>
                                        <div className="text-xs text-slate-400 mt-1">{exercise.theme}</div>
                                    </div>
                                    <Plus className="w-4 h-4 text-blue-400" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Session Timeline */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                        <h2 className="text-lg font-bold text-white mb-4">⏱️ Déroulement de la Séance</h2>

                        {currentSession.exercises.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-600 rounded-xl">
                                <Plus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                <p>Cliquez sur des exercices à gauche pour construire votre séance</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {currentSession.exercises.map((entry, index) => (
                                        <motion.div
                                            key={entry.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => moveExerciseUp(index)}
                                                        disabled={index === 0}
                                                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        ▲
                                                    </button>
                                                    <span className="text-sm font-bold text-blue-400 text-center">#{index + 1}</span>
                                                    <button
                                                        onClick={() => moveExerciseDown(index)}
                                                        disabled={index === currentSession.exercises.length - 1}
                                                        className="p-1 hover:bg-slate-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        ▼
                                                    </button>
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-medium text-white">{entry.exercise.title}</h3>
                                                    <p className="text-xs text-slate-400 mt-1">{entry.exercise.theme} • {entry.exercise.game_format}</p>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={entry.duration}
                                                        onChange={(e) => updateExerciseDuration(entry.id, e.target.value)}
                                                        className="w-16 px-2 py-1 rounded bg-slate-900/50 border border-slate-600 text-white text-sm text-center"
                                                    />
                                                    <span className="text-xs text-slate-400">min</span>
                                                    <button
                                                        onClick={() => removeExercise(entry.id)}
                                                        className="p-2 hover:bg-red-500/20 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-red-400" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        <button
                            onClick={saveSession}
                            disabled={currentSession.exercises.length === 0}
                            className="w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-bold transition-all text-lg"
                        >
                            <Save className="w-5 h-5" />
                            Sauvegarder la Séance
                        </button>
                    </div>

                    {/* Saved Sessions */}
                    {savedSessions.length > 0 && (
                        <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl border border-slate-700/50 p-6">
                            <h3 className="text-lg font-bold text-white mb-4">💾 Séances Sauvegardées</h3>
                            <div className="space-y-2">
                                {savedSessions.map(session => (
                                    <div key={session.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-blue-500/50 transition-all">
                                        <button
                                            onClick={() => loadSession(session)}
                                            className="flex-1 text-left"
                                        >
                                            <div className="font-medium text-white">{session.name}</div>
                                            <div className="text-xs text-slate-400 mt-1">
                                                {session.date} • {session.exercises.length} exercices • {session.exercises.reduce((sum, ex) => sum + ex.duration, 0)} min
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => deleteSession(session.id)}
                                            className="p-2 hover:bg-red-500/20 rounded ml-2"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
