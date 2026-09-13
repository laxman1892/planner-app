"use client";

import { formatChallengeDeadline } from "@/lib/formatters";
import ProgressForm from "@/components/challenges/ProgressForm";

export default function ChallengeCard({
  challenge,
  progressValues,
  isSubmittingProgress,
  isCompleting,
  onProgressSubmit,
  onProgressChange,
  onComplete,
}) {
  return (
    <article className="challenge-item">
      <div>
        <h3>{challenge.title}</h3>
        <p>{challenge.description}</p>
        <p>{formatChallengeDeadline(challenge.deadline)}</p>
      </div>
      <div className="challenge-meta">
        <span>{challenge.is_completed ? "Complete" : "Active"}</span>
        {challenge.streak_goal_days ? <span>{challenge.streak_goal_days} day goal</span> : null}
        {challenge.reward_preview_xp ? <span>+{challenge.reward_preview_xp} XP</span> : null}
        <span>{challenge.progress_logs?.length ?? 0} logs</span>
        {(challenge.category_tags ?? []).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      {!challenge.is_completed && (
        <ProgressForm
          challengeId={challenge.id}
          values={progressValues}
          isSubmitting={isSubmittingProgress}
          isCompleting={isCompleting}
          onSubmit={onProgressSubmit}
          onChange={onProgressChange}
          onComplete={onComplete}
        />
      )}
    </article>
  );
}
