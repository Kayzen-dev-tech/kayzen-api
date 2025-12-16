const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 🧠 FUNGSI SCRAPING & LOGIC
// ==========================================

// --- Anime & Manga ---
async function scrapeAnime(q){try{const{data}=await axios.get(`https://myanimelist.net/anime.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const d=$(e).find('div.pt4').text().trim();if(t)r.push({title:t,desc:d,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeManga(q){try{const{data}=await axios.get(`https://myanimelist.net/manga.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const d=$(e).find('div.pt4').text().trim();if(t)r.push({title:t,desc:d,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeCharacter(q){try{const{data}=await axios.get(`https://myanimelist.net/character.php?q=${q}`);const $=cheerio.load(data);const r=[];$('table').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const n=$(e).find('td').eq(1).find('strong').text().trim();if(n)r.push({name:n,img})});return r.slice(0,5)}catch(e){return[]}}
async function scrapeTopAnime(){try{const{data}=await axios.get(`https://myanimelist.net/topanime.php`);const $=cheerio.load(data);const r=[];$('.ranking-list').each((i,e)=>{const t=$(e).find('.detail .hoverinfo_trigger').text().trim();const s=$(e).find('.score .text').text();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,score:s,img})});return r.slice(0,5)}catch(e){return[]}}

// --- Random & Info ---
async function scrapeWallpaper(q){try{const{data}=await axios.get(`https://www.wallpaperflare.com/search?wallpaper=${q}`);const $=cheerio.load(data);const r=[];$('#gallery > li > figure > a').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(img)r.push(img)});return r.slice(0,10)}catch(e){return[]}}
async function scrapeGempa(){try{const{data}=await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");const $=cheerio.load(data,{xmlMode:true});const g=$('Infogempa').find('gempa');return{tanggal:g.find('Tanggal').text(),jam:g.find('Jam').text(),wilayah:g.find('Wilayah').text(),magnitude:g.find('Magnitude').text(),shakemap:"https://data.bmkg.go.id/DataMKG/TEWS/"+g.find('Shakemap').text()}}catch(e){return{error:"Error"}}}
async function getWaifu(t){try{const{data}=await axios.get(t==='nsfw'?'https://api.waifu.im/search?is_nsfw=true':'https://api.waifu.im/search');return data.images[0]}catch(e){return null}}

// --- Social Media ---
async function pinterestSearch(query) {
    try {
        const modifiedQuery = `${query} aesthetic`;
        const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${query}&data={"options":{"isPrefetch":false,"query":"${modifiedQuery}","scope":"pins","no_fetch_context_on_resource":false},"context":{}}`);
        const results = data?.resource_response?.data?.results || [];
        return results.map(v => ({
            id: v.id,
            title: v.grid_title || v.title,
            image: v.images?.orig?.url || v.images['736x']?.url
        })).filter(v => v.image).sort(() => Math.random() - 0.5);
    } catch (e) { return []; }
}

async function scrapeIG(url) {
    try {
        const { data } = await axios.get(`https://media.mollygram.com/?url=${encodeURIComponent(url)}`, {
            headers: { "accept": "*/*", "accept-language": "id-ID", "referer": "https://mollygram.com/" }
        });
        if (!data.html) return null;
        const $ = cheerio.load(data.html);
        const username = $("#user_info p.h4").text().trim();
        const caption = $(".d-flex.justify-content-between.align-items-center p.text-sm").first().text().trim();
        const videoUrl = $("video source").attr("src");
        const imageUrls = [];
        $("#download_content .col-md-4 .card-header img").each((i, el) => {
            const img = $(el).attr("src");
            if (img) imageUrls.push(img);
        });
        let result = { username, caption, type: "image", media: imageUrls };
        if (videoUrl) { result.type = "video"; result.media = [videoUrl]; } 
        else if (imageUrls.length > 1) { result.type = "slide"; }
        return result;
    } catch (e) { return null; }
}

// --- Tools & AI ---
async function generateLyrics(prompt) {
    try {
        const { data } = await axios.post('https://lyricsgenerator.com/api/completion', { prompt }, {
            headers: { 'content-type': 'application/json', 'referer': 'https://lyricsgenerator.com' }
        });
        return data;
    } catch (e) { return "Gagal mengambil lirik AI"; }
}

