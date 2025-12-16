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

// --- HELPER FUNCTION ---
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for(let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

// --- SCRAPER FUNCTIONS ---

// 1. ANIME & MANGA
async function scrapeAnime(query) {
    try {
        const { data } = await axios.get(`https://myanimelist.net/anime.php?q=${query}`);
        const $ = cheerio.load(data);
        const results = [];
        $('.list table tr').each((i, el) => {
            if (i > 0) {
                const title = $(el).find('td.borderClass strong').text().trim();
                const desc = $(el).find('div.pt4').text().trim();
                const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
                if (title) results.push({ title, desc, img });
            }
        });
        return results.slice(0, 5);
    } catch (e) { return []; }
}
async function scrapeManga(query) {
    try {
        const { data } = await axios.get(`https://myanimelist.net/manga.php?q=${query}`);
        const $ = cheerio.load(data);
        const results = [];
        $('.list table tr').each((i, el) => {
            if (i > 0) {
                const title = $(el).find('td.borderClass strong').text().trim();
                const desc = $(el).find('div.pt4').text().trim();
                const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
                if (title) results.push({ title, desc, img });
            }
        });
        return results.slice(0, 5);
    } catch (e) { return []; }
}
async function scrapeCharacter(query) {
    try {
        const { data } = await axios.get(`https://myanimelist.net/character.php?q=${query}`);
        const $ = cheerio.load(data);
        const results = [];
        $('table').each((i, el) => {
            const img = $(el).find('td').eq(0).find('img').attr('data-src') || $(el).find('td').eq(0).find('img').attr('src');
            const name = $(el).find('td').eq(1).find('strong').text().trim();
            const anime = $(el).find('td').eq(2).find('a').text().trim();
            if (name) results.push({ name, anime_origin: anime, img });
        });
        return results.slice(0, 5);
    } catch (e) { return []; }
}
async function scrapeTopAnime() {
    try {
        const { data } = await axios.get(`https://myanimelist.net/topanime.php`);
        const $ = cheerio.load(data);
        const results = [];
        $('.ranking-list').each((i, el) => {
            const rank = $(el).find('.rank span').text();
            const title = $(el).find('.title .detail .hoverinfo_trigger').text().trim();
            const score = $(el).find('.score .text').text();
            const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            if (title) results.push({ rank, title, score, img });
        });
        return results.slice(0, 5);
    } catch (e) { return []; }
}

// 2. STALKER SCRAPERS
async function githubStalk(username) {
    try {
        const { data } = await axios.get(`https://api.github.com/users/${username}`);
        return { username: data.login, bio: data.bio, followers: data.followers, repo_public: data.public_repos, avatar: data.avatar_url, url: data.html_url };
    } catch (e) { return { error: "User not found" }; }
}
async function redditStalk(username) {
    try {
        const { data } = await axios.get(`https://www.reddit.com/user/${username}/about.json`);
        const d = data.data;
        return { username: d.name, karma: d.total_karma, created: new Date(d.created_utc * 1000).toDateString(), is_gold: d.is_gold, avatar: d.icon_img ? d.icon_img.split('?')[0] : null };
    } catch (e) { return { error: "User not found" }; }
}
async function npmStalk(pkg) {
    try {
        const { data } = await axios.get(`https://registry.npmjs.org/${pkg}`);
        const latest = data['dist-tags'].latest;
        return { name: data.name, description: data.description, latest_version: latest, author: data.author ? data.author.name : 'Unknown', homepage: data.homepage };
    } catch (e) { return { error: "Package not found" }; }
}
async function steamStalk(username) {
    try {
        const { data } = await axios.get(`https://steamcommunity.com/id/${username}`);
        const $ = cheerio.load(data);
        const name = $('.actual_persona_name').text().trim();
        const bio = $('.profile_summary').text().trim();
        const avatar = $('.playerAvatarAutoSizeInner img').attr('src');
        const level = $('.friendPlayerLevelNum').text().trim();
        const status = $('.profile_in_game_header').text().trim() || "Offline";
        const game = $('.profile_in_game_name').text().trim();
        if (!name) return { error: "User not found / Private" };
        return { username: name, bio, level, status, game, avatar };
    } catch (e) { return { error: "User not found" }; }
}
async function wattpadStalk(username) {
    try {
        const { data } = await axios.get(`https://www.wattpad.com/user/${username}`);
        const $ = cheerio.load(data);
        const name = $('.profile-name').text().trim() || $('h1').text().trim();
        const bio = $('.description').text().trim();
        const avatar = $('.avatar img').attr('src');
        if (!name) return { error: "User not found" };
        return { username: name, bio, avatar, url: `https://www.wattpad.com/user/${username}` };
    } catch (e) { return { error: "User not found" }; }
}
async function igStalk(username) {
    try {
        const { data } = await axios.get(`https://api.agatz.xyz/api/stalkig?username=${username}`);
        if (data.status !== 200) return { error: "User not found" };
        return data.data;
    } catch (e) { return { error: "User not found / Private" }; }
}
async function tiktokStalk(username) {
    try {
        const { data } = await axios.post("https://www.tikwm.com/api/user/info", new URLSearchParams({ unique_id: username }));
        return data.data ? data.data : { error: "User not found" };
    } catch (e) { return { error: "User not found" }; }
}

// 3. MEDIA SEARCH & DOWNLOAD
async function tiktokSearch(query) {
    try {
        const { data } = await axios.post("https://www.tikwm.com/api/feed/search", new URLSearchParams({ keywords: query, count: 10, cursor: 0, web: 1, hd: 1 }));
        return data.data ? data.data.videos : [];
    } catch (e) { return []; }
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
async function pinterestDl(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/pindl?url=${url}`);
        if (!data.status) return { error: "Gagal download / Link Salah" };
        return { 
            url: data.result.url, 
            type: data.result.media_type 
        }; 
    } catch (e) { return { error: "Server Down / Gagal" }; }
}
async function igDownload(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/igdl?url=${url}`);
        if (!data.status) return { error: "Gagal download" };
        return data.result; // Mengembalikan array url video/foto
    } catch (e) { return { error: "Gagal download / Link Salah" }; }
}

