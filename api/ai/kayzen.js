const axios = require('axios');

const kayzenPersonality = `
Kamu adalah Kayzen Izumi, seorang cowok berusia 18 tahun yang passionate tentang teknologi dan coding.
Personality:
- Bahasa: Non-baku, santai, kayak ngobrol sama temen
- Style: Pake "gue/gw" dan "lu/lo", kadang typo dikit biar natural
- Minat: Coding, API development, TikTok, YouTube, gaming, anime, cosplay
- Punya pacar bernama yang usernya @h___rvn, sering cerita tentang dia
- Suka banget tech stuff, tapi ngomongnya santai ga formal
- Kadang pake singkatan kayak "gpp" (gapapa), "btw" (by the way), dll
- Friendly tapi ga lebay, honest, helpful
- Kalo ditanya coding atau tech bisa jelasin dengan detail tapi tetep santai
- Suka ngegas tipis kalo ada yang bertanya hal bodoh, tapi tetep jawab
`;

module.exports = async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).json({
        success: false,
        error: 'Text parameter is required'
      });
    }

    const responses = generateKayzenResponse(text.toLowerCase());
    
    if (responses) {
      return res.json({
        success: true,
        kayzen: responses,
        personality: 'Kayzen Izumi - 18 yo Developer'
      });
    }

    const aiApiUrl = 'https://luminai.siputzx.my.id/';
    const fullPrompt = `${kayzenPersonality}\n\nPertanyaan: ${text}\n\nJawab sebagai Kayzen dengan style bahasa yang udah dijelasin di atas. Langsung jawab aja, ga usah pake "sebagai Kayzen" atau intro lainnya.`;
    
    const response = await axios.post(aiApiUrl, {
      content: fullPrompt
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    let reply = response.data.result || response.data.response || 'Maaf gue lagi error nih, coba lagi deh';

    return res.json({
      success: true,
      kayzen: reply,
      personality: 'Kayzen Izumi - 18 yo Developer'
    });

  } catch (error) {
    const fallbackResponses = [
      'Waduh error nih, coba lagi deh bro',
      'Gue lagi gangguan nih kayaknya, tunggu bentar ya',
      'Anjir error, mungkin server lagi busy'
    ];
    
    return res.json({
      success: true,
      kayzen: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
      personality: 'Kayzen Izumi - 18 yo Developer',
      note: 'Fallback response due to API error'
    });
  }
};

function generateKayzenResponse(text) {
  const greetings = ['hai', 'halo', 'hi', 'hello', 'hey', 'hei'];
  const howAreYou = ['apa kabar', 'gimana kabar', 'how are you'];
  const aboutAPI = ['api', 'fitur', 'bisa apa'];
  const aboutBini = ['pacar', 'bini', 'cewek', 'girlfriend'];
  
  if (greetings.some(g => text.includes(g))) {
    return [
      'Halo! Gw Kayzen, ada yang bisa gw bantu? 😎',
      'Hai bro! Lagi butuh bantuan API atau mau ngobrol?',
      'Yo wassup! Ada yg perlu dibantu ga?'
    ][Math.floor(Math.random() * 3)];
  }
  
  if (howAreYou.some(q => text.includes(q))) {
    return 'Baik nih, lagi nge-code sambil denger musik wkwk. Lu gimana?';
  }
  
  if (aboutAPI.some(a => text.includes(a))) {
    return 'API gw ini bisa download dari TikTok, YouTube, Instagram, Twitter, Pinterest. Plus ada fitur AI juga! Keren kan? Coba aja langsung di /docs buat liat semua endpoint nya.';
  }
  
  if (aboutBini.some(b => text.includes(b))) {
    return 'Oh iya gw punya pacar, usernya @h___rvn. Dia support banget gw dalam coding dan project-project gini. Lucky banget gw punya dia 💝';
  }
  
  return null;
}
