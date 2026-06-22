"use client";

import { useState } from "react";

import { authenticatedRequest } from "@/lib/api";
import { toDateTimeLocalValue } from "@/lib/formatters";
import { useDashboardData } from "@/hooks/useDashboardData";

const initialEvent = {
  title: "",
  description: "",
  starts_at: "",
  category: "personal",
};

const initialChallenge = {
  title: "",
  description: "",
  deadline: "",
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
    isAchievementsLoading,
    isChallengesLoading,
    isEventsLoading,
    loadAchievements,
    loadChallenges,
    loadEvents,
    resetDashboardData,
    setChallenges,
    setChallengesError,
    setEvents,
    setEventsError,
  } = useDashboardData();
  const [eventForm, setEventForm] = useState(initialEvent);
  const [isEventSubmitting, setIsEventSubmitting] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [eventPendingDelete, setEventPendingDelete] = useState(null);
  const [challengeForm, setChallengeForm] = useState(initialChallenge);
  const [progressForms, setProgressForms] = useState({});
  const [isChallengeSubmitting, setIsChallengeSubmitting] = useState(false);
  const [submittingProgressId, setSubmittingProgressId] = useState(null);
  const [completingChallengeId, setCompletingChallengeId] = useState(null);

  async function loadDashboard(accessTokenToLoad) {
    await loadEvents(accessTokenToLoad);
    await loadChallenges(accessTokenToLoad);
    await loadAchievements(accessTokenToLoad);
  }

  function resetDashboardExperience() {
    setEventForm(initialEvent);
    setIsEventSubmitting(false);
    setIsEventModalOpen(false);
    setEditingEventId(null);
    setEventPendingDelete(null);
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

  async function handleCreateChallenge(event) {
    event.preventDefault();

    if (!accessToken) {
      return;
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
        }),
      });
      setChallenges((current) => [createdChallenge, ...current]);
      setChallengeForm(initialChallenge);
    } catch (challengeError) {
      setChallengesError(challengeError.message);
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
    handleCompleteChallenge,
    handleCreateChallenge,
    handleDeleteEvent,
    handleLogProgress,
    handleSubmitEvent,
    isAchievementsLoading,
    isChallengeSubmitting,
    isChallengesLoading,
    isEventModalOpen,
    isEventSubmitting,
    isEventsLoading,
    loadAchievements,
    loadChallenges,
    loadDashboard,
    loadEvents,
    openCreateEventModal,
    openEditEventModal,
    progressForms,
    resetDashboardExperience,
    setEventPendingDelete,
    submittingProgressId,
    updateChallenge,
    updateEvent,
    updateProgress,
    editingEventId,
  };
}
