import express from 'express';
import { runSearch, compareSearch } from '../controllers/searchController.js';

const router = express.Router();

router.post('/run', runSearch);
router.post('/compare', compareSearch);

export default router;
