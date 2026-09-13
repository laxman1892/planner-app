import assert from "node:assert/strict";
import test from "node:test";

import { getNotificationLabel, getUnreadCount } from "./notifications.js";

test("getUnreadCount counts unread notifications", () => {
  assert.equal(
    getUnreadCount([
      { id: 1, is_read: false },
      { id: 2, is_read: true },
      { id: 3, is_read: false },
    ]),
    2,
  );
});

test("getNotificationLabel maps reminder types", () => {
  assert.equal(getNotificationLabel({ type: "event_reminder" }), "Event reminder");
});
