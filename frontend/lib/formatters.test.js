import test from "node:test";
import assert from "node:assert/strict";

import {
  formatChallengeDeadline,
  formatEventTime,
  toDateTimeLocalValue,
} from "./formatters.js";

test("toDateTimeLocalValue converts an ISO timestamp into a datetime-local field value", () => {
  assert.equal(
    toDateTimeLocalValue("2026-06-04T10:15:00.000Z", {
      getTimezoneOffset(date) {
        return date.valueOf() ? -345 : 0;
      },
    }),
    "2026-06-04T16:00",
  );
});

test("formatEventTime formats a timestamp with date and time", () => {
  assert.equal(formatEventTime("2026-06-04T10:15:00.000Z", { timeZone: "UTC" }), "Jun 4, 2026, 10:15 AM");
});

test('formatChallengeDeadline returns "No deadline" when the value is empty', () => {
  assert.equal(formatChallengeDeadline(""), "No deadline");
});

test("formatChallengeDeadline formats a date-only value", () => {
  assert.equal(formatChallengeDeadline("2026-06-04"), "Jun 4, 2026");
});

test("formatChallengeDeadline keeps date-only values stable even if a timezone option is passed", () => {
  assert.equal(
    formatChallengeDeadline("2026-06-04", {
      timeZone: "America/Los_Angeles",
    }),
    "Jun 4, 2026",
  );
});
