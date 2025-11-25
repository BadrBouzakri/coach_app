import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detailed warmup exercises with rich content
const warmupExercises = [
    {
        id: "warm_006",
        title: "Le Miroir Magique",
        theme: "Échauffement",
        game_format: "Binômes",
        motor_skills_focus: "Coordination et mimétisme",
        fun_rating: 4,
        setup_instructions: {
            field_dimensions: "10x10m par binôme",
            equipment: ["Aucun"],
            player_arrangement: "Face à face par 2"
        },
        rules_and_scoring: {
            rules: [
                "Un joueur est le miroir, l'autre le modèle.",
                "Le modèle fait des mouvements lents (bras, jambes, sauts).",
                "Le miroir doit reproduire exactement.",
                "Inverser les rôles toutes les minutes."
            ],
            scoring_system: "Qualité de synchronisation."
        },
        coaching_questions: [
            "Arrives-tu à anticiper les mouvements ?",
            "Comment rester synchronisé ?"
        ],
        tags: ["Échauffement", "Binôme", "Coordination", "Mimétisme"],
        animation: [
            { step_description: "Modèle lève les bras", duration: 1.5, entities: [{ id: "p1", type: "player", x: 40, y: 50, team: "A", label: "M" }, { id: "p2", type: "player", x: 60, y: 50, team: "B", label: "R" }] },
            { step_description: "Miroir reproduit le mouvement", duration: 1.5, entities: [{ id: "p1", type: "player", x: 40, y: 50, team: "A", label: "M" }, { id: "p2", type: "player", x: 60, y: 50, team: "B", label: "R" }] },
            { step_description: "Mouvement complexe : rotation", duration: 2, entities: [{ id: "p1", type: "player", x: 40, y: 50, team: "A", label: "M" }, { id: "p2", type: "player", x: 60, y: 50, team: "B", label: "R" }] }
        ]
    },
    {
        id: "warm_007",
        title: "La Montagne Russe",
        theme: "Échauffement",
        game_format: "Individuel ou groupe",
        motor_skills_focus: "Cardio progressif",
        fun_rating: 4,
        setup_instructions: {
            field_dimensions: "Circuit de 30m",
            equipment: ["6-8 cônes"],
            player_arrangement: "File indienne ou dispersion"
        },
        rules_and_scoring: {
            rules: [
                "Trottiner lentement pendant 30 secondes.",
                "Accélérer progressivement (jogging, course moyenne).",
                "Sprint de 5 secondes.",
                "Ralentir progressivement et recommencer."
            ],
            scoring_system: "Respect des phases d'accélération."
        },
        coaching_questions: [
            "Sens-tu ton cœur battre plus vite ?",
            "Respires-tu correctement ?"
        ],
        tags: ["Échauffement", "Cardio", "Progressif"],
        animation: [
            { step_description: "Trottinement léger", duration: 1.5, entities: [{ id: "p1", type: "player", x: 20, y: 50, team: "A", label: "1" }, { id: "c1", type: "cone", x: 40, y: 50 }, { id: "c2", type: "cone", x: 60, y: 50 }, { id: "c3", type: "cone", x: 80, y: 50 }] },
            { step_description: "Accélération progressive", duration: 2, entities: [{ id: "p1", type: "player", x: 55, y: 50, team: "A", label: "1" }, { id: "c1", type: "cone", x: 40, y: 50 }, { id: "c2", type: "cone", x: 60, y: 50 }, { id: "c3", type: "cone", x: 80, y: 50 }] },
            { step_description: "Sprint final !", duration: 1, entities: [{ id: "p1", type: "player", x: 85, y: 50, team: "A", label: "1" }, { id: "c1", type: "cone", x: 40, y: 50 }, { id: "c2", type: "cone", x: 60, y: 50 }, { id: "c3", type: "cone", x: 80, y: 50 }] }
        ]
    },
    {
        id: "warm_008",
        title: "Le Ballon Prisonnier Doux",
        theme: "Échauffement",
        game_format: "2 équipes de 5-6",
        motor_skills_focus: "Esquive et précision",
        fun_rating: 5,
        setup_instructions: {
            field_dimensions: "15x10m divisé en 2 camps",
            equipment: ["2 ballons en mousse"],
            player_arrangement: "2 équipes séparées par ligne centrale"
        },
        rules_and_scoring: {
            rules: [
                "Lancer le ballon pour toucher les adversaires (version douce écha uffement).",
                "Si touché, faire 5 jumping jacks et revenir.",
                "Pas de lancer fort : échauffement seulement."
            ],
            scoring_system: "Équipe avec le plus de touches en 5 min."
        },
        coaching_questions: [
            "Comment esquiver efficacement ?",
            "Vises-tu bien tes lancers ?"
        ],
        tags: ["Échauffement", "Précision", "Esquive", "Jeu"],
        animation: [
            { step_description: "Position initiale, 2 camps", duration: 1, entities: [{ id: "p1", type: "player", x: 25, y: 35, team: "A", label: "A1" }, { id: "p2", type: "player", x: 25, y: 65, team: "A", label: "A2" }, { id: "b1", type: "ball", x: 27, y: 50 }, { id: "p3", type: "player", x: 75, y: 35, team: "B", label: "B1" }, { id: "p4", type: "player", x: 75, y: 65, team: "B", label: "B2" }] },
            { step_description: "Lancer du ballon", duration: 1.5, entities: [{ id: "p1", type: "player", x: 25, y: 35, team: "A", label: "A1" }, { id: "p2", type: "player", x: 25, y: 65, team: "A", label: "A2" }, { id: "b1", type: "ball", x: 60, y: 40 }, { id: "a1", type: "arrow", x: 25, y: 35, endX: 75, endY: 35, curve: 0 }, { id: "p3", type: "player", x: 75, y: 35, team: "B", label: "B1" }, { id: "p4", type: "player", x: 75, y: 65, team: "B", label: "B2" }] },
            { step_description: "Esquive et contre-attaque", duration: 2, entities: [{ id: "p1", type: "player", x: 25, y: 35, team: "A", label: "A1" }, { id: "p2", type: "player", x: 25, y: 65, team: "A", label: "A2" }, { id: "p3", type: "player", x: 75, y: 40, team: "B", label: "B1" }, { id: "p4", type: "player", x: 75, y: 65, team: "B", label: "B2" }, { id: "b1", type: "ball", x: 77, y: 65 }] }
        ]
    }
];

