import test from "node:test";
import assert from "node:assert/strict";

import {
  clearStoredTokens,
  createTokenStorage,
  getStoredTokens,
  persistTokens,
} from "./token-storage.js";

function createMemoryStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    },
  };
}

test("getStoredTokens returns null when either token is missing", () => {
  const storage = createMemoryStorage();

  assert.equal(getStoredTokens(storage), null);

  storage.setItem("accessToken", "access-only");
  assert.equal(getStoredTokens(storage), null);
});

test("persistTokens stores both access and refresh tokens", () => {
  const storage = createMemoryStorage();

  persistTokens(
    {
      access: "access-token",
      refresh: "refresh-token",
    },
    storage,
  );

  assert.deepEqual(getStoredTokens(storage), {
    access: "access-token",
    refresh: "refresh-token",
  });
});

test("clearStoredTokens removes both persisted tokens", () => {
  const storage = createMemoryStorage();

  persistTokens(
    {
      access: "access-token",
      refresh: "refresh-token",
    },
    storage,
  );

  clearStoredTokens(storage);

  assert.equal(storage.getItem("accessToken"), null);
  assert.equal(storage.getItem("refreshToken"), null);
  assert.equal(getStoredTokens(storage), null);
});

test("createTokenStorage binds helpers to the provided storage", () => {
  const storage = createMemoryStorage();
  const tokenStorage = createTokenStorage(storage);

  tokenStorage.persist({
    access: "bound-access",
    refresh: "bound-refresh",
  });

  assert.deepEqual(tokenStorage.read(), {
    access: "bound-access",
    refresh: "bound-refresh",
  });

  tokenStorage.clear();

  assert.equal(tokenStorage.read(), null);
});
