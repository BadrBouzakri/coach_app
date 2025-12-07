import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Save, Plus, Trash2, Shield, Circle, Square, Triangle, Minus } from 'lucide-react';

export function LineupBuilder() {
    const [players, setPlayers] = useState([]);
    const [lineup, setLineup] = useState([]);
    const [formation, setFormation] = useState('4-3-3');
    const [lineupName, setLineupName] = useState('');
    const [savedLineups, setSavedLineups] = useState([]);
    const [tools, setTools] = useState([]); // Cônes, échelles, etc.
    const [selectedTool, setSelectedTool] = useState(null);
    const [mode, setMode] = useState('players'); // 'players' or 'tools'

    // Fetch players from API
    useEffect(() => {
        fetch('/api/players')
            .then(res => res.json())
            .then(data => {
                if (data.success) setPlayers(data.data);
            })
            .catch(err => console.error('Error fetching players:', err));

        fetch('/api/lineups')
            .then(res => res.json())
            .then(data => {
                if (data.success) setSavedLineups(data.data);
            })
            .catch(err => console.error('Error fetching lineups:', err));
    }, []);

    const formations = {
        '4-3-3': [
            { x: 50, y: 90 }, // GK
            { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 }, // DEF
            { x: 30, y: 50 }, { x: 50, y: 50 }, { x: 70, y: 50 }, // MID
            { x: 20, y: 20 }, { x: 50, y: 20 }, { x: 80, y: 20 }  // ATT
        ],
        '4-4-2': [
            { x: 50, y: 90 }, // GK
            { x: 20, y: 70 }, { x: 40, y: 70 }, { x: 60, y: 70 }, { x: 80, y: 70 }, // DEF
            { x: 20, y: 45 }, { x: 40, y: 45 }, { x: 60, y: 45 }, { x: 80, y: 45 }, // MID
            { x: 35, y: 20 }, { x: 65, y: 20 }  // ATT
        ],
        '3-5-2': [
            { x: 50, y: 90 }, // GK
            { x: 30, y: 75 }, { x: 50, y: 75 }, { x: 70, y: 75 }, // DEF
            { x: 15, y: 50 }, { x: 35, y: 50 }, { x: 50, y: 55 }, { x: 65, y: 50 }, { x: 85, y: 50 }, // MID
            { x: 35, y: 20 }, { x: 65, y: 20 }  // ATT
        ],
        '8-Foot': [
            { x: 50, y: 90 }, // GK
            { x: 25, y: 70 }, { x: 50, y: 70 }, { x: 75, y: 70 }, // DEF
            { x: 35, y: 45 }, { x: 65, y: 45 }, // MID
            { x: 35, y: 20 }, { x: 65, y: 20 }  // ATT
        ]
    };

    const handlePlayerSelect = (player) => {
        if (lineup.find(p => p._id === player._id)) return;
        if (lineup.length >= formations[formation].length) return;

        const positionIndex = lineup.length;
        const defaultPos = formations[formation][positionIndex];

        setLineup([...lineup, { ...player, x: defaultPos.x, y: defaultPos.y }]);
    };

    const handleRemovePlayer = (playerId) => {
        setLineup(lineup.filter(p => p._id !== playerId));
    };

    const handleAddTool = (toolType) => {
        const newTool = {
            id: Date.now(),
            type: toolType,
            x: 50,
            y: 50
        };
        setTools([...tools, newTool]);
    };

    const handleRemoveTool = (toolId) => {
        setTools(tools.filter(t => t.id !== toolId));
    };

    const handleSaveLineup = async () => {
        if (!lineupName) return alert('Veuillez donner un nom à la composition');

        const lineupData = {
            name: lineupName,
            formation,
            players: lineup.map(p => ({
                player: p._id,
                name: p.name,
                jerseyNumber: p.jerseyNumber,
                position: { x: p.x, y: p.y }
            })),
            tools: tools
        };

        try {
            const res = await fetch('/api/lineups', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lineupData)
            });
            const data = await res.json();
            if (data.success) {
                setSavedLineups([data.data, ...savedLineups]);
                alert('Composition sauvegardée !');
                setLineupName('');
            }
        } catch (err) {
            console.error('Error saving lineup:', err);
        }
    };

    const toolTypes = [
        { type: 'cone', icon: Triangle, color: 'text-orange-500', label: 'Cône' },
        { type: 'ladder', icon: Minus, color: 'text-yellow-500', label: 'Échelle' },
        { type: 'pole', icon: Circle, color: 'text-blue-500', label: 'Piquet' },
        { type: 'marker', icon: Square, color: 'text-green-500', label: 'Marquage' }
    ];

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left: Pitch */}
            <div className="flex-1 bg-slate-900 rounded-2xl p-6 border border-slate-700 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-4">
                        <select
                            value={formation}
                            onChange={(e) => { setFormation(e.target.value); setLineup([]); }}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600"
                        >
                            {Object.keys(formations).map(f => <option key={f} value={f}>{f}</option>)}
                        </select>
                        <input
                            type="text"
                            placeholder="Nom de la compo..."
                            value={lineupName}
                            onChange={(e) => setLineupName(e.target.value)}
                            className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-600 w-64"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setMode('players')}
                            className={`px-3 py-2 rounded-lg font-medium text-sm ${mode === 'players' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                            Joueurs
                        </button>
                        <button
                            onClick={() => setMode('tools')}
                            className={`px-3 py-2 rounded-lg font-medium text-sm ${mode === 'tools' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                            Outils
                        </button>
                        <button
                            onClick={handleSaveLineup}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-colors"
                        >
                            <Save className="w-4 h-4" /> Sauvegarder
                        </button>
                    </div>
                </div>

                {/* Tools Palette */}
                {mode === 'tools' && (
                    <div className="flex gap-2 mb-4 p-3 bg-slate-800 rounded-lg border border-slate-700">
                        {toolTypes.map(tool => (
                            <button
                                key={tool.type}
                                onClick={() => handleAddTool(tool.type)}
                                className="flex flex-col items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                            >
                                <tool.icon className={`w-6 h-6 ${tool.color}`} />
                                <span className="text-xs text-slate-300">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Pitch Graphic */}
                <div className="flex-1 relative bg-emerald-800/80 rounded-xl border-2 border-white/20 overflow-hidden shadow-inner">
                    {/* Pitch Markings */}
                    <div className="absolute inset-4 border-2 border-white/30 rounded-sm"></div>
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 -translate-x-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/30 border-t-0"></div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-white/30 border-b-0"></div>

                    {/* Tools on Pitch */}
                    {tools.map((tool) => {
                        const ToolIcon = toolTypes.find(t => t.type === tool.type)?.icon || Circle;
                        const toolColor = toolTypes.find(t => t.type === tool.type)?.color || 'text-white';

                        return (
                            <motion.div
                                key={tool.id}
                                drag
                                dragMomentum={false}
                                style={{
                                    left: `${tool.x}%`,
                                    top: `${tool.y}%`,
                                    position: 'absolute'
                                }}
                                onDrag={(e, info) => {
                                    const rect = e.target.parentElement.getBoundingClientRect();
                                    const newX = ((info.point.x - rect.left) / rect.width) * 100;
                                    const newY = ((info.point.y - rect.top) / rect.height) * 100;
                                    setTools(tools.map(t => t.id === tool.id ? { ...t, x: newX, y: newY } : t));
                                }}
                                className="absolute cursor-move -translate-x-1/2 -translate-y-1/2 group"
                            >
                                <div className="relative">
                                    <ToolIcon className={`w-8 h-8 ${toolColor} drop-shadow-lg`} strokeWidth={2.5} />
                                    <button
                                        onClick={() => handleRemoveTool(tool.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <XIcon className="w-3 h-3" />
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}

                    {/* Players on Pitch */}
                    {lineup.map((player) => (
                        <motion.div
                            key={player._id}
                            drag
                            dragMomentum={false}
                            style={{
                                left: `${player.x}%`,
                                top: `${player.y}%`,
                                position: 'absolute'
                            }}
                            onDrag={(e, info) => {
                                const rect = e.target.parentElement.getBoundingClientRect();
                                const newX = ((info.point.x - rect.left) / rect.width) * 100;
                                const newY = ((info.point.y - rect.top) / rect.height) * 100;
                                setLineup(lineup.map(p => p._id === player._id ? { ...p, x: newX, y: newY } : p));
                            }}
                            className="absolute cursor-move -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group"
                        >
                            <div className="w-10 h-10 rounded-full bg-white text-slate-900 font-bold flex items-center justify-center border-2 border-slate-900 shadow-lg group-hover:scale-110 transition-transform relative">
                                {player.jerseyNumber || '?'}
                                <button
                                    onClick={() => handleRemovePlayer(player._id)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <XIcon className="w-3 h-3" />
                                </button>
                            </div>
                            <span className="mt-1 text-xs font-bold text-white bg-slate-900/50 px-2 py-0.5 rounded backdrop-blur-sm">
                                {player.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Right: Player List & Saved Lineups */}
            <div className="w-80 flex flex-col gap-4">
                {/* Available Players */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 overflow-y-auto max-h-[50%]">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" /> Joueurs Disponibles
                    </h3>
                    <div className="space-y-2">
                        {players.filter(p => !lineup.find(l => l._id === p._id)).map(player => (
                            <div
                                key={player._id}
                                onClick={() => handlePlayerSelect(player)}
                                className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg hover:bg-slate-700 cursor-pointer transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-white">
                                        {player.jerseyNumber}
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">{player.name}</p>
                                        <p className="text-xs text-slate-400">{player.position}</p>
                                    </div>
                                </div>
                                <Plus className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Saved Lineups */}
                <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex-1 overflow-y-auto">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" /> Compos Sauvegardées
                    </h3>
                    <div className="space-y-2">
                        {savedLineups.map(l => (
                            <div key={l._id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:border-purple-500/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-white font-medium text-sm">{l.name}</p>
                                        <p className="text-xs text-slate-400">{l.formation} • {new Date(l.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <button className="text-slate-500 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function XIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}
