const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt parameter is required'
      });
    }

    const apiUrl = `https://ai-api.magicstudio.com/api/ai-art-generator`;
    
    const response = await axios.post(apiUrl, {
      prompt: prompt,
      output_format: 'bytes',
      user_profile_id: 'null',
      anonymous_user_id: 'a584e30d-1996-4598-909f-70c7ac715dc1',
      request_timestamp: Date.now(),
      user_is_subscribed: false,
      client_id: 'pSgX7WgjukXCBoYwDM8G8GLnRRkvAoJlqa5eAVvj95o'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const imageUrl = response.data.image_url || response.data.url;

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate image'
      });
    }

    return res.json({
      success: true,
      prompt: prompt,
      image_url: imageUrl,
      model: 'AI Art Generator'
    });

  } catch (error) {
    const fallbackUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512`;
    
    return res.json({
      success: true,
      prompt: prompt,
      image_url: fallbackUrl,
      model: 'Pollinations AI',
      note: 'Using fallback image generator'
    });
  }
};
