"use client";

import Link from "next/link";
import { Flame, Sword, Trophy } from "lucide-react";

import ChallengeCard from "@/components/challenges/ChallengeCard";
import StatusMessage from "@/components/ui/StatusMessage";

function getBestStreak(challenges) {
  return challenges.reduce((best, challenge) => {
    const streak = Number(challenge.streak_goal_days ?? 0);
    return streak > best ? streak : best;
  }, 0);
}

function getRewardPool(challenges) {
  return challenges.reduce((total, challenge) => total + Number(challenge.reward_preview_xp ?? 0), 0);
}

export default function ChallengeHub({
  challenges,
  challengesError,
  isChallengesLoading,
  submittingProgressId,
  completingChallengeId,
  progressForms,
  onRefresh,
  onProgressSubmit,
  onProgressChange,
  onComplete,
  refreshDisabled,
}) {
  const activeChallenges = challenges.filter((challenge) => !challenge.is_completed);
  const completedChallenges = challenges.filter((challenge) => challenge.is_completed);

  return (
    <section className="challenge-hub-layout">
      <div className="panel challenge-hub-main-panel">
        <div className="panel-header">
          <div>
            <h2>Active challenges</h2>
          </div>
          <div className="challenge-hub-actions">
            <Link href="/challenges/new" className="dashboard-panel-link challenge-create-link">
              View All
            </Link>
          </div>
        </div>
        <div className="item-list challenge-card-grid">
          <StatusMessage message={challengesError} tone="error" />
          <StatusMessage message={isChallengesLoading ? "Loading challenges..." : ""} />
          <StatusMessage message={!isChallengesLoading && activeChallenges.length === 0 ? "No active challenges yet." : ""} />
          {activeChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              progressValues={progressForms[challenge.id] ?? {}}
              isSubmittingProgress={submittingProgressId === challenge.id}
              isCompleting={completingChallengeId === challenge.id}
              onProgressSubmit={onProgressSubmit}
              onProgressChange={onProgressChange}
              onComplete={onComplete}
            />
          ))}
        </div>
      </div>
      <aside className="challenge-rail-stack">
        <div className="panel challenge-cta-panel">
          <h2>Feeling Ambitious?</h2>
          <p>Create a custom challenge and invite your teammates to compete.</p>
          <Link href="/challenges/new" className="sidebar-primary-link challenge-cta-link">
            Create New Challenge
          </Link>
        </div>
        <div className="panel challenge-rail">
          <div className="panel-header">
            <h2>Milestones</h2>
            <button type="button" className="ghost" onClick={onRefresh} disabled={refreshDisabled}>
              Refresh
            </button>
          </div>
          <div className="challenge-rail-metric">
            <div className="challenge-rail-icon challenge-rail-icon--blue">
              <Trophy size={16} />
            </div>
            <div>
              <span>Quests won</span>
              <strong>{completedChallenges.length}</strong>
            </div>
          </div>
          <div className="challenge-rail-metric">
            <div className="challenge-rail-icon challenge-rail-icon--amber">
              <Sword size={16} />
            </div>
            <div>
              <span>Total EXP Earned</span>
              <strong>{getRewardPool(activeChallenges)} XP</strong>
            </div>
          </div>
          <div className="challenge-rail-metric">
            <div className="challenge-rail-icon challenge-rail-icon--violet">
              <Flame size={16} />
            </div>
            <div>
              <span>Best streak</span>
              <strong>{getBestStreak(activeChallenges)} days</strong>
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
}
