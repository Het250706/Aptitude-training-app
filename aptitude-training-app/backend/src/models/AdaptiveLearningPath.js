const db = require('../config/database');

class AdaptiveLearningPath {
    static async generatePath(userId, profile, skillGaps, learningStyle) {
        // Clear existing path
        await this.clearUserPath(userId);

        const nodes = [];
        let order = 1;

        // Analyze skill gaps to determine focus areas
        const criticalGaps = skillGaps.filter(g => g.priority === 'critical');
        const highGaps = skillGaps.filter(g => g.priority === 'high');
        const mediumGaps = skillGaps.filter(g => g.priority === 'medium');

        // Create foundation nodes for critical gaps
        for (const gap of criticalGaps) {
            const nodesForGap = await this.createNodesForSkillGap(gap, learningStyle, order);
            nodes.push(...nodesForGap);
            order += nodesForGap.length;
        }

        // Create nodes for high priority gaps
        for (const gap of highGaps) {
            const nodesForGap = await this.createNodesForSkillGap(gap, learningStyle, order, true);
            nodes.push(...nodesForGap);
            order += nodesForGap.length;
        }

        // Create nodes for medium priority gaps
        for (const gap of mediumGaps) {
            const nodesForGap = await this.createNodesForSkillGap(gap, learningStyle, order, true);
            nodes.push(...nodesForGap);
            order += nodesForGap.length;
        }

        // Add practice and assessment nodes
        const assessmentNode = await this.createAssessmentNode(order, learningStyle);
        nodes.push(assessmentNode);

        // Save nodes to database
        for (const node of nodes) {
            await this.saveNode(userId, node);
        }

        return nodes;
    }

    static async createNodesForSkillGap(gap, learningStyle, startOrder, isReinforcement = false) {
        const nodes = [];
        const skillName = gap.skill_category;
        const gapSize = gap.gap_score;

        // Determine number of lessons based on gap size
        const lessonCount = Math.min(5, Math.ceil(gapSize / 20));

        for (let i = 0; i < lessonCount; i++) {
            const difficulty = this.getDifficultyForLevel(gap.current_level, i, lessonCount);
            const node = {
                node_order: startOrder + i,
                node_type: 'lesson',
                title: `${skillName} - Level ${i + 1}`,
                description: this.generateLessonDescription(skillName, difficulty, i + 1),
                content: await this.generateLessonContent(skillName, difficulty, learningStyle),
                prerequisites: i > 0 ? [`${skillName}_level_${i}`] : [],
                estimated_duration: this.getEstimatedDuration(difficulty),
                difficulty_level: difficulty
            };
            nodes.push(node);
        }

        // Add practice node
        const practiceNode = {
            node_order: startOrder + lessonCount,
            node_type: 'practice',
            title: `${skillName} - Practice Session`,
            description: `Practice problems to reinforce ${skillName} concepts`,
            content: { exercise_count: 10, adaptive: true },
            prerequisites: [`${skillName}_level_${lessonCount}`],
            estimated_duration: 30,
            difficulty_level: gap.gap_score >= 50 ? 'intermediate' : 'beginner'
        };
        nodes.push(practiceNode);

        return nodes;
    }

    static async createAssessmentNode(order, learningStyle) {
        return {
            node_order: order,
            node_type: 'assessment',
            title: 'Comprehensive Assessment',
            description: 'Test your knowledge across all learned topics',
            content: {
                question_count: 20,
                adaptive: true,
                time_limit: 45
            },
            prerequisites: [],
            estimated_duration: 45,
            difficulty_level: 'mixed'
        };
    }

    static getDifficultyForLevel(currentLevel, lessonIndex, totalLessons) {
        const progress = lessonIndex / totalLessons;
        if (currentLevel < 30) return 'beginner';
        if (currentLevel < 60) return progress < 0.5 ? 'beginner' : 'intermediate';
        return progress < 0.3 ? 'beginner' : progress < 0.7 ? 'intermediate' : 'advanced';
    }

    static getEstimatedDuration(difficulty) {
        switch (difficulty) {
            case 'beginner': return 20;
            case 'intermediate': return 30;
            case 'advanced': return 45;
            default: return 25;
        }
    }

    static generateLessonDescription(skillName, difficulty, level) {
        const descriptions = {
            beginner: `Introduction to ${skillName} fundamentals`,
            intermediate: `Advanced concepts in ${skillName}`,
            advanced: `Expert-level ${skillName} problem solving`
        };
        return `${descriptions[difficulty]} - Part ${level}`;
    }

