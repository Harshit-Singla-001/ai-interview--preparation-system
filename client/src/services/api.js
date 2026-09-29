/**
 * Centralized API Service for communicating with Node.js Express Backend
 */

const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}

export async function fetchCourses() {
  const res = await fetch(`${API_BASE}/courses`);
  return res.json();
}

export async function fetchJobRoles() {
  const res = await fetch(`${API_BASE}/job-roles`);
  return res.json();
}

export async function fetchGraphData() {
  const res = await fetch(`${API_BASE}/graph`);
  return res.json();
}

export async function runSearchAlgorithm(startNode, goalNode, algorithm) {
  const res = await fetch(`${API_BASE}/search/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startNode, goalNode, algorithm })
  });
  return res.json();
}

export async function compareSearchAlgorithms(startNode, goalNode) {
  const res = await fetch(`${API_BASE}/search/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ startNode, goalNode })
  });
  return res.json();
}

export async function generateInterviewQuestions(params) {
  const res = await fetch(`${API_BASE}/interview/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function evaluateAnswer(params) {
  const res = await fetch(`${API_BASE}/interview/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function submitAssessment(params) {
  const res = await fetch(`${API_BASE}/interview/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  return res.json();
}

export async function fetchAssessmentHistory() {
  const res = await fetch(`${API_BASE}/history`);
  return res.json();
}

export async function clearAssessmentHistory() {
  const res = await fetch(`${API_BASE}/history`, { method: 'DELETE' });
  return res.json();
}
