<div align="center">

<a href="https://git.io/typing-svg">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&weight=600&size=30&pause=1000&color=00D2FF&center=true&vCenter=true&width=500&lines=Kayzen+Izumi+API;Simple.+Fast.+Powerful.;Best+Rest+API+for+Bot+Devs" alt="Typing SVG" />
</a>

<p align="center">
    <b>Layanan RESTful API Gratis untuk Automasi WhatsApp, Telegram, & Discord Bot.</b><br>
    Dilengkapi dengan Dokumentasi Interaktif, AI Tools, & E-Commerce Scraping.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express" />
  <img src="https://img.shields.io/badge/Status-Active-2ea44f?style=for-the-badge" />
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
* **Instagram Downloader:** Download Post, Reels, dan Slide (Carousel).
* **Pinterest Search:** Cari gambar aesthetic dengan mudah.
* **Videy Upload:** Upload video ke server Videy (Buffer support).

### ![Shop](https://img.shields.io/badge/SHOP-E--Commerce-orange?style=for-the-badge&logo=shopee&logoColor=white)
* **Lazada Search:** Scraping data produk, harga, dan rating dari Lazada.

### ![AI](https://img.shields.io/badge/AI-Artificial_Intelligence-00d2ff?style=for-the-badge&logo=openai&logoColor=white)
* **Image Editor AI:** Ubah gambar menggunakan prompt teks.
* **Lyrics Generator:** Buat lirik lagu otomatis berdasarkan topik.

### ![Tools](https://img.shields.io/badge/TOOLS-Maker_&_Util-4B0082?style=for-the-badge&logo=codesandbox&logoColor=white)
* **Lirik Lagu:** Cari lirik lagu lengkap dari database.
* **Anime Info:** Info lengkap anime, manga, dan karakter.

---

## 💻 Instalasi

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/UsernameKamu/kayzen-api.git](https://github.com/UsernameKamu/kayzen-api.git)
    cd kayzen-api
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Server**
    ```bash
    npm start
    ```

---

## 🔗 Daftar Endpoint Lengkap

### 📥 Media & Download
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/download/instagram` | `?url=` | Download IG Post/Reels |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/pinterest` | `?q=` | Cari Gambar Pinterest |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/wallpaper` | `?q=` | Cari Wallpaper HD |
| ![POST](https://img.shields.io/badge/POST-FFA500?style=flat-square) | `/api/tools/upload-videy` | `buffer` (JSON Body) | Upload Video ke Videy |

### 🛒 E-Commerce
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/search/lazada` | `?q=` | Cari Produk Lazada |

### 🛠️ Tools & AI
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/maker/editor` | `?url=&prompt=` | Edit Gambar dengan AI |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/lyrics` | `?q=` | Generate Lirik AI |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/tools/lirik-lagu` | `?q=` | Cari Lirik Lagu (Original) |

### ⛩️ Anime & Manga
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/search` | `?q=` | Cari Anime (MAL) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/manga` | `?q=` | Cari Manga (MAL) |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/character` | `?q=` | Cari Karakter Anime |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/anime/top` | *-* | Top Anime Rating |

### 🧩 Random & Info
| Method | Endpoint | Parameter | Deskripsi |
| :---: | :--- | :--- | :--- |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/waifu` | *-* | Gambar Waifu Random |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/random/neko` | *-* | Gambar Neko Random |
| ![GET](https://img.shields.io/badge/GET-2ea44f?style=flat-square) | `/api/info/gempa` | *-* | Info Gempa BMKG |

---

## 📂 Struktur Folder

```bash
/kayzen-api
├── index.js             # Logic Server
├── package.json         # Config Dependencies
├── /views               # Tampilan UI
│   ├── home.ejs
│   └── docs.ejs
└── /public              # File Statis
