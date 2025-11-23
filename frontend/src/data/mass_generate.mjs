import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Exercise templates for rapid generation
const templates = {
    warmup: {
        themes: ['Coordination', 'Vitesse', 'Agilité', 'Endurance'],
        formats: ['Individuel', 'Binômes', 'Groupes de 4', 'Équipes de 5-6'],
        focus: ['Coordination', 'Vitesse', 'Agilité', 'Réactivité']
    },
    technique: {
        themes: ['Dribble', 'Passes', 'Contrôle', 'Tirs'],
        formats: ['Individuel', '2v2', '3v3', 'Circuit'],
        focus: ['Technique individuelle', 'Précision', 'Conduite', 'Frappe']
    },
    tactical: {
        themes: ['Tactique', 'Jeu collectif', 'Transition', 'Pressing'],
        formats: ['4v4', '5v5', '3v2', '4v3'],
        focus: ['Vision de jeu', 'Déplacements', 'Pressing', 'Couverture']
    }
};

const titles = [
    "L'Étoile Filante", "Le Tornado", "La Fusée", "Le Papillon", "L'Éclair",
    "Le Tourbillon", "La Comète", "Le Météore", "L'Ouragan", "Le Cyclone",
    "La Vague", "Le Tsunami", "L'Avalanche", "Le Volcan", "Le Séisme",
    "Le Phénix", "Le Dragon", "Le Tigre", "Le Guépard", "Le Faucon",
    "L'Aigle", "Le Serpent", "Le Renard", "Le Loup", "Le Lion",
    "La Panthère", "Le Puma", "Le Jaguar", "Le Lynx", "Le Cobra",
    "Le Maestro", "Le Virtuose", "L'Artiste", "Le Magicien", "Le Génie",
    "Le Champion", "Le Prodige", "La Légende", "Le Héros", "Le Titan",
    "L'Olympien", "Le Gladiateur", "Le Spartiate", "Le Samouraï", "Le Ninja",
    "Le Chevalier", "Le Guerrier", "Le Viking", "Le Conquérant", "L'Invincible",
    "Le Labyrinthe Avancé", "La Forteresse", "Le Bunker", "La Citadelle", "Le Donjon",
    "L'Arène", "Le Colisée", "Le Stade", "Le Ring", "La Piste", "Le Circuit"
];

function generateExercise(id, category) {
    const template = templates[category];
    const theme = template.themes[Math.floor(Math.random() * template.themes.length)];
    const format = template.formats[Math.floor(Math.random() * template.formats.length)];
    const focus = template.focus[Math.floor(Math.random() * template.focus.length)];
    const title = titles[id % titles.length] + ` ${category === 'warmup' ? 'Express' : category === 'technique' ? 'Pro' : 'Tactique'}`;

    return {
        id: `ex_${String(id).padStart(3, '0')}`,
        title: title,
        theme: theme,
        game_format: format,
        motor_skills_focus: focus,
        fun_rating: 3 + Math.floor(Math.random() * 3),
        setup_instructions: {
            field_dimensions: `${15 + Math.floor(Math.random() * 20)}x${10 + Math.floor(Math.random() * 15)}m`,
            equipment: ["Cônes", "Ballons", "Chasuble si besoin"],
            player_arrangement: "Selon effectif disponible"
        },
        rules_and_scoring: {
            rules: [
                "Suivre les consignes de l'entraîneur.",
                "Respecter les limites du terrain.",
                "Jouer en sécurité."
            ],
            scoring_system: "Points selon performance individuelle ou collective."
        },
        coaching_questions: [
            "Comment optimiser ton mouvement ?",
            "Quelle décision prendre dans cette situation ?"
        ],
        tags: [theme, focus, "U12"],
        animation: [
            {
                step_description: "Configuration initiale",
                duration: 1,
                entities: [
                    { id: "p1", type: "player", x: 20, y: 50, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 22, y: 50 },
                    { id: "c1", type: "cone", x: 50, y: 50 },
                    { id: "c2", type: "cone", x: 80, y: 50 }
                ]
            },
            {
                step_description: "Phase d'exécution",
                duration: 2 + Math.random(),
                entities: [
                    { id: "p1", type: "player", x: 50, y: 48, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 52, y: 48 },
                    { id: "c1", type: "cone", x: 50, y: 50 },
                    { id: "c2", type: "cone", x: 80, y: 50 }
                ]
            },
            {
                step_description: "Finalisation",
                duration: 1.5,
                entities: [
                    { id: "p1", type: "player", x: 80, y: 50, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 82, y: 50 },
                    { id: "c1", type: "cone", x: 50, y: 50 },
                    { id: "c2", type: "cone", x: 80, y: 50 }
                ]
            }
        ]
    };
}

// Generate exercises
const allExercises = [];
let currentId = 53;

// Warmup batch (20 exercises)
for (let i = 0; i < 20; i++) {
    allExercises.push(generateExercise(currentId++, 'warmup'));
}

// Technique batch (20 exercises)
for (let i = 0; i < 20; i++) {
    allExercises.push(generateExercise(currentId++, 'technique'));
}

// Tactical batch (20 exercises)
for (let i = 0; i < 20; i++) {
    allExercises.push(generateExercise(currentId++, 'tactical'));
}

// Save to file
fs.writeFileSync(
    path.join(__dirname, 'batch3_generated.json'),
    JSON.stringify(allExercises, null, 4),
    'utf8'
);

console.log(`✓ Generated ${allExercises.length} exercises (ex_053 to ex_${String(currentId - 1).padStart(3, '0')})`);
console.log(`  - Warmup: 20 exercises`);
console.log(`  - Technique: 20 exercises`);
console.log(`  - Tactical: 20 exercises`);
