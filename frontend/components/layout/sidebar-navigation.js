export const dashboardNavigationItems = [
  { href: "/dashboard", label: "Dashboard", section: "dashboard" },
  { href: "/events", label: "Events", section: "events" },
  { href: "/challenges", label: "Challenges", section: "challenges" },
  { href: "/profile", label: "Profile", section: "profile" },
];

export function getDashboardHrefBySection(section) {
  const matchedItem = dashboardNavigationItems.find((item) => item.section === section);

  return matchedItem?.href ?? "/dashboard";
}

export function getActiveDashboardHref(pathname) {
  const activeItem = dashboardNavigationItems.find((item) => item.href === pathname);

  return activeItem?.href ?? "/dashboard";
}

export function isDashboardSection(value) {
  return dashboardNavigationItems.some((item) => item.section === value);
}
