const axios = require('axios');
const crypto = require('crypto');

// Daftar style yang diizinkan sesuai kode asli
const styles = ["Headsot", "Anime", "Tatto", "ID Photo", "Cartoon", "Fantasy 3D"];

async function deepimg(prompt, style) {
    // Validasi input
    if (!style || !styles.includes(style)) {
        return { error: `Style tidak valid. Pilihan tersedia: ${styles.join(", ")}` };
    }
    if (!prompt) {
        return { error: "Prompt tidak boleh kosong." };
    }

    let device_id = crypto.randomBytes(16).toString('hex');
    
    // Data payload
    let data = JSON.stringify({
        "device_id": device_id,
        "prompt": `${prompt} -style ${style}`,
        "size": "1024x1024"
    });

    let config = {
        method: 'POST',
        url: 'https://api-preview.chatgot.io/api/v1/deepimg/flux-1-dev',
        headers: {
            'User-Agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
            'Content-Type': 'application/json',
            'accept-language': 'id-ID',
            'referer': 'https://deepimg.ai/',
            'origin': 'https://deepimg.ai',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site',
            'priority': 'u=0',
            'te': 'trailers'
        },
        data: data
    };

    try {
        const response = await axios.request(config);
        // Mengembalikan data asli dari API (biasanya berisi url gambar)
        return response.data;
    } catch (error) {
        return { error: `Terjadi kesalahan: ${error.message}` };
    }
}

module.exports = { deepimg, styles };
