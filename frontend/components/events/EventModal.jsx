"use client";

import { X } from "lucide-react";

export default function EventModal({
  isOpen,
  editingEventId,
  eventForm,
  eventsError,
  isEventSubmitting,
  onClose,
  onSubmit,
  onChange,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="event-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create event"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">
              {editingEventId ? "Update personal event" : "New personal event"}
            </p>
            <h2>{editingEventId ? "Edit event" : "Create event"}</h2>
          </div>
          <button
            type="button"
            className="icon-only"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <form className="event-form" onSubmit={onSubmit}>
          <label>
            Title
            <input
              name="title"
              value={eventForm.title}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Date and time
            <input
              name="starts_at"
              type="datetime-local"
              value={eventForm.starts_at}
              onChange={onChange}
              required
            />
          </label>
          <label>
            Category
            <select
              name="category"
              value={eventForm.category}
              onChange={onChange}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="study">Study</option>
              <option value="health">Health</option>
            </select>
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={eventForm.description}
              onChange={onChange}
              rows={4}
              required
            />
          </label>
          {eventsError && <p className="form-error">{eventsError}</p>}
          <button type="submit" disabled={isEventSubmitting}>
            {isEventSubmitting
              ? "Saving..."
              : editingEventId
                ? "Save changes"
                : "Create event"}
          </button>
        </form>
      </section>
    </div>
  );
}
