const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'URL parameter is required'
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube URL'
      });
    }

    const apiUrl = `https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
        'X-RapidAPI-Key': 'demo-key'
      }
    });

    const data = response.data;

    if (!data || data.status !== 'ok') {
      const altApiUrl = `https://api.cobalt.tools/api/json`;
      const altResponse = await axios.post(altApiUrl, {
        url: url,
        vCodec: 'h264',
        vQuality: 'max',
        aFormat: 'mp3',
        filenamePattern: 'basic',
        isAudioOnly: true
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      return res.json({
        success: true,
        data: {
          title: altResponse.data.title || 'YouTube Audio',
          downloadUrl: altResponse.data.url,
          format: 'mp3'
        }
      });
    }

    return res.json({
      success: true,
      data: {
        title: data.title,
        duration: data.duration,
        downloadUrl: data.link,
        format: 'mp3',
        quality: data.quality
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to convert YouTube to MP3',
      message: error.message
    });
  }
};

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}
