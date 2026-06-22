"use client";

export default function StatusMessage({ message, tone = "muted" }) {
  if (!message) {
    return null;
  }

  const className = tone === "error" ? "form-error" : "muted-message";

  return <p className={className}>{message}</p>;
}
