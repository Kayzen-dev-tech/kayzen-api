const axios = require('axios');

const validApiKeys = ['DEMO-KEY', 'YOUR-API-KEY-1', 'YOUR-API-KEY-2'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, apikey } = req.query;

  if (!apikey || !validApiKeys.includes(apikey)) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key',
      developer: 'Kayzen Izumi'
    });
  }

  if (!query) {
    return res.status(400).json({
      status: false,
      message: 'Query parameter is required',
      developer: 'Kayzen Izumi'
    });
  }

  try {
    const response = await axios.post('https://www.tikwm.com/api/feed/search', {
      keywords: query,
      count: 10,
      cursor: 0
    });

    if (response.data.code === 0) {
      const videos = response.data.data.videos.map(video => ({
        video_id: video.video_id,
        title: video.title,
        author: video.author.nickname,
        play_count: video.play_count,
        download_count: video.download_count,
        cover: video.cover,
        video_url: `https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`
      }));

      return res.status(200).json({
        status: true,
        data: videos,
        developer: 'Kayzen Izumi'
      });
    } else {
      return res.status(404).json({
        status: false,
        message: 'No results found',
        developer: 'Kayzen Izumi'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
      developer: 'Kayzen Izumi'
    });
  }
};
