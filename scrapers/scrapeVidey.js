const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');

async function scrapeVidey(file) {
  try {
    const visitorId = crypto.randomUUID();
    
    const form = new FormData();
    form.append("file", file.data, file.name);

    const { data } = await axios.post(`https://videy.co/api/upload?visitorId=${visitorId}`, form, {
      headers: {
        ...form.getHeaders()
      }
    });
    
    return data;
  } catch (e) {
    console.error("Error Videy:", e.message);
    return null;
  }
}

module.exports = scrapeVidey;
