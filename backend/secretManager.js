const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const PLACEHOLDER = "PASTE_YOUR_KEY_HERE";

let client;

async function getGeminiKey() {
  const envKey = process.env.GEMINI_API_KEY;

  if (envKey && envKey !== PLACEHOLDER) {
    return envKey;
  }

  client = client || new SecretManagerServiceClient();

  try {
    const [version] = await client.accessSecretVersion({
      name: `projects/personal-gemini-journal-507718/secrets/GEMINI_API_KEY/versions/latest`,
    });

    return version.payload.data.toString();
  } catch (error) {
    throw new Error(
      `No Gemini API key available. Set GEMINI_API_KEY in backend/.env and start with "npm start" (plain "node server.js" does not load .env). Secret Manager fallback failed: ${error.message}`
    );
  }
}

module.exports = { getGeminiKey };