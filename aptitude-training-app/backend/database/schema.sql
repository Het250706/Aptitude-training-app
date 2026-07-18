-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    preferences JSONB DEFAULT '{}'
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    field_of_expertise VARCHAR(100),
    education_level VARCHAR(100),
    job_title VARCHAR(255),
    years_of_experience INTEGER,
    target_aptitude_areas TEXT[],
    learning_style VARCHAR(50),
    weekly_hours_available VARCHAR(20),
    preferred_difficulty_level VARCHAR(20),
    diagnostic_results JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Diagnostic assessments table
CREATE TABLE IF NOT EXISTS diagnostic_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    scores JSONB NOT NULL,
    strengths TEXT[],
    weaknesses TEXT[],
    overall_score INTEGER,
    data JSONB,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning paths table
CREATE TABLE IF NOT EXISTS learning_paths (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    modules JSONB NOT NULL,
    current_module_index INTEGER DEFAULT 0,
    progress_percentage INTEGER DEFAULT 0,
    data JSONB,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    module_id VARCHAR(100),
    lesson_id VARCHAR(100),
    progress INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, module_id, lesson_id)
);

-- Quiz attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    quiz_id VARCHAR(100),
    score INTEGER,
    answers JSONB,
    time_taken INTEGER,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR(100),
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Learning Style Assessment (VARK Model)
CREATE TABLE IF NOT EXISTS learning_style_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    visual_score INTEGER DEFAULT 0,
    auditory_score INTEGER DEFAULT 0,
    reading_score INTEGER DEFAULT 0,
    kinesthetic_score INTEGER DEFAULT 0,
    primary_style VARCHAR(50),
    secondary_style VARCHAR(50),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Skill Gap Analysis
CREATE TABLE IF NOT EXISTS skill_gaps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_category VARCHAR(100),
    current_level INTEGER,
    target_level INTEGER,
    gap_score INTEGER,
    priority VARCHAR(20),
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Path Nodes
CREATE TABLE IF NOT EXISTS learning_path_nodes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    node_order INTEGER,
    node_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    content JSONB,
    prerequisites TEXT[],
    estimated_duration INTEGER,
    difficulty_level VARCHAR(20),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Progress Tracking
CREATE TABLE IF NOT EXISTS user_learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    node_id INTEGER REFERENCES learning_path_nodes(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_mastered BOOLEAN DEFAULT FALSE,
    mastery_score INTEGER DEFAULT 0,
    UNIQUE(user_id, node_id)
);

-- Adaptive Quiz Results
CREATE TABLE IF NOT EXISTS adaptive_quizzes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_area VARCHAR(100),
    difficulty_level VARCHAR(20),
    questions JSONB,
    answers JSONB,
    score INTEGER,
    time_taken INTEGER,
    strengths TEXT[],
    weaknesses TEXT[],
    recommendations JSONB,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Learning Preferences
CREATE TABLE IF NOT EXISTS learning_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    preferred_pace VARCHAR(20), -- slow, moderate, fast
    preferred_time_of_day VARCHAR(20), -- morning, afternoon, evening
    daily_goal_minutes INTEGER,
    weekly_goal_hours INTEGER,
    notification_preferences JSONB,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Gamification Tables
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    icon VARCHAR(100),
    points_required INTEGER DEFAULT 0,
    criteria JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    perfect_scores INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS user_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    source VARCHAR(100),
    source_id INTEGER,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adaptive Quiz System
CREATE TABLE IF NOT EXISTS adaptive_questions (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    difficulty_level VARCHAR(20), -- beginner, intermediate, advanced, expert
    question_type VARCHAR(50), -- mcq, scenario, coding, puzzle
    question_text TEXT,
    options JSONB,
    correct_answer TEXT,
    explanation TEXT,
    hints TEXT[],
    tags TEXT[],
    time_limit INTEGER DEFAULT 60,
    points_awarded INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255),
    current_difficulty VARCHAR(20),
    questions_answered INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS quiz_responses (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id INTEGER REFERENCES adaptive_questions(id),
    user_answer TEXT,
    is_correct BOOLEAN,
    time_taken INTEGER,
    points_earned INTEGER,
    difficulty_at_time VARCHAR(20),
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-World Challenges
CREATE TABLE IF NOT EXISTS challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    challenge_type VARCHAR(50), -- coding, scenario, puzzle, case_study
    difficulty_level VARCHAR(20),
    content JSONB,
    initial_code TEXT,
    test_cases JSONB,
    solution_explanation TEXT,
    time_limit INTEGER,
    points_reward INTEGER,
    experience_reward INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_challenges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES challenges(id) ON DELETE CASCADE,
    user_solution TEXT,
    score INTEGER,
    status VARCHAR(20), -- started, submitted, completed
    attempts INTEGER DEFAULT 0,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    feedback JSONB
);

