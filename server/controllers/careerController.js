import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const courses = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/courses.json'), 'utf8'));
const jobRoles = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/jobRoles.json'), 'utf8'));
const careerGraphData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/careerGraph.json'), 'utf8'));

export const getCourses = (req, res) => {
  res.json({ success: true, count: courses.length, data: courses });
};

export const getCourseById = (req, res) => {
  const { id } = req.params;
  const course = courses.find(c => c.id === id);
  if (!course) {
    return res.status(404).json({ success: false, message: `Course ${id} not found` });
  }
  res.json({ success: true, data: course });
};

export const getJobRoles = (req, res) => {
  res.json({ success: true, count: jobRoles.length, data: jobRoles });
};

export const getJobRoleById = (req, res) => {
  const { id } = req.params;
  const role = jobRoles.find(r => r.id === id);
  if (!role) {
    return res.status(404).json({ success: false, message: `Job role ${id} not found` });
  }
  res.json({ success: true, data: role });
};

export const getGraphData = (req, res) => {
  res.json({ success: true, data: careerGraphData });
};
