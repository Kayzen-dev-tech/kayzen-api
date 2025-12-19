const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dramadash = require('./scrapers/scrapeDramadash');
const imgeditor = require('./scrapers/scrapeImgeditor');
const identifyAnime = require('./scrapers/scrapeAnimeFinder');
const channelTalk = require('./scrapers/scrapeChannelstalk');
const dramabox = require('./scrapers/scrapeDramabox');
const igdown = require('./scrapers/scrapeIgdown');
const itch = require('./scrapers/scrapeItch');
const { deepimg } = require('./scrapers/scrapeDeepimg');
const scrapeLagu = require('./scrapers/scrapeLagu');
const bing = require('./scrapers/scrapeBing');
const lirik = require('./scrapers/scrapeLirik');
const pinterest = require('./scrapers/scrapePinterest');
const randomAnime = require('./scrapers/scrapeRandomAnime');
const removeBg = require('./scrapers/scrapeRemoveBg');
const melolo = require('./scrapers/scrapeMelolo');
const pixnova = require('./scrapers/scrapePixnova');
const magicstudio = require('./scrapers/scrapeMagicStudio');
const lyricsGen = require('./scrapers/scrapeLyricsGenerator');
const muslimai = require('./scrapers/scrapeMuslimai');
const mediafire = require('./scrapers/scrapeMediafiredown');
const tempmail = require('./scrapers/scrapeTempmail');
const twitterStalk = require('./scrapers/scrapeTwitterstalk');
const ytdown = require('./scrapers/scrapeYtdown');
const removerWm = require('./scrapers/scrapeRemover');
const videy = require('./scrapers/scrapeVidey');
const tiktokDl = require('./scrapers/scrapeTiktok');
const jadwalSholat = require('./scrapers/scrapeJadwalSholat');
const hubble = require('./scrapers/scrapeHubble');
const nanoBanana = require('./scrapers/scrapeNanoBanana');
const dailymotion = require('./scrapers/scrapeDailymotion');
const googleImg = require('./scrapers/scrapeGoogleImage');
const scriptblox = require('./scrapers/scrapeScriptblox');
const imageToAscii = require('./scrapers/scrapeImageToAscii');
const pngimg = require('./scrapers/scrapePngimg');
const kajian = require('./scrapers/scrapeKajian');
const lingvanex = require('./scrapers/scrapeLingvanex');
const metaAi = require('./scrapers/scrapeMetaAi');
const tinyjpg = require('./scrapers/scrapeTinyjpg');
const spotify = require('./scrapers/scrapeSpotify');
const appleMusic = require('./scrapers/scrapeAppleMusic');
const top4top = require('./scrapers/scrapeTop4top');
const spotifyDl = require('./scrapers/scrapeSpotifyDl');
const umamusume = require('./scrapers/scrapeUmamusume');
const saveTwitter = require('./scrapers/scrapeSaveTwitter');
const igStalk = require('./scrapers/scrapeIgStalk');
const tiktokStalk = require('./scrapers/scrapeTiktokStalk');
const tebakLirik = require('./scrapers/scrapeTebakLirik');
const googleVideo = require('./scrapers/scrapeGoogleVideo');
const aiGirls = require('./scrapers/scrapeAiGirls'); 

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'docs.html'));
});

app.get('/api/dramadash/home', async (req, res) => {
    const result = await dramadash.home();
    res.json(result);
});

app.get('/api/dramadash/detail', async (req, res) => {
    const { id } = req.query;
    const result = await dramadash.detail(id);
    res.json(result);
});

app.get('/api/dramadash/search', async (req, res) => {
    const { q } = req.query;
    const result = await dramadash.search(q);
    res.json(result);
});

app.get('/api/dramadash/episode', async (req, res) => {
    const { id, eps } = req.query;
    const result = await dramadash.episode(id, eps);
    res.json(result);
});

app.post('/api/imgeditor/create', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const { prompt, styleId, mode } = req.body;
        const result = await imgeditor.create(req.file.buffer, req.file.originalname, prompt, { styleId, mode });
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/anime/identify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const result = await identifyAnime(req.file.buffer, req.file.originalname);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/channel/info', async (req, res) => {
    const { url } = req.query;
    const result = await channelTalk(url);
    res.json(result);
});

app.get('/api/dramabox/home', async (req, res) => {
    const result = await dramabox.home();
    res.json(result);
});

