<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=00D2FF&center=true&vCenter=true&width=500&lines=Kayzen+Izumi+API;Simple.+Fast.+Powerful.;Best+Rest+API+for+Bot+Devs" alt="Typing SVG" />
</a>

<p align="center">
    <b>Layanan RESTful API Gratis untuk Automasi WhatsApp, Telegram, & Discord Bot.</b><br>
    Dilengkapi dengan Dokumentasi Interaktif, Social Media Stalker, & Media Downloader.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <a href="#-daftar-endpoint-lengkap">Lihat Endpoint</a> •
  <a href="#-instalasi">Cara Install</a> •
  <a href="#-struktur-folder">Struktur File</a>
</p>

<hr>

</div>

## ✨ Fitur Unggulan

Berikut adalah fitur-fitur terbaru yang tersedia di Kayzen API:

### ![Downloader](https://img.shields.io/badge/DOWNLOADER-Media-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
* **All-in-One Downloader:** Support download video dari TikTok (No WM), Instagram (Reels/Post), Pinterest, dan YouTube Search.
* **Search Media:** Cari video TikTok dan gambar Pinterest tanpa login.

### ![Stalk](https://img.shields.io/badge/STALKER-Sosmed_&_Game-181717?style=for-the-badge&logo=github&logoColor=white)
* **Social Stalk:** Intip profil Instagram, TikTok, Reddit, Wattpad, dan GitHub.
* **Game Stalk:** Cek profil pemain Steam.
* **Dev Stalk:** Cek info paket NPM.

### ![Anime](https://img.shields.io/badge/WIBU_AREA-Anime_&_Manga-FF69B4?style=for-the-badge&logo=myanimelist&logoColor=white)
* **Search Anime & Manga:** Cari info detail dari MyAnimeList.
* **Character Search:** Info karakter anime favorit.
* **Top Anime:** List anime rating tertinggi.

### ![Tools](https://img.shields.io/badge/TOOLS-Maker_&_Util-4B0082?style=for-the-badge&logo=codesandbox&logoColor=white)
* **Brat Maker:** Buat meme teks di papan hijau/putih (Viral).
* **ASCII Art:** Ubah teks menjadi seni kode ASCII.
* **IP Lookup:** Cek lokasi server IP.

---

## 💻 Instalasi

Jalankan API ini di komputer lokal atau server kamu sendiri:

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/UsernameKamu/kayzen-api.git](https://github.com/UsernameKamu/kayzen-api.git)
    cd kayzen-api
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Aset (Wajib)**
    Pastikan folder `public/images/` berisi file berikut:
    * `profile.jpg` (Foto Profil)
    * `banner.jpg` (Banner Background)
    * `brat.jpg` (Template Maker)
    * `slide1.jpg` s/d `slide15.jpg` (Slider Cosplay)

4.  **Jalankan Server**
    ```bash
    npm start
    ```

---

## 🔗 Daftar Endpoint Lengkap

### 📥 Media Download & Search
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/youtube` | `?q=` | Search & Download Audio YouTube |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/tiktok` | `?url=` | Download TikTok (No WM) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/instagram` | `?url=` | Download IG Reels/Post |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/pinterest` | `?url=` | Download Media Pinterest |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/tiktok` | `?q=` | Cari Video TikTok |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/pinterest` | `?q=` | Cari Gambar Pinterest |

### 🕵️ Stalker
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/github` | `?username=` | Stalk GitHub User |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/instagram` | `?username=` | Stalk Instagram User |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/tiktok` | `?username=` | Stalk TikTok User |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/steam` | `?username=` | Stalk Steam Profile |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/wattpad` | `?username=` | Stalk Wattpad User |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/reddit` | `?username=` | Stalk Reddit User |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/npm` | `?package=` | Info Paket NPM |

### ⛩️ Anime & Manga
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/search` | `?q=` | Cari Anime (MAL) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/manga` | `?q=` | Cari Manga (MAL) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/character` | `?q=` | Cari Karakter |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/top` | *-* | Top Anime Rating |

### 🛠️ Tools & Maker
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/maker/brat` | `?text=` | Buat Meme Brat (Anime Style) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/ascii` | `?text=` | Convert Text to ASCII |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/ip-lookup` | *-* | Cek Lokasi IP Server |

### 🧩 Random & Info
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/waifu` | *-* | Gambar Waifu Random |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/neko` | *-* | Gambar Neko Random |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/wallpaper` | `?q=` | Cari Wallpaper HD |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/info/gempa` | *-* | Info Gempa BMKG |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/wiki` | `?q=` | Wikipedia Indonesia |

---

## 📂 Struktur Folder

```bash
/kayzen-api
├── index.js             # 🧠 Logic Server Utama
├── package.json         # 📦 Config Dependencies
├── vercel.json          # ⚡ Config Vercel
├── /views               # 🎨 Tampilan HTML/EJS
│   ├── home.ejs         # Homepage UI
│   └── docs.ejs         # Dokumentasi UI
└── /public              # 🗂️ File Statis
    ├── /css
    └── /images
