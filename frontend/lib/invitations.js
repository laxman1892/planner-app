export function getInvitationActionState(invitation) {
  const canRespond = invitation.status === "pending";

  return {
    canRespond,
    isAccepted: invitation.status === "accepted",
    isDeclined: invitation.status === "declined",
    isExpired: invitation.status === "expired",
  };
}

export function getCreatorInvitationsByEvent(invitations, currentUserId) {
  return invitations.reduce((grouped, invitation) => {
    if (invitation.creator_detail.id !== currentUserId) {
      return grouped;
    }

    const eventInvitations = grouped[invitation.event] ?? [];
    return {
      ...grouped,
      [invitation.event]: [...eventInvitations, invitation],
    };
  }, {});
}
