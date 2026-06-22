import { useState } from "react";

import { clearStoredTokens, getStoredTokens, persistTokens } from "@/lib/session/token-storage";

export function useAuthSession() {
  const [tokens, setTokens] = useState(null);

  function restoreSession() {
    const storedTokens = getStoredTokens();

    if (storedTokens) {
      setTokens(storedTokens);
    }

    return storedTokens;
  }

  function persistSession(nextTokens) {
    persistTokens(nextTokens);
    setTokens(nextTokens);
  }

  function clearAuthSession() {
    clearStoredTokens();
    setTokens(null);
  }

  return {
    tokens,
    persistSession,
    clearAuthSession,
    restoreSession,
  };
}
