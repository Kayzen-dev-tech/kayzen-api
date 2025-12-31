require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/api/', limiter);

const authMiddleware = (req, res, next) => {
  const apikey = req.query.apikey || req.headers['x-api-key'];
  const validKey = process.env.API_KEY || 'kayzen2025';
  
  if (!apikey || apikey !== validKey) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or missing API key'
    });
  }
  next();
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Kayzen Izumi API',
    version: '1.0.0',
    endpoints: {
      tiktok: ['/api/tiktok/download', '/api/tiktok/search', '/api/tiktok/stalk'],
      youtube: ['/api/youtube/download', '/api/youtube/mp3'],
      instagram: ['/api/instagram/download', '/api/instagram/search', '/api/instagram/stalk'],
      pinterest: ['/api/pinterest/search', '/api/pinterest/download'],
      twitter: ['/api/twitter/download', '/api/twitter/search', '/api/twitter/stalk'],
      ai: ['/api/ai/chat', '/api/ai/kayzen', '/api/ai/image', '/api/ai/text', '/api/ai/analyze']
    },
    documentation: '/docs'
  });
});

const tiktokRoutes = {
  download: require('./api/tiktok/download'),
  search: require('./api/tiktok/search'),
  stalk: require('./api/tiktok/stalk')
};

const youtubeRoutes = {
  download: require('./api/youtube/download'),
  mp3: require('./api/youtube/mp3')
};

const instagramRoutes = {
  download: require('./api/instagram/download'),
  search: require('./api/instagram/search'),
  stalk: require('./api/instagram/stalk')
};

const pinterestRoutes = {
  search: require('./api/pinterest/search'),
  download: require('./api/pinterest/download')
};

const twitterRoutes = {
  download: require('./api/twitter/download'),
  search: require('./api/twitter/search'),
  stalk: require('./api/twitter/stalk')
};

const aiRoutes = {
  chat: require('./api/ai/chat'),
  kayzen: require('./api/ai/kayzen'),
  image: require('./api/ai/image'),
  text: require('./api/ai/text'),
  analyze: require('./api/ai/analyze')
};

app.get('/api/tiktok/download', authMiddleware, tiktokRoutes.download);
app.get('/api/tiktok/search', authMiddleware, tiktokRoutes.search);
app.get('/api/tiktok/stalk', authMiddleware, tiktokRoutes.stalk);

app.get('/api/youtube/download', authMiddleware, youtubeRoutes.download);
app.get('/api/youtube/mp3', authMiddleware, youtubeRoutes.mp3);

app.get('/api/instagram/download', authMiddleware, instagramRoutes.download);
app.get('/api/instagram/search', authMiddleware, instagramRoutes.search);
app.get('/api/instagram/stalk', authMiddleware, instagramRoutes.stalk);

app.get('/api/pinterest/search', authMiddleware, pinterestRoutes.search);
app.get('/api/pinterest/download', authMiddleware, pinterestRoutes.download);

app.get('/api/twitter/download', authMiddleware, twitterRoutes.download);
app.get('/api/twitter/search', authMiddleware, twitterRoutes.search);
app.get('/api/twitter/stalk', authMiddleware, twitterRoutes.stalk);

app.get('/api/ai/chat', authMiddleware, aiRoutes.chat);
app.get('/api/ai/kayzen', authMiddleware, aiRoutes.kayzen);
app.get('/api/ai/image', authMiddleware, aiRoutes.image);
app.get('/api/ai/text', authMiddleware, aiRoutes.text);
app.get('/api/ai/analyze', authMiddleware, aiRoutes.analyze);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
