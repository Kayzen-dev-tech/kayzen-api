const axios = require('axios');
const cheerio = require('cheerio');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function tiktokDl(url) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/', { url: url, hd: 1 });
    if (data.code !== 0) return { status: false, message: "Video not found" };
    return { status: true, ...data.data };
  } catch (e) { 
    return { status: false, message: e.message }; 
  }
}

async function tiktokSearch(query) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/feed/search', { 
      keywords: query, 
      count: 12, 
      cursor: 0, 
      web: 1, 
      hd: 1 
    });
    if (data.code !== 0) return { status: false, message: "No results" };
    return { status: true, results: data.data.videos };
  } catch (e) { 
    return { status: false, message: e.message }; 
  }
}

async function tiktokStalk(username) {
  try {
    const { data } = await axios.post('https://www.tikwm.com/api/user/info', { 
      unique_id: username 
    });
    if (data.code !== 0) return { status: false, message: "User not found" };
    return { status: true, profile: data.data };
  } catch (e) { 
    return { status: false, message: e.message }; 
  }
}

async function youtubeSearch(query) {
  try {
    const { data } = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, { 
      headers: { 'User-Agent': UA } 
    });
    const $ = cheerio.load(data);
    
    const scriptTags = $('script');
    let ytInitialData = null;
    
    scriptTags.each((i, el) => {
      const html = $(el).html();
      if (html && html.includes('var ytInitialData =')) {
        try {
          const jsonStr = html.split('var ytInitialData =')[1].split(';</script>')[0].trim();
          ytInitialData = JSON.parse(jsonStr);
        } catch (parseError) {
          return;
        }
      }
    });
    
    if (!ytInitialData) return { status: false, message: "Failed to parse YouTube data" };
    
    const contents = ytInitialData?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents;
    
    if (!contents) return { status: false, message: "No results found" };
    
    const results = contents
      .filter(c => c.videoRenderer)
      .map(c => {
        const v = c.videoRenderer;
        return {
          title: v.title?.runs?.[0]?.text || 'No title',
          url: `https://www.youtube.com/watch?v=${v.videoId}`,
          duration: v.lengthText?.simpleText || 'Live',
          thumbnail: v.thumbnail?.thumbnails?.[0]?.url || '',
          author: v.ownerText?.runs?.[0]?.text || 'Unknown'
        };
      })
      .slice(0, 10);
    
    return { status: true, results };
  } catch (e) { 
    return { status: false, message: e.message }; 
  }
}

async function youtubeDl(url) {
  try {
    const { data: init } = await axios.post(
      'https://www.y2mate.com/mates/analyzeV2/ajax', 
      new URLSearchParams({ 
        k_query: url, 
        k_page: 'home', 
        hl: 'en', 
        q_auto: 0 
      }), 
      {
        headers: { 
          'User-Agent': UA, 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
        }
      }
    );

    if (!init?.links?.mp4) return { status: false, message: "Video not found" };

    let k = '';
    const mp4 = init.links.mp4;
    
    for (const key in mp4) {
      if (mp4[key].q === '720p' || mp4[key].q === 'auto') {
        k = mp4[key].k;
        break;
      }
    }
    
    if (!k) k = Object.values(mp4)[0].k;

    const { data: convert } = await axios.post(
      'https://www.y2mate.com/mates/convertV2/index', 
      new URLSearchParams({ 
        vid: init.vid, 
        k: k 
      }), 
      {
        headers: { 
          'User-Agent': UA, 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
        }
      }
    );

    if (convert.status !== 'ok') return { status: false, message: "Conversion failed" };

    return { 
      status: true, 
      title: convert.title, 
      download: convert.dlink, 
      quality: convert.fquality 
    };
  } catch (e) { 
    return { status: false, message: "YouTube download service unavailable" }; 
  }
}

