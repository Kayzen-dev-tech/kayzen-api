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

async function pinterestSearch(query) {
    const defaultCookie = '_pinterest_sess=Twv...; csrftoken=...'; 
    const modifiedQuery = `${query} ${Math.floor(Math.random() * 10000)}`;
    
    const url = 'https://id.pinterest.com/resource/BaseSearchResource/get/';
    const headers = {
        'accept': 'application/json, text/javascript, */*, q=0.01',
        'referer': 'https://id.pinterest.com/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'cookie': defaultCookie,
        'x-pinterest-appstate': 'active',
    };

    const postData = new URLSearchParams();
    postData.append('source_url', `/search/pins/?q=${encodeURIComponent(modifiedQuery)}&rs=typed`);
    postData.append('data', JSON.stringify({
        options: { query: modifiedQuery, scope: 'pins', page_size: 40, rs: 'typed', redux_normalize_feed: true },
        context: {},
    }));

    try {
        const { data } = await axios.post(url, postData, { headers });
        const results = data?.resource_response?.data?.results || [];
        return results.sort(() => Math.random() - 0.5).map(pin => ({
            id: pin.id,
            title: pin.grid_title || pin.description || "Pinterest Image",
            image: pin.images?.['736x']?.url || pin.images?.orig?.url,
            video: pin.story_pin_data?.pages?.[0]?.blocks?.[0]?.video?.video_list?.V_HLSV3_MOBILE?.url || null,
        })).filter(x => x.image);
    } catch (e) { return []; }
}

async function scrapeLazada(query) {
    try {
        const { data } = await axios.get(`https://www.lazada.co.id/catalog/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
                'Referer': 'https://www.lazada.co.id/',
                'Cache-Control': 'max-age=0'
            }
        });

        const $ = cheerio.load(data);
        let items = [];

        $('script').each((i, el) => {
            const txt = $(el).html() || "";
            if (txt.includes('window.pageData=')) {
                try {
                    let jsonStr = txt.split('window.pageData=')[1].split(';')[0];
                    const json = JSON.parse(jsonStr);
                    const list = json?.mods?.listItems || [];
                    
                    items = list.map(item => ({
                        name: item.name,
                        price: item.priceShow || item.price,
                        rating: item.ratingScore || 'N/A',
                        location: item.location || 'Indonesia',
                        image: item.image || item.thumbs?.[0]?.image || 'https://via.placeholder.com/150',
                        link: item.itemUrl ? `https://www.lazada.co.id${item.itemUrl}` : '#'
                    }));
                } catch (e) { }
            }
        });
        
        return items.slice(0, 15);
    } catch (e) { 
        return []; 
    }
}

async function scrapeImgEditor(urlInput, prompt) {
    try {
        const response = await axios.get(urlInput, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        const info = await axios.post("https://imgeditor.co/api/get-upload-url", {
            fileName: "image.jpg", contentType: "image/jpeg", fileSize: buffer.length
        }).then(r => r.data);

        await axios.put(info.uploadUrl, buffer, { headers: { "Content-Type": "image/jpeg" } });

        const gen = await axios.post("https://imgeditor.co/api/generate-image", {
            prompt: prompt, styleId: "realistic", mode: "image", imageUrl: info.publicUrl, imageUrls: [info.publicUrl], numImages: 1, outputFormat: "png", model: "nano-banana"
        }).then(r => r.data);

        for (let i = 0; i < 30; i++) { 
            await new Promise(r => setTimeout(r, 2000)); 
            const status = await axios.get(`https://imgeditor.co/api/generate-image/status?taskId=${gen.taskId}`).then(r => r.data);
            if (status.status === "completed") return status.imageUrl;
            if (status.status === "failed") return null;
        }
        return null; 
    } catch (e) { return null; }
}

async function scrapeWallpaper(query) {
    try {
        const { data } = await axios.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query + ' wallpaper hd')}&first=1&scenario=ImageBasicHover`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
            }
        });

        const $ = cheerio.load(data);
        const results = [];

        $('a.iusc').each((i, el) => {
            try {
                const m = $(el).attr('m');
                if (m) {
                    const parsed = JSON.parse(m);
                    if (parsed.murl && !parsed.murl.endsWith('.gif')) {
                        results.push(parsed.murl);
                    }
                }
            } catch (e) {}
        });

        return results.slice(0, 15);
    } catch (e) { return []; }
}

async function scrapeLirik(query) {
    try {
        const { data: searchData } = await axios.get(`https://lirik.my/?s=${encodeURIComponent(query)}`);
        const $ = cheerio.load(searchData);
        const link = $('.entry-title a').attr('href');
        if (!link) return null;
        
        const { data: lyricData } = await axios.get(link);
        const $$ = cheerio.load(lyricData);
        const content = $$('.entry-content');
        content.find('script,style,div,.sharedaddy').remove();
        
        return content.html()
            .replace(/<br>/g, '\n')
            .replace(/<\/?[^>]+(>|$)/g, "")
            .trim();
    } catch (e) { return null; }
}

