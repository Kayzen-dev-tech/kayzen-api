const express = require('express');
const cors = require('cors');
const path = require('path');
const { tiktok, pinterest, youtube, ytmp3 } = require('../lib/scraper');
const { chatAi, imageGen, grammarFix, codeExplain, summarize } = require('../lib/ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const checkApiKey = (req, res, next) => {
  const apiKey = req.query.apikey;
  if (!apiKey || apiKey !== 'kayzen') {
    return res.status(403).json({
      status: false,
      message: "Access Denied. Invalid API Key. Contact Kayzen."
    });
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
  const { url } = req.query;
  if (!url) return res.json({ status: false, message: "URL parameter required" });
  const result = await tiktok(url);
  res.json(result);
});

app.get('/api/youtube', checkApiKey, async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ status: false, message: "URL parameter required" });
  const result = await youtube(url);
  res.json(result);
});

app.get('/api/ytmp3', checkApiKey, async (req, res) => {
  const { url } = req.query;
  if (!url) return res.json({ status: false, message: "URL parameter required" });
  const result = await ytmp3(url);
  res.json(result);
});

app.get('/api/pinterest', checkApiKey, async (req, res) => {
  const { query } = req.query;
  if (!query) return res.json({ status: false, message: "Query parameter required" });
  const result = await pinterest(query);
  res.json({ status: true, results: result });
});

app.get('/api/ai/chat', checkApiKey, async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) return res.json({ status: false, message: "Prompt parameter required" });
  const result = await chatAi(prompt);
  res.json(result);
});

app.get('/api/ai/image', checkApiKey, async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) return res.json({ status: false, message: "Prompt parameter required" });
  const result = await imageGen(prompt);
  res.json(result);
});

app.get('/api/ai/grammar', checkApiKey, async (req, res) => {
  const { text } = req.query;
  if (!text) return res.json({ status: false, message: "Text parameter required" });
  const result = await grammarFix(text);
  res.json(result);
});

app.get('/api/ai/code', checkApiKey, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.json({ status: false, message: "Code parameter required" });
  const result = await codeExplain(code);
  res.json(result);
});

app.get('/api/ai/summary', checkApiKey, async (req, res) => {
  const { text } = req.query;
  if (!text) return res.json({ status: false, message: "Text parameter required" });
  const result = await summarize(text);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
