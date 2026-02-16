"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    title,
    children
}: {
    title: string;
    children: ReactNode;
}) {
    const router = useRouter();

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        router.push("/");
    }

    return (
        <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6fa" }}>

            {/* Sidebar */}
            <div style={{
                width: 240,
                background: "#1f2937", // 深蓝灰
                color: "white",
                padding: 20
            }}>
                <h2 style={{ marginBottom: 30 }}>Hauler</h2>

                <div
                    style={{ marginBottom: 15, cursor: "pointer" }}
                    onClick={() => router.push("/customer")}
                >
                    Customer Dashboard
                </div>

                <div
                    style={{ marginBottom: 15, cursor: "pointer" }}
                    onClick={() => router.push("/driver")}
                >
                    Driver Dashboard
                </div>
            </div>

            {/* Main Area */}
            <div style={{
                flex: 1,
                padding: 30,
                background: "#ecf0f4"
            }}>

                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: 20,
                    marginBottom: 30,
                    borderBottom: "1px solid #e5e7eb"
                }}>
                    <h1 style={{
                        color: "#111827",
                        fontWeight: 600
                    }}>
                        {title}
                    </h1>

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

                <div style={{
                    background: "#ffffff",
                    padding: 28,
                    borderRadius: 12,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    color: "#111827"
                }}>
                    {children}
                </div>

            </div>

        </div>
    );
}
