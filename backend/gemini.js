const { GoogleGenAI } = require("@google/genai");
const { getGeminiKey } = require("./secretManager");

async function askGemini(message) {
  const apiKey = await getGeminiKey();

  const ai = new GoogleGenAI({
    apiKey,
  });

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: message,
  });

  return response.text;
}

module.exports = { askGemini };