async function ytmp3(url) {
  try {
    const { data: init } = await axios.post(
      'https://www.y2mate.com/mates/analyzeV2/ajax', 
      new URLSearchParams({ 
        k_query: url, 
        k_page: 'home', 
        hl: 'en', 
        q_auto: 0 
      }), 
      {
        headers: { 
          'User-Agent': UA, 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
        }
      }
    );

    if (!init?.links?.mp3) return { status: false, message: "Audio not found" };

    const k = Object.values(init.links.mp3)[0].k;

    const { data: convert } = await axios.post(
      'https://www.y2mate.com/mates/convertV2/index', 
      new URLSearchParams({ 
        vid: init.vid, 
        k: k 
      }), 
      {
        headers: { 
          'User-Agent': UA, 
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' 
        }
      }
    );

    return { 
      status: true, 
      title: convert.title, 
      download: convert.dlink, 
      quality: '128kbps' 
    };
  } catch (e) { 
    return { status: false, message: "YouTube audio service unavailable" }; 
  }
}

async function instaDl(url) {
  try {
    const { data } = await axios.post(
      'https://snapinsta.app/action.php', 
      new URLSearchParams({ 
        url: url, 
        action: 'post' 
      }), 
      {
        headers: { 
          'User-Agent': UA, 
          'Origin': 'https://snapinsta.app', 
          'Referer': 'https://snapinsta.app/' 
        }
      }
    );

    if (!data) return { status: false, message: "Failed to fetch Instagram data" };

    const $ = cheerio.load(data);
    const media = [];
    
    $('.download-bottom a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('http')) media.push(href);
    });

    if (media.length === 0) return { status: false, message: "Content private or not found" };
    
    return { status: true, media };
  } catch (e) { 
    return { status: false, message: "Instagram service unavailable" }; 
  }
}

async function instaStalk(username) {
  try {
    const { data } = await axios.get(
      `https://imginn.com/${username}/`, 
      { 
        headers: { 
          'User-Agent': UA, 
          'Cookie': 'ct=0' 
        } 
      }
    );
    
    const $ = cheerio.load(data);
    const info = $('.user-info');
    
    if (info.length === 0) return { status: false, message: "User not found" };

    const posts = [];
    $('.items .item').each((i, el) => {
      const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
      const link = $(el).find('a').attr('href');
      if (img && link) {
        posts.push({ 
          thumbnail: img, 
          link: link.startsWith('http') ? link : 'https://imginn.com' + link 
        });
      }
    });
    
    return {
      status: true,
      profile: {
        name: info.find('h1').text().trim() || username,
        username: username,
        bio: info.find('.desc').text().trim() || '',
        avatar: info.find('img').attr('src') || ''
      },
      latest_posts: posts.slice(0, 10)
    };
  } catch (e) { 
    return { status: false, message: "Instagram stalk service unavailable" }; 
  }
}

async function pinterestSearch(query) {
  try {
    const params = {
      source_url: `/search/pins/?q=${encodeURIComponent(query)}`,
      data: JSON.stringify({
        options: {
          isPrefetch: false,
          query: query,
          scope: "pins",
          no_fetch_context_on_resource: false
        },
        context: {}
      }),
      _: Date.now()
    };
    
    const { data } = await axios.get(
      'https://www.pinterest.com/resource/BaseSearchResource/get/', 
      { 
        params: params, 
        headers: { 
          'User-Agent': UA, 
          'Referer': 'https://www.pinterest.com/' 
        } 
      }
    );
    
    if (!data?.resource_response?.data?.results) {
      return { status: false, message: "No results found" };
    }
    
    const results = data.resource_response.data.results
      .filter(v => v?.images?.orig?.url)
      .map(v => v.images.orig.url)
      .slice(0, 10);
    
    if (results.length === 0) return { status: false, message: "No images found" };
    
    return { status: true, results };
  } catch (e) { 
    return { status: false, message: "Pinterest service unavailable" }; 
  }
}

