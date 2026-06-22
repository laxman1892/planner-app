"use client";

import { LogOut } from "lucide-react";

export default function Topbar({ welcomeName, onLogout }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Welcome back</p>
        <h1>{welcomeName}</h1>
      </div>
      <button
        type="button"
        className="icon-button"
        onClick={onLogout}
        aria-label="Log out"
      >
        <LogOut size={18} />
        <span>Log out</span>
      </button>
    </header>
  );
}
