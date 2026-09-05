const { askGemini } = require("./gemini");

async function main() {
  const response = await askGemini(
    "Say hello from Personal Gemini Journal"
  );

  console.log(response);
}

main();