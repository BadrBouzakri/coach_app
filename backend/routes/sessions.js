const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Session = require('../models/Session');

// Expanded exercises data for better generation
// TODO: In production, query Exercise model from DB
const exercisesData = [
    // Échauffement
    { id: 'warmup_01', title: 'Jogging \u0026 Étirements Dynamiques', theme: 'Échauffement', tags: ['warmup', 'mobility'], playerMin: 5, playerMax: 25, duration: 10 },
    { id: 'warmup_02', title: 'Jeu du Béret', theme: 'Échauffement', tags: ['warmup', 'game', 'reaction'], playerMin: 8, playerMax: 20, duration: 12 },
    { id: 'warmup_03', title: 'Passes en Mouvement', theme: 'Échauffement', tags: ['warmup', 'passes', 'technique'], playerMin: 6, playerMax: 16, duration: 10 },
    { id: 'warmup_04', title: 'Conduite Ballon + Slalom', theme: 'Échauffement', tags: ['warmup', 'dribble', 'control'], playerMin: 6, playerMax: 20, duration: 8 },

    // Technique
    { id: 'tech_01', title: 'Contrôle Orienté (4 directions)', theme: 'Technique', tags: ['technique', 'control', 'Contrôle orienté'], playerMin: 6, playerMax: 16, duration: 15 },
    { id: 'tech_02', title: 'Passes Courtes \u0026 Appui-Soutien', theme: 'Technique', tags: ['technique', 'passes', 'Passes'], playerMin: 8, playerMax: 18, duration: 15 },
    { id: 'tech_03', title: 'Dribbles 1v1 + Feintes', theme: 'Technique', tags: ['technique', 'dribble', 'Dribbles', '1v1'], playerMin: 6, playerMax: 14, duration: 18 },
    { id: 'tech_04', title: 'Finition Devant le But', theme: 'Technique', tags: ['technique', 'shooting', 'Finition'], playerMin: 8, playerMax: 16, duration: 20 },
    { id: 'tech_05', title: 'Centres \u0026 Reprises de Volée', theme: 'Technique', tags: ['technique', 'crosses', 'shooting'], playerMin: 10, playerMax: 18, duration: 18 },
    { id: 'tech_06', title: 'Jeu de Tête', theme: 'Technique', tags: ['technique', 'heading'], playerMin: 8, playerMax: 16, duration: 15 },

    // Tactique
    { id: 'tact_01', title: 'Triangle Offensif', theme: 'Tactique', tags: ['tactique', 'Triangle', 'passes', 'movement'], playerMin: 9, playerMax: 15, duration: 20 },
    { id: 'tact_02', title: 'Occupation des Espaces', theme: 'Tactique', tags: ['tactique', 'Occupation espace', 'positioning'], playerMin: 10, playerMax: 18, duration: 20 },
    { id: 'tact_03', title: 'Pressing \u0026 Défense de Zone', theme: 'Tactique', tags: ['tactique', 'Défense', 'pressing'], playerMin: 10, playerMax: 18, duration: 22 },
    { id: 'tact_04', title: 'Transition Défense-Attaque', theme: 'Tactique', tags: ['tactique', 'transition', 'Vitesse'], playerMin: 12, playerMax: 20, duration: 20 },
    { id: 'tact_05', title: 'Conservation de Balle', theme: 'Tactique', tags: ['tactique', 'possession', 'Passes'], playerMin: 10, playerMax: 16, duration: 18 },

    // Coordination \u0026 Physique
    { id: 'coord_01', title: 'Parcours Coordination', theme: 'Coordination', tags: ['coordination', 'Coordination', 'agility'], playerMin: 6, playerMax: 20, duration: 15 },
    { id: 'coord_02', title: 'Échelle de Rythme', theme: 'Coordination', tags: ['coordination', 'Coordination', 'footwork'], playerMin: 6, playerMax: 20, duration: 12 },
    { id: 'phys_01', title: 'Sprints Répétés + Récup Active', theme: 'Physique', tags: ['physique', 'Vitesse', 'endurance'], playerMin: 8, playerMax: 20, duration: 15 },

    // Matchs \u0026 Jeux
    { id: 'match_01', title: 'Match Libre 8v8', theme: 'Match', tags: ['match', 'game', 'competition'], playerMin: 14, playerMax: 20, duration: 20 },
    { id: 'match_02', title: 'Match à Thème (Touches uniquement)', theme: 'Match', tags: ['match', 'game', 'theme'], playerMin: 10, playerMax: 18, duration: 15 },
    { id: 'match_03', title: 'Tournoi 4v4 (Terrains Réduits)', theme: 'Match', tags: ['match', 'game', 'small-sided'], playerMin: 12, playerMax: 20, duration: 25 },
    { id: 'retour_calme_01', title: 'Retour au Calme \u0026 Étirements', theme: 'Retour Calme', tags: ['cooldown', 'stretching'], playerMin: 5, playerMax: 25, duration: 8 }
];
// Note: Data should be loaded from Exercise DB in production

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: sessions.length, data: sessions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Get single session
// @route   GET /api/sessions/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: session });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Create new session
// @route   POST /api/sessions
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        req.body.user = req.user.id;
        const session = await Session.create(req.body);
        res.status(201).json({ success: true, data: session });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

