export function getUnreadCount(notifications) {
  return notifications.filter((notification) => !notification.is_read).length;
}

export function getNotificationLabel(notification) {
  switch (notification.type) {
    case "event_reminder":
      return "Event reminder";
    case "challenge_reminder":
      return "Challenge reminder";
    case "invite_sent":
      return "Invitation";
    case "invite_accepted":
      return "Accepted";
    case "invite_declined":
      return "Declined";
    default:
      return "Notification";
  }
}
