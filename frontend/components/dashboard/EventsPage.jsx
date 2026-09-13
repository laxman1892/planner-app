"use client";

import DashboardPageShell from "@/components/dashboard/DashboardPageShell";
import EventList from "@/components/events/EventList";
import InvitationList from "@/components/events/InvitationList";
import Topbar from "@/components/layout/Topbar";
import { formatEventTime } from "@/lib/formatters";
import { getCreatorInvitationsByEvent } from "@/lib/invitations";

async function loadEventsPageData(dashboard, accessToken) {
  await dashboard.loadEvents(accessToken);
  await dashboard.loadInvitations(accessToken);
}

function getCalendarDays(events) {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const startWeekday = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(monthStart);
  gridStart.setDate(monthStart.getDate() - startWeekday);

  return Array.from({ length: 35 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    const key = day.toISOString().slice(0, 10);
    const dayEvents = events.filter((event) => event.starts_at.slice(0, 10) === key);

    return {
      key,
      label: day.getDate(),
      isCurrentMonth: day.getMonth() === today.getMonth(),
      isToday: key === today.toISOString().slice(0, 10),
      dayEvents,
    };
  });
}

export default function EventsPage() {
  return (
    <DashboardPageShell loadData={loadEventsPageData} showCreateEvent={false}>
      {({ auth, dashboard, tokens, notifications }) => {
        const creatorInvitationsByEvent = getCreatorInvitationsByEvent(
          dashboard.invitations,
          auth.user.id,
        );
        const calendarDays = getCalendarDays(dashboard.events);

        return (
          <>
            <Topbar
              welcomeName={auth.welcomeName}
              onLogout={auth.handleLogout}
              notifications={notifications.notifications}
              onToggleNotifications={notifications.toggleNotificationCenter}
            />
            <section className="planner-page">
              <div className="planner-main">
                <header className="planner-header">
                  <div>
                    <h1>Quest Planner</h1>
                    <p>Strategize your upcoming raids and personal training sessions.</p>
                  </div>
                  <div className="planner-view-toggle">
                    <button type="button" className="active">Calendar</button>
                    <button type="button">List View</button>
                  </div>
                </header>
                <section className="planner-calendar panel">
                  <div className="planner-calendar-head">
                    <h2>
                      {new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date())}
                    </h2>
                    <div className="planner-calendar-arrows">
                      <button type="button">‹</button>
                      <button type="button">›</button>
                    </div>
                  </div>
                  <div className="planner-calendar-grid">
                    {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
                      <span key={day} className="planner-calendar-weekday">{day}</span>
                    ))}
                    {calendarDays.map((day) => (
                      <article
                        key={day.key}
                        className={[
                          "planner-calendar-cell",
                          day.isCurrentMonth ? "" : "is-muted",
                          day.isToday ? "is-today" : "",
                        ].join(" ").trim()}
                      >
                        <strong>{day.label}</strong>
                        <div className="planner-calendar-bars">
                          {day.dayEvents.slice(0, 2).map((event) => (
                            <span
                              key={event.id}
                              className={event.quest_mode === "group" ? "is-group" : "is-solo"}
                            />
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                <InvitationList
                  invitations={dashboard.invitations}
                  invitationsError={dashboard.invitationsError}
                  isInvitationsLoading={dashboard.isInvitationsLoading}
                  onRefresh={() => dashboard.loadInvitations(tokens.access)}
                  onRespond={dashboard.handleInvitationResponse}
                  refreshDisabled={dashboard.isInvitationsLoading || Boolean(dashboard.updatingInvitationId)}
                  updatingInvitationId={dashboard.updatingInvitationId}
                />

                <section className="planner-event-preview-grid">
                  {dashboard.events.slice(0, 2).map((event) => (
                    <article key={event.id} className="planner-preview-card panel">
                      <div className="planner-preview-card-header">
                        <span className="planner-pill">{event.quest_mode === "group" ? "GROUP RAID" : "SOLO QUEST"}</span>
                        <span className={event.is_completed ? "planner-status is-complete" : "planner-status"}>{event.is_completed ? "COMPLETE" : "ACTIVE"}</span>
                      </div>
                      <h3>{event.title}</h3>
                      <p>{formatEventTime(event.starts_at)}</p>
                      <p>{event.description}</p>
                    </article>
                  ))}
                </section>

                <EventList
                  events={dashboard.events}
                  creatorInvitationsByEvent={creatorInvitationsByEvent}
                  currentUserId={auth.user.id}
                  eventsError={dashboard.eventsError}
                  inviteForms={dashboard.inviteForms}
                  isEventsLoading={dashboard.isEventsLoading}
                  onRefresh={() => dashboard.loadEvents(tokens.access)}
                  onCreateInvitation={dashboard.handleCreateInvitation}
                  onEdit={dashboard.openEditEventModal}
                  onDelete={dashboard.setEventPendingDelete}
                  onInviteIdentifierChange={dashboard.updateInviteIdentifier}
                  refreshDisabled={dashboard.isEventsLoading}
                  submittingInviteEventId={dashboard.submittingInviteEventId}
                />
              </div>

              <aside className="planner-side panel">
                <div className="planner-side-title">
                  <div className="planner-side-icon">+</div>
                  <h2>New Event Quest</h2>
                </div>
                <form className="planner-side-form" onSubmit={dashboard.handleSubmitEvent}>
                  <label>
                    Quest Title
                    <input
                      name="title"
                      value={dashboard.eventForm.title}
                      onChange={dashboard.updateEvent}
                      placeholder="What's the objective?"
                      required
                    />
                  </label>
                  <div className="planner-side-grid">
                    <label>
                      Date
                      <input
                        name="starts_at"
                        type="datetime-local"
                        value={dashboard.eventForm.starts_at}
                        onChange={dashboard.updateEvent}
                        required
                      />
                    </label>
                    <label>
                      Category
                      <input
                        name="category"
                        value={dashboard.eventForm.category}
                        onChange={dashboard.updateEvent}
                        placeholder="personal"
                        required
                      />
                    </label>
                  </div>
                  <div className="planner-mode-toggle">
                    <button
                      type="button"
                      className={dashboard.eventForm.quest_mode === "solo" ? "active" : ""}
                      onClick={() => dashboard.updateEvent({ target: { name: "quest_mode", value: "solo", type: "text" } })}
                    >
                      Solo
                    </button>
                    <button
                      type="button"
                      className={dashboard.eventForm.quest_mode === "group" ? "active" : ""}
                      onClick={() => dashboard.updateEvent({ target: { name: "quest_mode", value: "group", type: "text" } })}
                    >
                      Group
                    </button>
                  </div>
                  <label>
                    Description
                    <textarea
                      name="description"
                      value={dashboard.eventForm.description}
                      onChange={dashboard.updateEvent}
                      rows={4}
                      placeholder="Describe the quest"
                      required
                    />
                  </label>
                  <button type="submit" className="planner-submit" disabled={dashboard.isEventSubmitting}>
                    {dashboard.isEventSubmitting ? "Creating..." : "Create Quest"}
                  </button>
                </form>
              </aside>
            </section>
          </>
        );
      }}
    </DashboardPageShell>
  );
}
