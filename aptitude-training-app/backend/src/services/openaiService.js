const OpenAI = require('openai');
require('dotenv').config();

// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

class OpenAIService {
    constructor() {
        // Use gpt-3.5-turbo which is widely available and has good free tier access
        this.model = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
        this.maxTokens = parseInt(process.env.OPENAI_MAX_TOKENS) || 2000;
        this.temperature = parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7;

        console.log(`OpenAI Service initialized with model: ${this.model}`);
    }

    /**
     * Generate questions based on topic, difficulty, and question type
     */
    async generateQuestions(topic, difficulty, questionType, count = 5, userContext = null) {
        const prompt = this.buildQuestionPrompt(topic, difficulty, questionType, count, userContext);

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert aptitude test creator. Generate high-quality, accurate, and educational questions.
            Return ONLY valid JSON. Do not include any explanatory text outside the JSON.
            Each question must have: id, text, options (array of 4), correctAnswer (index 0-3), explanation, difficulty, topic, timeLimit.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: this.temperature,
                max_tokens: this.maxTokens,
            });

            const content = response.choices[0].message.content;
            console.log('OpenAI response received for question generation');

            // Extract JSON from response (in case there's extra text)
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return parsed.questions || this.getFallbackQuestions(topic, difficulty, questionType, count);
            }
            return this.getFallbackQuestions(topic, difficulty, questionType, count);
        } catch (error) {
            console.error('OpenAI generate questions error:', error.message);
            return this.getFallbackQuestions(topic, difficulty, questionType, count);
        }
    }

    buildQuestionPrompt(topic, difficulty, questionType, count, userContext) {
        let prompt = `Generate ${count} ${difficulty} difficulty ${questionType} questions about "${topic}".\n\n`;

        if (userContext) {
            prompt += `Context about the learner:
      - Current skill level: ${userContext.skillLevel || 'intermediate'}
      - Previous performance: ${userContext.performance || 'average'}
      - Learning style: ${userContext.learningStyle || 'visual'}
      - Weak areas: ${userContext.weaknesses?.join(', ') || 'none'}\n\n`;
        }

        prompt += `Requirements:
    1. Questions should be realistic and practical
    2. Include a mix of conceptual and application-based questions
    3. Provide clear explanations for correct answers
    4. For ${questionType} questions, ensure they are appropriate for the format
    
    Return JSON format:
    {
      "questions": [
        {
          "id": 1,
          "text": "question text",
          "options": ["option1", "option2", "option3", "option4"],
          "correctAnswer": 0,
          "explanation": "detailed explanation",
          "difficulty": "${difficulty}",
          "topic": "${topic}",
          "questionType": "${questionType}",
          "timeLimit": 60,
          "points": ${difficulty === 'beginner' ? 10 : difficulty === 'intermediate' ? 20 : difficulty === 'advanced' ? 35 : 50}
        }
      ]
    }`;

        return prompt;
    }

    /**
     * Generate learning content
     */
    async generateLearningContent(params) {
        const { topic, difficulty, learningStyle, userContext } = params;

        const prompt = `Generate comprehensive learning content for "${topic}" at ${difficulty} level.
    
    Learning Style: ${learningStyle}
    User Context: ${JSON.stringify(userContext)}
    
    Create engaging, educational content. Use HTML formatting for better presentation.
    Return in JSON format:
    {
      "title": "Lesson title",
      "description": "Brief overview",
      "content": {
        "introduction": "<div class='prose'><p>Engaging introduction paragraph with HTML formatting</p></div>",
        "keyConcepts": [
          {"concept": "Concept name", "explanation": "Detailed explanation", "example": "Practical example"}
        ],
        "practiceQuestions": [
          {"question": "Practice question", "answer": "Expected answer", "explanation": "Why this is correct"}
        ],
        "summary": "Key takeaways with HTML formatting",
        "resources": ["Additional resource suggestions"]
      },
      "estimatedTime": 20,
      "difficulty": "${difficulty}"
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert educator creating engaging, personalized learning content. Use clear, educational language. Return ONLY valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: this.temperature,
                max_tokens: 2500,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this.getFallbackLearningContent(topic, difficulty);
        } catch (error) {
            console.error('Generate learning content error:', error.message);
            return this.getFallbackLearningContent(topic, difficulty);
        }
    }

    /**
     * Generate personalized content
     */
    async generatePersonalizedContent(params) {
        const { topic, contentType, difficulty, learningStyle, userContext } = params;

        const prompt = `Create ${contentType} content for "${topic}" at ${difficulty} level.
    
    Learning Style: ${learningStyle}
    User: ${JSON.stringify(userContext)}
    
    The content should be engaging, practical, and tailored to the user's learning preferences.
    
    Return JSON format:
    {
      "title": "Content title",
      "description": "Brief description",
      "content": {
        "introduction": "<div class='prose'><p>HTML formatted introduction</p></div>",
        "mainContent": "<div class='prose'><h3>Section Title</h3><p>HTML formatted main content with sections</p></div>",
        "examples": ["Example 1", "Example 2"],
        "exercises": ["Exercise 1", "Exercise 2"]
      },
      "estimatedTime": 25,
      "difficulty": "${difficulty}"
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: `You are creating ${contentType} content. Be practical, engaging, and educational. Use HTML formatting for better presentation. Return ONLY valid JSON.`
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: this.temperature,
                max_tokens: 2500,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this.getFallbackPersonalizedContent(topic, difficulty);
        } catch (error) {
            console.error('Generate personalized content error:', error.message);
            return this.getFallbackPersonalizedContent(topic, difficulty);
        }
    }

    /**
     * Analyze answer and provide intelligent feedback
     */
    async analyzeAnswer(question, userAnswer, timeTaken, userHistory = null) {
        const prompt = `Analyze this answer:
    
    Question: ${question.text}
    Correct Answer: ${question.options[question.correctAnswer]}
    User's Answer: ${userAnswer || 'No answer provided'}
    Time Taken: ${timeTaken} seconds
    ${userHistory ? `User's past performance: ${JSON.stringify(userHistory)}` : ''}
    
    Provide detailed, constructive analysis in JSON format:
    {
      "isCorrect": ${!!userAnswer && userAnswer === question.options[question.correctAnswer]},
      "score": ${userAnswer === question.options[question.correctAnswer] ? '100' : '0'},
      "feedback": "personalized feedback message",
      "strengths": ["strength1", "strength2"],
      "improvements": ["improvement1", "improvement2"],
      "conceptExplanation": "detailed explanation of the concept",
      "suggestedResources": ["resource1", "resource2"],
      "nextSteps": "what to study next"
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert tutor providing detailed, constructive feedback on answers. Be encouraging but honest. Return ONLY valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this.getFallbackAnalysis(question, userAnswer);
        } catch (error) {
            console.error('OpenAI analyze answer error:', error.message);
            return this.getFallbackAnalysis(question, userAnswer);
        }
    }

    /**
     * Evaluate challenge solution
     */
    async evaluateChallengeSolution(challenge, solution) {
        const prompt = `Evaluate this challenge solution:
    
    Challenge: ${challenge.title}
    Description: ${challenge.description}
    ${challenge.content?.successCriteria ? `Success Criteria: ${JSON.stringify(challenge.content.successCriteria)}` : ''}
    
    User's Solution: ${solution}
    
    Provide evaluation in JSON format:
    {
      "overallScore": 75,
      "feedback": "Detailed feedback on the solution",
      "strengths": ["Strength 1", "Strength 2"],
      "improvements": ["Area 1", "Area 2"]
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert evaluator. Provide fair, constructive feedback. Return ONLY valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this.getFallbackEvaluation();
        } catch (error) {
            console.error('OpenAI evaluate challenge error:', error.message);
            return this.getFallbackEvaluation();
        }
    }

    /**
     * Analyze mock test performance
     */
    async analyzeMockTestPerformance(testData, answers, totalScore) {
        const prompt = `Analyze this mock test performance:
    
    Test: ${testData.testName || 'Mock Test'}
    Total Score: ${totalScore}/${testData.totalPoints || 100}
    ${answers.sectionScores ? `Section Scores: ${JSON.stringify(answers.sectionScores)}` : ''}
    
    Provide analysis in JSON:
    {
      "strengths": ["Strong in quantitative section"],
      "weaknesses": ["Needs improvement in data interpretation"],
      "recommendations": ["Practice more data interpretation questions"],
      "timeManagement": "Good pace, but spent too long on complex problems",
      "estimatedPercentile": 65
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert test analyst. Provide actionable insights. Return ONLY valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.5,
                max_tokens: 800,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return this.getFallbackPerformanceAnalysis();
        } catch (error) {
            console.error('OpenAI analyze mock test error:', error.message);
            return this.getFallbackPerformanceAnalysis();
        }
    }

    /**
     * Generate adaptive question based on performance
     */
    async generateAdaptiveQuestion(userPerformance, currentDifficulty, topic) {
        const performanceSummary = {
            correctRate: userPerformance.correctRate || 0.7,
            averageTime: userPerformance.averageTime || 45,
            strengths: userPerformance.strengths || [],
            weaknesses: userPerformance.weaknesses || []
        };

        let adjustedDifficulty = currentDifficulty;
        if (performanceSummary.correctRate > 0.8) {
            adjustedDifficulty = this.increaseDifficulty(currentDifficulty);
        } else if (performanceSummary.correctRate < 0.5) {
            adjustedDifficulty = this.decreaseDifficulty(currentDifficulty);
        }

        const prompt = `Generate a ${adjustedDifficulty} difficulty question about "${topic}".
    
    User performance data:
    - Correct rate: ${performanceSummary.correctRate * 100}%
    - Average response time: ${performanceSummary.averageTime}s
    - Known strengths: ${performanceSummary.strengths.join(', ') || 'none'}
    - Known weaknesses: ${performanceSummary.weaknesses.join(', ') || 'none'}
    
    The question should be ${performanceSummary.correctRate > 0.8 ? 'more challenging' : performanceSummary.correctRate < 0.5 ? 'easier with more scaffolding' : 'appropriately challenging'}.
    
    Return a single question object in JSON format:
    {
      "id": 1,
      "text": "question text",
      "options": ["option1", "option2", "option3", "option4"],
      "correctAnswer": 0,
      "explanation": "detailed explanation",
      "difficulty": "${adjustedDifficulty}",
      "topic": "${topic}",
      "questionType": "mcq",
      "timeLimit": 60,
      "points": ${adjustedDifficulty === 'beginner' ? 10 : adjustedDifficulty === 'intermediate' ? 20 : adjustedDifficulty === 'advanced' ? 35 : 50}
    }`;

        try {
            const response = await openai.chat.completions.create({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'Generate an adaptive difficulty question. Return ONLY valid JSON.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            });

            const content = response.choices[0].message.content;
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return null;
        } catch (error) {
            console.error('OpenAI adaptive question error:', error.message);
            return null;
        }
    }

    // Helper methods
    increaseDifficulty(current) {
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const index = levels.indexOf(current);
        return index < levels.length - 1 ? levels[index + 1] : current;
    }

    decreaseDifficulty(current) {
        const levels = ['beginner', 'intermediate', 'advanced', 'expert'];
        const index = levels.indexOf(current);
        return index > 0 ? levels[index - 1] : current;
    }

    // Fallback methods
    getFallbackQuestions(topic, difficulty, questionType, count) {
        const fallbackPool = [
            // Quantitative Aptitude
            {
                text: "If a person sells an article for $360, gaining 20%, what was the cost price of the article?",
                options: ["$300", "$280", "$320", "$340"],
                correctAnswer: 0,
                explanation: "Selling Price = Cost Price * (1 + Gain%). 360 = CP * 1.20 => CP = 360 / 1.20 = $300.",
                category: "Quantitative Aptitude",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            },
            {
                text: "A sum of money doubles itself in 8 years at simple interest. What is the rate of interest per annum?",
                options: ["10%", "12.5%", "15%", "8%"],
                correctAnswer: 1,
                explanation: "Simple Interest = Principal. P = (P * R * 8) / 100 => R = 100 / 8 = 12.5%.",
                category: "Quantitative Aptitude",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            },
            {
                text: "Two pipes A and B can fill a tank in 20 and 30 minutes respectively. If both pipes are opened together, how long will it take to fill the tank?",
                options: ["12 minutes", "15 minutes", "10 minutes", "18 minutes"],
                correctAnswer: 0,
                explanation: "Combined rate = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12. Time taken = 12 minutes.",
                category: "Quantitative Aptitude",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            },
            {
                text: "Find the average of first 40 natural numbers.",
                options: ["20.5", "21", "20", "21.5"],
                correctAnswer: 0,
                explanation: "Sum of first n numbers = n(n+1)/2. Average = (n+1)/2 = 41/2 = 20.5.",
                category: "Quantitative Aptitude",
                difficulty: "easy",
                questionType: "mcq",
                timeLimit: 60,
                points: 10
            },
            // Logical Reasoning
            {
                text: "Pointing to a photograph, a man said, 'I have no brother or sister but that man's father is my father's son.' Whose photograph was it?",
                options: ["His nephew's", "His son's", "His own", "His father's"],
                correctAnswer: 1,
                explanation: "Since he has no brother or sister, 'my father's son' is himself. So, the man in the photograph's father is himself. Thus, it is his son's photograph.",
                category: "Logical Reasoning",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            },
            {
                text: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
                options: ["EOJDJEFM", "EOJDEJFM", "MFEJDJOE", "EOJDJFME"],
                correctAnswer: 0,
                explanation: "The first and last letters are swapped, and the middle letters are incremented by 1 in reverse order.",
                category: "Logical Reasoning",
                difficulty: "hard",
                questionType: "mcq",
                timeLimit: 60,
                points: 35
            },
            {
                text: "If A + B means A is the brother of B; A - B means A is the sister of B and A x B means A is the father of B. Which of the following means that C is the son of M?",
                options: ["M - N x C + F", "F - C + N x M", "N + M - F x C", "M x C - F"],
                correctAnswer: 3,
                explanation: "M x C means M is father of C. C - F means C is sister/brother relations. So M x C - F means M is father of C, making C his son (assuming male node relation) or daughter. In the options, M x C - F is the closest sibling structure.",
                category: "Logical Reasoning",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            },
            // Verbal Ability
            {
                text: "Choose the synonym of 'PRAGMATIC'.",
                options: ["Idealistic", "Practical", "Unreasonable", "Arrogant"],
                correctAnswer: 1,
                explanation: "Pragmatic means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
                category: "Verbal Ability",
                difficulty: "easy",
                questionType: "mcq",
                timeLimit: 60,
                points: 10
            },
            {
                text: "Choose the antonym of 'ALACRITY'.",
                options: ["Eagerness", "Apathy", "Speed", "Promptness"],
                correctAnswer: 1,
                explanation: "Alacrity means brisk and cheerful readiness. Apathy (lack of interest or enthusiasm) is its antonym.",
                category: "Verbal Ability",
                difficulty: "hard",
                questionType: "mcq",
                timeLimit: 60,
                points: 35
            },
            // Data Interpretation
            {
                text: "If the ratio of two numbers is 3:4 and their LCM is 180, what is the sum of the numbers?",
                options: ["105", "90", "120", "110"],
                correctAnswer: 0,
                explanation: "Let numbers be 3x and 4x. LCM = 12x = 180 => x = 15. Numbers are 45 and 60. Sum = 105.",
                category: "Data Interpretation",
                difficulty: "medium",
                questionType: "mcq",
                timeLimit: 60,
                points: 20
            }
        ];

        // Filter pool by topic (category)
        let filtered = fallbackPool.filter(q => 
            q.category.toLowerCase().includes(topic.toLowerCase()) ||
            topic.toLowerCase().includes(q.category.toLowerCase())
        );

        if (filtered.length === 0) {
            filtered = fallbackPool;
        }

        // Shuffle the selected subset
        const shuffled = [...filtered].sort(() => 0.5 - Math.random());

        // Construct returning array with real sequential id indexing
        const result = [];
        for (let i = 0; i < count; i++) {
            const original = shuffled[i % shuffled.length];
            result.push({
                id: i + 1,
                text: original.text,
                options: original.options,
                correctAnswer: original.correctAnswer,
                explanation: original.explanation,
                difficulty: original.difficulty || difficulty,
                topic: original.category || topic,
                questionType: original.questionType || questionType,
                timeLimit: original.timeLimit || 60,
                points: original.points || 10
            });
        }

        return result;
    }

    getFallbackLearningContent(topic, difficulty) {
        return {
            title: `${topic} - Fundamentals`,
            description: `Master the core concepts of ${topic} at ${difficulty} level`,
            content: {
                introduction: `<div class="prose max-w-none">
          <p>Welcome to your lesson on <strong>${topic}</strong>!</p>
          <p>This content will help you build a strong foundation in this subject area.</p>
          
          <h3>Key Learning Objectives:</h3>
          <ul>
            <li>Understand core concepts of ${topic}</li>
            <li>Apply knowledge to practical problems</li>
            <li>Develop problem-solving strategies</li>
          </ul>
          
          <h3>Why This Matters:</h3>
          <p>Mastering ${topic} is essential for success in aptitude tests and professional assessments.</p>
        </div>`,
                keyConcepts: [
                    {
                        concept: "Core Concepts",
                        explanation: `Understanding the fundamentals of ${topic} is essential for success. Take time to grasp these basic principles.`,
                        example: `Practical example of ${topic} in real-world scenarios`
                    },
                    {
                        concept: "Problem-Solving Strategies",
                        explanation: `Develop systematic approaches to solve different types of problems efficiently.`,
                        example: `Step-by-step breakdown of a typical ${topic} problem`
                    }
                ],
                practiceQuestions: [
                    {
                        question: `What is the most important aspect of ${topic}?`,
                        answer: "Understanding core principles",
                        explanation: "Mastering fundamentals leads to better comprehension and faster problem-solving."
                    },
                    {
                        question: `How can you improve your skills in ${topic}?`,
                        answer: "Regular practice and review",
                        explanation: "Consistent practice helps reinforce learning and builds confidence."
                    }
                ],
                summary: `<p>Continue practicing ${topic} to improve your skills. Remember that mastery comes with consistent effort and practice.</p>`,
                resources: ["Practice quizzes", "Video tutorials", "Example problems", "Discussion forums"]
            },
            estimatedTime: 20,
            difficulty: difficulty || "beginner"
        };
    }

    getFallbackPersonalizedContent(topic, difficulty) {
        return {
            title: `${topic} - Personalized Learning`,
            description: `Learn ${topic} at your own pace with personalized content`,
            content: {
                introduction: `<div class="prose max-w-none">
          <p>Welcome to your personalized lesson on <strong>${topic}</strong>!</p>
          <p>This content is tailored to your learning preferences and pace.</p>
        </div>`,
                mainContent: `<div class="prose max-w-none">
          <h3>Getting Started</h3>
          <p>Begin by understanding the basic concepts of ${topic}. Take your time to review each section.</p>
          
          <h3>Practice Makes Perfect</h3>
          <p>Work through the examples and try the exercises to reinforce your learning.</p>
        </div>`,
                examples: [`Basic ${topic} problem with solution`, `Advanced ${topic} application`, `Real-world ${topic} scenario`],
                exercises: [`Practice exercise 1: ${topic} fundamentals`, `Practice exercise 2: ${topic} applications`, `Challenge exercise: Complex ${topic} problem`]
            },
            estimatedTime: 25,
            difficulty: difficulty || "intermediate"
        };
    }

    getFallbackAnalysis(question, userAnswer) {
        const isCorrect = userAnswer === question.options[question.correctAnswer];
        return {
            isCorrect: isCorrect,
            score: isCorrect ? 100 : 0,
            feedback: isCorrect
                ? "Great job! Your answer is correct. You have a good understanding of this concept."
                : `Your answer needs improvement. The correct answer is: ${question.options[question.correctAnswer]}. Review the concept and try again.`,
            strengths: isCorrect ? ["Good understanding", "Quick response"] : [],
            improvements: isCorrect ? [] : ["Review basic concepts", "Practice more questions", "Understand the reasoning"],
            conceptExplanation: question.explanation || `This question tests your understanding of ${question.topic}.`,
            suggestedResources: ["Review study materials", "Take practice quizzes", "Watch explanatory videos"],
            nextSteps: "Continue practicing to master this topic. Focus on understanding the 'why' behind each answer."
        };
    }

    getFallbackEvaluation() {
        return {
            overallScore: 70,
            feedback: "Good attempt! Your solution shows understanding of the core concepts. Review the feedback and try to improve.",
            strengths: ["Understanding of core concepts", "Logical approach"],
            improvements: ["Consider edge cases", "Optimize solution efficiency", "Add more comments/documentation"]
        };
    }

    getFallbackPerformanceAnalysis() {
        return {
            strengths: ["Completed the test", "Showed consistency"],
            weaknesses: ["Time management", "Complex problem solving"],
            recommendations: ["Practice more questions in weak areas", "Take timed quizzes", "Review incorrect answers"],
            timeManagement: "Complete within time limit",
            estimatedPercentile: 50
        };
    }
}

// Export a single instance
module.exports = new OpenAIService();