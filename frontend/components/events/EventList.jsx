"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatEventTime } from "@/lib/formatters";
import StatusMessage from "@/components/ui/StatusMessage";

export default function EventList({
  events,
  eventsError,
  isEventsLoading,
  onRefresh,
  onEdit,
  onDelete,
  refreshDisabled,
}) {
  return (
    <section className="panel" id="events">
      <div className="panel-header">
        <h2>Planner</h2>
        <button
          type="button"
          className="ghost"
          onClick={onRefresh}
          disabled={refreshDisabled}
        >
          Refresh
        </button>
      </div>
      <div className="item-list">
        <StatusMessage message={eventsError} tone="error" />
        <StatusMessage message={isEventsLoading ? "Loading events..." : ""} />
        <StatusMessage message={!isEventsLoading && events.length === 0 ? "No events yet." : ""} />
        {events.map((event) => (
          <article className="list-item" key={event.id}>
            <div>
              <h3>{event.title}</h3>
              <p>{formatEventTime(event.starts_at)}</p>
              <p>{event.description}</p>
            </div>
            <div className="event-actions">
              <span>{event.category}</span>
              <button
                type="button"
                className="icon-only small"
                onClick={() => onEdit(event)}
                aria-label={`Edit ${event.title}`}
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                className="icon-only small danger"
                onClick={() => onDelete(event)}
                aria-label={`Delete ${event.title}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
