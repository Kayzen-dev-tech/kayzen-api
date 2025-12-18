const axios = require('axios');
const cheerio = require('cheerio');

async function jadwalSholat(kota) {
  if (!kota) return { error: "Nama kota wajib diisi" };

  try {
    const { data: mainPage } = await axios.get('https://www.jadwalsholat.org/jadwal-sholat/monthly.php');
    const $ = cheerio.load(mainPage);
    
    let cityId = null;
    let realCityName = "";

    $('select[name="city"] option').each((i, el) => {
      if ($(el).text().toLowerCase().includes(kota.toLowerCase())) {
        cityId = $(el).val();
        realCityName = $(el).text();
      }
    });

    if (!cityId) return { error: "Kota tidak ditemukan. Coba gunakan nama kota yang lebih spesifik (contoh: Jakarta)." };

    const { data: schedulePage } = await axios.get(`https://www.jadwalsholat.org/jadwal-sholat/monthly.php?id=${cityId}`);
    const $$ = cheerio.load(schedulePage);

    const title = $$('h1.h1_edit').text().trim();
    const period = $$('h2.h2_edit').text().trim();
    const schedule = [];

    $$('.table_adzan tr').each((i, el) => {
      const className = $$(el).attr('class');
      if (className === 'table_light' || className === 'table_dark') {
        const tds = $$(el).find('td');
        if (tds.length > 0) {
            schedule.push({
                tanggal: $$(tds[0]).text().trim(),
                imsyak: $$(tds[1]).text().trim(),
                shubuh: $$(tds[2]).text().trim(),
                terbit: $$(tds[3]).text().trim(),
                dhuha: $$(tds[4]).text().trim(),
                dzuhur: $$(tds[5]).text().trim(),
                ashr: $$(tds[6]).text().trim(),
                maghrib: $$(tds[7]).text().trim(),
                isya: $$(tds[8]).text().trim()
            });
        }
      }
    });

    return {
        query: kota,
        city: realCityName,
        period: period,
        schedule: schedule
    };

  } catch (e) {
    return { error: e.message };
  }
}

module.exports = jadwalSholat;
