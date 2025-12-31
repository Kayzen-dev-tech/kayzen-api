<div align="center">

# 🚀 Kayzen Izumi API

![Banner](public/banner.jpg)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Vercel](https://img.shields.io/badge/deployed-vercel-black.svg)

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=32&duration=2800&pause=2000&color=A855F7&center=true&vCenter=true&width=940&lines=Professional+REST+API+Platform;TikTok+%7C+YouTube+%7C+Instagram+%7C+Twitter;AI+Powered+%7C+Media+Downloader;Built+with+Node.js+%2B+Express" alt="Typing SVG" />

### 🌟 Modern REST API with Multiple Features

[Live Demo](https://your-app.vercel.app) • [Documentation](https://your-app.vercel.app/docs) • [Report Bug](https://github.com/yourusername/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Authentication](#-authentication)
- [Deploy to Vercel](#-deploy-to-vercel)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

🎥 **Media Downloader**
- TikTok video downloader, search, and profile stalking
- YouTube video/audio downloader (MP3/MP4)
- Instagram Reels, Photos, search, and profile stalking
- Twitter video downloader, search, and profile stalking
- Pinterest image search and downloader

🤖 **AI Integration**
- AI Chat with Kayzen Izumi personality
- Multiple AI features (GPT, Image Analysis, Text Generation)
- Natural language processing
- Smart responses

🔐 **Security**
- API Key authentication
- Restricted access login system
- Rate limiting
- Input validation

🎨 **Modern UI**
- Dark mode aesthetic
- Responsive design
- Interactive documentation
- Image carousels
- Social media integration

---

## 🛠 Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js
- **Deployment:** Vercel Serverless
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **APIs:** TikTok, YouTube, Instagram, Pinterest, Twitter, AI Models

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- Git

### Clone Repository

```bash
git clone https://github.com/yourusername/kayzen-izumi-api.git
cd kayzen-izumi-api
```

---

## 📦 Installation

1. Install dependencies:

```bash
npm install
```

2. Create `.env` file:

```env
API_KEY=your_secret_api_key_here
ADMIN_PASSWORD=your_admin_password
PORT=3000
```

3. Run development server:

```bash
npm run dev
```

4. Open browser:

```
http://localhost:3000
```

---

## 🌐 API Endpoints

### Media Endpoints

#### TikTok
```http
GET /api/tiktok/download?url={tiktok_url}&apikey={your_key}
GET /api/tiktok/search?query={search_term}&apikey={your_key}
GET /api/tiktok/stalk?username={username}&apikey={your_key}
```

#### YouTube
```http
GET /api/youtube/download?url={youtube_url}&apikey={your_key}
GET /api/youtube/mp3?url={youtube_url}&apikey={your_key}
```

#### Instagram
```http
GET /api/instagram/download?url={instagram_url}&apikey={your_key}
GET /api/instagram/search?query={search_term}&apikey={your_key}
GET /api/instagram/stalk?username={username}&apikey={your_key}
```

#### Pinterest
```http
GET /api/pinterest/search?query={search_term}&apikey={your_key}
GET /api/pinterest/download?url={pinterest_url}&apikey={your_key}
```

#### Twitter
```http
GET /api/twitter/download?url={twitter_url}&apikey={your_key}
GET /api/twitter/search?query={search_term}&apikey={your_key}
GET /api/twitter/stalk?username={username}&apikey={your_key}
```

### AI Endpoints

```http
GET /api/ai/chat?text={your_message}&apikey={your_key}
GET /api/ai/kayzen?text={your_message}&apikey={your_key}
GET /api/ai/image?prompt={image_description}&apikey={your_key}
GET /api/ai/text?prompt={text_prompt}&apikey={your_key}
GET /api/ai/analyze?text={text_to_analyze}&apikey={your_key}
```

---

## 🔑 Authentication

All API endpoints require authentication using API key:

```javascript
?apikey=your_secret_api_key
```

To get access, visit the homepage and login with the restricted access code.

---

## 🚢 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kayzen-izumi-api)

### Manual Deployment

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
vercel --prod
```

---

## 📁 Project Structure

```
kayzen-izumi-api/
├── api/
│   ├── tiktok/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   ├── youtube/
│   │   ├── download.js
│   │   └── mp3.js
│   ├── instagram/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   ├── pinterest/
│   │   ├── search.js
│   │   └── download.js
│   ├── twitter/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   └── ai/
│       ├── chat.js
│       ├── kayzen.js
│       ├── image.js
│       ├── text.js
│       └── analyze.js
├── public/
│   ├── index.html
│   ├── docs.html
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   ├── profile.jpg
│   ├── banner.jpg
│   ├── slide1-15.jpg
│   └── bini1-5.jpg
├── lib/
│   ├── scrapers.js
│   ├── auth.js
│   └── utils.js
├── vercel.json
├── package.json
├── index.js
├── .env.example
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kayzen Izumi**

- Instagram: [@kayzenfry](https://instagram.com/kayzenfry)
- YouTube: [@kayzenfry](https://youtube.com/@kayzenfry)
- TikTok: [@scz_kayzen](https://tiktok.com/@scz_kayzen)
- Telegram: [@nonewpo](https://t.me/nonewpo)
- WhatsApp: [+62 815-2313-006](https://wa.me/628152313006)

---

## 💝 Special Thanks

Special thanks to my bini **@h___rvn** for the support and inspiration.

---

<div align="center">

### ⭐ Star this repo if you find it useful!

Made with ❤️ by Kayzen Izumi

![Profile Views](https://komarev.com/ghpvc/?username=yourusername&color=blueviolet)

</div>
