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

    const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
    
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.video) {
      return res.status(404).json({
        success: false,
        error: 'Video not found or invalid URL'
      });
    }

    return res.json({
      success: true,
      data: {
        title: data.title || 'TikTok Video',
        author: data.author || {},
        video: {
          noWatermark: data.video.noWatermark || '',
          watermark: data.video.watermark || ''
        },
        music: data.music || {},
        stats: data.stats || {}
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to download TikTok video',
      message: error.message
    });
  }
};
