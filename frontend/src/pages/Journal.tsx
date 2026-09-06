import { useState } from "react";
import axios from "axios";
import { auth } from "../firebase";


export default function Journal() {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");


    const sendMessage = async () => {
        const token = await auth.currentUser?.getIdToken();

        const result = await axios.post(
            `https://gemini-journal-234422397989.asia-south1.run.app/chat`,
            {
                message,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setResponse(result.data.response);
    };


    return (
        <div style={{ padding: 20 }}>
            <h1>Personal Gemini Journal</h1>

            <textarea
                rows={5}
                cols={50}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />

            <br />

            <button onClick={sendMessage}>
                Send
            </button>

            <h3>Gemini Response</h3>

            <div>{response}</div>
        </div>
    );
}