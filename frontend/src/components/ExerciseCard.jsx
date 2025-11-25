import React from 'react';
import { Target, Users, Activity, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const themeColors = {
    Dribble: { from: '#3b82f6', to: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.3)' },
    Passes: { from: '#10b981', to: '#047857', glow: 'rgba(16, 185, 129, 0.3)' },
    Coordination: { from: '#f59e0b', to: '#d97706', glow: 'rgba(245, 158, 11, 0.3)' },
    Vitesse: { from: '#ef4444', to: '#dc2626', glow: 'rgba(239, 68, 68, 0.3)' },
    Endurance: { from: '#8b5cf6', to: '#7c3aed', glow: 'rgba(139, 92, 246, 0.3)' },
    Tirs: { from: '#ec4899', to: '#db2777', glow: 'rgba(236, 72, 153, 0.3)' },
    Tactique: { from: '#06b6d4', to: '#0891b2', glow: 'rgba(6, 182, 212, 0.3)' },
    "Prise d'information": { from: '#3b82f6', to: '#1d4ed8', glow: 'rgba(59, 130, 246, 0.3)' },
    "Duel": { from: '#ef4444', to: '#dc2626', glow: 'rgba(239, 68, 68, 0.3)' },
    "Conservation": { from: '#10b981', to: '#047857', glow: 'rgba(16, 185, 129, 0.3)' },
    "Finition": { from: '#f97316', to: '#ea580c', glow: 'rgba(249, 115, 22, 0.3)' },
    "Déséquilibre": { from: '#a855f7', to: '#9333ea', glow: 'rgba(168, 85, 247, 0.3)' },
    "Échauffement": { from: '#f59e0b', to: '#d97706', glow: 'rgba(245, 158, 11, 0.3)' },
    default: { from: '#6366f1', to: '#4f46e5', glow: 'rgba(99, 102, 241, 0.3)' }
};

export function ExerciseCard({ exercise, onClick, isFavorite = false, onToggleFavorite }) {
    const colors = themeColors[exercise.theme] || themeColors.default;

    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onToggleFavorite?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{
                y: -8,
                scale: 1.02,
                boxShadow: `0 20px 40px ${colors.glow}`
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20
            }}
            onClick={onClick}
            className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden cursor-pointer border border-slate-700/50 group hover:border-slate-600/80 transition-all duration-300"
        >
            {/* Animated Background Gradient */}
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: `radial-gradient(circle at top right, ${colors.from}15, transparent 70%)`
                }}
            />

            {/* Theme Badge */}
            <div className="relative p-3 border-b border-slate-700/50 group-hover:border-slate-600/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-lg"
                            style={{
                                background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
                                borderColor: colors.from,
                                boxShadow: `0 2px 8px ${colors.glow}`
                            }}
                        >
                            <span className="text-white drop-shadow-sm">{exercise.theme}</span>
                        </motion.div>

                        {/* Duration Badge */}
                        {exercise.duration_minutes && (
                            <div className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {exercise.duration_minutes}'
                            </div>
                        )}

                        {/* Difficulty Indicator */}
                        {exercise.difficulty && (
                            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${exercise.difficulty === 'Facile' ? 'bg-green-600/20 text-green-300 border border-green-500/30' :
                                exercise.difficulty === 'Moyen' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30' :
                                    'bg-red-600/20 text-red-300 border border-red-500/30'
                                }`}>
                                {exercise.difficulty === 'Facile' ? '🟢' : exercise.difficulty === 'Moyen' ? '🟡' : '🔴'}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Fun Rating */}
                        <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < exercise.fun_rating
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-slate-600'
                                        }`}
                                />
                            ))}
                        </div>

                        {/* Favorite Star */}
                        {onToggleFavorite && (
                            <button
                                onClick={handleFavoriteClick}
                                className="p-1 hover:bg-white/10 rounded transition-all flex-shrink-0"
                            >
                                <Star
                                    className={`w-4 h-4 transition-all ${isFavorite
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-slate-400 hover:text-red-400'
                                        }`}
                                />
                            </button>
                        )}
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white leading-tight mb-2 truncate pr-2">
                    {exercise.title}
                </h3>

                {/* Subtitle Info */}
                <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{exercise.game_format}</span>
                    </div>
                    <div className="flex items-center gap-1 truncate">
                        <Activity className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{exercise.motor_skills_focus}</span>
                    </div>
                </div>
            </div>

            {/* Tags Section */}
            <div className="relative p-3 bg-slate-900/30">
                <div className="flex flex-wrap gap-2">
                    {exercise.tags.slice(0, 3).map((tag, index) => (
                        <motion.span
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.1, y: -2 }}
                            className="px-3 py-1 bg-slate-700/50 backdrop-blur-sm text-slate-300 text-xs rounded-lg border border-slate-600/50 group-hover:bg-slate-600/50 group-hover:text-white group-hover:border-slate-500 transition-all duration-200 font-medium"
                        >
                            #{tag}
                        </motion.span>
                    ))}
                    {exercise.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs rounded-lg border border-indigo-500/30 font-medium">
                            +{exercise.tags.length - 3}
                        </span>
                    )}
                </div>

                {/* Animation Indicator */}
                {exercise.animation && exercise.animation.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-3 flex items-center gap-2 text-xs text-emerald-400 font-medium"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <Sparkles className="w-4 h-4" />
                        </motion.div>
                        <span className="drop-shadow-sm">Animation disponible ({exercise.animation.length} étapes)</span>
                    </motion.div>
                )}
            </div>

            {/* Hover Overlay Effect */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className="absolute top-0 right-0 w-32 h-32 blur-3xl"
                    style={{
                        background: `radial-gradient(circle, ${colors.from}40, transparent)`
                    }}
                />
            </motion.div>

            {/* Bottom Shine Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}
