"use client";

import { useState } from "react";

import { apiRequest } from "@/lib/api";

const initialLogin = {
  login: "",
  password: "",
};

const initialRegister = {
  email: "",
  username: "",
  first_name: "",
  last_name: "",
  password: "",
};

export function useAuthFlow({
  initialMode = "login",
  initialSuccessMessage = "",
  loadProfile,
  onRegisterSuccess,
  persistUserSession,
}) {
  const [mode, setMode] = useState(initialMode);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(initialSuccessMessage);
  const [isLoading, setIsLoading] = useState(false);

  function switchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setSuccessMessage("");
  }

  function updateLogin(event) {
    setSuccessMessage("");
    setLoginForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateRegister(event) {
    setSuccessMessage("");
    setRegisterForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const nextTokens = await apiRequest("/auth/token/", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      persistUserSession(nextTokens);
      await loadProfile(nextTokens.access);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      await apiRequest("/auth/register/", {
        method: "POST",
        body: JSON.stringify({
          ...registerForm,
        }),
      });
      setRegisterForm(initialRegister);
      setLoginForm(initialLogin);

      if (onRegisterSuccess) {
        onRegisterSuccess();
      } else {
        setMode("login");
        setSuccessMessage("Account created successfully. Please log in to continue.");
      }
    } catch (registerError) {
      setError(registerError.message);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    authScreenProps: {
      error,
      isLoading,
      loginForm,
      mode,
      onLoginChange: updateLogin,
      onLoginSubmit: handleLogin,
      onModeChange: switchMode,
      onRegisterChange: updateRegister,
      onRegisterSubmit: handleRegister,
      registerForm,
      successMessage,
    },
    switchMode,
  };
}
