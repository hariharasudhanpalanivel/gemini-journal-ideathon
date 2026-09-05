const admin = require("./firebaseAdmin");

async function verifyUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded =
      await admin.auth().verifyIdToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    console.error(error);

    res.status(401).json({
      error: "Unauthorized",
    });
  }
}

module.exports = verifyUser;