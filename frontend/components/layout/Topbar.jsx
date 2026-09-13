"use client";

import { LogOut, Mail, Search } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { getUnreadCount } from "@/lib/notifications";

export default function Topbar({ welcomeName, onLogout, notifications = [], onToggleNotifications }) {
  const initials = welcomeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "PQ";

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={18} />
        <input type="text" placeholder="Search quests..." aria-label="Search quests" />
      </div>
      <div className="topbar-actions">
        {onToggleNotifications ? (
          <NotificationBell
            unreadCount={getUnreadCount(notifications)}
            onToggle={onToggleNotifications}
          />
        ) : null}
        <button type="button" className="topbar-mail-button" aria-label="Messages">
          <Mail size={18} />
        </button>
        <div className="topbar-avatar" aria-label={welcomeName}>
          {initials}
        </div>
        <button type="button" className="icon-button topbar-logout" onClick={onLogout} aria-label="Log out">
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </header>
  );
}
