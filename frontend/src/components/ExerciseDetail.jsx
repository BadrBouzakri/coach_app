import React from 'react';
import { X, Clock, Users, Activity, Trophy, HelpCircle, Brain, Sparkles } from 'lucide-react';
import { TacticalBoard } from './TacticalBoard';

export function ExerciseDetail({ exercise, onClose }) {
    if (!exercise) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row border border-slate-700">

                {/* Left: Visuals */}
                <div className="w-full md:w-1/2 bg-slate-800/50 p-6 flex flex-col gap-4 sticky top-0 border-r border-slate-700/50">
                    <div className="flex justify-between items-start md:hidden">
                        <h2 className="text-xl font-bold text-white">{exercise.title}</h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-white"><X className="w-6 h-6" /></button>
                    </div>

                    <TacticalBoard setup={exercise.setup_instructions} animation={exercise.animation} />

                    <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                        <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Setup & Matériel
                        </h3>
                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                            {exercise.setup_instructions.equipment.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Right: Details */}
                <div className="w-full md:w-1/2 p-6 bg-slate-900">
                    <div className="hidden md:flex justify-between items-start mb-6">
                        <div>
                            <span className="px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30 bg-blue-500/10 text-blue-300 tracking-wide uppercase">{exercise.theme}</span>
                            <h2 className="text-3xl font-bold text-white mt-3">{exercise.title}</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-8">
                        {/* Stats */}
                        <div className="flex gap-4 text-sm text-slate-300">
                            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                <Users className="w-4 h-4 text-blue-400" /> {exercise.game_format}
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
                                <Activity className="w-4 h-4 text-emerald-400" /> {exercise.motor_skills_focus}
                            </div>
                        </div>

                        {/* Rules */}
                        <div>
                            <h3 className="font-bold text-white mb-4 text-lg">Règles du jeu</h3>
                            <ul className="space-y-3">
                                {exercise.rules_and_scoring.rules.map((rule, i) => (
                                    <li key={i} className="flex gap-4 text-slate-300 text-sm leading-relaxed">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs">
                                            {i + 1}
                                        </span>
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Scoring */}
                        <div className="bg-emerald-900/10 p-5 rounded-xl border border-emerald-500/20">
                            <h3 className="font-bold text-emerald-400 mb-2 text-sm uppercase tracking-wider">Système de points</h3>
                            <p className="text-emerald-200 text-sm">{exercise.rules_and_scoring.scoring_system}</p>
                        </div>

                        {/* AI Coach Section */}
                        <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-5 rounded-xl border border-indigo-500/30 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Brain className="w-24 h-24 text-white" />
                            </div>

                            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg relative z-10">
                                <Sparkles className="w-5 h-5 text-indigo-400" />
                                AI Coach Insights
                            </h3>

                            <div className="space-y-4 relative z-10">
                                <div className="bg-indigo-950/50 p-3 rounded-lg border border-indigo-500/20">
                                    <p className="text-indigo-200 text-sm font-medium mb-1">🎯 Objectif Principal</p>
                                    <p className="text-slate-300 text-sm">
                                        Cet exercice de <span className="text-white font-bold">{exercise.theme}</span> est excellent pour développer la <span className="text-white font-bold">{exercise.motor_skills_focus}</span>.
                                        Insistez sur la qualité du mouvement plutôt que la vitesse au début.
                                    </p>
                                </div>

                                <div className="bg-indigo-950/50 p-3 rounded-lg border border-indigo-500/20">
                                    <p className="text-indigo-200 text-sm font-medium mb-1">⚡ Variation Suggérée</p>
                                    <p className="text-slate-300 text-sm">
                                        Pour augmenter l'intensité, réduisez l'espace de jeu de 20% ou limitez les touches de balle à 2 maximum.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Coaching Questions */}
                        <div>
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg">
                                <HelpCircle className="w-5 h-5 text-purple-400" />
                                Questionnement (Coaching)
                            </h3>
                            <div className="space-y-3">
                                {exercise.coaching_questions.map((q, i) => (
                                    <div key={i} className="p-4 bg-purple-900/10 rounded-xl text-purple-200 text-sm italic border-l-4 border-purple-500/50">
                                        "{q}"
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
