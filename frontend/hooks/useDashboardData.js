"use client";

import { useState } from "react";

import { authenticatedRequest, listEventInvitations } from "@/lib/api";

export function useDashboardData() {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");
  const [isEventsLoading, setIsEventsLoading] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [invitationsError, setInvitationsError] = useState("");
  const [isInvitationsLoading, setIsInvitationsLoading] = useState(false);
  const [challenges, setChallenges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [achievementsError, setAchievementsError] = useState("");
  const [isAchievementsLoading, setIsAchievementsLoading] = useState(false);
  const [challengesError, setChallengesError] = useState("");
  const [isChallengesLoading, setIsChallengesLoading] = useState(false);

  async function loadEvents(accessToken) {
    setIsEventsLoading(true);
    setEventsError("");

    try {
      const plannerEvents = await authenticatedRequest("/events/", accessToken);
      setEvents(plannerEvents);
    } catch (eventError) {
      setEventsError(eventError.message);
    } finally {
      setIsEventsLoading(false);
    }
  }

  async function loadInvitations(accessToken) {
    setIsInvitationsLoading(true);
    setInvitationsError("");

    try {
      const nextInvitations = await listEventInvitations(accessToken);
      setInvitations(nextInvitations);
    } catch (invitationError) {
      setInvitationsError(invitationError.message);
    } finally {
      setIsInvitationsLoading(false);
    }
  }

  async function loadChallenges(accessToken) {
    setIsChallengesLoading(true);
    setChallengesError("");

    try {
      const nextChallenges = await authenticatedRequest("/challenges/", accessToken);
      setChallenges(nextChallenges);
    } catch (challengeError) {
      setChallengesError(challengeError.message);
    } finally {
      setIsChallengesLoading(false);
    }
  }

  async function loadAchievements(accessToken) {
    setIsAchievementsLoading(true);
    setAchievementsError("");

    try {
      const nextAchievements = await authenticatedRequest("/achievements/", accessToken);
      setAchievements(nextAchievements);
    } catch (achievementError) {
      setAchievementsError(achievementError.message);
    } finally {
      setIsAchievementsLoading(false);
    }
  }

  function resetDashboardData() {
    setEvents([]);
    setEventsError("");
    setIsEventsLoading(false);
    setInvitations([]);
    setInvitationsError("");
    setIsInvitationsLoading(false);
    setChallenges([]);
    setAchievements([]);
    setAchievementsError("");
    setIsAchievementsLoading(false);
    setChallengesError("");
    setIsChallengesLoading(false);
  }

  return {
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
    setAchievementsError,
    setAchievements,
    setChallenges,
    setChallengesError,
    setEvents,
    setEventsError,
    setInvitations,
    setInvitationsError,
  };
}
