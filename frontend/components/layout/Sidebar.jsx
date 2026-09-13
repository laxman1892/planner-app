"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CalendarDays, LayoutDashboard, Settings, Sword, User, Plus } from "lucide-react";

import { dashboardNavigationItems, getActiveDashboardHref } from "@/components/layout/sidebar-navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveDashboardHref(pathname);
  const iconsByHref = {
    "/dashboard": LayoutDashboard,
    "/events": CalendarDays,
    "/challenges": Sword,
    "/profile": User,
  };

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="sidebar-brand-block">
        <div className="brand">
          <div className="sidebar-brand-mark">
            <CalendarDays size={18} />
          </div>
          <div>
            <span>PlanQuest</span>
            <small>Level 24 Adventurer</small>
          </div>
        </div>
      </div>
      <nav className="sidebar-main-nav">
        {dashboardNavigationItems.map((item) => (
          <Link key={item.href} href={item.href} className={activeHref === item.href ? "active" : ""}>
            {(() => {
              const Icon = iconsByHref[item.href];

              return (
                <>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </>
              );
            })()}
          </Link>
        ))}
      </nav>

      <div className="sidebar-cta">
        <Link href="/events" className="sidebar-primary-link">
          <Plus size={18} />
          <span>New Quest</span>
        </Link>
      </div>

      <div className="sidebar-footer-nav">
        <Link href="/profile">
          <Bell size={18} />
          <span>Notifications</span>
        </Link>
        <Link href="/profile">
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
