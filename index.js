const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const ytSearch = require('yt-search');
const { createCanvas, loadImage } = require('canvas');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

async function pinterestDl(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/pindl?url=${url}`);
        if (!data.status) return { error: "Failed" };
        return { url: data.result.url, type: data.result.media_type };
    } catch (e) { return { error: "Error" }; }
}

async function igStalk(username) {
    try {
        const { data } = await axios.get(`https://api.agatz.xyz/api/stalkig?username=${username}`);
        if (data.status !== 200) return { error: "Not found" };
        return data.data;
    } catch (e) { return { error: "Error" }; }
}

async function igDownload(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/igdl?url=${url}`);
        if (!data.status) return { error: "Failed" };
        return data.result; 
    } catch (e) { return { error: "Error" }; }
}

async function tiktokSearch(query) {
    try {
        const { data } = await axios.post("https://www.tikwm.com/api/feed/search", new URLSearchParams({ keywords: query, count: 10, cursor: 0, web: 1, hd: 1 }));
        return data.data ? data.data.videos : [];
    } catch (e) { return []; }
}

async function tiktokStalk(username) {
    try {
        const { data } = await axios.post("https://www.tikwm.com/api/user/info", new URLSearchParams({ unique_id: username }));
        return data.data ? data.data : { error: "Not found" };
    } catch (e) { return { error: "Not found" }; }
}

async function pinterestSearch(query) {
    try {
        const { data } = await axios.get(`https://www.pinterest.com/search/pins/?q=${query}`);
        const $ = cheerio.load(data);
        const results = [];
        $('script[data-relay-response="true"]').each((i, el) => {
            try {
                const json = JSON.parse($(el).text());
                const pins = json.response.data.v3_feeds_search_pins.results;
                pins.forEach(pin => { if (pin.images && pin.images.orig) results.push(pin.images.orig.url); });
            } catch (e) {}
        });
        if (results.length === 0) {
            $('img').each((i, el) => { const img = $(el).attr('src'); if (img && img.includes('pinimg.com/originals')) results.push(img); });
        }
        return results.slice(0, 10);
    } catch (e) { return []; }
}

