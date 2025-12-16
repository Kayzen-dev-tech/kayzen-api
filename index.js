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

// --- FUNGSI SCRAPING (FIXED) ---

// 1. Pinterest Search (New Logic)
async function pinterestSearch(query) {
    const defaultCookie = '_pinterest_sess=Twv...; csrftoken=...'; 
    const defaultCsrftoken = '...';
    
    // User Agents Rotation
    const userAgents = [
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
    ];
    const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
    const randomPageSize = Math.floor(Math.random() * 30) + 20;
    const randomSuffix = Math.floor(Math.random() * 10000);
    const modifiedQuery = `${query} ${randomSuffix}`;
    
    const url = 'https://id.pinterest.com/resource/BaseSearchResource/get/';
    
    const headers = {
        'accept': 'application/json, text/javascript, */*, q=0.01',
        'accept-language': 'id-ID',
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': defaultCookie,
        'origin': 'https://id.pinterest.com',
        'referer': `https://id.pinterest.com/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
        'user-agent': randomUserAgent,
        'x-csrftoken': defaultCsrftoken,
        'x-pinterest-appstate': 'active',
        'x-pinterest-source-url': `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`,
        'x-requested-with': 'XMLHttpRequest',
    };

    const postData = new URLSearchParams();
    postData.append('source_url', `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`);
    postData.append('data', JSON.stringify({
        options: {
            query: modifiedQuery,
            scope: 'pins',
            page_size: randomPageSize,
            appliedProductFilters: '---',
            rs: 'typed',
            redux_normalize_feed: true,
            bookmarks: [],
        },
        context: {},
    }));

    try {
        const { data } = await axios.post(url, postData, { headers });
        const results = data?.resource_response?.data?.results || [];
        const shuffledResults = [...results].sort(() => Math.random() - 0.5);

        return shuffledResults.map((pin) => ({
            id: pin.id,
            title: pin.grid_title || pin.description || "Pinterest Image",
            description: pin.description,
            image: pin.images['736x']?.url || pin.images['474x']?.url || pin.images.orig?.url,
            video: pin.story_pin_data?.pages?.[0]?.blocks?.[0]?.video?.video_list?.V_HLSV3_MOBILE?.url || null,
            pinner: pin.pinner?.full_name || pin.pinner?.username,
            board: pin.board?.name,
        }));
    } catch (e) {
        console.error("Pinterest Error:", e.message);
        return [];
    }
}

// 2. Lazada Search (New Logic)
async function scrapeLazada(query) {
    const url = `https://www.lazada.co.id/tag/${query}/?ajax=true&catalog_redirect_tag=true&isFirstRequest=true&page=1&q=${query}`;
    const headers = {
        'accept': '*/*',
        'accept-language': 'id-ID',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'referer': `https://www.lazada.co.id/tag/${query}/`
    };

    try {
        const { data } = await axios.get(url, { headers });
        const totalResults = data.mainInfo?.totalResults || 0;
        
        // Random page logic
        const totalPages = Math.ceil(totalResults / 40);
        const randomPage = Math.floor(Math.random() * (totalPages > 5 ? 5 : totalPages)) + 1; // Limit page check to avoid too far
        
        const pageUrl = `https://www.lazada.co.id/tag/${query}/?ajax=true&catalog_redirect_tag=true&isFirstRequest=false&page=${randomPage}&q=${query}`;
        const { data: pageData } = await axios.get(pageUrl, { headers });
        
        const allItems = pageData.mods?.listItems || [];
        const shuffledItems = allItems.sort(() => Math.random() - 0.5);
        const selectedItems = shuffledItems.slice(0, 15);
        
        return selectedItems.map((item, index) => ({
            no: index + 1,
            name: item.name || '',
            price: `Rp${parseInt(item.price || 0).toLocaleString('id-ID')}`,
            originalPrice: item.originalPrice ? `Rp${parseInt(item.originalPrice).toLocaleString('id-ID')}` : null,
            rating: item.ratingScore || 'N/A',
            sold: item.itemSoldCntShow || '0',
            location: item.location || '',
            image: item.image || '',
            link: `https://www.lazada.co.id${item.itemUrl || ''}`,
            store: item.sellerName || '',
            brand: item.brandName || 'No Brand'
        }));
    } catch (e) {
        console.error("Lazada Error:", e.message);
        return [];
    }
}

// 3. Image Editor AI (New Logic)
async function scrapeImgEditor(urlInput, prompt) {
    try {
        // Step 1: Download Image Buffer
        const response = await axios.get(urlInput, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Step 2: Get Upload URL
        const info = await axios.post("https://imgeditor.co/api/get-upload-url", {
            fileName: "foto.jpg",
            contentType: "image/jpeg",
            fileSize: buffer.length
        }, {
            headers: { "accept": "*/*", "content-type": "application/json" }
        }).then(r => r.data);

        // Step 3: Upload Image
        await axios.put(info.uploadUrl, buffer, {
            headers: { "content-type": "image/jpeg" }
        });

        // Step 4: Generate
        const gen = await axios.post("https://imgeditor.co/api/generate-image", {
            prompt: prompt,
            styleId: "realistic",
            mode: "image",
            imageUrl: info.publicUrl,
            imageUrls: [info.publicUrl],
            numImages: 1,
            outputFormat: "png",
            model: "nano-banana"
        }, {
            headers: { "accept": "*/*", "content-type": "application/json" }
        }).then(r => r.data);

        // Step 5: Polling Status
        let finalUrl = null;
        for (let i = 0; i < 10; i++) { // Max 20 seconds wait
            await new Promise(r => setTimeout(r, 2000));
            const status = await axios.get(`https://imgeditor.co/api/generate-image/status?taskId=${gen.taskId}`, {
                headers: { "accept": "*/*" }
            }).then(r => r.data);

            if (status.status === "completed") {
                finalUrl = status.imageUrl;
                break;
            }
            if (status.status === "failed") break;
        }
        return finalUrl;

    } catch (e) {
        console.error("Editor Error:", e.message);
        return null;
    }
}

// 4. Lirik Lagu Original (New Logic)
async function scrapeLirik(query) {
    try {
        const { data: html } = await axios.get(`https://lirik.my/?s=${encodeURIComponent(query)}`, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });

        const $ = cheerio.load(html);
        const links = [];

        $("article.post").each((i, el) => {
            const url = $(el).find(".entry-title a").attr("href");
            if (url) links.push(url);
        });

        if (links.length === 0) return null;

        // Pilih link pertama atau random
        const chosen = links.length === 1 ? links[0] : (Math.random() < 0.7 ? links[0] : links[Math.floor(Math.random() * links.length)]);

        const { data: page } = await axios.get(chosen, {
            headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" }
        });

        const $$ = cheerio.load(page);
        const $content = $$(".entry-content").clone();

        $content.find("script,style,.read-more-container,.code-block,.ai-viewports,.wp-block-button").remove();

        const lyrics = $content
            .html()
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n")
            .replace(/<p[^>]*>/gi, "")
            .replace(/<[^>]+>/g, "")
            .split("\n")
            .map((l) => l.trim())
            .filter((l) => l.length)
            .join("\n");

        return lyrics;
    } catch (e) {
        console.error("Lirik Error:", e.message);
        return null;
    }
}

// 5. Wallpaper Flare (Improved with Headers)
async function scrapeWallpaper(q) {
    try {
        const { data } = await axios.get(`https://www.wallpaperflare.com/search?wallpaper=${encodeURIComponent(q)}`, {
            headers: { 
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8"
            }
        });
        const $ = cheerio.load(data);
        const r = [];
        $('li figure a img').each((i, e) => {
            const img = $(e).attr('data-src') || $(e).attr('src');
            if (img) r.push(img);
        });
        return r.slice(0, 10);
    } catch (e) { return [] }
}

// 6. Tools Lainnya
async function generateLyrics(prompt) {
    try {
        const { data } = await axios.post('https://lyricsgenerator.com/api/completion', { prompt });
        return data;
    } catch (e) { return "Error AI"; }
}

async function scrapeIG(url) {
    try {
        const { data } = await axios.get(`https://media.mollygram.com/?url=${encodeURIComponent(url)}`);
        if (!data.html) return null;
        const $ = cheerio.load(data.html);
        const imageUrls = [];
        $("#download_content img").each((i, el) => { const img = $(el).attr("src"); if (img) imageUrls.push(img); });
        const videoUrl = $("video source").attr("src");
        let result = { type: "image", media: imageUrls };
        if (videoUrl) { result.type = "video"; result.media = [videoUrl]; }
        else if (imageUrls.length > 1) { result.type = "slide"; }
        return result;
    } catch (e) { return null; }
}

async function scrapeAnime(q){try{const{data}=await axios.get(`https://myanimelist.net/anime.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeManga(q){try{const{data}=await axios.get(`https://myanimelist.net/manga.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeCharacter(q){try{const{data}=await axios.get(`https://myanimelist.net/character.php?q=${q}`);const $=cheerio.load(data);const r=[];$('table').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const n=$(e).find('td').eq(1).find('strong').text().trim();if(n)r.push({name:n,img})});return r.slice(0,5)}catch(e){return[]}}
async function scrapeTopAnime(){try{const{data}=await axios.get(`https://myanimelist.net/topanime.php`);const $=cheerio.load(data);const r=[];$('.ranking-list').each((i,e)=>{const t=$(e).find('.detail .hoverinfo_trigger').text().trim();const s=$(e).find('.score .text').text();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,score:s,img})});return r.slice(0,5)}catch(e){return[]}}
async function getWaifu(){try{const{data}=await axios.get('https://api.waifu.im/search');return data.images[0]}catch(e){return null}}
async function scrapeGempa(){try{const{data}=await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");const $=cheerio.load(data,{xmlMode:true});const g=$('Infogempa').find('gempa');return{tanggal:g.find('Tanggal').text(),jam:g.find('Jam').text(),wilayah:g.find('Wilayah').text(),magnitude:g.find('Magnitude').text(),shakemap:"https://data.bmkg.go.id/DataMKG/TEWS/"+g.find('Shakemap').text()}}catch(e){return{error:"Error"}}}


// --- ROUTES ---

app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

// Anime Routes
app.get('/api/anime/search', async (req, res) => { const r=await scrapeAnime(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/manga', async (req, res) => { const r=await scrapeManga(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/character', async (req, res) => { const r=await scrapeCharacter(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/top', async (req, res) => { const r=await scrapeTopAnime(); res.json({status:true,creator:"Kayzen",data:r}); });

// Random Routes
app.get('/api/random/waifu', async (req, res) => { const r=await getWaifu(); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/random/neko', async (req, res) => { try{const{data}=await axios.get("https://nekos.best/api/v2/neko");res.json({status:true,creator:"Kayzen",data:data.results[0]})}catch(e){res.json({status:false})} });
app.get('/api/info/gempa', async (req, res) => { const r=await scrapeGempa(); if(r.shakemap)r.image=r.shakemap; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/wallpaper', async (req, res) => { const r=await scrapeWallpaper(req.query.q); res.json({status:true,creator:"Kayzen",data:{image:r[Math.floor(Math.random()*r.length)]}}); });

// FIXED ROUTES (Sesuai Request)
app.get('/api/search/pinterest', async (req, res) => { 
    const r = await pinterestSearch(req.query.q); 
    res.json({status:true, creator:"Kayzen", data:r}); 
});

app.get('/api/search/lazada', async (req, res) => { 
    const r = await scrapeLazada(req.query.q); 
    res.json({status:true, creator:"Kayzen", data:r}); 
});

app.get('/api/tools/lirik-lagu', async (req, res) => { 
    const r = await scrapeLirik(req.query.q); 
    res.json({status:!!r, creator:"Kayzen", data:{lyrics:r}}); 
});

app.get('/api/maker/editor', async (req, res) => { 
    const { url, prompt } = req.query;
    if (!url || !prompt) return res.json({ status: false, message: "Isi url dan prompt" });
    const r = await scrapeImgEditor(url, prompt); 
    if(!r) return res.json({status:false, message:"Gagal/Timeout (Coba gambar lain/server sibuk)"});
    res.json({status:true, creator:"Kayzen", data:{url:r}}); 
});

// Original Tools
app.get('/api/download/instagram', async (req, res) => { const r=await scrapeIG(req.query.url); res.json({status:!!r,creator:"Kayzen",data:r}); });
app.get('/api/tools/lyrics', async (req, res) => { const r=await generateLyrics(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
