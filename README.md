<p align="center">
<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=30&pause=1000&color=333333&background=FFFFFF00&center=true&vCenter=true&width=435&lines=KAYZEN+IZUMI+API;Rest+API+All+In+One;Built+For+Developers;Free+to+Use" alt="Typing SVG" />
</p>

<p align="center">
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs" alt="NodeJS"></a>
  <a href="https://expressjs.com"><img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express" alt="Express"></a>
  <a href="#"><img src="https://img.shields.io/badge/Scraper-Cheerio-e34f26?style=for-the-badge&logo=html5" alt="Cheerio"></a>
  <a href="#"><img src="https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge" alt="Status"></a>
</p>

<div align="center">
<pre>
██╗  ██╗ █████╗ ██╗   ██╗███████╗███████╗███╗   ██╗
██║ ██╔╝██╔══██╗╚██╗ ██╔╝╚══███╔╝██╔════╝████╗  ██║
█████╔╝ ███████║ ╚████╔╝   ███╔╝ █████╗  ██╔██╗ ██║
██╔═██╗ ██╔══██║  ╚██╔╝   ███╔╝  ██╔══╝  ██║╚██╗██║
██║  ██╗██║  ██║   ██║   ███████╗███████╗██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚══════╝╚═╝  ╚═══╝
</pre>
</div>

---

## 📝 Deskripsi

**Kayzen API** adalah Rest API *All-in-One* yang menyediakan berbagai layanan scraping, downloader, dan tools AI. Dibangun menggunakan **Express.js** dengan struktur kode yang modular dan mudah dikembangkan. Cocok untuk kebutuhan bot WhatsApp, Telegram, atau Web App.

---

## 🚀 Daftar Fitur

Berikut adalah status layanan yang tersedia.

### 📥 **Downloader & Media**
| Status | Ikon | Fitur | Method | Deskripsi |
| :---: | :---: | :--- | :---: | :--- |
| ✅ | 🎵 | **Spotify Downloader** | `GET` | Download audio dari Spotify URL |
| ✅ | 🍏 | **Apple Music** | `GET` | Download audio dari Apple Music |
| ✅ | 🎬 | **TikTok No WM** | `GET` | Download video TikTok tanpa watermark |
| ✅ | 📸 | **Instagram** | `GET` | Download Post/Reels Instagram |
| ✅ | 🐦 | **Twitter/X** | `GET` | Download video dari Twitter |
| ✅ | ▶️ | **YouTube** | `GET` | Download Video & Audio YouTube |
| ✅ | 📺 | **DailyMotion** | `GET` | Download video DailyMotion |
| ✅ | ☁️ | **MediaFire** | `GET` | Download file dari MediaFire |

### 🔍 **Search & Stalking**
| Status | Ikon | Fitur | Method | Deskripsi |
| :---: | :---: | :--- | :---: | :--- |
| ✅ | 🎧 | **Spotify Search** | `GET` | Cari lagu/playlist di Spotify |
| ✅ | 🕵️ | **IG Stalk** | `GET` | Informasi profil Instagram lengkap |
| ✅ | 🕺 | **TikTok Stalk** | `GET` | Informasi & statistik TikTok user |
| ✅ | 🐦 | **Twitter Stalk** | `GET` | Stalking profil Twitter |
| ✅ | 🏇 | **Umamusume** | `GET` | Info karakter Umamusume |
| ✅ | 🎭 | **Drama Search** | `GET` | Cari Drama Asia (Dramadash) |
| ✅ | 📖 | **Novel Search** | `GET` | Cari Novel (Melolo) |

### 🛠️ **Tools & AI**
| Status | Ikon | Fitur | Method | Deskripsi |
| :---: | :---: | :--- | :---: | :--- |
| ✅ | 🤖 | **Meta AI** | `GET` | Chat AI model Llama 3 70B |
| ✅ | 🔡 | **Image to ASCII** | `POST` | Convert gambar jadi teks ASCII |
| ✅ | 🖼️ | **Remove BG** | `POST` | Hapus background foto |
| ✅ | 👶 | **Baby Generator** | `POST` | Prediksi wajah bayi dari 2 foto |
| ✅ | 🎼 | **Lyrics Gen** | `GET` | Buat lirik lagu otomatis |

### 🎮 **Games & Fun**
| Status | Ikon | Fitur | Method | Deskripsi |
| :---: | :---: | :--- | :---: | :--- |
| ✅ | 🎤 | **Tebak Lirik** | `GET` | Game kuis tebak lirik lagu |

### 📤 **Uploader**
| Status | Ikon | Fitur | Method | Deskripsi |
| :---: | :---: | :--- | :---: | :--- |
| ✅ | 📹 | **Videy.co** | `POST` | Upload file video/image sementara |
| ✅ | 📂 | **Top4Top** | `POST` | Upload file ke Top4top.io |

---

## 📦 Instalasi

Pastikan **Node.js** sudah terinstall.

1. **Clone Project**
   ```bash
   git clone [https://github.com/username/kayzen-api.git](https://github.com/username/kayzen-api.git)
   cd kayzen-api

 * Install Module
   npm install

🏃‍♂️ Menjalankan Server
 * Mode Development (Auto-restart saat edit file):
   npm run dev

 * Mode Production:
   npm start

> Akses dokumentasi di: http://localhost:3000/docs
> 
📂 Struktur Folder
kayzen-api/
├── node_modules/     # Dependencies
├── public/           # File statis (HTML/CSS)
│   ├── index.html    # Halaman Home
│   └── docs.html     # Halaman Dokumentasi API
│   ├── images/       # Folder Slide Images
│   ├── bini1.jpg       # s/d bini5.jpg
│   └── slide1.jpg      # s/d slide15.jpg
├── scrapers/         # Logika Scraping
│   ├── scrapeSpotify.js
│   ├── scrapeIgStalk.js
│   ├── scrapeTebakLirik.js
│   └── ... (lainnya)
├── index.js          # Main Server (Routes)
├── package.json      # Konfigurasi Project
└── README.md         # Dokumentasi Project

<p align="center">
Created by <b>Kayzen</b>
</p>
