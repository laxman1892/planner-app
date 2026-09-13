"use client";

import { useEffect, useMemo, useState } from "react";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import AchievementShelf from "@/components/achievements/AchievementShelf";
import NotificationPreferencesForm from "@/components/notifications/NotificationPreferencesForm";
import Topbar from "@/components/layout/Topbar";
import ProfileProgressPanel from "@/components/profile/ProfileProgressPanel";
import ProfileSummary from "@/components/profile/ProfileSummary";
import SquadPanel from "@/components/profile/SquadPanel";
import { getNotificationPreferences, getProgressSummary, updateNotificationPreferences } from "@/lib/api";

async function loadProfilePageData(dashboard, accessToken) {
  await dashboard.loadEvents(accessToken);
  await dashboard.loadInvitations(accessToken);
  await dashboard.loadChallenges(accessToken);
  await dashboard.loadAchievements(accessToken);
}

function ProfilePageContent({ auth, dashboard, tokens, notifications }) {
  const [preferences, setPreferences] = useState(null);
  const [preferencesError, setPreferencesError] = useState("");
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [progress, setProgress] = useState(null);
  const [progressError, setProgressError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfileSurface() {
      try {
        const [nextPreferences, nextProgress] = await Promise.all([
          getNotificationPreferences(tokens.access),
          getProgressSummary(tokens.access),
        ]);

        if (isMounted) {
          setPreferences(nextPreferences);
          setProgress(nextProgress);
        }
      } catch (error) {
        if (isMounted) {
          setPreferencesError(error.message);
          setProgressError(error.message);
        }
      }
    }

    void loadProfileSurface();

    return () => {
      isMounted = false;
    };
  }, [tokens.access]);

  async function handleTogglePreference(key, value) {
    setIsSavingPreferences(true);
    setPreferencesError("");

    try {
      const updated = await updateNotificationPreferences(tokens.access, { [key]: value });
      setPreferences(updated);
    } catch (error) {
      setPreferencesError(error.message);
    } finally {
      setIsSavingPreferences(false);
    }
  }

  const squadMembers = useMemo(() => {
    const seen = new Set();

    return dashboard.invitations.reduce((members, invitation) => {
      if (invitation.status !== "accepted") {
        return members;
      }

      const member =
        invitation.creator_detail.id === auth.user.id ? invitation.user_detail : invitation.creator_detail;

      if (!member || seen.has(member.id)) {
        return members;
      }

      seen.add(member.id);
      return [...members, member];
    }, []);
  }, [auth.user.id, dashboard.invitations]);

  return (
    <>
      <Topbar
        welcomeName={auth.welcomeName}
        onLogout={auth.handleLogout}
        notifications={notifications.notifications}
        onToggleNotifications={notifications.toggleNotificationCenter}
      />
      <section className="dashboard-hero dashboard-hero--profile">
        <h1>Profile</h1>
        <p>Track your level, allies, badges, and reminder preferences in one place.</p>
      </section>
      <div className="profile-overview-grid">
        <ProfileSummary
          user={auth.user}
          progress={progress}
        />
        <ProfileProgressPanel
          achievementsCount={dashboard.achievements.length}
          activeChallengesCount={dashboard.challenges.filter((challenge) => !challenge.is_completed).length}
          eventsCount={dashboard.events.length}
          progress={progress}
        />
      </div>
      {progressError ? <p className="form-error">{progressError}</p> : null}
      <div className="profile-layout">
        <AchievementShelf
          achievements={dashboard.achievements}
          achievementsError={dashboard.achievementsError}
          isAchievementsLoading={dashboard.isAchievementsLoading}
        />
        <SquadPanel members={squadMembers} />
      </div>
      <NotificationPreferencesForm
        preferences={preferences}
        preferencesError={preferencesError}
        isSaving={isSavingPreferences}
        onToggle={handleTogglePreference}
      />
    </>
  );
}

export default function ProfilePage() {
  return (
    <DashboardPageShell loadData={loadProfilePageData} showCreateEvent={false}>
      {(props) => <ProfilePageContent {...props} />}
    </DashboardPageShell>
  );
}
