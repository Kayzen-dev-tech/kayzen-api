const axios = require('axios');
const cheerio = require('cheerio');
const qs = require('querystring');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function tiktokDl(url) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/', { url: url, hd: 1 });
    if (data.code !== 0) return { status: false, message: "Video not found" };
    return { status: true, ...data.data };
  } catch (e) { return { status: false, message: e.message }; }
}

async function tiktokSearch(query) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/feed/search', { keywords: query, count: 12, cursor: 0, web: 1, hd: 1 });
    if (data.code !== 0) return { status: false, message: "No results" };
    return { status: true, results: data.data.videos };
  } catch (e) { return { status: false, message: e.message }; }
}

async function tiktokStalk(username) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/user/info', { unique_id: username });
    if (data.code !== 0) return { status: false, message: "User not found" };
    return { status: true, profile: data.data };
  } catch (e) { return { status: false, message: e.message }; }
}

async function youtubeSearch(query) {
  try {
    const { data } = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, { headers: { 'User-Agent': UA } });
    const $ = cheerio.load(data);
    const script = $('script').filter((i, el) => {
      return $(el).html().includes('var ytInitialData =');
    }).first().html();
    
    if (!script) return { status: false, message: "Failed to parse YouTube" };
    
    const jsonStr = script.split('var ytInitialData =')[1].split(';')[0];
    const json = JSON.parse(jsonStr);
    const contents = json.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents[0].itemSectionRenderer.contents;
    
    const results = contents.filter(c => c.videoRenderer).map(c => {
      const v = c.videoRenderer;
      return {
        title: v.title.runs[0].text,
        url: `https://www.youtube.com/watch?v=${v.videoId}`,
        duration: v.lengthText ? v.lengthText.simpleText : 'Live',
        thumbnail: v.thumbnail.thumbnails[0].url,
        author: v.ownerText.runs[0].text
      };
    }).slice(0, 10);
    
    return { status: true, results };
  } catch (e) { return { status: false, message: e.message }; }
}