async function pinterestDl(url) {
  try {
    const { data } = await axios.get(url, { 
      headers: { 
        'User-Agent': UA, 
        'Referer': 'https://www.pinterest.com/' 
      } 
    });
    
    const $ = cheerio.load(data);
    
    const videoUrl = $('video').attr('src') || $('video source').attr('src');
    if (videoUrl) {
      const cleanUrl = videoUrl.replace('/hls/', '/720p/').replace('.m3u8', '.mp4');
      return { status: true, type: 'video', url: cleanUrl };
    }

    const imageUrl = $('meta[property="og:image"]').attr('content');
    if (imageUrl) {
      return { status: true, type: 'image', url: imageUrl };
    }

    const script = $('#__PWS_DATA__').html();
    if (script) {
      try {
        const json = JSON.parse(script);
        const pins = json?.props?.initialReduxState?.pins;
        
        if (pins) {
          const pinId = Object.keys(pins)[0];
          const pinData = pins[pinId];
          
          if (pinData?.images?.orig?.url) {
            return { status: true, type: 'image', url: pinData.images.orig.url };
          }
        }
      } catch (parseError) {
        return { status: false, message: "Failed to parse pin data" };
      }
    }

    return { status: false, message: "Media not found" };
  } catch (e) { 
    return { status: false, message: "Failed to download pin" }; 
  }
}

async function twitterDl(url) {
  try {
    const { data } = await axios.post(
      'https://ssstwitter.com/', 
      new URLSearchParams({ id: url }), 
      { 
        headers: { 
          'User-Agent': UA,
          'Content-Type': 'application/x-www-form-urlencoded'
        } 
      }
    );
    
    const $ = cheerio.load(data);
    const media = [];
    
    $('.result_overlay a.download_link').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (href && href !== '#' && href.startsWith('http')) {
        media.push({ quality: text, url: href });
      }
    });
    
    if (media.length === 0) {
      const img = $('.result_overlay img').attr('src');
      if (img && img.startsWith('http')) {
        return { status: true, type: 'image', url: img };
      }
      return { status: false, message: "Content not found or private" };
    }
    
    return { status: true, type: 'video', media };
  } catch (e) { 
    return { status: false, message: "Twitter download service unavailable" }; 
  }
}

async function twitterStalk(username) {
  try {
    const { data } = await axios.get(
      `https://nitter.net/${username}`, 
      { 
        headers: { 
          'User-Agent': UA 
        },
        timeout: 10000
      }
    );
    
    const $ = cheerio.load(data);
    
    if ($('.error-panel').length) {
      return { status: false, message: "User not found" };
    }
    
    const profile = {
      name: $('.profile-card-fullname').text().trim() || username,
      username: $('.profile-card-username').text().trim() || `@${username}`,
      bio: $('.profile-bio').text().trim() || '',
      avatar: $('.profile-card-avatar').attr('href') || '',
      banner: $('.profile-banner img').attr('src') || ''
    };
    
    const tweets = [];
    $('.timeline-item').slice(0, 5).each((i, el) => {
      const content = $(el).find('.tweet-content').text().trim();
      const time = $(el).find('.tweet-date a').attr('title');
      if (content) {
        tweets.push({ content, time: time || 'Unknown' });
      }
    });
    
    return { status: true, profile, tweets };
  } catch (e) { 
    return { status: false, message: "Twitter stalk service unavailable (Nitter may be down)" }; 
  }
}

async function twitterSearch(query) {
  try {
    const { data } = await axios.get(
      `https://nitter.net/search?f=tweets&q=${encodeURIComponent(query)}`, 
      { 
        headers: { 
          'User-Agent': UA 
        },
        timeout: 10000
      }
    );
    
    const $ = cheerio.load(data);
    const tweets = [];
    
    $('.timeline-item').slice(0, 10).each((i, el) => {
      const user = $(el).find('.fullname').text().trim();
      const content = $(el).find('.tweet-content').text().trim();
      const tweetLink = $(el).find('.tweet-link').attr('href');
      
      if (content) {
        tweets.push({ 
          user: user || 'Unknown', 
          content, 
          link: tweetLink ? 'https://twitter.com' + tweetLink : '' 
        });
      }
    });
    
    if (tweets.length === 0) {
      return { status: false, message: "No tweets found" };
    }
    
    return { status: true, results: tweets };
  } catch (e) { 
    return { status: false, message: "Twitter search service unavailable (Nitter may be down)" }; 
  }
}

module.exports = { 
  tiktokDl, 
  tiktokSearch, 
  tiktokStalk, 
  youtubeSearch, 
  youtubeDl, 
  ytmp3,
  instaDl, 
  instaStalk, 
  pinterestDl, 
  pinterestSearch, 
  twitterDl, 
  twitterStalk, 
  twitterSearch
};
