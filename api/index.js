const express = require('express');
const cors = require('cors');
const path = require('path');
const { 
  tiktokDl, tiktokSearch, tiktokStalk, 
  youtubeSearch, youtubeDl, ytmp3,
  instaDl, instaStalk, 
  pinterestDl, pinterestSearch, 
  twitterDl, twitterStalk, twitterSearch
} = require('../lib/scraper');
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
  const { type, url, query, username } = req.query;
  if (type === 'search' && query) return res.json(await tiktokSearch(query));
  if (type === 'stalk' && username) return res.json(await tiktokStalk(username));
  if (url) return res.json(await tiktokDl(url));
  res.json({ status: false, message: "Parameters missing. Need url, query (type=search), or username (type=stalk)." });
});

app.get('/api/youtube', checkApiKey, async (req, res) => {
  const { type, url, query } = req.query;
  if (type === 'search' && query) return res.json(await youtubeSearch(query));
  if (type === 'audio' && url) return res.json(await ytmp3(url));
  if (url) return res.json(await youtubeDl(url));
  res.json({ status: false, message: "Parameters missing. Need url or query (type=search)." });
});

app.get('/api/instagram', checkApiKey, async (req, res) => {
  const { type, url, username } = req.query;
  if (type === 'stalk' && username) return res.json(await instaStalk(username));
  if (url) return res.json(await instaDl(url));
  res.json({ status: false, message: "Parameters missing. Need url or username (type=stalk)." });
});

app.get('/api/pinterest', checkApiKey, async (req, res) => {
  const { type, url, query } = req.query;
  if (type === 'download' && url) return res.json(await pinterestDl(url));
  if (query) return res.json({ status: true, results: await pinterestSearch(query) });
  res.json({ status: false, message: "Parameters missing. Need query or url (type=download)." });
});

app.get('/api/twitter', checkApiKey, async (req, res) => {
  const { type, url, query, username } = req.query;
  if (type === 'search' && query) return res.json(await twitterSearch(query));
  if (type === 'stalk' && username) return res.json(await twitterStalk(username));
  if (url) return res.json(await twitterDl(url));
  res.json({ status: false, message: "Parameters missing. Need url, query (type=search), or username (type=stalk)." });
});

app.get('/api/ai/chat', checkApiKey, async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) return res.json({ status: false, message: "Prompt parameter required" });
  res.json(await chatAi(prompt));
});

app.get('/api/ai/image', checkApiKey, async (req, res) => {
  const { prompt } = req.query;
  if (!prompt) return res.json({ status: false, message: "Prompt parameter required" });
  res.json(await imageGen(prompt));
});

app.get('/api/ai/grammar', checkApiKey, async (req, res) => {
  const { text } = req.query;
  if (!text) return res.json({ status: false, message: "Text parameter required" });
  res.json(await grammarFix(text));
});

app.get('/api/ai/code', checkApiKey, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.json({ status: false, message: "Code parameter required" });
  res.json(await codeExplain(code));
});

app.get('/api/ai/summary', checkApiKey, async (req, res) => {
  const { text } = req.query;
  if (!text) return res.json({ status: false, message: "Text parameter required" });
  res.json(await summarize(text));
});

app.use((req, res) => res.status(404).json({ status: false, message: "Endpoint not found" }));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
