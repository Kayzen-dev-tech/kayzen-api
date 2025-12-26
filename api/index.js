const express = require('express');
const cors = require('cors');
const path = require('path');
const { tiktokdl, mxdrop, pinterest, aiChat, aiImage, aiCode, aiTranslate, aiSummary } = require('../lib/scraper');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const checkApiKey = (req, res, next) => {
  const apikey = req.query.apikey;
  if (apikey !== 'kayzen123') {
    return res.status(403).json({ status: false, message: 'Invalid or missing API Key' });
  }
  next();
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/docs.html'));
});

app.get('/api/tiktok', checkApiKey, async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL parameter required' });
  const result = await tiktokdl(url);
  res.json(result);
});

app.get('/api/mxdrop', checkApiKey, async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: 'URL parameter required' });
  const result = await mxdrop(url);
  res.json(result);
});

app.get('/api/pinterest', checkApiKey, async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter required' });
  const result = await pinterest(query);
  res.json({ status: true, images: result });
});

app.get('/api/ai/chat', checkApiKey, async (req, res) => {
  const prompt = req.query.prompt;
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });
  const result = await aiChat(prompt);
  res.json(result);
});

app.get('/api/ai/image', checkApiKey, async (req, res) => {
  const prompt = req.query.prompt;
  const result = await aiImage(prompt || 'Cyberpunk city');
  res.json(result);
});

app.get('/api/ai/code', checkApiKey, async (req, res) => {
  const prompt = req.query.prompt;
  const result = await aiCode(prompt || 'Hello World');
  res.json(result);
});

app.get('/api/ai/translate', checkApiKey, async (req, res) => {
  const text = req.query.text;
  const target = req.query.target || 'en';
  const result = await aiTranslate(text || 'Halo', target);
  res.json(result);
});

app.get('/api/ai/summary', checkApiKey, async (req, res) => {
  const text = req.query.text;
  const result = await aiSummary(text || 'Long text here');
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
