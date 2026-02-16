"use client";

export default function StatusBadge({ status }: { status: string }) {
  let background = "#6b7280"; // 默认灰色

  if (status === "DELIVERED") {
    background = "#16a34a"; // 绿色
  } else if (status === "ON_THE_WAY") {
    background = "#2563eb"; // 蓝色
  } else if (status === "ACCEPTED") {
    background = "#7c3aed"; // 紫色
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        color: "white",
        background
      }}
    >
      {status}
    </span>
  );
}
