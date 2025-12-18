const axios = require('axios');
const cheerio = require('cheerio');

const CONFIG = {
    BASE_URL: 'https://dramabox.web.id',
    HEADERS: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
};

const request = async (url) => {
    try {
        const response = await axios.get(url, { headers: CONFIG.HEADERS });
        return cheerio.load(response.data);
    } catch (error) {
        throw new Error(`Network Error: ${error.message}`);
    }
};

const resolveUrl = (link) => {
    if (link && !link.startsWith('http')) {
        return `${CONFIG.BASE_URL}/${link.replace(/^\//, '')}`;
    }
    return link;
};

const getBookIdFromUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return urlObj.searchParams.get('bookId');
    } catch (e) {
        return null;
    }
};

const dramabox = {
    home: async () => {
        try {
            const $ = await request(CONFIG.BASE_URL);
            const latest = [];
            $('.drama-grid .drama-card').each((_, el) => {
                const link = resolveUrl($(el).find('.watch-button').attr('href'));
                latest.push({
                    title: $(el).find('.drama-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    image: $(el).find('.drama-image img').attr('src'),
                    views: $(el).find('.drama-meta span').first().text().trim().split(' ')[1] || '0',
                    episodes: $(el).find('.drama-meta span[itemprop="numberOfEpisodes"]').text().trim().split(' ')[1] || '0'
                });
            });

            const trending = [];
            $('.sidebar-widget .rank-list .rank-item').each((_, el) => {
                const link = resolveUrl($(el).attr('href'));
                trending.push({
                    rank: $(el).find('.rank-number').text().trim(),
                    title: $(el).find('.rank-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    image: $(el).find('.rank-image img').attr('src'),
                    views: $(el).find('.rank-meta span').eq(0).text().trim().split(' ')[1] || '0',
                    episodes: $(el).find('.rank-meta span').eq(1).text().trim().split(' ')[1] || '0'
                });
            });

            return { latest, trending };
        } catch (e) {
            return { error: e.message };
        }
    },

    search: async (query) => {
        try {
            const targetUrl = `${CONFIG.BASE_URL}/search.php?lang=in&q=${encodeURIComponent(query)}`;
            const $ = await request(targetUrl);

            const results = [];
            $('.drama-grid .drama-card').each((_, el) => {
                const link = resolveUrl($(el).find('.watch-button').attr('href'));
                results.push({
                    title: $(el).find('.drama-title').text().trim(),
                    book_id: getBookIdFromUrl(link),
                    views: $(el).find('.drama-meta span').first().text().trim().split(' ')[1] || '0',
                    image: $(el).find('.drama-image img').attr('src')
                });
            });

            return results;
        } catch (e) {
            return { error: e.message };
        }
    },

    detail: async (bookId) => {
        if (!bookId) return { error: "Book ID is required" };
        try {
            const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in`;
            const $ = await request(targetUrl);

            const fullTitle = $('.video-title').text().trim();
            const cleanTitle = fullTitle.split('- Episode')[0].trim();
            
            const episodes = [];
            $('.episodes-grid .episode-btn').each((_, el) => {
                episodes.push({
                    episode: parseInt($(el).text().trim()),
                    id: $(el).attr('data-episode') // kadang id episode beda dengan nomor urut
                });
            });

            return {
                book_id: bookId,
                title: cleanTitle,
                description: $('.video-description').text().trim(),
                thumbnail: $('meta[itemprop="thumbnailUrl"]').attr('content'),
                upload_date: $('meta[itemprop="uploadDate"]').attr('content'),
                stats: {
                    followers: $('.video-meta span').first().text().trim().split(' ')[1] || '0',
                    total_episodes: $('span[itemprop="numberOfEpisodes"]').text().trim().split(' ')[1] || '0',
                },
                episode_list: episodes
            };
        } catch (e) {
            return { error: e.message };
        }
    },

    stream: async (bookId, episode) => {
        if (!bookId || !episode) return { error: "Book ID and Episode are required" };
        try {
            const targetUrl = `${CONFIG.BASE_URL}/watch.php?bookId=${bookId}&lang=in&episode=${episode}`;
            const $ = await request(targetUrl);

            let videoUrl = $('#mainVideo source').attr('src');
            if (!videoUrl) videoUrl = $('#mainVideo').attr('src');

            if (!videoUrl) return { error: "Video not found or encrypted" };

            return {
                book_id: bookId,
                episode: episode,
                video_url: videoUrl
            };
        } catch (e) {
            return { error: e.message };
        }
    }
};

module.exports = dramabox;
