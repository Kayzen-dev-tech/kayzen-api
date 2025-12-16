<div align="center">

```text
  _  __                         
 | |/ /__ _ _   _ _______ _ __  
 | ' // _` | | | |_  / _ \ '_ \ 
 | . \ (_| | |_| |/ /  __/ | | |
 |_|\_\__,_|\__, /___\___|_| |_|
            |___/               

🚀 Kayzen Izumi API
Simple, Fast, and Powerful REST API for Bot Automation
<p>
<a href="#-fitur-unggulan">Fitur</a> •
<a href="#-instalasi">Instalasi</a> •
<a href="#-daftar-endpoint">Endpoints</a> •
<a href="#-struktur-folder">Struktur</a>
</p>
</div>
📜 Deskripsi
Kayzen API adalah layanan RESTful API gratis yang dibangun menggunakan Node.js dan Express. Proyek ini dirancang untuk memudahkan developer bot (WhatsApp/Discord/Telegram) dalam mengambil data scraping, media downloader, dan informasi real-time tanpa ribet.
Dilengkapi dengan halaman dokumentasi interaktif yang memiliki fitur Pop-up Preview untuk Video, Audio, dan Gambar.
✨ Fitur Unggulan
Berikut adalah kategori fitur yang tersedia di API ini:
📥 Downloader
TikTok No Watermark: Download video TikTok bersih tanpa logo + Audio.
YouTube Search: Cari video YouTube dan dapatkan link streaming.
⛩️ Anime & Manga
Search Anime: Cari info detail anime dari MyAnimeList.
Search Manga: Cari komik/manga favorit.
Character Search: Info karakter wibu (Husbu/Waifu).
Top Anime: Daftar anime rating tertinggi saat ini.
🛠️ Tools & Maker
Brat Generator: Buat meme teks di papan putih (ala Charli XCX).
ASCII Art: Ubah teks menjadi seni kode ASCII.
IP Lookup: Cek detail lokasi dari IP Address.
🕵️ Stalker
GitHub Stalk: Intip profil, repo, dan bio user GitHub.
Reddit Stalk: Cek karma, akun, dan avatar user Reddit.
NPM Stalk: Cek info paket library Node.js.
🧩 Random & Info
Waifu & Neko: Gambar anime random (SFW).
Wallpaper HD: Cari wallpaper PC/HP resolusi tinggi.
Gempa Terkini: Info gempa real-time + Peta Guncangan (BMKG).
Wikipedia: Cari artikel dan ringkasan edukasi (Bahasa Indonesia).
💻 Instalasi
Ingin menjalankan API ini di komputermu sendiri? Ikuti langkah ini:

1. Clone Repository
git clone [https://github.com/UsernameKamu/kayzen-api.git](https://github.com/UsernameKamu/kayzen-api.git)
cd kayzen-api

2. Install Dependencies
npm install

3. Siapkan Aset Gambar
Pastikan folder public/images/ berisi file berikut agar halaman depan tidak error:
profile.jpg (Foto Profil)
banner.jpg (Background Banner)
brat.jpg (Template untuk fitur Maker)
slide1.jpg s/d slide15.jpg (Untuk Slider Cosplayer)

4. Jalankan Server
npm start

Akses di http://localhost:3000

## 🔗 Daftar Endpoint Lengkap

Berikut adalah daftar lengkap endpoint yang tersedia di API ini:

### 📥 Download & Media
| Method | Endpoint | Deskripsi | Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/download/tiktok` | Download Video TikTok (No WM) & Audio | `?url=link_tiktok` |
| `GET` | `/api/download/youtube` | Search & Download Video YouTube | `?q=judul_lagu` |

### ⛩️ Anime & Manga
| Method | Endpoint | Deskripsi | Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/anime/search` | Cari Detail Anime (MyAnimeList) | `?q=nama_anime` |
| `GET` | `/api/anime/manga` | Cari Detail Manga | `?q=nama_manga` |
| `GET` | `/api/anime/character` | Cari Karakter Anime | `?q=nama_karakter` |
| `GET` | `/api/anime/top` | List Top Anime Rating Tertinggi | *(Tanpa Parameter)* |

### 🕵️ Stalker
| Method | Endpoint | Deskripsi | Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/stalk/github` | Stalk Profil GitHub User | `?username=user_git` |
| `GET` | `/api/stalk/reddit` | Stalk Profil Reddit User | `?username=user_reddit` |
| `GET` | `/api/stalk/npm` | Cek Info Paket NPM (Node.js) | `?package=nama_paket` |

### 🛠️ Tools & Maker
| Method | Endpoint | Deskripsi | Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/maker/brat` | Buat Meme Text "Brat" | `?text=tulisan_kamu` |
| `GET` | `/api/tools/ascii` | Ubah Teks jadi ASCII Art | `?text=tulisan_kamu` |
| `GET` | `/api/tools/ip-lookup` | Cek Info Lokasi Server IP | *(Tanpa Parameter)* |

### 🧩 Random & Info
| Method | Endpoint | Deskripsi | Parameter |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/random/waifu` | Gambar Waifu Random (SFW) | *(Tanpa Parameter)* |
| `GET` | `/api/random/neko` | Gambar Anime Neko Random | *(Tanpa Parameter)* |
| `GET` | `/api/search/wallpaper` | Cari Wallpaper HD | `?q=keyword` |
| `GET` | `/api/info/gempa` | Info Gempa Terkini BMKG | *(Tanpa Parameter)* |
| `GET` | `/api/search/wiki` | Cari Artikel Wikipedia Indonesia | `?q=pertanyaan` |

📂 Struktur Folder
/kayzen-api
│
├── index.js             # Logic Server Utama
├── package.json         # Config Project
├── /views               # Tampilan Website
│   ├── home.ejs         # Homepage Keren
│   └── docs.ejs         # Dokumentasi Pintar
│
└── /public              # File Statis
    ├── /css
    │   └── style.css    # Styling Website
    └── /images          # Tempat simpan Foto/Gambar

🚀 Deploy ke Koyeb
API ini sudah dikonfigurasi agar Auto-Deploy di Koyeb.
Upload kode ini ke GitHub.
Login ke Koyeb.
Create App -> Pilih GitHub -> Pilih Repo ini.
Tunggu hingga status Healthy.
Selesai! API kamu sudah online.
<div align="center">
<p>Dibuat dengan ❤️ oleh <b>Kayzen Izumi</b></p>
<p>&copy; 2025 All Rights Reserved.</p>
</div>
