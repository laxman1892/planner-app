import { useEffect, useRef } from "react";

export function useSessionBootstrap({ restoreSession, loadSessionData, onComplete }) {
  const restoreSessionRef = useRef(restoreSession);
  const loadSessionDataRef = useRef(loadSessionData);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    restoreSessionRef.current = restoreSession;
    loadSessionDataRef.current = loadSessionData;
    onCompleteRef.current = onComplete;
  }, [loadSessionData, onComplete, restoreSession]);

  useEffect(() => {
    async function bootstrapSession() {
      const storedTokens = restoreSessionRef.current();

      if (!storedTokens?.access) {
        onCompleteRef.current?.();
        return;
      }

      try {
        await loadSessionDataRef.current(storedTokens.access);
      } finally {
        onCompleteRef.current?.();
      }
    }

    void bootstrapSession();
  }, []);
}
