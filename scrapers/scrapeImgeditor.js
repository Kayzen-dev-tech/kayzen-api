const axios = require('axios');

const BASE_URL = 'https://imgeditor.co';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'sec-ch-ua-platform': '"Android"',
  'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  'dnt': '1',
  'sec-ch-ua-mobile': '?1',
  'origin': BASE_URL,
  'sec-fetch-site': 'same-origin',
  'sec-fetch-mode': 'cors',
  'sec-fetch-dest': 'empty',
  'referer': `${BASE_URL}/generator`,
  'accept-language': 'id,en-US;q=0.9,en;q=0.8,ja;q=0.7',
  'priority': 'u=1, i'
};

const imgeditor = {
  getPresign: async (fileName, contentType = 'image/jpeg', fileSize) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/get-upload-url`,
        { fileName, contentType, fileSize },
        { headers: { ...HEADERS, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get presigned URL: ${error.message}`);
    }
  },

  upload: async (uploadUrl, fileData, contentType = 'image/jpeg') => {
    try {
      const response = await axios.put(uploadUrl, fileData, {
        headers: {
            'User-Agent': HEADERS['User-Agent'],
            'Content-Type': contentType,
            // Header lain disederhanakan agar axios yang menangani content-length
        }
      });
      return { success: response.status === 200 };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  },

  submit: async (options) => {
    const {
      prompt, imageUrl, styleId = 'realistic', mode = 'image',
      imageSize = 'auto', quality = 'standard', numImages = 1,
      outputFormat = 'png', model = 'nano-banana'
    } = options;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/generate-image`,
        {
          prompt, styleId, mode, imageUrl, imageUrls: [imageUrl],
          imageSize, quality, numImages, outputFormat, model
        },
        { headers: { ...HEADERS, 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to submit generation: ${error.message}`);
    }
  },

  status: async (taskId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/generate-image/status`,
        { params: { taskId }, headers: HEADERS }
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to check status: ${error.message}`);
    }
  },

  // Modified create function to accept Buffer and FileName directly
  create: async (fileBuffer, fileName, prompt, options = {}) => {
    try {
      const contentType = fileName.endsWith('.png') ? 'image/png' : 'image/jpeg';
      const fileSize = fileBuffer.length;
      
      // 1. Get Presigned URL
      const presignData = await imgeditor.getPresign(fileName, contentType, fileSize);
      
      // 2. Upload File to their server
      await imgeditor.upload(presignData.uploadUrl, fileBuffer, contentType);
      
      // 3. Submit Task
      const submitData = await imgeditor.submit({
        prompt,
        imageUrl: presignData.publicUrl,
        ...options
      });

      // 4. Polling Status
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes timeout
      
      while (attempts < maxAttempts) {
        const statusData = await imgeditor.status(submitData.taskId);
        
        if (statusData.status === 'completed') {
          return {
            imageUrl: statusData.imageUrl,
            taskId: submitData.taskId,
            completedAt: statusData.completedAt
          };
        } else if (statusData.status === 'failed') {
          throw new Error(`Generation failed: ${statusData.error || 'Unknown error'}`);
        }

        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
        attempts++;
      }

      throw new Error('Generation timeout after 5 minutes');
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }
};

module.exports = imgeditor;