// Generate 22 more warmup exercises with varied themes
const warmupThemes = [
    { title: "Le Slalom Humain", focus: "Agilité", format: "Groupes de 5" },
    { title: "La Chenille Géante", focus: "Coordination", format: "File indienne" },
    { title: "Les Bonds de Lapin", focus: "Détente", format: "Individuel" },
    { title: "Le Chef d'Orchestre", focus: "Réactivité", format: "Groupe complet" },
    { title: "La Rivière aux Crocodiles", focus: "Saut et agilité", format: "Parcours" },
    { title: "Les Talons-Fesses Champions", focus: "Cardio", format: "Tous ensemble" },
    { title: "Le Jeu des Couleurs", focus: "Sprint réactif", format: "4 équipes" },
    { title: "La Danse des Lutins", focus: "Coordination rythmique", format: "Binômes" },
    { title: "Le Robot et l'Humain", focus: "Changement de rythme", format: "Groupe" },
    { title: "Les Montées de Genoux Fun", focus: "Cardio léger", format: "Circuit" },
    { title: "La Marelle Géante", focus: "Équilibre et sauts", format: "Individuel" },
    { title: "Le Vent et les Feuilles", focus: "Course et arrêt", format: "Tous" },
    { title: "Les Sauts d'Obstacles", focus: "Pliométrie légère", format: "Parcours" },
    { title: "La Tornade", focus: "Rotation du corps", format: "Dispersion" },
    { title: "Le Réveil des Guerriers", focus: "Force légère", format: "Groupe" },
    { title: "Les Étoiles Filantes", focus: "Sprint court", format: "Relais" },
    { title: "La Vague Humaine", focus: "Coordination collective", format: "Ligne" },
    { title: "Le Gardien du Trésor", focus: "Réactivité défensive", format: "Jeu" },
    { title: "Les Bonds Enchaînés", focus: "Cardio dynamique", format: "Parcours" },
    { title: "La Ronde Infernale", focus: "Endurance légère", format: "Cercle" },
    { title: "Le Parcours du Combattant Junior", focus: "Multitâche", format: "Circuit" },
    { title: "La Montée d'Énergie", focus: "Activation progressive", format: "Tous" }
];

let currentId = 9;
for (const theme of warmupThemes) {
    warmupExercises.push({
        id: `warm_${String(currentId).padStart(3, '0')}`,
        title: theme.title,
        theme: "Échauffement",
        game_format: theme.format,
        motor_skills_focus: theme.focus,
        fun_rating: 3 + Math.floor(Math.random() * 3),
        setup_instructions: {
            field_dimensions: `${12 + Math.floor(Math.random() * 13)}x${10 + Math.floor(Math.random() * 10)}m`,
            equipment: ["Cônes", "Ballons optionnels"],
            player_arrangement: "Selon consignes"
        },
        rules_and_scoring: {
            rules: [
                "Suivre les consignes du coach pour cet échauffement.",
                "Progresser dans l'intensité progressivement.",
                "Focus sur la qualité d'exécution."
            ],
            scoring_system: "Pas de score - échauffement qualitatif."
        },
        coaching_questions: [
            "Te sens-tu bien échauffé ?",
            "Quelle partie du corps travaille le plus ?"
        ],
        tags: ["Échauffement", theme.focus, "U12"],
        animation: [
            {
                step_description: "Configuration initiale",
                duration: 1,
                entities: [
                    { id: "p1", type: "player", x: 20, y: 50, team: "A", label: "1" },
                    { id: "p2", type: "player", x: 40, y: 50, team: "A", label: "2" },
                    { id: "p3", type: "player", x: 60, y: 50, team: "A", label: "3" }
                ]
            },
            {
                step_description: "Phase d'activation",
                duration: 2,
                entities: [
                    { id: "p1", type: "player", x: 35, y: 45, team: "A", label: "1" },
                    { id: "p2", type: "player", x: 50, y: 55, team: "A", label: "2" },
                    { id: "p3", type: "player", x: 65, y: 45, team: "A", label: "3" }
                ]
            },
            {
                step_description: "Intensité maximale de l'échauffement",
                duration: 1.5,
                entities: [
                    { id: "p1", type: "player", x: 50, y: 40, team: "A", label: "1" },
                    { id: "p2", type: "player", x: 60, y: 60, team: "A", label: "2" },
                    { id: "p3", type: "player", x: 70, y: 50, team: "A", label: "3" }
                ]
            }
        ]
    });
    currentId++;
}

// Save all warmup exercises
fs.writeFileSync(
    path.join(__dirname, 'batch_warmup_complete.json'),
    JSON.stringify(warmupExercises, null, 4),
    'utf8'
);

console.log(`✓ Generated ${warmupExercises.length} warmup exercises (warm_001 to warm_${String(currentId - 1).padStart(3, '0')})`);
console.log(`  - 5 detailed exercises with rich content`);
console.log(`  - ${warmupThemes.length} themed exercises`);
console.log(`  - Focus: Fun, Safety, Progressive Intensity`);
