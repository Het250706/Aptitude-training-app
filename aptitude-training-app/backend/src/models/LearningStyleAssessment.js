const db = require('../config/database');

class LearningStyleAssessment {
    static async create(userId, scores) {
        const { visual, auditory, reading, kinesthetic } = scores;

        // Determine primary and secondary learning styles
        const styleScores = [
            { name: 'visual', score: visual },
            { name: 'auditory', score: auditory },
            { name: 'reading', score: reading },
            { name: 'kinesthetic', score: kinesthetic }
        ];
        styleScores.sort((a, b) => b.score - a.score);

        const primaryStyle = styleScores[0].name;
        const secondaryStyle = styleScores[1].name;

        const query = `
      INSERT INTO learning_style_assessments 
      (user_id, visual_score, auditory_score, reading_score, kinesthetic_score, primary_style, secondary_style)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        visual_score = EXCLUDED.visual_score,
        auditory_score = EXCLUDED.auditory_score,
        reading_score = EXCLUDED.reading_score,
        kinesthetic_score = EXCLUDED.kinesthetic_score,
        primary_style = EXCLUDED.primary_style,
        secondary_style = EXCLUDED.secondary_style,
        assessment_date = CURRENT_TIMESTAMP
      RETURNING *
    `;

        const values = [userId, visual, auditory, reading, kinesthetic, primaryStyle, secondaryStyle];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM learning_style_assessments WHERE user_id = $1';
        const result = await db.query(query, [userId]);
        return result.rows[0];
    }

    static getVARKQuestions() {
        return [
            {
                id: 1,
                text: "When learning something new, I prefer to:",
                options: [
                    { text: "Watch a video or see diagrams", style: "visual" },
                    { text: "Listen to an explanation", style: "auditory" },
                    { text: "Read written instructions", style: "reading" },
                    { text: "Try it hands-on", style: "kinesthetic" }
                ]
            },
            {
                id: 2,
                text: "I remember information best when:",
                options: [
                    { text: "I see charts and graphs", style: "visual" },
                    { text: "I hear it explained", style: "auditory" },
                    { text: "I read about it", style: "reading" },
                    { text: "I practice it myself", style: "kinesthetic" }
                ]
            },
            {
                id: 3,
                text: "When solving problems, I tend to:",
                options: [
                    { text: "Draw or visualize solutions", style: "visual" },
                    { text: "Talk through the problem", style: "auditory" },
                    { text: "Write down steps", style: "reading" },
                    { text: "Use trial and error", style: "kinesthetic" }
                ]
            },
            {
                id: 4,
                text: "In a study group, I prefer:",
                options: [
                    { text: "Watching demonstrations", style: "visual" },
                    { text: "Participating in discussions", style: "auditory" },
                    { text: "Reading materials together", style: "reading" },
                    { text: "Doing practice exercises", style: "kinesthetic" }
                ]
            },
            {
                id: 5,
                text: "When using software, I prefer:",
                options: [
                    { text: "Visual tutorials", style: "visual" },
                    { text: "Audio instructions", style: "auditory" },
                    { text: "Written documentation", style: "reading" },
                    { text: "Interactive demos", style: "kinesthetic" }
                ]
            }
        ];
    }
}

module.exports = LearningStyleAssessment;