"use client";

import ChallengeCard from "@/components/challenges/ChallengeCard";
import StatusMessage from "@/components/ui/StatusMessage";

export default function ChallengeList({
  challengeForm,
  challenges,
  challengesError,
  isChallengesLoading,
  isChallengeSubmitting,
  submittingProgressId,
  completingChallengeId,
  progressForms,
  onRefresh,
  onChallengeSubmit,
  onChallengeChange,
  onProgressSubmit,
  onProgressChange,
  onComplete,
  refreshDisabled,
}) {
  return (
    <section className="panel" id="challenges">
      <div className="panel-header">
        <h2>Challenges</h2>
        <button
          type="button"
          className="ghost"
          onClick={onRefresh}
          disabled={refreshDisabled}
        >
          Refresh
        </button>
      </div>
      <form className="challenge-form" onSubmit={onChallengeSubmit}>
        <label>
          Title
          <input
            name="title"
            value={challengeForm.title}
            onChange={onChallengeChange}
            required
          />
        </label>
        <label>
          Deadline
          <input
            name="deadline"
            type="date"
            value={challengeForm.deadline}
            onChange={onChallengeChange}
          />
        </label>
        <label>
          Description
          <textarea
            name="description"
            value={challengeForm.description}
            onChange={onChallengeChange}
            rows={3}
            required
          />
        </label>
        <button type="submit" disabled={isChallengeSubmitting}>
          {isChallengeSubmitting ? "Creating..." : "Create challenge"}
        </button>
      </form>
      <div className="item-list">
        <StatusMessage message={challengesError} tone="error" />
        <StatusMessage message={isChallengesLoading ? "Loading challenges..." : ""} />
        <StatusMessage message={!isChallengesLoading && challenges.length === 0 ? "No challenges yet." : ""} />
        {challenges.map((challenge) => (
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
    </section>
  );
}
