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

    const systemPrompt = 'You are a creative and helpful AI text generator. Generate high-quality, engaging content based on user prompts.';
    const fullPrompt = `${systemPrompt}\n\nUser request: ${prompt}\n\nGenerate the requested content:`;

    const apiUrl = 'https://luminai.siputzx.my.id/';
    
    const response = await axios.post(apiUrl, {
      content: fullPrompt
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const generatedText = response.data.result || response.data.response;

    if (!generatedText) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate text'
      });
    }

    return res.json({
      success: true,
      prompt: prompt,
      generated_text: generatedText,
      word_count: generatedText.split(' ').length,
      model: 'LuminAI Text Generator'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to generate text',
      message: error.message
    });
  }
};
