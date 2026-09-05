const { initializeApp, getApps } = require("firebase-admin/app");

const app =
  getApps().length === 0
    ? initializeApp()
    : getApps()[0];

module.exports = app;