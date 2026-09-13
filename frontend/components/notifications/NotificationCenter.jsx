"use client";

import { getNotificationLabel } from "@/lib/notifications";

export default function NotificationCenter({
  isOpen,
  notifications,
  notificationsError,
  isNotificationsLoading,
  onMarkRead,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <section className="panel" aria-label="Notification center">
      <div className="panel-header">
        <h2>Notifications</h2>
      </div>
      {notificationsError ? <p>{notificationsError}</p> : null}
      {isNotificationsLoading ? <p>Loading notifications...</p> : null}
      {!isNotificationsLoading && notifications.length === 0 ? <p>No notifications yet.</p> : null}
      {notifications.map((notification) => (
        <article key={notification.id} className="list-item">
          <div>
            <p>{getNotificationLabel(notification)}</p>
            <h3>{notification.title}</h3>
            <p>{notification.body}</p>
          </div>
          {!notification.is_read ? (
            <button type="button" onClick={() => onMarkRead(notification.id)}>
              Mark read
            </button>
          ) : null}
        </article>
      ))}
    </section>
  );
}
