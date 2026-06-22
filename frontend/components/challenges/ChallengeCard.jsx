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
        <span>{challenge.progress_logs?.length ?? 0} logs</span>
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
