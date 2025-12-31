# 🚀 Deployment Guide

## 📁 Complete Project Structure

```
kayzen-izumi-api/
├── api/
│   ├── tiktok/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   ├── youtube/
│   │   ├── download.js
│   │   └── mp3.js
│   ├── instagram/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   ├── pinterest/
│   │   ├── search.js
│   │   └── download.js
│   ├── twitter/
│   │   ├── download.js
│   │   ├── search.js
│   │   └── stalk.js
│   └── ai/
│       ├── chat.js
│       ├── kayzen.js
│       ├── image.js
│       ├── text.js
│       └── analyze.js
├── public/
│   ├── index.html
│   ├── docs.html
│   ├── profile.jpg (YOUR PROFILE PHOTO)
│   ├── banner.jpg (YOUR BANNER IMAGE)
│   ├── slide1.jpg to slide15.jpg (COSPLAYER PHOTOS)
│   └── bini1.jpg to bini5.jpg (BINI PHOTOS)
├── node_modules/
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── vercel.json
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd kayzen-izumi-api
npm install
```

### 2. Environment Variables

Create `.env` file:

```env
API_KEY=kayzen2025
ADMIN_PASSWORD=KAY2025ZEN
PORT=3000
NODE_ENV=development
```

### 3. Add Your Images

Place these images in the `public/` folder:
- `profile.jpg` - Your profile picture
- `banner.jpg` - Banner background image
- `slide1.jpg` through `slide15.jpg` - Cosplayer images for slider
- `bini1.jpg` through `bini5.jpg` - Your bini's photos for slider

### 4. Test Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to test.

## 🌐 Deploy to Vercel

### Method 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Method 2: GitHub Integration

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: (leave empty)
6. Add Environment Variables:
   - `API_KEY`: kayzen2025
   - `ADMIN_PASSWORD`: KAY2025ZEN
7. Deploy!

### Method 3: Deploy Button

Add this to your README:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/your-repo)
```

## 🔑 Access Credentials

### For Users
- **Access Code**: `KAY2025ZEN` (Login modal on homepage)
- **API Key**: `kayzen2025` (After login)

### For You (Developer)
Change these in `.env` file for security!

## 📝 Important Notes

1. **Images**: Make sure all image files exist in `public/` folder
2. **API Keys**: Some APIs use demo keys - replace with real ones for production
3. **Rate Limiting**: Configured for 100 requests per 15 minutes
4. **CORS**: Enabled for all origins (adjust for production)
5. **Security**: Change default API key and access code in production!

## 🎨 Customization

### Change Colors
Edit CSS variables in `public/index.html` and `public/docs.html`:

```css
:root {
    --primary: #a855f7;
    --secondary: #ec4899;
    --dark: #0f172a;
}
```

### Change Access Code
Edit in `.env`:
```env
ADMIN_PASSWORD=YourNewPassword
```

### Change API Key
Edit in `.env`:
```env
API_KEY=YourNewAPIKey
```

## 🐛 Troubleshooting

### Issue: "Module not found"
**Solution**: Run `npm install`

### Issue: "Port already in use"
**Solution**: Change PORT in `.env` or kill process using port 3000

### Issue: Images not loading
**Solution**: 
1. Check if images exist in `public/` folder
2. Verify image names match exactly (case-sensitive)
3. Check file extensions (.jpg, .jpeg, .png)

### Issue: API not working
**Solution**:
1. Check if API key is correct
2. Verify endpoint URLs in code
3. Check API rate limits

## 📊 Performance Tips

1. Optimize images before uploading (compress to < 500KB each)
2. Use CDN for better performance
3. Enable caching in Vercel settings
4. Monitor API usage and rate limits

## 🔒 Security Checklist

- [ ] Changed default API key
- [ ] Changed default access code
- [ ] Added rate limiting
- [ ] Enabled HTTPS (automatic on Vercel)
- [ ] Validated user inputs
- [ ] Implemented error handling
- [ ] Set up CORS properly

## 📈 Monitoring

Check your deployment at:
- Vercel Dashboard: [vercel.com/dashboard](https://vercel.com/dashboard)
- Analytics: Built-in Vercel Analytics
- Logs: Vercel Function Logs

## 🎯 Next Steps

1. Test all endpoints in `/docs`
2. Monitor error logs
3. Optimize slow endpoints
4. Add more features as needed
5. Update documentation

## 💡 Pro Tips

- Use environment variables for sensitive data
- Test locally before deploying
- Keep dependencies updated
- Monitor API usage
- Backup your code regularly

## 🤝 Support

If you encounter issues:
1. Check logs in Vercel dashboard
2. Review this guide
3. Check API documentation
4. Test endpoints individually

---

Made with ❤️ by Kayzen Izumi
