import React, { useState, useEffect } from 'react';
import { Plus, Search, MonitorPlay, Trash2, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoLibrary() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [videos, setVideos] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newVideo, setNewVideo] = useState({ title: '', url: '', category: 'Technique', description: '' });
    const [loading, setLoading] = useState(true);

    const categories = ['All', 'Technique', 'Tactique', 'Physique', 'Mental', 'Gardien', 'Autre'];

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/videos', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setVideos(data);
            }
        } catch (err) {
            console.error('Error fetching videos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Convert various video URLs to embed format
    const getEmbedUrl = (url) => {
        // YouTube
        const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch) {
            return `https://www.youtube.com/embed/${ytMatch[1]}`;
        }

        // TikTok
        const tiktokMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
        if (tiktokMatch) {
            return `https://www.tiktok.com/embed/${tiktokMatch[1]}`;
        }

        // Already an embed URL or unknown format
        return url;
    };

    const handleAddVideo = async (e) => {
        e.preventDefault();
        if (!newVideo.title || !newVideo.url) {
            alert('Titre et URL requis');
            return;
        }

        try {
            const res = await fetch('/api/videos', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newVideo,
                    url: getEmbedUrl(newVideo.url)
                })
            });

            if (res.ok) {
                const saved = await res.json();
                setVideos([saved, ...videos]);
                setNewVideo({ title: '', url: '', category: 'Technique', description: '' });
                setShowAddForm(false);
            } else {
                const err = await res.json();
                alert('Erreur: ' + err.error);
            }
        } catch (err) {
            console.error('Error adding video:', err);
            alert('Erreur réseau');
        }
    };

    const handleDeleteVideo = async (id) => {
        if (!window.confirm('Supprimer cette vidéo ?')) return;

        try {
            const res = await fetch(`/api/videos/${id}`, { method: 'DELETE', credentials: 'include' });
            if (res.ok) {
                setVideos(videos.filter(v => v._id !== id));
            }
        } catch (err) {
            console.error('Error deleting video:', err);
        }
    };

    const filteredVideos = videos.filter(video => {
        const matchesCategory = activeCategory === 'All' || video.category === activeCategory;
        const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto p-6 min-h-screen">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <MonitorPlay className="w-8 h-8 text-emerald-400" />
                        Zone Vidéo
                    </h2>
                    <p className="text-slate-400 mt-1">Ajoutez vos propres vidéos d'entraînement.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2 whitespace-nowrap"
                    >
                        <Plus className="w-5 h-5" /> Ajouter
                    </button>
                </div>
            </div>

            {/* Add Video Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Ajouter une Vidéo</h3>
                                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAddVideo} className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Titre *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        placeholder="Ex: Dribble Skills"
                                        className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">URL *</label>
                                    <input
                                        type="url"
                                        required
                                        value={newVideo.url}
                                        onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                                        placeholder="https://youtube.com/watch?v=... ou TikTok"
                                        className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">YouTube ou TikTok (lien complet)</p>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Catégorie</label>
                                    <select
                                        value={newVideo.category}
                                        onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                                        className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                                    <textarea
                                        value={newVideo.description}
                                        onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                                        placeholder="Brève description..."
                                        rows="2"
                                        className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                                >
                                    Ajouter la Vidéo
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Categories */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeCategory === cat
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Video Grid */}
            {loading ? (
                <div className="text-center text-slate-400 py-12">Chargement...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVideos.map((video) => (
                        <motion.div
                            key={video._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-emerald-500/50 transition-colors"
                        >
                            <div className="aspect-video bg-black relative">
                                <iframe
                                    className="w-full h-full"
                                    src={video.url}
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <span className="text-xs px-2 py-1 rounded bg-slate-800 text-emerald-400 font-medium">
                                        {video.category}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteVideo(video._id)}
                                        className="text-slate-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                                    {video.title}
                                </h3>
                                {video.description && (
                                    <p className="text-sm text-slate-400 line-clamp-2">
                                        {video.description}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {filteredVideos.length === 0 && !loading && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            <MonitorPlay className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>Aucune vidéo. Cliquez sur "Ajouter" pour commencer !</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
