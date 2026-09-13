"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import DashboardStats from "@/components/dashboard/DashboardStats";
import FocusCards from "@/components/dashboard/FocusCards";
import Topbar from "@/components/layout/Topbar";
import AchievementShelf from "@/components/achievements/AchievementShelf";

async function loadOverviewData(dashboard, accessToken) {
  await dashboard.loadDashboard(accessToken);
}

export default function DashboardOverviewPage() {
  return (
    <DashboardPageShell loadData={loadOverviewData}>
      {({ auth, dashboard, tokens, notifications }) => (
        <>
          <Topbar
            welcomeName={auth.welcomeName}
            onLogout={auth.handleLogout}
            notifications={notifications.notifications}
            onToggleNotifications={notifications.toggleNotificationCenter}
          />
          <section className="dashboard-hero">
            <h1>Commander&apos;s Dashboard</h1>
            <p>Welcome back, {auth.welcomeName}. You have active quests, streak goals, and upcoming deadlines to keep moving.</p>
          </section>
          <DashboardStats
            accessToken={tokens.access}
            events={dashboard.events}
            challenges={dashboard.challenges}
          />
          <FocusCards events={dashboard.events} challenges={dashboard.challenges} />
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
