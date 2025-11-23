const fs = require('fs');
const path = require('path');

// Generate 10 rapid exercises
const exercises = [];

for (let i = 43; i <= 52; i++) {
    const themes = ['Dribble', 'Passes', 'Coordination', 'Vitesse', 'Endurance', 'Tirs', 'Tactique'];
    const theme = themes[i % themes.length];

    exercises.push({
        id: `ex_0${i}`,
        title: `Exercice Accéléré ${i}`,
        theme: theme,
        game_format: i % 2 === 0 ? "Équipes de 4-5" : "Individuel",
        motor_skills_focus: theme === 'Dribble' ? 'Conduite de balle' : theme === 'Passes' ? 'Précision' : 'Coordination',
        fun_rating: 3 + (i % 3),
        setup_instructions: {
            field_dimensions: "20x15m",
            equipment: ["Cônes", "Ballons"],
            player_arrangement: "Selon effectif"
        },
        rules_and_scoring: {
            rules: [
                "Suivre les consignes du coach.",
                "Respecter les zones délimitées."
            ],
            scoring_system: "Points selon performance."
        },
        coaching_questions: [
            "Comment améliorer ta technique ?",
            "Quelle stratégie adopter ?"
        ],
        tags: [theme, "U12", "Entraînement"],
        animation: [
            {
                step_description: "Position initiale",
                duration: 1,
                entities: [
                    { id: "p1", type: "player", x: 20, y: 50, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 22, y: 50 },
                    { id: "c1", type: "cone", x: 50, y: 50 }
                ]
            },
            {
                step_description: "Action en cours",
                duration: 2,
                entities: [
                    { id: "p1", type: "player", x: 50, y: 48, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 52, y: 48 },
                    { id: "c1", type: "cone", x: 50, y: 50 }
                ]
            },
            {
                step_description: "Finalisation",
                duration: 1.5,
                entities: [
                    { id: "p1", type: "player", x: 80, y: 50, team: "A", label: "1" },
                    { id: "b1", type: "ball", x: 82, y: 50 },
                    { id: "c1", type: "cone", x: 50, y: 50 }
                ]
            }
        ]
    });
}

fs.writeFileSync(
    path.join(__dirname, 'batch2_part7.json'),
    JSON.stringify(exercises, null, 4),
    'utf8'
);

console.log(`✓ Generated ${exercises.length} exercises (ex_043 to ex_052)`);
