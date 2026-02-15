"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

//做页面权限保护（Auth Guard）
export default function AuthGuard({
  children,
  allowedRole
}: {
  children: React.ReactNode;
  allowedRole: string;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
      router.push("/");
      return;
    }

    if (allowedRole && role !== allowedRole) {
      if (role === "CUSTOMER") {
        router.push("/customer");
      } else if (role === "DRIVER") {
        router.push("/driver");
      } else {
        router.push("/");
      }
    }
  }, [router, allowedRole]);

  return <>{children}</>;
}
