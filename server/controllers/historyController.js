import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyFile = path.join(__dirname, '../data/history.json');

export const getHistory = (req, res) => {
  try {
    if (!fs.existsSync(historyFile)) {
      return res.json({ success: true, count: 0, data: [] });
    }
    const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to read history', error: err.message });
  }
};

export const clearHistory = (req, res) => {
  try {
    fs.writeFileSync(historyFile, JSON.stringify([], null, 2));
    res.json({ success: true, message: 'Assessment history cleared successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to clear history', error: err.message });
  }
};
