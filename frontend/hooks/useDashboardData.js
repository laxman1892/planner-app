"use client";

import { useState } from "react";

import { authenticatedRequest } from "@/lib/api";

export function useDashboardData() {
  const [events, setEvents] = useState([]);
  const [eventsError, setEventsError] = useState("");
  const [isEventsLoading, setIsEventsLoading] = useState(false);
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
    isAchievementsLoading,
    isChallengesLoading,
    isEventsLoading,
    loadAchievements,
    loadChallenges,
    loadEvents,
    resetDashboardData,
    setAchievementsError,
    setAchievements,
    setChallenges,
    setChallengesError,
    setEvents,
    setEventsError,
  };
}
