"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/api";

export default function RegisterPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      const data = await register({
        email,
        password,
        name,
        role
      });

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      if (role === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/driver");
      }

    } catch {
      setError("Registration failed");
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
          Create Account
        </h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

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

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={inputStyle}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="DRIVER">Driver</option>
        </select>

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>
            {error}
          </p>
        )}

        <button
          onClick={handleRegister}
          style={buttonStyle}
        >
          Register
        </button>

        <p style={{
          marginTop: 24,
          textAlign: "center",
          color: "#6b7280",
          fontSize: 14
        }}>

          Already have an account?{" "}
          <span
            style={{
              color: "#2563eb",
              cursor: "pointer",
              fontWeight: 500
            }}
            onClick={() => router.push("/")}
          >
            Login
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
  color: "#111827",        // 输入文字深色
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
