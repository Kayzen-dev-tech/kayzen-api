# Kayzen API Professional 🚀

<p align="center">
  <img src="./public/banner.jpg" alt="Kayzen API Banner" width="100%" style="border-radius: 10px;">
</p>

<p align="center">
    <a href="https://github.com/Kayzen-dev-tech/kayzen-api"><img src="https://img.shields.io/badge/build-passing-brightgreen?style=flat-square&logo=github"></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-20.x-blue?style=flat-square&logo=node.js"></a>
    <a href="https://expressjs.com"><img src="https://img.shields.io/badge/express-4.x-white?style=flat-square&logo=express"></a>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-orange?style=flat-square"></a>
    <a href="https://vercel.com"><img src="https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel"></a>
</p>

<p align="center">
  <b>A High-Performance REST API built with Node.js, Express, and Vercel Serverless Functions.</b><br>
  Features Modern UI, AI Integration, and Scraper Tools.
</p>

---

## 📑 Quick Documentation

To keep this repository clean, detailed documentation is separated into the following files:

| 📂 Topic | 📝 Description |
| :--- | :--- |
| [**⚙️ Installation**](./INSTALLATION.md) | How to set up and run locally. |
| [**📡 Endpoints**](./ENDPOINTS.md) | List of all available API routes (TikTok, AI, etc). |
| [**🛡️ Security**](./SECURITY.md) | Security policies and reporting vulnerabilities. |
| [**🤝 Contributing**](./CONTRIBUTING.md) | Guidelines for contributing to this project. |
| [**👥 Authors**](./AUTHORS.md) | Credits to the developer and special thanks. |
| [**📜 Changelog**](./CHANGELOG.md) | History of versions and updates. |

---

## 🌟 Key Features

### 🎨 Frontend (UI/UX)
* **Modern Aesthetic:** Dark mode interface with Glassmorphism effects.
* **Interactive Profile:** Dynamic typing text, social media hub, and profile showcase.
* **Image Gallery:** Responsive carousel sliders for Cosplay & "My Bini" collections.
* **Live Docs:** Try-it-out feature directly on the website (`/docs`).

### ⚙️ Backend (API)
* **All-in-One Downloader:** Support for TikTok, Instagram, YouTube, Twitter, and Pinterest.
* **Stalking Tools:** Get profile data from TikTok, Instagram, and Twitter.
* **Search Engine:** Search content across multiple social platforms.
* **Artificial Intelligence:** 5+ Endpoints including Chat, Image Gen, and Code Explanation.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js 20 (LTS)
* **Framework:** Express.js (Serverless optimized)
* **HTTP Client:** Axios
* **Scraping:** Cheerio
* **Styling:** Tailwind CSS (via CDN)
* **Deployment:** Vercel

---

## 📂 Project Structure

```text
kayzen-api/
├── api/                  # Serverless Entry Points
│   └── index.js          # Main Express App
├── lib/                  # Helper Functions
│   ├── ai.js             # AI Logic
│   └── scraper.js        # Scraper Logic (TikTok, IG, YT, etc)
├── public/               # Static Assets
│   ├── index.html        # Landing Page
│   ├── docs.html         # Documentation Page
│   └── (images...)       # jpg assets
├── vercel.json           # Vercel Config
├── package.json          # Dependencies
└── README.md             # Main Documentation
