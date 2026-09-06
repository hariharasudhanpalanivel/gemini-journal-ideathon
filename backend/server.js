const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const verifyUser = require("./auth");
const db = require("./firestore");

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

const { askGemini, summarizeConversation } = require("./gemini");

app.post("/chat", verifyUser,
    async (req, res) => {
        try {
            console.log(req.method, req.url);

            const { message } = req.body;
            const sessionId = req.body.sessionId || crypto.randomUUID();

            if (!message || typeof message !== "string") {
                return res.status(400).json({
                    success: false,
                    error: "message is required",
                });
            }

            const journalsRef = db
                .collection("users")
                .doc(req.user.uid)
                .collection("journals");

            // Prior turns for this session give Gemini conversation context.
            let history = [];
            try {
                const priorEntries = await journalsRef
                    .where("sessionId", "==", sessionId)
                    .orderBy("createdAt")
                    .get();

                history = priorEntries.docs.map((doc) => doc.data());
            } catch (dbError) {
                console.error("Failed to load conversation history:", dbError.message);
            }

            const { reply, mood } = await askGemini(message, history);

            // Persistence is best-effort: missing local credentials must not
            // fail the request or crash the process, but the client still
            // needs to know a journal entry wasn't actually saved.
            let summary = null;
            let persisted = false;
            try {
                await journalsRef.add({
                    sessionId,
                    message,
                    response: reply,
                    mood,
                    createdAt: new Date(),
                });

                summary = await summarizeConversation([
                    ...history,
                    { message, response: reply },
                ]);

                await db
                    .collection("users")
                    .doc(req.user.uid)
                    .collection("sessions")
                    .doc(sessionId)
                    .set({ summary, updatedAt: new Date() }, { merge: true });

                persisted = true;
            } catch (dbError) {
                console.error("Failed to save journal entry:", dbError.message);
            }

            res.json({
                success: true,
                response: reply,
                mood,
                summary,
                sessionId,
                persisted,
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                error: "Failed to generate response",
            });
        }
    });


app.get("/", (req, res) => {
    console.log(req.method, req.url)
    res.json({
        status: "Backend Running"
    });
});

const PORT = 8080;

process.on("unhandledRejection", (reason) => {
    console.error("Unhandled rejection:", reason);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});