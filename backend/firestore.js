const app = require("./firebaseAdmin");
const { getFirestore } = require("firebase-admin/firestore");

const db = getFirestore(app);

module.exports = db;