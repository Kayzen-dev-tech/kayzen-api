# ⚡ Quick Reference - Cheat Sheet

Panduan cepat untuk command & informasi penting.

---

## 🚀 Setup Commands

```bash
# Clone dan install
git clone <repo-url>
cd kayzen-api
npm install

# Development
npm run dev
npm start

# Environment
cp .env.example .env
nano .env

# Deploy
vercel
```

---

## 🌐 URLs

| Environment | URL | Purpose |
|-------------|-----|---------|
| Local | http://localhost:3000 | Development |
| Local Docs | http://localhost:3000/docs | API Testing |
| Production | https://kayzen-api.vercel.app | Live API |
| Prod Docs | https://kayzen-api.vercel.app/docs | Live Docs |
| GitHub | github.com/kayzenfry/kayzen-api | Repository |

---

## 🔑 Default API Key

```
demo-key-123
```

---

## 📁 Key Files

| File | Purpose | Lines |
|------|---------|-------|
| api/index.js | Main server | 150 |
| api/routes/ai.js | AI endpoints | 150 |
| public/index.html | Home page | 500+ |
| public/docs.html | API docs | 800+ |
| package.json | Dependencies | 30 |
| vercel.json | Deployment | 20 |
| README.md | Main docs | 400+ |

---

## 🔌 Endpoint Examples

### Get Quote
```bash
curl "http://localhost:3000/api/misc/quote?apikey=demo-key-123"
```

### AI Chat
```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello!"}'
```

### QR Code
```bash
curl -X POST http://localhost:3000/api/misc/qrcode \
  -H "Content-Type: application/json" \
  -d '{"text":"https://github.com"}'
```

### Sentiment Analysis
```bash
curl -X POST http://localhost:3000/api/ai/sentiment \
  -H "Content-Type: application/json" \
  -d '{"text":"I love this!"}'
```

---

## 📚 Documentation Files

| File | Read Time | When to Use |
|------|-----------|------------|
| QUICK_START.md | 5 min | New setup |
| SETUP_GUIDE.md | 20 min | Detailed setup |
| README.md | 15 min | Overview |
| GITHUB_SETUP.md | 15 min | GitHub upload |
| FINAL_CHECKLIST.md | 10 min | Before launch |
| ARCHITECTURE.md | 10 min | Understanding system |

---

## 🐛 Common Issues & Fixes

### Port Already in Use
```bash
PORT=3001 npm run dev
```

### Module Not Found
```bash
rm -rf node_modules
npm install
```

### API Key Not Working
- Check `.env` file
- Verify request includes `?apikey=KEY`
- Restart server

### Images Not Loading
- Check file path in HTML
- Verify file exists in `/public/images/`
- Use relative paths: `./images/file.jpg`

---

## 📊 API Statistics

```
Endpoints:        15+
Routes:          5
Helper Functions: 8
Frontend Pages:   2
Config Files:    7
Documentation:   8
Total Files:     25+
```

---

## 🔐 Authentication

### Query Parameter
```
GET /api/endpoint?apikey=demo-key-123
```

### Header
```
curl -H "X-API-Key: demo-key-123" http://localhost:3000/api/endpoint
```

---

## 📱 Frontend Features

- Dark cyberpunk theme
- 2 carousels (15 + 5 images)
- 7 social media links
- Responsive design
- Modern animations
- Interactive API docs

---

## 🗂️ Folder Structure Quick View

```
kayzen-api/
├── api/
│   ├── index.js
│   ├── routes/ (5 files)
│   └── lib/
├── public/
│   ├── index.html
│   ├── docs.html
│   └── images/
├── package.json
├── vercel.json
└── Docs (8 files)
```

---

## 💡 Tips & Tricks

- Use docs page for testing: `/docs`
- Check API status: `/api/status`
- View all endpoints: `/api/endpoints`
- Copy API key: Click button on docs page
- Test with Postman for advanced testing
- Monitor Vercel dashboard for analytics

---

## 🚀 Deployment Checklist (Quick)

- [ ] npm install complete
- [ ] npm run dev works
- [ ] Endpoints tested on `/docs`
- [ ] Code committed to Git
- [ ] vercel login done
- [ ] vercel deploy executed
- [ ] Production URL accessible
- [ ] Share with team

---

## 🔄 Git Quick Commands

```bash
git status              # Check status
git add .              # Stage all
git commit -m "msg"    # Commit
git push               # Push to remote
git pull               # Pull latest
git log                # View history
git checkout -b name   # New branch
```

---

## 🎯 Version Numbers

- Node.js: 18+
- Express: 4.18+
- Axios: 1.6+
- Vercel: Latest

---

## 📞 Support Contacts

```
Email: kayzen@example.com
WhatsApp: +62 815 2313 006
Telegram: @nonewpo
Instagram: @kayzenfry
GitHub: github.com/kayzenfry
```

---

## ⏱️ Time Estimates

| Task | Time |
|------|------|
| Setup | 5 min |
| Testing | 10 min |
| Add images | 15 min |
| Deploy | 5 min |
| Total | ~45 min |

---

## 🎓 Learning Resources

- Express.js: https://expressjs.com/
- Vercel: https://vercel.com/docs
- Node.js: https://nodejs.org/
- npm: https://docs.npmjs.com/

---

## ✨ Success Indicators

✅ Server runs without errors
✅ All endpoints respond
✅ Images display
✅ Docs page works
✅ API key required for protected endpoints
✅ Deployed to Vercel
✅ GitHub repository public

---

## 🎉 Next Big Wins

1. ✅ Get first 10 GitHub stars
2. ✅ Share on social media
3. ✅ Add to portfolio
4. ✅ Get feedback
5. ✅ Improve based on feedback
6. ✅ Add database (optional)
7. ✅ Scale to production

---

**Keep coding! 🚀**

Version: 1.0 | 2024
