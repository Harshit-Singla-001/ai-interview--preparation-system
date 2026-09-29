import express from 'express';
import { generateQuestions, evaluateAnswer, submitAssessment } from '../controllers/interviewController.js';

const router = express.Router();

router.post('/generate', generateQuestions);
router.post('/evaluate', evaluateAnswer);
router.post('/submit', submitAssessment);

export default router;
