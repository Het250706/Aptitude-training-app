const db = require('../config/database');

class UserProfile {
    static async create({
        userId,
        fieldOfExpertise,
        educationLevel,
        jobTitle,
        yearsOfExperience,
        targetAptitudeAreas,
        learningStyle,
        weeklyHoursAvailable,
        preferredDifficultyLevel
    }) {
        const query = `
      INSERT INTO user_profiles (
        user_id, 
        field_of_expertise, 
        education_level, 
        job_title,
        years_of_experience, 
        target_aptitude_areas, 
        learning_style,
        weekly_hours_available, 
        preferred_difficulty_level
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

        // Ensure targetAptitudeAreas is a native array of strings (for TEXT[] column)
        let targetAreasArray = null;
        if (targetAptitudeAreas) {
            if (Array.isArray(targetAptitudeAreas)) {
                targetAreasArray = targetAptitudeAreas;
            } else if (typeof targetAptitudeAreas === 'string') {
                try {
                    const parsed = JSON.parse(targetAptitudeAreas);
                    if (Array.isArray(parsed)) {
                        targetAreasArray = parsed;
                    } else {
                        targetAreasArray = [targetAptitudeAreas];
                    }
                } catch (e) {
                    targetAreasArray = [targetAptitudeAreas];
                }
            } else {
                targetAreasArray = [String(targetAptitudeAreas)];
            }
        }

        const values = [
            userId,
            fieldOfExpertise || null,
            educationLevel || null,
            jobTitle || null,
            yearsOfExperience ? parseInt(yearsOfExperience) : null,
            targetAreasArray,
            learningStyle || null,
            weeklyHoursAvailable || null,
            preferredDifficultyLevel || null
        ];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user profile:', error);
            console.error('Values being inserted:', values);
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async findByUserId(userId) {
        const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
        try {
            const result = await db.query(query, [userId]);
            if (result.rows[0]) {
                const profile = result.rows[0];
                // Parse JSONB fields back to JavaScript objects
                if (profile.target_aptitude_areas) {
                    try {
                        profile.target_aptitude_areas = typeof profile.target_aptitude_areas === 'string'
                            ? JSON.parse(profile.target_aptitude_areas)
                            : profile.target_aptitude_areas;
                    } catch (e) {
                        profile.target_aptitude_areas = [];
                    }
                }
                if (profile.diagnostic_results && typeof profile.diagnostic_results === 'string') {
                    try {
                        profile.diagnostic_results = JSON.parse(profile.diagnostic_results);
                    } catch (e) {
                        profile.diagnostic_results = null;
                    }
                }
                return profile;
            }
            return null;
        } catch (error) {
            console.error('Error finding user profile:', error);
            return null;
        }
    }

    static async update(userId, profileData) {
        const fields = [];
        const values = [];
        let paramCounter = 1;

        if (profileData.fieldOfExpertise !== undefined && profileData.fieldOfExpertise !== null) {
            fields.push(`field_of_expertise = $${paramCounter++}`);
            values.push(profileData.fieldOfExpertise);
        }
        if (profileData.educationLevel !== undefined && profileData.educationLevel !== null) {
            fields.push(`education_level = $${paramCounter++}`);
            values.push(profileData.educationLevel);
        }
        if (profileData.jobTitle !== undefined && profileData.jobTitle !== null) {
            fields.push(`job_title = $${paramCounter++}`);
            values.push(profileData.jobTitle);
        }
        if (profileData.yearsOfExperience !== undefined && profileData.yearsOfExperience !== null) {
            fields.push(`years_of_experience = $${paramCounter++}`);
            values.push(parseInt(profileData.yearsOfExperience));
        }
        if (profileData.targetAptitudeAreas !== undefined && profileData.targetAptitudeAreas !== null) {
            fields.push(`target_aptitude_areas = $${paramCounter++}`);
            let targetAreasArray = null;
            if (profileData.targetAptitudeAreas) {
                if (Array.isArray(profileData.targetAptitudeAreas)) {
                    targetAreasArray = profileData.targetAptitudeAreas;
                } else if (typeof profileData.targetAptitudeAreas === 'string') {
                    try {
                        const parsed = JSON.parse(profileData.targetAptitudeAreas);
                        if (Array.isArray(parsed)) {
                            targetAreasArray = parsed;
                        } else {
                            targetAreasArray = [profileData.targetAptitudeAreas];
                        }
                    } catch (e) {
                        targetAreasArray = [profileData.targetAptitudeAreas];
                    }
                } else {
                    targetAreasArray = [String(profileData.targetAptitudeAreas)];
                }
            }
            values.push(targetAreasArray);
        }
        if (profileData.learningStyle !== undefined && profileData.learningStyle !== null) {
            fields.push(`learning_style = $${paramCounter++}`);
            values.push(profileData.learningStyle);
        }
        if (profileData.weeklyHoursAvailable !== undefined && profileData.weeklyHoursAvailable !== null) {
            fields.push(`weekly_hours_available = $${paramCounter++}`);
            values.push(profileData.weeklyHoursAvailable);
        }
        if (profileData.preferredDifficultyLevel !== undefined && profileData.preferredDifficultyLevel !== null) {
            fields.push(`preferred_difficulty_level = $${paramCounter++}`);
            values.push(profileData.preferredDifficultyLevel);
        }

        if (fields.length === 0) {
            return await this.findByUserId(userId);
        }

        fields.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(userId);

        const query = `
      UPDATE user_profiles 
      SET ${fields.join(', ')}
      WHERE user_id = $${paramCounter}
      RETURNING *
    `;

        try {
            const result = await db.query(query, values);
            if (result.rows[0]) {
                if (result.rows[0].target_aptitude_areas) {
                    try {
                        result.rows[0].target_aptitude_areas = typeof result.rows[0].target_aptitude_areas === 'string'
                            ? JSON.parse(result.rows[0].target_aptitude_areas)
                            : result.rows[0].target_aptitude_areas;
                    } catch (e) {
                        result.rows[0].target_aptitude_areas = [];
                    }
                }
            }
            return result.rows[0];
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw new Error(`Database error: ${error.message}`);
        }
    }

    static async saveDiagnosticResults(userId, results) {
        const query = `
      UPDATE user_profiles 
      SET diagnostic_results = $1, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $2
      RETURNING *
    `;
        try {
            const result = await db.query(query, [JSON.stringify(results), userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error saving diagnostic results:', error);
            throw error;
        }
    }

    static async upsert(userId, profileData) {
        const existing = await this.findByUserId(userId);

        if (existing) {
            return await this.update(userId, profileData);
        } else {
            return await this.create({ userId, ...profileData });
        }
    }

    static async delete(userId) {
        const query = 'DELETE FROM user_profiles WHERE user_id = $1 RETURNING id';
        try {
            const result = await db.query(query, [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting user profile:', error);
            throw error;
        }
    }
}

module.exports = UserProfile;