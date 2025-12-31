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

    const apiUrl = `https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(query)}&data={"options":{"query":"${encodeURIComponent(query)}"},"context":{}}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;
    const results = data.resource_response.data.results;

    if (!results || results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No results found'
      });
    }

    const images = results.slice(0, 5).map(pin => ({
      id: pin.id,
      title: pin.grid_title || pin.description || 'Pinterest Image',
      image: pin.images?.orig?.url || pin.images?.['736x']?.url,
      pin_url: `https://www.pinterest.com/pin/${pin.id}`,
      author: pin.pinner?.username || 'Unknown'
    }));

    return res.json({
      success: true,
      query: query,
      count: images.length,
      data: images
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to search Pinterest',
      message: error.message
    });
  }
};
