import React from "react";

interface ToastProps {
  toast: { message: string; type: "success" | "error" } | null;
}

export const Toast: React.FC<ToastProps> = ({ toast }) => {
  if (!toast) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 24px",
        borderRadius: "8px",
        backgroundColor: toast.type === "success" ? "#10B981" : "#EF4444",
        color: "#FFFFFF",
        fontWeight: 600,
        boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
        zIndex: 9999,
        transition: "all 0.3s ease",
      }}
    >
      {toast.message}
    </div>
  );
};
