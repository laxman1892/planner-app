import test from "node:test";
import assert from "node:assert/strict";

import {
  authPreviewIconNames,
  authPreviewItems,
  createAuthPreviewIcons,
  getAuthHeading,
  isAuthPreviewIconName,
} from "./auth-screen-content.js";

test("getAuthHeading returns the login copy for login mode", () => {
  assert.equal(getAuthHeading("login"), "Welcome back, adventurer");
});

test("getAuthHeading returns the register copy for register mode", () => {
  assert.equal(getAuthHeading("register"), "Create an account");
});

test("authPreviewItems preserves the auth marketing cards in order", () => {
  assert.deepEqual(
    authPreviewItems.map(({ key, icon, label, value }) => ({ key, icon, label, value })),
    [
      {
        key: "streak",
        icon: "sparkles",
        label: "Active streak",
        value: "5 days strong",
      },
      {
        key: "plan",
        icon: "calendar",
        label: "Next quest",
        value: "Design review at 10:30",
      },
      {
        key: "badge",
        icon: "medal",
        label: "Latest achievement",
        value: "Planner Starter",
      },
    ],
  );
});

test("authPreviewItems only uses icons from the shared auth preview icon contract", () => {
  const sharedPreviewIcons = createAuthPreviewIcons({
    calendar: Symbol("calendar"),
    medal: Symbol("medal"),
    sparkles: Symbol("sparkles"),
  });

  assert.deepEqual(authPreviewIconNames, ["calendar", "medal", "sparkles"]);
  assert.deepEqual(Object.keys(sharedPreviewIcons), authPreviewIconNames);

  for (const item of authPreviewItems) {
    assert.equal(
      isAuthPreviewIconName(item.icon),
      true,
      `Expected "${item.icon}" to exist in the shared auth preview icon mapping`,
    );
  }
});
