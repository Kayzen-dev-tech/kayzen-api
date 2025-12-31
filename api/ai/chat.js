const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text parameter is required'
      });
    }

    const apiUrl = 'https://luminai.siputzx.my.id/';
    
    const response = await axios.post(apiUrl, {
      content: text
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.result || response.data.response;

    if (!reply) {
      return res.status(500).json({
        success: false,
        error: 'No response from AI'
      });
    }

    return res.json({
      success: true,
      question: text,
      answer: reply,
      model: 'LuminAI'
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Failed to get AI response',
      message: error.message
    });
  }
};
