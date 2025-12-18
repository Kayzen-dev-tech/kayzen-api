const axios = require('axios');

const randomAnime = {
  waifu: async () => {
    try {
      const { data } = await axios.get('https://api.waifu.pics/sfw/waifu');
      return data.url;
    } catch (e) {
      return null;
    }
  },
  
  neko: async () => {
    try {
      const { data } = await axios.get('https://api.waifu.pics/sfw/neko');
      return data.url;
    } catch (e) {
      return null;
    }
  },

  loli: async () => {
    try {
      const { data } = await axios.get(`https://www.pngwing.com/id/search?q=anime+Loli`);
      return data.url;
    } catch (e) {
      return null;
    }
  }
};

module.exports = randomAnime;
