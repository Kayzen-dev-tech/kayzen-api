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

    const apiUrl = `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
        'X-RapidAPI-Key': 'demo-key'
      }
    });

    const data = response.data.data;

    if (!data) {
      const altApiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
      
      const altResponse = await axios.get(altApiUrl, {
        headers: {
          'User-Agent': 'Instagram 76.0.0.15.395 Android',
          'X-IG-App-ID': '936619743392459'
        }
      });

      const user = altResponse.data.data.user;

      return res.json({
        success: true,
        data: {
          username: user.username,
          full_name: user.full_name,
          biography: user.biography,
          profile_pic: user.profile_pic_url_hd,
          is_verified: user.is_verified,
          is_private: user.is_private,
          stats: {
            followers: user.edge_followed_by.count,
            following: user.edge_follow.count,
            posts: user.edge_owner_to_timeline_media.count
          }
        }
      });
    }

    return res.json({
      success: true,
      data: {
        username: data.username,
        full_name: data.full_name,
        biography: data.biography,
        profile_pic: data.profile_pic_url_hd,
        is_verified: data.is_verified,
        is_private: data.is_private,
        stats: {
          followers: data.follower_count,
          following: data.following_count,
          posts: data.media_count
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch Instagram profile',
      message: error.message
    });
  }
};
