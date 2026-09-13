import test from "node:test";
import assert from "node:assert/strict";

import { getCreatorInvitationsByEvent, getInvitationActionState } from "./invitations.js";

test("getInvitationActionState allows responses only while pending", () => {
  assert.deepEqual(getInvitationActionState({ status: "pending" }), {
    canRespond: true,
    isAccepted: false,
    isDeclined: false,
    isExpired: false,
  });
});

test("getInvitationActionState marks accepted invitations as non-actionable", () => {
  assert.deepEqual(getInvitationActionState({ status: "accepted" }), {
    canRespond: false,
    isAccepted: true,
    isDeclined: false,
    isExpired: false,
  });
});

test("getInvitationActionState marks expired invitations as non-actionable", () => {
  assert.deepEqual(getInvitationActionState({ status: "expired" }), {
    canRespond: false,
    isAccepted: false,
    isDeclined: false,
    isExpired: true,
  });
});

test("getCreatorInvitationsByEvent groups only creator-owned invitations by event id", () => {
  assert.deepEqual(
    getCreatorInvitationsByEvent(
      [
        { event: 10, creator_detail: { id: 1 }, user_detail: { username: "a" }, status: "pending" },
        { event: 10, creator_detail: { id: 1 }, user_detail: { username: "b" }, status: "accepted" },
        { event: 20, creator_detail: { id: 2 }, user_detail: { username: "c" }, status: "pending" },
      ],
      1,
    ),
    {
      10: [
        { event: 10, creator_detail: { id: 1 }, user_detail: { username: "a" }, status: "pending" },
        { event: 10, creator_detail: { id: 1 }, user_detail: { username: "b" }, status: "accepted" },
      ],
    },
  );
});
