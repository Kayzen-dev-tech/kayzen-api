const express = require('express')
const cors = require('cors')
const path = require('path')
const { 
  aiChatKayzen, 
  pinterestSearch, 
  tiktokDownloader, 
  youtubeDownloader,
  instagramDownloader 
} = require('../lib/index')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

const isValidKey = (req, res, next) => {
  const { apikey } = req.query
  if (!apikey) return res.status(403).json({ status: false, message: 'Masukin apikey dulu bro (?apikey=kayzen)' })
  if (apikey !== 'kayzen') return res.status(403).json({ status: false, message: 'Apikey salah woi!' })
  next()
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.get('/api/tiktok', isValidKey, async (req, res) => {
  const { url } = req.query
  if (!url) return res.json({ status: false, message: 'Mana URL nya?' })
  const result = await tiktokDownloader(url)
  res.json(result)
})

app.get('/api/youtube', isValidKey, async (req, res) => {
  const { url, type } = req.query
  if (!url) return res.json({ status: false, message: 'URL required' })
  const result = await youtubeDownloader(url, type || 'mp4')
  res.json(result)
})

app.get('/api/instagram', isValidKey, async (req, res) => {
  const { url } = req.query
  if (!url) return res.json({ status: false, message: 'URL required' })
  const result = await instagramDownloader(url)
  res.json(result)
})

app.get('/api/pinterest', isValidKey, async (req, res) => {
  const { query, url } = req.query
  if (url) return res.json({ status: true, type: 'download', url: url })
  if (!query) return res.json({ status: false, message: 'Query required' })
  const images = await pinterestSearch(query)
  res.json({ status: true, count: images.length, result: images })
})

app.get('/api/ai/chat', isValidKey, (req, res) => {
  const { text } = req.query
  if (!text) return res.json({ status: false, message: 'Mau ngomong apa?' })
  const reply = aiChatKayzen(text)
  res.json({ status: true, model: 'Kayzen Izumi (18yo)', response: reply })
})

app.get('/api/ai/math', isValidKey, (req, res) => {
   res.json({ status: true, message: 'Fitur itung-itungan (Coming Soon)' })
})

app.get('/api/ai/code', isValidKey, (req, res) => {
   res.json({ status: true, message: 'Fitur coding helper (Coming Soon)' })
})

app.get('/api/ai/image', isValidKey, (req, res) => {
   res.json({ status: true, message: 'Fitur text to image (Coming Soon)' })
})

app.get('/api/ai/translate', isValidKey, (req, res) => {
   res.json({ status: true, message: 'Fitur translate gaul (Coming Soon)' })
})

app.get('/api/twitter', isValidKey, async (req, res) => {
    res.json({ status: true, platform: 'Twitter', message: 'Endpoint Twitter Ready' })
})

module.exports = app
