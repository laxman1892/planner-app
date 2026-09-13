"use client";

export default function ProfileSummary({
  user,
  progress,
}) {
  const level = progress?.level ?? 1;
  const totalXp = progress?.total_xp ?? 0;
  const nextLevelXp = progress?.next_level_xp ?? 100;
  const progressPercent = Math.min(100, Math.round((totalXp / nextLevelXp) * 100));
  const name = user?.full_name || user?.username || user?.email;

  return (
    <section className="panel profile-summary-card" aria-label="Identity">
      <div className="profile-summary-main">
        <div className="profile-avatar">{(user?.full_name || user?.username || "P").slice(0, 1).toUpperCase()}</div>
        <div>
          <p className="profile-kicker">ADVENTURER</p>
          <h2>{name}</h2>
          <p className="muted-message">{user?.username ? `@${user.username}` : user?.email}</p>
          <div className="profile-progress-hero">
            <div className="profile-progress-hero-copy">
              <strong>LEVEL {level}</strong>
              <span>{totalXp} / {nextLevelXp} XP</span>
            </div>
            <div className="profile-progress-track" aria-hidden="true">
              <span style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
