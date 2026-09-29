import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root directory or current directory
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

import careerRoutes from './routes/careerRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import historyRoutes from './routes/historyRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_PORT = process.env.CLIENT_PORT || 5173;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'AI Interview Preparation System API',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10),
    model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api', careerRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/history', historyRoutes);

// Optional: Serve client/dist static files if built
const clientDistPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('================================================================');
  console.log(' AI INTERVIEW PREPARATION SYSTEM — BACKEND API');
  console.log('================================================================');
  console.log(` Server running on   : http://localhost:${PORT}`);
  console.log(` Health check URL   : http://localhost:${PORT}/api/health`);
  console.log(` Gemini AI Model    : ${process.env.GEMINI_MODEL || 'gemini-3.6-flash'}`);
  console.log(` Gemini Key Set     : ${Boolean(process.env.GEMINI_API_KEY)}`);
  console.log('================================================================');
});

export default app;