    static async generateLessonContent(skillName, difficulty, learningStyle) {
        // This would integrate with AI content generation
        // For now, return structured content template
        return {
            introduction: `Learn about ${skillName} at ${difficulty} level`,
            key_concepts: this.getKeyConcepts(skillName, difficulty),
            examples: this.getExamples(skillName, difficulty),
            practice: this.getPracticeQuestions(skillName, difficulty, learningStyle),
            summary: `Summary of ${skillName} ${difficulty} level concepts`
        };
    }

    static getKeyConcepts(skillName, difficulty) {
        const concepts = {
            'Quantitative Aptitude': {
                beginner: ['Number Systems', 'Basic Arithmetic', 'Percentages'],
                intermediate: ['Ratios & Proportions', 'Averages', 'Profit & Loss'],
                advanced: ['Time & Work', 'Speed & Distance', 'Probability']
            },
            'Logical Reasoning': {
                beginner: ['Pattern Recognition', 'Analogies', 'Classification'],
                intermediate: ['Blood Relations', 'Syllogisms', 'Coding-Decoding'],
                advanced: ['Logical Deductions', 'Critical Reasoning', 'Assumptions']
            },
            'Verbal Ability': {
                beginner: ['Vocabulary Basics', 'Sentence Completion', 'Error Detection'],
                intermediate: ['Reading Comprehension', 'Para-jumbles', 'Cloze Tests'],
                advanced: ['Critical Reading', 'Inference Questions', 'Abstract Reasoning']
            }
        };

        return concepts[skillName]?.[difficulty] || concepts['Quantitative Aptitude'][difficulty];
    }

    static getExamples(skillName, difficulty) {
        // Sample examples - would be expanded
        return [
            { question: `Sample ${skillName} ${difficulty} question 1`, solution: "Solution explanation" },
            { question: `Sample ${skillName} ${difficulty} question 2`, solution: "Solution explanation" }
        ];
    }

    static getPracticeQuestions(skillName, difficulty, learningStyle) {
        const questionCount = learningStyle.primary_style === 'kinesthetic' ? 15 : 10;
        return {
            count: questionCount,
            adaptive_difficulty: true,
            format: learningStyle.primary_style === 'visual' ? 'diagram-based' : 'standard'
        };
    }

    static async saveNode(userId, node) {
        const query = `
      INSERT INTO learning_path_nodes 
      (user_id, node_order, node_type, title, description, content, prerequisites, 
       estimated_duration, difficulty_level)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
        const values = [
            userId, node.node_order, node.node_type, node.title, node.description,
            JSON.stringify(node.content), node.prerequisites,
            node.estimated_duration, node.difficulty_level
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async clearUserPath(userId) {
        const query = 'DELETE FROM learning_path_nodes WHERE user_id = $1';
        await db.query(query, [userId]);
    }

    static async getUserPath(userId) {
        const query = `
      SELECT lpn.*, 
             COALESCE(ulp.progress_percentage, 0) as user_progress,
             COALESCE(ulp.is_mastered, false) as is_mastered
      FROM learning_path_nodes lpn
      LEFT JOIN user_learning_progress ulp ON lpn.id = ulp.node_id AND ulp.user_id = lpn.user_id
      WHERE lpn.user_id = $1
      ORDER BY lpn.node_order ASC
    `;
        const result = await db.query(query, [userId]);
        return result.rows.map(row => ({
            ...row,
            content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content
        }));
    }

    static async updateNodeProgress(userId, nodeId, progress, timeSpent) {
        const query = `
      INSERT INTO user_learning_progress 
      (user_id, node_id, progress_percentage, time_spent, last_accessed)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, node_id) 
      DO UPDATE SET 
        progress_percentage = EXCLUDED.progress_percentage,
        time_spent = user_learning_progress.time_spent + EXCLUDED.time_spent,
        last_accessed = CURRENT_TIMESTAMP
      RETURNING *
    `;
        const values = [userId, nodeId, progress, timeSpent];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async markNodeMastered(userId, nodeId, masteryScore) {
        const query = `
      UPDATE user_learning_progress 
      SET is_mastered = true, mastery_score = $1, last_accessed = CURRENT_TIMESTAMP
      WHERE user_id = $2 AND node_id = $3
      RETURNING *
    `;
        const values = [masteryScore, userId, nodeId];
        const result = await db.query(query, values);
        return result.rows[0];
    }
}

module.exports = AdaptiveLearningPath;