const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const CONFIG = {
  BASE_URL: 'https://www.dramadash.app/api',
  HEADERS: {
    'app-version': '70',
    'lang': 'id',
    'platform': 'android',
    'tz': 'Asia/Jakarta',
    'device-type': 'phone',
    'content-type': 'application/json; charset=UTF-8',
    'user-agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
  }
};

let SESSION = {
  deviceId: null,
  token: null
};

const generateDeviceId = () => {
  return uuidv4().replace(/-/g, "").substring(0, 16);
};

const ensureAuth = async () => {
  if (SESSION.token) return SESSION.token;

  try {
    if (!SESSION.deviceId) SESSION.deviceId = generateDeviceId();
    
    const response = await axios.post(`${CONFIG.BASE_URL}/landing`, 
      { android_id: SESSION.deviceId },
      { headers: CONFIG.HEADERS }
    );

    if (response.data && response.data.token) {
      SESSION.token = response.data.token;
      return SESSION.token;
    } else {
      throw new Error('Gagal mendapatkan token akses');
    }
  } catch (error) {
    throw new Error(`Auth Error: ${error.message}`);
  }
};

const request = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = await ensureAuth();

    const headers = { 
      ...CONFIG.HEADERS,
      'authorization': `Bearer ${token}`
    };

    const config = {
      url: `${CONFIG.BASE_URL}/${endpoint}`,
      method,
      headers,
      data: data ? data : undefined
    };

    const response = await axios(config);
    return response.data;

  } catch (error) {
    if (error.response) {
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
    }
    throw error;
  }
};

const dramadash = {
  home: async () => {
    try {
        const res = await request('home');
        const { dramaList, bannerDramaList, trendingSearches, tabs } = res;

        const mapDrama = (item) => ({
          id: item.id,
          name: item.name,
          poster: item.poster,
          desc: item.desc || "",
          viewCount: item.viewCount || 0,
          tags: item.tags ? item.tags.map(t => t.displayName) : [],
          genres: item.genres ? item.genres.map(g => g.displayName) : []
        });

        // Meratakan dramaList jika berupa nested array
        let flatDramaList = [];
        if (dramaList) {
            flatDramaList = dramaList
            .filter(item => Array.isArray(item.list))
            .flatMap(item => item.list);
        }

        return {
          banner: bannerDramaList ? bannerDramaList.list.map(mapDrama) : [],
          trending: trendingSearches ? trendingSearches.map(item => ({
            id: item.id,
            name: item.name,
            poster: item.poster,
            genres: item.genres ? item.genres.map(g => g.displayName) : []
          })) : [],
          drama: flatDramaList.map(mapDrama)
        };
    } catch (e) {
        return { error: e.message };
    }
  },

  detail: async (dramaId) => {
    if (!dramaId) return { error: "Drama ID wajib diisi" };
    try {
        const response = await request(`drama/${dramaId}`);
        const { drama } = response;

        return {
          id: drama.id,
          name: drama.name,
          poster: drama.poster,
          description: drama.description,
          // Mengembalikan full object episode agar bisa difilter nanti
          episodes: drama.episodes || [] 
        };
    } catch (e) {
        return { error: e.message };
    }
  },

  search: async (query) => {
    if (!query) return { error: "Query pencarian tidak boleh kosong" };
    try {
        const { result } = await request('search/text', 'POST', { search: query });
        return result.map(item => ({
            id: item.id,
            name: item.name,
            poster: item.poster,
            genres: item.genres ? item.genres.map(g => g.displayName) : []
        }));
    } catch (e) {
        return { error: e.message };
    }
  },

  episode: async (dramaId, epsNumber) => {
    if (!dramaId || !epsNumber) return { error: "Drama ID dan Episode Number wajib diisi" };
    try {
        // Kita gunakan fungsi detail yang sudah ada
        const detailData = await dramadash.detail(dramaId);
        
        if (detailData.error) throw new Error(detailData.error);
        if (!detailData.episodes) throw new Error("Data episode tidak ditemukan");

        const episode = detailData.episodes.find(e => e.episodeNumber === parseInt(epsNumber));
        
        if (!episode) throw new Error(`Episode ${epsNumber} tidak ditemukan`);

        return episode;
    } catch (e) {
        return { error: e.message };
    }
  }
};

module.exports = dramadash;
