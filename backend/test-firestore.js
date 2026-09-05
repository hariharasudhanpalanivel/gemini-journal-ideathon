const db = require("./firestore");

async function main() {
  await db.collection("test").add({
    message: "hello",
    createdAt: new Date(),
  });

  console.log("SUCCESS");
}

main().catch(console.error);