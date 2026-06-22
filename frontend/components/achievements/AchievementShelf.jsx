"use client";

import StatusMessage from "@/components/ui/StatusMessage";

export default function AchievementShelf({ achievements, achievementsError, isAchievementsLoading }) {
  return (
    <section className="achievement-strip" id="profile">
      <h2>Achievement shelf</h2>
      <div>
        <StatusMessage message={achievementsError} tone="error" />
        <StatusMessage message={isAchievementsLoading ? "Loading badges..." : ""} />
        {achievements.map((badge) => (
          <span key={badge.id}>{badge.badge_name}</span>
        ))}
        <StatusMessage
          message={!isAchievementsLoading && achievements.length === 0 ? "No badges earned yet." : ""}
        />
      </div>
    </section>
  );
}
