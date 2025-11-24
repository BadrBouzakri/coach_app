import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, ChevronRight, ChevronLeft, Maximize2 } from 'lucide-react';

// --- Assets ---

const Player = ({ team, label }) => {
    const colors = {
        A: { fill: '#2563eb', stroke: '#1e40af', text: 'white' }, // Blue
        B: { fill: '#dc2626', stroke: '#991b1b', text: 'white' }, // Red
        neutral: { fill: '#facc15', stroke: '#ca8a04', text: 'black' }, // Yellow
    };
    const style = colors[team] || colors.neutral;

    return (
        <div className="relative w-10 h-10 flex items-center justify-center z-20 drop-shadow-lg">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                {/* Shadow */}
                <ellipse cx="50" cy="50" rx="45" ry="45" fill="black" opacity="0.3" filter="blur(4px)" />
                {/* Shoulders */}
                <path
                    d="M 20 50 Q 50 20 80 50 L 80 70 Q 50 90 20 70 Z"
                    fill={style.fill}
                    stroke={style.stroke}
                    strokeWidth="3"
                />
                {/* Head */}
                <circle cx="50" cy="50" r="22" fill={style.fill} stroke={style.stroke} strokeWidth="3" />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${style.text} pointer-events-none`}>
                {label}
            </span>
        </div>
    );
};

const Ball = () => (
    <div className="relative w-5 h-5 z-30">
        <div className="absolute inset-0 bg-black/40 rounded-full blur-[2px] translate-y-1" />
        <div className="w-full h-full bg-white rounded-full border border-slate-300 shadow-sm relative overflow-hidden flex items-center justify-center">
            {/* Soccer ball pattern hint */}
            <div className="absolute w-[120%] h-px bg-slate-300 rotate-45" />
            <div className="absolute w-[120%] h-px bg-slate-300 -rotate-45" />
            <div className="absolute w-[120%] h-px bg-slate-300 rotate-90" />
        </div>
    </div>
);

const Cone = () => (
    <div className="relative w-6 h-6 flex items-center justify-center z-10">
        <div className="absolute bottom-0 w-6 h-2 bg-black/30 rounded-full blur-[1px]" />
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[14px] border-b-orange-500 drop-shadow-sm" />
    </div>
);

const Ladder = ({ rotation }) => (
    <div
        className="w-32 h-10 border-2 border-yellow-400/80 flex justify-between relative opacity-90 shadow-sm"
        style={{ transform: `rotate(${rotation}deg)` }}
    >
        {[...Array(6)].map((_, i) => (
            <div key={i} className="w-1 h-full bg-yellow-400/80" />
        ))}
    </div>
);

const Goal = ({ rotation }) => (
    <div
        className="w-24 h-8 border-4 border-white bg-white/5 relative shadow-md"
        style={{ transform: `rotate(${rotation}deg)` }}
    >
        <div className="absolute inset-0 border-b-2 border-white/20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.2) 5px, rgba(255,255,255,0.2) 10px)' }} />
    </div>
);

const Arrow = ({ start, end, curve = 0, color = "white", dashed = false }) => {
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len;
    const ny = dx / len;

    const cX = midX + nx * curve;
    const cY = midY + ny * curve;

    const pathData = `M ${start.x} ${start.y} Q ${cX} ${cY} ${end.x} ${end.y}`;

    return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            <defs>
                <marker id={`arrowhead-${color}`} markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" fill={color} />
                </marker>
            </defs>
            {/* Glow effect */}
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="4"
                opacity="0.3"
                strokeLinecap="round"
                filter="blur(2px)"
            />
            {/* Main path */}
            <path
                d={pathData}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeDasharray={dashed ? "6,4" : "none"}
                markerEnd={`url(#arrowhead-${color})`}
                strokeLinecap="round"
                className={dashed ? "" : "animate-dash"} // Custom animation class
            >
                {!dashed && (
                    <animate
                        attributeName="stroke-dasharray"
                        from="0, 1000"
                        to="1000, 0"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                )}
            </path>
        </svg>
    );
};

// --- Main Component ---

export function TacticalBoard({ setup, animation }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const hasAnimation = animation && animation.length > 0;
    const currentEntities = hasAnimation ? animation[currentStep].entities : [];

    useEffect(() => {
        let interval;
        if (isPlaying && hasAnimation) {
            interval = setInterval(() => {
                setCurrentStep((prev) => {
                    if (prev < animation.length - 1) return prev + 1;
                    setIsPlaying(false);
                    return prev;
                });
            }, (animation[currentStep].duration || 2) * 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentStep, animation, hasAnimation]);

    const handleReset = () => {
        setIsPlaying(false);
        setCurrentStep(0);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-[4/3] bg-[#1a472a] rounded-xl overflow-hidden shadow-2xl border-4 border-white/10 group">

                {/* Realistic Field Texture - Improved */}
                <div className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                            linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent),
                            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 80%)
                        `,
                        backgroundSize: '50px 50px, 50px 50px, 100% 100%'
                    }}
                />
                {/* Grass Noise Texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{ filter: 'url(#noise)' }}></div>

                {/* Field Markings - Sharper */}
                <div className="absolute inset-4 border-2 border-white/70 rounded-sm pointer-events-none opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/70 -translate-y-1/2 pointer-events-none opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/70 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/70 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90" />

                {/* Entities Layer */}
                <div className="absolute inset-0">
                    <AnimatePresence mode="popLayout">
                        {currentEntities.map((entity) => {
                            if (entity.type === 'arrow') {
                                return (
                                    <Arrow
                                        key={entity.id}
                                        start={{ x: entity.x, y: entity.y }}
                                        end={{ x: entity.endX, y: entity.endY }}
                                        curve={entity.curve}
                                    />
                                );
                            }

                            return (
                                <motion.div
                                    key={entity.id}
                                    layoutId={entity.id}
                                    initial={{ x: `${entity.x}%`, y: `${entity.y}%`, opacity: 0, scale: 0.5 }}
                                    animate={{
                                        left: `${entity.x}%`,
                                        top: `${entity.y}%`,
                                        opacity: 1,
                                        scale: 1,
                                        rotate: entity.rotation || 0
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 45,
                                        damping: 15,
                                        mass: 1.2, // Slightly heavier feel for realism
                                        duration: animation[currentStep].duration || 1
                                    }}
                                    className="absolute -translate-x-1/2 -translate-y-1/2"
                                >
                                    {entity.type === 'player' && <Player team={entity.team} label={entity.label} />}
                                    {entity.type === 'ball' && <Ball />}
                                    {entity.type === 'cone' && <Cone />}
                                    {entity.type === 'ladder' && <Ladder rotation={entity.rotation} />}
                                    {entity.type === 'goal' && <Goal rotation={entity.rotation} />}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Overlay Info */}
                {hasAnimation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={currentStep}
                        className="absolute bottom-4 left-4 right-4"
                    >
                        <div className="bg-black/70 backdrop-blur-md text-white px-4 py-3 rounded-lg text-center shadow-lg border border-white/10">
                            <span className="font-bold text-emerald-400 mr-2 uppercase tracking-wider text-xs">Étape {currentStep + 1}</span>
                            <span className="text-sm font-medium">{animation[currentStep].step_description}</span>
                        </div>
                    </motion.div>
                )}

                {!hasAnimation && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-white/95 p-6 rounded-xl shadow-2xl text-center max-w-xs border border-white/50">
                            <h4 className="font-bold text-slate-900 mb-2">Configuration</h4>
                            <p className="text-slate-700 text-sm font-medium">{setup.player_arrangement}</p>
                            <div className="mt-4 text-xs text-slate-500 uppercase tracking-wider font-bold">{setup.field_dimensions}</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Controls Bar */}
            {hasAnimation && (
                <div className="flex items-center justify-between bg-slate-800/50 backdrop-blur-md p-3 rounded-xl shadow-lg border border-slate-700/50">
                    <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors" title="Reset">
                        <RotateCcw className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="p-2 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className={`w-14 h-14 flex items-center justify-center rounded-full text-white shadow-xl transition-all transform hover:scale-105 active:scale-95 ${isPlaying ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-500 hover:bg-emerald-600'
                                }`}
                        >
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>

                        <button
                            onClick={() => setCurrentStep(Math.min(animation.length - 1, currentStep + 1))}
                            disabled={currentStep === animation.length - 1}
                            className="p-2 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="w-10 text-right text-sm font-mono text-slate-400">
                        {currentStep + 1}/{animation.length}
                    </div>
                </div>
            )}
        </div>
    );
}