async function youtubeDl(url) {
  try {
    const payload = new URLSearchParams({ q: url, vt: 'home' });
    const { data: s } = await axios.post('https://yt1s.com/api/ajaxSearch/index', payload, { headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' }});
    
    if (!s.links) return { status: false, message: "Video not found" };

    const k = s.links.mp4['auto'] ? s.links.mp4['auto'].k : s.links.mp4['18'].k;
    const { data: c } = await axios.post('https://yt1s.com/api/ajaxConvert/convert', new URLSearchParams({ vid: s.vid, k: k }), { headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' }});
    
    return { status: true, title: s.title, download: c.dlink, quality: c.fquality };
  } catch (e) { return { status: false, message: e.message }; }
}

async function ytmp3(url) {
  try {
    const payload = new URLSearchParams({ q: url, vt: 'home' });
    const { data: s } = await axios.post('https://yt1s.com/api/ajaxSearch/index', payload, { headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' }});
    
    if (!s.links || !s.links.mp3) return { status: false, message: "Audio not found" };

    const k = s.links.mp3['mp3128'].k;
    const { data: c } = await axios.post('https://yt1s.com/api/ajaxConvert/convert', new URLSearchParams({ vid: s.vid, k: k }), { headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' }});
    
    return { status: true, title: s.title, download: c.dlink, quality: '128kbps' };
  } catch (e) { return { status: false, message: e.message }; }
}

async function instaDl(url) {
  try {
    const { data } = await axios.post('https://v3.igdownloader.app/api/ajaxSearch', new URLSearchParams({ url: url, recaptchaToken: '' }), { headers: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } });
    const $ = cheerio.load(data.data);
    const media = [];
    $('.download-items').each((i, el) => {
        const link = $(el).find('.download-button').attr('href');
        if(link) media.push(link);
    });
    if(media.length === 0) return { status: false, message: "Private or not found" };
    return { status: true, media };
  } catch (e) { return { status: false, message: "Failed to fetch Instagram" }; }
}

async function instaStalk(username) {
  try {
    const { data } = await axios.get(`https://imginn.com/${username}/`, { headers: { 'User-Agent': UA, 'Cookie': 'ct=0' } });
    const $ = cheerio.load(data);
    const info = $('.user-info');
    const posts = [];
    $('.items .item').each((i, el) => {
      const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      const link = 'https://imginn.com' + $(el).find('a').attr('href');
      posts.push({ thumbnail: img, link });
    });
    return {
      status: true,
      profile: {
        name: info.find('h1').text().trim(),
        username: username,
        bio: info.find('.desc').text().trim(),
        avatar: info.find('img').attr('src')
      },
      latest_posts: posts.slice(0, 10)
    };
  } catch (e) { return { status: false, message: "User not found" }; }
}

async function pinterestSearch(query) {
  try {
    const { data } = await axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, { headers: { 'User-Agent': UA, 'Referer': 'https://www.pinterest.com/' } });
    const $ = cheerio.load(data);
    const script = $('#__PWS_DATA__').html();
    const json = JSON.parse(script);
    const pins = json.props.initialReduxState.pins;
    const results = Object.values(pins)
      .filter(pin => pin.images && (pin.images.orig || pin.images['736x']))
      .map(pin => pin.images.orig ? pin.images.orig.url : pin.images['736x'].url);
    return results.slice(0, 10);
  } catch (e) { return { status: false, message: e.message }; }
}

async function pinterestDl(url) {
  try {
    const { data } = await axios.get(url, { headers: { 'User-Agent': UA, 'Referer': 'https://www.pinterest.com/' } });
    const $ = cheerio.load(data);
    const script = $('#__PWS_DATA__').html();
    const json = JSON.parse(script);
    
    if(!json.props || !json.props.initialReduxState || !json.props.initialReduxState.pins) return { status: false, message: "Pin data not found" };

    const pins = json.props.initialReduxState.pins;
    const pinId = Object.keys(pins)[0];
    const pinData = pins[pinId];

    let result = {};
    if (pinData.videos && pinData.videos.video_list) {
      const vids = pinData.videos.video_list;
      result = { type: 'video', url: vids.V_720P ? vids.V_720P.url : vids.V_HLSV3_MOBILE.url };
    } else {
      result = { type: 'image', url: pinData.images.orig.url };
    }
    
    return { status: true, ...result };
  } catch (e) { return { status: false, message: "Failed to download Pin" }; }
}

async function twitterDl(url) {
  try {
    const id = url.split('/').pop().split('?')[0];
    const { data } = await axios.post('https://ssstwitter.com/', new URLSearchParams({ id: url }), { headers: { 'User-Agent': UA } });
    const $ = cheerio.load(data);
    const media = [];
    $('.result_overlay a.download_link').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if(href && href !== '#') media.push({ quality: text, url: href });
    });
    
    if (media.length === 0) {
        const img = $('.result_overlay img').attr('src');
        if(img) return { status: true, type: 'image', url: img };
        return { status: false, message: "Content not found" };
    }
    return { status: true, type: 'video', media };
  } catch (e) { return { status: false, message: e.message }; }
}

async function twitterStalk(username) {
    try {
        const { data } = await axios.get(`https://nitter.net/${username}`, { headers: { 'User-Agent': UA } });
        const $ = cheerio.load(data);
        if($('.error-panel').length) return { status: false, message: "User not found" };
        
        const profile = {
            name: $('.profile-card-fullname').text().trim(),
            username: $('.profile-card-username').text().trim(),
            bio: $('.profile-bio').text().trim(),
            avatar: $('.profile-card-avatar').attr('href'),
            banner: $('.profile-banner img').attr('src')
        };
        
        const tweets = [];
        $('.timeline-item').slice(0, 5).each((i, el) => {
            const content = $(el).find('.tweet-content').text().trim();
            const time = $(el).find('.tweet-date a').attr('title');
            if(content) tweets.push({ content, time });
        });
        
        return { status: true, profile, tweets };
    } catch(e) { return { status: false, message: "Failed to stalk Twitter" }; }
}

async function twitterSearch(query) {
    try {
        const { data } = await axios.get(`https://nitter.net/search?f=tweets&q=${encodeURIComponent(query)}`, { headers: { 'User-Agent': UA } });
        const $ = cheerio.load(data);
        const tweets = [];
        $('.timeline-item').slice(0, 10).each((i, el) => {
            const user = $(el).find('.fullname').text().trim();
            const content = $(el).find('.tweet-content').text().trim();
            const link = 'https://twitter.com' + $(el).find('.tweet-link').attr('href');
            if(content) tweets.push({ user, content, link });
        });
        return { status: true, results: tweets };
    } catch(e) { return { status: false, message: "Failed to search Twitter" }; }
}

module.exports = { 
  tiktokDl, tiktokSearch, tiktokStalk, 
  youtubeSearch, youtubeDl, ytmp3,
  instaDl, instaStalk, 
  pinterestDl, pinterestSearch, 
  twitterDl, twitterStalk, twitterSearch
};
