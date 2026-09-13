"use client";

import { useState } from "react";

import { authenticatedRequest, createEventInvitation, updateEventInvitation } from "@/lib/api";
import { toDateTimeLocalValue } from "@/lib/formatters";
import { useDashboardData } from "@/hooks/useDashboardData";

const initialEvent = {
  title: "",
  description: "",
  starts_at: "",
  category: "personal",
  quest_mode: "solo",
  is_completed: false,
};

const initialChallenge = {
  title: "",
  description: "",
  deadline: "",
  streak_goal_days: "",
  category_tags: "",
};

const initialProgress = {
  date: "",
  progress_note: "",
};

export function useAuthExperienceDashboard({ accessToken }) {
  const {
    achievements,
    achievementsError,
    challenges,
    challengesError,
    events,
    eventsError,
    invitations,
    invitationsError,
    isAchievementsLoading,
    isChallengesLoading,
    isEventsLoading,
    isInvitationsLoading,
    loadAchievements,
    loadChallenges,
    loadEvents,
    loadInvitations,
    resetDashboardData,
    setChallenges,
    setChallengesError,
    setEvents,
    setEventsError,
    setInvitations,
    setInvitationsError,
  } = useDashboardData();
  const [eventForm, setEventForm] = useState(initialEvent);
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventPendingDelete, setEventPendingDelete] = useState(null);
  const [updatingInvitationId, setUpdatingInvitationId] = useState(null);
  const [inviteForms, setInviteForms] = useState({});
  const [submittingInviteEventId, setSubmittingInviteEventId] = useState(null);
  const [challengeForm, setChallengeForm] = useState(initialChallenge);
  const [progressForms, setProgressForms] = useState({});
  const [isChallengeSubmitting, setIsChallengeSubmitting] = useState(false);
  const [submittingProgressId, setSubmittingProgressId] = useState(null);
  const [completingChallengeId, setCompletingChallengeId] = useState(null);

  async function loadDashboard(accessTokenToLoad) {
    await loadEvents(accessTokenToLoad);
    await loadInvitations(accessTokenToLoad);
    await loadChallenges(accessTokenToLoad);
    await loadAchievements(accessTokenToLoad);
  }

  function resetDashboardExperience() {
    setEventForm(initialEvent);
    setIsEventSubmitting(false);
    setIsEventModalOpen(false);
    setEditingEventId(null);
    setEventPendingDelete(null);
    setUpdatingInvitationId(null);
    setInviteForms({});
    setSubmittingInviteEventId(null);
    setChallengeForm(initialChallenge);
    setProgressForms({});
    setIsChallengeSubmitting(false);
    setSubmittingProgressId(null);
    setCompletingChallengeId(null);
    resetDashboardData();
  }

  function updateEvent(event) {
    setEventForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateChallenge(event) {
    setChallengesError("");
    setChallengeForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  function updateProgress(challengeId, event) {
    setChallengesError("");
    setProgressForms((current) => ({
      ...current,
      [challengeId]: {
        ...initialProgress,
        ...current[challengeId],
        [event.target.name]: event.target.value,
      },
    }));
  }

  function updateInviteIdentifier(eventId, value) {
    setEventsError("");
    setInviteForms((current) => ({
      ...current,
      [eventId]: value,
    }));
  }

  function openCreateEventModal() {
    setEditingEventId(null);
    setEventForm(initialEvent);
    setEventsError("");
    setIsEventModalOpen(true);
  }

  function openEditEventModal(plannerEvent) {
    setEditingEventId(plannerEvent.id);
    setEventForm({
      title: plannerEvent.title,
      description: plannerEvent.description,
      starts_at: toDateTimeLocalValue(plannerEvent.starts_at),
      category: plannerEvent.category,
      quest_mode: plannerEvent.quest_mode ?? "solo",
      is_completed: Boolean(plannerEvent.is_completed),
    });
    setEventsError("");
    setIsEventModalOpen(true);
  }

  function closeEventModal() {
    setIsEventModalOpen(false);
    setEditingEventId(null);
    setEventForm(initialEvent);
    setEventsError("");
  }

  async function handleSubmitEvent(event) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    setIsEventSubmitting(true);
    setEventsError("");

    try {
      const eventPayload = {
        title: eventForm.title,
        description: eventForm.description,
        starts_at: new Date(eventForm.starts_at).toISOString(),
        category: eventForm.category,
        quest_mode: eventForm.quest_mode,
        is_completed: eventForm.is_completed,
      };
      const savedEvent = await authenticatedRequest(
        editingEventId ? `/events/${editingEventId}/` : "/events/",
        accessToken,
        {
          method: editingEventId ? "PATCH" : "POST",
          body: JSON.stringify(eventPayload),
        },
      );
      setEvents((current) => {
        const nextEvents = editingEventId
          ? current.map((plannerEvent) => (plannerEvent.id === savedEvent.id ? savedEvent : plannerEvent))
          : [...current, savedEvent];

        return nextEvents.sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
      });
      closeEventModal();
    } catch (eventError) {
      setEventsError(eventError.message);
    } finally {
      setIsEventSubmitting(false);
    }
  }

  async function handleDeleteEvent() {
    if (!accessToken || !eventPendingDelete) {
      return;
    }

    setEventsError("");

    try {
      await authenticatedRequest(`/events/${eventPendingDelete.id}/`, accessToken, {
        method: "DELETE",
      });
      setEvents((current) => current.filter((plannerEvent) => plannerEvent.id !== eventPendingDelete.id));
      setEventPendingDelete(null);
    } catch (eventError) {
      setEventsError(eventError.message);
    }
  }

  async function handleInvitationResponse(invitationId, status) {
    if (!accessToken) {
      return;
    }

    setUpdatingInvitationId(invitationId);
    setInvitationsError("");

    try {
      const updatedInvitation = await updateEventInvitation(invitationId, accessToken, status);
      setInvitations((current) =>
        current.map((invitation) => (invitation.id === updatedInvitation.id ? updatedInvitation : invitation)),
      );
      await loadEvents(accessToken);
    } catch (invitationError) {
      setInvitationsError(invitationError.message);
    } finally {
      setUpdatingInvitationId(null);
    }
  }

  async function handleCreateInvitation(eventId) {
    if (!accessToken) {
      return;
    }

    const identifier = (inviteForms[eventId] ?? "").trim();
    if (!identifier) {
      setEventsError("Enter an email or username to invite.");
      return;
    }

    setSubmittingInviteEventId(eventId);
    setEventsError("");

    try {
      const createdInvitation = await createEventInvitation(eventId, accessToken, identifier);
      setInvitations((current) => [...current, createdInvitation]);
      setInviteForms((current) => ({
        ...current,
        [eventId]: "",
      }));
    } catch (invitationError) {
      setEventsError(invitationError.message);
    } finally {
      setSubmittingInviteEventId(null);
    }
  }

  async function handleCreateChallenge(event) {
    event.preventDefault();

    if (!accessToken) {
      return null;
    }

    setIsChallengeSubmitting(true);
    setChallengesError("");

    try {
      const createdChallenge = await authenticatedRequest("/challenges/", accessToken, {
        method: "POST",
        body: JSON.stringify({
          title: challengeForm.title,
          description: challengeForm.description,
          deadline: challengeForm.deadline || null,
          streak_goal_days: challengeForm.streak_goal_days ? Number(challengeForm.streak_goal_days) : null,
          category_tags: challengeForm.category_tags
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean),
        }),
      });
      setChallenges((current) => [createdChallenge, ...current]);
      setChallengeForm(initialChallenge);
      return createdChallenge;
    } catch (challengeError) {
      setChallengesError(challengeError.message);
      return null;
    } finally {
      setIsChallengeSubmitting(false);
    }
  }

  async function handleLogProgress(challengeId, event) {
    event.preventDefault();

    if (!accessToken) {
      return;
    }

    const progressForm = progressForms[challengeId] ?? initialProgress;
    setSubmittingProgressId(challengeId);
    setChallengesError("");

    try {
      const progressLog = await authenticatedRequest("/progress/", accessToken, {
        method: "POST",
        body: JSON.stringify({
          challenge: challengeId,
          date: progressForm.date,
          progress_note: progressForm.progress_note,
        }),
      });
      setChallenges((current) =>
        current.map((challenge) =>
          challenge.id === challengeId
            ? {
                ...challenge,
                progress_logs: [progressLog, ...(challenge.progress_logs ?? [])],
              }
            : challenge,
        ),
      );
      setProgressForms((current) => ({
        ...current,
        [challengeId]: initialProgress,
      }));
      await loadAchievements(accessToken);
    } catch (progressError) {
      setChallengesError(progressError.message);
    } finally {
      setSubmittingProgressId(null);
    }
  }

  async function handleCompleteChallenge(challengeId) {
    if (!accessToken) {
      return;
    }

    setCompletingChallengeId(challengeId);
    setChallengesError("");

    try {
      const completedChallenge = await authenticatedRequest(`/challenges/${challengeId}/complete/`, accessToken, {
        method: "POST",
      });
      setChallenges((current) =>
        current.map((challenge) => (challenge.id === challengeId ? completedChallenge : challenge)),
      );
      await loadAchievements(accessToken);
    } catch (completeError) {
      setChallengesError(completeError.message);
    } finally {
      setCompletingChallengeId(null);
    }
  }

  return {
    achievements,
    achievementsError,
    challenges,
    challengesError,
    challengeForm,
    closeEventModal,
    completingChallengeId,
    eventForm,
    eventPendingDelete,
    events,
    eventsError,
    inviteForms,
    invitations,
    invitationsError,
    handleCompleteChallenge,
    handleCreateChallenge,
    handleDeleteEvent,
    handleCreateInvitation,
    handleInvitationResponse,
    handleLogProgress,
    handleSubmitEvent,
    isAchievementsLoading,
    isChallengeSubmitting,
    isChallengesLoading,
    isEventModalOpen,
    isEventSubmitting,
    isEventsLoading,
    isInvitationsLoading,
    submittingInviteEventId,
    loadAchievements,
    loadChallenges,
    loadDashboard,
    loadEvents,
    loadInvitations,
    openCreateEventModal,
    openEditEventModal,
    progressForms,
    resetDashboardExperience,
    setEventPendingDelete,
    submittingProgressId,
    updatingInvitationId,
    updateInviteIdentifier,
    updateChallenge,
    updateEvent,
    updateProgress,
    editingEventId,
  };
}
