import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const token = await result.user.getIdToken();

      console.log("User:", result.user);
      console.log("Token:", token);

      alert(`Welcome ${result.user.displayName}`);
    } catch (err) {
      console.error(err);
      alert("Login Failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <h1>Personal Gemini Journal</h1>

      <p>AI Powered Secure Journaling App</p>

      <button
        onClick={handleLogin}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}