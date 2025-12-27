```
╔═══════════════════════════════════════════════════════════════╗
║                    KAYZEN API - PROFESSIONAL                 ║
║             REST API dengan Modern UI & AI Features           ║
╚═══════════════════════════════════════════════════════════════╝
```

![Vercel](https://img.shields.io/badge/Vercel-deployed-00d4ff?style=flat-square&logo=vercel)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-4.18+-blue?style=flat-square&logo=express)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active-00ff41?style=flat-square)
![API](https://img.shields.io/badge/API-REST-ff006e?style=flat-square)

---

## 🚀 Overview

**Kayzen API** adalah REST API professional yang siap di-deploy ke Vercel dengan fitur-fitur powerful:

- 📥 **Social Media Tools** - TikTok, YouTube, Pinterest integration
- 🤖 **AI Features** - Chat, Image Generation, Translation, Summarization, Sentiment Analysis
- 🔒 **Security** - API Key Authentication
- 🎨 **Modern UI** - Cyberpunk/Dark Mode aesthetic dengan Carousel Gallery
- 📱 **Responsive Design** - Mobile-friendly interface
- 📊 **15+ Endpoints** - Comprehensive API coverage

---

## 📋 Features

### Social Media Integration
- ✅ **TikTok**: Download & Search videos
- ✅ **YouTube**: Download videos & Convert to MP3
- ✅ **Pinterest**: Search high-quality images

### AI & NLP
- ✅ **Chat AI**: Conversational assistant
- ✅ **Image Generation**: Text-to-image synthesis
- ✅ **Translation**: Multi-language support (EN, ID, ES, FR, DE, JA)
- ✅ **Summarization**: Text summarization engine
- ✅ **Sentiment Analysis**: Emotion detection

### Utilities
- ✅ **QR Code Generator**: Create QR codes
- ✅ **Quote Generator**: Random motivational quotes
- ✅ **Joke API**: Programming humor
- ✅ **Weather**: Weather information
- ✅ **Meme**: Random memes

### Documentation
- ✅ **Interactive Docs**: Try-it-out feature in docs
- ✅ **API Status**: Health check endpoint
- ✅ **Endpoint List**: Comprehensive endpoint directory

---

## 🛠️ Tech Stack

```
Runtime:        Node.js 18+
Framework:      Express.js 4.18+
Deployment:     Vercel (Serverless)
Scraping:       Axios + Cheerio
Authentication: API Key (Query/Header)
```

---

## 📁 Project Structure

```
kayzen-api/
├── api/
│   ├── index.js                 # Main server & routes
│   ├── routes/
│   │   ├── tiktok.js           # TikTok endpoints
│   │   ├── youtube.js          # YouTube endpoints
│   │   ├── pinterest.js        # Pinterest endpoints
│   │   ├── ai.js               # AI features
│   │   └── misc.js             # Utility endpoints
│   └── lib/
│       └── scrapers.js         # Helper functions
├── public/
│   ├── index.html              # Home page
│   ├── docs.html               # API documentation
│   ├── profile.jpg             # Profile picture
│   ├── banner.jpg              # Banner background
│   ├── slide1-15.jpg           # Cosplay gallery
│   └── bini1-5.jpg             # Bini gallery
├── package.json                # Dependencies
├── vercel.json                 # Vercel config
├── .env                        # Environment variables
├── .gitignore                  # Git ignore rules
└── README.md                   # Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git (untuk repository)

### Installation

```bash
git clone https://github.com/kayzenfry/kayzen-api.git
cd kayzen-api
npm install
```

### Environment Setup

```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=production
PORT=3000
API_KEY=your-secret-key-123
```

### Local Development

```bash
npm run dev
```

Server akan berjalan di `http://localhost:3000`

### Vercel Deployment

```bash
npm install -g vercel
vercel login
vercel
```

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:3000
Production:  https://your-vercel-domain.vercel.app
```

### Authentication

Semua endpoint memerlukan API Key via:

**Query Parameter:**
```
GET /api/endpoint?apikey=YOUR_KEY
```

**Header:**
```
Headers: {
  "X-API-Key": "YOUR_KEY"
}
```

**Default Demo Key:** `demo-key-123`

---

## 🎯 Endpoint Examples

### TikTok Download
```bash
curl "http://localhost:3000/api/tiktok/download?url=https://www.tiktok.com/@user/video/123&apikey=demo-key-123"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "title": "Video Title",
    "author": "@username",
    "downloadUrl": "...",
    "thumbnail": "...",
    "likes": 1000,
    "comments": 500
  }
}
```

### YouTube to MP3
```bash
curl "http://localhost:3000/api/youtube/mp3?url=https://www.youtube.com/watch?v=VIDEO_ID&apikey=demo-key-123"
```

### AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "query": "Hello!",
    "response": "Halo! Ada yang bisa saya bantu?",
    "model": "AI-Chat"
  }
}
```

