import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Save, RefreshCw, Users, Shield, User, MapPin, Flag, Circle, Disc, Goal } from 'lucide-react';

export function LineupBuilder() {
    const [players, setPlayers] = useState([]);
    const [lineupName, setLineupName] = useState('');
    const [selectedFormation, setSelectedFormation] = useState('2-3-2'); // U12 Foot à 8 defaut
    const [fieldPlayers, setFieldPlayers] = useState([]);
    const [fieldItems, setFieldItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const fieldRef = useRef(null);

    // Formations U12 (8 joueurs)
    const formations = {
        '2-3-2': [
            { x: 50, y: 85, role: 'GK' },
            { x: 30, y: 65, role: 'DEF' }, { x: 70, y: 65, role: 'DEF' },
            { x: 20, y: 45, role: 'MID' }, { x: 50, y: 45, role: 'MID' }, { x: 80, y: 45, role: 'MID' },
            { x: 35, y: 20, role: 'FWD' }, { x: 65, y: 20, role: 'FWD' }
        ],
        '3-2-2': [
            { x: 50, y: 85, role: 'GK' },
            { x: 20, y: 65, role: 'DEF' }, { x: 50, y: 65, role: 'DEF' }, { x: 80, y: 65, role: 'DEF' },
            { x: 35, y: 40, role: 'MID' }, { x: 65, y: 40, role: 'MID' },
            { x: 35, y: 20, role: 'FWD' }, { x: 65, y: 20, role: 'FWD' }
        ],
        '3-3-1': [
            { x: 50, y: 85, role: 'GK' },
            { x: 20, y: 65, role: 'DEF' }, { x: 50, y: 65, role: 'DEF' }, { x: 80, y: 65, role: 'DEF' },
            { x: 20, y: 45, role: 'MID' }, { x: 50, y: 45, role: 'MID' }, { x: 80, y: 45, role: 'MID' },
            { x: 50, y: 20, role: 'FWD' }
        ]
    };

    const equipment = [
        { type: 'cone', icon: <Disc className="w-6 h-6 text-orange-500" />, label: 'Cône' },
        { type: 'flag', icon: <Flag className="w-6 h-6 text-red-500" />, label: 'Drapeau' },
        { type: 'ball', icon: <Circle className="w-6 h-6 text-white fill-current" />, label: 'Ballon' },
        { type: 'goal', icon: <Goal className="w-6 h-6 text-white" />, label: 'But' },
        { type: 'ladder', icon: <div className="w-6 h-6 border-x-2 border-yellow-400 flex flex-col justify-around"><div className="h-0.5 bg-yellow-400"></div><div className="h-0.5 bg-yellow-400"></div></div>, label: 'Echelle' },
        { type: 'mannequin', icon: <User className="w-6 h-6 text-blue-400" />, label: 'Mannequin' },
        { type: 'hoop', icon: <div className="w-5 h-5 rounded-full border-2 border-purple-500"></div>, label: 'Cerceau' },
    ];

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const res = await fetch('/api/players');
            const data = await res.json();
            setPlayers(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching players:", err);
            setLoading(false);
        }
    };

    const handlePlayerDrop = (event, info, player) => {
        if (!fieldRef.current) return;

        const fieldRect = fieldRef.current.getBoundingClientRect();
        const x = info.point.x - fieldRect.left;
        const y = info.point.y - fieldRect.top;

        // Calculate percentage
        const xPercent = (x / fieldRect.width) * 100;
        const yPercent = (y / fieldRect.height) * 100;

        // Check if dropped inside field
        if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
            setFieldPlayers(prev => {
                const existing = prev.find(p => p.player._id === player._id);
                if (existing) {
                    return prev.map(p => p.player._id === player._id ? { ...p, position: { x: xPercent, y: yPercent } } : p);
                }
                return [...prev, { player, position: { x: xPercent, y: yPercent } }];
            });
        }
    };

    const handleItemDrop = (event, info, itemType) => {
        if (!fieldRef.current) return;

        const fieldRect = fieldRef.current.getBoundingClientRect();
        const x = info.point.x - fieldRect.left;
        const y = info.point.y - fieldRect.top;

        const xPercent = (x / fieldRect.width) * 100;
        const yPercent = (y / fieldRect.height) * 100;

        if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
            setFieldItems(prev => [
                ...prev,
                { id: Date.now(), type: itemType, position: { x: xPercent, y: yPercent } }
            ]);
        }
    };

    const handleItemMove = (event, info, id) => {
        if (!fieldRef.current) return;

        const fieldRect = fieldRef.current.getBoundingClientRect();
        const x = info.point.x - fieldRect.left;
        const y = info.point.y - fieldRect.top;
        const xPercent = (x / fieldRect.width) * 100;
        const yPercent = (y / fieldRect.height) * 100;

        if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
            setFieldItems(prev => prev.map(item => item.id === id ? { ...item, position: { x: xPercent, y: yPercent } } : item));
        }
    };

    const removeFromField = (playerId) => {
        setFieldPlayers(prev => prev.filter(p => p.player._id !== playerId));
    };

    const removeItemFromField = (itemId) => {
        setFieldItems(prev => prev.filter(i => i.id !== itemId));
    };

    const applyFormation = (fmt) => {
        setSelectedFormation(fmt);
        const slots = formations[fmt];
        setFieldPlayers(prev => {
            return prev.map((p, index) => {
                if (index < slots.length) {
                    return { ...p, position: { x: slots[index].x, y: slots[index].y } };
                }
                return p;
            });
        });
    };

    const saveLineup = async () => {
        if (!lineupName) return alert('Veuillez donner un nom à la tactique');

        const lineupData = {
            name: lineupName,
            formation: selectedFormation,
            players: fieldPlayers.map(p => ({
                player: p.player._id,
                position: p.position,
                name: p.player.name,
                jerseyNumber: p.player.jerseyNumber
            })),
            items: fieldItems.map(i => ({
                type: i.type,
                position: i.position
            }))
        };

        try {
            const res = await fetch('/api/lineups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineupData)
            });
            if (res.ok) {
                alert('Tactique sauvegardée !');
            } else {
                const err = await res.json();
                alert('Erreur: ' + err.error);
            }
        } catch (err) {
            console.error("Error saving lineup:", err);
            alert("Erreur réseau");
        }
    };

    const getItemIcon = (type) => {
        switch (type) {
            case 'cone': return <Disc className="w-4 h-4 text-orange-500" />;
            case 'flag': return <Flag className="w-4 h-4 text-red-500" />;
            case 'ball': return <Circle className="w-3 h-3 text-white fill-current" />;
            case 'goal': return <Goal className="w-6 h-6 text-white" />;
            case 'ladder': return <div className="w-8 h-8 border-x-2 border-yellow-400 flex flex-col justify-around rotate-90"><div className="h-0.5 bg-yellow-400"></div><div className="h-0.5 bg-yellow-400"></div><div className="h-0.5 bg-yellow-400"></div></div>;
            case 'mannequin': return <User className="w-6 h-6 text-blue-400" />;
            case 'hoop': return <div className="w-5 h-5 rounded-full border-2 border-purple-500"></div>;
            default: return null;
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-8 h-8 text-emerald-400" />
                        Tactique & Exercices
                    </h2>
                    <p className="text-slate-400">Préparez vos matchs et vos séances.</p>
                </div>
                <div className="flex gap-4">
                    <select
                        value={selectedFormation}
                        onChange={(e) => applyFormation(e.target.value)}
                        className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
                    >
                        {Object.keys(formations).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <input
                        type="text"
                        placeholder="Nom de la tactique"
                        value={lineupName}
                        onChange={(e) => setLineupName(e.target.value)}
                        className="bg-slate-800 text-white rounded-lg px-4 py-2 border border-slate-700"
                    />
                    <button
                        onClick={saveLineup}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Sauvegarder
                    </button>
                    <button
                        onClick={() => { setFieldPlayers([]); setFieldItems([]); }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" /> Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                {/* Sidebar Players & Equipment */}
                <div className="lg:col-span-1 space-y-4 max-h-[700px] flex flex-col">
                    {/* Players List */}
                    <div className="bg-slate-900/50 rounded-2xl p-4 overflow-y-auto flex-1">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="w-5 h-5" /> Joueurs
                        </h3>
                        <div className="space-y-2">
                            {players.map(player => {
                                const isOnField = fieldPlayers.find(p => p.player._id === player._id);
                                return (
                                    <motion.div
                                        key={player._id}
                                        drag={!isOnField}
                                        dragSnapToOrigin
                                        onDragEnd={(e, info) => handlePlayerDrop(e, info, player)}
                                        className={`p-3 rounded-lg flex items-center justify-between ${isOnField ? 'bg-emerald-900/30 border border-emerald-500/30 opacity-50' : 'bg-slate-800 border border-slate-700 cursor-grab hover:border-emerald-500/50'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                {player.jerseyNumber}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{player.name}</div>
                                                <div className="text-xs text-slate-400">{player.position}</div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Equipment Palette */}
                    <div className="bg-slate-900/50 rounded-2xl p-4">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Disc className="w-5 h-5" /> Matériel
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {equipment.map(item => (
                                <motion.div
                                    key={item.type}
                                    drag
                                    dragSnapToOrigin
                                    onDragEnd={(e, info) => handleItemDrop(e, info, item.type)}
                                    className="p-3 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 cursor-grab hover:bg-slate-700"
                                >
                                    {item.icon}
                                    <span className="text-xs text-slate-300">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pitch */}
                <div className="lg:col-span-3 relative bg-green-800 rounded-2xl overflow-hidden border-4 border-white/10 shadow-2xl" ref={fieldRef}>
                    {/* Field Markings */}
                    <div className="absolute inset-4 border-2 border-white/40 rounded-sm"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-16 border-b-2 border-x-2 border-white/40"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-16 border-t-2 border-x-2 border-white/40"></div>
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/40 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/40 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

                    {/* Items on Field */}
                    {fieldItems.map((item) => (
                        <motion.div
                            key={item.id}
                            drag
                            dragMomentum={false}
                            onDragEnd={(e, info) => handleItemMove(e, info, item.id)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, left: `${item.position.x}%`, top: `${item.position.y}%` }}
                            style={{ position: 'absolute', x: '-50%', y: '-50%' }}
                            className="absolute flex items-center justify-center cursor-grabbign z-1 group"
                        >
                            <div className="relative">
                                {getItemIcon(item.type)}
                                <button
                                    onClick={() => removeItemFromField(item.id)}
                                    className="absolute -top-3 -right-3 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                        </motion.div>
                    ))}

                    {/* Players on Field */}
                    {fieldPlayers.map((item) => (
                        <motion.div
                            key={item.player._id}
                            drag
                            dragMomentum={false}
                            onDragEnd={(e, info) => handlePlayerDrop(e, info, item.player)}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, left: `${item.position.x}%`, top: `${item.position.y}%` }}
                            style={{ position: 'absolute', x: '-50%', y: '-50%' }}
                            className="absolute flex flex-col items-center cursor-grabbing z-10 group"
                        >
                            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:bg-emerald-500 transition-colors relative">
                                {item.player.jerseyNumber}
                                <button
                                    onClick={() => removeFromField(item.player._id)}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="mt-1 bg-black/50 px-2 py-0.5 rounded text-white text-[10px] lg:text-xs font-bold whitespace-nowrap backdrop-blur-sm">
                                {item.player.name}
                            </div>
                        </motion.div>
                    ))}

                    {/* Drop Info */}
                    {fieldPlayers.length === 0 && fieldItems.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <p className="text-white/20 text-2xl font-bold uppercase tracking-widest text-center">Glissez joueurs <br /> & matériel ici</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LineupBuilder;
