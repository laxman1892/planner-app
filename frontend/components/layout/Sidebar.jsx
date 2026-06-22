"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays } from "lucide-react";

import { dashboardNavigationItems, getActiveDashboardHref } from "@/components/layout/sidebar-navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const activeHref = getActiveDashboardHref(pathname);

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand">
        <CalendarDays size={26} />
        <span>PlanQuest</span>
      </div>
      <nav>
        {dashboardNavigationItems.map((item) => (
          <Link key={item.href} href={item.href} className={activeHref === item.href ? "active" : ""}>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