// 4. RANDOM & TOOLS
async function scrapeWallpaper(query) {
    try {
        const { data } = await axios.get(`https://www.wallpaperflare.com/search?wallpaper=${query}`);
        const $ = cheerio.load(data);
        const results = [];
        $('#gallery > li > figure > a').each((i, el) => {
            const imgUrl = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
            if (imgUrl) results.push(imgUrl);
        });
        return results.slice(0, 10);
    } catch (e) { return []; }
}
async function scrapeGempa() {
    try {
        const { data } = await axios.get("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");
        const $ = cheerio.load(data, { xmlMode: true });
        const gempa = $('Infogempa').find('gempa');
        return {
            tanggal: gempa.find('Tanggal').text(),
            jam: gempa.find('Jam').text(),
            magnitude: gempa.find('Magnitude').text(),
            wilayah: gempa.find('Wilayah').text(),
            shakemap: "https://data.bmkg.go.id/DataMKG/TEWS/" + gempa.find('Shakemap').text()
        };
    } catch (e) { return { error: "BMKG Error" }; }
}
async function scrapeWiki(query) {
    try {
        const { data } = await axios.get(`https://id.m.wikipedia.org/wiki/${query}`);
        const $ = cheerio.load(data);
        const title = $('h1#section_0').text().trim();
        const summary = $('div#mf-section-0 p').first().text().trim();
        let img = $('table.infobox img').first().attr('src') || $('div.thumb.tright img').first().attr('src');
        if (img && !img.startsWith('http')) img = 'https:' + img;
        return title ? { title, summary, img } : { error: "Not found" };
    } catch (e) { return { error: "Error" }; }
}
async function getWaifu(type) { try { const url = type === 'nsfw' ? 'https://api.waifu.im/search?is_nsfw=true' : 'https://api.waifu.im/search'; const { data } = await axios.get(url); return data.images[0]; } catch (e) { return null; } }
async function makeAscii(text) { try { const { data } = await axios.get(`https://artii.herokuapp.com/make?text=${text}`); return { original: text, ascii: data }; } catch (e) { return { error: "Failed" }; } }


// --- ROUTES ---

app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

// === API ENDPOINTS ===

// 1. MEDIA DOWNLOAD & SEARCH
app.get('/api/download/youtube', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json({ status: false, message: "Param ?q=" });
    try { const r = await ytSearch(q); res.json({ status: true, creator: "Kayzen Izumi", data: r.videos.slice(0, 5) }); } catch (e) { res.json({ status: false, message: "Error" }); }
});
app.get('/api/download/tiktok', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Param ?url=" });
    try { const { data } = await axios.get(`https://www.tikwm.com/api/?url=${url}`); if (data.code === 0) res.json({ status: true, creator: "Kayzen Izumi", data: { title: data.data.title, video_nowm: data.data.play, music: data.data.music, cover: data.data.cover } }); else res.json({ status: false, message: "Video not found" }); } catch (e) { res.json({ status: false, message: "Server Error" }); }
});
app.get('/api/download/instagram', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Param ?url=" });
    const result = await igDownload(url);
    res.json({ status: true, creator: "Kayzen Izumi", data: result });
});
app.get('/api/download/pinterest', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Param ?url=" });
    const result = await pinterestDl(url);
    res.json({ status: true, creator: "Kayzen Izumi", data: result });
});
app.get('/api/search/tiktok', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json({ status: false, message: "Param ?q=" });
    const results = await tiktokSearch(q);
    res.json({ status: true, creator: "Kayzen Izumi", data: results });
});
app.get('/api/search/pinterest', async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json({ status: false, message: "Param ?q=" });
    const results = await pinterestSearch(q);
    res.json({ status: true, creator: "Kayzen Izumi", data: results });
});

