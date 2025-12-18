const axios = require('axios');

const HEADERS = {
    accept: '*/*',
    'accept-language': 'id-ID',
    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // Cookie ini mungkin perlu diperbarui berkala jika expired
    cookie: 'PHPSESSID=ofu9rbop984f7ovqdsp72q9t82', 
    origin: 'https://ytdown.io',
    referer: 'https://ytdown.io/en/',
    'sec-ch-ua': '"Chromium";v="127", "Not)A;Brand";v="99", "Microsoft Edge Simulate";v="127", "Lemur";v="127"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
    'x-requested-with': 'XMLHttpRequest'
};

async function getFinalFileUrl(mediaUrl) {
  try {
      const data = new URLSearchParams({ url: mediaUrl }).toString();
      const resp = await axios.post('https://ytdown.io/proxy.php', data, { headers: HEADERS });
      return resp.data.api.fileUrl;
  } catch (e) {
      return null;
  }
}

async function ytdown(url) {
  if (!url) return { error: "URL YouTube wajib diisi" };

  try {
    const phaseOneData = new URLSearchParams({ url: url }).toString();
    const phaseOneResp = await axios.post('https://ytdown.io/proxy.php', phaseOneData, { headers: HEADERS });
    
    const resPhase1 = phaseOneResp.data.api;
    if (!resPhase1 || !resPhase1.mediaItems) return { error: "Video tidak ditemukan atau server sibuk" };

    const downloadsVideo = [];

    // Filter resolusi yang diinginkan
    const allowedRes = ['640x360', '854x480', '1280x720', '1920x1080'];

    for(const item of resPhase1.mediaItems) {
      if(item.type.toLowerCase() === 'video') {
        if(allowedRes.includes(item.mediaRes)) {
          // Mendapatkan link final
          const finalUrl = await getFinalFileUrl(item.mediaUrl);
          
          if (finalUrl) {
              downloadsVideo.push({
                quality: item.mediaRes === '640x360' ? '360p' : 
                         item.mediaRes === '854x480' ? '480p' : 
                         item.mediaRes === '1280x720' ? '720p' : '1080p',
                resolution: item.mediaRes,
                size: item.mediaFileSize,
                extension: item.mediaExtension,
                url: finalUrl,
                thumbnail: item.mediaThumbnail
              });
          }
        }
      }
    }

    return {
      title: resPhase1.title,
      description: resPhase1.description,
      thumbnail: resPhase1.imagePreviewUrl,
      channel: {
        name: resPhase1.userInfo?.name || "Unknown",
        username: resPhase1.userInfo?.username || null,
        subscribers: resPhase1.mediaStats?.followersCount || "0",
        joined: resPhase1.userInfo?.dateJoined || null,
        verified: resPhase1.userInfo?.isVerified || false,
        avatar: resPhase1.userInfo?.userAvatar || null
      },
      downloads: downloadsVideo.length ? downloadsVideo : []
    };

  } catch (e) {
    console.error("Error YtDown:", e.message);
    return { error: e.message };
  }
}

module.exports = ytdown;
