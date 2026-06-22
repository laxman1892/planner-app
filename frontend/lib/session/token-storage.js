const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function resolveStorage(storage) {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function getStoredTokens(storage) {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return null;
  }

  const access = resolvedStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh = resolvedStorage.getItem(REFRESH_TOKEN_KEY);

  if (!access || !refresh) {
    return null;
  }

  return { access, refresh };
}

export function persistTokens(tokens, storage) {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return tokens;
  }

  resolvedStorage.setItem(ACCESS_TOKEN_KEY, tokens.access);
  resolvedStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);

  return tokens;
}

export function clearStoredTokens(storage) {
  const resolvedStorage = resolveStorage(storage);

  if (!resolvedStorage) {
    return;
  }

  resolvedStorage.removeItem(ACCESS_TOKEN_KEY);
  resolvedStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function createTokenStorage(storage) {
  return {
    read() {
      return getStoredTokens(storage);
    },
    persist(tokens) {
      return persistTokens(tokens, storage);
    },
    clear() {
      clearStoredTokens(storage);
    },
  };
}
