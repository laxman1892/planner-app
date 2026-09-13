"use client";

export default function ProfileProgressPanel({
  achievementsCount,
  activeChallengesCount,
  eventsCount,
  progress,
}) {
  const totalXp = progress?.total_xp ?? 0;
  const level = progress?.level ?? 1;
  const nextLevelXp = progress?.next_level_xp ?? 100;
  const progressPercent = Math.min(100, Math.round((totalXp / nextLevelXp) * 100));

  return (
    <section className="profile-progress-panel">
      <article className="panel profile-metric-card">
        <strong>{level}</strong>
        <span>Level</span>
      </article>
      <article className="panel profile-metric-card">
        <strong>{eventsCount}</strong>
        <span>Event Quests</span>
      </article>
      <article className="panel profile-metric-card">
        <strong>{activeChallengesCount}</strong>
        <span>Active Challenges</span>
      </article>
      <article className="panel profile-metric-card">
        <strong>{achievementsCount}</strong>
        <span>Badges</span>
      </article>
      <article className="panel profile-metric-card profile-metric-card--wide">
        <strong>{totalXp} / {nextLevelXp} XP</strong>
        <span>Current Progress</span>
        <div className="profile-progress-track" aria-hidden="true">
          <span style={{ width: `${progressPercent}%` }} />
        </div>
      </article>
    </section>
  );
}
