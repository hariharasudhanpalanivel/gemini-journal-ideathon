const express = require("express");
const cors = require("cors");

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

const { askGemini } = require("./gemini");

app.post("/chat", verifyUser,
    async (req, res) => {
        try {
            console.log(req.method, req.url);

            const { message } = req.body;

            const response = await askGemini(message);

            await db
                .collection("users")
                .doc(req.user.uid)
                .collection("journals")
                .add({
                    message,
                    response,
                    createdAt: new Date(),
                });
            res.json({
                success: true,
                response,
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
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${PORT}`);
});