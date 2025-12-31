const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({
        success: false,
        error: 'Username parameter is required'
      });
    }

    const apiUrl = `https://twitter-api45.p.rapidapi.com/screenname.php?screenname=${username}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-RapidAPI-Host': 'twitter-api45.p.rapidapi.com',
        'X-RapidAPI-Key': 'demo-key'
      }
    });

    const data = response.data;

    if (!data || !data.screen_name) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    return res.json({
      success: true,
      data: {
        username: data.screen_name,
        name: data.name,
        bio: data.description,
        avatar: data.avatar,
        banner: data.header_image,
        verified: data.blue_verified,
        location: data.location,
        website: data.website,
        created_at: data.created_at,
        stats: {
          followers: data.followers,
          following: data.following,
          tweets: data.tweets
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch Twitter profile',
      message: error.message
    });
  }
};
