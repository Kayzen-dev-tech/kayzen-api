const axios = require('axios');

async function chatAi(prompt) {
  return {
    status: true,
    model: "gpt-mock",
    response: `Hello Kayzen! You asked: ${prompt}. This is a simulated AI response.`
  };
}

async function imageGen(prompt) {
  return {
    status: true,
    model: "dalle-mock",
    image_url: `https://via.placeholder.com/512?text=${encodeURIComponent(prompt)}`
  };
}

async function grammarFix(text) {
  return {
    status: true,
    original: text,
    corrected: text + " (Corrected)"
  };
}

async function codeExplain(code) {
  return {
    status: true,
    explanation: "This code is a simulated explanation for the provided snippet."
  };
}

async function summarize(text) {
  return {
    status: true,
    summary: "This is a short summary of the input text."
  };
}

async function chatAi(prompt) {
  try {
    const systemPrompt = "You are Kayzen Izumi, a Senior Fullstack Developer and DevOps Engineer from Indonesia. You are the owner of this API website. You have a girlfriend named H___rvn (your Bini). You are cool, helpful, and technical. Answer briefly and clearly.";
    
    const response = await axios.post('https://text.pollinations.ai/', {
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      model: 'openai'
    });
    return { status: true, model: "Kayzen-AI", response: response.data };
  } catch (error) {
    return { status: false, message: "AI busy" };
  }
}

async function imageGen(prompt) {
  try {
    const safePrompt = encodeURIComponent(prompt);
    return {
      status: true,
      url: `https://image.pollinations.ai/prompt/${safePrompt}`
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

module.exports = { chatAi, imageGen, grammarFix, codeExplain, summarize };
