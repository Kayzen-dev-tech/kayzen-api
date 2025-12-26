<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Courier+New&weight=800&size=35&pause=1000&color=00F3FF&center=true&vCenter=true&width=600&lines=KAYZEN+IZUMI+REST+API;Professional+Backend+Service;Cyberpunk+Aesthetic+UI;Made+for+Vercel+Deployment" alt="Typing Animation" />
</a>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-ONLINE-00F3FF?style=for-the-badge" />
</p>

<p align="center">
  <b>High-Performance REST API with Cyberpunk Interface.</b><br>
  Optimized for Serverless functions.
</p>

[🌐 Live Demo](#) &nbsp;•&nbsp; [📖 Documentation](/public/docs.html) &nbsp;•&nbsp; [🐛 Report Bug](#)

</div>

---

## 🌟 Introduction

**Kayzen API** adalah proyek backend modular berbasis **Node.js** dan **Express**. Dirancang khusus untuk **Vercel Serverless**, proyek ini menggabungkan logika scraper yang kuat dengan antarmuka frontend (Landing Page) bertema Cyberpunk yang estetik.

### ✨ Key Features
* 🖥️ **Cyberpunk UI:** Tampilan Dark Mode dengan efek Neon dan Image Sliders.
* ⚡ **Interactive Docs:** Halaman `/docs` untuk mencoba endpoint secara langsung.
* 📥 **Media Scrapers:** TikTok (No WM), MxDrop, & Pinterest.
* 🤖 **AI Simulation:** Chat, Image Gen, dan Code Assistant.
* 🔐 **API Key System:** Keamanan query parameter sederhana.

---

## 🔌 API Endpoints List

Semua request membutuhkan parameter: `?apikey=kayzen123`

### 📥 Downloader & Search
> Fitur untuk mengunduh media dan mencari konten.

* ![GET](https://img.shields.io/badge/GET-2ea44f?style=for-the-badge) ` /api/tiktok `
    * **Param:** `url`
    * **Desc:** Download video TikTok tanpa watermark.

* ![GET](https://img.shields.io/badge/GET-2ea44f?style=for-the-badge) ` /api/mxdrop `
    * **Param:** `url`
    * **Desc:** Scrape link download dari MxDrop.

* ![GET](https://img.shields.io/badge/GET-2ea44f?style=for-the-badge) ` /api/pinterest `
    * **Param:** `query`
    * **Desc:** Mencari dan menampilkan 5 gambar aesthetic.

<br>

### 🤖 Artificial Intelligence (AI)
> Simulasi respons kecerdasan buatan.

* ![GET](https://img.shields.io/badge/GET-8A2BE2?style=for-the-badge) ` /api/ai/chat `
    * **Param:** `prompt`
    * **Desc:** Chat interaktif (Simulasi GPT).

* ![GET](https://img.shields.io/badge/GET-8A2BE2?style=for-the-badge) ` /api/ai/image `
    * **Param:** `prompt`
    * **Desc:** Generate link gambar dari teks.

* ![GET](https://img.shields.io/badge/GET-8A2BE2?style=for-the-badge) ` /api/ai/code `
    * **Param:** `prompt`
    * **Desc:** Assistant coding otomatis.

* ![GET](https://img.shields.io/badge/GET-8A2BE2?style=for-the-badge) ` /api/ai/translate `
    * **Param:** `text`, `target`
    * **Desc:** Menerjemahkan bahasa.

---

## 📂 Structure

```text
/kayzen-api
├── api/                  # Serverless Entry Point
├── lib/                  # Helper Functions (Scrapers)
├── public/               # Static Assets & UI
│   ├── images/           # Profile, Banner, Sliders
│   └── index.html        # Cyberpunk Landing Page
├── vercel.json           # Config Deployment
└── package.json          # Dependencies

🚀 Quick Setup
1. Clone Repo
```bash
git clone [https://github.com/username/kayzen-api.git](https://github.com/username/kayzen-api.git)
```

2. Install
```bash
npm install
```

3. Start
```bash
npm start
```

☁️ Deploy Now
Klik tombol di bawah untuk deploy instan ke Vercel (Gratis).
👤 Author
<div align="center">
<img src="./public/profile.jpg" width="120px" style="border-radius: 50%; border: 3px solid #00F3FF; box-shadow: 0 0 15px #00F3FF;">
<h3 style="color: #00F3FF">Kayzen Izumi</h3>
<p><i>Fullstack Developer & DevOps Enthusiast</i></p>
<span>Special Dedication to:</span>

<b>👑 @h___rvn 👑</b>
</div>
<p align="center">
&copy; 2024 Kayzen API. All Rights Reserved.
</p>
