const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    const apiUrl = `https://www.tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=10&cursor=0&web=1&hd=1`;
    
    const response = await axios.post(apiUrl, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;

    if (!data || data.code !== 0) {
      return res.status(404).json({
        success: false,
        error: 'No results found'
      });
    }

    const videos = data.data.videos.map(video => ({
      id: video.video_id,
      title: video.title,
      author: video.author.nickname,
      username: video.author.unique_id,
      avatar: video.author.avatar,
      duration: video.duration,
      play_count: video.play_count,
      like_count: video.digg_count,
      comment_count: video.comment_count,
      share_count: video.share_count,
      download_url: video.play,
      cover: video.cover,
      music: video.music
    }));

    return res.json({
      success: true,
      query: query,
      count: videos.length,
      data: videos
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to search TikTok videos',
      message: error.message
    });
  }
};
