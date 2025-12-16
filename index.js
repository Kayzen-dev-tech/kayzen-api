const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const ytSearch = require('yt-search');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

async function igDownload(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/igdl?url=${url}`);
        if (!data.status) return { error: "Failed" };
        return data.result;
    } catch (e) { return { error: "Error" }; }
}

async function igStalk(username) {
    try {
        const { data } = await axios.get(`https://widipe.com/stalk/instagram?username=${username}`);
        if (!data.status) return { error: "Not found" };
        return data.result;
    } catch (e) { return { error: "Error" }; }
}

async function pinterestDl(url) {
    try {
        const { data } = await axios.get(`https://widipe.com/download/pindl?url=${url}`);
        if (!data.status) return { error: "Failed" };
        return { url: data.result.url, type: data.result.media_type };
    } catch (e) { return { error: "Error" }; }
}

async function pinterestSearch(query) {
    try {
        const { data } = await axios.get(`https://widipe.com/pinterest?q=${query}`);
        if (!data.status) return [];
        return data.result; 
    } catch (e) { return []; }
}

async function bratMaker(text) {
    try {
        const url = `https://widipe.com/brat?text=${encodeURIComponent(text)}`;
        const { data } = await axios.get(url, { responseType: 'arraybuffer' });
        return data;
    } catch (e) { return null; }
}

async function scrapeWiki(query) {
    try {
        const { data } = await axios.get(`https://id.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        return { 
            title: data.title, 
            summary: data.extract, 
            image: data.thumbnail ? data.thumbnail.source : null,
            url: data.content_urls.desktop.page 
        };
    } catch (e) { return { error: "Not found" }; }
}

async function githubStalk(u){try{const{data}=await axios.get(`https://api.github.com/users/${u}`);return{username:data.login,bio:data.bio,avatar:data.avatar_url,url:data.html_url}}catch(e){return{error:"Not found"}}}
async function npmStalk(p){try{const{data}=await axios.get(`https://registry.npmjs.org/${p}`);return{name:data.name,desc:data.description,version:data['dist-tags'].latest}}catch(e){return{error:"Not found"}}}

app.get('/', (req, res) => res.render('home'));
app.get('/docs', (req, res) => res.render('docs'));

app.get('/api/download/youtube', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); try{const r=await ytSearch(q);res.json({status:true,creator:"Kayzen",data:r.videos.slice(0,5)})}catch(e){res.json({status:false})} });
app.get('/api/download/tiktok', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); try{const {data}=await axios.get(`https://www.tikwm.com/api/?url=${u}`);if(data.code===0)res.json({status:true,creator:"Kayzen",data:{title:data.data.title,video:data.data.play,audio:data.data.music}});else res.json({status:false})}catch(e){res.json({status:false})} });
app.get('/api/download/instagram', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); const r = await igDownload(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/download/pinterest', async (req, res) => { const u = req.query.url; if(!u) return res.json({status:false}); const r = await pinterestDl(u); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/search/tiktok', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); const r = await tiktokSearch(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/pinterest', async (req, res) => { const q = req.query.q; if(!q) return res.json({status:false}); const r = await pinterestSearch(q); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/search/wiki', async (req, res) => { const q=req.query.q; if(!q) return res.json({status:false}); const r=await scrapeWiki(q); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/stalk/github', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await githubStalk(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/instagram', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await igStalk(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/tiktok', async (req, res) => { const u=req.query.username; if(!u) return res.json({status:false}); const r=await tiktokStalk(u); res.json({status:true,creator:"Kayzen",data:r}); });
app.get('/api/stalk/npm', async (req, res) => { const p=req.query.package; if(!p) return res.json({status:false}); const r=await npmStalk(p); res.json({status:true,creator:"Kayzen",data:r}); });

app.get('/api/maker/brat', async (req, res) => { 
    const text = req.query.text; 
    if (!text) return res.json({ status: false, message: "Param ?text=" }); 
    const buffer = await bratMaker(text);
    if (!buffer) return res.json({ status: false, message: "Error" });
    res.set('Content-Type', 'image/png'); 
    res.send(buffer); 
});

app.get('/api/tools/img2ascii', async (req, res) => {
    const url = req.query.url;
    if (!url) return res.json({ status: false, message: "Param ?url=" });
    try {
        const { data } = await axios.get(`https://widipe.com/tools/img2ascii?url=${url}`);
        res.json({ status: true, creator: "Kayzen", data: data });
    } catch (e) { res.json({ status: false, message: "Error" }); }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
module.exports = app;
