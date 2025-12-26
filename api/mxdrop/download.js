const axios = require('axios');
const cheerio = require('cheerio');

const validApiKeys = ['DEMO-KEY', 'YOUR-API-KEY-1', 'YOUR-API-KEY-2'];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, apikey } = req.query;

  if (!apikey || !validApiKeys.includes(apikey)) {
    return res.status(401).json({
      status: false,
      message: 'Invalid or missing API key',
      developer: 'Kayzen Izumi'
    });
  }

  if (!url) {
    return res.status(400).json({
      status: false,
      message: 'URL parameter is required',
      developer: 'Kayzen Izumi'
    });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    const title = $('meta[property="og:title"]').attr('content') || 'Unknown Title';
    const downloadLink = $('a.btn-download').attr('href') || $('#download-button').attr('href');
    const thumbnail = $('meta[property="og:image"]').attr('content');

    if (!downloadLink) {
      return res.status(404).json({
        status: false,
        message: 'Download link not found',
        developer: 'Kayzen Izumi'
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        title: title,
        download_url: downloadLink,
        thumbnail: thumbnail || 'N/A'
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
