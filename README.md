<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=00D2FF&center=true&vCenter=true&width=500&lines=Kayzen+Izumi+API;Simple.+Fast.+Powerful.;Best+Rest+API+for+Bot+Devs" alt="Typing SVG" />
</a>

<p align="center">
    <b>Layanan RESTful API Gratis untuk Automasi WhatsApp, Telegram, & Discord Bot.</b><br>
    Dilengkapi dengan Dokumentasi Interaktif & Fitur Scraping Real-time.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-121212?style=for-the-badge&logo=vercel&logoColor=white" />
</p>

<p align="center">
  <a href="#-daftar-endpoint-lengkap">Lihat Endpoint</a> •
  <a href="#-instalasi">Cara Install</a> •
  <a href="#-struktur-folder">Struktur File</a>
</p>

<hr>

</div>

## ✨ Fitur Unggulan

Berikut adalah fitur-fitur yang tersedia, dikelompokkan dengan ikon kategori:

### ![Downloader](https://img.shields.io/badge/DOWNLOADER-Media-FF0000?style=for-the-badge&logo=youtube&logoColor=white)
* **TikTok No Watermark:** Download video TikTok bersih tanpa logo + Audio MP3.
* **YouTube Search:** Cari video YouTube dan dapatkan link streaming.

### ![Anime](https://img.shields.io/badge/WIBU_AREA-Anime_&_Manga-FF69B4?style=for-the-badge&logo=myanimelist&logoColor=white)
* **Search Anime & Manga:** Cari info detail anime/komik dari MyAnimeList.
* **Character Search:** Info lengkap karakter wibu (Husbu/Waifu).
* **Top Anime:** Daftar anime dengan rating tertinggi saat ini.

### ![Tools](https://img.shields.io/badge/TOOLS-Maker_&_Util-4B0082?style=for-the-badge&logo=codesandbox&logoColor=white)
* **Brat Generator:** Buat meme teks di papan putih viral (ala Charli XCX).
* **ASCII Art:** Ubah teks biasa menjadi seni kode ASCII.
* **IP Lookup:** Cek detail lokasi dari IP Address.

### ![Stalk](https://img.shields.io/badge/STALKER-Github_&_Sosmed-181717?style=for-the-badge&logo=github&logoColor=white)
* **GitHub Stalk:** Intip profil, repository, dan bio user GitHub.
* **Reddit Stalk:** Cek karma, akun, dan avatar user Reddit.
* **NPM Stalk:** Cek info paket library Node.js.

### ![Info](https://img.shields.io/badge/INFO-News_&_Random-FFA500?style=for-the-badge&logo=google-news&logoColor=white)
* **Gempa Terkini:** Info gempa real-time + Peta Guncangan (Data BMKG).
* **Waifu & Neko:** Generate gambar anime random (SFW).
* **Wallpaper HD:** Cari wallpaper PC/HP resolusi tinggi.

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
    * `slide1.jpg` s/d `slide15.jpg` (Slider)

4.  **Jalankan Server**
    ```bash
    npm start
    ```

---

## 🔗 Daftar Endpoint Lengkap

Tabel di bawah ini berisi rincian endpoint yang bisa kamu gunakan di bot kamu.

### 📥 Download & Media
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/tiktok` | `?url=` | Download Video TikTok (No WM) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/youtube` | `?q=` | Search Video YouTube |

### ⛩️ Anime & Manga
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/search` | `?q=` | Cari Detail Anime (MAL) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/manga` | `?q=` | Cari Detail Manga |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/character` | `?q=` | Cari Karakter Anime |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/top` | *-* | Top Anime Rating Tertinggi |

### 🛠️ Tools & Maker
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/maker/brat` | `?text=` | Buat Meme Text "Brat" |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/ascii` | `?text=` | Convert Teks ke ASCII |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/ip-lookup` | *-* | Cek Info Lokasi Server IP |

### 🕵️ Stalker
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/github` | `?username=` | Stalk Profil GitHub |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/reddit` | `?username=` | Stalk Profil Reddit |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/stalk/npm` | `?package=` | Cek Info Paket NPM |

### 🧩 Random & Info
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/waifu` | *-* | Gambar Waifu (SFW) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/neko` | *-* | Gambar Neko (SFW) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/wallpaper` | `?q=` | Cari Wallpaper HD |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/info/gempa` | *-* | Info Gempa BMKG |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/wiki` | `?q=` | Wikipedia Indonesia |

---

## 📂 Struktur Folder

```bash
/kayzen-api
├── index.js             # 🧠 Logic Server Utama
├── package.json         # 📦 Config Dependencies
├── /views               # 🎨 Tampilan HTML/EJS
│   ├── home.ejs         # Homepage UI
│   └── docs.ejs         # Dokumentasi UI
└── /public              # 🗂️ File Statis (Gambar/CSS)
    ├── /css
    └── /images
```
<div align="center">
<p>Dibuat dengan oleh <b>Kayzen Izumi</b></p>
<p>Jangan lupa kasih ⭐ Star jika repo ini bermanfaat!</p>
</div>
