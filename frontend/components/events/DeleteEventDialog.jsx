"use client";

export default function DeleteEventDialog({ event, onCancel, onConfirm }) {
  if (!event) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Delete event"
      >
        <div>
          <p className="eyebrow">Delete event</p>
          <h2>{event.title}</h2>
          <p>This event will be permanently removed from your planner.</p>
        </div>
        <div className="confirm-actions">
          <button type="button" className="ghost neutral" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="danger-button" onClick={onConfirm}>
            Delete event
          </button>
        </div>
      </section>
    </div>
  );
}
