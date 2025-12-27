# Struktur Folder Kayzen API

```
kayzen-api/
│
├── api/
│   ├── index.js                    # File utama server Express
│   ├── routes/
│   │   ├── tiktok.js              # TikTok endpoints
│   │   ├── youtube.js             # YouTube endpoints
│   │   ├── pinterest.js           # Pinterest endpoints
│   │   ├── ai.js                  # AI features endpoints
│   │   └── misc.js                # Misc endpoints (quote, joke, meme, qrcode)
│   │
│   └── lib/
│       └── scrapers.js            # Helper functions untuk scraping & utility
│
├── public/
│   ├── index.html                 # Home page dengan portfolio
│   ├── docs.html                  # API documentation dengan try-it-out
│   │
│   ├── images/
│   │   ├── profile.jpg            # Foto profil Kayzen Izumi
│   │   ├── banner.jpg             # Background banner
│   │   │
│   │   ├── cosplay/
│   │   │   ├── slide1.jpg         # Cosplay image 1
│   │   │   ├── slide2.jpg         # Cosplay image 2
│   │   │   ├── slide3.jpg         # Cosplay image 3
│   │   │   ├── slide4.jpg         # Cosplay image 4
│   │   │   ├── slide5.jpg         # Cosplay image 5
│   │   │   ├── slide6.jpg         # Cosplay image 6
│   │   │   ├── slide7.jpg         # Cosplay image 7
│   │   │   ├── slide8.jpg         # Cosplay image 8
│   │   │   ├── slide9.jpg         # Cosplay image 9
│   │   │   ├── slide10.jpg        # Cosplay image 10
│   │   │   ├── slide11.jpg        # Cosplay image 11
│   │   │   ├── slide12.jpg        # Cosplay image 12
│   │   │   ├── slide13.jpg        # Cosplay image 13
│   │   │   ├── slide14.jpg        # Cosplay image 14
│   │   │   └── slide15.jpg        # Cosplay image 15
│   │   │
│   │   └── bini/
│   │       ├── bini1.jpg          # Bini image 1 (@h___rvn)
│   │       ├── bini2.jpg          # Bini image 2
│   │       ├── bini3.jpg          # Bini image 3
│   │       ├── bini4.jpg          # Bini image 4
│   │       └── bini5.jpg          # Bini image 5
│   │
│   ├── css/ (optional)
│   │   └── style.css              # Custom CSS jika diperlukan
│   │
│   └── js/ (optional)
│       └── api-client.js           # JavaScript utilities
│
├── .env                           # Environment variables (local)
├── .env.example                   # Template environment variables
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies & scripts
├── package-lock.json              # Lock file
├── vercel.json                    # Vercel configuration
├── README.md                      # Project documentation
├── FOLDER_STRUCTURE.md            # File ini
└── SETUP_GUIDE.md                 # Setup guide

```

## Penjelasan Setiap Folder

### `/api`
Folder backend yang berisi logic server Express.

**Subfolder `/routes`:**
- `tiktok.js` - Endpoint untuk download & search TikTok
- `youtube.js` - Endpoint untuk download & MP3 conversion YouTube
- `pinterest.js` - Endpoint untuk search Pinterest
- `ai.js` - Endpoint untuk AI features (chat, translate, summarize, sentiment, image-gen)
- `misc.js` - Endpoint untuk utility (quote, joke, meme, qrcode, weather)

**Subfolder `/lib`:**
- `scrapers.js` - Fungsi helper untuk scraping, validation, parsing

### `/public`
Folder static assets yang di-serve oleh Express.

**File utama:**
- `index.html` - Home page dengan profile, bio, gallery, social links
- `docs.html` - API documentation page dengan interactive testing

**Subfolder `/images`:**
- `profile.jpg` - Foto profil (format JPG, rekomendasi 200x200px)
- `banner.jpg` - Background banner (rekomendasi 1920x1080px)
- `/cosplay/` - 15 gambar untuk carousel slide1-15.jpg
- `/bini/` - 5 gambar untuk carousel bini1-5.jpg

### Root Files

**Configuration:**
- `.env` - Environment variables lokal (jangan push ke Git)
- `.env.example` - Template untuk dev setup
- `package.json` - Node.js dependencies
- `vercel.json` - Konfigurasi deployment ke Vercel
- `.gitignore` - File yang diabaikan Git

**Documentation:**
- `README.md` - Main documentation
- `FOLDER_STRUCTURE.md` - Struktur folder ini
- `SETUP_GUIDE.md` - Panduan setup project

---

## Cara Setup Folder

### 1. Clone Repository
```bash
git clone https://github.com/kayzenfry/kayzen-api.git
cd kayzen-api
```

### 2. Buat Folder Images (jika tidak ada)
```bash
mkdir -p public/images/cosplay
mkdir -p public/images/bini
```

### 3. Tambahkan Gambar
Letakkan file gambar JPG di folder yang sesuai:
- `public/images/profile.jpg` - Foto profil
- `public/images/banner.jpg` - Banner background
- `public/images/cosplay/slide*.jpg` - 15 gambar cosplay
- `public/images/bini/bini*.jpg` - 5 gambar bini

### 4. Install Dependencies
```bash
npm install
```

### 5. Setup Environment
```bash
cp .env.example .env
nano .env  # Edit dengan API key Anda
```

### 6. Run Server
```bash
npm run dev
```

---

## Image Size Recommendations

| File | Recommended Size | Format | Location |
|------|------------------|--------|----------|
| profile.jpg | 200x200 px | JPG | `/public/images/` |
| banner.jpg | 1920x1080 px | JPG | `/public/images/` |
| slide*.jpg | 800x600 px | JPG | `/public/images/cosplay/` |
| bini*.jpg | 600x800 px | JPG | `/public/images/bini/` |

---

## Note untuk Development

### Tidak usah membuat:
- ✗ CSS di folder terpisah (sudah inline di HTML)
- ✗ JS di folder terpisah (sudah inline di HTML)
- ✗ Database folder (API stateless)

### Wajib ada:
- ✅ `/api` folder dengan routes
- ✅ `/public` folder dengan HTML
- ✅ `.env` file untuk config
- ✅ `package.json` dengan dependencies
- ✅ `vercel.json` untuk deployment

---

**Created:** 2024 | Kayzen Izumi
