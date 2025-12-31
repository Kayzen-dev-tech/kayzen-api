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

    const basicAnalysis = {
      word_count: text.split(' ').length,
      character_count: text.length,
      sentence_count: text.split(/[.!?]+/).filter(s => s.trim()).length,
      average_word_length: (text.replace(/\s/g, '').length / text.split(' ').length).toFixed(2)
    };

    const systemPrompt = 'You are an advanced text analyzer. Analyze the given text and provide insights about: sentiment (positive/negative/neutral), main topics, writing style, tone, and key takeaways. Be concise and structured in your analysis.';
    const fullPrompt = `${systemPrompt}\n\nText to analyze:\n${text}\n\nProvide your analysis:`;

    const apiUrl = 'https://luminai.siputzx.my.id/';
    
    const response = await axios.post(apiUrl, {
      content: fullPrompt
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const aiAnalysis = response.data.result || response.data.response;

    return res.json({
      success: true,
      original_text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      basic_stats: basicAnalysis,
      ai_analysis: aiAnalysis,
      model: 'LuminAI Analyzer'
    });

  } catch (error) {
    const basicAnalysis = {
      word_count: text.split(' ').length,
      character_count: text.length,
      sentence_count: text.split(/[.!?]+/).filter(s => s.trim()).length,
      average_word_length: (text.replace(/\s/g, '').length / text.split(' ').length).toFixed(2)
    };

    return res.json({
      success: true,
      original_text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
      basic_stats: basicAnalysis,
      ai_analysis: 'AI analysis temporarily unavailable. Basic statistics provided.',
      note: 'Fallback to basic analysis due to API error'
    });
  }
};
