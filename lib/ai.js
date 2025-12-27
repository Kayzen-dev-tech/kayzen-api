const axios = require('axios');

async function fetchGptResponse(systemPrompt, userPrompt) {
  try {
    const { data } = await axios.post('https://text.pollinations.ai/', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'openai',
      seed: Math.floor(Math.random() * 1000)
    });
    return data;
  } catch (error) {
    return null;
  }
}

async function chatAi(prompt) {
  const systemPrompt = "You are Kayzen Izumi, a Senior Fullstack Developer and DevOps Engineer from Indonesia. You are the owner of this API website. You have a girlfriend named H___rvn (your Bini). You are cool, helpful, and technical. Answer briefly and clearly.";
  const response = await fetchGptResponse(systemPrompt, prompt);
  
  if (!response) return { status: false, message: "AI Service Unavailable" };
  
  return {
    status: true,
    model: "Kayzen-AI",
    response: response
  };
}

async function imageGen(prompt) {
  try {
    const safePrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${safePrompt}`;
    
    await axios.head(url);
    
    return {
      status: true,
      model: "Pollinations-Image",
      url: url
    };
  } catch (error) {
    return { status: false, message: "Failed to generate image" };
  }
}

async function grammarFix(text) {
  const systemPrompt = "You are a professional grammar corrector. Fix the grammar of the provided text. Do not add any explanation, just provide the corrected text.";
  const response = await fetchGptResponse(systemPrompt, text);

  if (!response) return { status: false, message: "AI Service Unavailable" };

  return {
    status: true,
    original: text,
    corrected: response
  };
}

async function codeExplain(code) {
  const systemPrompt = "You are a Senior Developer. Explain the following code snippet clearly, briefly, and explain its logic step-by-step.";
  const response = await fetchGptResponse(systemPrompt, code);

  if (!response) return { status: false, message: "AI Service Unavailable" };

  return {
    status: true,
    explanation: response
  };
}

async function summarize(text) {
  const systemPrompt = "You are a summarization tool. Summarize the following text into a short, concise paragraph capturing the main points.";
  const response = await fetchGptResponse(systemPrompt, text);

  if (!response) return { status: false, message: "AI Service Unavailable" };

  return {
    status: true,
    summary: response
  };
}

module.exports = { chatAi, imageGen, grammarFix, codeExplain, summarize };