// 2. STALK
app.get('/api/stalk/github', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await githubStalk(user); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/reddit', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await redditStalk(user); if (result.avatar) result.image = result.avatar; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/npm', async (req, res) => { const pkg = req.query.package; if (!pkg) return res.json({ status: false, message: "Param ?package=" }); const result = await npmStalk(pkg); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/steam', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await steamStalk(user); if (result.avatar) result.image = result.avatar; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/wattpad', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await wattpadStalk(user); if (result.avatar) result.image = result.avatar; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/instagram', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await igStalk(user); if (result && result.photoUrl) result.image = result.photoUrl; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/stalk/tiktok', async (req, res) => { const user = req.query.username; if (!user) return res.json({ status: false, message: "Param ?username=" }); const result = await tiktokStalk(user); if (result.user && result.user.avatar) result.image = result.user.avatar; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });

// 3. ANIME
app.get('/api/anime/search', async (req, res) => { const q = req.query.q; if (!q) return res.json({ status: false, message: "Param ?q=" }); const result = await scrapeAnime(q); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/anime/manga', async (req, res) => { const q = req.query.q; if (!q) return res.json({ status: false, message: "Param ?q=" }); const result = await scrapeManga(q); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/anime/character', async (req, res) => { const q = req.query.q; if (!q) return res.json({ status: false, message: "Param ?q=" }); const result = await scrapeCharacter(q); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/anime/top', async (req, res) => { const result = await scrapeTopAnime(); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });

// 4. TOOLS & MAKER
app.get('/api/tools/ascii', async (req, res) => { const txt = req.query.text; if (!txt) return res.json({ status: false, message: "Param ?text=" }); const result = await makeAscii(txt); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/tools/ip-lookup', async (req, res) => { try { const { data } = await axios.get('http://ip-api.com/json/'); res.json({ status: true, creator: "Kayzen Izumi", data: data }); } catch (e) { res.json({ status: false, message: "Error" }); } });
app.get('/api/maker/brat', async (req, res) => { const text = req.query.text; if (!text) return res.json({ status: false, message: "Param ?text=" }); try { const background = await loadImage(path.join(__dirname, 'public/images/brat.jpg')); const canvas = createCanvas(background.width, background.height); const ctx = canvas.getContext('2d'); ctx.drawImage(background, 0, 0, canvas.width, canvas.height); ctx.font = 'bold 35px Sans'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; wrapText(ctx, text, canvas.width / 2, canvas.height - 180, 300, 40); const buffer = canvas.toBuffer('image/jpeg'); res.set('Content-Type', 'image/jpeg'); res.send(buffer); } catch (e) { res.json({ status: false, message: "brat.jpg missing" }); } });

// 5. RANDOM & INFO
app.get('/api/random/waifu', async (req, res) => { const result = await getWaifu('sfw'); res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/random/neko', async (req, res) => { try { const { data } = await axios.get("https://nekos.best/api/v2/neko"); res.json({ status: true, creator: "Kayzen Izumi", data: data.results[0] }); } catch (e) { res.json({ status: false, message: "Error" }); } });
app.get('/api/search/wallpaper', async (req, res) => { const q = req.query.q; if (!q) return res.json({ status: false, message: "Param ?q=" }); const images = await scrapeWallpaper(q); if (images.length === 0) return res.json({ status: false, message: "Not found" }); const randomImg = images[Math.floor(Math.random() * images.length)]; res.json({ status: true, creator: "Kayzen Izumi", data: { image: randomImg } }); });
app.get('/api/info/gempa', async (req, res) => { const result = await scrapeGempa(); if (result.shakemap) result.image = result.shakemap; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });
app.get('/api/search/wiki', async (req, res) => { const q = req.query.q; if (!q) return res.json({ status: false, message: "Param ?q=" }); const result = await scrapeWiki(q); if (result.img) result.image = result.img; res.json({ status: true, creator: "Kayzen Izumi", data: result }); });

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
