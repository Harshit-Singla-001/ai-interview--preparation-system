import express from 'express';
import { getHistory, clearHistory } from '../controllers/historyController.js';

const router = express.Router();

router.get('/', getHistory);
router.delete('/', clearHistory);

export default router;
