import React from 'react';
import { BarChart3, Heart, TrendingUp, Star, Award } from 'lucide-react';

export function StatisticsPanel({ exercises }) {
    // Calculate statistics
    const totalExercises = exercises.length;
    const themes = [...new Set(exercises.map(e => e.theme))];
    const avgFunRating = (exercises.reduce((sum, e) => sum + e.fun_rating, 0) / totalExercises).toFixed(1);

    const themeDistribution = themes.map(theme => ({
        name: theme,
        count: exercises.filter(e => e.theme === theme).length
    })).sort((a, b) => b.count - a.count);

    const topRated = [...exercises]
        .sort((a, b) => b.fun_rating - a.fun_rating)
        .slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Statistiques</h2>
                    <p className="text-slate-400 text-sm">Vue d'ensemble de votre bibliothèque</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Exercises */}
                <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 p-6 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <Award className="w-8 h-8 text-emerald-400" />
                        <span className="text-3xl font-bold text-white">{totalExercises}</span>
                    </div>
                    <p className="text-emerald-200 text-sm font-medium">Exercices Totaux</p>
                </div>

                {/* Themes Count */}
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 p-6 rounded-xl border border-blue-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-blue-400" />
                        <span className="text-3xl font-bold text-white">{themes.length}</span>
                    </div>
                    <p className="text-blue-200 text-sm font-medium">Thèmes Disponibles</p>
                </div>

                {/* Average Fun Rating */}
                <div className="bg-gradient-to-br from-amber-900/30 to-amber-800/20 p-6 rounded-xl border border-amber-500/30">
                    <div className="flex items-center justify-between mb-2">
                        <Star className="w-8 h-8 text-amber-400" />
                        <span className="text-3xl font-bold text-white">{avgFunRating}</span>
                    </div>
                    <p className="text-amber-200 text-sm font-medium">Note Fun Moyenne</p>
                </div>
            </div>

            {/* Theme Distribution */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    Distribution par Thème
                </h3>
                <div className="space-y-3">
                    {themeDistribution.map((item, index) => {
                        const percentage = ((item.count / totalExercises) * 100).toFixed(0);
                        return (
                            <div key={index}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-300 font-medium">{item.name}</span>
                                    <span className="text-slate-400">{item.count} ({percentage}%)</span>
                                </div>
                                <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Rated Exercises */}
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    Top 5 Exercices les Plus Fun
                </h3>
                <div className="space-y-3">
                    {topRated.map((exercise, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/30 hover:border-pink-500/50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-white font-medium group-hover:text-pink-300 transition-colors">{exercise.title}</p>
                                    <p className="text-slate-400 text-xs">{exercise.theme}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < exercise.fun_rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