async function generateLyrics(prompt) { try { const { data } = await axios.post('https://lyricsgenerator.com/api/completion', { prompt }); return data; } catch (e) { return "Error AI"; } }
async function scrapeIG(url) { try { const { data } = await axios.get(`https://media.mollygram.com/?url=${encodeURIComponent(url)}`); if (!data.html) return null; const $ = cheerio.load(data.html); const imgs = []; $("#download_content img").each((i, el) => { const src = $(el).attr("src"); if(src) imgs.push(src); }); const vid = $("video source").attr("src"); if(vid) return { type: "video", media: [vid] }; if(imgs.length > 0) return { type: imgs.length > 1 ? "slide" : "image", media: imgs }; return null; } catch (e) { return null; } }
async function getWaifu(){try{const{data}=await axios.get('https://api.waifu.im/search');return data.images[0]}catch(e){return null}}
async function scrapeAnime(q){try{const{data}=await axios.get(`https://myanimelist.net/anime.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeManga(q){try{const{data}=await axios.get(`https://myanimelist.net/manga.php?q=${q}`);const $=cheerio.load(data);const r=[];$('.list table tr').each((i,e)=>{if(i>0){const t=$(e).find('strong').text().trim();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,img})}});return r.slice(0,5)}catch(e){return[]}}
async function scrapeCharacter(q){try{const{data}=await axios.get(`https://myanimelist.net/character.php?q=${q}`);const $=cheerio.load(data);const r=[];$('table').each((i,e)=>{const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');const n=$(e).find('td').eq(1).find('strong').text().trim();if(n)r.push({name:n,img})});return r.slice(0,5)}catch(e){return[]}}
async function scrapeTopAnime(){try{const{data}=await axios.get(`https://myanimelist.net/topanime.php`);const $=cheerio.load(data);const r=[];$('.ranking-list').each((i,e)=>{const t=$(e).find('.detail .hoverinfo_trigger').text().trim();const s=$(e).find('.score .text').text();const img=$(e).find('img').attr('data-src')||$(e).find('img').attr('src');if(t)r.push({title:t,score:s,img})});return r.slice(0,5)}catch(e){return[]}}
async function scrapeGempa(){try{const{data}=await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");const $=cheerio.load(data,{xmlMode:true});const g=$('Infogempa').find('gempa');return{tanggal:g.find('Tanggal').text(),jam:g.find('Jam').text(),wilayah:g.find('Wilayah').text(),magnitude:g.find('Magnitude').text(),shakemap:"https://data.bmkg.go.id/DataMKG/TEWS/"+g.find('Shakemap').text()}}catch(e){return{error:"Error"}}}


app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

app.get('/api/anime/search', async (req, res) => { const r=await scrapeAnime(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/manga', async (req, res) => { const r=await scrapeManga(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/character', async (req, res) => { const r=await scrapeCharacter(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/anime/top', async (req, res) => { const r=await scrapeTopAnime(); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/random/waifu', async (req, res) => { const r=await getWaifu(); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/random/neko', async (req, res) => { try{const{data}=await axios.get("https://nekos.best/api/v2/neko");res.json({status:true,creator:"Kayzen",data:data.results[0]})}catch(e){res.json({status:false})} });
app.get('/api/info/gempa', async (req, res) => { const r=await scrapeGempa(); if(r.shakemap)r.image=r.shakemap; res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/download/instagram', async (req, res) => { const r=await scrapeIG(req.query.url); res.json({status:!!r,creator:"Kayzen",data:r}); });
app.get('/api/tools/lyrics', async (req, res) => { const r=await generateLyrics(req.query.q); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/search/pinterest', async (req, res) => { 
    const r = await pinterestSearch(req.query.q); 
    res.json({status:true, creator:"Kayzen", data:r}); 
});

app.get('/api/search/lazada', async (req, res) => { 
    const r = await scrapeLazada(req.query.q); 
    res.json({status:true, creator:"Kayzen", data:r}); 
});

app.get('/api/search/wallpaper', async (req, res) => { 
    const r = await scrapeWallpaper(req.query.q); 
    res.json({status:true, creator:"Kayzen", data: { image: r[Math.floor(Math.random() * r.length)] } }); 
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

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
