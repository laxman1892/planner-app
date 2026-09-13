"use client";

import { Bell } from "lucide-react";

export default function NotificationBell({ unreadCount, onToggle }) {
  return (
    <button
      type="button"
      className="topbar-notification-button"
      onClick={onToggle}
      aria-label="Notifications"
    >
      <Bell size={18} />
      {unreadCount > 0 ? <strong>{unreadCount}</strong> : null}
    </button>
  );
}
