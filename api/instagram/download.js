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

    const apiUrl = `https://v3.saveig.app/api/ajaxSearch`;
    
    const response = await axios.post(apiUrl, 
      `q=${encodeURIComponent(url)}&t=media&lang=en`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0'
        }
      }
    );

    const data = response.data;

    if (!data || data.status !== 'ok') {
      return res.status(404).json({
        success: false,
        error: 'Post not found or invalid URL'
      });
    }

    const html = data.data;
    const thumbnailMatch = html.match(/src="([^"]+)"/);
    const downloadMatch = html.match(/href="([^"]+)"/g);

    const downloads = [];
    if (downloadMatch) {
      downloadMatch.forEach(link => {
        const urlMatch = link.match(/href="([^"]+)"/);
        if (urlMatch && urlMatch[1].includes('http')) {
          downloads.push(urlMatch[1]);
        }
      });
    }

    return res.json({
      success: true,
      data: {
        thumbnail: thumbnailMatch ? thumbnailMatch[1] : '',
        downloads: downloads,
        type: downloads.length > 1 ? 'carousel' : 'single'
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to download Instagram media',
      message: error.message
    });
  }
};