router.post('/generate', protect, async (req, res) => {
    try {
        console.log("Generating session with:", req.body);
        const { objectives, duration, playersCount, weather, fieldType } = req.body;

        // 1. Define Adaptive Structure based on duration and weather
        let warmupPercent = 0.15, mainPercent = 0.65, cooldownPercent = 0.10, matchPercent = 0.10;

        if (weather === 'Très chaud' || weather === 'Pluvieux') {
            // Reduce intensity, add more breaks
            warmupPercent = 0.18;
            mainPercent = 0.58;
            cooldownPercent = 0.14;
            matchPercent = 0.10;
        }

        if (fieldType === 'Salle/Gymnase') {
            // Indoor = more technical, less match
            mainPercent = 0.70;
            matchPercent = 0.05;
        }

        const warmupDuration = Math.round(duration * warmupPercent);
        const mainDuration = Math.round(duration * mainPercent);
        const cooldownDuration = Math.round(duration * cooldownPercent);
        const matchDuration = Math.round(duration * matchPercent);

        const generatedExercises = [];
        let currentOrder = 1;

        // Helper: Smart exercise finder
        const findExercises = (theme, count, maxDuration, preferredTags = []) => {
            let candidates = exercisesData.filter(ex => {
                const themeMatch = ex.theme.toLowerCase().includes(theme.toLowerCase()) ||
                    (ex.tags && ex.tags.some(t => t.toLowerCase().includes(theme.toLowerCase())));
                const playerMatch = (!ex.playerMin || playersCount >= ex.playerMin) &&
                    (!ex.playerMax || playersCount <= ex.playerMax);
                return themeMatch && playerMatch;
            });

            // Prioritize by objectives
            if (objectives && objectives.length > 0) {
                const scored = candidates.map(ex => {
                    let score = 0;
                    objectives.forEach(obj => {
                        if (ex.tags && ex.tags.some(t => t.toLowerCase().includes(obj.toLowerCase()))) {
                            score += 10;
                        }
                        if (ex.title.toLowerCase().includes(obj.toLowerCase())) {
                            score += 5;
                        }
                    });
                    return { ...ex, score };
                });
                scored.sort((a, b) => b.score - a.score);
                candidates = scored.map(item => {
                    const { score, ...ex } = item;
                    return ex;
                });
            } else {
                // Randomize if no objectives
                candidates = candidates.sort(() => 0.5 - Math.random());
            }

            return candidates.slice(0, count);
        };

        // 2. Warmup
        const warmups = findExercises('Échauffement', 2, warmupDuration);
        if (warmups.length === 0) warmups.push({ id: 'warmup_generic', title: 'Échauffement Général', duration: 10 });

        warmups.forEach(ex => {
            generatedExercises.push({
                exercise: ex.id,
                title: ex.title,
                duration: Math.round(warmupDuration / warmups.length),
                order: currentOrder++,
                notes: 'Mobilité articulaire et activation cardio-vasculaire.'
            });
        });

        // 3. Main Part - Prioritize objectives
        const mainThemes = (objectives && Array.isArray(objectives) && objectives.length > 0) ? objectives : ['Technique', 'Tactique'];
        const exercisesPerTheme = Math.ceil(mainDuration / (mainThemes.length * 18)); // ~18min per ex

        mainThemes.forEach(theme => {
            const themeExercises = findExercises(theme, exercisesPerTheme, mainDuration / mainThemes.length);

            themeExercises.forEach(ex => {
                let notes = 'Focus sur l\'exécution et l\'intensité.';

                if (playersCount < 10) notes = 'Petit groupe : travail individualisé prioritaire.';
                else if (playersCount > 16) notes = 'Grand groupe : privilégier les ateliers rotatifs.';

                if (weather === 'Pluvieux') notes += ' Attention sols glissants.';
                if (weather === 'Très chaud') notes += ' Hydratation régulière.';

                generatedExercises.push({
                    exercise: ex.id,
                    title: ex.title,
                    duration: ex.duration || Math.round((mainDuration / mainThemes.length) / themeExercises.length),
                    order: currentOrder++,
                    notes
                });
            });
        });

        // 4. Cooldown
        const cooldowns = findExercises('Retour Calme', 1, cooldownDuration);
        if (cooldowns.length > 0) {
            generatedExercises.push({
                exercise: cooldowns[0].id,
                title: cooldowns[0].title,
                duration: cooldownDuration,
                order: currentOrder++,
                notes: 'Étirements passifs et feedback collectif.'
            });
        }

        // 5. Match/Game
        if (matchDuration > 5) {
            const matches = findExercises('Match', 1, matchDuration);
            const matchEx = matches.length > 0 ? matches[0] : {
                id: 'match_generic',
                title: playersCount < 12 ? 'Mini-Match 5v5' : 'Match 8v8',
                duration: matchDuration
            };

            generatedExercises.push({
                exercise: matchEx.id,
                title: matchEx.title,
                duration: matchDuration,
                order: currentOrder++,
                notes: 'Application libre des apprentissages. Observation coach.'
            });
        }

        // 6. Contextual Recommendations
        let recommendations = [];

        if (weather === 'Pluvieux') {
            recommendations.push('⚠️ Météo pluvieuse : Prévoir équipement de pluie, réduire durée si fort orage.');
        }
        if (weather === 'Très chaud') {
            recommendations.push('☀️ Forte chaleur : Pauses hydratation toutes les 15min OBLIGATOIRES. Prévoir zones d\'ombre.');
        }
        if (fieldType === 'Salle/Gymnase') {
            recommendations.push('🏠 Indoor : Ballon futsal recommandé. Privilégier jeu au sol et technique.');
        }
        if (playersCount < 10) {
            recommendations.push('👥 Petit effectif : Exercices individualisés et duels recommandés.');
        }
        if (playersCount > 18) {
            recommendations.push('👥 Grand effectif : Utiliser système d\'ateliers rotatifs pour maximiser temps de jeu.');
        }
        if (duration > 90) {
            recommendations.push('⏱️ Séance longue : Prévoir 2 pauses hydratation de 3-5min.');
        }

        const sessionData = {
            title: `Séance ${objectives && objectives.length > 0 ? objectives.join(' + ') : 'Générale'} - ${new Date().toLocaleDateString()}`,
            duration,
            objectives,
            weather,
            fieldType,
            exercises: generatedExercises,
            notes: recommendations.join(' ')
        };

        res.status(200).json({ success: true, data: sessionData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

// @desc    Update session
// @route   PUT /api/sessions/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        session = await Session.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: session });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// @desc    Delete session
// @route   DELETE /api/sessions/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ success: false, error: 'Session not found' });
        }

        if (session.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await session.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});

module.exports = router;
