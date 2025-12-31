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

    const apiUrl = `https://twitsave.com/info?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const html = response.data;
    
    const titleMatch = html.match(/<div class="origin-top-right[^>]*>(.*?)<\/div>/s);
    const videoMatches = html.match(/href="(https:\/\/[^"]+\.(mp4|mov))"/gi);

    if (!videoMatches || videoMatches.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No video found or invalid URL'
      });
    }

    const videos = [];
    videoMatches.forEach(match => {
      const urlMatch = match.match(/href="([^"]+)"/);
      if (urlMatch) {
        const quality = match.includes('1080') ? '1080p' : match.includes('720') ? '720p' : '480p';
        videos.push({
          quality: quality,
          url: urlMatch[1]
        });
      }
    });

    return res.json({
      success: true,
      data: {
        title: titleMatch ? titleMatch[1].replace(/<[^>]*>/g, '').trim() : 'Twitter Video',
        videos: videos
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to download Twitter video',
      message: error.message
    });
  }
};
