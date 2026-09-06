import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card card">
        <h1>Personal Gemini Journal</h1>
        <p className="text-muted">
          A private space to brainstorm and journal with Gemini.
        </p>
        <button className="btn" onClick={handleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}