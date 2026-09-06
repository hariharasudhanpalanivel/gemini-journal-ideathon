import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";

import "./App.css";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="login-shell">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  return user ? <Dashboard user={user} /> : <Login />;
}

export default App;