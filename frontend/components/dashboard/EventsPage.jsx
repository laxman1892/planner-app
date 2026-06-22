"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import EventList from "@/components/events/EventList";
import Topbar from "@/components/layout/Topbar";

async function loadEventsPageData(dashboard, accessToken) {
  await dashboard.loadEvents(accessToken);
}

export default function EventsPage() {
  return (
    <DashboardPageShell loadData={loadEventsPageData}>
      {({ auth, dashboard, tokens }) => (
        <>
          <Topbar welcomeName={auth.welcomeName} onLogout={auth.handleLogout} />
          <EventList
            events={dashboard.events}
            eventsError={dashboard.eventsError}
            isEventsLoading={dashboard.isEventsLoading}
            onRefresh={() => dashboard.loadEvents(tokens.access)}
            onEdit={dashboard.openEditEventModal}
            onDelete={dashboard.setEventPendingDelete}
            refreshDisabled={dashboard.isEventsLoading}
          />
        </>
      )}
    </DashboardPageShell>
  );
}
