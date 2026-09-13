"use client";

import { useMemo, useState } from "react";

import { authenticatedRequest } from "@/lib/api";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useSessionBootstrap } from "@/hooks/useSessionBootstrap";

export function useAuthenticatedUserSession() {
  const { tokens, clearAuthSession, persistSession, restoreSession } = useAuthSession();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const welcomeName = useMemo(() => {
    if (!user) {
      return "your next plan";
    }

    return user.full_name || user.username || user.email;
  }, [user]);

  function clearUserSession() {
    clearAuthSession();
    setUser(null);
    setError("");
  }

  async function loadProfile(accessToken) {
    try {
      const profile = await authenticatedRequest("/auth/me/", accessToken);
      setUser(profile);
      setError("");
      return profile;
    } catch (profileError) {
      clearUserSession();
      setError(profileError.message);
      return null;
    }
  }

  useSessionBootstrap({
    restoreSession,
    loadSessionData: loadProfile,
    onComplete: () => setIsBootstrapping(false),
  });

  function persistUserSession(nextTokens) {
    persistSession(nextTokens);
  }

  function handleLogout() {
    clearUserSession();
  }

  return {
    clearUserSession,
    error,
    handleLogout,
    isAuthenticated: Boolean(tokens && user),
    isBootstrapping,
    loadProfile,
    persistUserSession,
    tokens,
    user,
    welcomeName,
  };
}
