"use client";

import { Pencil, Trash2 } from "lucide-react";
import { formatEventTime } from "@/lib/formatters";
import StatusMessage from "@/components/ui/StatusMessage";

export default function EventList({
  events,
  creatorInvitationsByEvent = {},
  currentUserId,
  eventsError,
  inviteForms = {},
  isEventsLoading,
  onRefresh,
  onCreateInvitation,
  onEdit,
  onDelete,
  onInviteIdentifierChange,
  refreshDisabled,
  submittingInviteEventId,
}) {
  const sortedEvents = [...events].sort(
    (left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime(),
  );

  function getInviteeLabel(invitation) {
    return (
      invitation.user_detail.full_name ||
      invitation.user_detail.username ||
      invitation.user_detail.email
    );
  }

  function getStatusLabel(status) {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <section className="panel planner-surface" id="events">
      <div className="panel-header">
        <h2>Quest Planner</h2>
        <button
          type="button"
          className="ghost"
          onClick={onRefresh}
          disabled={refreshDisabled}
        >
          Refresh
        </button>
      </div>
      <div className="item-list planner-event-list">
        <StatusMessage message={eventsError} tone="error" />
        <StatusMessage message={isEventsLoading ? "Loading event quests..." : ""} />
        <StatusMessage message={!isEventsLoading && events.length === 0 ? "No event quests yet." : ""} />
        {sortedEvents.map((event) => (
          <article className="list-item planner-event-card" key={event.id}>
            <div className="planner-event-card-main">
              <div className="planner-event-card-header">
                <span className="planner-pill">{event.quest_mode === "group" ? "GROUP RAID" : "SOLO QUEST"}</span>
                <span className="planner-status">{event.is_completed ? "Completed" : "Active"}</span>
              </div>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p className="planner-event-time">{formatEventTime(event.starts_at)}</p>
              {(creatorInvitationsByEvent[event.id] ?? []).length > 0 ? (
                <div className="invitation-status-list">
                  {(creatorInvitationsByEvent[event.id] ?? []).map((invitation) => (
                    <p key={invitation.id}>
                      {getInviteeLabel(invitation)}: {getStatusLabel(invitation.status)}
                    </p>
                  ))}
                </div>
              ) : null}
              {event.creator?.id === currentUserId ? (
                <div className="invite-form">
                  <input
                    type="text"
                    placeholder="Invite by email or username"
                    value={inviteForms[event.id] ?? ""}
                    onChange={(nextEvent) => onInviteIdentifierChange(event.id, nextEvent.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => onCreateInvitation(event.id)}
                    disabled={submittingInviteEventId === event.id}
                  >
                    {submittingInviteEventId === event.id ? "Inviting..." : "Invite"}
                  </button>
                </div>
              ) : null}
            </div>
            <div className="event-actions planner-event-actions">
              <span className="planner-category-chip">{event.category}</span>
              {event.creator?.id === currentUserId ? (
                <>
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
                </>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