async function scrapeAnime(q){try{const{data}=await axios.get(`https://myanimelist.net/anime.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const d=$(e).find('div.pt4').text().trim();if(t)r.push({title:t,desc:d,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeManga(q){try{const{data}=await axios.get(`https://myanimelist.net/manga.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const d=$(e).find('div.pt4').text().trim();if(t)r.push({title:t,desc:d,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeCharacter(q){try{const{data}=await axios.get(`https://myanimelist.net/character.php?q=${q}`);const $=cheerio.load(data);const r=[];$('table').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const n=$(e).find('td').eq(1).find('strong').text().trim();if(n)r.push({name:n,img})});return r.slice(0,5)}catch(e){return[]}}
async function scrapeTopAnime(){try{const{data}=await axios.get(`https://myanimelist.net/topanime.php`);const $=cheerio.load(data);const r=[];$('.ranking-list').each((i,e)=>{const t=$(e).find('.detail .hoverinfo_trigger').text().trim();const s=$(e).find('.score .text').text();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,score:s,img})});return r.slice(0,5)}catch(e){return[]}}
async function githubStalk(u){try{const{data}=await axios.get(`https://api.github.com/users/${u}`);return{username:data.login,bio:data.bio,avatar:data.avatar_url,url:data.html_url}}catch(e){return{error:"Not found"}}}
async function redditStalk(u){try{const{data}=await axios.get(`https://www.reddit.com/user/${u}/about.json`);const d=data.data;return{username:d.name,karma:d.total_karma,avatar:d.icon_img}}catch(e){return{error:"Not found"}}}
async function npmStalk(p){try{const{data}=await axios.get(`https://registry.npmjs.org/${p}`);return{name:data.name,desc:data.description,version:data['dist-tags'].latest}}catch(e){return{error:"Not found"}}}
async function steamStalk(u){try{const{data}=await axios.get(`https://steamcommunity.com/id/${u}`);const $=cheerio.load(data);const n=$('.actual_persona_name').text().trim();const img=$('.playerAvatarAutoSizeInner img').attr('src');if(!n)return{error:"Not found"};return{username:n,avatar:img}}catch(e){return{error:"Not found"}}}
async function wattpadStalk(u){try{const{data}=await axios.get(`https://www.wattpad.com/user/${u}`);const $=cheerio.load(data);const n=$('.profile-name').text().trim();const img=$('.avatar img').attr('src');if(!n)return{error:"Not found"};return{username:n,avatar:img}}catch(e){return{error:"Not found"}}}
async function scrapeWallpaper(q){try{const{data}=await axios.get(`https://www.wallpaperflare.com/search?wallpaper=${q}`);const $=cheerio.load(data);const r=[];$('#gallery > li > figure > a').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(img)r.push(img)});return r.slice(0,10)}catch(e){return[]}}
async function scrapeGempa(){try{const{data}=await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");const $=cheerio.load(data,{xmlMode:true});const g=$('Infogempa').find('gempa');return{tanggal:g.find('Tanggal').text(),jam:g.find('Jam').text(),wilayah:g.find('Wilayah').text(),magnitude:g.find('Magnitude').text(),shakemap:"https://data.bmkg.go.id/DataMKG/TEWS/"+g.find('Shakemap').text()}}catch(e){return{error:"Error"}}}
async function scrapeWiki(q){try{const{data}=await axios.get(`https://id.m.wikipedia.org/wiki/${q}`);const $=cheerio.load(data);const t=$('h1#section_0').text().trim();const s=$('div#mf-section-0 p').first().text().trim();let img=$('table.infobox img').first().attr('src');if(img&&!img.startsWith('http'))img='https:'+img;return{title:t,summary:s,image:img}}catch(e){return{error:"Not found"}}}
async function getWaifu(t){try{const{data}=await axios.get(t==='nsfw'?'https://api.waifu.im/search?is_nsfw=true':'https://api.waifu.im/search');return data.images[0]}catch(e){return null}}
async function makeAscii(t){try{const{data}=await axios.get(`https://artii.herokuapp.com/make?text=${t}`);return{ascii:data}}catch(e){return{error:"Failed"}}}

app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

app.get('/api/download/youtube', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); try{const r=await ytSearch(q);res.json({status:true,creator:"Kayzen",data:r.videos.slice(0,5)})}catch(e){res.json({status:false})} });
app.get('/api/download/tiktok', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); try{const {data}=await axios.get(`https://www.tikwm.com/api/?url=${u}`);if(data.code===0)res.json({status:true,creator:"Kayzen",data:{title:data.data.title,video:data.data.play,audio:data.data.music}});else res.json({status:false})}catch(e){res.json({status:false})} });
app.get('/api/download/instagram', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); const r = await igDownload(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/download/pinterest', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); const r = await pinterestDl(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/tiktok', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); const r = await tiktokSearch(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/pinterest', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); const r = await pinterestSearch(q); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/stalk/github', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await githubStalk(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/reddit', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await redditStalk(u); if(r.avatar)r.image=r.avatar; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/npm', async (req, res) => { const p=req.query.package; if(!p) return res.json({status:false}); const r=await npmStalk(p); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/steam', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await steamStalk(u); if(r.avatar)r.image=r.avatar; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/wattpad', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await wattpadStalk(u); if(r.avatar)r.image=r.avatar; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/instagram', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await igStalk(u); if(r&&r.avatar_url)r.image=r.avatar_url; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/tiktok', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await tiktokStalk(u); if(r.user&&r.user.avatar)r.image=r.user.avatar; res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/anime/search', async (req, res) => { const q=req.query.q; const r=await scrapeAnime(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/manga', async (req, res) => { const q=req.query.q; const r=await scrapeManga(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/character', async (req, res) => { const q=req.query.q; const r=await scrapeCharacter(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/top', async (req, res) => { const r=await scrapeTopAnime(); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/tools/ascii', async (req, res) => { const t=req.query.text; const r=await makeAscii(t); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/tools/ip-lookup', async (req, res) => { try{const{data}=await axios.get('http://ip-api.com/json/');res.json({status:true,creator:"Kayzen",data:data})}catch(e){res.json({status:false})} });
app.get('/api/maker/brat', async (req, res) => { 
    const text = req.query.text; 
    if (!text) return res.json({ status: false, message: "Param ?text=" }); 
    try { 
        const background = await loadImage(path.join(__dirname, 'public/images/brat.jpg')); 
        const canvas = createCanvas(background.width, background.height); 
        const ctx = canvas.getContext('2d'); 
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height); 
        ctx.font = 'bold 35px Sans'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; 
        wrapText(ctx, text, canvas.width / 2, canvas.height - 180, 300, 40); 
        const buffer = canvas.toBuffer('image/jpeg'); res.set('Content-Type', 'image/jpeg'); res.send(buffer); 
    } catch (e) { res.json({ status: false, message: "brat.jpg missing" }); } 
});

app.get('/api/random/waifu', async (req, res) => { const r=await getWaifu('sfw'); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/random/neko', async (req, res) => { try{const{data}=await axios.get("https://nekos.best/api/v2/neko");res.json({status:true,creator:"Kayzen",data:data.results[0]})}catch(e){res.json({status:false})} });
app.get('/api/search/wallpaper', async (req, res) => { const q=req.query.q; if(!q) return res.json({status:false}); const r=await scrapeWallpaper(q); if(r.length===0) return res.json({status:false}); res.json({status:true,creator:"Kayzen",data:{image:r[Math.floor(Math.random()*r.length)]}}); });
app.get('/api/info/gempa', async (req, res) => { const r=await scrapeGempa(); if(r.shakemap)r.image=r.shakemap; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/wiki', async (req, res) => { const q=req.query.q; if(!q) return res.json({status:false}); const r=await scrapeWiki(q); if(r.image)r.image=r.image; res.json({status:true,creator:"Kayzen",data:r}); });

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
        
