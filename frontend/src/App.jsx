import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ExerciseCard } from './components/ExerciseCard';
import { ExerciseDetail } from './components/ExerciseDetail';
import { StatisticsPanel } from './components/StatisticsPanel';
import { SessionPlanner } from './components/SessionPlanner';
import { ParticleBackground, PageTransition } from './components/PageTransition';
import batch1 from './data/batch1_exercises.json';
import batch2 from './data/batch2_warmup.json';
import batch3 from './data/batch3_generated.json';
import batchWarmup from './data/batch_warmup_complete.json';
import improvedWarmups from './data/warmup_exercises_improved.json';
import premiumExercises from './data/premium_exercises_complete.json';
import examples from './data/example_exercises.json';
import { Search, Filter, Star } from 'lucide-react';

function App() {
  const [exercises] = useState(() => {
    // Merge improved warmups: replace original ones with improved versions
    const warmupsMap = new Map(batchWarmup.map(ex => [ex.id, ex]));
    improvedWarmups.forEach(ex => warmupsMap.set(ex.id, ex));
    const mergedWarmups = Array.from(warmupsMap.values());

    return [...examples, ...batch1, ...batch2, ...batch3, ...mergedWarmups];
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("All");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentView, setCurrentView] = useState('exercises');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favoritesExercises');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const toggleFavorite = (exerciseId) => {
    const newFavorites = favorites.includes(exerciseId)
      ? favorites.filter(id => id !== exerciseId)
      : [...favorites, exerciseId];
    setFavorites(newFavorites);
    localStorage.setItem('favoritesExercises', JSON.stringify(newFavorites));
  };

  const themes = ["All", ...new Set(exercises.map(ex => ex.theme))];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTheme = selectedTheme === "All" || ex.theme === selectedTheme;
    const matchesFavorites = !showFavoritesOnly || favorites.includes(ex.id);
    return matchesSearch && matchesTheme && matchesFavorites;
  });

  return (
    <>
      <ParticleBackground />
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        <PageTransition>
          {currentView === 'exercises' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Bibliothèque d'Exercices Wattrelos FC</h1>
                <p className="text-slate-400 text-lg">Plus de {exercises.length} exercices adaptés pour les 10-11 ans.</p>
              </div>

              {/* Filters */}
              <div className="bg-slate-800/40 backdrop-blur-md p-4 rounded-2xl border border-slate-700/50 shadow-lg mb-8 sticky top-0 z-40">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un exercice, un tag..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <button
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border flex items-center gap-2 ${showFavoritesOnly
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white border-red-500 shadow-lg shadow-red-900/30'
                        : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-red-600/20 hover:text-white'
                        }`}
                    >
                      <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-white' : ''}`} />
                      Favoris {favorites.length > 0 && `(${favorites.length})`}
                    </button>
                    {themes.map(theme => (
                      <button
                        key={theme}
                        onClick={() => setSelectedTheme(theme)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${selectedTheme === theme
                          ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-emerald-500 shadow-lg shadow-emerald-900/30'
                          : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-red-600/20 hover:text-white'
                          }`}
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map(exercise => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onClick={() => setSelectedExercise(exercise)}
                    isFavorite={favorites.includes(exercise.id)}
                    onToggleFavorite={() => toggleFavorite(exercise.id)}
                  />
                ))}
              </div>

              {filteredExercises.length === 0 && (
                <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/30">
                  <p className="text-slate-400 text-lg">Aucun exercice trouvé pour cette recherche.</p>
                </div>
              )}

              {/* Detail Modal */}
              {selectedExercise && (
                <ExerciseDetail
                  exercise={selectedExercise}
                  onClose={() => setSelectedExercise(null)}
                />
              )}
            </>
          )}

          {currentView === 'statistics' && (
            <StatisticsPanel exercises={exercises} />
          )}

          {currentView === 'planner' && (
            <SessionPlanner exercises={exercises} />
          )}
        </PageTransition>
      </Layout>
    </>
  );
}

export default App;
