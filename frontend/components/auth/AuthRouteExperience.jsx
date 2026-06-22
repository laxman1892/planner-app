"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import AuthScreen from "@/components/auth/AuthScreen";
import { useAuthFlow } from "@/hooks/useAuthFlow";
import { useAuthenticatedUserSession } from "@/hooks/useAuthenticatedUserSession";

export default function AuthRouteExperience({ initialMode, initialSuccessMessage = "" }) {
  const router = useRouter();
  const session = useAuthenticatedUserSession();
  const authFlow = useAuthFlow({
    initialMode,
    initialSuccessMessage,
    onRegisterSuccess: () => router.push("/login?registered=1"),
    loadProfile: session.loadProfile,
    persistUserSession: session.persistUserSession,
  });

  useEffect(() => {
    if (!session.isAuthenticated) {
      return;
    }

    router.replace("/dashboard");
  }, [router, session.isAuthenticated]);

  function handleAuthModeChange(nextMode) {
    authFlow.switchMode(nextMode);
    router.push(nextMode === "register" ? "/register" : "/login");
  }

  if (session.isBootstrapping || session.isAuthenticated) {
    return null;
  }

  return <AuthScreen {...authFlow.authScreenProps} onModeChange={handleAuthModeChange} />;
}
