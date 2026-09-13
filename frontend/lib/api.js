import { extractErrorMessage } from "@/lib/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  return parseResponse(response);
}

export async function authenticatedRequest(path, accessToken, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  return parseResponse(response);
}

export function listEventInvitations(accessToken) {
  return authenticatedRequest("/event-invitations/", accessToken);
}

export function updateEventInvitation(invitationId, accessToken, status) {
  return authenticatedRequest(`/event-invitations/${invitationId}/`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function createEventInvitation(eventId, accessToken, identifier) {
  return authenticatedRequest("/event-invitations/", accessToken, {
    method: "POST",
    body: JSON.stringify({ event: eventId, identifier }),
  });
}

export function listNotifications(accessToken) {
  return authenticatedRequest("/notifications/", accessToken);
}

export function markNotificationRead(notificationId, accessToken) {
  return authenticatedRequest(`/notifications/${notificationId}/`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}

export function getNotificationPreferences(accessToken) {
  return authenticatedRequest("/notification-preferences/me/", accessToken);
}

export function updateNotificationPreferences(accessToken, payload) {
  return authenticatedRequest("/notification-preferences/me/", accessToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getProgressSummary(accessToken) {
  return authenticatedRequest("/progression/me/", accessToken);
}
