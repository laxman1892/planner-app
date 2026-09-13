"use client";

import { formatEventTime } from "@/lib/formatters";
import { getInvitationActionState } from "@/lib/invitations";

function getStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function InvitationCard({ invitation, onRespond, isUpdating }) {
  const actionState = getInvitationActionState(invitation);
  const creatorName =
    invitation.creator_detail.full_name ||
    invitation.creator_detail.username ||
    invitation.creator_detail.email;

  return (
    <article className="list-item">
      <div>
        <h3>{invitation.event_preview.title}</h3>
        <p>{formatEventTime(invitation.event_preview.starts_at)}</p>
        <p>From {creatorName}</p>
      </div>
      <div className="event-actions">
        <span>{getStatusLabel(invitation.status)}</span>
        {actionState.canRespond ? (
          <>
            <button
              type="button"
              className="ghost neutral"
              onClick={() => onRespond(invitation.id, "declined")}
              disabled={isUpdating}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => onRespond(invitation.id, "accepted")}
              disabled={isUpdating}
            >
              Accept
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
