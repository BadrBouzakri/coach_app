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

  const SidebarFilters = (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Recherche</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Exercice, tag..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Favorites Toggle */}
      <button
        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2 ${showFavoritesOnly
          ? 'bg-red-600/20 text-red-400 border-red-500/50'
          : 'bg-slate-800/30 text-slate-400 border-slate-700 hover:bg-slate-800'
          }`}
      >
        <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
        Favoris uniquement
      </button>

      {/* Themes List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catégories</label>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{themes.length}</span>
        </div>
        <div className="space-y-1">
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => setSelectedTheme(theme)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group ${selectedTheme === theme
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <span>{theme}</span>
              {selectedTheme === theme && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <ParticleBackground />
      <Layout
        currentView={currentView}
        onViewChange={setCurrentView}
        sidebarContent={currentView === 'exercises' ? SidebarFilters : null}
      >
        <PageTransition>
          {currentView === 'exercises' && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1 drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-white to-red-500">Bibliothèque d'Exercices</h1>
                <p className="text-slate-400 text-sm">Plus de {exercises.length} exercices disponibles.</p>
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
