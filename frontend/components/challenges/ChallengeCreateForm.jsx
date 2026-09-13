"use client";

function getRewardPreview(streakGoalDays) {
  const streakGoal = Number(streakGoalDays);

  if (!streakGoal) {
    return 100;
  }

  return Math.max(100, streakGoal * 10);
}

export default function ChallengeCreateForm({
  challengeForm,
  challengesError,
  isChallengeSubmitting,
  onChallengeChange,
  onChallengeSubmit,
}) {
  const rewardPreview = getRewardPreview(challengeForm.streak_goal_days);

  return (
    <section className="challenge-create-layout">
      <div className="panel challenge-create-panel">
        <div className="panel-header">
          <div>
            <h2>Create New Challenge</h2>
            <p className="muted-message">Define the parameters of your next legendary achievement.</p>
          </div>
        </div>
        <form className="challenge-create-form" onSubmit={onChallengeSubmit}>
          <label>
            Challenge title
            <input
              name="title"
              value={challengeForm.title}
              onChange={onChallengeChange}
              placeholder="e.g., 30 Days of Code Meditation"
              required
            />
          </label>
          <label>
            Lore & objectives (description)
            <textarea
              name="description"
              value={challengeForm.description}
              onChange={onChallengeChange}
              placeholder="Describe the journey and the ultimate reward..."
              rows={5}
              required
            />
          </label>
          <div className="challenge-create-grid">
            <label>
              Streak goal (days)
              <input
                name="streak_goal_days"
                type="number"
                min="1"
                value={challengeForm.streak_goal_days}
                onChange={onChallengeChange}
                placeholder="30"
              />
            </label>
            <label>
              Final deadline (optional)
              <input
                name="deadline"
                type="date"
                value={challengeForm.deadline}
                onChange={onChallengeChange}
              />
            </label>
          </div>
          <label>
            Category tags
            <input
              name="category_tags"
              value={challengeForm.category_tags}
              onChange={onChallengeChange}
              placeholder="health, learning, mindfulness"
            />
          </label>
          {challengesError ? <p className="form-error">{challengesError}</p> : null}
          <div className="challenge-create-actions">
            <button type="button" className="ghost">
              Discard Draft
            </button>
            <button type="submit" disabled={isChallengeSubmitting}>
              {isChallengeSubmitting ? "Manifesting..." : "Manifest Challenge"}
            </button>
          </div>
        </form>
      </div>
      <aside className="panel challenge-preview-panel">
        <h2>Preview Reward</h2>
        <div className="challenge-preview-reward">+{rewardPreview} XP</div>
        <p>Level up this quest line when you complete the full streak.</p>
      </aside>
    </section>
  );
}
