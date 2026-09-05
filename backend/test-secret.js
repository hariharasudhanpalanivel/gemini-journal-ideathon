const { getGeminiKey } = require("./secretManager");

async function main() {
  const key = await getGeminiKey();

  console.log("Key Length:", key.length);
}

main();
