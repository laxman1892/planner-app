export function extractErrorMessage(payload, fallbackMessage = "Request failed") {
  if (!payload || typeof payload !== "object") {
    return fallbackMessage;
  }

  if (typeof payload.detail === "string" && payload.detail.trim()) {
    return payload.detail;
  }

  const message = Object.values(payload).flat().filter(Boolean).join(" ").trim();

  return message || fallbackMessage;
}
