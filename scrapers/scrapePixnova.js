const axios = require('axios');
const FormData = require('form-data');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const CONFIG = {
    URLS: {
        API: 'https://api.pixnova.ai/api',
        TOOLS: 'https://api.pixnova.ai/aitools'
    },
    HEADERS: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'origin': 'https://pixnova.ai',
        'theme-version': '83EmcUoQTUv50LhNx0VrdcK8rcGexcP35FcZDcpgWsAXEyO4xqL5shCY6sFIWB2Q'
    },
    PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCwlO+boC6cwRo3UfXVBadaYwcX
0zKS2fuVNY2qZ0dgwb1NJ+/Q9FeAosL4ONiosD71on3PVYqRUlL5045mvH2K9i8b
AFVMEip7E6RMK6tKAAif7xzZrXnP1GZ5Rijtqdgwh+YmzTo39cuBCsZqK9oEoeQ3
r/myG9S+9cR5huTuFQIDAQAB
-----END PUBLIC KEY-----`
};

const getOriginFrom = () => crypto.createHash('md5').update('pixnova.ai').digest('hex').substring(8, 24);
const generateRandomString = (len) => Array.from({length: len}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const rsaEncrypt = (data) => crypto.publicEncrypt({ key: CONFIG.PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING }, Buffer.from(data)).toString('base64');

const aesCbcEncrypt = (text, keyStr) => {
    const key = Buffer.from(keyStr, 'utf-8');
    const cipher = crypto.createCipheriv('aes-128-cbc', key, key);
    let encrypted = cipher.update(`pixnova:${text}`, 'utf8', 'base64');
    return encrypted + cipher.final('base64');
};

const aesGcmEncrypt = (jsonData, fp1Key) => {
    const keyHash = crypto.createHash('sha256').update(fp1Key).digest();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', keyHash, iv);
    let encrypted = cipher.update(JSON.stringify(jsonData), 'utf8');
    const final = cipher.final();
    return Buffer.concat([iv, encrypted, final, cipher.getAuthTag()]).toString('base64');
};

const Pixnova = {
    request: async (endpoint, data = {}, apiType = 'API', isUpload = false) => {
        const baseUrl = apiType === 'TOOLS' ? CONFIG.URLS.TOOLS : CONFIG.URLS.API;
        const aesSecret = generateRandomString(16);
        const fp = uuidv4().replace(/-/g, '');
        const fp1 = aesCbcEncrypt(fp, aesSecret);
        
        const headers = {
            ...CONFIG.HEADERS,
            'x-code': Date.now().toString(),
            'fp': fp, 'fp1': fp1, 'x-guide': rsaEncrypt(aesSecret),
            'referer': apiType === 'TOOLS' ? 'https://pixnova.ai/id/ai-baby-generator/' : 'https://pixnova.ai/'
        };

        let payload = data;
        let method = 'POST';

        if (isUpload) {
            Object.assign(headers, data.getHeaders());
        } else {
            headers['Content-Type'] = 'application/json';
            if (!payload.origin_from) {
                payload.origin_from = getOriginFrom(); 
            }
            if (endpoint.includes('generate_video_face')) {
                payload = { request_type: 2, data: aesGcmEncrypt(payload, fp1) };
            }
        }

        try {
            const response = await axios({ method, url: `${baseUrl}${endpoint}`, headers, data: payload });
            if (response.data?.code === 200) return response.data;
            throw new Error(`API Error [${endpoint}]: ${response.data?.message || JSON.stringify(response.data)}`);
        } catch (error) {
            throw new Error(`Pixnova Req Error: ${error.message}`);
        }
    },

    // Modified to accept Buffer
    uploadImage: async (fileBuffer, fileName, type = 'API') => {
        const formData = new FormData();
        formData.append('file', fileBuffer, { filename: fileName || 'image.jpg' });
        
        let endpoint = '/upload_img';
        
        if (type === 'TOOLS') {
            endpoint = '/upload-img';
            formData.append('fn_name', 'demo-ai-baby');
            formData.append('origin_from', getOriginFrom());
        } else {
            formData.append('request_from', '2');
            formData.append('origin_from', getOriginFrom());
        }

        const res = await Pixnova.request(endpoint, formData, type, true);
        return type === 'TOOLS' ? res.data.path : res.data; 
    },

    // Modified to accept Buffer
    uploadVideo: async (fileBuffer, fileName) => {
        const ext = fileName.split('.').pop() || 'mp4';
        const hashedName = `${crypto.createHash('md5').update(fileBuffer).digest('hex')}_0_10.${ext}`;
        
        const presign = await Pixnova.request('/upload_file', {
            file_name: hashedName, type: 'video', request_from: 2, origin_from: getOriginFrom()
        }, 'API');

        await axios.put(presign.data.url, fileBuffer, {
            headers: { 'Content-Type': `video/${ext}`, 'x-oss-storage-class': 'Standard' },
            maxBodyLength: Infinity, maxContentLength: Infinity
        });

        return presign.data.url.split('?')[0].replace(/^https?:\/\/[^\/]+\//, '');
    },

    poll: async (taskId, endpoint, apiType = 'API', extraPayload = {}) => {
        let attempt = 0;
        // console.log(`Polling Task ID: ${taskId}`);
        while (attempt < 120) { // Max 6 minutes
            const payload = { task_id: taskId, request_from: 2, ...extraPayload };
            const res = await Pixnova.request(endpoint, payload, apiType);
            const s = res.data;

            if (s.status === 2) {
                const imgPath = s.result_image || s.result_video;
                if (!imgPath) return null;
                
                if (imgPath.startsWith('http')) return imgPath;
                if (apiType === 'TOOLS') return `https://oss-global.pixnova.ai/${imgPath}`;
                return `https://media.visro.ai/${imgPath}`;
            }
            if (s.status === 3 || s.status === -1) throw new Error('Task Failed or Cancelled by Server.');
            
            attempt++;
            await sleep(3000);
        }
        throw new Error('Timeout waiting for result.');
    },

    // Main Functions exposed
    swapImage: async (targetBuffer, targetName, faceBuffer, faceName) => {
        try {
            const targetUrl = await Pixnova.uploadImage(targetBuffer, targetName, 'API');
            const faceUrl = await Pixnova.uploadImage(faceBuffer, faceName, 'API');
            
            const res = await Pixnova.request('/generate_face', {
                source_image: targetUrl, face_image: faceUrl, request_from: 2
            }, 'API');
            
            return await Pixnova.poll(res.data.task_id, '/check_status', 'API', { is_batch: true });
        } catch (e) {
            return { error: e.message };
        }
    },

    swapVideo: async (videoBuffer, videoName, faceBuffer, faceName) => {
        try {
            const videoUrl = await Pixnova.uploadVideo(videoBuffer, videoName);
            const faceUrl = await Pixnova.uploadImage(faceBuffer, faceName, 'API');
            
            const res = await Pixnova.request('/pn/v1/generate_video_face', {
                source_video: videoUrl, face_image: faceUrl, start: 0, end: 10, type: 1, request_from: 2, enhance: 0
            }, 'API');
            
            return await Pixnova.poll(res.data.task_id, '/pn/v1/check_status', 'API', { is_batch: true });
        } catch (e) {
            return { error: e.message };
        }
    },

    generateBaby: async (fatherBuffer, fatherName, motherBuffer, motherName, gender = 'boy') => {
        try {
            const fatherUrl = await Pixnova.uploadImage(fatherBuffer, fatherName, 'TOOLS');
            const motherUrl = await Pixnova.uploadImage(motherBuffer, motherName, 'TOOLS');
            
            const payload = {
                fn_name: "demo-ai-baby", call_type: 3,
                input: { gender, father_image: fatherUrl, mother_image: motherUrl, request_from: 2 },
                request_from: 2, origin_from: "111977c0d5def647"
            };

            const res = await Pixnova.request('/of/create', payload, 'TOOLS');
            return await Pixnova.poll(res.data.task_id, '/of/check-status', 'TOOLS', { 
                fn_name: "demo-ai-baby", call_type: 3 
            });
        } catch (e) {
            return { error: e.message };
        }
    }
};

module.exports = Pixnova;
