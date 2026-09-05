const { initializeApp, getApps } = require("firebase-admin/app");

const projectId =
  process.env.GOOGLE_CLOUD_PROJECT || "personal-gemini-journal-507718";

// verifyIdToken only needs projectId; Firestore uses ADC / service account.
const app = getApps().length === 0 ? initializeApp({ projectId }) : getApps()[0];

module.exports = app;