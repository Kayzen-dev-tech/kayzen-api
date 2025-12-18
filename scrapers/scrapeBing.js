const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
};

const bing = {
  search: async (query) => {
    try {
      const { data } = await axios.get(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, { headers: HEADERS });
      const $ = cheerio.load(data);
      const results = [];

      $('.b_algo').each((index, element) => {
        const title = $(element).find('h2').text().trim();
        const link = $(element).find('a').attr('href');
        const snippet = $(element).find('.b_caption p').text().trim();
        // Mengambil link gambar thumbnail jika ada (opsional)
        const image = $(element).find('.cico .rms_iac').attr('data-src') || $(element).find('img.rms_img').attr('src');

        if (title && link) {
            results.push({
              title,
              link,
              snippet,
              image: image ? (image.startsWith('http') ? image : `https:${image}`) : null
            });
        }
      });

      return results;
    } catch (error) {
      console.error('Error Bing Search:', error.message);
      return [];
    }
  },

  images: async (query) => {
    try {
      const { data } = await axios.get(`https://www.bing.com/images/search?q=${encodeURIComponent(query)}`, { headers: HEADERS });
      const $ = cheerio.load(data);
      const results = [];

      // Loop elemen gambar
      $(".imgpt > a").each((i, el) => {
        const href = $(el).attr("href");
        if (href) {
            results.push({
              // Link ini mengarah ke halaman detail gambar Bing
              url: 'https://www.bing.com' + href 
            });
        }
      });
      return results;
    } catch (error) {
      console.error('Error Bing Images:', error.message);
      return [];
    }
  },

  videos: async (query) => {
    try {
      const { data } = await axios.get(`https://www.bing.com/videos/search?q=${encodeURIComponent(query)}`, { headers: HEADERS });
      const $ = cheerio.load(data);
      const videoDetails = [];
        
      $('.mc_vtvc').each((index, element) => {
          const title = $(element).find('.mc_vtvc_title strong').text().trim();
          const duration = $(element).find('.mc_bc_rc.items').first().text().trim();
          const views = $(element).find('.meta_vc_content').first().text().trim();
          const uploadDate = $(element).find('.meta_pd_content').first().text().trim();
          const channel = $(element).find('.mc_vtvc_meta_row_channel').text().trim();
          const link = $(element).find('a').attr('href');

          if (title && link) {
              videoDetails.push({
                  title,
                  duration,
                  views,
                  uploadDate,
                  channel,
                  link: link.startsWith('http') ? link : `https://www.bing.com${link}`
              });
          }
      });

      return videoDetails;
    } catch (error) {
      console.error('Error Bing Videos:', error.message);
      return [];
    }
  }
};

module.exports = bing;
