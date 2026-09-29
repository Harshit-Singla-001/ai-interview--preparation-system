import express from 'express';
import { getCourses, getCourseById, getJobRoles, getJobRoleById, getGraphData } from '../controllers/careerController.js';

const router = express.Router();

router.get('/courses', getCourses);
router.get('/courses/:id', getCourseById);
router.get('/job-roles', getJobRoles);
router.get('/job-roles/:id', getJobRoleById);
router.get('/graph', getGraphData);

export default router;
