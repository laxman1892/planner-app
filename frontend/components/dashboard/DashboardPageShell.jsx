"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import EventModal from "@/components/events/EventModal";
import DeleteEventDialog from "@/components/events/DeleteEventDialog";
import DashboardShell from "@/components/layout/DashboardShell";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import { useAuthenticatedUserSession } from "@/hooks/useAuthenticatedUserSession";
import { useAuthExperienceDashboard } from "@/hooks/useAuthExperienceDashboard";
import { listNotifications, markNotificationRead } from "@/lib/api";

export default function DashboardPageShell({ children, loadData, showCreateEvent = false }) {
  const router = useRouter();
  const auth = useAuthenticatedUserSession();
  const dashboard = useAuthExperienceDashboard({ accessToken: auth.tokens?.access });
  const dashboardRef = useRef(dashboard);
  const loadDataRef = useRef(loadData);
  const hasLoadedRef = useRef(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationsError, setNotificationsError] = useState("");
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const loadNotifications = useCallback(async (accessToken) => {
    setIsNotificationsLoading(true);
    setNotificationsError("");

    try {
      setNotifications(await listNotifications(accessToken));
    } catch (error) {
      setNotificationsError(error.message);
    } finally {
      setIsNotificationsLoading(false);
    }
  }, []);

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
    void loadNotifications(auth.tokens.access);
  }, [auth.isAuthenticated, auth.isBootstrapping, auth.tokens?.access, loadNotifications]);

  async function handleMarkNotificationRead(notificationId) {
    if (!auth.tokens?.access) {
      return;
    }

    try {
      const updatedNotification = await markNotificationRead(notificationId, auth.tokens.access);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === updatedNotification.id ? updatedNotification : notification,
        ),
      );
    } catch (error) {
      setNotificationsError(error.message);
    }
  }

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
          <NotificationCenter
            isOpen={isNotificationCenterOpen}
            notifications={notifications}
            notificationsError={notificationsError}
            isNotificationsLoading={isNotificationsLoading}
            onMarkRead={handleMarkNotificationRead}
          />
        </>
      }
    >
      {children({
        auth,
        dashboard,
        tokens: auth.tokens,
        notifications: {
          notifications,
          notificationsError,
          isNotificationsLoading,
          isNotificationCenterOpen,
          toggleNotificationCenter: () => setIsNotificationCenterOpen((current) => !current),
        },
      })}
    </DashboardShell>
  );
}
