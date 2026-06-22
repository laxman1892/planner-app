"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import ChallengeList from "@/components/challenges/ChallengeList";
import Topbar from "@/components/layout/Topbar";

async function loadChallengesPageData(dashboard, accessToken) {
  await dashboard.loadChallenges(accessToken);
}

export default function ChallengesPage() {
  return (
    <DashboardPageShell loadData={loadChallengesPageData} showCreateEvent={false}>
      {({ auth, dashboard, tokens }) => (
        <>
          <Topbar welcomeName={auth.welcomeName} onLogout={auth.handleLogout} />
          <ChallengeList
            challengeForm={dashboard.challengeForm}
            challenges={dashboard.challenges}
            challengesError={dashboard.challengesError}
            isChallengesLoading={dashboard.isChallengesLoading}
            isChallengeSubmitting={dashboard.isChallengeSubmitting}
            submittingProgressId={dashboard.submittingProgressId}
            completingChallengeId={dashboard.completingChallengeId}
            progressForms={dashboard.progressForms}
            onRefresh={() => dashboard.loadChallenges(tokens.access)}
            onChallengeSubmit={dashboard.handleCreateChallenge}
            onChallengeChange={dashboard.updateChallenge}
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
