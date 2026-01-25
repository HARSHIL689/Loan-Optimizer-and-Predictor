import { useState } from "react";
import AuthInput from "../components/AuthInput";
import AlertModal from "../components/AlertModal";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const { signUp } = useAuth();
  const navigate = useNavigate();

  async function handleSignUp() {
    if (!email || !password || !confirmPassword) {
      setAlertMessage("Please fill all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertMessage("Please enter a valid email address.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setAlertMessage(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setAlertMessage("Passwords do not match.");
      return;
    }

    try {
      await signUp(email, password);
      navigate("/dashboard");
    } catch (err) {
      setAlertMessage(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone via-stone/95 to-midnight/90 text-ink px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-parchment border border-brass/50 shadow-2xl p-8 space-y-6">
        {/* Arcane accent */}
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-transparent via-primary/70 to-transparent" />

        <h1 className="text-3xl font-extrabold tracking-wide text-center">
          Create Account
        </h1>

        <AuthInput
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
        />

        <AuthInput
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Strong password"
        />

        <AuthInput
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repeat password"
        />

        <button
          onClick={handleSignUp}
          className="w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:brightness-110 active:scale-[0.97] transition disabled:opacity-50"
        >
          Create Account
        </button>

        <p className="text-sm text-center text-ink/70">
          Already have an account?{" "}
          <a
            href="/signin"
            className="font-semibold text-primary hover:underline underline-offset-4"
          >
            Sign in
          </a>
        </p>
      </div>

      <AlertModal
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />
    </div>
  );
}
