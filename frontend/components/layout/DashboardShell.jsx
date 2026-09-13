"use client";

import { Pencil } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardShell({ children, overlays, onCreateEvent, showCreateEvent = false }) {
  return (
    <main className="app-shell">
      <Sidebar />

      <section className="workspace">
        {children}
      </section>

      {showCreateEvent ? (
        <button type="button" className="fab" onClick={onCreateEvent}>
          <Pencil size={21} />
          <span>New Quest</span>
        </button>
      ) : null}

      {overlays}
    </main>
  );
}
