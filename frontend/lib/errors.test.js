import test from "node:test";
import assert from "node:assert/strict";

import { extractErrorMessage } from "./errors.js";

test("extractErrorMessage prefers detail when it exists", () => {
  assert.equal(extractErrorMessage({ detail: "Token expired" }), "Token expired");
});

test("extractErrorMessage joins field errors when detail is missing", () => {
  assert.equal(
    extractErrorMessage({
      email: ["Email is required."],
      password: ["Password is too short."],
    }),
    "Email is required. Password is too short.",
  );
});

test("extractErrorMessage falls back when the payload is empty", () => {
  assert.equal(extractErrorMessage({}), "Request failed");
  assert.equal(extractErrorMessage(null, "Something went wrong"), "Something went wrong");
});