app.get('/api/dramabox/search', async (req, res) => {
    const { q } = req.query;
    const result = await dramabox.search(q);
    res.json(result);
});

app.get('/api/dramabox/detail', async (req, res) => {
    const { id } = req.query;
    const result = await dramabox.detail(id);
    res.json(result);
});

app.get('/api/dramabox/stream', async (req, res) => {
    const { id, eps } = req.query;
    const result = await dramabox.stream(id, eps);
    res.json(result);
});

app.get('/api/ig/download', async (req, res) => {
    const { url } = req.query;
    const result = await igdown(url);
    res.json(result);
});

app.get('/api/itch/search', async (req, res) => {
    const { q } = req.query;
    const result = await itch.search(q);
    res.json(result);
});

app.get('/api/itch/detail', async (req, res) => {
    const { url } = req.query;
    const result = await itch.detail(url);
    res.json(result);
});

app.get('/api/deepimg/generate', async (req, res) => {
    const { prompt, style } = req.query;
    const result = await deepimg(prompt, style);
    res.json(result);
});

app.get('/api/lyrics/search', async (req, res) => {
    const { q } = req.query;
    const result = await scrapeLagu(q);
    res.json(result);
});

app.get('/api/bing/search', async (req, res) => {
    const { q } = req.query;
    const result = await bing.search(q);
    res.json(result);
});

app.get('/api/bing/images', async (req, res) => {
    const { q } = req.query;
    const result = await bing.images(q);
    res.json(result);
});

app.get('/api/bing/videos', async (req, res) => {
    const { q } = req.query;
    const result = await bing.videos(q);
    res.json(result);
});

app.get('/api/lirik/search', async (req, res) => {
    const { q } = req.query;
    const result = await lirik(q);
    res.json(result);
});

app.get('/api/pinterest/search', async (req, res) => {
    const { q } = req.query;
    const result = await pinterest(q);
    res.json(result);
});

app.get('/api/anime/random', async (req, res) => {
    const { type } = req.query;
    let result;
    if (type === 'neko') result = await randomAnime.neko();
    else if (type === 'loli') result = await randomAnime.loli();
    else result = await randomAnime.waifu();
    res.json({ url: result });
});

app.post('/api/tools/removebg', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const result = await removeBg(req.file.buffer, req.file.originalname);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/novel/melolo/search', async (req, res) => {
    const { q } = req.query;
    const result = await melolo.search(q);
    res.json(result);
});

app.get('/api/novel/melolo/detail', async (req, res) => {
    const { id } = req.query;
    const result = await melolo.detail(id);
    res.json(result);
});

app.get('/api/novel/melolo/stream', async (req, res) => {
    const { id } = req.query;
    const result = await melolo.stream(id);
    res.json(result);
});