-- Check if tables exist, create if not
CREATE TABLE IF NOT EXISTS learning_style_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    visual_score INTEGER DEFAULT 0,
    auditory_score INTEGER DEFAULT 0,
    reading_score INTEGER DEFAULT 0,
    kinesthetic_score INTEGER DEFAULT 0,
    primary_style VARCHAR(50),
    secondary_style VARCHAR(50),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_gaps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    skill_category VARCHAR(100),
    current_level INTEGER,
    target_level INTEGER,
    gap_score INTEGER,
    priority VARCHAR(20),
    recommendations JSONB
);

CREATE TABLE IF NOT EXISTS learning_path_nodes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    node_order INTEGER,
    node_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    content JSONB,
    prerequisites TEXT[],
    estimated_duration INTEGER,
    difficulty_level VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS user_learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    node_id INTEGER REFERENCES learning_path_nodes(id),
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    is_mastered BOOLEAN DEFAULT FALSE
);

-- Add missing columns to quiz_sessions table
ALTER TABLE quiz_sessions 
ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS questions_data JSONB,
ADD COLUMN IF NOT EXISTS average_time INTEGER DEFAULT 0;

-- Add missing columns to quiz_responses table
ALTER TABLE quiz_responses 
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_strengths TEXT[],
ADD COLUMN IF NOT EXISTS ai_improvements TEXT[];

-- Add missing columns to user_challenges table
ALTER TABLE user_challenges 
ADD COLUMN IF NOT EXISTS score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS feedback JSONB;

-- Add missing columns to challenges table
ALTER TABLE challenges 
ADD COLUMN IF NOT EXISTS points_reward INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS experience_reward INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id);

-- Drop and recreate user_points table with correct structure
DROP TABLE IF EXISTS user_points CASCADE;

CREATE TABLE user_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    points INTEGER DEFAULT 0,
    source VARCHAR(100),
    source_id INTEGER,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for user_points
CREATE INDEX idx_user_points_user_id ON user_points(user_id);

-- Drop and recreate leaderboard table
DROP TABLE IF EXISTS leaderboard CASCADE;

CREATE TABLE leaderboard (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    total_points INTEGER DEFAULT 0,
    quizzes_taken INTEGER DEFAULT 0,
    perfect_scores INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leaderboard_user_id ON leaderboard(user_id);
CREATE INDEX idx_leaderboard_points ON leaderboard(total_points DESC);

-- Drop and recreate user_badges table
DROP TABLE IF EXISTS user_badges CASCADE;

CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);

-- Ensure quiz_sessions has all required columns
ALTER TABLE quiz_sessions 
ADD COLUMN IF NOT EXISTS total_questions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS questions_data JSONB,
ADD COLUMN IF NOT EXISTS average_time INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS correct_answers INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0;

-- Ensure quiz_responses has all required columns
ALTER TABLE quiz_responses 
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_strengths TEXT[],
ADD COLUMN IF NOT EXISTS ai_improvements TEXT[],
ADD COLUMN IF NOT EXISTS points_earned INTEGER DEFAULT 0;

-- Create missing tables if not exist
CREATE TABLE IF NOT EXISTS learning_style_assessments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    visual_score INTEGER DEFAULT 0,
    auditory_score INTEGER DEFAULT 0,
    reading_score INTEGER DEFAULT 0,
    kinesthetic_score INTEGER DEFAULT 0,
    primary_style VARCHAR(50),
    secondary_style VARCHAR(50),
    assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS skill_gaps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    skill_category VARCHAR(100),
    current_level INTEGER,
    target_level INTEGER,
    gap_score INTEGER,
    priority VARCHAR(20),
    recommendations JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS learning_path_nodes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    node_order INTEGER,
    node_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    content JSONB,
    prerequisites TEXT[],
    estimated_duration INTEGER,
    difficulty_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_learning_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    node_id INTEGER REFERENCES learning_path_nodes(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_mastered BOOLEAN DEFAULT FALSE,
    mastery_score INTEGER DEFAULT 0,
    UNIQUE(user_id, node_id)
);

-- Insert default badges if not exists
INSERT INTO badges (id, name, description, category, points_required) VALUES
(1, 'First Steps', 'Complete your first quiz', 'achievement', 10),
(2, 'Quick Learner', 'Complete 5 quizzes', 'achievement', 50),
(3, 'Quiz Master', 'Complete 10 quizzes', 'achievement', 100),
(4, 'Perfect Score', 'Get 100% on a quiz', 'achievement', 0),
(5, 'Streak Starter', '3 day streak', 'streak', 0),
(6, 'On Fire!', '7 day streak', 'streak', 0),
(7, 'Point Collector', 'Earn 500 points', 'points', 500),
(8, 'Elite Learner', 'Earn 1000 points', 'points', 1000)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session ON quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user ON user_challenges(user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_adaptive_questions_category ON adaptive_questions(category);
CREATE INDEX IF NOT EXISTS idx_adaptive_questions_difficulty ON adaptive_questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_user ON quiz_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_points ON leaderboard(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_user_points_user ON user_points(user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_skill_gaps_user ON skill_gaps(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_nodes_user ON learning_path_nodes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_node ON user_learning_progress(user_id, node_id);
CREATE INDEX IF NOT EXISTS idx_adaptive_quizzes_user ON adaptive_quizzes(user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_user_id ON diagnostic_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();