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

module.exports = { chatAi, imageGen, grammarFix, codeExplain, summarize };
