import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AttendanceSheet } from './AttendanceSheet';

export function TeamCalendar() {
    const [events, setEvents] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const [selectedEventForAttendance, setSelectedEventForAttendance] = useState(null);

    const emptyEvent = {
        type: 'Entraînement',
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '18:00',
        duration: 90,
        location: 'Stade',
        opponent: '',
        notes: ''
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await fetch('/api/events');
            const data = await res.json();
            setEvents(data);
        } catch (err) {
            console.error("Error fetching events:", err);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const method = currentEvent._id ? 'PUT' : 'POST';
            const url = currentEvent._id ? `/api/events/${currentEvent._id}` : '/api/events';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentEvent)
            });

            fetchEvents();
            setIsEditing(false);
            setCurrentEvent(null);
        } catch (err) {
            console.error("Error saving event:", err);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Supprimer cet événement ?')) {
            try {
                await fetch(`/api/events/${id}`, { method: 'DELETE' });
                fetchEvents();
            } catch (err) {
                console.error("Error deleting event:", err);
            }
        }
    };

    const getEventTypeColor = (type) => {
        switch (type) {
            case 'Match': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'Entraînement': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
            case 'Réunion': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <CalendarIcon className="w-8 h-8 text-emerald-400" />
                        Calendrier
                    </h2>
                    <p className="text-slate-400 mt-1">Planifiez vos entraînements et matchs.</p>
                </div>
                <button
                    onClick={() => { setCurrentEvent(emptyEvent); setIsEditing(true); }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium flex items-center gap-2 transition-colors shadow-lg shadow-emerald-900/20"
                >
                    <Plus className="w-5 h-5" />
                    Nouvel Événement
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Editor */}
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
                                    {currentEvent._id ? 'Modifier Événement' : 'Nouvel Événement'}
                                </h3>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                                        <select
                                            value={currentEvent.type}
                                            onChange={e => setCurrentEvent({ ...currentEvent, type: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        >
                                            <option>Entraînement</option>
                                            <option>Match</option>
                                            <option>Réunion</option>
                                            <option>Autre</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Titre</label>
                                        <input
                                            type="text"
                                            required
                                            value={currentEvent.title}
                                            onChange={e => setCurrentEvent({ ...currentEvent, title: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                                            <input
                                                type="date"
                                                required
                                                value={currentEvent.date ? new Date(currentEvent.date).toISOString().split('T')[0] : ''}
                                                onChange={e => setCurrentEvent({ ...currentEvent, date: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Heure</label>
                                            <input
                                                type="time"
                                                required
                                                value={currentEvent.time}
                                                onChange={e => setCurrentEvent({ ...currentEvent, time: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Lieu</label>
                                        <input
                                            type="text"
                                            value={currentEvent.location}
                                            onChange={e => setCurrentEvent({ ...currentEvent, location: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                    {currentEvent.type === 'Match' && (
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Adversaire</label>
                                            <input
                                                type="text"
                                                value={currentEvent.opponent}
                                                onChange={e => setCurrentEvent({ ...currentEvent, opponent: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                            />
                                        </div>
                                    )}

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

                {/* Events List */}
                <div className={`${isEditing ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
                    {events.map(event => (
                        <motion.div
                            key={event._id}
                            layout
                            className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center border ${getEventTypeColor(event.type)}`}>
                                    <span className="text-xs font-bold uppercase">{new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                                    <span className="text-xl font-bold">{new Date(event.date).getDate()}</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getEventTypeColor(event.type)}`}>
                                            {event.type}
                                        </span>
                                        <h3 className="font-bold text-white text-lg">{event.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {event.time} ({event.duration} min)
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => setSelectedEventForAttendance(event)}
                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Présences
                                </button>
                                <button
                                    onClick={() => { setCurrentEvent(event); setIsEditing(true); }}
                                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button
                                    onClick={() => handleDelete(event._id)}
                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {events.length === 0 && (
                        <div className="py-12 text-center text-slate-500 bg-slate-800/30 rounded-xl border border-slate-700/30 border-dashed">
                            Aucun événement prévu.
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance Modal */}
            {selectedEventForAttendance && (
                <AttendanceSheet
                    event={selectedEventForAttendance}
                    onClose={() => setSelectedEventForAttendance(null)}
                />
            )}
        </div>
    );
}
