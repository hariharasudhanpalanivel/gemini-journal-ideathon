import { useRef, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ??
    "https://gemini-journal-234422397989.asia-south1.run.app";

export default function Journal() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [mood, setMood] = useState("");
    const [summary, setSummary] = useState("");
    const [persisted, setPersisted] = useState(true);
    const [loading, setLoading] = useState(false);
    // One sessionId per conversation so Gemini keeps multi-turn context.
    const sessionId = useRef(crypto.randomUUID());

    const sendMessage = async () => {
        if (!message.trim() || loading) return;

        setLoading(true);
        try {
            const token = await auth.currentUser?.getIdToken();

            const result = await axios.post(
                `${API_BASE}/chat`,
                {
                    message,
                    sessionId: sessionId.current,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setResponse(result.data.response);
            setMood(result.data.mood ?? "");
            setSummary(result.data.summary ?? "");
            setPersisted(result.data.persisted !== false);
            setMessage("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card stack">
            <textarea
                className="textarea"
                placeholder="What's on your mind?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <button className="btn" onClick={sendMessage} disabled={loading}>
                {loading ? "Sending..." : "Send"}
            </button>

            {!persisted && (
                <p className="warning">
                    This entry wasn't saved to your journal history (storage
                    is temporarily unavailable).
                </p>
            )}

            {response && (
                <div className="stack">
                    {mood && (
                        <span className={`badge badge-${mood}`}>{mood}</span>
                    )}
                    <div className="response">{response}</div>
                    {summary && (
                        <p className="text-muted">Session summary: {summary}</p>
                    )}
                </div>
            )}
        </div>
    );
}