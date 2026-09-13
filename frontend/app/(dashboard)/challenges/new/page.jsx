"use client";

import { useRouter } from "next/navigation";

import ChallengeCreateForm from "@/components/challenges/ChallengeCreateForm";
import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import Topbar from "@/components/layout/Topbar";

async function loadChallengeCreatePageData() {}

export default function NewChallengePage() {
  const router = useRouter();

  return (
    <DashboardPageShell loadData={loadChallengeCreatePageData} showCreateEvent={false}>
      {({ auth, dashboard, notifications }) => (
        <>
          <Topbar
            welcomeName={auth.welcomeName}
            onLogout={auth.handleLogout}
            notifications={notifications.notifications}
            onToggleNotifications={notifications.toggleNotificationCenter}
          />
          <ChallengeCreateForm
            challengeForm={dashboard.challengeForm}
            challengesError={dashboard.challengesError}
            isChallengeSubmitting={dashboard.isChallengeSubmitting}
            onChallengeChange={dashboard.updateChallenge}
            onChallengeSubmit={async (event) => {
              const createdChallenge = await dashboard.handleCreateChallenge(event);

              if (createdChallenge) {
                router.push("/challenges");
              }
            }}
          />
        </>
      )}
    </DashboardPageShell>
  );
}
