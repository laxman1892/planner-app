"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Flame, Medal, Zap } from "lucide-react";

import { getProgressSummary } from "@/lib/api";

function getCompletedQuestCount(events, challenges) {
  return (
    events.filter((event) => event.is_completed).length +
    challenges.filter((challenge) => challenge.is_completed).length
  );
}

function getCurrentStreak(challenges) {
  return challenges.reduce((best, challenge) => {
    const streak = Number(challenge.current_streak ?? 0);
    return streak > best ? streak : best;
  }, 0);
}

function getNextGoalLabel(progress) {
  return `Level ${(progress?.level ?? 1) + 1}`;
}

export default function DashboardStats({ accessToken, events, challenges }) {
  const [progress, setProgress] = useState({
    level: 1,
    next_level_xp: 100,
    total_xp: 0,
  });

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    let isCurrent = true;

    async function loadProgress() {
      try {
        const summary = await getProgressSummary(accessToken);
        if (isCurrent) {
          setProgress(summary);
        }
      } catch {
      }
    }

    void loadProgress();

    return () => {
      isCurrent = false;
    };
  }, [accessToken]);

  const completedQuests = getCompletedQuestCount(events, challenges);
  const currentStreak = getCurrentStreak(challenges);
  return (
    <section className="dashboard-stats-grid" aria-label="Command center summary">
      <article className="dashboard-stat-card dashboard-stat-card--blue">
        <div className="dashboard-stat-icon">
          <Flame />
        </div>
        <div>
          <span>Current streak</span>
          <strong>{currentStreak} days</strong>
        </div>
      </article>
      <article className="dashboard-stat-card dashboard-stat-card--violet">
        <div className="dashboard-stat-icon">
          <CheckCircle2 />
        </div>
        <div>
          <span>Quests done</span>
          <strong>{completedQuests} total</strong>
        </div>
      </article>
      <article className="dashboard-stat-card dashboard-stat-card--amber">
        <div className="dashboard-stat-icon">
          <Medal />
        </div>
        <div>
          <span>Total XP</span>
          <strong>{progress.total_xp}</strong>
        </div>
      </article>
      <article className="dashboard-stat-card dashboard-stat-card--green">
        <div className="dashboard-stat-icon">
          <Zap />
        </div>
        <div>
          <span>Next Goal</span>
          <strong>{getNextGoalLabel(progress)}</strong>
        </div>
      </article>
    </section>
  );
}
