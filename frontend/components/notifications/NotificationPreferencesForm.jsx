"use client";

export default function NotificationPreferencesForm({
  preferences,
  preferencesError,
  isSaving,
  onToggle,
}) {
  if (!preferences) {
    return null;
  }

  return (
    <section className="panel notification-preferences-panel">
      <div className="panel-header">
        <h2>Notification preferences</h2>
      </div>
      {preferencesError ? <p>{preferencesError}</p> : null}
      <div className="notification-preferences-grid">
        {[
          ["invite_email", "Invite email"],
          ["invite_in_app", "Invite in-app"],
          ["event_reminder_email", "Event reminder email"],
          ["event_reminder_in_app", "Event reminder in-app"],
          ["challenge_reminder_email", "Challenge reminder email"],
          ["challenge_reminder_in_app", "Challenge reminder in-app"],
        ].map(([key, label]) => (
          <label key={key} className="notification-toggle-row">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={Boolean(preferences[key])}
              onChange={() => onToggle(key, !preferences[key])}
              disabled={isSaving}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
