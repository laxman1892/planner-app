"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import ChallengeHub from "@/components/challenges/ChallengeHub";
import Topbar from "@/components/layout/Topbar";

async function loadChallengesPageData(dashboard, accessToken) {
  await dashboard.loadChallenges(accessToken);
}

export default function ChallengesPage() {
  return (
    <DashboardPageShell loadData={loadChallengesPageData} showCreateEvent={false}>
      {({ auth, dashboard, tokens, notifications }) => (
        <>
          <Topbar
            welcomeName={auth.welcomeName}
            onLogout={auth.handleLogout}
            notifications={notifications.notifications}
            onToggleNotifications={notifications.toggleNotificationCenter}
          />
          <section className="dashboard-hero dashboard-hero--challenges">
            <p className="dashboard-hero-kicker">Adventure awaits</p>
            <h1>Challenge Hub</h1>
            <p>Track active challenges, log activity, and push your next streak milestone.</p>
          </section>
          <ChallengeHub
            challenges={dashboard.challenges}
            challengesError={dashboard.challengesError}
            isChallengesLoading={dashboard.isChallengesLoading}
            submittingProgressId={dashboard.submittingProgressId}
            completingChallengeId={dashboard.completingChallengeId}
            progressForms={dashboard.progressForms}
            onRefresh={() => dashboard.loadChallenges(tokens.access)}
            onProgressSubmit={dashboard.handleLogProgress}
            onProgressChange={dashboard.updateProgress}
            onComplete={dashboard.handleCompleteChallenge}
            refreshDisabled={dashboard.isChallengesLoading}
          />
        </>
      )}
    </DashboardPageShell>
  );
}
