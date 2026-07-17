const db = require('../config/database');

class LearningPath {
    static async create(userId, learningPathData) {
        const query = `
      INSERT INTO learning_paths (user_id, modules, current_module_index, progress_percentage, data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const values = [
            userId,
            JSON.stringify(learningPathData.modules),
            0,
            0,
            JSON.stringify(learningPathData)
        ];
        const result = await db.query(query, values);
        return result.rows[0];
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM learning_paths WHERE user_id = $1 ORDER BY started_at DESC LIMIT 1';
        const result = await db.query(query, [userId]);
        if (result.rows.length === 0) return null;

        const path = result.rows[0];
        path.modules = typeof path.modules === 'string' ? JSON.parse(path.modules) : path.modules;
        path.data = path.data ? (typeof path.data === 'string' ? JSON.parse(path.data) : path.data) : null;

        return path;
    }

    static async updateProgress(userId, moduleId, progress, timeSpent) {
        // First get current learning path
        const currentPath = await this.findByUserId(userId);
        if (!currentPath) return null;

        // Update modules progress
        let modules = currentPath.modules;
        let moduleIndex = modules.findIndex(m => m.id === moduleId);

        if (moduleIndex !== -1) {
            modules[moduleIndex].progress = progress;
            modules[moduleIndex].timeSpent = (modules[moduleIndex].timeSpent || 0) + timeSpent;

            // Calculate overall progress
            const totalProgress = modules.reduce((sum, m) => sum + (m.progress || 0), 0) / modules.length;

            const query = `
        UPDATE learning_paths 
        SET modules = $1, progress_percentage = $2, last_accessed = CURRENT_TIMESTAMP
        WHERE user_id = $3
        RETURNING *
      `;
            const values = [JSON.stringify(modules), Math.round(totalProgress), userId];
            const result = await db.query(query, values);

            if (result.rows[0]) {
                result.rows[0].modules = JSON.parse(result.rows[0].modules);
            }
            return result.rows[0];
        }

        return currentPath;
    }

    static async completeModule(userId, moduleId) {
        const currentPath = await this.findByUserId(userId);
        if (!currentPath) return null;

        let modules = currentPath.modules;
        let moduleIndex = modules.findIndex(m => m.id === moduleId);

        if (moduleIndex !== -1) {
            modules[moduleIndex].progress = 100;
            modules[moduleIndex].completed = true;
            modules[moduleIndex].completedAt = new Date();

            // Move to next module if current index is less than module index
            const nextIndex = Math.max(currentPath.current_module_index, moduleIndex + 1);

            const query = `
        UPDATE learning_paths 
        SET modules = $1, current_module_index = $2, progress_percentage = $3, last_accessed = CURRENT_TIMESTAMP
        WHERE user_id = $4
        RETURNING *
      `;
            const totalProgress = modules.reduce((sum, m) => sum + (m.progress || 0), 0) / modules.length;
            const values = [JSON.stringify(modules), nextIndex, Math.round(totalProgress), userId];
            const result = await db.query(query, values);

            if (result.rows[0]) {
                result.rows[0].modules = JSON.parse(result.rows[0].modules);
            }
            return result.rows[0];
        }

        return currentPath;
    }

    static async updateCurrentModule(userId, moduleIndex) {
        const query = `
      UPDATE learning_paths 
      SET current_module_index = $1, last_accessed = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING *
    `;
        const result = await db.query(query, [moduleIndex, userId]);
        if (result.rows[0]) {
            result.rows[0].modules = typeof result.rows[0].modules === 'string'
                ? JSON.parse(result.rows[0].modules)
                : result.rows[0].modules;
        }
        return result.rows[0];
    }

    static async getProgress(userId) {
        const query = `
      SELECT progress_percentage, current_module_index, modules, started_at, last_accessed
      FROM learning_paths 
      WHERE user_id = $1 
      ORDER BY started_at DESC 
      LIMIT 1
    `;
        const result = await db.query(query, [userId]);
        if (result.rows[0]) {
            const row = result.rows[0];
            row.modules = typeof row.modules === 'string' ? JSON.parse(row.modules) : row.modules;
            return row;
        }
        return null;
    }
}

module.exports = LearningPath;