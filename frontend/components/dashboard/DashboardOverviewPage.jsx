"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import Topbar from "@/components/layout/Topbar";
import EventList from "@/components/events/EventList";
import ChallengeList from "@/components/challenges/ChallengeList";
import AchievementShelf from "@/components/achievements/AchievementShelf";
import ProfileSummary from "@/components/profile/ProfileSummary";

async function loadOverviewData(dashboard, accessToken) {
  await dashboard.loadDashboard(accessToken);
}

export default function DashboardOverviewPage() {
  return (
    <DashboardPageShell loadData={loadOverviewData}>
      {({ auth, dashboard, tokens }) => (
        <>
          <Topbar welcomeName={auth.welcomeName} onLogout={auth.handleLogout} />
          <ProfileSummary
            eventsCount={dashboard.events.length}
            activeChallengesCount={dashboard.challenges.filter((challenge) => !challenge.is_completed).length}
            achievementsCount={dashboard.achievements.length}
          />
          <div className="content-grid">
            <EventList
              events={dashboard.events}
              eventsError={dashboard.eventsError}
              isEventsLoading={dashboard.isEventsLoading}
              onRefresh={() => dashboard.loadEvents(tokens.access)}
              onEdit={dashboard.openEditEventModal}
              onDelete={dashboard.setEventPendingDelete}
              refreshDisabled={dashboard.isEventsLoading}
            />
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
          </div>
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
