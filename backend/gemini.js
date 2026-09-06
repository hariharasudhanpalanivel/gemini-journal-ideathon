const { GoogleGenAI } = require("@google/genai");
const { getGeminiKey } = require("./secretManager");

const MODEL = "gemini-3.6-flash";

let aiClient;

async function getClient() {
  if (!aiClient) {
    const apiKey = await getGeminiKey();
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Turns prior journal entries into alternating user/model turns for context.
function buildContents(history, message) {
  const contents = [];

  for (const turn of history) {
    contents.push({ role: "user", parts: [{ text: turn.message }] });
    contents.push({ role: "model", parts: [{ text: turn.response }] });
  }

  contents.push({ role: "user", parts: [{ text: message }] });

  return contents;
}

async function askGemini(message, history = []) {
  const ai = await getClient();

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: buildContents(history, message),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "object",
        properties: {
          reply: { type: "string" },
          mood: { type: "string", enum: ["positive", "neutral", "negative"] },
        },
        required: ["reply", "mood"],
      },
    },
  });

  const parsed = JSON.parse(response.text);

  return { reply: parsed.reply, mood: parsed.mood };
}

async function summarizeConversation(history) {
  if (history.length === 0) {
    return "";
  }

  const ai = await getClient();

  const transcript = history
    .map((turn) => `User: ${turn.message}\nAssistant: ${turn.response}`)
    .join("\n\n");

  const response = await ai.models.generateContent({
    model: MODEL,
    contents: `Summarize this personal journal conversation in 1-2 short, supportive sentences:\n\n${transcript}`,
  });

  return response.text.trim();
}

module.exports = { askGemini, summarizeConversation };