const axios = require('axios');
const cheerio = require('cheerio');

async function tiktok(url) {
  try {
    const response = await axios.post('https://www.tikwm.com/api/', { url: url, count: 12, cursor: 0, web: 1, hd: 1 });
    return response.data;
  } catch (error) {
    return { error: error.message };
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
  return {
    status: true,
    title: "YouTube Video Downloader Mock",
    url: url,
    download_link: "https://googlevideo.com/mock-download-link"
  };
}

async function ytmp3(url) {
  return {
    status: true,
    title: "YouTube Audio Downloader Mock",
    url: url,
    audio_link: "https://googlevideo.com/mock-audio-link.mp3"
  };
}

module.exports = { tiktok, pinterest, youtube, ytmp3 };
