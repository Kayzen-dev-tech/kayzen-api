const axios = require('axios');

const validApiKeys = ['DEMO-KEY', 'YOUR-API-KEY-1', 'YOUR-API-KEY-2'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, apikey } = req.query;

  if (!apikey || !validApiKeys.includes(apikey)) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key',
      developer: 'Kayzen Izumi'
    });
  }

  if (!query) {
    return res.status(400).json({
      status: false,
      message: 'Query parameter is required',
      developer: 'Kayzen Izumi'
    });
  }

  try {
    const response = await axios.get(`https://api.ryzendesu.vip/api/search/pinterest?query=${encodeURIComponent(query)}`);
    
    let images = [];
    if (Array.isArray(response.data)) {
      images = response.data.slice(0, 5);
    } else if (response.data.data && Array.isArray(response.data.data)) {
      images = response.data.data.slice(0, 5);
    }

    return res.status(200).json({
      status: true,
      data: {
        query: query,
        count: images.length,
        images: images
      },
      developer: 'Kayzen Izumi'
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.message,
      developer: 'Kayzen Izumi'
    });
  }
};
