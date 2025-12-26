const axios = require('axios');

const validApiKeys = ['DEMO-KEY', 'YOUR-API-KEY-1', 'YOUR-API-KEY-2'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, apikey } = req.query;

  if (!apikey || !validApiKeys.includes(apikey)) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key',
      developer: 'Kayzen Izumi'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      message: 'URL parameter is required',
      developer: 'Kayzen Izumi'
    });
  }

  try {
    const response = await axios.post('https://www.tikwm.com/api/', {
      url: url,
      hd: 1
    });

    if (response.data.code === 0) {
      return res.status(200).json({
        status: true,
        data: {
          title: response.data.data.title,
          author: response.data.data.author.nickname,
          play_count: response.data.data.play_count,
          download_count: response.data.data.download_count,
          video: response.data.data.play,
          video_hd: response.data.data.hdplay,
          music: response.data.data.music,
          cover: response.data.data.cover
        },
        developer: 'Kayzen Izumi'
      });
    } else {
      return res.status(404).json({
        status: false,
        message: 'Video not found',
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
