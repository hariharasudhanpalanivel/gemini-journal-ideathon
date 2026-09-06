import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL ??
    "https://gemini-journal-234422397989.asia-south1.run.app";

type ChatMessage = {
    role: "user" | "assistant";
    text: string;
    mood?: string;
};

export default function Journal() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [summary, setSummary] = useState("");
    const [persisted, setPersisted] = useState(true);
    const [loading, setLoading] = useState(false);
    // One sessionId per conversation so Gemini keeps multi-turn context.
    const sessionId = useRef(crypto.randomUUID());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        const text = message.trim();
        if (!text || loading) return;

        setMessages((prev) => [...prev, { role: "user", text }]);
        setMessage("");
        setLoading(true);

        try {
            const token = await auth.currentUser?.getIdToken();

            const result = await axios.post(
                `${API_BASE}/chat`,
                {
                    message: text,
                    sessionId: sessionId.current,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    text: result.data.response,
                    mood: result.data.mood,
                },
            ]);
            setSummary(result.data.summary ?? "");
            setPersisted(result.data.persisted !== false);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="card glass chat-card">
            <div className="chat-messages">
                {messages.length === 0 && (
                    <p className="chat-empty">
                        Start writing — Gemini is listening. 📝
                    </p>
                )}

                {messages.map((m, i) => (
                    <div key={i} className={`chat-row ${m.role}`}>
                        <span className="chat-avatar">
                            {m.role === "user" ? "🧑" : "✨"}
                        </span>
                        <div>
                            <div className={`chat-bubble ${m.role}`}>
                                {m.text}
                            </div>
                            {m.mood && (
                                <div className="chat-bubble-meta">
                                    <span className={`badge badge-${m.mood}`}>
                                        {m.mood}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="chat-row assistant">
                        <span className="chat-avatar">✨</span>
                        <div className="chat-bubble assistant">
                            <span className="typing-dots">
                                <span />
                                <span />
                                <span />
                            </span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {!persisted && (
                <p className="warning" style={{ margin: "0 20px 12px" }}>
                    This entry wasn't saved to your journal history (storage
                    is temporarily unavailable).
                </p>
            )}

            {summary && <div className="chat-summary">💭 {summary}</div>}

            <div className="chat-input-row">
                <textarea
                    className="textarea"
                    rows={1}
                    placeholder="What's on your mind?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="btn"
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    aria-label="Send"
                >
                    ➤
                </button>
            </div>
        </div>
    );
}