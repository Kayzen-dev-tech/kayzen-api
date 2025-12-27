const axios = require('axios');
const cheerio = require('cheerio');

async function tiktok(url) {
  try {
    const response = await axios.post('https://www.tikwm.com/api/', {
      url: url,
      hd: 1
    });

    const data = response.data;

    if (data.code !== 0) {
      return { status: false, message: "Video not found or private" };
    }

    const res = data.data;
    return {
      status: true,
      title: res.title,
      cover: res.cover,
      region: res.region,
      video: {
        no_watermark: res.play,
        watermark: res.wmplay,
        audio: res.music
      },
      author: {
        uid: res.author.id,
        username: res.author.unique_id,
        nickname: res.author.nickname,
        avatar: res.author.avatar
      },
      stats: {
        views: res.play_count,
        likes: res.digg_count,
        comments: res.comment_count,
        shares: res.share_count,
        downloads: res.download_count
      }
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function pinterest(query) {
  try {
    const { data } = await axios.get(`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(query)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Referer': 'https://www.pinterest.com/'
      }
    });

    const $ = cheerio.load(data);
    const script = $('#__PWS_DATA__').html();

    if (!script) {
      return { status: false, message: "Failed to parse Pinterest data" };
    }

    const json = JSON.parse(script);
    const pins = json.props.initialReduxState.pins;

    if (!pins) {
      return { status: false, message: "No pins found" };
    }

    const results = Object.values(pins)
      .filter(pin => pin.images && (pin.images.orig || pin.images['736x']))
      .map(pin => pin.images.orig ? pin.images.orig.url : pin.images['736x'].url);

    return results.slice(0, 5);
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function youtube(url) {
  try {
    const payload = new URLSearchParams({ q: url, vt: 'home' });
    const { data: search } = await axios.post('https://yt1s.com/api/ajaxSearch/index', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!search.links) return { status: false, message: "Video not found" };

    const vid = search.vid;
    const mp4 = search.links.mp4;
    let k = '';
    let quality = '';

    for (const i in mp4) {
      if (mp4[i].q === '720p') {
        k = mp4[i].k;
        quality = '720p';
        break;
      }
    }

    if (!k) {
      const keys = Object.keys(mp4);
      k = mp4[keys[0]].k;
      quality = mp4[keys[0]].q;
    }

    const convertPayload = new URLSearchParams({ vid: vid, k: k });
    const { data: convert } = await axios.post('https://yt1s.com/api/ajaxConvert/convert', convertPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return {
      status: true,
      title: search.title,
      author: search.a,
      quality: quality,
      size: convert.ftitle,
      download_link: convert.dlink
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function ytmp3(url) {
  try {
    const payload = new URLSearchParams({ q: url, vt: 'home' });
    const { data: search } = await axios.post('https://yt1s.com/api/ajaxSearch/index', payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    if (!search.links || !search.links.mp3) return { status: false, message: "Audio not found" };

    const vid = search.vid;
    const mp3 = search.links.mp3;
    const keys = Object.keys(mp3);
    const k = mp3[keys[0]].k;

    const convertPayload = new URLSearchParams({ vid: vid, k: k });
    const { data: convert } = await axios.post('https://yt1s.com/api/ajaxConvert/convert', convertPayload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return {
      status: true,
      title: search.title,
      author: search.a,
      quality: mp3[keys[0]].q,
      size: convert.ftitle,
      download_link: convert.dlink
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

module.exports = { tiktok, pinterest, youtube, ytmp3 };
