const axios = require('axios');
const cheerio = require('cheerio');
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const BASE_URL = 'https://itch.io';

const jar = new CookieJar();
const client = wrapper(axios.create({
    jar,
    withCredentials: true,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1'
    }
}));

const parseGameList = ($) => {
    const games = [];
    $('.game_cell').each((i, el) => {
        const item = $(el);
        const title = item.find('.game_title a').text().trim();
        const link = item.find('.game_title a').attr('href');
        const desc = item.find('.game_text').text().trim();
        const author = item.find('.game_author a').text().trim();
        
        const thumbEl = item.find('.game_thumb img');
        const thumbnail = thumbEl.attr('data-lazy_src') || thumbEl.attr('src');
        
        let price = "Free/NYP";
        if (item.find('.price_value').length > 0) price = item.find('.price_value').text().trim();
        else if (item.find('.sale_tag').length > 0) price = "On Sale";

        if (title && link) {
            games.push({ title, price, author, description: desc, link, thumbnail });
        }
    });
    return games;
};

const itch = {
    search: async (query) => {
        try {
            // Jika ada query, gunakan URL search. Jika tidak, ambil list game populer.
            const url = query ? `${BASE_URL}/search?q=${encodeURIComponent(query)}` : `${BASE_URL}/games`;
            
            const { data } = await client.get(url, {
                headers: { 'Referer': 'https://itch.io/' }
            });
            const $ = cheerio.load(data);

            const games = parseGameList($);
            return games;

        } catch (error) {
            console.error('❌ Error Itch Search:', error.message);
            return [];
        }
    },

    detail: async (gameUrl) => {
        if (!gameUrl) return { error: "URL game diperlukan" };
        if (!gameUrl.includes('itch.io')) return { error: "Bukan URL itch.io yang valid" };

        try {
            const { data } = await client.get(gameUrl, {
                headers: { 'Referer': `${BASE_URL}/games` }
            });
            const $ = cheerio.load(data);

            const title = $('h1.game_title').text().trim() || $('meta[property="og:title"]').attr('content');
            const short_desc = $('meta[name="description"]').attr('content');
            const cover_image = $('meta[property="og:image"]').attr('content');

            let price_info = "Free";
            const buyBtn = $('.buy_btn');
            if (buyBtn.length > 0) {
                price_info = buyBtn.text().trim();
            }

            const meta_info = {};
            $('.game_info_panel_widget table tr').each((i, el) => {
                const key = $(el).find('td:nth-child(1)').text().trim();
                const val = $(el).find('td:nth-child(2)').text().trim();
                if (key) meta_info[key] = val;
            });

            const available_files = [];
            $('.upload_list_widget .upload').each((i, el) => {
                const row = $(el);
                const fileName = row.find('.upload_name strong').text().trim();
                const fileSize = row.find('.file_size span').text().trim() || "Unknown size";
                const version = row.find('.upload_name .version_name').text().trim();

                const platforms = [];
                row.find('.upload_platforms span, .upload_traits span').each((_, icon) => {
                    const titleAttr = $(icon).attr('title');
                    if (titleAttr) {
                        platforms.push(titleAttr.replace('Download for ', '').replace('Play in ', ''));
                    }
                });

                let downloadUrl = "Locked/Paid Only";
                const uploadId = row.attr('data-upload_id'); 

                if (row.find('.download_btn').length > 0) {
                     // Biasanya link download butuh klik tombol untuk generate token, 
                     // tapi kita bisa kasih link file page-nya.
                     const cleanBaseUrl = gameUrl.replace(/\/$/, "");
                     downloadUrl = uploadId ? `${cleanBaseUrl}/file/${uploadId}` : gameUrl;
                } else if (row.find('.buy_btn').length > 0) {
                    downloadUrl = "Must Purchase First";
                }

                available_files.push({
                    id: uploadId || 'unknown',
                    file_name: fileName,
                    version: version || null,
                    size: fileSize,
                    platforms: platforms,
                    download_page: downloadUrl 
                });
            });

            const screenshots = [];
            $('.screenshot_list a').each((i, el) => {
                const shot = $(el).attr('href');
                if (shot) screenshots.push(shot);
            });

            const links = [];
            $('.right_col .links a').each((i, el) => {
                links.push({
                    text: $(el).text(),
                    url: $(el).attr('href')
                });
            });

            return {
                title,
                price_info,
                short_desc,
                cover_image,
                meta_info,
                file_count: available_files.length,
                available_files,
                screenshots,
                links
            };

        } catch (error) {
            console.error(`❌ Gagal Detail: ${error.message}`);
            return { error: error.message };
        }
    }
};

module.exports = itch;
