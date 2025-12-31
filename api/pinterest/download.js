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

    const pinId = url.match(/pin\/(\d+)/)?.[1];
    
    if (!pinId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Pinterest URL'
      });
    }

    const apiUrl = `https://www.pinterest.com/resource/PinResource/get/?source_url=/pin/${pinId}/&data={"options":{"id":"${pinId}","field_set_key":"detailed"},"context":{}}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;
    const pin = data.resource_response.data;

    if (!pin) {
      return res.status(404).json({
        success: false,
        error: 'Pin not found'
      });
    }

    return res.json({
      success: true,
      data: {
        id: pin.id,
        title: pin.grid_title || pin.description || 'Pinterest Image',
        description: pin.description,
        image_url: pin.images?.orig?.url || pin.images?.['736x']?.url,
        author: pin.pinner?.username || 'Unknown',
        author_image: pin.pinner?.image_small_url,
        repin_count: pin.repin_count,
        like_count: pin.aggregated_pin_data?.aggregated_stats?.saves
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to download Pinterest image',
      message: error.message
    });
  }
};
