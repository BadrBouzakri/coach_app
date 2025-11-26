import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit2, StickyNote, Calendar as CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function NotesPanel() {
    const { user } = useAuth();
    const [notes, setNotes] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState({ title: '', content: '' });

    useEffect(() => {
        if (user) {
            fetchNotes();
        }
    }, [user]);

    const fetchNotes = async () => {
        try {
            const res = await fetch(`/api/notes/${user.id}`);
            const data = await res.json();
            setNotes(data);
        } catch (err) {
            console.error("Error fetching notes:", err);
        }
    };

    const handleSave = async () => {
        if (!currentNote.title.trim() && !currentNote.content.trim()) return;

        const noteData = {
            userId: user.id,
            title: currentNote.title || 'Note sans titre',
            content: currentNote.content,
            date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
        };

        try {
            if (currentNote._id) {
                // Update
                await fetch(`/api/notes/${currentNote._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData)
                });
            } else {
                // Create
                await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData)
                });
            }
            fetchNotes();
            setIsEditing(false);
            setCurrentNote({ title: '', content: '' });
        } catch (err) {
            console.error("Error saving note:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            try {
                await fetch(`/api/notes/${id}`, { method: 'DELETE' });
                fetchNotes();
            } catch (err) {
                console.error("Error deleting note:", err);
            }
        }
    };

    const startEdit = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <StickyNote className="w-8 h-8 text-emerald-400" />
                        Mes Notes de Coach
                    </h2>
                    <p className="text-slate-400 mt-1">Espace personnel pour vos observations et idées.</p>
                </div>
                <button
                    onClick={() => {
                        setCurrentNote({ title: '', content: '' });
                        setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Nouvelle Note
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor Column (only visible when editing) */}
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
                                    {currentNote._id ? 'Modifier la note' : 'Nouvelle note'}
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Titre</label>
                                        <input
                                            type="text"
                                            value={currentNote.title}
                                            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
                                            placeholder="Sujet de la note..."
                                            className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contenu</label>
                                        <textarea
                                            value={currentNote.content}
                                            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
                                            placeholder="Vos observations..."
                                            rows={12}
                                            className="w-full mt-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                                        />
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={handleSave}
                                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            Enregistrer
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notes Grid */}
                <div className={`${isEditing ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 md:grid-cols-2 ${!isEditing ? 'lg:grid-cols-3' : ''} gap-4`}>
                    {notes.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-slate-800/30 rounded-2xl border border-slate-700/30 border-dashed">
                            <StickyNote className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                            <p className="text-slate-400 text-lg">Aucune note pour le moment.</p>
                            <p className="text-slate-500 text-sm">Commencez par créer votre première note !</p>
                        </div>
                    ) : (
                        notes.map(note => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-emerald-500/30 transition-all group relative"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-white text-lg line-clamp-1">{note.title}</h3>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => startEdit(note)}
                                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(note._id)}
                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-slate-300 text-sm whitespace-pre-wrap line-clamp-6 mb-4 font-light">
                                    {note.content}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-slate-500 mt-auto pt-3 border-t border-slate-700/30">
                                    <CalendarIcon className="w-3 h-3" />
                                    {note.date}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
