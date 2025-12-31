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

    const apiUrl = `https://www.instagram.com/api/v1/web/search/topsearch/?context=blended&query=${encodeURIComponent(query)}&include_reel=true`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Instagram 76.0.0.15.395 Android',
        'Accept': '*/*'
      }
    });

    const data = response.data;

    if (!data || !data.users) {
      return res.status(404).json({
        success: false,
        error: 'No results found'
      });
    }

    const results = data.users.map(item => ({
      username: item.user.username,
      full_name: item.user.full_name,
      profile_pic: item.user.profile_pic_url,
      is_verified: item.user.is_verified,
      is_private: item.user.is_private,
      follower_count: item.user.follower_count
    }));

    return res.json({
      success: true,
      query: query,
      count: results.length,
      data: results
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to search Instagram',
      message: error.message
    });
  }
};
