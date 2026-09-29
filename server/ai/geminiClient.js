import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    this.fallbackModel = process.env.GEMINI_FALLBACK_MODEL || 'gemini-1.5-flash';

    const fallbackPath = path.join(__dirname, '../data/fallbackQuestions.json');
    this.fallbackQuestions = JSON.parse(fs.readFileSync(fallbackPath, 'utf8'));
  }

  isKeyConfigured() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10 && !this.apiKey.includes('your_'));
  }

  /**
   * Helper to invoke Gemini API via HTTP fetch with model fallback
   */
  async _callGeminiApi(prompt, systemInstruction = '', modelOverride = null) {
    if (!this.isKeyConfigured()) {
      throw new Error('GEMINI_API_KEY is not configured or invalid in .env');
    }

    const modelsToTry = [
      modelOverride || this.model,
      this.fallbackModel,
      'gemini-1.5-flash',
      'gemini-2.5-flash'
    ];

    // Remove duplicates
    const uniqueModels = [...new Set(modelsToTry)];

    let lastError = null;

    for (const currentModel of uniqueModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${this.apiKey}`;
        
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: 'application/json'
          }
        };

        if (systemInstruction) {
          payload.systemInstruction = {
            parts: [{ text: systemInstruction }]
          };
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[Gemini API] Model ${currentModel} returned ${response.status}: ${errText}`);
          lastError = new Error(`Gemini API Error (${response.status}): ${errText}`);
          continue; // Try next fallback model
        }

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textContent) {
          throw new Error('Empty response payload from Gemini');
        }

        // Clean any accidental markdown code fences
        const cleaned = textContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.warn(`[Gemini API] Failed with model ${currentModel}:`, err.message);
        lastError = err;
      }
    }

    throw lastError || new Error('All Gemini model fallbacks exhausted.');
  }

  /**
   * Generates dynamic role-specific MCQ interview questions
   */
  async generateInterviewQuestions({ jobRoleTitle, jobRoleId, requiredSkills, topics, count = 5, difficulty = 'Mixed' }) {
    const prompt = `
Generate an interview assessment paper with exactly ${count} multiple-choice questions (MCQs) for the job role: "${jobRoleTitle}".
Required Skills: ${Array.isArray(requiredSkills) ? requiredSkills.join(', ') : requiredSkills}
Core Topics: ${Array.isArray(topics) ? topics.join(', ') : topics}
Target Difficulty: ${difficulty}

Rules:
1. Provide practical, insightful questions assessing real understanding (not trivial syntax memorization).
2. Exactly 4 distinct options (A, B, C, D) for each question.
3. Mark the single correct option letter ("A", "B", "C", or "D").
4. Include a concise, rigorous explanation of why the correct option is right.
5. Tag each question with its specific Topic and Difficulty.

Return strictly valid JSON adhering to this schema:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": {
        "A": "Option text",
        "B": "Option text",
        "C": "Option text",
        "D": "Option text"
      },
      "correctAnswer": "A",
      "topic": "Topic Name",
      "difficulty": "Easy|Medium|Hard",
      "explanation": "Detailed explanation of correct concept"
    }
  ]
}`;

    const systemInstruction = 'You are an expert technical interviewer and AI curriculum designer. Return strictly pure JSON without markdown or commentary.';

    try {
      if (this.isKeyConfigured()) {
        const result = await this._callGeminiApi(prompt, systemInstruction);
        if (result && Array.isArray(result.questions) && result.questions.length > 0) {
          return {
            source: 'GEMINI_AI',
            modelUsed: this.model,
            questions: result.questions
          };
        }
      }
    } catch (err) {
      console.warn('[GeminiService] AI generation failed, using structured offline fallback bank:', err.message);
    }

    // High quality offline fallback guarantee
    const fallbackList = this.fallbackQuestions[jobRoleId] || this.fallbackQuestions['ROLE_DATA_SCIENTIST'] || [];
    return {
      source: 'OFFLINE_QUESTION_BANK',
      notice: 'Served from offline question bank (Gemini fallback active)',
      questions: fallbackList.slice(0, count)
    };
  }

  /**
   * Evaluates a user's chosen answer AND optional natural language explanation
   */
  async evaluateAnswerAndExplanation({ questionText, options, correctAnswer, userSelectedOption, userExplanation, topic }) {
    const isOptionCorrect = userSelectedOption === correctAnswer;
    const hasExplanation = Boolean(userExplanation && userExplanation.trim().length > 0);

    if (!this.isKeyConfigured()) {
      return {
        source: 'RULE_BASED_EVALUATION',
        isCorrect: isOptionCorrect,
        correctAnswer,
        answerAnalysis: isOptionCorrect
          ? `Your choice (${userSelectedOption}) is correct!`
          : `Your choice (${userSelectedOption}) is incorrect. The correct answer is (${correctAnswer}).`,
        explanationAnalysis: hasExplanation
          ? `You reasoned: "${userExplanation}". (Configure Gemini API Key in .env for in-depth AI semantic evaluation)`
          : 'No explanation was provided.',
        conceptualInsight: 'Revise the foundational definitions and prerequisite topics for this question.',
        recommendedAction: isOptionCorrect ? 'Continue practicing higher difficulty problems.' : 'Review core concepts in ' + topic
      };
    }

    const prompt = `
Evaluate the candidate's interview question response:
Question: "${questionText}"
Options: ${JSON.stringify(options)}
Correct Answer: "${correctAnswer}"
Candidate's Selected Answer: "${userSelectedOption}"
Candidate's Optional Explanation: "${userExplanation || 'NO EXPLANATION PROVIDED'}"
Topic: "${topic}"

Provide deep pedagogical evaluation:
1. State whether the selected answer is correct.
2. If the user provided an explanation:
   - Identify whether their mental model is sound, partially flawed, or completely incorrect.
   - Detect if they guessed correctly with faulty reasoning, or answered wrongly with a near-miss concept.
3. Give concise advice on what to study.

Return strictly valid JSON in this schema:
{
  "isCorrect": ${isOptionCorrect},
  "correctAnswer": "${correctAnswer}",
  "answerAnalysis": "Analysis of their selected option",
  "explanationAnalysis": "Semantic analysis of candidate reasoning",
  "conceptualInsight": "The core technical principle that resolves this question",
  "recommendedAction": "Specific actionable preparation tip"
}`;

    const systemInstruction = 'You are a compassionate yet rigorous senior technical interviewer. Return strictly pure JSON.';

    try {
      const result = await this._callGeminiApi(prompt, systemInstruction);
      return {
        source: 'GEMINI_AI',
        ...result
      };
    } catch (err) {
      console.warn('[GeminiService] AI evaluation fallback:', err.message);
      return {
        source: 'OFFLINE_EVALUATION',
        isCorrect: isOptionCorrect,
        correctAnswer,
        answerAnalysis: isOptionCorrect
          ? `Correct answer (${userSelectedOption}) confirmed.`
          : `Incorrect. Selected (${userSelectedOption}), but correct is (${correctAnswer}).`,
        explanationAnalysis: hasExplanation
          ? `Your explanation noted: "${userExplanation}".`
          : 'No explanation provided.',
        conceptualInsight: 'Ensure you review the underlying principles governing ' + topic + '.',
        recommendedAction: 'Practice similar interview questions on this topic.'
      };
    }
  }

  /**
   * Generates final personalized report advice based on assessment results
   */
  async generatePersonalizedReport({ jobRoleTitle, score, totalQuestions, topicBreakdown, weakTopics }) {
    if (!this.isKeyConfigured()) {
      return {
        overallSummary: `You completed the ${jobRoleTitle} preparation assessment with a score of ${score}/${totalQuestions} (${Math.round((score / totalQuestions) * 100)}%).`,
        strengths: 'Demonstrated solid grasp of the successfully answered topics.',
        weaknesses: weakTopics.length > 0 ? weakTopics.join(', ') : 'None detected! Excellent overall performance.',
        revisionRoadmap: [
          'Review questions that were answered incorrectly.',
          'Focus extra study time on ' + (weakTopics[0] || 'advanced topics') + '.',
          'Practice writing verbal justifications for complex choices to prepare for live viva interviews.'
        ]
      };
    }

    const prompt = `
Generate a final interview preparation diagnostic report:
Job Role: ${jobRoleTitle}
Score: ${score} out of ${totalQuestions} (${Math.round((score / totalQuestions) * 100)}%)
Topic Breakdown: ${JSON.stringify(topicBreakdown)}
Identified Weak Topics: ${JSON.stringify(weakTopics)}

Return strictly valid JSON with this schema:
{
  "overallSummary": "2-3 sentences evaluating readiness for this job profile",
  "strengths": "1-2 sentences highlighting mastery areas",
  "weaknesses": "1-2 sentences on primary conceptual gaps",
  "revisionRoadmap": [
    "Actionable step 1",
    "Actionable step 2",
    "Actionable step 3"
  ]
}`;

    try {
      return await this._callGeminiApi(prompt, 'You are an executive engineering hiring mentor. Return pure JSON.');
    } catch (err) {
      return {
        overallSummary: `You scored ${score}/${totalQuestions} for the ${jobRoleTitle} assessment.`,
        strengths: 'Good technical foundation.',
        weaknesses: weakTopics.join(', ') || 'Minor concept refinements needed.',
        revisionRoadmap: [
          'Review weak topics thoroughly.',
          'Practice explaining concepts out loud.',
          'Re-attempt the assessment to measure improvement.'
        ]
      };
    }
  }
}

export default GeminiService;
