const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');

function generateClientId(length = 40) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

async function magicstudio(prompt) {
  const anonymousUserId = uuidv4();
  const requestTimestamp = (Date.now() / 1000).toFixed(3);
  const clientId = generateClientId();

  // 1. Request Gambar ke MagicStudio
  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('output_format', 'bytes');
  formData.append('user_profile_id', 'null');
  formData.append('anonymous_user_id', anonymousUserId);
  formData.append('request_timestamp', requestTimestamp);
  formData.append('user_is_subscribed', 'false');
  formData.append('client_id', clientId);

  const config = {
    method: 'POST',
    url: 'https://ai-api.magicstudio.com/api/ai-art-generator',
    headers: {
      ...formData.getHeaders(),
      'User-Agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
      'Accept': 'application/json, text/plain, */*',
      'origin': 'https://magicstudio.com',
      'referer': 'https://magicstudio.com/ai-art-generator/',
    },
    responseType: 'arraybuffer', // Kita butuh data mentah (Buffer)
    data: formData
  };

  try {
    const response = await axios.request(config);
    
    // 2. Upload Buffer langsung ke Catbox (Tanpa simpan ke file)
    const uploadForm = new FormData();
    uploadForm.append('reqtype', 'fileupload');
    // Penting: Saat upload buffer, harus kasih opsi filename
    uploadForm.append('fileToUpload', response.data, { 
        filename: 'magicstudio_image.jpg',
        contentType: 'image/jpeg' 
    });

    const upload = await axios.post('https://catbox.moe/user/api.php', uploadForm, {
      headers: uploadForm.getHeaders()
    });
    
    return { 
        url: upload.data.trim() // Catbox mengembalikan URL raw text
    };

  } catch (error) {
    console.error('Error MagicStudio:', error.message);
    return { error: 'Gagal membuat atau mengupload gambar.' };
  }
}

module.exports = magicstudio;
