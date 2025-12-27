# 🚀 Setup Guide - Kayzen API Professional

Panduan lengkap untuk setup, development, dan deployment Kayzen API.

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda sudah install:

- **Node.js** v18+ - [Download](https://nodejs.org/)
- **npm** atau **yarn** - Biasanya bundled dengan Node.js
- **Git** - [Download](https://git-scm.com/)
- **Text Editor/IDE** - VSCode recommended
- **Vercel CLI** (untuk deployment) - `npm install -g vercel`

### Verifikasi Installation
```bash
node --version    # Should show v18.x or higher
npm --version     # Should show 9.x or higher
git --version     # Should show 2.x or higher
```

---

## 🎯 Step-by-Step Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/kayzenfry/kayzen-api.git
cd kayzen-api
```

### Step 2: Install Dependencies

```bash
npm install
```

Ini akan install semua package yang diperlukan:
- express
- axios
- dotenv
- cors
- morgan
- cheerio

Tunggu sampai selesai (biasanya 2-5 menit).

### Step 3: Setup Environment Variables

```bash
cp .env.example .env
```

Edit file `.env` dengan text editor:

```env
NODE_ENV=development
PORT=3000
API_KEY=demo-key-123
LOG_LEVEL=info
VERCEL_ENV=preview
```

**Important**: Jangan share `.env` file ke public!

### Step 4: Prepare Image Assets

Folder `/public/images` harus berisi:

```
public/images/
├── profile.jpg           # Foto profil (200x200 px)
├── banner.jpg            # Banner (1920x1080 px)
├── cosplay/
│   ├── slide1.jpg
│   ├── slide2.jpg
│   ├── slide3.jpg
│   ├── slide4.jpg
│   ├── slide5.jpg
│   ├── slide6.jpg
│   ├── slide7.jpg
│   ├── slide8.jpg
│   ├── slide9.jpg
│   ├── slide10.jpg
│   ├── slide11.jpg
│   ├── slide12.jpg
│   ├── slide13.jpg
│   ├── slide14.jpg
│   └── slide15.jpg       # 15 gambar total
└── bini/
    ├── bini1.jpg
    ├── bini2.jpg
    ├── bini3.jpg
    ├── bini4.jpg
    └── bini5.jpg         # 5 gambar total
```

**Jika belum punya gambar:**
- Gunakan placeholder: `https://via.placeholder.com/200x200?text=Profile`
- Atau buat folder dan file kosong terlebih dahulu
- HTML akan default menampilkan placeholder jika gambar tidak ada

### Step 5: Run Development Server

```bash
npm run dev
```

Output yang diharapkan:
```
🚀 Server running on port 3000
📄 Visit http://localhost:3000/docs for documentation
```

### Step 6: Test API

Buka browser dan coba:

**Home Page:**
```
http://localhost:3000
```

**API Documentation:**
```
http://localhost:3000/docs
```

**Test Endpoint:**
```
http://localhost:3000/api/status
```

---

## 🔧 Development Workflow

### File Structure Review
```bash
kayzen-api/
├── api/
│   ├── index.js
│   ├── routes/
│   │   ├── tiktok.js
│   │   ├── youtube.js
│   │   ├── pinterest.js
│   │   ├── ai.js
│   │   └── misc.js
│   └── lib/
│       └── scrapers.js
├── public/
│   ├── index.html
│   ├── docs.html
│   └── images/
│       ├── profile.jpg
│       ├── banner.jpg
│       ├── cosplay/
│       └── bini/
├── .env
├── .gitignore
├── package.json
├── vercel.json
└── README.md
```

### Common Development Tasks

#### Add New Endpoint
1. Create file di `/api/routes/` (e.g., `newfeature.js`)
2. Import di `api/index.js`
3. Add route: `app.use('/api/newfeature', newfeatureRoutes);`
4. Test dengan curl atau docs page

#### Modify HTML
- Edit `/public/index.html` atau `/public/docs.html`
- Server akan auto-reload
- Refresh browser untuk lihat perubahan

#### Update API Key
1. Edit `.env` file
2. Change `API_KEY=new-secret-key`
3. Restart server (stop + run again)

#### Add New Dependencies
```bash
npm install package-name
```

---

## 🧪 Testing API

### Using Browser
Buka `http://localhost:3000/docs` dan gunakan interactive "Try it out" feature.

### Using cURL

**Get Quote:**
```bash
curl "http://localhost:3000/api/misc/quote?apikey=demo-key-123"
```

**Get Joke:**
```bash
curl "http://localhost:3000/api/misc/joke?apikey=demo-key-123"
```

**AI Chat:**
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello AI!"}'
```

**Sentiment Analysis:**
```bash
curl -X POST http://localhost:3000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"I love this API!"}'
```

### Using Postman
1. Download [Postman](https://www.postman.com/downloads/)
2. Import endpoints
3. Set `apikey` parameter di query
4. Test requests

---

## 🚀 Deployment ke Vercel

### Option 1: Using Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel login
```

Deploy:
```bash
vercel
```

Follow prompts dan tunggu deployment selesai.

### Option 2: GitHub Integration

1. Push ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/kayzen-api.git
git push -u origin main
```

2. Connect ke Vercel:
   - Visit https://vercel.com
   - Click "Add New Project"
   - Import dari GitHub repository
   - Click "Deploy"

3. Tunggu deployment selesai

### Post-Deployment

Setelah deploy, update:
- Social media links dengan vercel domain
- Database credentials (jika ada)
- Production API key di `.env` Vercel dashboard

**Production URL akan terlihat seperti:**
```
https://kayzen-api-alpha.vercel.app
```

---

## 🔐 Environment Variables Management

### Local Development (.env)
```env
NODE_ENV=development
PORT=3000
API_KEY=demo-key-123
LOG_LEVEL=info
```

### Vercel Dashboard Settings

1. Go to Project Settings
2. Environment Variables
3. Add:
   - `NODE_ENV` = `production`
   - `API_KEY` = `your-production-key`
   - Rebuild project

---

## 🐛 Troubleshooting

### Problem: Port 3000 already in use
**Solution:**
```bash
PORT=3001 npm run dev
```

### Problem: Module not found errors
**Solution:**
```bash
rm -rf node_modules
npm install
```

### Problem: API Key not working
**Solution:**
1. Check `.env` file
2. Check request includes `?apikey=VALUE`
3. Restart server

### Problem: Images not loading
**Solution:**
1. Check file path di HTML
2. Verify file exists di `/public/images/`
3. Check file permissions
4. Use relative paths: `./images/file.jpg`

### Problem: Vercel deployment failed
**Solution:**
1. Check build logs di Vercel dashboard
2. Verify `vercel.json` config
3. Check `package.json` scripts
4. Ensure all dependencies listed

---

## 📊 Project Statistics

- **Total Endpoints:** 15+
- **Routes:** 5 (tiktok, youtube, pinterest, ai, misc)
- **Database:** None (stateless API)
- **Dependencies:** 7 main packages
- **File Size:** ~50KB (without node_modules)
- **Deployment:** Vercel Serverless

---

## 🔄 Git Workflow

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: Kayzen API Professional"
git remote add origin https://github.com/username/kayzen-api.git
git branch -M main
git push -u origin main
```

### Regular Commits
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### .gitignore checked items:
- ✅ node_modules/
- ✅ .env (local)
- ✅ .DS_Store
- ✅ .vscode/
- ✅ *.log

---

## 📚 Learn More

- **Express.js Docs:** https://expressjs.com/
- **Vercel Docs:** https://vercel.com/docs
- **Node.js API:** https://nodejs.org/api/
- **Axios Guide:** https://axios-http.com/

---

## 💡 Tips & Best Practices

1. **Always test locally first** before deploying
2. **Keep API keys secret** - Never commit to Git
3. **Use meaningful variable names** - Makes code readable
4. **Comment important logic** - Wait, no comments per spec!
5. **Test all endpoints** - Use docs page for testing
6. **Monitor Vercel logs** - Check deployment errors
7. **Update dependencies** - `npm update` periodically
8. **Backup your work** - Commit to Git regularly

---

## 🎓 Next Steps

After successful setup:

1. ✅ Customize social media links dengan data Anda
2. ✅ Replace placeholder images dengan foto asli
3. ✅ Update profile info di index.html
4. ✅ Generate production API key
5. ✅ Deploy ke Vercel
6. ✅ Test production endpoints
7. ✅ Share API documentation dengan team

---

## 📞 Support & Contact

**Having issues?**

1. Check FAQ di README.md
2. Review error logs
3. Contact: kayzen@example.com
4. WhatsApp: +62 815 2313 006

---

**Happy coding! 🎉**

Made with ❤️ by Kayzen Izumi | 2024
