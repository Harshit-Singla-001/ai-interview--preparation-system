import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GeminiService } from '../ai/geminiClient.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jobRoles = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/jobRoles.json'), 'utf8'));
const geminiService = new GeminiService();

export const generateQuestions = async (req, res) => {
  try {
    const { jobRoleId, count = 5, difficulty = 'Mixed' } = req.body || {};

    const role = jobRoles.find(r => r.id === jobRoleId) || jobRoles[0];
    const safeCount = [5, 10, 15].includes(Number(count)) ? Number(count) : (Number(count) >= 15 ? 15 : Number(count) >= 10 ? 10 : 5);

    const result = await geminiService.generateInterviewQuestions({
      jobRoleTitle: role ? role.title : 'Software Engineer',
      jobRoleId: role ? role.id : 'ROLE_DATA_SCIENTIST',
      requiredSkills: role ? role.requiredSkills : [],
      count: safeCount,
      difficulty
    });

    return res.json({
      success: true,
      jobRole: role,
      source: result.source,
      notice: result.notice || null,
      count: result.questions.length,
      questions: result.questions
    });
  } catch (err) {
    console.error('Error generating questions, using emergency fallback bank:', err.message);
    const randomized = geminiService.getRandomQuestionsFromBank(req.body?.jobRoleId, Number(req.body?.count) || 5, req.body?.difficulty);
    return res.json({
      success: true,
      jobRole: jobRoles[0],
      source: 'OFFLINE_FALLBACK',
      notice: 'Served from offline question bank in randomized order',
      count: randomized.length,
      questions: randomized
    });
  }
};

export const evaluateAnswer = async (req, res) => {
  try {
    const {
      questionText,
      options,
      correctAnswer,
      userSelectedOption,
      userExplanation,
      topic = 'General'
    } = req.body || {};

    if (!questionText || !options || !correctAnswer || !userSelectedOption) {
      return res.status(400).json({
        success: false,
        message: 'questionText, options, correctAnswer, and userSelectedOption are required'
      });
    }

    const evaluation = await geminiService.evaluateAnswerAndExplanation({
      questionText,
      options,
      correctAnswer,
      userSelectedOption,
      userExplanation,
      topic
    });

    return res.json({
      success: true,
      evaluation
    });
  } catch (err) {
    console.error('Error evaluating answer:', err);
    const isOptionCorrect = req.body?.userSelectedOption === req.body?.correctAnswer;
    return res.json({
      success: true,
      evaluation: {
        isCorrect: isOptionCorrect,
        correctAnswer: req.body?.correctAnswer || 'A',
        answerAnalysis: isOptionCorrect ? 'Correct option confirmed.' : 'Incorrect option selected.',
        explanationAnalysis: req.body?.userExplanation ? 'Explanation noted.' : 'No explanation provided.',
        conceptualInsight: 'Review foundational principles for this topic.',
        recommendedAction: 'Practice similar problems.'
      }
    });
  }
};

export const submitAssessment = async (req, res) => {
  try {
    const { jobRoleId, attempts = [] } = req.body || {};

    const role = jobRoles.find(r => r.id === jobRoleId);
    const roleTitle = role ? role.title : 'Technical Role';

    const totalQuestions = attempts.length;
    let correctCount = 0;
    const topicStats = {};

    attempts.forEach(att => {
      const topic = att.topic || 'General';
      if (!topicStats[topic]) {
        topicStats[topic] = { total: 0, correct: 0 };
      }
      topicStats[topic].total += 1;

      if (att.isCorrect) {
        correctCount += 1;
        topicStats[topic].correct += 1;
      }
    });

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    // Detect weak topics (accuracy < 60%)
    const weakTopics = [];
    const topicBreakdown = [];

    Object.entries(topicStats).forEach(([topic, stats]) => {
      const accuracy = Math.round((stats.correct / stats.total) * 100);
      topicBreakdown.push({
        topic,
        correct: stats.correct,
        total: stats.total,
        accuracy
      });
      if (accuracy < 60) {
        weakTopics.push(topic);
      }
    });

    // Request AI personalized recommendations
    let aiFeedback;
    try {
      aiFeedback = await geminiService.generatePersonalizedReport({
        jobRoleTitle: roleTitle,
        score: correctCount,
        totalQuestions,
        topicBreakdown,
        weakTopics
      });
    } catch (aiErr) {
      aiFeedback = {
        overallSummary: `You completed the assessment with a score of ${correctCount}/${totalQuestions} (${scorePercent}%).`,
        strengths: 'Demonstrated good technical awareness.',
        weaknesses: weakTopics.length ? weakTopics.join(', ') : 'None detected.',
        revisionRoadmap: ['Review weak topics', 'Practice interview questions']
      };
    }

    const report = {
      id: 'ASSESS_' + Date.now(),
      jobRoleId,
      jobRoleTitle: roleTitle,
      timestamp: new Date().toISOString(),
      score: correctCount,
      totalQuestions,
      accuracyPercent: scorePercent,
      topicBreakdown,
      weakTopics,
      aiFeedback,
      attempts
    };

    // Save to history storage safely
    try {
      const historyFile = path.join(__dirname, '../data/history.json');
      let history = [];
      if (fs.existsSync(historyFile)) {
        const raw = fs.readFileSync(historyFile, 'utf8').trim();
        if (raw) history = JSON.parse(raw);
      }
      history.unshift({
        id: report.id,
        jobRoleId: report.jobRoleId,
        jobRoleTitle: report.jobRoleTitle,
        timestamp: report.timestamp,
        score: report.score,
        totalQuestions: report.totalQuestions,
        accuracyPercent: report.accuracyPercent,
        weakTopics: report.weakTopics
      });
      fs.writeFileSync(historyFile, JSON.stringify(history.slice(0, 50), null, 2));
    } catch (saveErr) {
      console.warn('Could not persist assessment to history.json:', saveErr.message);
    }

    return res.json({
      success: true,
      report
    });
  } catch (err) {
    console.error('Error submitting assessment:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to process assessment submission',
      error: err.message
    });
  }
};
