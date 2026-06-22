"use client";

import { CalendarDays, CheckCircle2, Medal } from "lucide-react";

export default function ProfileSummary({
  eventsCount,
  activeChallengesCount,
  achievementsCount,
}) {
  return (
    <section className="stats-grid" aria-label="Overview">
      <article>
        <CalendarDays />
        <strong>{eventsCount}</strong>
        <span>Upcoming events</span>
      </article>
      <article>
        <CheckCircle2 />
        <strong>{activeChallengesCount}</strong>
        <span>Active challenges</span>
      </article>
      <article>
        <Medal />
        <strong>{achievementsCount}</strong>
        <span>Badges earned</span>
      </article>
    </section>
  );
}
