"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../lib/api";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);

      // 保存 token
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // 根据角色跳转
      if (data.user.role === "CUSTOMER") {
        router.push("/customer");
      } else if (data.user.role === "DRIVER") {
        router.push("/driver");
      }

    } catch (err) {
      setMessage("Login failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Hauler Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
      
      <br /><br />
      <p>
      No account? <a href="/register">Register here</a>
      </p>
    </div>
  );
}