async function scrapeLirik(query) {
    try {
        const { data } = await axios.get(`https://lirik.my/?s=${encodeURIComponent(query)}`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });
        const $ = cheerio.load(data);
        const link = $("article.post").find(".entry-title a").attr("href");
        if (!link) return null;
        const { data: page } = await axios.get(link, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });
        const $$ = cheerio.load(page);
        $$(".entry-content script, .entry-content style").remove();
        return $$(".entry-content").text().trim();
    } catch (e) { return null; }
}

async function scrapeImgEditor(url, prompt) {
    try {
        const buffer = await axios.get(url, { responseType: 'arraybuffer' }).then(res => res.data);
        const info = await axios.post("https://imgeditor.co/api/get-upload-url", {
            fileName: "image.jpg", contentType: "image/jpeg", fileSize: buffer.length
        }).then(res => res.data);
        await axios.put(info.uploadUrl, buffer, { headers: { "content-type": "image/jpeg" } });
        const gen = await axios.post("https://imgeditor.co/api/generate-image", {
            prompt: prompt, styleId: "realistic", mode: "image", imageUrl: info.publicUrl, imageUrls: [info.publicUrl], numImages: 1, outputFormat: "png", model: "nano-banana"
        }).then(res => res.data);
        let status;
        while (true) {
            await new Promise(r => setTimeout(r, 2000));
            status = await axios.get(`https://imgeditor.co/api/generate-image/status?taskId=${gen.taskId}`).then(res => res.data);
            if (status.status === "completed") break;
        }
        return status.imageUrl;
    } catch (e) { return null; }
}

// --- E-Commerce ---
async function scrapeLazada(query) {
    try {
        const headers = {
            'accept': '*/*', 'accept-language': 'id-ID',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'referer': `https://www.lazada.co.id/tag/${query}/`
        };
        const url = `https://www.lazada.co.id/tag/${query}/?ajax=true&catalog_redirect_tag=true&isFirstRequest=true&page=1&q=${query}`;
        const { data } = await axios.get(url, { headers });
        const allItems = data.mods?.listItems || [];
        return allItems.slice(0, 10).map(item => ({
            name: item.name,
            price: `Rp${parseInt(item.price || 0).toLocaleString('id-ID')}`,
            rating: item.ratingScore || 'N/A',
            sold: item.itemSoldCntShow || '0',
            location: item.location || '',
            image: item.image || '',
            link: `https://www.lazada.co.id${item.itemUrl}`
        }));
    } catch (e) { return []; }
}

// ==========================================
// 🔌 ROUTES API
// ==========================================

app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

// Anime
app.get('/api/anime/search', async (req, res) => { const r=await scrapeAnime(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/manga', async (req, res) => { const r=await scrapeManga(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/character', async (req, res) => { const r=await scrapeCharacter(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/top', async (req, res) => { const r=await scrapeTopAnime(); res.json({status:true,creator:"Kayzen",data:r}); });

// Random & Info
app.get('/api/random/waifu', async (req, res) => { const r=await getWaifu('sfw'); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/random/neko', async (req, res) => { try{const{data}=await axios.get("https://nekos.best/api/v2/neko");res.json({status:true,creator:"Kayzen",data:data.results[0]})}catch(e){res.json({status:false})} });
app.get('/api/search/wallpaper', async (req, res) => { const q=req.query.q; if(!q) return res.json({status:false}); const r=await scrapeWallpaper(q); if(r.length===0) return res.json({status:false}); res.json({status:true,creator:"Kayzen",data:{image:r[Math.floor(Math.random()*r.length)]}}); });
app.get('/api/info/gempa', async (req, res) => { const r=await scrapeGempa(); if(r.shakemap)r.image=r.shakemap; res.json({status:true,creator:"Kayzen",data:r}); });

// Media & Tools
app.get('/api/search/pinterest', async (req, res) => { const r=await pinterestSearch(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/download/instagram', async (req, res) => { const r=await scrapeIG(req.query.url); res.json({status:!!r,creator:"Kayzen",data:r}); });
app.get('/api/tools/lyrics', async (req, res) => { const r=await generateLyrics(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/tools/lirik-lagu', async (req, res) => { const r=await scrapeLirik(req.query.q); res.json({status:!!r,creator:"Kayzen",data:{lyrics:r}}); });
app.get('/api/maker/editor', async (req, res) => { const r=await scrapeImgEditor(req.query.url, req.query.prompt); res.json({status:!!r,creator:"Kayzen",data:{url:r}}); });
app.get('/api/search/lazada', async (req, res) => { const r=await scrapeLazada(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });

// Start Server
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
