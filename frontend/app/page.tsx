"use client";

import { useState } from "react";
import { login } from "../lib/api";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      setMessage("Login success!");
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
    </div>
  );
}
