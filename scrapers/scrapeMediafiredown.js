const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122 Safari/537.36";

const getDirectDownload = async (filePageUrl) => {
  try {
    const res = await axios.get(filePageUrl, { headers: { "User-Agent": UA } });
    const $ = cheerio.load(res.data);
    return $("#downloadButton").attr("href") || null;
  } catch {
    return null;
  }
};

const scrapeSingleFile = (fileUrl) => {
  const quick = fileUrl.match(/file\/([^/]+)/)?.[1];
  if (!quick) return [];
  return [
    {
      filename: null, // Nama file akan diambil nanti jika memungkinkan atau null
      size: null,
      quickkey: quick,
      filePageUrl: `https://www.mediafire.com/file/${quick}/file`,
    },
  ];
};

const getFolderFiles = async (folderKey) => {
  let allFiles = [];
  let chunk = 1;

  while (true) {
    const r = crypto.randomBytes(4).toString("hex");
    const url = `https://www.mediafire.com/api/1.4/folder/get_content.php?r=${r}&content_type=files&filter=all&order_by=name&order_direction=asc&chunk=${chunk}&version=1.5&folder_key=${folderKey}&response_format=json`;
    
    try {
        const res = await axios.get(url, { headers: { "User-Agent": UA } });
        const content = res.data?.response?.folder_content;
        const files = content?.files || [];

        for (let f of files) {
          allFiles.push({
            filename: f.filename,
            size: f.size,
            quickkey: f.quickkey,
            filePageUrl: `https://www.mediafire.com/file/${f.quickkey}/file`,
          });
        }

        if (content?.more_chunks === "no") break;
        chunk++;
    } catch (e) {
        break; // Stop jika error
    }
  }

  return allFiles;
};

const getAllItems = async (url) => {
  if (url.includes("/folder/")) {
    const key = url.match(/folder\/([^/]+)/)?.[1];
    if (!key) return [];
    return await getFolderFiles(key);
  }
  if (url.includes("/file/")) {
    return scrapeSingleFile(url);
  }
  return [];
};

async function mediafireDl(url) {
  if (!url) return { error: "URL tidak ditemukan" };
  
  try {
    const list = await getAllItems(url);
    if (list.length === 0) return { error: "Tidak ada file ditemukan atau link salah" };

    // Loop untuk mendapatkan direct link setiap file
    for (let item of list) {
      item.directDownload = await getDirectDownload(item.filePageUrl);
    }
    
    return list;
  } catch (e) {
    console.error("Error Mediafire:", e);
    return { error: "Terjadi kesalahan saat scraping" };
  }
}

module.exports = mediafireDl;
