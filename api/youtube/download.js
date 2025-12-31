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

    const apiUrl = `https://youtube-downloader-api-ten.vercel.app/api/video?videoId=${videoId}`;
    
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.title) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    return res.json({
      success: true,
      data: {
        title: data.title,
        duration: data.duration,
        thumbnail: data.thumbnail,
        channel: data.channel,
        formats: data.formats || [],
        downloadLinks: {
          mp4_360p: data.downloadUrl360p,
          mp4_720p: data.downloadUrl720p,
          mp4_1080p: data.downloadUrl1080p
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to download YouTube video',
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
