const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const client = new SecretManagerServiceClient();

async function getGeminiKey() {
  const [version] = await client.accessSecretVersion({
    name: `projects/personal-gemini-journal-507718/secrets/GEMINI_API_KEY/versions/latest`,
  });

  return version.payload.data.toString();
}

module.exports = { getGeminiKey };