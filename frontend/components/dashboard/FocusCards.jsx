"use client";

import Link from "next/link";
import { formatChallengeDeadline, formatEventTime } from "@/lib/formatters";

function getTodayKey() {
  return new Date().toDateString();
}

function getFocusItems(events, challenges) {
  const todayKey = getTodayKey();
  const eventItems = events
    .filter((event) => !event.is_completed)
    .map((event) => ({
      id: `event-${event.id}`,
      badge: event.quest_mode === "group" ? "Group quest" : "Solo quest",
      description: event.description,
      meta: formatEventTime(event.starts_at),
      sortAt: new Date(event.starts_at).getTime(),
      title: event.title,
      tone: event.quest_mode === "group" ? "violet" : "blue",
      xp: event.quest_mode === "group" ? "+150 XP" : "+100 XP",
      isToday: new Date(event.starts_at).toDateString() === todayKey,
    }))
    .sort((left, right) => left.sortAt - right.sortAt);

  const challengeItems = challenges
    .filter((challenge) => !challenge.is_completed)
    .map((challenge) => ({
      id: `challenge-${challenge.id}`,
      badge: "Challenge",
      description: challenge.description,
      meta: formatChallengeDeadline(challenge.deadline),
      title: challenge.title,
      tone: "gold",
      xp: "+250 XP",
      isToday: false,
    }));

  return [...eventItems, ...challengeItems]
    .sort((left, right) => {
      if (left.isToday !== right.isToday) {
        return left.isToday ? -1 : 1;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, 4);
}

function getDeadlines(events, challenges) {
  const nextEvents = events
    .filter((event) => !event.is_completed)
    .map((event) => ({
      id: `event-${event.id}`,
      dateLabel: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(new Date(event.starts_at)),
      subtitle: "Event quest",
      sortAt: new Date(event.starts_at).getTime(),
      title: event.title,
    }));

  const nextChallenges = challenges
    .filter((challenge) => !challenge.is_completed && challenge.deadline)
    .map((challenge) => {
      const [year, month, day] = challenge.deadline.split("-").map(Number);
      const deadline = new Date(year, month - 1, day);

      return {
        id: `challenge-${challenge.id}`,
        dateLabel: new Intl.DateTimeFormat("en", { month: "short", day: "2-digit" }).format(deadline),
        subtitle: "Challenge deadline",
        sortAt: deadline.getTime(),
        title: challenge.title,
      };
    });

  return [...nextEvents, ...nextChallenges]
    .sort((left, right) => left.sortAt - right.sortAt)
    .slice(0, 4);
}

export default function FocusCards({ events, challenges }) {
  const focusItems = getFocusItems(events, challenges);
  const deadlines = getDeadlines(events, challenges);

  return (
    <section className="dashboard-focus-layout">
      <div className="panel">
        <div className="panel-header">
          <h2>Today&apos;s focus</h2>
          <Link href="/events" className="dashboard-panel-link">
            View All Tasks
          </Link>
        </div>
        <div className="dashboard-focus-grid">
          {focusItems.length === 0 ? (
            <p className="dashboard-empty-copy">No active quests yet. Create one from the planner or challenge hub.</p>
          ) : (
            focusItems.map((item) => (
              <article key={item.id} className={`dashboard-focus-card dashboard-focus-card--${item.tone}`}>
                <div className="dashboard-focus-card-header">
                  <span>{item.badge}</span>
                  <small>{item.isToday ? "Active" : "Optional"}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="dashboard-focus-meta">
                  <small>{item.meta}</small>
                  <strong>{item.xp}</strong>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
      <aside className="panel dashboard-deadlines-panel">
        <div className="panel-header">
          <h2>Upcoming deadlines</h2>
        </div>
        <div className="dashboard-deadline-list">
          {deadlines.length === 0 ? (
            <p className="dashboard-empty-copy">Nothing urgent right now.</p>
          ) : (
            deadlines.map((item) => (
              <article key={item.id} className="dashboard-deadline-item">
                <div className="dashboard-deadline-date">
                  <span>{item.dateLabel.split(" ")[0]}</span>
                  <strong>{item.dateLabel.split(" ")[1]}</strong>
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </article>
            ))
          )}
        </div>
      </aside>
    </section>
  );
}