### Pinterest Search
```bash
curl "http://localhost:3000/api/pinterest/search?query=aesthetic+anime&apikey=demo-key-123"
```

---

## 🎨 Frontend Features

### Home Page (`/`)
- Profile section dengan foto & banner
- About section (Me & My Bini)
- Image Carousel (15 cosplay slides + 5 bini slides)
- Social media links (7 platform)
- Modern cyberpunk dark theme
- Responsive design

### Documentation (`/docs`)
- Interactive API testing
- Try-it-out feature untuk setiap endpoint
- Real-time response viewing
- API Key management
- Endpoint discovery

---

## 🔐 Security

- ✅ API Key Authentication
- ✅ CORS enabled
- ✅ Environment variables
- ✅ Input validation
- ✅ Error handling

---

## 📊 Endpoints Summary

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/tiktok/download` | Download TikTok video | ✅ |
| GET | `/api/tiktok/search` | Search TikTok | ✅ |
| GET | `/api/youtube/download` | Download YouTube | ✅ |
| GET | `/api/youtube/mp3` | YouTube to MP3 | ✅ |
| GET | `/api/pinterest/search` | Pinterest search | ✅ |
| POST | `/api/ai/chat` | Chat with AI | ❌ |
| POST | `/api/ai/translate` | Translate text | ❌ |
| POST | `/api/ai/summarize` | Summarize text | ❌ |
| POST | `/api/ai/sentiment` | Sentiment analysis | ❌ |
| POST | `/api/ai/image-gen` | Generate image | ❌ |
| GET | `/api/misc/quote` | Random quote | ✅ |
| GET | `/api/misc/joke` | Random joke | ✅ |
| GET | `/api/misc/meme` | Random meme | ✅ |
| POST | `/api/misc/qrcode` | QR code generator | ❌ |
| GET | `/api/status` | API status | ❌ |

---

## 🚀 Deploy to Vercel

### Option 1: Using Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push ke GitHub
2. Connect di https://vercel.com
3. Import project
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kayzenfry/kayzen-api)

---

## 📱 Social Media

- 💬 **WhatsApp**: [+62 815 2313 006](https://wa.me/628152313006)
- ✈️ **Telegram**: [@nonewpo](https://t.me/nonewpo)
- 📷 **Instagram**: [@kayzenfry](https://instagram.com/kayzenfry)
- 🎬 **YouTube**: [@kayzenfry](https://youtube.com/@kayzenfry)
- 🎵 **TikTok**: [@scz_kayzen](https://tiktok.com/@scz_kayzen)
- 👰 **My Bini**: [@h___rvn](https://instagram.com/h___rvn)
- 💌 **WhatsApp Channel**: [Follow](https://whatsapp.com/channel/0029VbBRpUN8F2pMzHjQqz3S)

---

## 📝 License

MIT License - feel free to use for personal and commercial projects

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 🐛 Bug Reports & Support

Found a bug? Create an issue on GitHub!

**Email**: kayzen@example.com

---

## 📈 Roadmap

- [ ] Database integration (MongoDB)
- [ ] Advanced authentication (OAuth2)
- [ ] Rate limiting
- [ ] Webhook support
- [ ] WebSocket real-time updates
- [ ] GraphQL API
- [ ] Mobile app

---

## ⚡ Performance

- 🚀 Serverless architecture (Vercel)
- ⚡ Fast response times (<500ms)
- 📊 Optimized queries
- 🔄 Caching mechanisms
- 🌍 CDN delivery

---

## 📞 Support

Butuh bantuan? Hubungi:

```
📧 Email: kayzen@example.com
💬 WhatsApp: +62 815 2313 006
🌐 Website: https://kayzen-api.vercel.app
📱 Instagram: @kayzenfry
```

---

**Made with ❤️ by Kayzen Izumi**

```
███╗   ██╗ ██████╗ ██████╗ ███████╗
████╗  ██║██╔═══██╗██╔══██╗██╔════╝
██╔██╗ ██║██║   ██║██║  ██║█████╗
██║╚██╗██║██║   ██║██║  ██║██╔══╝
██║ ╚████║╚██████╔╝██████╔╝███████╗
╚═╝  ╚═══╝ ╚═════╝ ╚═════╝ ╚══════╝
```

v1.0.0 | Professional REST API | 2024
