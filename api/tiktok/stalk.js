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

    const apiUrl = `https://www.tikwm.com/api/user/info?unique_id=${username}`;
    
    const response = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const data = response.data;

    if (!data || data.code !== 0 || !data.data) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const user = data.data.user;
    const stats = data.data.stats;

    return res.json({
      success: true,
      data: {
        username: user.unique_id,
        nickname: user.nickname,
        avatar: user.avatar_larger,
        signature: user.signature,
        verified: user.verified,
        private_account: user.secret,
        stats: {
          followers: stats.followerCount,
          following: stats.followingCount,
          likes: stats.heartCount,
          videos: stats.videoCount
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch TikTok profile',
      message: error.message
    });
  }
};
