const axios = require('axios');

const tempmail = {
  create: async () => {
    try {
      const config = {
        method: 'POST',
        url: 'https://tempail.top/api/email/create/ApiTempail',
        headers: {
          'User-Agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': '0'
        }
      };

      const response = await axios.request(config);
      // Response biasanya berisi { email: "...", token: "...", ... }
      return response.data;
    } catch (error) {
      console.error('Error Tempmail Create:', error.message);
      return { error: 'Gagal membuat email sementara' };
    }
  },

  cekInbox: async (token) => {
    if (!token) {
      return { error: 'Token wajib diisi (didapat dari create)' };
    }

    try {
      const config = {
        method: 'GET',
        url: `https://tempail.top/api/messages/${token}/ApiTempail`,
        headers: {
          'User-Agent': 'ScRaPe/9.9 (KaliLinux; Nusantara Os; My/Shannz)',
          'Connection': 'Keep-Alive',
          'Accept-Encoding': 'gzip'
        }
      };

      const response = await axios.request(config);
      // Response berisi array pesan
      return response.data;
    } catch (error) {
      console.error('Error Tempmail Inbox:', error.message);
      return { error: 'Gagal mengecek inbox, pastikan token benar' };
    }
  }
};

module.exports = tempmail;