app.post('/api/ai/pixnova/swap-image', upload.fields([{ name: 'target', maxCount: 1 }, { name: 'face', maxCount: 1 }]), async (req, res) => {
    try {
        if (!req.files || !req.files['target'] || !req.files['face']) {
            return res.status(400).json({ error: 'Membutuhkan file target dan face' });
        }
        const target = req.files['target'][0];
        const face = req.files['face'][0];
        const result = await pixnova.swapImage(target.buffer, target.originalname, face.buffer, face.originalname);
        res.json({ result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/ai/pixnova/baby', upload.fields([{ name: 'father', maxCount: 1 }, { name: 'mother', maxCount: 1 }]), async (req, res) => {
    try {
        if (!req.files || !req.files['father'] || !req.files['mother']) {
            return res.status(400).json({ error: 'Membutuhkan file father dan mother' });
        }
        const { gender } = req.body;
        const father = req.files['father'][0];
        const mother = req.files['mother'][0];
        const result = await pixnova.generateBaby(father.buffer, father.originalname, mother.buffer, mother.originalname, gender || 'boy');
        res.json({ result });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/ai/magicstudio', async (req, res) => {
    const { prompt } = req.query;
    const result = await magicstudio(prompt);
    res.json(result);
});

app.get('/api/ai/lyrics-generator', async (req, res) => {
    const { prompt } = req.query;
    const result = await lyricsGen(prompt);
    res.json({ lyrics: result });
});

app.get('/api/muslim/ask', async (req, res) => {
    const { q } = req.query;
    const result = await muslimai(q);
    res.json(result);
});

app.get('/api/download/mediafire', async (req, res) => {
    const { url } = req.query;
    const result = await mediafire(url);
    res.json(result);
});

app.get('/api/tempmail/create', async (req, res) => {
    const result = await tempmail.create();
    res.json(result);
});

app.get('/api/tempmail/inbox', async (req, res) => {
    const { token } = req.query;
    const result = await tempmail.cekInbox(token);
    res.json(result);
});

app.get('/api/stalk/twitter', async (req, res) => {
    const { username } = req.query;
    const result = await twitterStalk(username);
    res.json(result);
});

app.get('/api/download/youtube', async (req, res) => {
    const { url } = req.query;
    const result = await ytdown(url);
    res.json(result);
});

app.get('/api/tools/remover', async (req, res) => {
    const { url } = req.query;
    const result = await removerWm(url);
    res.json(result);
});

app.post('/api/upload/videy', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File video atau image diperlukan' });
        const fileData = {
            data: req.file.buffer,
            name: req.file.originalname
        };
        const result = await videy(fileData);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/download/tiktok', async (req, res) => {
    const { url } = req.query;
    const result = await tiktokDl(url);
    res.json(result);
});

app.get('/api/muslim/jadwalsholat', async (req, res) => {
    const { kota } = req.query;
    const result = await jadwalSholat(kota);
    res.json(result);
});

app.get('/api/search/hubble', async (req, res) => {
    const { q } = req.query;
    const result = await hubble(q);
    res.json(result);
});

app.get('/api/ai/nanobanana', async (req, res) => {
    const { prompt } = req.query;
    const result = await nanoBanana(prompt);
    res.json(result);
});

app.get('/api/download/dailymotion', async (req, res) => {
    const { url } = req.query;
    const result = await dailymotion(url);
    res.json(result);
});

app.get('/api/search/google-image', async (req, res) => {
    const { q } = req.query;
    const result = await googleImg(q);
    res.json(result);
});

app.get('/api/search/scriptblox', async (req, res) => {
    const { q, page } = req.query;
    const result = await scriptblox(q, page);
    res.json(result);
});

app.post('/api/tools/imagetoascii', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const result = await imageToAscii(req.file.buffer, req.file.originalname);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/search/pngimg', async (req, res) => {
    const { q } = req.query;
    const result = await pngimg(q);
    res.json(result);
});

app.get('/api/muslim/kajian', async (req, res) => {
    const { q } = req.query;
    const result = await kajian(q);
    res.json(result);
});

app.get('/api/translate/sunda', async (req, res) => {
    const { text } = req.query;
    const result = await lingvanex(text);
    res.json(result);
});

app.get('/api/ai/meta-ai', async (req, res) => {
    const { prompt } = req.query;
    const result = await metaAi(prompt);
    res.json(result);
});

app.post('/api/tools/tinyjpg', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const result = await tinyjpg(req.file.buffer, req.file.originalname);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/search/spotify', async (req, res) => {
    const { q } = req.query;
    const result = await spotify(q);
    res.json(result);
});

app.get('/api/download/apple-music', async (req, res) => {
    const { url } = req.query;
    const result = await appleMusic(url);
    res.json(result);
});

app.post('/api/upload/top4top', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'File image diperlukan' });
        const result = await top4top(req.file.buffer, req.file.originalname);
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/download/spotify', async (req, res) => {
    const { url } = req.query;
    const result = await spotifyDl(url);
    res.json(result);
});

app.get('/api/anime/umamusume', async (req, res) => {
    const { slug } = req.query;
    const result = await umamusume(slug);
    res.json(result);
});

app.get('/api/download/twitter-dl', async (req, res) => {
    const { url } = req.query;
    const result = await saveTwitter(url);
    res.json(result);
});

app.get('/api/stalk/ig', async (req, res) => {
    const { username } = req.query;
    const result = await igStalk(username);
    res.json(result);
});

app.get('/api/stalk/tiktok', async (req, res) => {
    const { username } = req.query;
    const result = await tiktokStalk(username);
    res.json(result);
});

app.get('/api/game/tebaklirik', async (req, res) => {
    const result = await tebakLirik();
    res.json(result);
});

app.get('/api/search/google-video', async (req, res) => {
    const { q } = req.query;
    if (!q) return res.status(400).json({ status: false, message: "Query diperlukan" });
    const result = await googleVideo(q);
    res.json(result);
});

app.get('/api/random/aigirls', async (req, res) => {
    const result = await aiGirls();
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;
