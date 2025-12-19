const axios = require('axios');
const cheerio = require('cheerio');

async function randomAiGirls() {
  try {
    // Generate random page number (1-100, sesuaikan dengan jumlah halaman yang ada)
    const randomPage = Math.floor(Math.random() * 100) + 1;
    const url = `https://ai-girls.pro/page/${randomPage}/`;
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://ai-girls.pro/',
        'Connection': 'keep-alive'
      }
    });

    const $ = cheerio.load(data);
    const images = [];

    // Selector untuk gambar di ai-girls.pro
    $('img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
      
      if (src) {
        // Konversi relative URL ke absolute URL
        if (src.startsWith('/')) {
          src = 'https://ai-girls.pro' + src;
        } else if (!src.startsWith('http')) {
          src = 'https://ai-girls.pro/' + src;
        }
        
        // Filter hanya gambar yang relevan
        if ((src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp')) && 
            !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && 
            !src.includes('placeholder') && src.length > 50) {
          images.push(src);
        }
      }
    });

    // Selector alternatif untuk card/gallery/post images
    $('.gallery-item img, .image-card img, .post-image img, article img, .wp-post-image, figure img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
      
      if (src && !images.includes(src)) {
        if (src.startsWith('/')) {
          src = 'https://ai-girls.pro' + src;
        } else if (!src.startsWith('http')) {
          src = 'https://ai-girls.pro/' + src;
        }
        
        if (src.length > 50) {
          images.push(src);
        }
      }
    });

    // Jika tidak ada gambar ditemukan, coba page lain
    if (images.length === 0) {
      console.log(`No images found on page ${randomPage}, trying another page...`);
      return randomAiGirls(); // Recursive call untuk mencoba page lain
    }

    // Return random image dari array
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    return {
      url: randomImage,
      page: randomPage,
      totalImagesFound: images.length
    };

  } catch (error) {
    console.error('Error fetching AI Girls image:', error.message);
    
    // Jika error 404, coba page lain
    if (error.response && error.response.status === 404) {
      console.log('Page not found, trying another page...');
      return randomAiGirls(); // Recursive call
    }
    
    return null;
  }
}

// Fungsi untuk mendapatkan multiple random images dari berbagai halaman
async function randomAiGirlsMultiple(count = 5) {
  try {
    const images = [];
    const maxPages = 100; // Sesuaikan dengan jumlah halaman yang ada
    const pagesToFetch = Math.min(count, 5); // Fetch dari max 5 halaman berbeda
    
    for (let i = 0; i < pagesToFetch; i++) {
      const randomPage = Math.floor(Math.random() * maxPages) + 1;
      const url = `https://ai-girls.pro/page/${randomPage}/`;
      
      try {
        const { data } = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://ai-girls.pro/',
            'Connection': 'keep-alive'
          }
        });

        const $ = cheerio.load(data);

        $('img').each((i, elem) => {
          let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
          
          if (src && images.length < count) {
            if (src.startsWith('/')) {
              src = 'https://ai-girls.pro' + src;
            } else if (!src.startsWith('http')) {
              src = 'https://ai-girls.pro/' + src;
            }
            
            if ((src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp')) && 
                !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && 
                !src.includes('placeholder') && src.length > 50 && !images.includes(src)) {
              images.push(src);
            }
          }
        });

      } catch (err) {
        console.error(`Error fetching page ${randomPage}:`, err.message);
      }
    }

    return images.slice(0, count);

  } catch (error) {
    console.error('Error fetching AI Girls images:', error.message);
    return [];
  }
}

// Fungsi untuk mendapatkan semua gambar dari satu halaman tertentu
async function getAiGirlsByPage(pageNum) {
  try {
    const url = `https://ai-girls.pro/page/${pageNum}/`;
    
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://ai-girls.pro/',
        'Connection': 'keep-alive'
      }
    });

    const $ = cheerio.load(data);
    const images = [];

    $('img').each((i, elem) => {
      let src = $(elem).attr('src') || $(elem).attr('data-src') || $(elem).attr('data-lazy-src');
      
      if (src) {
        if (src.startsWith('/')) {
          src = 'https://ai-girls.pro' + src;
        } else if (!src.startsWith('http')) {
          src = 'https://ai-girls.pro/' + src;
        }
        
        if ((src.includes('.jpg') || src.includes('.jpeg') || src.includes('.png') || src.includes('.webp')) && 
            !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && 
            !src.includes('placeholder') && src.length > 50) {
          images.push(src);
        }
      }
    });

    return {
      page: pageNum,
      totalImages: images.length,
      images: images
    };

  } catch (error) {
    console.error(`Error fetching page ${pageNum}:`, error.message);
    throw error;
  }
}

module.exports = { 
  randomAiGirls, 
  randomAiGirlsMultiple, 
  getAiGirlsByPage,
    scrapeAiGirls
};
