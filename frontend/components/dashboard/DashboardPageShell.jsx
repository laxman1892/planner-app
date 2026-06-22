"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import EventModal from "@/components/events/EventModal";
import DeleteEventDialog from "@/components/events/DeleteEventDialog";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuthenticatedUserSession } from "@/hooks/useAuthenticatedUserSession";
import { useAuthExperienceDashboard } from "@/hooks/useAuthExperienceDashboard";

export default function DashboardPageShell({ children, loadData, showCreateEvent = true }) {
  const router = useRouter();
  const auth = useAuthenticatedUserSession();
  const dashboard = useAuthExperienceDashboard({ accessToken: auth.tokens?.access });
  const dashboardRef = useRef(dashboard);
  const loadDataRef = useRef(loadData);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    dashboardRef.current = dashboard;
    loadDataRef.current = loadData;
  }, [dashboard, loadData]);

  useEffect(() => {
    if (auth.isBootstrapping || auth.isAuthenticated) {
      return;
    }

    router.replace("/login");
  }, [auth.isAuthenticated, auth.isBootstrapping, router]);

  useEffect(() => {
    if (auth.isBootstrapping || !auth.isAuthenticated || !auth.tokens?.access) {
      hasLoadedRef.current = false;
      return;
    }

    if (hasLoadedRef.current) {
      return;
    }

    hasLoadedRef.current = true;
    void loadDataRef.current(dashboardRef.current, auth.tokens.access);
  }, [auth.isAuthenticated, auth.isBootstrapping, auth.tokens?.access]);

  if (auth.isBootstrapping || !auth.isAuthenticated) {
    return null;
  }

  return (
    <DashboardShell
      onCreateEvent={dashboard.openCreateEventModal}
      showCreateEvent={showCreateEvent}
      overlays={
        <>
          <EventModal
            isOpen={dashboard.isEventModalOpen}
            editingEventId={dashboard.editingEventId}
            eventForm={dashboard.eventForm}
            eventsError={dashboard.eventsError}
            isEventSubmitting={dashboard.isEventSubmitting}
            onClose={dashboard.closeEventModal}
            onSubmit={dashboard.handleSubmitEvent}
            onChange={dashboard.updateEvent}
          />
          <DeleteEventDialog
            event={dashboard.eventPendingDelete}
            onCancel={() => dashboard.setEventPendingDelete(null)}
            onConfirm={dashboard.handleDeleteEvent}
          />
        </>
      }
    >
      {children({ auth, dashboard, tokens: auth.tokens })}
    </DashboardShell>
  );
}
