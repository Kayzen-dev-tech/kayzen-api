# 🚀 Kayzen API

<div align="center">

![Kayzen API Banner](https://img.shields.io/badge/Kayzen-API-blueviolet?style=for-the-badge&logo=vercel)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/status-active-success?style=for-the-badge)

**Free REST API untuk Downloader, AI Tools, dan Image Search**

[🌐 Demo](https://kayzen-api.vercel.app) • [📚 Documentation](https://kayzen-api.vercel.app/docs) • [💬 Support](https://wa.me/628152313006)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [API Endpoints](#-api-endpoints)
- [Usage Examples](#-usage-examples)
- [Rate Limiting](#-rate-limiting)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Contact](#-contact)
- [License](#-license)

---

## 🌟 Overview

Kayzen API adalah REST API gratis yang menyediakan berbagai layanan termasuk:
- 📥 **Downloader** - Download video dari TikTok, MXDrop
- 🤖 **AI Tools** - Akses ke ChatGPT, Gemini, Claude, GPT-4, dan Llama
- 🖼️ **Image Search** - Pencarian gambar dari Pinterest

API ini dibangun dengan Node.js dan dapat di-deploy dengan mudah di Vercel.

---

## ✨ Features

### 🎬 Media Downloader
- ✅ TikTok Video Downloader (HD Quality)
- ✅ TikTok Video Search
- ✅ MXDrop Media Downloader
- ✅ No Watermark Option
- ✅ Fast & Reliable

### 🧠 AI Integration
- ✅ ChatGPT Integration
- ✅ Google Gemini AI
- ✅ Claude AI
- ✅ GPT-4 Access
- ✅ Llama AI Model
- ✅ Natural Language Processing

### 🖼️ Image Tools
- ✅ Pinterest Image Search
- ✅ High Quality Images
- ✅ Multiple Results (5 images per request)

### 🔐 Security
- ✅ API Key Authentication
- ✅ Rate Limiting
- ✅ CORS Enabled
- ✅ Error Handling

---

## 🛠️ Installation

### Prerequisites
- Node.js 14.x or higher
- npm or yarn
- Vercel CLI (optional)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/kayzen-api.git
cd kayzen-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Run locally**
```bash
npm run dev
```

4. **Access the API**
- Home: `http://localhost:3000`
- Docs: `http://localhost:3000/docs`
- API: `http://localhost:3000/api/...`

---

## 📡 API Endpoints

### Base URL
```
https://your-domain.vercel.app/api
```

### Authentication
Semua endpoint memerlukan API key:
```
?apikey=YOUR_API_KEY
```

### 📥 Downloader Endpoints

#### 1. TikTok Download
```http
GET /api/tikwm/download?url={TIKTOK_URL}&apikey={YOUR_KEY}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | TikTok video URL |
| apikey | string | Yes | Your API key |

**Response:**
```json
{
  "status": true,
  "data": {
    "title": "Video Title",
    "author": "Author Name",
    "play_count": 1000000,
    "download_count": 50000,
    "video": "https://...",
    "video_hd": "https://...",
    "music": "https://...",
    "cover": "https://..."
  },
  "developer": "Kayzen Izumi"
}
```

#### 2. TikTok Search
```http
GET /api/tikwm/search?query={SEARCH_QUERY}&apikey={YOUR_KEY}
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| query | string | Yes | Search keyword |
| apikey | string | Yes | Your API key |

#### 3. MXDrop Download
```http
GET /api/mxdrop/download?url={MXDROP_URL}&apikey={YOUR_KEY}
```

### 🤖 AI Endpoints

#### 1. ChatGPT
```http
GET /api/ai/chatgpt?text={YOUR_QUESTION}&apikey={YOUR_KEY}
```

#### 2. Gemini AI
```http
GET /api/ai/gemini?text={YOUR_QUESTION}&apikey={YOUR_KEY}
```

#### 3. Claude AI
```http
GET /api/ai/claude?text={YOUR_QUESTION}&apikey={YOUR_KEY}
```

#### 4. GPT-4
```http
GET /api/ai/gpt4?text={YOUR_QUESTION}&apikey={YOUR_KEY}
```

#### 5. Llama AI
```http
GET /api/ai/llama?text={YOUR_QUESTION}&apikey={YOUR_KEY}
```

**AI Response Format:**
```json
{
  "status": true,
  "data": {
    "response": "AI generated response here..."
  },
  "developer": "Kayzen Izumi"
}
```

### 🖼️ Image Search

#### Pinterest Search
```http
GET /api/pinterest?query={SEARCH_QUERY}&apikey={YOUR_KEY}
```

**Response:**
```json
{
  "status": true,
  "data": {
    "query": "anime",
    "count": 5,
    "images": [
      "https://i.pinimg.com/...",
      "https://i.pinimg.com/...",
      "https://i.pinimg.com/...",
      "https://i.pinimg.com/...",
      "https://i.pinimg.com/..."
    ]
  },
  "developer": "Kayzen Izumi"
}
```

---

## 💡 Usage Examples

### JavaScript (Fetch API)
```javascript
const apiKey = 'YOUR_API_KEY';
const query = 'cosplay anime';

fetch(`https://your-api.vercel.app/api/pinterest?query=${query}&apikey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.status) {
      data.data.images.forEach(img => {
        console.log(img);
      });
    }
  })
  .catch(error => console.error('Error:', error));
```

### Python (Requests)
```python
import requests

api_key = 'YOUR_API_KEY'
text = 'Hello, how are you?'

response = requests.get(
    f'https://your-api.vercel.app/api/ai/chatgpt',
    params={'text': text, 'apikey': api_key}
)

data = response.json()
if data['status']:
    print(data['data']['response'])
```

### cURL
```bash
curl "https://your-api.vercel.app/api/tikwm/search?query=dance&apikey=YOUR_API_KEY"
```

### Node.js (Axios)
```javascript
const axios = require('axios');

async function searchPinterest(query) {
  try {
    const response = await axios.get('https://your-api.vercel.app/api/pinterest', {
      params: {
        query: query,
        apikey: 'YOUR_API_KEY'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

searchPinterest('anime wallpaper');
```

---

## ⚡ Rate Limiting

- **Rate Limit:** 100 requests per minute per API key
- **Timeout:** 10 seconds per request
- **Max Response Size:** 10MB

Jika limit terlampaui, API akan mengembalikan:
```json
{
  "status": false,
  "message": "Rate limit exceeded. Please try again later.",
  "developer": "Kayzen Izumi"
}
```

---

## 🚀 Deployment

### Deploy to Vercel

#### Method 1: Via Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Method 2: Via GitHub
1. Push code ke GitHub repository
2. Buka [Vercel Dashboard](https://vercel.com)
3. Click "New Project"
4. Import GitHub repository
5. Deploy!

#### Method 3: Deploy Button
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/kayzen-api)

### Environment Variables (Optional)
Jika ingin menggunakan environment variables untuk API keys:

```env
VALID_API_KEYS=key1,key2,key3
```

Lalu update di file API:
```javascript
const validApiKeys = process.env.VALID_API_KEYS?.split(',') || ['DEMO-KEY'];
```

---

## 📁 Project Structure

```
kayzen-api/
├── api/
│   ├── tikwm/
│   │   ├── download.js       # TikTok downloader endpoint
│   │   └── search.js          # TikTok search endpoint
│   ├── mxdrop/
│   │   └── download.js        # MXDrop downloader endpoint
│   ├── ai/
│   │   ├── chatgpt.js        # ChatGPT endpoint
│   │   ├── gemini.js         # Gemini AI endpoint
│   │   ├── claude.js         # Claude AI endpoint
│   │   ├── gpt4.js           # GPT-4 endpoint
│   │   └── llama.js          # Llama endpoint
│   └── pinterest.js           # Pinterest search endpoint
├── public/
│   ├── index.html             # Homepage
│   ├── docs.html              # Documentation page
│   └── images/                # Static images
├── vercel.json                # Vercel configuration
├── package.json               # Dependencies
└── README.md                  # This file
```

---

## 🤝 Contributing

Kontribusi sangat diterima! Berikut cara berkontribusi:

1. Fork repository ini
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Gunakan ESLint untuk code consistency
- Tambahkan tests untuk features baru
- Update dokumentasi jika diperlukan
- Follow existing code style

---

## 📞 Contact

<div align="center">

### Kayzen Izumi

[![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/628152313006)
[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/nonewpo)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/kayzenfry)
[![YouTube](https://img.shields.io/badge/YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtube.com/@kayzenfry)
[![TikTok](https://img.shields.io/badge/TikTok-000000?style=for-the-badge&logo=tiktok&logoColor=white)](https://tiktok.com/@scz_kayzen)

### My Bini

[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/h___rvn)

### Updates Channel

[![WhatsApp Channel](https://img.shields.io/badge/WhatsApp_Channel-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://whatsapp.com/channel/0029VbBRpUN8F2pMzHjQqz3S)

</div>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Kayzen Izumi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **TikWM API** - For TikTok downloader service
- **Ryzendesu API** - For AI and Pinterest services
- **Vercel** - For amazing serverless deployment
- **Community** - For continuous support and feedback

---

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/kayzen-api?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/kayzen-api?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/yourusername/kayzen-api?style=social)

---

<div align="center">

### ⭐ Star this repository if you find it helpful!

Made with 💜 by **Kayzen Izumi**

**[⬆ Back to Top](#-kayzen-api)**

</div>
