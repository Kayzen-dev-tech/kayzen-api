const axios = require('axios');
const crypto = require('crypto');

function generateCookie() {
  const distinctId = crypto.randomUUID().replace(/-/g, '');
  const timestamp = Date.now();
  const sensors = {
    distinct_id: distinctId,
    first_id: "",
    props: {
      $latest_traffic_source_type: "自然搜索流量",
      $latest_search_keyword: "未取到值",
      $latest_referrer: "https://yandex.com/"
    },
    $device_id: distinctId
  };
  const sensorsEncoded = encodeURIComponent(JSON.stringify(sensors));
  const gaMain = `GA1.1.${Math.floor(1e9 + Math.random() * 1e9)}.${timestamp}`;
  const gaSub = `GS2.1.s${timestamp}$o2$g0$t${timestamp + 1000}$j58$l0$h0`;
  const gclAu = `1.1.${Math.floor(1e9 + Math.random() * 1e9)}.${timestamp}`;
  const cfBm = crypto.randomBytes(32).toString('base64url').slice(0, 64);
  
  return [
    'locale=en_US',
    'clientLocale=en_US',
    `sensorsdata2015jssdkcross=${sensorsEncoded}`,
    `_gcl_au=${gclAu}`,
    `_ga=${gaMain}`,
    `__cf_bm=${cfBm}-${timestamp}-1.0.1.1-${crypto.randomBytes(16).toString('base64url')}`,
    `_ga_7HXB45DMZS=${gaSub}`
  ].join('; ');
}

const baseHeaders = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'id-ID',
  'origin': 'https://www.pxbee.com',
  'referer': 'https://www.pxbee.com/',
  'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Mobile Safari/537.36',
  'x-app-id': 'app-pxbee-web'
};

async function removerWm(imageUrl) {
  if (!imageUrl) return { error: "URL gambar diperlukan" };

  const cookie = generateCookie();
  const headers = { ...baseHeaders, cookie };

  try {
    // 1. Submit Task
    const submitRes = await axios.post('https://api.pxbee.com/task/submit', 
      { type: 'textremover', method: 'free', data: { userImageUrl: imageUrl } },
      { headers: { ...headers, 'content-type': 'application/json;charset=UTF-8' } }
    );
    const submitJson = submitRes.data;

    if (submitJson.code !== '000') {
      return { success: false, message: submitJson.msg || 'Gagal submit task ke server' };
    }

    const taskId = submitJson.data[0].taskId;
    const start = Date.now();

    // 2. Polling Status (Cek terus sampai selesai)
    while (true) {
      const pollRes = await axios.get(`https://api.pxbee.com/task/get?ids=${taskId}&taskId=${taskId}`, { headers });
      const pollJson = pollRes.data;

      if (pollJson.code !== '000') {
        return { success: false, message: pollJson.msg || 'Gagal polling status' };
      }

      const task = pollJson.data[0];
      
      // Status 1 = Berhasil
      if (task.status === 1) {
        return {
          success: true,
          resultUrl: task.result.url,
          taskId: taskId
        };
      }
      
      // Status 2 = Gagal
      if (task.status === 2) {
        return { success: false, message: 'Server gagal memproses gambar' };
      }

      // Timeout 5 menit
      if (Date.now() - start > 300000) {
        return { success: false, message: 'Timeout menunggu hasil' };
      }

      // Tunggu 2 detik sebelum cek lagi
      await new Promise(r => setTimeout(r, 2000));
    }
  } catch (error) {
    console.error("Error Remover WM:", error.message);
    return { success: false, message: error.message };
  }
}

module.exports = removerWm;
