"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../lib/api";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("name", data.user.name || "");

      if (data.user.role === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/driver");
      }


    } catch {
      setError("Invalid email or password");
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f6fa",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        width: 400,
        background: "white",
        padding: 40,
        borderRadius: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <h2 style={{
          marginBottom: 30,
          textAlign: "center",
          color: "#111827"
        }}>
          Cargo-Go Login
        </h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          style={buttonStyle}
        >
          Login
        </button>

        <p style={{
          marginTop: 24,
          textAlign: "center",
          color: "#6b7280",
          fontSize: 14
        }}>
          No account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => router.push("/register")}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 18,
  borderRadius: 10,
  border: "1px solid #d1d5db",
  fontSize: 14,
  color: "#111827",           // 输入文字颜色
  background: "#ffffff",
  outline: "none"
};


const buttonStyle = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600
};
