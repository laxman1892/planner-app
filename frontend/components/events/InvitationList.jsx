"use client";

import InvitationCard from "@/components/events/InvitationCard";
import StatusMessage from "@/components/ui/StatusMessage";

export default function InvitationList({
  invitations,
  invitationsError,
  isInvitationsLoading,
  onRefresh,
  onRespond,
  refreshDisabled,
  updatingInvitationId,
}) {
  return (
    <section className="panel" id="invitations">
      <div className="panel-header">
        <h2>Invitations</h2>
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
        <StatusMessage message={invitationsError} tone="error" />
        <StatusMessage message={isInvitationsLoading ? "Loading invitations..." : ""} />
        <StatusMessage
          message={!isInvitationsLoading && invitations.length === 0 ? "No invitations right now." : ""}
        />
        {invitations.map((invitation) => (
          <InvitationCard
            key={invitation.id}
            invitation={invitation}
            isUpdating={updatingInvitationId === invitation.id}
            onRespond={onRespond}
          />
        ))}
      </div>
    </section>
  );
}
