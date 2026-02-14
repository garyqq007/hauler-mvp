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

      if (data.user.role === "CUSTOMER") {
        router.push("/customer");
      } else {
        router.push("/driver");
      }

    } catch (err) {
      setError("Register failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Register</h1>

      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

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

      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="CUSTOMER">Customer</option>
        <option value="DRIVER">Driver</option>
      </select>

      <br /><br />

      <button onClick={handleRegister}>
        Register
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
