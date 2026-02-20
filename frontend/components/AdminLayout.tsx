"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminLayout({
  title,
  children
}: {
  title: string;
  children: ReactNode;
}) {

  const router = useRouter();
  const pathname = usePathname();

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const r = localStorage.getItem("role");
    setRole(r);
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  }

  // 🟢 Customer Menu
  const customerMenu = [
    { label: "Dashboard", path: "/customer" },
    { label: "History Orders", path: "/customer/history" },
    { label: "Profile", path: "/customer/profile" },
    { label: "Support", path: "/customer/support" }
  ];

  // 🔵 Driver Menu（先保留简单结构）
  const driverMenu = [
    { label: "Dashboard", path: "/driver" },
    { label: "History", path: "/driver/history" },
    { label: "Earnings", path: "/driver/earnings" }
  ];

  const menu = role === "DRIVER" ? driverMenu : customerMenu;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>

      {/* Sidebar */}
      <div
        style={{
          width: 240,
          background: "#1f2937",
          color: "white",
          padding: 20
        }}
      >
        <h2 style={{ marginBottom: 30 }}>Cargo-Go</h2>

        {menu.map((item) => {
          const isActive = pathname === item.path;

          return (
            <div
              key={item.path}
              onClick={() => router.push(item.path)}
              style={{
                marginBottom: 12,
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
                background: isActive ? "#374151" : "transparent",
                fontWeight: isActive ? 600 : 400,
                transition: "background 0.2s"
              }}
            >
              {item.label}
            </div>
          );
        })}
      </div>

      {/* Main Area */}
      <div
        style={{
          flex: 1,
          padding: 30,
          background: "#ecf0f4"
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingBottom: 20,
            marginBottom: 30,
            borderBottom: "1px solid #e5e7eb"
          }}
        >
          <div
            style={{
              marginTop: 2,
              display: "inline-block",
              padding: "6px 14px",
              background: "#e0f2fe",
              borderRadius: 20,
              fontSize: 14,
              fontWeight: 600,
              color: "#0369a1"
            }}
          >
            Hello, {localStorage.getItem("name")} 👋
          </div>



          <button
            onClick={logout}
            style={{
              background: "#ef4444",
              color: "white",
              border: "none",
              padding: "8px 14px",
              borderRadius: 6,
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            background: "#ffffff",
            padding: 28,
            borderRadius: 12,
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            color: "#111827"
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
