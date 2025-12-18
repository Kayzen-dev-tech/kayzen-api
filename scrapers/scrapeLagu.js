const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeLagu(q) {
  try {
    const { data } = await axios.get(`https://www.azlyrics.com/search.php?q=${q}&x=3677e4b2d126437f865f1235123`);
    
    const $ = cheerio.load(data);
    const r = [];
    
    $('.table table tr').each((i, el) => {
      const judulLagu = $(el).find('td').eq(1).text().trim();
      const penyanyi = $(el).find('td').eq(0).text().trim();
      const link = $(el).find('td').eq(1).find('a').attr('href');
      
      if (judulLagu && link) {
        const fullLink = link.startsWith('http') ? link : `https://www.azlyrics.com${link}`;
        r.push({ judulLagu, penyanyi, link: fullLink });
      }
    });
    
    return r.slice(0, 5);
  } catch (e) {
    console.error("Error ScrapeLagu:", e.message);
    return [];
  }
}

module.exports = scrapeLagu;
