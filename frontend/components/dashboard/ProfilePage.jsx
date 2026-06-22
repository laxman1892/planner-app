"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import AchievementShelf from "@/components/achievements/AchievementShelf";
import Topbar from "@/components/layout/Topbar";
import ProfileSummary from "@/components/profile/ProfileSummary";

async function loadProfilePageData(dashboard, accessToken) {
  await dashboard.loadEvents(accessToken);
  await dashboard.loadChallenges(accessToken);
  await dashboard.loadAchievements(accessToken);
}

export default function ProfilePage() {
  return (
    <DashboardPageShell loadData={loadProfilePageData} showCreateEvent={false}>
      {({ auth, dashboard }) => (
        <>
          <Topbar welcomeName={auth.welcomeName} onLogout={auth.handleLogout} />
          <ProfileSummary
            eventsCount={dashboard.events.length}
            activeChallengesCount={dashboard.challenges.filter((challenge) => !challenge.is_completed).length}
            achievementsCount={dashboard.achievements.length}
          />
          <AchievementShelf
            achievements={dashboard.achievements}
            achievementsError={dashboard.achievementsError}
            isAchievementsLoading={dashboard.isAchievementsLoading}
          />
        </>
      )}
    </DashboardPageShell>
  );
}
