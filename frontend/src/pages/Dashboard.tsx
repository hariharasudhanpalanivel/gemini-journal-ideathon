import { useEffect, useState } from "react";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import { signOut, type User } from "firebase/auth";

import { auth, db } from "../firebase";
import Journal from "./Journal";

const MOOD_COLOR: Record<string, string> = {
    positive: "#2e7d32",
    neutral: "#9e9e9e",
    negative: "#c62828",
};

const MOOD_EMOJI: Record<string, string> = {
    positive: "😊",
    neutral: "😐",
    negative: "😔",
};

type JournalEntry = {
    id: string;
    mood?: string;
    createdAt?: { toDate: () => Date };
};

function MoodTrend() {
    const [entries, setEntries] = useState<JournalEntry[]>([]);

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const q = query(
            collection(db, "users", uid, "journals"),
            orderBy("createdAt")
        );

        return onSnapshot(q, (snapshot) => {
            setEntries(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
            );
        });
    }, []);

    if (entries.length === 0) {
        return null;
    }

    return (
        <div className="card glass mood-card stack">
            <h3>Mood Trend</h3>
            <div className="mood-timeline">
                {entries.map((entry) => {
                    const color = MOOD_COLOR[entry.mood ?? ""] ?? "#ccc";
                    return (
                        <span
                            key={entry.id}
                            className="mood-pip"
                            title={`${entry.mood ?? "unknown"} - ${entry.createdAt?.toDate().toLocaleString() ?? ""}`}
                            style={{
                                borderColor: color,
                                boxShadow: `0 0 12px ${color}66`,
                            }}
                        >
                            {MOOD_EMOJI[entry.mood ?? ""] ?? "❔"}
                        </span>
                    );
                })}
            </div>
            <div className="mood-legend">
                {(["positive", "neutral", "negative"] as const).map((m) => (
                    <span key={m}>
                        <span
                            className="mood-dot"
                            style={{ background: MOOD_COLOR[m] }}
                        />
                        {m}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function Dashboard({ user }: { user: User }) {
    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="brand">
                    {user.photoURL && (
                        <img className="avatar" src={user.photoURL} alt="" />
                    )}
                    <h2>Personal Gemini Journal</h2>
                </div>
                <button
                    className="btn btn-secondary"
                    onClick={() => signOut(auth)}
                >
                    Sign out
                </button>
            </header>

            <MoodTrend />
            <Journal />
        </div>
    );
}