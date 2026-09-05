const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

let client;

async function getGeminiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }

  client = client || new SecretManagerServiceClient();

  const [version] = await client.accessSecretVersion({
    name: `projects/personal-gemini-journal-507718/secrets/GEMINI_API_KEY/versions/latest`,
  });

  return version.payload.data.toString();
}

module.exports = { getGeminiKey };